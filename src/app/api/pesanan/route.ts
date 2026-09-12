import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Pesanan from '@/models/Pesanan';
import { checkRateLimit, sanitizeString, isValidPhoneNumber } from '@/lib/security';

import { getMemoryPesanan, addMemoryPesanan } from '@/lib/memoryStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    try {
      await connectToDatabase();
      const query: Record<string, unknown> = {};
      if (status && status !== 'semua') {
        query.status = sanitizeString(status);
      }
      const pesananList = await Pesanan.find(query).sort({ createdAt: -1 });
      return NextResponse.json({
        success: true,
        count: pesananList.length,
        data: pesananList,
      });
    } catch {
      const list = getMemoryPesanan(status);
      return NextResponse.json({
        success: true,
        count: list.length,
        data: list,
      });
    }
  } catch (error) {
    console.error('Error fetching pesanan:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data pesanan',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous-ip';
    const rateCheck = checkRateLimit(`order_${ip}`, 20, 10 * 60 * 1000);
    if (!rateCheck.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Terlalu banyak permintaan pemesanan. Silakan tunggu beberapa saat lagi.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { nama, noHP, menu, catatan, totalHarga } = body;

    if (!nama || !noHP || !menu || !Array.isArray(menu) || menu.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Data pesanan tidak lengkap (nama, noHP, dan minimal 1 menu wajib diisi)',
        },
        { status: 400 }
      );
    }

    const sanitizedNama = sanitizeString(nama);
    const sanitizedNoHP = sanitizeString(noHP);
    const sanitizedCatatan = sanitizeString(catatan || '');

    if (!sanitizedNama || sanitizedNama.length < 2) {
      return NextResponse.json(
        { success: false, message: 'Nama pemesan tidak valid (minimal 2 karakter)' },
        { status: 400 }
      );
    }

    if (!isValidPhoneNumber(sanitizedNoHP)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Nomor WhatsApp / HP tidak valid. Pastikan format nomor benar (cth: 08123456789).',
        },
        { status: 400 }
      );
    }

    const sanitizedMenu = menu.slice(0, 50).map((item: { nama?: string; harga?: number; jumlah?: number }) => ({
      nama: sanitizeString(item.nama || 'Item'),
      harga: Math.max(0, Number(item.harga) || 0),
      jumlah: Math.max(1, Math.min(100, Number(item.jumlah) || 1)),
    }));

    const calculatedTotal = sanitizedMenu.reduce(
      (acc: number, item: { harga: number; jumlah: number }) =>
        acc + (item.harga * item.jumlah),
      0
    );

    const pesananData = {
      nama: sanitizedNama,
      noHP: sanitizedNoHP,
      menu: sanitizedMenu,
      totalHarga: totalHarga ? Number(totalHarga) : calculatedTotal,
      catatan: sanitizedCatatan,
      status: 'pending' as const,
      createdAt: new Date(),
    };

    try {
      await connectToDatabase();
      const newPesanan = await Pesanan.create(pesananData);
      return NextResponse.json(
        {
          success: true,
          message: 'Pesanan berhasil dibuat.',
          data: newPesanan,
        },
        { status: 201 }
      );
    } catch {
      const mockPesanan = addMemoryPesanan(pesananData);
      return NextResponse.json(
        {
          success: true,
          message: 'Pesanan berhasil dibuat (Mode Simpan Lokal).',
          data: mockPesanan,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Error creating pesanan:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal membuat pesanan',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
