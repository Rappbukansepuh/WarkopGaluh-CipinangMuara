import React from 'react';
import Link from 'next/link';
import { Coffee, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4 text-center">
      <div className="space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto shadow-sm">
          <Coffee className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-stone-500 tracking-wider uppercase font-mono">
            404 — Halaman Tidak Ditemukan
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] font-display">
            Kopinya Tumpah!
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
            Halaman yang kamu cari mungkin sudah dipindah atau alamatnya salah. Yuk balik ngopi di beranda!
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
