'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Check } from 'lucide-react';
import { IMenuItem } from '@/types';

interface MenuCardProps {
  menu: IMenuItem;
  onSelectForOrder?: (menu: IMenuItem) => void;
  isSelected?: boolean;
}

export default function MenuCard({ menu, onSelectForOrder, isSelected }: MenuCardProps) {
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const isAvailable = menu.isTersedia !== false;

  return (
    <div className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden flex flex-col justify-between hover:border-stone-400 hover:shadow-sm transition-all duration-200">
      {/* Gambar Menu */}
      <div className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden">
        <Image
          src={menu.gambar || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&auto=format&fit=crop&q=80'}
          alt={menu.nama}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          unoptimized={menu.gambar?.startsWith('data:')}
        />

        {/* Kategori Badge */}
        <div className="absolute top-2.5 left-2.5 bg-stone-900/85 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded">
          {menu.kategori}
        </div>

        {/* Status Habis */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-md">
              Sedang Habis
            </span>
          </div>
        )}
      </div>

      {/* Detail Konten */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1 font-display">
            {menu.nama}
          </h3>
          <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">
            {menu.deskripsi}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-stone-400 block -mb-0.5">Harga</span>
            <span className="text-sm sm:text-base font-extrabold text-stone-900 font-display">
              {formatRupiah(menu.harga)}
            </span>
          </div>

          {onSelectForOrder ? (
            <button
              onClick={() => onSelectForOrder(menu)}
              disabled={!isAvailable}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                  : 'bg-stone-900 text-white hover:bg-stone-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Dipilih</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </>
              )}
            </button>
          ) : (
            <Link
              href={`/pesan?item=${encodeURIComponent(menu.nama)}`}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors duration-150 active:scale-95"
            >
              Pesan
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
