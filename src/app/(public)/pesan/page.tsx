'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { ShoppingBag, Plus, Trash2, CheckCircle2, User, MessageSquare, Send, Maximize2, QrCode, Receipt, CreditCard, Banknote, Printer } from 'lucide-react';
import { MENU_DATA } from '@/data/menu';
import { IMenuItem } from '@/types';
import QrisModal from '@/components/public/QrisModal';
import StrukModal from '@/components/StrukModal';

// Zod Schema
const pesananSchema = z.object({
  nama: z.string().min(2, { message: 'Nama harus diisi (minimal 2 karakter)' }),
  noHP: z
    .string()
    .min(9, { message: 'Nomor HP minimal 9 digit' })
    .regex(/^[0-9+-\s]+$/, { message: 'Format nomor HP tidak valid' }),
  menu: z
    .array(
      z.object({
        menuId: z.string().optional(),
        nama: z.string().min(1, { message: 'Pilih menu' }),
        harga: z.number().min(0),
        jumlah: z.number().min(1, { message: 'Jumlah minimal 1' }),
      })
    )
    .min(1, { message: 'Pilih minimal 1 menu' }),
  metodePembayaran: z.enum(['QRIS', 'Tunai']).default('QRIS'),
  catatan: z.string().optional(),
});

type PesananFormValues = z.infer<typeof pesananSchema>;

function PesanFormContent() {
  const searchParams = useSearchParams();
  const initialItemName = searchParams.get('item');

  const [availableMenus, setAvailableMenus] = useState<IMenuItem[]>(MENU_DATA);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [showStrukModal, setShowStrukModal] = useState(false);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setAvailableMenus(data.data);
        }
      })
      .catch((err) => console.error('Error fetching available menus:', err));
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PesananFormValues>({
    resolver: zodResolver(pesananSchema),
    defaultValues: {
      nama: '',
      noHP: '',
      metodePembayaran: 'QRIS',
      menu: [
        {
          nama: '',
          harga: 0,
          jumlah: 1,
        },
      ],
      catatan: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'menu',
  });

  useEffect(() => {
    if (initialItemName) {
      const matched = availableMenus.find(
        (m) => m.nama.toLowerCase() === initialItemName.toLowerCase()
      );
      if (matched) {
        setValue('menu.0.nama', matched.nama);
        setValue('menu.0.harga', matched.harga);
        setValue('menu.0.menuId', matched._id || matched.id);
      }
    }
  }, [initialItemName, availableMenus, setValue]);

  const watchedMenu = watch('menu');

  const calculateTotal = () => {
    if (!watchedMenu) return 0;
    return watchedMenu.reduce((total, item) => {
      const h = Number(item.harga) || 0;
      const j = Number(item.jumlah) || 1;
      return total + h * j;
    }, 0);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const handleMenuChange = (index: number, selectedName: string) => {
    const selected = availableMenus.find((m) => m.nama === selectedName);
    if (selected) {
      setValue(`menu.${index}.nama`, selected.nama);
      setValue(`menu.${index}.harga`, selected.harga);
      setValue(`menu.${index}.menuId`, selected._id || selected.id);
    } else {
      setValue(`menu.${index}.nama`, '');
      setValue(`menu.${index}.harga`, 0);
      setValue(`menu.${index}.menuId`, '');
    }
  };

  const generateWhatsAppUrl = (data: any) => {
    const phone = '6285817197972';
    const menuListText = data.menu
      .map((item: any) => `• ${item.nama} (${item.jumlah}x) - ${formatRupiah(item.harga * item.jumlah)}`)
      .join('\n');

    const message = `Halo Warkop Galuh, saya mau konfirmasi pesanan:\n\n*No. Pesanan:* #${data.orderId}\n*Nama:* ${data.nama}\n*No. HP:* ${data.noHP}\n\n*Daftar Menu:*\n${menuListText}\n\n*Total:* ${formatRupiah(data.totalHarga)}\n*Catatan:* ${data.catatan || '-'}\n\nMohon diproses ya kak, terima kasih!`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: PesananFormValues) => {
    try {
      setSubmitting(true);
      const totalHarga = calculateTotal();

      const payload = {
        nama: data.nama,
        noHP: data.noHP,
        metodePembayaran: data.metodePembayaran || 'QRIS',
        menu: data.menu.map((item) => ({
          menuId: item.menuId || undefined,
          nama: item.nama,
          harga: item.harga,
          jumlah: item.jumlah,
        })),
        catatan: data.catatan || 'tidak ada catatan',
        totalHarga,
      };

      const res = await fetch('/api/pesanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (resData.success) {
        const orderId = resData.data?._id?.slice(-6).toUpperCase() || 'WKP-' + Math.floor(1000 + Math.random() * 9000);
        setOrderSuccess({
          ...payload,
          orderId,
          _id: resData.data?._id,
          createdAt: resData.data?.createdAt || new Date().toISOString(),
          status: resData.data?.status || 'pending',
        });
        toast.success('Pesanan berhasil dibuat!');
        reset();
      } else {
        toast.error('Gagal membuat pesanan: ' + resData.message);
      }
    } catch (err) {
      console.error('Submit order error:', err);
      toast.error('Terjadi kesalahan saat memproses pesanan');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 max-w-2xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="space-y-2 mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700">
          <span>Pemesanan Cepat & Praktis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tracking-tight">
          Form Pesanan Online
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm">
          Pilih menu yang diinginkan, lengkapi nama & nomor WhatsApp, lalu konfirmasi pesanan Anda.
        </p>
      </div>

      {orderSuccess ? (
        /* Order Success Box */
        <div className="rounded-xl bg-white border border-stone-200 p-5 sm:p-7 space-y-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-display">
                Pesanan Berhasil Dicatat
              </h2>
              <p className="text-xs text-stone-500">
                Pesanan atas nama <strong className="text-stone-900">{orderSuccess.nama}</strong> siap diproses.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Nomor Pesanan:</span>
              <span className="font-mono text-stone-900 font-bold">
                #{orderSuccess.orderId}
              </span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="text-stone-500">Total Biaya:</span>
              <span className="font-extrabold text-stone-900 text-sm">
                {formatRupiah(orderSuccess.totalHarga)}
              </span>
            </div>
            <div className="pt-1">
              <span className="text-stone-500 block mb-1 font-semibold">Rincian Menu:</span>
              <ul className="space-y-1 text-stone-800">
                {orderSuccess.menu.map((it: any, idx: number) => (
                  <li key={idx} className="flex justify-between">
                    <span>{it.nama} × {it.jumlah}</span>
                    <span className="text-stone-600 font-medium">{formatRupiah(it.harga * it.jumlah)}</span>
                  </li>
                ))}
              </ul>
            </div>
            {orderSuccess.catatan && (
              <div className="pt-2 border-t border-stone-200">
                <span className="text-stone-500">Catatan: </span>
                <span className="text-stone-800 font-medium">{orderSuccess.catatan}</span>
              </div>
            )}
          </div>

          {/* QRIS Section */}
          <div className="p-4 rounded-lg bg-white border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-900 block">Bayar via QRIS</span>
                <span className="text-[11px] text-stone-500">BCA, Mandiri, GoPay, OVO, DANA, ShopeePay</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-semibold border border-stone-200">
                Non-Tunai
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-stone-50 p-3 rounded-lg border border-stone-200">
              <div 
                onClick={() => setShowQrisModal(true)}
                className="group relative w-36 sm:w-40 aspect-[3/4] rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0 cursor-pointer"
                title="Klik untuk memperbesar QRIS"
              >
                <Image
                  src="/images/qris-warkop.jpg"
                  alt="QRIS Warkop Galuh"
                  fill
                  className="object-contain p-1"
                />
              </div>

              <div className="space-y-2 text-xs text-stone-600 flex-1">
                <p className="font-semibold text-stone-800">Langkah Pembayaran:</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>Scan QRIS di samping melalui m-Banking / e-Wallet.</li>
                  <li>Masukkan nominal: <strong className="text-stone-900 font-bold">{formatRupiah(orderSuccess.totalHarga)}</strong></li>
                  <li>Kirim konfirmasi dan bukti bayar ke WhatsApp Warkop Galuh.</li>
                </ol>

                <button
                  type="button"
                  onClick={() => setShowQrisModal(true)}
                  className="mt-1 text-[11px] font-semibold text-stone-900 hover:text-stone-600 inline-flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Perbesar Barcode QRIS</span>
                </button>
              </div>
            </div>
          </div>

          {/* QRIS Modal */}
          <QrisModal
            isOpen={showQrisModal}
            onClose={() => setShowQrisModal(false)}
            totalHarga={orderSuccess.totalHarga}
            orderId={orderSuccess.orderId}
          />

          {/* Action Buttons: Struk, WhatsApp, Order Baru */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowStrukModal(true)}
              className="px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Lihat & Cetak Struk</span>
            </button>

            <a
              href={generateWhatsAppUrl(orderSuccess)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors text-center"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Konfirmasi WhatsApp</span>
            </a>
          </div>

          <div className="pt-1">
            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full px-4 py-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs border border-stone-200 transition-colors text-center"
            >
              + Buat Pesanan Baru
            </button>
          </div>

          {/* Struk Modal */}
          <StrukModal
            isOpen={showStrukModal}
            onClose={() => setShowStrukModal(false)}
            pesanan={orderSuccess}
          />
        </div>
      ) : (
        /* Order Form */
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl bg-white border border-stone-200 p-5 sm:p-7 space-y-5 shadow-xs"
        >
          {/* Section 1: Customer Data */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 font-display">
              <User className="w-4 h-4 text-stone-700" />
              <span>Data Pemesan</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nama Pemesan <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi"
                  {...register('nama')}
                  className={`w-full px-3 py-2 rounded-lg bg-stone-50 border ${
                    errors.nama ? 'border-rose-500' : 'border-stone-200'
                  } text-stone-900 text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-colors`}
                />
                {errors.nama && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.nama.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nomor WhatsApp <span className="text-rose-600">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  {...register('noHP')}
                  className={`w-full px-3 py-2 rounded-lg bg-stone-50 border ${
                    errors.noHP ? 'border-rose-500' : 'border-stone-200'
                  } text-stone-900 text-xs focus:outline-none focus:border-stone-900 focus:bg-white transition-colors`}
                />
                {errors.noHP && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.noHP.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Menu Selection */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 font-display">
                <ShoppingBag className="w-4 h-4 text-stone-700" />
                <span>Pilih Menu</span>
              </h2>

              <button
                type="button"
                onClick={() => append({ nama: '', harga: 0, jumlah: 1 })}
                className="text-xs text-stone-800 hover:text-stone-950 font-semibold inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Item</span>
              </button>
            </div>

            {errors.menu && typeof errors.menu.message === 'string' && (
              <p className="text-xs text-rose-600">{errors.menu.message}</p>
            )}

            <div className="space-y-2.5">
              {fields.map((field, index) => {
                const currentItem = watchedMenu?.[index];
                const itemTotal = (currentItem?.harga || 0) * (currentItem?.jumlah || 1);
                const selectedMenuObj = availableMenus.find((m) => m.nama === currentItem?.nama);

                return (
                  <div
                    key={field.id}
                    className="p-3 rounded-lg bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                  >
                    {/* Thumbnail preview */}
                    {selectedMenuObj && (
                      <div className="relative w-11 h-11 rounded-lg bg-white overflow-hidden border border-stone-200 shrink-0 hidden sm:block">
                        <Image
                          src={selectedMenuObj.gambar}
                          alt={selectedMenuObj.nama}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Menu Select */}
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase font-semibold text-stone-500 mb-1">
                        Pilihan Menu #{index + 1}
                      </label>
                      <select
                        value={currentItem?.nama || ''}
                        onChange={(e) => handleMenuChange(index, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs font-semibold focus:outline-none focus:border-stone-900"
                      >
                        <option value="">-- Pilih Menu --</option>
                        {availableMenus.map((m) => (
                          <option
                            key={m._id || m.id}
                            value={m.nama}
                            disabled={m.isTersedia === false}
                          >
                            {m.nama} ({m.kategori}) - {formatRupiah(m.harga)}{m.isTersedia === false ? ' — Habis' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="w-full sm:w-20">
                      <label className="block text-[10px] uppercase font-semibold text-stone-500 mb-1">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        {...register(`menu.${index}.jumlah` as const, { valueAsNumber: true })}
                        className="w-full px-2 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-900 text-xs text-center font-bold focus:outline-none focus:border-stone-900"
                      />
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:w-28 pt-1 sm:pt-4">
                      <span className="text-xs font-bold text-stone-900">
                        {formatRupiah(itemTotal)}
                      </span>

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors"
                          title="Hapus item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="space-y-2 pt-4 border-t border-stone-200">
            <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-stone-600" />
              <span>Pilihan Metode Pembayaran</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  watch('metodePembayaran') === 'QRIS'
                    ? 'border-stone-900 bg-stone-900/5 ring-1 ring-stone-900'
                    : 'border-stone-200 bg-stone-50 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  value="QRIS"
                  {...register('metodePembayaran')}
                  className="sr-only"
                />
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-stone-900 block">
                    QRIS (Non-Tunai)
                  </span>
                  <span className="text-[10px] text-stone-500 block truncate">
                    BCA, Mandiri, GoPay, OVO, DANA
                  </span>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  watch('metodePembayaran') === 'Tunai'
                    ? 'border-stone-900 bg-stone-900/5 ring-1 ring-stone-900'
                    : 'border-stone-200 bg-stone-50 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  value="Tunai"
                  {...register('metodePembayaran')}
                  className="sr-only"
                />
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Banknote className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-stone-900 block">
                    Bayar Tunai di Kasir
                  </span>
                  <span className="text-[10px] text-stone-500 block truncate">
                    Bayar langsung saat pesanan siap
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="space-y-1.5 pt-4 border-t border-stone-200">
            <label className="block text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
              <span>Catatan Pesanan (Opsional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: kopi sedikit gula, mie pedas, tanpa sawi."
              {...register('catatan')}
              className="w-full p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-stone-900 focus:bg-white placeholder:text-stone-400 transition-colors"
            />
          </div>

          {/* Section 5: Total & Submit */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs text-stone-500 block">Total Pembayaran</span>
              <span className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
                {formatRupiah(calculateTotal())}
              </span>
            </div>

            <button
              type="submit"
              disabled={calculateTotal() === 0 || submitting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs sm:text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Memproses...' : 'Kirim Pesanan'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function PesanPage() {
  return (
    <Suspense fallback={
      <div className="pt-32 pb-20 text-center text-stone-500 text-xs">
        <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin mx-auto mb-2" />
        <p>Memuat formulir...</p>
      </div>
    }>
      <PesanFormContent />
    </Suspense>
  );
}
