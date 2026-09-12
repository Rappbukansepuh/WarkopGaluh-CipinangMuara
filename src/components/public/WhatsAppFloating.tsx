'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface Props {
  phoneNumber?: string;
  defaultMessage?: string;
}

export default function WhatsAppFloating({
  phoneNumber = '6285817197972',
  defaultMessage = 'Halo Warkop Galuh, saya ingin pesan/tanya menu.',
}: Props) {
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      aria-label="Kontak WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex items-center group animate-float"
    >
      <span className="hidden md:block mr-2.5 px-3 py-1.5 bg-[#18120F] text-white text-xs font-semibold rounded-lg shadow-md border border-[#DFD7CC]/20 opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-200 pointer-events-none whitespace-nowrap">
        Hubungi via WhatsApp
      </span>

      <div className="relative flex items-center justify-center">
        {/* Radar Ping Animation Behind Button */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-75 animate-radar-ping pointer-events-none"></span>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label="Chat WhatsApp Warkop Galuh"
        >
          <MessageCircle className="w-6 h-6 transition-transform group-hover:rotate-12 duration-300" />
        </a>
      </div>
    </div>
  );
}
