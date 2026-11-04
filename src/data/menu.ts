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
    deskripsi: 'Kopi hitam Kapal Api seduh panas dengan gula pas.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/kapal-api-mix.jpg',
    isTersedia: true,
  },
  {
    id: 'kopi-2',
    nama: 'Kapal Api Kopi Susu',
    deskripsi: 'Kopi hitam Kapal Api ditambah susu kental manis.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/kapal-api-kopi-susu.jpg',
    isTersedia: true,
  },
  {
    id: 'kopi-3',
    nama: 'Good Day Cappucino',
    deskripsi: 'Good Day Cappuccino hangat atau dingin plus taburan cokelat.',
    harga: 6000,
    kategori: 'Kopi',
    gambar: '/images/menu/good-day-cappucino.jpg',
    isTersedia: true,
  },
  {
    id: 'kopi-4',
    nama: 'ABC Kopi Susu',
    deskripsi: 'Kopi susu manis khas ABC, pas buat nemenin nongkrong.',
    harga: 5000,
    kategori: 'Kopi',
    gambar: '/images/menu/abc-kopi-susu.jpg',
    isTersedia: true,
  },
  {
    id: 'kopi-5',
    nama: 'White Kopi',
    deskripsi: 'Luwak White Koffie, rasa creamy dan lebih ramah di lambung.',
    harga: 6000,
    kategori: 'Kopi',
    gambar: '/images/menu/white-kopi.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-1',
    nama: 'Nutrisari Leci',
    deskripsi: 'Nutrisari rasa leci dengan es batu dingin.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-leci.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-2',
    nama: 'Nutrisari Lemon Tea',
    deskripsi: 'Teh lemon dingin segar, manis asam pas.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-lemon-tea.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-3',
    nama: 'Nutrisari Jeruk Nipis',
    deskripsi: 'Jeruk nipis dingin asam segar, cocok buat siang hari.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-jeruk-nipis.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-4',
    nama: 'Nutrisari Milky Oren',
    deskripsi: 'Rasa jeruk manis creamy susu dengan es.',
    harga: 4000,
    kategori: 'Minuman',
    gambar: '/images/menu/nutrisari-milky-oren.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-5',
    nama: 'Wedank',
    deskripsi: 'Wedang jahe hangat seduh, cocok buat malam atau saat badan pegal.',
    harga: 5000,
    kategori: 'Minuman',
    gambar: '/images/menu/wedank.jpg',
    isTersedia: true,
  },
  {
    id: 'minum-6',
    nama: 'AMH',
    deskripsi: 'Jahe merah AMH seduh hangat dengan habbatussauda dan ginseng.',
    harga: 5000,
    kategori: 'Minuman',
    gambar: '/images/menu/amh.jpg',
    isTersedia: true,
  },

  // ==================== 2. MAKANAN ====================
  {
    id: 'makan-1',
    nama: 'Mie Tanpa Telur',
    deskripsi: 'Indomie goreng atau kuah (bisa request tingkat kematangan dan cabe).',
    harga: 8000,
    kategori: 'Makanan',
    gambar: '/images/menu/mie-tanpa-telur.jpg',
    isTersedia: true,
  },
  {
    id: 'makan-2',
    nama: 'Mie Pake Telor',
    deskripsi: 'Indomie goreng atau kuah plus telur ceplok / rebus / campur.',
    harga: 13000,
    kategori: 'Makanan',
    gambar: '/images/menu/mie-pake-telor.jpg',
    isTersedia: true,
  },
  {
    id: 'makan-3',
    nama: 'Kerupuk',
    deskripsi: 'Kerupuk kaleng renyah buat temen makan mie.',
    harga: 2000,
    kategori: 'Makanan',
    gambar: '/images/menu/kerupuk.jpg',
    isTersedia: true,
  },
];
