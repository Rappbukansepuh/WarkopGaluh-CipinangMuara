import { MENU_DATA } from '@/data/menu';
import { IMenuItem, IPesanan } from '@/types';

// Use globalThis to persist in-memory data across hot-reloads in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var __memoryPesanan: IPesanan[] | undefined;
  // eslint-disable-next-line no-var
  var __memoryMenus: IMenuItem[] | undefined;
}

if (!globalThis.__memoryPesanan) {
  globalThis.__memoryPesanan = [];
}

if (!globalThis.__memoryMenus) {
  globalThis.__memoryMenus = MENU_DATA.map((item) => ({
    _id: item.id,
    id: item.id,
    nama: item.nama,
    deskripsi: item.deskripsi,
    harga: item.harga,
    kategori: item.kategori,
    gambar: item.gambar,
    isTersedia: item.isTersedia,
  }));
}

const memoryPesanan = globalThis.__memoryPesanan;
const memoryMenus = globalThis.__memoryMenus;

// === PESANAN HELPERS ===
export function getMemoryPesanan(status?: string | null): IPesanan[] {
  if (!status || status === 'semua') {
    return [...memoryPesanan];
  }
  return memoryPesanan.filter((p) => p.status === status);
}

export function getMemoryPesananById(id: string): IPesanan | undefined {
  return memoryPesanan.find((p) => p._id === id);
}

export function addMemoryPesanan(data: Omit<IPesanan, '_id'> & { _id?: string }): IPesanan {
  const newPesanan: IPesanan = {
    ...data,
    _id: data._id || 'ord-' + Date.now().toString(36),
    createdAt: data.createdAt || new Date(),
  };
  memoryPesanan.unshift(newPesanan);
  return newPesanan;
}

export function updateMemoryPesanan(
  id: string,
  updates: Partial<IPesanan>
): IPesanan | null {
  const index = memoryPesanan.findIndex((p) => p._id === id);
  if (index === -1) return null;
  memoryPesanan[index] = { ...memoryPesanan[index], ...updates };
  return memoryPesanan[index];
}

export function deleteMemoryPesanan(id: string): boolean {
  const index = memoryPesanan.findIndex((p) => p._id === id);
  if (index === -1) return false;
  memoryPesanan.splice(index, 1);
  return true;
}

// === MENU HELPERS ===
export function getMemoryMenus(
  kategori?: string | null,
  search?: string | null
): IMenuItem[] {
  let list = [...memoryMenus];
  if (kategori && kategori !== 'Semua') {
    list = list.filter((item) => item.kategori === kategori);
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(
      (item) =>
        item.nama.toLowerCase().includes(s) || item.deskripsi.toLowerCase().includes(s)
    );
  }
  return list;
}

export function getMemoryMenuById(id: string): IMenuItem | undefined {
  return memoryMenus.find((m) => m._id === id || m.id === id);
}

export function addMemoryMenu(data: Omit<IMenuItem, '_id'> & { _id?: string }): IMenuItem {
  const newMenu: IMenuItem = {
    ...data,
    _id: data._id || 'menu-' + Date.now().toString(36),
  };
  memoryMenus.unshift(newMenu);
  return newMenu;
}

export function updateMemoryMenu(
  id: string,
  updates: Partial<IMenuItem>
): IMenuItem | null {
  const index = memoryMenus.findIndex((m) => m._id === id || m.id === id);
  if (index === -1) return null;
  memoryMenus[index] = { ...memoryMenus[index], ...updates };
  return memoryMenus[index];
}

export function deleteMemoryMenu(id: string): boolean {
  const index = memoryMenus.findIndex((m) => m._id === id || m.id === id);
  if (index === -1) return false;
  memoryMenus.splice(index, 1);
  return true;
}
