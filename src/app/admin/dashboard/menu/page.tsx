'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Upload, 
  X, 
  RefreshCw, 
  Coffee, 
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { IMenuItem, MenuKategori } from '@/types';

export default function AdminMenuPage() {
  const [menus, setMenus] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<IMenuItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    nama: string;
    deskripsi: string;
    harga: number;
    kategori: MenuKategori;
    gambar: string;
    isTersedia: boolean;
  }>({
    nama: '',
    deskripsi: '',
    harga: 10000,
    kategori: 'Kopi',
    gambar: '',
    isTersedia: true,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success) {
        setMenus(data.data);
      }
    } catch (err) {
      console.error('Error fetching menus:', err);
      toast.error('Gagal mengambil data menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const openAddModal = () => {
    setEditingMenu(null);
    setFormData({
      nama: '',
      deskripsi: '',
      harga: 10000,
      kategori: 'Kopi',
      gambar: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      isTersedia: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (menu: IMenuItem) => {
    setEditingMenu(menu);
    setFormData({
      nama: menu.nama,
      deskripsi: menu.deskripsi,
      harga: menu.harga,
      kategori: menu.kategori,
      gambar: menu.gambar,
      isTersedia: menu.isTersedia !== undefined ? menu.isTersedia : true,
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await res.json();
      if (result.success && result.url) {
        setFormData((prev) => ({ ...prev, gambar: result.url }));
        toast.success('Gambar berhasil diunggah');
      } else {
        toast.error('Upload gambar gagal: ' + (result.message || 'Coba lagi'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Terjadi kesalahan saat upload');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.deskripsi || formData.harga < 0) {
      toast.error('Silakan lengkapi formulir menu');
      return;
    }

    try {
      setSubmitting(true);
      const isEdit = !!editingMenu?._id;
      const endpoint = isEdit ? `/api/menu/${editingMenu._id}` : '/api/menu';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(isEdit ? 'Menu diperbarui' : 'Menu ditambahkan');
        setModalOpen(false);
        fetchMenus();
      } else {
        toast.error('Gagal menyimpan menu: ' + result.message);
      }
    } catch (err) {
      console.error('Save menu error:', err);
      toast.error('Terjadi kesalahan saat menyimpan menu');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleKetersediaan = async (item: IMenuItem) => {
    const newVal = !item.isTersedia;
    // Optimistic update
    setMenus((prev) =>
      prev.map((m) => (m._id === item._id ? { ...m, isTersedia: newVal } : m))
    );
    try {
      const res = await fetch(`/api/menu/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, isTersedia: newVal }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(
          newVal ? `"${item.nama}" sekarang tersedia ✅` : `"${item.nama}" ditandai habis ⛔`
        );
      } else {
        // Rollback on failure
        setMenus((prev) =>
          prev.map((m) => (m._id === item._id ? { ...m, isTersedia: !newVal } : m))
        );
        toast.error('Gagal mengubah ketersediaan: ' + result.message);
      }
    } catch {
      setMenus((prev) =>
        prev.map((m) => (m._id === item._id ? { ...m, isTersedia: !newVal } : m))
      );
      toast.error('Terjadi kesalahan saat mengubah ketersediaan');
    }
  };

  const handleDeleteMenu = async (id: string) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Menu dihapus');
        setDeleteConfirmId(null);
        fetchMenus();
      } else {
        toast.error('Gagal menghapus menu: ' + result.message);
      }
    } catch (err) {
      console.error('Delete menu error:', err);
      toast.error('Terjadi kesalahan saat menghapus');
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const filteredMenus = menus.filter((item) => {
    const matchCat = categoryFilter === 'Semua' || item.kategori === categoryFilter;
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-display">
            Kelola Menu Warkop
          </h1>
          <p className="text-xs text-[#78716C]">
            Tambah, edit deskripsi, ubah harga, dan kelola menu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMenus}
            className="p-2 rounded-lg bg-white hover:bg-[#FAF8F5] text-[#57534E] border border-[#E7E0D8] shadow-xs"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openAddModal}
            className="px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Menu</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#E7E0D8] shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['Semua', 'Kopi', 'Makanan', 'Minuman'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#57534E] hover:text-[#1C1917] border border-[#E7E0D8]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] text-[#1C1917] text-xs focus:outline-none focus:border-stone-900"
          />
        </div>
      </div>

      {/* Menu Cards */}
      {loading ? (
        <div className="py-20 text-center text-[#78716C] text-xs">
          <div className="w-8 h-8 border-2 border-[#E7E0D8] border-t-stone-900 rounded-full animate-spin mx-auto mb-2" />
          <p>Memuat menu...</p>
        </div>
      ) : filteredMenus.length === 0 ? (
        <div className="py-16 text-center text-[#A8A29E] bg-white rounded-xl border border-[#E7E0D8] space-y-2 p-6 shadow-xs">
          <Coffee className="w-8 h-8 mx-auto text-[#D6CEC5]" />
          <p className="text-xs">Tidak ada menu yang sesuai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 sm:gap-4">
          {filteredMenus.map((item) => (
            <div
              key={item._id}
              className={`rounded-xl bg-white border p-3.5 flex gap-3 items-center justify-between shadow-xs transition-colors ${
                item.isTersedia === false
                  ? 'border-rose-200 bg-rose-50/30'
                  : 'border-[#E7E0D8] hover:border-stone-400'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-14 h-14 rounded-lg bg-[#F4EFEA] overflow-hidden shrink-0 border border-[#E7E0D8]">
                  <Image
                    src={item.gambar || 'https://cdn.phototourl.com/free/2026-09-01-6d38a00a-b39c-4559-93bc-851a7f4432b1.jpg'}
                    alt={item.nama}
                    fill
                    sizes="56px"
                    className="object-cover"
                    unoptimized={item.gambar?.startsWith('data:')}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-xs sm:text-sm text-[#1C1917] truncate font-display">
                      {item.nama}
                    </h3>
                    <span className="text-[10px] bg-[#FAF8F5] text-stone-700 px-1.5 py-0.5 rounded font-medium border border-[#E7E0D8] shrink-0">
                      {item.kategori}
                    </span>
                    {item.isTersedia === false && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold border border-rose-200 shrink-0">
                        Habis
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#665E57] line-clamp-1 mt-0.5">
                    {item.deskripsi}
                  </p>
                  <p className="text-xs font-bold text-stone-900 mt-0.5">
                    {formatRupiah(item.harga)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Toggle ketersediaan */}
                <button
                  onClick={() => handleToggleKetersediaan(item)}
                  className={`p-1.5 rounded-md transition-colors ${
                    item.isTersedia !== false
                      ? 'text-emerald-700 hover:bg-emerald-50'
                      : 'text-stone-400 hover:bg-stone-100'
                  }`}
                  title={item.isTersedia !== false ? 'Tandai Habis' : 'Tandai Tersedia'}
                >
                  {item.isTersedia !== false ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(item)}
                  className="p-1.5 text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] rounded-md transition-colors"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(item._id || null)}
                  className="p-1.5 text-[#57534E] hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E7E0D8] rounded-xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E7E0D8] pb-3">
              <h2 className="text-base font-bold text-[#1C1917] font-display">
                {editingMenu ? 'Edit Menu' : 'Tambah Menu Baru'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-[#78716C] hover:text-[#1C1917] rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMenu} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Nama Menu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Kopi Tubruk Galuh"
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] text-[#1C1917] text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as MenuKategori })}
                    className="w-full px-2.5 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] text-[#1C1917] text-xs focus:outline-none focus:border-stone-900"
                  >
                    <option value="Kopi">Kopi</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#44403C] mb-1">
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.harga}
                    onChange={(e) => setFormData({ ...formData, harga: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] text-[#1C1917] text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#44403C] mb-1">
                  Deskripsi Singkat *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Keterangan singkat menu..."
                  className="w-full p-2.5 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] text-[#1C1917] text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#44403C]">
                  Gambar Menu
                </label>
                <div className="flex items-center gap-2.5">
                  {formData.gambar && (
                    <div className="relative w-12 h-12 rounded-lg bg-[#F4EFEA] overflow-hidden shrink-0 border border-[#E7E0D8]">
                      <Image
                        src={formData.gambar}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized={formData.gambar.startsWith('data:')}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#FAF8F5] hover:bg-[#F4EFEA] border border-[#E7E0D8] text-xs font-semibold text-[#57534E] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Mengunggah...' : 'Upload File Foto'}</span>
                  </button>
                </div>
                <input
                  type="url"
                  placeholder="Atau masukkan URL gambar..."
                  value={formData.gambar}
                  onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E7E0D8] text-[#1C1917] text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isTersedia"
                  checked={formData.isTersedia}
                  onChange={(e) => setFormData({ ...formData, isTersedia: e.target.checked })}
                  className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
                />
                <label htmlFor="isTersedia" className="text-xs text-[#57534E] cursor-pointer">
                  Menu Tersedia (Ready)
                </label>
              </div>

              <div className="pt-3 border-t border-[#E7E0D8] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] text-[#57534E] text-xs font-semibold border border-[#E7E0D8]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E7E0D8] rounded-xl max-w-xs w-full p-5 space-y-3 shadow-xl text-center">
            <h3 className="text-sm font-bold text-[#1C1917]">Hapus Menu?</h3>
            <p className="text-xs text-[#78716C]">
              Menu akan dihapus dari daftar katalog database.
            </p>
            <div className="flex justify-center gap-2 pt-1">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] text-[#57534E] text-xs font-semibold border border-[#E7E0D8]"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteMenu(deleteConfirmId)}
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
