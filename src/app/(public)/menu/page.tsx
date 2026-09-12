'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import { MENU_DATA } from '@/data/menu';
import MenuCard from '@/components/public/MenuCard';
import Link from 'next/link';
import { IMenuItem } from '@/types';

export default function MenuPage() {
  const [menus, setMenus] = useState<IMenuItem[]>(MENU_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMenus(data.data);
        }
      })
      .catch((err) => console.error('Error fetching menu data:', err));
  }, []);

  const categories = [
    { label: 'Semua Menu', value: 'Semua' },
    { label: 'Kopi', value: 'Kopi' },
    { label: 'Makanan & Mie', value: 'Makanan' },
    { label: 'Minuman Segar', value: 'Minuman' },
  ];

  const filteredMenus = menus.filter((item) => {
    const matchCategory =
      selectedCategory === 'Semua' || item.kategori === selectedCategory;
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
      
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700">
          <span>Daftar Menu & Harga Resmi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 font-display tracking-tight">
          Daftar Menu Warkop Galuh
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-xl">
          Pilihan lengkap seduhan kopi panas & dingin, Indomie kuah atau goreng, dan aneka minuman sachet segar.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-stone-200 shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200 border border-stone-200/60'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kopi, mie, nutrisari..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-xs focus:outline-none focus:border-stone-900 focus:bg-white placeholder:text-stone-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Menu Grid Content */}
      {filteredMenus.length === 0 ? (
        <div className="py-16 text-center space-y-3 rounded-xl bg-white border border-stone-200 p-6 shadow-xs">
          <p className="text-sm text-stone-900 font-bold">Menu tidak ditemukan</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Tidak ada menu yang sesuai dengan kata kunci &quot;{searchQuery}&quot;.
          </p>
          <div className="pt-1">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Semua');
              }}
              className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>Menampilkan <strong className="text-stone-900 font-semibold">{filteredMenus.length}</strong> menu</span>
            <Link
              href="/pesan"
              className="text-stone-900 hover:text-stone-600 font-semibold inline-flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buat Pesanan Online</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMenus.map((item) => (
              <MenuCard key={item.id || item._id} menu={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
