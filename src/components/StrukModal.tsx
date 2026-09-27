'use client';

import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  X,
  Receipt,
  Share2,
  Coffee,
  Calendar,
  Phone,
  User,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { IPesanan } from '@/types';
import { toast } from 'sonner';

const formatRupiah = (num: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);

interface StrukModalProps {
  isOpen: boolean;
  onClose: () => void;
  pesanan: Partial<IPesanan> & {
    orderId?: string;
  };
}

export default function StrukModal({ isOpen, onClose, pesanan }: StrukModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !pesanan) return null;

  const displayId =
    pesanan.orderId ||
    (pesanan._id ? pesanan._id.slice(-6).toUpperCase() : 'WKP-' + Math.floor(1000 + Math.random() * 9000));

  const orderDate = pesanan.createdAt
    ? new Date(pesanan.createdAt)
    : new Date();

  const formattedDate = orderDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = orderDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WIB';

  const items = pesanan.menu || [];
  const total = pesanan.totalHarga || 0;
  const metode = pesanan.metodePembayaran || 'QRIS';
  const status = pesanan.status || 'pending';

  // Format teks struk untuk disalin ke clipboard
  const generateReceiptText = () => {
    const lines = [
      '================================',
      '      ☕ WARKOP GALUH ☕        ',
      '   Jl. Cipinang Muara, Jaktim   ',
      '     WA: 0858-1719-7972         ',
      '================================',
      `No. Nota : #${displayId}`,
      `Waktu    : ${formattedDate}, ${formattedTime}`,
      `Pelanggan: ${pesanan.nama || '-'}`,
      `No. HP   : ${pesanan.noHP || '-'}`,
      `Metode   : ${metode === 'Tunai' ? 'Tunai di Kasir' : 'QRIS (Non-Tunai)'}`,
      `Status   : ${status === 'selesai' ? 'LUNAS / SELESAI' : status.toUpperCase()}`,
      '--------------------------------',
      'RINCIAN PESANAN:',
      ...items.map(
        (it) =>
          `${it.nama}\n  ${it.jumlah} x ${formatRupiah(it.harga)} = ${formatRupiah(
            it.harga * it.jumlah
          )}`
      ),
      '--------------------------------',
      `TOTAL    : ${formatRupiah(total)}`,
      ...(pesanan.catatan && pesanan.catatan !== 'tidak ada catatan'
        ? [`Catatan  : ${pesanan.catatan}`]
        : []),
      '================================',
      'Terima kasih sudah ngopi & mampir',
      '       di Warkop Galuh!         ',
      '================================',
    ];
    return lines.join('\n');
  };

  const handleCopyText = () => {
    const text = generateReceiptText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Struk berhasil disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateReceiptText());
    window.open(`https://wa.me/6285817197972?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top bar (Tombol Aksi Cetak & Tutup) */}
        <div className="px-4 py-3 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-xs tracking-wide uppercase font-mono">
              Struk Pembayaran Warkop
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Preview Area (yang dicetak saat print) */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-stone-100 flex-1">
          <div
            id="struk-print-area"
            className="bg-white p-5 sm:p-6 rounded-xl border border-stone-300 shadow-xs font-mono text-xs text-stone-800 space-y-4 max-w-sm mx-auto receipt-paper relative"
          >
            {/* Header Nota */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-stone-300">
              <div className="w-10 h-10 mx-auto rounded-full bg-stone-900 text-amber-400 flex items-center justify-center mb-1">
                <Coffee className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold tracking-tight text-stone-900 uppercase">
                WARKOP GALUH
              </h2>
              <p className="text-[10px] text-stone-500 leading-tight">
                Jl. Cipinang Muara, Jatinegara, Jakarta Timur
              </p>
              <p className="text-[10px] text-stone-500">
                Telp/WA: 0858-1719-7972
              </p>
            </div>

            {/* Info Transaksi */}
            <div className="space-y-1.5 text-[11px] pb-3 border-b border-dashed border-stone-300">
              <div className="flex justify-between">
                <span className="text-stone-500">No. Order:</span>
                <span className="font-bold text-stone-900">#{displayId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Waktu:</span>
                <span>{formattedDate} {formattedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Pelanggan:</span>
                <span className="font-semibold text-stone-900">{pesanan.nama || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">No. HP / WA:</span>
                <span>{pesanan.noHP || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Metode Bayar:</span>
                <span className="inline-flex items-center gap-1 font-bold text-stone-900">
                  {metode === 'Tunai' ? (
                    <>
                      <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                      Tunai di Kasir
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      QRIS Non-Tunai
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500">Status:</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    status === 'selesai'
                      ? 'bg-emerald-100 text-emerald-800'
                      : status === 'diproses'
                      ? 'bg-blue-100 text-blue-800'
                      : status === 'dibatalkan'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {status === 'selesai' ? 'LUNAS / SELESAI' : status}
                </span>
              </div>
            </div>

            {/* Daftar Item */}
            <div className="space-y-2 pb-3 border-b border-dashed border-stone-300 text-[11px]">
              <div className="flex justify-between font-bold text-stone-900 text-[10px] uppercase border-b border-stone-200 pb-1">
                <span>Menu & Qty</span>
                <span>Subtotal</span>
              </div>
              {items.map((it, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between font-medium text-stone-900">
                    <span>{it.nama}</span>
                    <span>{formatRupiah(it.harga * it.jumlah)}</span>
                  </div>
                  <div className="text-[10px] text-stone-500">
                    {it.jumlah} × {formatRupiah(it.harga)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Pembayaran */}
            <div className="space-y-1.5 text-[11px] pb-3 border-b border-dashed border-stone-300">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal Pesanan:</span>
                <span>{formatRupiah(total)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Biaya Layanan / Parkir:</span>
                <span className="text-emerald-600 font-bold">GRATIS</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>TOTAL BAYAR:</span>
                <span className="text-emerald-700">{formatRupiah(total)}</span>
              </div>
            </div>

            {/* Catatan Khusus */}
            {pesanan.catatan && pesanan.catatan !== 'tidak ada catatan' && (
              <div className="p-2 rounded bg-stone-50 border border-stone-200 text-[10px] text-stone-600">
                <span className="font-bold text-stone-800 block">Catatan Pesanan:</span>
                <p className="italic">{pesanan.catatan}</p>
              </div>
            )}

            {/* Footer Nota & Ucapan */}
            <div className="text-center space-y-1 pt-1 text-[10px] text-stone-500">
              <p className="font-bold text-stone-700">Terima kasih atas pesanan Anda!</p>
              <p>Password WiFi warkop bisa tanyakan langsung ke barista.</p>
              <p className="text-[9px] text-stone-400">
                Simpan struk digital ini sebagai bukti pesanan Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200 space-y-2 print:hidden shrink-0">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={handleCopyText}
              className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 border border-stone-300 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-600" />
                  <span>Salin Teks Nota</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="w-full px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Kirim Bukti Struk ke WhatsApp Warkop</span>
          </button>
        </div>

      </div>
    </div>
  );
}
