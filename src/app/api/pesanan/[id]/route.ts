import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Pesanan from '@/models/Pesanan';
import {
  getMemoryPesananById,
  updateMemoryPesanan,
  deleteMemoryPesanan,
} from '@/lib/memoryStore';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/pesanan/[id] -> Detail pesanan
export async function GET(request: NextRequest, { params }: Params) {
  try {
    try {
      await connectToDatabase();
      const pesanan = await Pesanan.findById(params.id);
      if (pesanan) {
        return NextResponse.json({ success: true, data: pesanan });
      }
    } catch {
      // Fallback to in-memory store
    }

    const localPesanan = getMemoryPesananById(params.id);
    if (!localPesanan) {
      return NextResponse.json(
        { success: false, message: 'Pesanan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: localPesanan,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil detail pesanan',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/pesanan/[id] -> Update status pesanan
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak: Anda harus login sebagai admin' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ['pending', 'diproses', 'selesai', 'dibatalkan'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Status tidak valid. Harus salah satu dari: ${validStatuses.join(', ')}`,
        },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const updatedPesanan = await Pesanan.findByIdAndUpdate(
        params.id,
        { status },
        { new: true }
      );

      if (updatedPesanan) {
        return NextResponse.json({
          success: true,
          message: `Status pesanan berhasil diubah menjadi "${status}"`,
          data: updatedPesanan,
        });
      }
    } catch {
      // Fallback to in-memory store
    }

    const localUpdated = updateMemoryPesanan(params.id, { status });
    if (!localUpdated) {
      return NextResponse.json(
        { success: false, message: 'Pesanan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status pesanan berhasil diubah menjadi "${status}" (Mode Lokal)`,
      data: localUpdated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memperbarui status pesanan',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/pesanan/[id] -> Hapus riwayat pesanan
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak: Anda harus login sebagai admin' },
        { status: 401 }
      );
    }

    try {
      await connectToDatabase();
      const deletedPesanan = await Pesanan.findByIdAndDelete(params.id);
      if (deletedPesanan) {
        return NextResponse.json({
          success: true,
          message: 'Pesanan berhasil dihapus',
        });
      }
    } catch {
      // Fallback to in-memory store
    }

    const deleted = deleteMemoryPesanan(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Pesanan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pesanan berhasil dihapus',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus pesanan',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
