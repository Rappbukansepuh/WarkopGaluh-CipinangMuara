export type MenuKategori = 'Kopi' | 'Makanan' | 'Minuman';

export interface IMenuItem {
  _id?: string;
  id?: string;
  nama: string;
  deskripsi: string;
  harga: number;
  kategori: MenuKategori;
  gambar: string;
  isTersedia?: boolean;
}

export type StatusPesanan = 'pending' | 'diproses' | 'selesai' | 'dibatalkan';

export interface IOrderItem {
  menuId?: string;
  nama: string;
  harga: number;
  jumlah: number;
}

export type MetodePembayaran = 'QRIS' | 'Tunai';

export interface IPesanan {
  _id?: string;
  nama: string;
  noHP: string;
  menu: IOrderItem[];
  totalHarga: number;
  catatan?: string;
  metodePembayaran?: MetodePembayaran;
  status: StatusPesanan;
  createdAt?: string | Date;
}
