import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Pesanan from '@/models/Pesanan';
import { checkRateLimit, sanitizeString, isValidPhoneNumber } from '@/lib/security';
import { getMemoryPesanan } from '@/lib/memoryStore';

export const dynamic = 'force-dynamic';

// GET /api/pesanan/status?noHP=08xxx — Cek status pesanan by nomor HP (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawNoHP = searchParams.get('noHP');

    if (!rawNoHP) {
      return NextResponse.json(
        { success: false, message: 'Parameter noHP wajib diisi' },
        { status: 400 }
      );
    }

    // Rate limit: 30 cek per 10 menit per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anon';
    const rateCheck = checkRateLimit(`status_check_${ip}`, 30, 10 * 60 * 1000);
    if (!rateCheck.isAllowed) {
      return NextResponse.json(
        { success: false, message: 'Terlalu banyak permintaan. Silakan tunggu beberapa saat.' },
        { status: 429 }
      );
    }

    const noHP = sanitizeString(rawNoHP);

    if (!isValidPhoneNumber(noHP)) {
      return NextResponse.json(
        { success: false, message: 'Format nomor HP tidak valid.' },
        { status: 400 }
      );
    }

    // Normalisasi: handle 08xxx dan 628xxx
    const normalizedNoHP = noHP.replace(/^(\+?62|0)/, '');

    try {
      await connectToDatabase();

      // Cari pesanan yang nomor HP-nya cocok (fleksibel)
      const pesananList = await Pesanan.find({
        $or: [
          { noHP: { $regex: normalizedNoHP, $options: 'i' } },
          { noHP: `0${normalizedNoHP}` },
          { noHP: `62${normalizedNoHP}` },
          { noHP: `+62${normalizedNoHP}` },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('_id nama noHP menu totalHarga catatan status createdAt updatedAt');

      return NextResponse.json({
        success: true,
        count: pesananList.length,
        data: pesananList,
      });
    } catch {
      // Fallback ke memory store
      const allPesanan = getMemoryPesanan(null);
      const filtered = allPesanan.filter((p) => {
        const clean = p.noHP.replace(/^(\+?62|0)/, '');
        return clean === normalizedNoHP;
      });

      return NextResponse.json({
        success: true,
        count: filtered.length,
        data: filtered.slice(0, 10),
      });
    }
  } catch (error) {
    console.error('Error cek status pesanan:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil status pesanan' },
      { status: 500 }
    );
  }
}
