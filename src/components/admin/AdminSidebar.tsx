'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  Coffee, 
  ArrowLeft, 
  ExternalLink,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Ringkasan',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Kelola Menu',
      href: '/admin/dashboard/menu',
      icon: UtensilsCrossed,
    },
    {
      label: 'Kelola Pesanan',
      href: '/admin/dashboard/pesanan',
      icon: ShoppingBag,
    },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E7E0D8] flex flex-col justify-between h-full min-h-screen">
      {/* Top Brand */}
      <div>
        <div className="p-5 border-b border-[#E7E0D8] flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-stone-900 flex items-center justify-center text-white shadow-xs">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#1C1917] font-display block leading-tight">
                WARKOP GALUH
              </span>
              <span className="text-[10px] uppercase text-[#78716C] font-semibold tracking-wider">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="p-3.5 space-y-1">
          <p className="text-[10px] uppercase font-bold text-[#A8A29E] px-3 pb-1 tracking-wider">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3.5 border-t border-[#E7E0D8] space-y-1.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </span>
          <span className="text-[10px] bg-[#F4EFEA] text-[#78716C] px-1.5 py-0.5 rounded font-mono">
            Live
          </span>
        </Link>

        <Link
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#57534E] hover:bg-[#FAF8F5] hover:text-[#1C1917] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
