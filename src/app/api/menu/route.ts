import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import Menu from '@/models/Menu';
import { getMemoryMenus, addMemoryMenu } from '@/lib/memoryStore';

export const dynamic = 'force-dynamic';

const fallbackMenus = [
  // Minuman & Kopi
  {
    _id: 'kopi-1',
    nama: 'Kapal Api Mix',
    deskripsi: 'Kopi hitam bubuk Kapal Api mantap dengan takaran gula pas diseduh air mendidih.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/kapal-api-mix.jpg',
    isTersedia: true,
  },
  {
    _id: 'kopi-2',
    nama: 'Kapal Api Kopi Susu',
    deskripsi: 'Seduhan kopi hitam Kapal Api berpadu dengan gurih manis susu kental manis.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/kapal-api-kopi-susu.jpg',
    isTersedia: true,
  },
  {
    _id: 'kopi-3',
    nama: 'Good Day Cappucino',
    deskripsi: 'Kopi cappuccino lembut dengan taburan choco granule nikmat di atasnya.',
    harga: 6000,
    kategori: 'Kopi',
    gambar: '/images/menu/good-day-cappucino.jpg',
    isTersedia: true,
  },
  {
    _id: 'kopi-4',
    nama: 'ABC Kopi Susu',
    deskripsi: 'Kopi nikmat dan aroma khas kopi susu ABC mantap diseduh hangat.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/abc-kopi-susu.jpg',
    isTersedia: true,
  },
  {
    _id: 'kopi-5',
    nama: 'White Kopi',
    deskripsi: 'Luwak White Koffie lembut, harum, dan aman di lambung.',
    harga: 6000,
    kategori: 'Kopi',
    gambar: '/images/menu/white-kopi.jpg',
    isTersedia: true,
  },
  {
    _id: 'minum-1',
    nama: 'Nutrisari Leci',
    deskripsi: 'Minuman sari buah leci manis harum segar disajikan dingin dengan es batu.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-leci.jpg',
    isTersedia: true,
  },
  {
    _id: 'minum-2',
    nama: 'Nutrisari Lemon Tea',
    deskripsi: 'Perpaduan teh pilihan dan ekstrak lemon segar manis asam pelepas dahaga.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-lemon-tea.jpg',
    isTersedia: true,
  },
  {
    _id: 'minum-3',
    nama: 'Nutrisari Jeruk Nipis',
    deskripsi: 'Kesegaran asam manis jeruk nipis alami kaya vitamin C disajikan dingin.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-jeruk-nipis.jpg',
    isTersedia: true,
  },
  {
    _id: 'minum-4',
    nama: 'Nutrisari Milky Oren',
    deskripsi: 'Kombinasi unik rasa jeruk segar dan kelembutan susu disajikan dingin.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-milky-oren.jpg',
    isTersedia: true,
  },
  {
    _id: 'minum-5',
    nama: 'Wedank',
    deskripsi: 'Wedang jahe tradisional hangat meredakan pegal dan menghangatkan badan.',
    harga: 5000,
    kategori: 'Minuman',
    gambar: '/images/menu/wedank.jpg',
    isTersedia: true,
  },
  {
    _id: 'minum-6',
    nama: 'AMH',
    deskripsi: 'Sari jahe merah AMH plus habbatussauda dan ginseng hangat berkhasiat.',
    harga: 5000,
    kategori: 'Minuman',
    gambar: '/images/menu/amh.jpg',
    isTersedia: true,
  },

  // Makanan
  {
    _id: 'makan-1',
    nama: 'Mie Tanpa Telur',
    deskripsi: 'Indomie rebus atau goreng lezat disajikan hangat dengan bumbu gurih khas warkop.',
    harga: 8000,
    kategori: 'Makanan',
    gambar: '/images/menu/mie-tanpa-telur.jpg',
    isTersedia: true,
  },
  {
    _id: 'makan-2',
    nama: 'Mie Pake Telor',
    deskripsi: 'Indomie rebus atau goreng mantap disajikan komplit dengan topping telur pilihan.',
    harga: 13000,
    kategori: 'Makanan',
    gambar: '/images/menu/mie-pake-telor.jpg',
    isTersedia: true,
  },
  {
    _id: 'makan-3',
    nama: 'Kerupuk',
    deskripsi: 'Kerupuk kaleng renyah dan gurih, pelengkap santap mie dan teman ngobrol warkop.',
    harga: 2000,
    kategori: 'Makanan',
    gambar: '/images/menu/kerupuk.jpg',
    isTersedia: true,
  },
];

// GET /api/menu -> Ambil semua menu
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const kategori = searchParams.get('kategori');
  const search = searchParams.get('search');

  try {
    await connectToDatabase();

    const query: Record<string, unknown> = {};

    if (kategori && kategori !== 'Semua') {
      query.kategori = kategori;
    }

    if (search) {
      query.$or = [
        { nama: { $regex: search, $options: 'i' } },
        { deskripsi: { $regex: search, $options: 'i' } },
      ];
    }

    const menus = await Menu.find(query).sort({ createdAt: -1 });

    if (menus.length > 0) {
      return NextResponse.json({
        success: true,
        count: menus.length,
        data: menus,
      });
    }
  } catch {
    // Database offline fallback
  }

  const result = getMemoryMenus(kategori, search);
  return NextResponse.json({
    success: true,
    count: result.length,
    data: result,
  });
}

// POST /api/menu -> Tambah menu baru
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak: Anda harus login sebagai admin' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json();

    const { nama, deskripsi, harga, kategori, gambar, isTersedia } = body;

    if (!nama || !deskripsi || harga === undefined || !kategori) {
      return NextResponse.json(
        { success: false, message: 'Semua bidang wajib harus diisi' },
        { status: 400 }
      );
    }

    const cleanNama = typeof nama === 'string' ? nama.trim().replace(/<[^>]*>?/gm, '') : '';
    const cleanDeskripsi = typeof deskripsi === 'string' ? deskripsi.trim().replace(/<[^>]*>?/gm, '') : '';
    const cleanKategori = typeof kategori === 'string' ? kategori.trim().replace(/<[^>]*>?/gm, '') : '';
    const cleanGambar = typeof gambar === 'string' ? gambar.trim() : '';

    const menuPayload = {
      nama: cleanNama,
      deskripsi: cleanDeskripsi,
      harga: Math.max(0, Number(harga) || 0),
      kategori: cleanKategori as any,
      gambar: cleanGambar || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80',
      isTersedia: isTersedia !== undefined ? Boolean(isTersedia) : true,
    };

    try {
      await connectToDatabase();
      const newMenu = await Menu.create(menuPayload);
      return NextResponse.json(
        {
          success: true,
          message: 'Menu berhasil ditambahkan',
          data: newMenu,
        },
        { status: 201 }
      );
    } catch {
      const localMenu = addMemoryMenu(menuPayload);
      return NextResponse.json(
        {
          success: true,
          message: 'Menu berhasil ditambahkan (Mode Lokal)',
          data: localMenu,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menambahkan menu',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
