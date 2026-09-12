'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ShoppingBag,
  ChevronRight,
  ReceiptText,
  CircleDot,
} from 'lucide-react';
import Link from 'next/link';

type StatusPesanan = 'pending' | 'diproses' | 'selesai' | 'dibatalkan';

interface IOrderItem {
  nama: string;
  harga: number;
  jumlah: number;
}

interface IPesanan {
  _id: string;
  nama: string;
  noHP: string;
  menu: IOrderItem[];
  totalHarga: number;
  catatan?: string;
  status: StatusPesanan;
  createdAt?: string;
}

const STATUS_CONFIG: Record<
  StatusPesanan,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode; step: number }
> = {
  pending: {
    label: 'Menunggu Diproses',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    icon: <Clock className="w-4 h-4 text-amber-600" />,
    step: 1,
  },
  diproses: {
    label: 'Sedang Diracik',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    icon: <CircleDot className="w-4 h-4 text-blue-600" />,
    step: 2,
  },
  selesai: {
    label: 'Selesai & Lunas',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    step: 3,
  },
  dibatalkan: {
    label: 'Dibatalkan',
    color: 'text-rose-800',
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    icon: <XCircle className="w-4 h-4 text-rose-600" />,
    step: 0,
  },
};

function StatusStepBar({ status }: { status: StatusPesanan }) {
  const steps = ['Pesanan Diterima', 'Sedang Diracik', 'Selesai'];
  const activeStep = STATUS_CONFIG[status]?.step ?? 0;
  if (status === 'dibatalkan') return null;

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = activeStep >= stepNum;
        const isActive = activeStep === stepNum;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
                  isDone
                    ? 'bg-stone-900 border-stone-900 text-white'
                    : 'bg-white border-stone-300 text-stone-400'
                } ${isActive ? 'ring-2 ring-stone-300 ring-offset-1' : ''}`}
              >
                {isDone ? '✓' : stepNum}
              </div>
              <span
                className={`text-[10px] mt-1 font-semibold text-center leading-tight max-w-[60px] ${
                  isDone ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 mt-[-14px] transition-all ${
                  activeStep > stepNum ? 'bg-stone-900' : 'bg-stone-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function PesananCard({ pesanan }: { pesanan: IPesanan }) {
  const cfg = STATUS_CONFIG[pesanan.status] ?? STATUS_CONFIG.pending;
  const orderId = pesanan._id?.slice(-6).toUpperCase();

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);

  const formatDate = (d?: string) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="rounded-xl bg-white border border-stone-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 bg-stone-50/60">
        <div className="flex items-center gap-2">
          <ReceiptText className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-xs font-mono font-bold text-stone-900">#{orderId}</span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.border} ${cfg.color}`}
        >
          {cfg.icon}
          {cfg.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        {/* Status tracker */}
        <StatusStepBar status={pesanan.status} />

        {/* Items */}
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
            Rincian Pesanan
          </p>
          {pesanan.menu.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-1.5 text-xs border-b border-stone-100 last:border-0"
            >
              <span className="text-stone-700">
                {item.nama}{' '}
                <strong className="text-stone-900">×{item.jumlah}</strong>
              </span>
              <span className="text-stone-600 font-mono">{formatRupiah(item.harga * item.jumlah)}</span>
            </div>
          ))}
          {pesanan.catatan && pesanan.catatan !== 'tidak ada catatan' && (
            <p className="text-[11px] text-stone-500 italic pt-1">
              Catatan: {pesanan.catatan}
            </p>
          )}
        </div>

        {/* Footer: total + time */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-100">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <Clock className="w-3 h-3" />
            <span>{formatDate(pesanan.createdAt as string)}</span>
          </div>
          <span className="text-sm font-extrabold text-stone-900 font-mono">
            {formatRupiah(pesanan.totalHarga)}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [noHP, setNoHP] = useState(searchParams.get('noHP') || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<IPesanan[] | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noHP.trim()) {
      setError('Masukkan nomor WhatsApp / HP terlebih dahulu.');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/pesanan/status?noHP=${encodeURIComponent(noHP.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Terjadi kesalahan. Coba lagi.');
        setResults(null);
        return;
      }

      if (data.success) {
        setResults(data.data);
        // Update URL tanpa reload
        router.replace(`/status?noHP=${encodeURIComponent(noHP.trim())}`, { scroll: false });
      } else {
        setError(data.message || 'Gagal mengambil data pesanan.');
        setResults(null);
      }
    } catch {
      setError('Koneksi gagal. Silakan coba lagi.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          <span>Pelacakan Pesanan</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display tracking-tight">
          Cek Status Pesanan
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
          Masukkan nomor WhatsApp yang Anda gunakan saat memesan untuk melihat status pesanan Anda.
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="rounded-xl bg-white border border-stone-200 p-5 sm:p-6 space-y-4 shadow-xs mb-6"
      >
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            <Phone className="w-3.5 h-3.5 inline mr-1.5 text-stone-500" />
            Nomor WhatsApp / HP Pemesan
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              value={noHP}
              onChange={(e) => setNoHP(e.target.value)}
              placeholder="Contoh: 081234567890"
              className="flex-1 px-3 py-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
              autoComplete="tel"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Cek</span>
            </button>
          </div>
          {error && <p className="text-xs text-rose-600 mt-1.5">{error}</p>}
        </div>

        <p className="text-[11px] text-stone-400 leading-relaxed">
          🔒 Nomor HP Anda hanya digunakan untuk mencari pesanan dan tidak disimpan dalam pencarian ini.
        </p>
      </form>

      {/* Results */}
      {searched && !loading && results !== null && (
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="rounded-xl bg-white border border-stone-200 p-8 text-center space-y-3 shadow-xs">
              <ShoppingBag className="w-8 h-8 mx-auto text-stone-300" />
              <div>
                <p className="text-sm font-semibold text-stone-700">Tidak ada pesanan ditemukan</p>
                <p className="text-xs text-stone-400 mt-1">
                  Pastikan nomor HP yang Anda masukkan sama dengan saat memesan.
                </p>
              </div>
              <Link
                href="/pesan"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-lg border border-stone-200 transition-colors"
              >
                <span>Buat Pesanan Baru</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-stone-600">
                  Ditemukan{' '}
                  <strong className="text-stone-900">{results.length}</strong>{' '}
                  pesanan atas nama{' '}
                  <strong className="text-stone-900">{results[0].nama}</strong>
                </p>
                <Link
                  href="/pesan"
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 inline-flex items-center gap-1"
                >
                  <span>+ Pesan Lagi</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {results.map((p) => (
                <PesananCard key={p._id} pesanan={p} />
              ))}
            </>
          )}
        </div>
      )}

      {/* CTA kalau belum search */}
      {!searched && (
        <div className="rounded-xl bg-stone-50 border border-stone-200 p-5 text-center space-y-2">
          <p className="text-xs text-stone-500">
            Belum punya pesanan?{' '}
            <Link href="/pesan" className="font-semibold text-stone-900 underline underline-offset-2">
              Pesan sekarang →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-20 text-center text-stone-500 text-xs">
          <div className="w-6 h-6 border-2 border-stone-200 border-t-stone-800 rounded-full animate-spin mx-auto mb-2" />
          <p>Memuat...</p>
        </div>
      }
    >
      <StatusPageContent />
    </Suspense>
  );
}
