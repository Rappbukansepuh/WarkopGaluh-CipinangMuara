'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu as MenuIcon, UserCircle, Clock, LogOut } from 'lucide-react';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export default function AdminHeader({ onToggleMobileMenu }: HeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-[#E7E0D8] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] text-[#57534E] hover:text-[#1C1917]"
          aria-label="Open Sidebar"
        >
          <MenuIcon className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#1C1917] font-display">
            Warkop Galuh Management
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-[#57534E] bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#E7E0D8]">
          <Clock className="w-3.5 h-3.5 text-stone-600" />
          <span>Status: <strong className="text-emerald-700">Buka</strong></span>
        </div>

        <div className="flex items-center gap-2.5 pl-3 border-l border-[#E7E0D8]">
          <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E7E0D8] flex items-center justify-center text-stone-700">
            <UserCircle className="w-5 h-5" />
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-[#1C1917] block leading-none">
              {session?.user?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-[#78716C]">
              {session?.user?.email || 'admin@warkop.com'}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="p-2 text-[#78716C] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
