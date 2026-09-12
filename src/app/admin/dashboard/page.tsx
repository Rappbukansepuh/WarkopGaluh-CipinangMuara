'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  RefreshCw,
  Plus,
  Radio,
  Sparkles,
  MessageCircle,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { IPesanan, IMenuItem, StatusPesanan } from '@/types';
import DashboardCharts from '@/components/admin/DashboardCharts';

export default function AdminDashboardPage() {
  const [menus, setMenus] = useState<IMenuItem[]>([]);
  const [pesananList, setPesananList] = useState<IPesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const prevCountRef = useRef(0);

  const fetchData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const [resMenu, resPesanan] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/pesanan'),
      ]);

      const dataMenu = await resMenu.json();
      const dataPesanan = await resPesanan.json();

      if (dataMenu.success) setMenus(dataMenu.data);
      if (dataPesanan.success) {
        const newOrders = dataPesanan.data;
        // Detect if a new order arrived in real-time
        if (prevCountRef.current > 0 && newOrders.length > prevCountRef.current) {
          const newest = newOrders[0];
          toast.success(`🔔 Pesanan Baru Masuk dari ${newest?.nama || 'Pelanggan'}!`, {
            description: `Total: ${formatRupiah(newest?.totalHarga || 0)}`,
          });
        }
        prevCountRef.current = newOrders.length;
        setPesananList(newOrders);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time polling every 10 seconds
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      fetchData(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoSync, fetchData]);

  const handleUpdateStatus = async (id: string, newStatus: StatusPesanan) => {
    try {
      // Optimistic UI update
      setPesananList((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus } : item))
      );

      const res = await fetch(`/api/pesanan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`Status pesanan diperbarui ke "${newStatus}"! Grafik diperbarui.`);
      } else {
        toast.error('Gagal mengubah status: ' + result.message);
        fetchData();
      }
    } catch (err) {
      console.error('Update status error:', err);
      toast.error('Terjadi kesalahan saat memperbarui status');
      fetchData();
    }
  };

  const handleSimulateOrder = async () => {
    try {
      setSimulating(true);
      const randomNames = ['Dimas Pratama', 'Siti Rahma', 'Bagas Aditya', 'Naufal Rizky', 'Dewi Lestari'];
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      const sampleItem = menus.length > 0 ? menus[Math.floor(Math.random() * menus.length)] : { nama: 'Kapal Api Mix', harga: 5000 };

      const payload = {
        nama: randomName,
        noHP: '08' + Math.floor(1000000000 + Math.random() * 9000000000),
        menu: [
          {
            nama: sampleItem.nama,
            harga: sampleItem.harga,
            jumlah: Math.floor(Math.random() * 3) + 1,
          },
        ],
        catatan: 'Pesanan simulasi uji coba real-time dashboard',
      };

      const res = await fetch('/api/pesanan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(`✨ Berhasil mensimulasikan pesanan baru (${randomName})!`);
        await fetchData(true);
      } else {
        toast.error('Gagal simulasi pesanan: ' + result.message);
      }
    } catch (err) {
      console.error('Simulate error:', err);
      toast.error('Gagal membuat simulasi pesanan');
    } finally {
      setSimulating(false);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Stats
  const totalMenu = menus.length;
  const totalPesanan = pesananList.length;
  const pesananPending = pesananList.filter((p) => p.status === 'pending').length;
  const pesananDiproses = pesananList.filter((p) => p.status === 'diproses').length;
  const pesananSelesai = pesananList.filter((p) => p.status === 'selesai').length;

  const totalOmset = pesananList
    .filter((p) => p.status === 'selesai')
    .reduce((acc, curr) => acc + (curr.totalHarga || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">Menunggu</span>;
      case 'diproses':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-300">Diproses</span>;
      case 'selesai':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">Selesai (Lunas)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-300">Dibatalkan</span>;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      
      {/* Top Banner & Telemetry Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#18120F] tracking-tight font-display">
              Ringkasan & Analisis Dashboard
            </h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>Live Telemetri</span>
            </div>
          </div>
          <p className="text-xs text-[#78716C] mt-0.5">
            Aktivitas harian pesanan, pendapatan QRIS, dan status kasir Warkop Galuh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Test Order Simulator */}
          <button
            onClick={handleSimulateOrder}
            disabled={simulating}
            className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
            title="Klik untuk membuat simulasi pesanan masuk dan melihat grafik bereaksi"
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-600" />
            <span>{simulating ? 'Membuat...' : '+ Tes Pesanan Masuk'}</span>
          </button>

          <button
            onClick={() => fetchData()}
            className="p-2 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#57534E] border border-[#DFD7CC] text-xs font-medium flex items-center gap-1.5 shadow-xs active:scale-95"
            title="Refresh Data Sekarang"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/admin/dashboard/menu"
            className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-98"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Menu</span>
          </Link>
        </div>
      </div>

      {/* Stats Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#DFD7CC] space-y-2 shadow-xs hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#78716C]">Total Pesanan</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#18120F] font-display">
            {totalPesanan}
          </div>
          <div className="text-[11px] text-[#78716C]">
            <strong className="text-amber-700">{pesananPending}</strong> pesanan belum diproses
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#DFD7CC] space-y-2 shadow-xs hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Perlu Diproses</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-800 font-display">
            {pesananPending}
          </div>
          <div className="text-[11px] text-[#78716C]">
            <strong className="text-blue-700">{pesananDiproses}</strong> sedang disiapkan
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#DFD7CC] space-y-2 shadow-xs hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#78716C]">Katalog Menu</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#18120F] font-display">
            {totalMenu}
          </div>
          <div className="text-[11px] text-[#78716C]">
            Kopi, makanan, & minuman ready
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#DFD7CC] space-y-2 shadow-xs hover:border-stone-400 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Total Omset Selesai</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-emerald-800 font-display">
            {formatRupiah(totalOmset)}
          </div>
          <div className="text-[11px] text-[#78716C]">
            Dari <strong className="text-emerald-700">{pesananSelesai}</strong> transaksi lunas
          </div>
        </div>
      </div>

      {/* DASHBOARD CHARTS COMPONENT */}
      <DashboardCharts pesananList={pesananList} menus={menus} />

      {/* Recent Orders Section with Instant Status Controls */}
      <div className="rounded-2xl bg-white border border-[#DFD7CC] p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EFEA] pb-3.5">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#18120F] font-display">
              Pesanan Terbaru Masuk (Aksi Cepat)
            </h2>
            <p className="text-[11px] text-[#78716C]">
              Ubah status langsung dari tabel di bawah ini untuk memperbarui grafik secara otomatis
            </p>
          </div>

          <Link
            href="/admin/dashboard/pesanan"
            className="text-xs font-bold text-stone-900 hover:text-stone-700 inline-flex items-center gap-1"
          >
            <span>Buka Semua Pesanan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pesananList.length === 0 ? (
          <div className="py-12 text-center text-[#A8A29E] space-y-2 text-xs">
            <ShoppingBag className="w-8 h-8 mx-auto text-[#D6CEC5]" />
            <p className="font-medium">Belum ada transaksi pesanan saat ini.</p>
            <button
              onClick={handleSimulateOrder}
              className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-300 text-stone-900 font-semibold text-xs hover:bg-stone-200"
            >
              + Klik untuk Buat Pesanan Percobaan
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF5EE] text-[#5C4F47] border-y border-[#DFD7CC]">
                <tr>
                  <th className="px-3.5 py-2.5 font-bold">Waktu</th>
                  <th className="px-3.5 py-2.5 font-bold">Pemesan</th>
                  <th className="px-3.5 py-2.5 font-bold">Item Menu</th>
                  <th className="px-3.5 py-2.5 font-bold">Total Biaya</th>
                  <th className="px-3.5 py-2.5 font-bold">Status Saat Ini</th>
                  <th className="px-3.5 py-2.5 font-bold text-center">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFEA]">
                {pesananList.slice(0, 6).map((p) => (
                  <tr key={p._id} className="hover:bg-[#FAF5EE]/50 transition-colors">
                    <td className="px-3.5 py-3 text-[#78716C] whitespace-nowrap font-mono text-[11px]">
                      {p.createdAt ? new Date(p.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      <div className="font-bold text-[#18120F]">{p.nama}</div>
                      <div className="text-[11px] text-[#78716C] font-normal">{p.noHP}</div>
                    </td>
                    <td className="px-3.5 py-3 text-[#5C4F47]">
                      {p.menu.map((it, idx) => (
                        <div key={idx} className="leading-relaxed">
                          • {it.nama} <strong className="text-stone-900">({it.jumlah}x)</strong>
                        </div>
                      ))}
                      {p.catatan && (
                        <div className="text-[10px] text-[#A8A29E] italic mt-0.5">
                          Ket: {p.catatan}
                        </div>
                      )}
                    </td>
                    <td className="px-3.5 py-3 font-extrabold text-stone-900 whitespace-nowrap font-mono">
                      {formatRupiah(p.totalHarga)}
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="px-3.5 py-3 whitespace-nowrap text-center">
                      <select
                        value={p.status}
                        onChange={(e) => handleUpdateStatus(p._id as string, e.target.value as StatusPesanan)}
                        className="px-2 py-1 rounded-lg border border-[#DFD7CC] bg-white text-[#18120F] text-[11px] font-bold focus:outline-none focus:border-stone-900 shadow-xs cursor-pointer"
                      >
                        <option value="pending">Menunggu</option>
                        <option value="diproses">Diproses</option>
                        <option value="selesai">Selesai (Lunas)</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
