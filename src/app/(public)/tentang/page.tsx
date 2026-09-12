import React from 'react';
import Link from 'next/link';
import {
  Coffee,
  Heart,
  Clock,
  MapPin,
  Wifi,
  Zap,
  ShoppingBag,
  ArrowRight,
  Star,
  Users,
} from 'lucide-react';

const MILESTONES = [
  {
    year: '2018',
    title: 'Awal Mula',
    desc: 'Warkop Galuh berdiri dari keinginan sederhana: menyediakan tempat nyaman untuk warga Cipinang Muara berkumpul, ngobrol, dan ngopi tanpa harus jauh-jauh.',
  },
  {
    year: '2020',
    title: 'Berkembang',
    desc: 'Di masa pandemi, kami mulai melayani pesanan bungkus dan delivery kecil-kecilan. Dukungan pelanggan setia membuat kami terus bertahan.',
  },
  {
    year: '2023',
    title: 'Upgrade Fasilitas',
    desc: 'Penambahan WiFi kencang, colokan listrik di setiap meja, dan area parkir motor membuat warkop makin ramai didatangi pelajar dan pekerja muda.',
  },
  {
    year: '2024',
    title: 'Go Digital',
    desc: 'Warkop Galuh kini hadir secara online. Pelanggan bisa lihat menu, pesan, dan bayar via QRIS — semuanya dari genggaman tangan.',
  },
];

const VALUES = [
  {
    icon: Heart,
    title: 'Kebersamaan',
    desc: 'Kami percaya bahwa secangkir kopi terbaik dinikmati bersama orang-orang yang peduli satu sama lain.',
  },
  {
    icon: Star,
    title: 'Kualitas Pas',
    desc: 'Bukan yang paling mahal, tapi selalu tepat rasa. Kopi, mie, dan minuman kami disajikan dengan takaran konsisten setiap hari.',
  },
  {
    icon: Users,
    title: 'Melayani Semua',
    desc: 'Dari pelajar hingga bapak-bapak RT, semua disambut hangat tanpa beda. Warkop adalah ruang untuk semua.',
  },
];

export default function TentangPage() {
  return (
    <div className="pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-24 max-w-6xl mx-auto px-4 sm:px-6 space-y-14 sm:space-y-20">

      {/* 1. Hero Section */}
      <section className="space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700">
          <Coffee className="w-3.5 h-3.5 text-stone-600" />
          <span>Cerita Kami</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15] font-display">
              Tentang Warkop Galuh
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Warkop Galuh lahir dari semangat sederhana — menjadi tempat berkumpul yang hangat, merakyat,
              dan terjangkau untuk warga sekitar Cipinang Muara 2, Jatinegara, Jakarta Timur.
            </p>
            <p className="text-stone-500 text-sm leading-relaxed">
              Bukan kafe mewah dengan menu aneh-aneh. Kami hanya warung kopi yang jujur: kopi enak,
              mie hangat, dan suasana yang bikin betah sampai tengah malam.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/menu"
                className="px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>Lihat Menu Kami</span>
              </Link>
              <Link
                href="/lokasi"
                className="px-4 py-2.5 rounded-lg bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold border border-stone-300 inline-flex items-center gap-2 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Temukan Lokasi</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Tahun Berdiri', value: '2018', sub: 'Cipinang Muara' },
              { label: 'Jam Buka', value: '15+', sub: 'Jam per hari' },
              { label: 'Menu Tersedia', value: '13+', sub: 'Pilihan minuman & makanan' },
              { label: 'Buka', value: '7/7', sub: 'Hari, termasuk libur' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs text-center space-y-1"
              >
                <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-stone-700">{stat.label}</div>
                <div className="text-[11px] text-stone-400">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Values */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500 block">
            Nilai Kami
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            Apa yang Kami Percaya
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3"
              >
                <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-stone-700" />
                </div>
                <h3 className="font-bold text-sm text-stone-900 font-display">{v.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Timeline */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500 block">
            Perjalanan Kami
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            Dari Warung Sederhana ke Warkop Digital
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-stone-200 hidden sm:block" />

          <div className="space-y-6">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="flex gap-5 items-start">
                <div className="shrink-0 w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center text-[11px] font-bold z-10 relative">
                  {i + 1}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-bold text-stone-400">{m.year}</span>
                    <h3 className="text-sm font-bold text-stone-900 font-display">{m.title}</h3>
                  </div>
                  <p className="text-xs text-stone-500 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Fasilitas */}
      <section className="rounded-2xl bg-white border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-wider uppercase text-stone-500 block">
            Fasilitas
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-display">
            Kenapa Nyaman di Sini?
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          {[
            { icon: Wifi, label: 'WiFi Kencang', sub: 'Gratis tanpa limit' },
            { icon: Zap, label: 'Colokan Listrik', sub: 'Di setiap meja' },
            { icon: MapPin, label: 'Parkir Motor', sub: 'Tersedia di depan' },
            { icon: Clock, label: 'Buka Sampai Malam', sub: '09.00 – 00.00 WIB' },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-center"
              >
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center mx-auto">
                  <Icon className="w-4 h-4 text-stone-700" />
                </div>
                <p className="font-bold text-stone-900">{f.label}</p>
                <p className="text-stone-500 text-[11px]">{f.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. CTA */}
      <section className="rounded-2xl bg-stone-900 text-white p-8 sm:p-12 text-center space-y-5">
        <Coffee className="w-8 h-8 mx-auto text-stone-400" />
        <h2 className="text-xl sm:text-2xl font-bold font-display">
          Yuk, Mampir ke Warkop Galuh!
        </h2>
        <p className="text-stone-400 text-sm max-w-md mx-auto leading-relaxed">
          Pesan sekarang lewat website atau datang langsung. Kami selalu siap menyambut dengan
          kopi hangat dan suasana santai.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/pesan"
            className="px-5 py-2.5 rounded-lg bg-white hover:bg-stone-100 text-stone-900 font-semibold text-sm inline-flex items-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pesan Sekarang</span>
          </Link>
          <Link
            href="/lokasi"
            className="px-5 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors border border-stone-700"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Lihat Lokasi</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
