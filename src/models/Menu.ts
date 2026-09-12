import mongoose, { Schema, Document, Model } from 'mongoose';
import { MenuKategori } from '@/types';

export interface IMenuDocument extends Document {
  nama: string;
  deskripsi: string;
  harga: number;
  kategori: MenuKategori;
  gambar: string;
  isTersedia: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuSchema = new Schema<IMenuDocument>(
  {
    nama: {
      type: String,
      required: [true, 'Nama menu wajib diisi'],
      trim: true,
    },
    deskripsi: {
      type: String,
      required: [true, 'Deskripsi menu wajib diisi'],
      trim: true,
    },
    harga: {
      type: Number,
      required: [true, 'Harga menu wajib diisi'],
      min: [0, 'Harga tidak boleh kurang dari 0'],
    },
    kategori: {
      type: String,
      enum: ['Kopi', 'Makanan', 'Minuman'],
      required: [true, 'Kategori menu wajib diisi'],
      default: 'Kopi',
    },
    gambar: {
      type: String,
      required: [true, 'URL gambar menu wajib diisi'],
      default: 'Kopi',
    },
    isTersedia: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from recompiling the model upon hot-reloading
const Menu: Model<IMenuDocument> =
  mongoose.models.Menu || mongoose.model<IMenuDocument>('Menu', MenuSchema);

export default Menu;
