import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Menu from '@/models/Menu';
import {
  getMemoryMenuById,
  updateMemoryMenu,
  deleteMemoryMenu,
} from '@/lib/memoryStore';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    id: string;
  };
}

// GET /api/menu/[id] -> Ambil satu menu
export async function GET(request: NextRequest, { params }: Params) {
  try {
    try {
      await connectToDatabase();
      const menu = await Menu.findById(params.id);
      if (menu) {
        return NextResponse.json({
          success: true,
          data: menu,
        });
      }
    } catch {
      // Fallback to in-memory store
    }

    const localMenu = getMemoryMenuById(params.id);
    if (!localMenu) {
      return NextResponse.json(
        { success: false, message: 'Menu tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: localMenu,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal mengambil data menu',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PUT /api/menu/[id] -> Edit menu
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

    const updateData: Record<string, unknown> = {};
    if (typeof body.nama === 'string') updateData.nama = body.nama.trim().replace(/<[^>]*>?/gm, '');
    if (typeof body.deskripsi === 'string') updateData.deskripsi = body.deskripsi.trim().replace(/<[^>]*>?/gm, '');
    if (typeof body.kategori === 'string') updateData.kategori = body.kategori.trim().replace(/<[^>]*>?/gm, '');
    if (typeof body.gambar === 'string') updateData.gambar = body.gambar.trim();
    if (body.harga !== undefined) updateData.harga = Math.max(0, Number(body.harga) || 0);
    if (body.isTersedia !== undefined) updateData.isTersedia = Boolean(body.isTersedia);

    try {
      await connectToDatabase();
      const updatedMenu = await Menu.findByIdAndUpdate(
        params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (updatedMenu) {
        return NextResponse.json({
          success: true,
          message: 'Menu berhasil diperbarui',
          data: updatedMenu,
        });
      }
    } catch {
      // Fallback to in-memory store
    }

    const localUpdated = updateMemoryMenu(params.id, updateData as any);
    if (!localUpdated) {
      return NextResponse.json(
        { success: false, message: 'Menu tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu berhasil diperbarui (Mode Lokal)',
      data: localUpdated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal memperbarui menu',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/menu/[id] -> Hapus menu
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
      const deletedMenu = await Menu.findByIdAndDelete(params.id);
      if (deletedMenu) {
        return NextResponse.json({
          success: true,
          message: 'Menu berhasil dihapus',
        });
      }
    } catch {
      // Fallback to in-memory store
    }

    const deleted = deleteMemoryMenu(params.id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Menu tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Menu berhasil dihapus',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghapus menu',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
