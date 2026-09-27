import React from 'react';
import Link from 'next/link';
import { Coffee, MapPin, Phone, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200 text-stone-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-stone-900 font-display">
                Warkop Galuh
              </span>
            </div>
            <p className="text-stone-500 text-xs leading-relaxed max-w-sm">
              Warung kopi santai di Cipinang Muara. Menyajikan seduhan kopi racikan pas, Indomie hangat, dan aneka minuman segar untuk melepas penat sehari-hari.
            </p>
          </div>

          {/* Opening Hours */}
          <div className="space-y-2.5">
            <h3 className="text-stone-900 font-bold text-xs uppercase tracking-wider font-display flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-700" />
              Jam Operasional
            </h3>
            <p className="text-stone-700">
              Buka setiap hari: <strong className="text-stone-900 font-semibold">09.00 – 00.00 WIB</strong>
            </p>
            <p className="text-stone-400 text-[11px]">
              Tersedia area duduk santai, colokan listrik, dan parkir motor.
            </p>
          </div>

          {/* Location & Contact */}
          <div className="space-y-2.5">
            <h3 className="text-stone-900 font-bold text-xs uppercase tracking-wider font-display flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-stone-700" />
              Alamat & Kontak
            </h3>
            <p className="text-stone-700 leading-relaxed">
              Jl. Cipinang Muara 2 RT 4/RW 2, Jatinegara, Jakarta Timur
            </p>
            <p>
              <a
                href="https://wa.me/6285817197972"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+62 858-1719-7972 (WhatsApp)</span>
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h3 className="text-stone-900 font-bold text-xs uppercase tracking-wider font-display">
              Tautan Cepat
            </h3>
            <ul className="space-y-1.5">
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Daftar Menu', href: '/menu' },
                { label: 'Pesan Online', href: '/pesan' },
                { label: 'Cek Status Pesanan', href: '/status' },
                { label: 'Tentang Kami', href: '/tentang' },
                { label: 'Lokasi & Jam', href: '/lokasi' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-400 text-[11px]">
          <p>© {new Date().getFullYear()} Warkop Galuh. Hak Cipta Dilindungi.</p>
          <div className="flex flex-wrap items-center gap-4 font-medium text-stone-500">
            <Link href="/menu" className="hover:text-stone-900 transition-colors">Daftar Menu</Link>
            <Link href="/pesan" className="hover:text-stone-900 transition-colors">Pesan Online</Link>
            <Link href="/status" className="hover:text-stone-900 transition-colors">Cek Status</Link>
            <Link href="/tentang" className="hover:text-stone-900 transition-colors">Tentang</Link>
            <Link href="/lokasi" className="hover:text-stone-900 transition-colors">Lokasi & Peta</Link>
            {/*  */}
          </div>
        </div>
      </div>
    </footer>
  );
}
