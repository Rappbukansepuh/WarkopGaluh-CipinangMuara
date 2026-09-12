export interface MenuItem {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  kategori: 'Kopi' | 'Makanan' | 'Minuman';
  gambar: string;
  isTersedia: boolean;
}

export const MENU_DATA: MenuItem[] = [
  {
    id: 'kopi-1',
    nama: 'Kapal Api Mix',
    deskripsi: 'Kopi hitam bubuk Kapal Api mantap dengan takaran gula pas diseduh air mendidih.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/kapal-api-mix.jpg',
    isTersedia: true,
  },
  {
    id: 'kopi-2',
    nama: 'Kapal Api Kopi Susu',
    deskripsi: 'Seduhan kopi hitam Kapal Api berpadu dengan gurih manis susu kental manis.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/kapal-api-kopi-susu.jpg',
    isTersedia: true,
  },
  {
    id: 'kopi-3',
    nama: 'Good Day Cappucino',
    deskripsi: 'Kopi cappuccino lembut dengan taburan choco granule nikmat di atasnya.',
    harga: 6000,
    kategori: 'Kopi',
    gambar: '/images/menu/good-day-cappucino.jpg',
    isTersedia: true,
  },
  {
    id: 'kopi-4',
    nama: 'ABC Kopi Susu',
    deskripsi: 'Kopi nikmat dan aroma khas kopi susu ABC mantap diseduh hangat.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/abc-kopi-susu.jpg',
    isTersedia: true,
  },
  {
    id: 'kopi-5',
    nama: 'White Kopi',
    deskripsi: 'Luwak White Koffie lembut, harum, dan aman di lambung.',
    harga: 6000,
    kategori: 'Kopi',
    gambar: '/images/menu/white-kopi.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-1',
    nama: 'Nutrisari Leci',
    deskripsi: 'Minuman sari buah leci manis harum segar disajikan dingin dengan es batu.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-leci.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-2',
    nama: 'Nutrisari Lemon Tea',
    deskripsi: 'Perpaduan teh pilihan dan ekstrak lemon segar manis asam pelepas dahaga.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-lemon-tea.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-3',
    nama: 'Nutrisari Jeruk Nipis',
    deskripsi: 'Kesegaran asam manis jeruk nipis alami kaya vitamin C disajikan dingin.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-jeruk-nipis.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-4',
    nama: 'Nutrisari Milky Oren',
    deskripsi: 'Kombinasi unik rasa jeruk segar dan kelembutan susu disajikan dingin.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-milky-oren.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-5',
    nama: 'Wedank',
    deskripsi: 'Wedang jahe tradisional hangat meredakan pegal dan menghangatkan badan.',
    harga: 5000,
    kategori: 'Minuman',
    gambar: '/images/menu/wedank.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-6',
    nama: 'AMH',
    deskripsi: 'Sari jahe merah AMH plus habbatussauda dan ginseng hangat berkhasiat.',
    harga: 5000,
    kategori: 'Minuman',
    gambar: '/images/menu/amh.jpg',
    isTersedia: true,
  },

  // ==================== 2. MAKANAN ====================
  {
    id: 'makan-1',
    nama: 'Mie Tanpa Telur',
    deskripsi: 'Indomie rebus atau goreng lezat disajikan hangat dengan bumbu gurih khas warkop.',
    harga: 8000,
    kategori: 'Makanan',
    gambar: '/images/menu/mie-tanpa-telur.jpg',
    isTersedia: true,
  },
  {
    id: 'makan-2',
    nama: 'Mie Pake Telor',
    deskripsi: 'Indomie rebus atau goreng mantap disajikan komplit dengan topping telur pilihan.',
    harga: 13000,
    kategori: 'Makanan',
    gambar: '/images/menu/mie-pake-telor.jpg',
    isTersedia: true,
  },
  {
    id: 'makan-3',
    nama: 'Kerupuk',
    deskripsi: 'Kerupuk kaleng renyah dan gurih, pelengkap santap mie dan teman ngobrol warkop.',
    harga: 2000,
    kategori: 'Makanan',
    gambar: '/images/menu/kerupuk.jpg',
    isTersedia: true,
  },
];
