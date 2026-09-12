'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieIcon, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ShoppingBag,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { IPesanan, IMenuItem } from '@/types';

interface DashboardChartsProps {
  pesananList: IPesanan[];
  menus: IMenuItem[];
}

export default function DashboardCharts({ pesananList, menus }: DashboardChartsProps) {
  const [timeRange, setTimeRange] = useState<'7days' | 'today' | 'all'>('7days');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{ label: string; omset: number; count: number } | null>(null);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  // 1. STATS CALCULATION
  const totalPesanan = pesananList.length;
  const pesananPending = pesananList.filter((p) => p.status === 'pending').length;
  const pesananDiproses = pesananList.filter((p) => p.status === 'diproses').length;
  const pesananSelesai = pesananList.filter((p) => p.status === 'selesai').length;
  const pesananDibatalkan = pesananList.filter((p) => p.status === 'dibatalkan').length;

  const totalOmset = pesananList
    .filter((p) => p.status === 'selesai')
    .reduce((acc, curr) => acc + (curr.totalHarga || 0), 0);

  const pendingOmset = pesananList
    .filter((p) => p.status === 'pending' || p.status === 'diproses')
    .reduce((acc, curr) => acc + (curr.totalHarga || 0), 0);

  const conversionRate = totalPesanan > 0 ? Math.round((pesananSelesai / totalPesanan) * 100) : 0;

  // 2. DAILY TREND CHART DATA (Past 7 Days)
  const getLast7DaysData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
      const fullDateStr = d.toISOString().split('T')[0];

      // Filter orders on this day
      const ordersOnDay = pesananList.filter((p) => {
        if (!p.createdAt) return false;
        const pDate = new Date(p.createdAt).toISOString().split('T')[0];
        return pDate === fullDateStr;
      });

      const dayOmset = ordersOnDay
        .filter((p) => p.status === 'selesai')
        .reduce((sum, p) => sum + (p.totalHarga || 0), 0);

      days.push({
        label: dateStr,
        fullDate: fullDateStr,
        omset: dayOmset,
        count: ordersOnDay.length,
      });
    }
    return days;
  };

  const chartData = getLast7DaysData();
  const maxOmset = Math.max(...chartData.map((d) => d.omset), 50000);
  const maxCount = Math.max(...chartData.map((d) => d.count), 5);

  // SVG dimensions for chart
  const svgWidth = 500;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index / (chartData.length - 1)) * (svgWidth - paddingX * 2);
    const y = svgHeight - paddingY - (d.omset / maxOmset) * (svgHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const svgPath = points.reduce((acc, curr, index) => {
    if (index === 0) return `M ${curr.x} ${curr.y}`;
    // Simple smooth curve
    const prev = points[index - 1];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = points.length > 0 
    ? `${svgPath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  // 3. TOP SELLING MENU RANKING
  const menuSalesMap: { [nama: string]: { qty: number; revenue: number; kategori: string } } = {};

  pesananList.forEach((order) => {
    order.menu.forEach((item) => {
      const itemKey = item.nama;
      if (!menuSalesMap[itemKey]) {
        menuSalesMap[itemKey] = {
          qty: 0,
          revenue: 0,
          kategori: 'Menu',
        };
      }
      menuSalesMap[itemKey].qty += item.jumlah || 1;
      menuSalesMap[itemKey].revenue += (item.harga || 0) * (item.jumlah || 1);
    });
  });

  const topMenuItems = Object.entries(menuSalesMap)
    .map(([nama, stat]) => ({ nama, ...stat }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const highestQty = topMenuItems.length > 0 ? Math.max(...topMenuItems.map((m) => m.qty)) : 1;

  // 4. DONUT STATUS BREAKDOWN
  const statusItems = [
    { label: 'Selesai (Lunas)', count: pesananSelesai, color: '#10B981', bg: 'bg-emerald-500' },
    { label: 'Diproses', count: pesananDiproses, color: '#3B82F6', bg: 'bg-blue-500' },
    { label: 'Menunggu', count: pesananPending, color: '#F59E0B', bg: 'bg-amber-500' },
    { label: 'Dibatalkan', count: pesananDibatalkan, color: '#EF4444', bg: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 2-Column Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT: Revenue & Orders Trend Area Chart (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-[#DFD7CC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EFEA] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-stone-100 text-stone-900">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm sm:text-base text-[#18120F] font-display">
                  Grafik Omset & Tren Pesanan
                </h3>
              </div>
              <p className="text-[11px] text-[#78716C] mt-0.5">
                Pantauan pergerakan penjualan dan pembayaran 7 hari terakhir
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-300">
                Total: {formatRupiah(totalOmset)}
              </span>
            </div>
          </div>

          {/* Interactive SVG Area Curve */}
          <div className="relative pt-2">
            {hoveredDataPoint && (
              <div className="absolute top-0 right-2 bg-[#18120F] text-white text-[11px] px-3 py-1.5 rounded-lg shadow-lg pointer-events-none animate-fade-in z-10 flex items-center gap-2">
                <span className="font-bold">{hoveredDataPoint.label}:</span>
                <span className="text-emerald-400 font-bold">{formatRupiah(hoveredDataPoint.omset)}</span>
                <span className="text-[#A8A29E]">({hoveredDataPoint.count} order)</span>
              </div>
            )}

            <div className="w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-44 sm:h-52 overflow-visible"
              >
                <defs>
                  <linearGradient id="omsetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1C1917" stopOpacity="0.20" />
                    <stop offset="100%" stopColor="#1C1917" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = paddingY + ratio * (svgHeight - paddingY * 2);
                  return (
                    <line
                      key={i}
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#F0EAE1"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Shaded Area */}
                {areaPath && (
                  <path
                    d={areaPath}
                    fill="url(#omsetGradient)"
                    className="transition-all duration-500 ease-out"
                  />
                )}

                {/* Smooth Curve Line */}
                {svgPath && (
                  <path
                    d={svgPath}
                    fill="none"
                    stroke="#1C1917"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500 ease-out"
                  />
                )}

                {/* Data Point Circles */}
                {points.map((pt, i) => (
                  <g key={i} className="cursor-pointer group">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#FFFFFF"
                      stroke="#1C1917"
                      strokeWidth="2.5"
                      className="transition-all duration-200 group-hover:r-6 group-hover:fill-stone-900 group-hover:stroke-white shadow-md"
                      onMouseEnter={() => setHoveredDataPoint(pt)}
                      onMouseLeave={() => setHoveredDataPoint(null)}
                    />
                    {/* X-axis labels */}
                    <text
                      x={pt.x}
                      y={svgHeight - 6}
                      textAnchor="middle"
                      className="text-[10px] fill-[#78716C] font-semibold select-none"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F4EFEA] text-center">
            <div className="p-2 rounded-lg bg-[#FAF5EE]">
              <span className="text-[10px] text-[#78716C] block">Omset Masuk (Lunas)</span>
              <span className="text-xs sm:text-sm font-extrabold text-emerald-800">
                {formatRupiah(totalOmset)}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[#FAF5EE]">
              <span className="text-[10px] text-[#78716C] block">Menunggu Bayar</span>
              <span className="text-xs sm:text-sm font-extrabold text-amber-700">
                {formatRupiah(pendingOmset)}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-[#FAF5EE]">
              <span className="text-[10px] text-[#78716C] block">Tingkat Konversi</span>
              <span className="text-xs sm:text-sm font-extrabold text-stone-900">
                {conversionRate}% Selesai
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Status Pembayaran & Order Breakdown (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-[#DFD7CC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-[#F4EFEA] pb-4">
              <span className="p-1.5 rounded-lg bg-stone-100 text-stone-900">
                <PieIcon className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-[#18120F] font-display">
                  Status Pesanan & Kasir
                </h3>
                <p className="text-[11px] text-[#78716C]">
                  Distribusi pesanan aktif & transaksi terselesaikan
                </p>
              </div>
            </div>

            {/* Status Progress Bars */}
            <div className="space-y-3 pt-4">
              {statusItems.map((st) => {
                const percentage = totalPesanan > 0 ? Math.round((st.count / totalPesanan) * 100) : 0;
                return (
                  <div key={st.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#18120F] flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${st.bg}`} />
                        <span>{st.label}</span>
                      </span>
                      <span className="font-mono text-[#78716C]">
                        <strong className="text-[#18120F]">{st.count}</strong> pesanan ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF5EE] h-2 rounded-full overflow-hidden border border-[#DFD7CC]/60">
                      <div
                        className={`h-full ${st.bg} transition-all duration-700 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="p-3.5 rounded-xl bg-[#FAF5EE] border border-[#DFD7CC] flex items-center gap-3 mt-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#18120F]">Pembayaran Otomatis QRIS</p>
              <p className="text-[11px] text-[#78716C] leading-snug">
                Pelanggan mengirim bukti transfer langsung via WhatsApp untuk diverifikasi kasir.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM: Top Selling Menu Analytics */}
      <div className="bg-white border border-[#DFD7CC] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-stone-100 text-stone-900">
              <Flame className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#18120F] font-display">
                Menu Terlaris & Paling Diminati (Ranking)
              </h3>
              <p className="text-[11px] text-[#78716C]">
                Menu dengan penjualan tertinggi berdasarkan jumlah pemesanan pelanggan
              </p>
            </div>
          </div>

          <span className="text-[11px] text-[#78716C] font-semibold hidden sm:inline">
            Top 5 Menu Terfavorit
          </span>
        </div>

        {topMenuItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#A8A29E]">
            Belum ada data pesanan menu untuk dianalisis.
          </div>
        ) : (
          <div className="space-y-3">
            {topMenuItems.map((item, idx) => {
              const barWidth = Math.round((item.qty / highestQty) * 100);
              return (
                <div key={item.nama} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        idx === 0 ? 'bg-stone-900 text-white shadow-xs' :
                        idx === 1 ? 'bg-stone-400 text-white' :
                        idx === 2 ? 'bg-stone-300 text-stone-900' :
                        'bg-stone-100 text-stone-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="font-bold text-[#18120F] truncate">{item.nama}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[#78716C] font-mono text-[11px]">
                        <strong>{item.qty}</strong> porsi terjual
                      </span>
                      <span className="text-stone-900 font-bold font-mono text-xs">
                        {formatRupiah(item.revenue)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className="h-full bg-stone-900 rounded-full transition-all duration-700"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
