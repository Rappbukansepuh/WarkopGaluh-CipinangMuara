import React from 'react';
import { MapPin, Phone, Clock, Navigation, Check, Coffee } from 'lucide-react';

export default function LokasiPage() {
  const address = 'Jl. Cipinang Muara 2 RT 4/RW 2, Jatinegara, Jakarta Timur';
  const googleMapsUrl = 'https://www.google.com/search?sca_esv=1f9121a7cdf920c7&sxsrf=APpeQnuW5G0dlQyCbWzdWoDG3jzXsRsXeg:1789019368075&kgmid=/g/11nv7157sw&q=Warkop+Galuh+Cipinang+muara&shem=dlvs1,epsd1,ltae,rimspwouoe&shndl=30&source=sh/x/loc/uni/m1/1&kgs=d4a2503c5f451bc3&utm_source=dlvs1,epsd1,ltae,rimspwouoe,sh/x/loc/uni/m1/1';
  const waNumber = '6285817197972';

  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
      
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>Buka Setiap Hari: 09.00 – 00.00 WIB</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 font-display tracking-tight">
          Lokasi & Kontak
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-xl">
          Alamat lengkap, rute Google Maps, jam operasional, dan nomor kontak WhatsApp Warkop Galuh.
        </p>
      </div>

      {/* Main Grid: Google Maps + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* Left Column: Embed Google Maps */}
        <div className="lg:col-span-7 rounded-xl overflow-hidden bg-white border border-stone-200 shadow-xs">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-bold text-stone-900">Peta Warkop Galuh</span>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-stone-800 hover:text-stone-950 font-semibold flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Buka di Google Maps ↗</span>
            </a>
          </div>

          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-stone-100">
            <iframe
              src="https://maps.google.com/maps?q=Warkop%20Galuh%20Cipinang%20Muara&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Warkop Galuh"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Right Column: Address & Details */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card Alamat & Kontak */}
          <div className="rounded-xl bg-white border border-stone-200 p-5 sm:p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 font-display">
              <MapPin className="w-4 h-4 text-stone-700" />
              <span>Alamat Lengkap</span>
            </h2>

            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              {address}
            </p>

            <div className="pt-2 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <p className="font-semibold text-stone-800">Patokan / Area:</p>
              <p className="text-stone-500">
                Kawasan Cipinang Muara 2, dekat pemukiman warga dan jalur santai tembus ke Jatinegara. Parkir motor tersedia tepat di depan warkop.
              </p>
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="rounded-xl bg-white border border-stone-200 p-5 sm:p-6 space-y-3 shadow-xs">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 font-display">
              <Clock className="w-4 h-4 text-stone-700" />
              <span>Jam Operasional</span>
            </h2>

            <div className="text-xs space-y-1 text-stone-600">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Senin – Minggu:</span>
                <strong className="text-stone-900 font-semibold">09.00 – 00.00 WIB</strong>
              </div>
              <p className="text-stone-400 text-[11px] pt-1">
                Buka setiap hari sampai tengah malam. Hari libur nasional tetap buka.
              </p>
            </div>
          </div>

          {/* Kontak Langsung */}
          <div className="rounded-xl bg-stone-900 text-white p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Coffee className="w-4 h-4 text-stone-300" />
              <h2 className="text-sm font-bold font-display">Ada Pertanyaan atau Mau Pesan?</h2>
            </div>
            <p className="text-stone-300 text-xs leading-relaxed">
              Silakan hubungi WhatsApp kami untuk menanyakan stok menu, reservasi meja, atau pesanan bawa pulang.
            </p>
            <a
              href={`https://wa.me/${waNumber}?text=Halo%20Warkop%20Galuh,%20saya%20mau%20tanya`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-100 hover:bg-emerald-700 text-black text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
