import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Menu from '@/models/Menu';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

const initialMenus = [
  // Minuman & Kopi
  {
    nama: 'Kapal Api Mix',
    deskripsi: 'Kopi hitam bubuk Kapal Api mantap dengan takaran gula pas diseduh air mendidih.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/kapal-api-mix.jpg',
    isTersedia: true,
  },
  {
    nama: 'Kapal Api Kopi Susu',
    deskripsi: 'Seduhan kopi hitam Kapal Api berpadu dengan gurih manis susu kental manis.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/kapal-api-kopi-susu.jpg',
    isTersedia: true,
  },
  {
    nama: 'Good Day Cappucino',
    deskripsi: 'Kopi cappuccino lembut dengan taburan choco granule nikmat di atasnya.',
    harga: 6000,
    kategori: 'Kopi',
    gambar: '/images/menu/good-day-cappucino.jpg',
    isTersedia: true,
  },
  {
    nama: 'ABC Kopi Susu',
    deskripsi: 'Kopi nikmat dan aroma khas kopi susu ABC mantap diseduh hangat.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/abc-kopi-susu.jpg',
    isTersedia: true,
  },
  {
    nama: 'White Kopi',
    deskripsi: 'Luwak White Koffie lembut, harum, dan aman di lambung.',
    harga: 6000,
    kategori: 'Kopi',
    gambar: '/images/menu/white-kopi.jpg',
    isTersedia: true,
  },
  {
    nama: 'Nutrisari Leci',
    deskripsi: 'Minuman sari buah leci manis harum segar disajikan dingin dengan es batu.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-leci.jpg',
    isTersedia: true,
  },
  {
    nama: 'Nutrisari Lemon Tea',
    deskripsi: 'Perpaduan teh pilihan dan ekstrak lemon segar manis asam pelepas dahaga.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-lemon-tea.jpg',
    isTersedia: true,
  },
  {
    nama: 'Nutrisari Jeruk Nipis',
    deskripsi: 'Kesegaran asam manis jeruk nipis alami kaya vitamin C disajikan dingin.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-jeruk-nipis.jpg',
    isTersedia: true,
  },
  {
    nama: 'Nutrisari Milky Oren',
    deskripsi: 'Kombinasi unik rasa jeruk segar dan kelembutan susu disajikan dingin.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-milky-oren.jpg',
    isTersedia: true,
  },
  {
    nama: 'Wedank',
    deskripsi: 'Wedang jahe tradisional hangat meredakan pegal dan menghangatkan badan.',
    harga: 5000,
    kategori: 'Minuman',
    gambar: '/images/menu/wedank.jpg',
    isTersedia: true,
  },
  {
    nama: 'AMH',
    deskripsi: 'Sari jahe merah AMH plus habbatussauda dan ginseng hangat berkhasiat.',
    harga: 5000,
    kategori: 'Minuman',
    gambar: '/images/menu/amh.jpg',
    isTersedia: true,
  },

  // Makanan
  {
    nama: 'Mie Tanpa Telur',
    deskripsi: 'Indomie rebus atau goreng lezat disajikan hangat dengan bumbu gurih khas warkop.',
    harga: 8000,
    kategori: 'Makanan',
    gambar: '/images/menu/mie-tanpa-telur.jpg',
    isTersedia: true,
  },
  {
    nama: 'Mie Pake Telor',
    deskripsi: 'Indomie rebus atau goreng mantap disajikan komplit dengan topping telur pilihan.',
    harga: 13000,
    kategori: 'Makanan',
    gambar: '/images/menu/mie-pake-telor.jpg',
    isTersedia: true,
  },
  {
    nama: 'Kerupuk',
    deskripsi: 'Kerupuk kaleng renyah dan gurih, pelengkap santap mie dan teman ngobrol warkop.',
    harga: 2000,
    kategori: 'Makanan',
    gambar: '/images/menu/kerupuk.jpg',
    isTersedia: true,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const isDev = process.env.NODE_ENV !== 'production';
    const isAuthorized = key && process.env.SEED_SECRET && key === process.env.SEED_SECRET;

    if (!isDev && !isAuthorized) {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak. Fitur seed dinonaktifkan untuk publik.' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const menuCount = await Menu.countDocuments();
    let seededMenus = false;

    if (menuCount === 0) {
      await Menu.insertMany(initialMenus);
      seededMenus = true;
    }

    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@warkop.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'adminwarkop123';

    let seededAdmin = false;
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: 'Admin Warkop Galuh',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      seededAdmin = true;
    }

    return NextResponse.json({
      success: true,
      message: 'Database berhasil di-seed!',
      details: {
        seededMenus,
        totalMenus: await Menu.countDocuments(),
        seededAdmin,
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal melakukan seed database',
      },
      { status: 500 }
    );
  }
}
