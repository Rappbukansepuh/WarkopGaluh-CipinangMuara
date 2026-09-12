'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Coffee, 
  ShoppingBag, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Check, 
  Wifi, 
  Zap, 
  QrCode, 
  Phone,
  Maximize2 
} from 'lucide-react';
import { MENU_DATA } from '@/data/menu';
import MenuCard from '@/components/public/MenuCard';
import { IMenuItem } from '@/types';
import QrisModal from '@/components/public/QrisModal';

export default function HomePage() {
  const [menus, setMenus] = useState<IMenuItem[]>(MENU_DATA);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [showQrisModal, setShowQrisModal] = useState(false);

  useEffect(() => {
    fetch('/api/menu')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setMenus(data.data);
        }
      })
      .catch((err) => console.error('Error fetching homepage menus:', err));
  }, []);

  const categories = ['Semua', 'Kopi', 'Makanan', 'Minuman'];

  const filteredMenus = menus
    .filter((item) => activeCategory === 'Semua' || item.kategori === activeCategory)
    .slice(0, 6);

  return (
    <div className="space-y-14 sm:space-y-20 pb-16 sm:pb-24 pt-20 sm:pt-24">

      {/* 1. HERO SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Buka Setiap Hari: 09.00 – 00.00 WIB</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] font-display">
                Kopi seduh pas, Indomie hangat, dan tempat santai sampai larut.
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
                Warung kopi sederhana di Cipinang Muara. Tempat rehat sejenak, ngobrol santai, atau nugas dengan WiFi dan colokan listrik di setiap meja.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/menu"
                className="px-5 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs inline-flex items-center gap-2"
              >
                <Coffee className="w-4 h-4" />
                <span>Lihat Daftar Menu</span>
              </Link>

              <Link
                href="/pesan"
                className="px-5 py-2.5 rounded-lg bg-white hover:bg-stone-100 text-stone-900 text-xs sm:text-sm font-semibold border border-stone-300 transition-colors inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-stone-700" />
                <span>Pesan Sekarang</span>
              </Link>

              <Link
                href="/lokasi"
                className="px-4 py-2.5 text-stone-600 hover:text-stone-900 text-xs sm:text-sm font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <span>Petunjuk Arah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Facility Indicators */}
            <div className="pt-4 border-t border-stone-200/80 flex flex-wrap gap-x-6 gap-y-2 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Free WiFi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Colokan Tiap Meja</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Parkir Motor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Bayar Tunai / QRIS</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 bg-stone-100 aspect-[4/3] sm:aspect-[16/10] lg:aspect-square shadow-sm">
              <Image
                src="/images/hero-warkop.jpg"
                alt="Suasana Warkop Galuh"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-stone-950/75 backdrop-blur-xs text-white p-3 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <p className="font-bold font-display leading-none">Warkop Galuh</p>
                  <p className="text-[11px] text-stone-300 mt-1">Cipinang Muara 2, Jatinegara</p>
                </div>
                <span className="text-[10px] bg-emerald-600/90 font-semibold px-2 py-0.5 rounded">
                  Buka Malam
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. RINGKASAN INFORMASI */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-xl bg-white border border-stone-200/90 p-5 sm:p-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 text-stone-700 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-900 text-sm">Jam Buka</p>
                <p className="text-stone-500 mt-0.5">09.00 – 00.00 WIB</p>
                <p className="text-stone-400 text-[11px]">Buka setiap hari</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 text-stone-700 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-900 text-sm">Alamat</p>
                <p className="text-stone-500 mt-0.5">Jl. Cipinang Muara 2 RT 4/RW 2</p>
                <p className="text-stone-400 text-[11px]">Jatinegara, Jakarta Timur</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 text-stone-700 mt-0.5">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-900 text-sm">Fasilitas</p>
                <p className="text-stone-500 mt-0.5">WiFi Kencang & Colokan</p>
                <p className="text-stone-400 text-[11px]">Parkir motor tersedia</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 text-stone-700 mt-0.5">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-900 text-sm">Pembayaran</p>
                <p className="text-stone-500 mt-0.5">Tunai & QRIS</p>
                <p className="text-stone-400 text-[11px]">BCA, GoPay, OVO, DANA</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MENU PILIHAN & KATEGORI */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500 block mb-1">
              Daftar Santapan
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
              Menu Pilihan Warkop Galuh
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Seduhan kopi hangat, Indomie racikan mantap, dan minuman dingin pelepas dahaga.
            </p>
          </div>

          <Link
            href="/menu"
            className="text-xs font-semibold text-stone-900 hover:text-stone-600 inline-flex items-center gap-1.5 self-start sm:self-auto bg-white px-3.5 py-2 rounded-lg border border-stone-300 hover:border-stone-400 transition-colors shadow-2xs"
          >
            <span>Lihat Semua Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMenus.map((menu) => (
            <MenuCard key={menu.id || menu._id} menu={menu} />
          ))}
        </div>
      </section>

      {/* 4. TENTANG WARKOP & FASILITAS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500 block">
                Suasana & Pelayanan
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                Tempat nongkrong yang ramah, santai, dan nyaman di kantong.
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                Warkop Galuh didirikan sebagai ruang temu warga, teman kerja, dan mahasiswa sekitar Cipinang Muara. Tanpa formalitas yang kaku, kami sediakan tempat istirahat dengan minuman racikan pas, santapan hangat yang selalu siap disajikan, dan akses listrik untuk cas gadget.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <h3 className="font-bold text-stone-900">Racikan Pas & Higienis</h3>
                  <p className="text-stone-500 leading-relaxed">
                    Air seduhan selalu mendidih, takaran kopi dan susu seimbang sesuai selera Anda.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                  <h3 className="font-bold text-stone-900">Nongkrong Tanpa Ribet</h3>
                  <p className="text-stone-500 leading-relaxed">
                    Bebas pilih duduk di meja dalam atau area luar, santai sambil ngobrol atau kerja ringan.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="font-bold text-xs text-stone-900">Ringkasan Info Warkop</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Aktif
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400">Rentang Harga</span>
                  <span className="font-semibold text-stone-800">Rp 2.000 – Rp 13.000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400">Waktu Pelayanan</span>
                  <span className="font-semibold text-stone-800">09.00 – 00.00 WIB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-400">Pesanan Online</span>
                  <span className="font-semibold text-stone-800">Web & WhatsApp</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-400">Metode Bayar</span>
                  <span className="font-semibold text-stone-800">Tunai & QRIS</span>
                </div>
              </div>

              <a
                href="https://wa.me/6285817197972?text=Halo%20Warkop%20Galuh,%20saya%20mau%20tanya"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Hubungi via WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PEMBAYARAN NON-TUNAI (QRIS) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-stone-200/90 bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            <div className="md:col-span-8 space-y-3">
              <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500 block">
                Metode Pembayaran
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
                Mendukung Pembayaran QRIS & Tunai
              </h2>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                Nongkrong tanpa khawatir tidak bawa uang pas. Cukup scan barcode QRIS kami menggunakan aplikasi mobile banking (BCA, Mandiri, BRI, BNI) atau dompet digital (GoPay, OVO, DANA, ShopeePay).
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-600">
                <span className="px-2.5 py-1 rounded bg-stone-100 border border-stone-200">Semua M-Banking</span>
                <span className="px-2.5 py-1 rounded bg-stone-100 border border-stone-200">GoPay</span>
                <span className="px-2.5 py-1 rounded bg-stone-100 border border-stone-200">OVO</span>
                <span className="px-2.5 py-1 rounded bg-stone-100 border border-stone-200">DANA</span>
                <span className="px-2.5 py-1 rounded bg-stone-100 border border-stone-200">ShopeePay</span>
              </div>
            </div>

            {/* QR Card Preview */}
            <div className="md:col-span-4 flex justify-center md:justify-end">
              <div 
                onClick={() => setShowQrisModal(true)}
                className="w-full max-w-[200px] p-3 rounded-xl border border-stone-200 bg-stone-50 hover:border-stone-400 cursor-pointer text-center space-y-2 transition-all shadow-xs"
              >
                <div className="relative aspect-square w-full rounded-lg bg-white overflow-hidden border border-stone-200 p-2">
                  <Image
                    src="/images/qris-warkop.jpg"
                    alt="QRIS Warkop Galuh"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <p className="text-[11px] font-bold text-stone-800">Scan QRIS Kasir</p>
                <button
                  type="button"
                  className="text-[10px] font-semibold text-stone-800 hover:underline inline-flex items-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>Perbesar Barcode</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QRIS Modal */}
      <QrisModal
        isOpen={showQrisModal}
        onClose={() => setShowQrisModal(false)}
      />

    </div>
  );
}
