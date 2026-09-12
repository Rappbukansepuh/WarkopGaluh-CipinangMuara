'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Coffee, 
  Menu as MenuIcon, 
  X, 
  Clock, 
  ShoppingBag, 
  MapPin, 
  UtensilsCrossed, 
  Home, 
  Phone,
  ShieldCheck,
  ClipboardList,
  Info,
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Daftar Menu', href: '/menu', icon: UtensilsCrossed },
    { name: 'Lokasi & Jam', href: '/lokasi', icon: MapPin },
    { name: 'Pesan Online', href: '/pesan', icon: ShoppingBag },
    { name: 'Cek Status', href: '/status', icon: ClipboardList },
    { name: 'Tentang', href: '/tentang', icon: Info },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs py-3'
            : 'bg-[#FAF8F5] border-b border-stone-200/60 py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            
            {/* Logo Brand */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-white transition-colors group-hover:bg-stone-800">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="leading-none">
                <span className="text-base font-bold text-stone-900 font-display block tracking-tight">
                  Warkop Galuh
                </span>
                <span className="text-[11px] text-stone-500 font-medium block mt-1">
                  Cipinang Muara
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 text-xs text-stone-600 bg-white border border-stone-200/80 px-3 py-1.5 rounded-lg">
                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                <span>Buka: <strong className="text-stone-900 font-medium">09.00 - 00.00 WIB</strong></span>
              </div>

              <Link
                href="/pesan"
                className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pesan Menu</span>
              </Link>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/pesan"
                className="bg-stone-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pesan</span>
              </Link>
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-lg bg-white text-stone-700 border border-stone-200/80 active:scale-95"
                aria-label="Buka Menu"
              >
                <MenuIcon className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-stone-950/40 z-50 backdrop-blur-xs transition-opacity"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full max-w-[300px] bg-white z-50 shadow-xl border-l border-stone-200 flex flex-col justify-between transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center text-white">
                <Coffee className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-sm text-stone-900 font-display">
                Warkop Galuh
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              aria-label="Tutup Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Status info */}
          <div className="p-4 bg-stone-50/80 border-b border-stone-100">
            <div className="flex items-center gap-2 text-xs text-stone-700">
              <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
              <span>Buka Setiap Hari: <strong>09.00 - 00.00</strong></span>
            </div>
          </div>

          {/* Links */}
          <nav className="p-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 space-y-2">
          <a
            href="https://wa.me/6285817197972"
            target="_blank"
            rel="noreferrer"
            className="w-full py-2 px-3 rounded-lg border border-stone-200 bg-white text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span>Chat WhatsApp</span>
          </a>

          <div className="pt-2 flex items-center justify-between text-[11px] text-stone-400">
            <Link
              href="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="hover:text-stone-700 flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </Link>
            <span>Cipinang Muara</span>
          </div>
        </div>
      </aside>
    </>
  );
}
