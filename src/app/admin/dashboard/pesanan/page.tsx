'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingBag,
  Search,
  Trash2,
  RefreshCw,
  MessageCircle,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { IPesanan, StatusPesanan } from '@/types';
import { exportPesananToCsv } from '@/lib/exportCsv';

const ITEMS_PER_PAGE = 10;

export default function AdminPesananPage() {
  const [pesananList, setPesananList] = useState<IPesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('semua');
  const [search, setSearch] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  const fetchPesanan = useCallback(async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'semua' ? '/api/pesanan' : `/api/pesanan?status=${statusFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPesananList(data.data);
        setCurrentPage(1); // reset ke halaman 1 saat filter berubah
      }
    } catch (err) {
      console.error('Error fetching pesanan:', err);
      toast.error('Gagal mengambil daftar pesanan');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchPesanan();
  }, [fetchPesanan]);

  // Reset ke halaman 1 saat search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleUpdateStatus = async (id: string, newStatus: StatusPesanan) => {
    try {
      const res = await fetch(`/api/pesanan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(`Status diubah ke "${newStatus}"`);
        setPesananList((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
      } else {
        toast.error('Gagal mengubah status: ' + result.message);
      }
    } catch (err) {
      console.error('Update status error:', err);
      toast.error('Terjadi kesalahan saat mengubah status');
    }
  };

  const handleDeletePesanan = async (id: string) => {
    try {
      const res = await fetch(`/api/pesanan/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Pesanan berhasil dihapus');
        setDeleteConfirmId(null);
        setPesananList((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error('Gagal menghapus pesanan: ' + result.message);
      }
    } catch (err) {
      console.error('Delete pesanan error:', err);
      toast.error('Terjadi kesalahan saat menghapus');
    }
  };

  const handleExportCsv = () => {
    setExporting(true);
    try {
      const filterLabel = statusFilter === 'semua' ? 'semua' : statusFilter;
      exportPesananToCsv(filteredPesanan, `pesanan-${filterLabel}`);
      toast.success(`Berhasil mengekspor ${filteredPesanan.length} pesanan ke CSV`);
    } catch {
      toast.error('Gagal mengekspor data');
    } finally {
      setExporting(false);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const filteredPesanan = pesananList.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.noHP.includes(search) ||
      item.menu.some((m) => m.nama.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredPesanan.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPesanan = filteredPesanan.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'diproses':
        return 'bg-blue-50 text-blue-900 border-blue-300';
      case 'selesai':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      default:
        return 'bg-rose-50 text-rose-900 border-rose-300';
    }
  };

  const generateWhatsAppChatUrl = (p: IPesanan) => {
    const cleanPhone = p.noHP.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('0')
      ? `62${cleanPhone.slice(1)}`
      : cleanPhone;

    let statusText = 'sedang kami siapkan';
    if (p.status === 'diproses') statusText = 'sedang diracik';
    if (p.status === 'selesai') statusText = 'sudah siap dinikmati';

    const msg = `Halo Kak *${p.nama}*! Pesanan Warkop Galuh Anda (#${p._id?.slice(-6).toUpperCase()}) ${statusText}. Total: ${formatRupiah(p.totalHarga)}. Terima kasih.`;
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-display">
            Kelola Pesanan Masuk
          </h1>
          <p className="text-xs text-[#78716C]">
            Pantau dan ubah status pesanan pelanggan Warkop Galuh
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            disabled={exporting || filteredPesanan.length === 0}
            className="px-3 py-2 rounded-lg bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Ekspor pesanan yang tampil ke file CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={fetchPesanan}
            className="p-2 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#57534E] border border-[#E7E0D8] text-xs font-semibold flex items-center gap-1.5 shadow-xs w-fit"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#E7E0D8] shadow-xs">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'Semua Status', value: 'semua' },
            { label: 'Menunggu', value: 'pending' },
            { label: 'Diproses', value: 'diproses' },
            { label: 'Selesai', value: 'selesai' },
            { label: 'Dibatalkan', value: 'dibatalkan' },
          ].map((st) => (
            <button
              key={st.value}
              onClick={() => setStatusFilter(st.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st.value
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] border border-[#E7E0D8]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pemesan / HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] text-[#1C1917] text-xs focus:outline-none focus:border-stone-900"
          />
        </div>
      </div>

      {/* Result count */}
      {!loading && filteredPesanan.length > 0 && (
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>
            Menampilkan{' '}
            <strong className="text-stone-900">
              {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, filteredPesanan.length)}
            </strong>{' '}
            dari{' '}
            <strong className="text-stone-900">{filteredPesanan.length}</strong>{' '}
            pesanan
          </span>
          {totalPages > 1 && (
            <span className="text-stone-400">
              Halaman {currentPage} / {totalPages}
            </span>
          )}
        </div>
      )}

      {/* Orders List */}
      {loading ? (
        <div className="py-20 text-center text-[#78716C] text-xs">
          <div className="w-8 h-8 border-2 border-[#E7E0D8] border-t-stone-900 rounded-full animate-spin mx-auto mb-2" />
          <p>Memuat pesanan...</p>
        </div>
      ) : filteredPesanan.length === 0 ? (
        <div className="py-16 text-center text-[#A8A29E] bg-white rounded-xl border border-[#E7E0D8] space-y-2 p-6 shadow-xs">
          <ShoppingBag className="w-8 h-8 mx-auto text-[#D6CEC5]" />
          <p className="text-xs">Tidak ada pesanan di status ini.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3.5">
            {paginatedPesanan.map((pesanan) => (
              <div
                key={pesanan._id}
                className="p-4 sm:p-5 rounded-xl bg-white border border-[#E7E0D8] shadow-xs space-y-3.5"
              >
                {/* Top Row: Customer Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EFEA] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] text-stone-900 border border-[#E7E0D8] flex items-center justify-center font-bold text-xs">
                      {pesanan.nama.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1C1917] font-display">
                        {pesanan.nama}
                      </h3>
                      <p className="text-xs text-[#78716C]">
                        <span>{pesanan.noHP}</span>
                        <span className="mx-1.5">•</span>
                        <span className="font-mono text-stone-900 font-semibold">
                          #{pesanan._id?.slice(-6).toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
                    <Calendar className="w-3.5 h-3.5 text-stone-600" />
                    <span>
                      {pesanan.createdAt
                        ? new Date(pesanan.createdAt).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </span>
                  </div>
                </div>

                {/* Items & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start">
                  <div className="md:col-span-8 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#A8A29E] tracking-wider block">
                      Daftar Menu:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {pesanan.menu.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-md bg-[#FAF8F5] border border-[#E7E0D8] text-xs flex justify-between items-center"
                        >
                          <span className="font-medium text-[#1C1917]">
                            {item.nama} <strong className="text-stone-900">×{item.jumlah}</strong>
                          </span>
                          <span className="text-[#78716C] font-mono text-[11px]">
                            {formatRupiah(item.harga * item.jumlah)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {pesanan.catatan && pesanan.catatan !== 'tidak ada catatan' && (
                      <div className="p-2.5 rounded-md bg-[#FAF8F5] border border-[#E7E0D8] text-xs text-[#57534E]">
                        <strong className="text-stone-900">Catatan:</strong> {pesanan.catatan}
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="md:col-span-4 p-3 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#78716C]">Total:</span>
                      <span className="text-sm font-extrabold text-stone-900 font-display">
                        {formatRupiah(pesanan.totalHarga)}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-[#78716C] mb-1">
                        Status:
                      </label>
                      <select
                        value={pesanan.status}
                        onChange={(e) =>
                          handleUpdateStatus(pesanan._id as string, e.target.value as StatusPesanan)
                        }
                        className={`w-full px-2 py-1.5 rounded-md text-xs font-semibold border focus:outline-none ${getStatusColor(
                          pesanan.status
                        )}`}
                      >
                        <option value="pending">Menunggu (Pending)</option>
                        <option value="diproses">Sedang Diproses</option>
                        <option value="selesai">Selesai</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <a
                        href={generateWhatsAppChatUrl(pesanan)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        title="WhatsApp Pemesan"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WA</span>
                      </a>

                      <button
                        onClick={() => setDeleteConfirmId(pesanan._id || null)}
                        className="p-1.5 rounded-md bg-white hover:bg-rose-50 text-[#78716C] hover:text-rose-700 border border-[#E7E0D8] transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-[#E7E0D8] text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                  )
                  .reduce<(number | '...')[]>((acc, page, idx, arr) => {
                    if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) {
                      acc.push('...');
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((page, idx) =>
                    page === '...' ? (
                      <span key={`dots-${idx}`} className="px-1 text-stone-400 text-xs">
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          currentPage === page
                            ? 'bg-stone-900 text-white'
                            : 'bg-white border border-[#E7E0D8] text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white border border-[#E7E0D8] text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal Delete */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E7E0D8] rounded-xl max-w-xs w-full p-5 space-y-3 shadow-xl text-center">
            <h3 className="text-sm font-bold text-[#1C1917]">Hapus Pesanan Ini?</h3>
            <p className="text-xs text-[#78716C]">
              Data transaksi akan dihapus permanen.
            </p>
            <div className="flex justify-center gap-2 pt-1">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] text-[#57534E] text-xs font-semibold border border-[#E7E0D8]"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeletePesanan(deleteConfirmId)}
                className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
