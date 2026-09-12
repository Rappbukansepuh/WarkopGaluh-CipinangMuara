'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Download, Copy, Check, QrCode, Smartphone, Info } from 'lucide-react';
import { toast } from 'sonner';

interface QrisModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalHarga?: number;
  orderId?: string;
}

export default function QrisModal({ isOpen, onClose, totalHarga, orderId }: QrisModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const handleCopyNominal = () => {
    if (totalHarga) {
      navigator.clipboard.writeText(totalHarga.toString());
      setCopied(true);
      toast.success(`Nominal ${formatRupiah(totalHarga)} disalin ke papan klip!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#DFD7CC] overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#FAF5EE] border-b border-[#DFD7CC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#18120F] font-display">
                QRIS Warkop Galuh
              </h3>
              <p className="text-[11px] text-[#78716C]">Scan barcode untuk pembayaran instan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#DFD7CC] hover:bg-[#EFE7DC] text-[#5C4F47] hover:text-[#18120F] flex items-center justify-center transition-colors shadow-xs"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Nominal Box (If provided) */}
          {totalHarga !== undefined && totalHarga > 0 && (
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-[#5C4F47] font-medium">
                  {orderId ? `Total Pesanan (#${orderId})` : 'Total Pembayaran'}
                </div>
                <div className="text-lg sm:text-xl font-extrabold text-stone-900 font-display">
                  {formatRupiah(totalHarga)}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyNominal}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                title="Salin nominal angka"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-600" />
                    <span>Salin Nominal</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* QR Code Big Container */}
          <div className="flex flex-col items-center bg-white p-3 rounded-xl border border-[#DFD7CC] shadow-inner">
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[3/4] rounded-lg overflow-hidden bg-white shadow-sm border border-[#EBE3D8]">
              <Image
                src="/images/qris-warkop.jpg"
                alt="QRIS Warkop Galuh Full Size"
                fill
                priority
                className="object-contain p-1.5"
                sizes="(max-width: 640px) 280px, 320px"
              />
            </div>
            
            <p className="text-[11px] font-bold text-[#18120F] mt-2.5">
              NMID: ID1026562786982 • Warkop Galuh
            </p>
            <p className="text-[10px] text-[#78716C]">
              Mendukung: BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay, dll.
            </p>
          </div>

          {/* Smartphone Scanning Tip */}
          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-700 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-stone-900">
              <Smartphone className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              <span>Buka dari HP Anda?</span>
            </div>
            <p className="leading-relaxed text-stone-600 text-[11px]">
              Klik tombol <strong>Unduh Gambar QRIS</strong> di bawah, lalu buka aplikasi e-Wallet / m-Banking kamu dan pilih menu <strong>Upload QR dari Galeri Foto</strong>.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAF5EE] border-t border-[#DFD7CC] flex flex-col sm:flex-row gap-2.5">
          <a
            href="/images/qris-warkop.jpg"
            download="QRIS-Warkop-Galuh.jpg"
            className="flex-1 px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs text-center"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Gambar QRIS</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg bg-white border border-[#DFD7CC] hover:bg-[#EFE7DC] text-[#18120F] font-semibold text-xs transition-all active:scale-98 shadow-xs text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
