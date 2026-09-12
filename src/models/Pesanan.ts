import mongoose, { Schema, Document, Model } from 'mongoose';
import { StatusPesanan } from '@/types';

export interface IPesananItemDoc {
  menuId?: string;
  nama: string;
  harga: number;
  jumlah: number;
}

export interface IPesananDocument extends Document {
  nama: string;
  noHP: string;
  menu: IPesananItemDoc[];
  totalHarga: number;
  catatan?: string;
  status: StatusPesanan;
  createdAt: Date;
  updatedAt: Date;
}

const PesananItemSchema = new Schema(
  {
    menuId: {
      type: Schema.Types.Mixed,
      required: false,
    },
    nama: {
      type: String,
      required: [true, 'Nama menu pada pesanan wajib ada'],
    },
    harga: {
      type: Number,
      required: [true, 'Harga item pesanan wajib ada'],
      min: 0,
    },
    jumlah: {
      type: Number,
      required: [true, 'Jumlah item wajib ada'],
      min: [1, 'Jumlah minimal 1'],
    },
  },
  { _id: false }
);

const PesananSchema = new Schema<IPesananDocument>(
  {
    nama: {
      type: String,
      required: [true, 'Nama pemesan wajib diisi'],
      trim: true,
    },
    noHP: {
      type: String,
      required: [true, 'Nomor HP/WhatsApp pemesan wajib diisi'],
      trim: true,
    },
    menu: {
      type: [PesananItemSchema],
      required: [true, 'Daftar item pesanan wajib diisi'],
      validate: [
        (val: IPesananItemDoc[]) => val && val.length > 0,
        'Minimal harus ada 1 item yang dipesan',
      ],
    },
    totalHarga: {
      type: Number,
      required: [true, 'Total harga pesanan wajib ada'],
      min: 0,
    },
    catatan: {
      type: String,
      default: 'tidak ada catatan',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'diproses', 'selesai', 'dibatalkan'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Pesanan: Model<IPesananDocument> =
  mongoose.models.Pesanan || mongoose.model<IPesananDocument>('Pesanan', PesananSchema);

export default Pesanan;
