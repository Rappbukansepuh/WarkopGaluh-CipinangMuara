import { IPesanan } from '@/types';

/**
 * Converts a list of pesanan to a CSV string and triggers a file download in the browser.
 */
export function exportPesananToCsv(data: IPesanan[], filenamePrefix = 'pesanan-warkop') {
  if (data.length === 0) return;

  const formatRupiah = (num: number) => `Rp ${num.toLocaleString('id-ID')}`;

  const formatDate = (d?: string | Date) => {
    if (!d) return '-';
    return new Date(d).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const STATUS_LABEL: Record<string, string> = {
    pending: 'Menunggu',
    diproses: 'Diproses',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
  };

  // Header row
  const headers = [
    'No. Pesanan',
    'Nama Pemesan',
    'No. HP',
    'Menu (nama x qty)',
    'Total Harga',
    'Status',
    'Catatan',
    'Waktu Pesan',
  ];

  // Data rows
  const rows = data.map((p) => {
    const orderId = `#${(p._id || '').slice(-6).toUpperCase()}`;
    const menuStr = p.menu
      .map((item) => `${item.nama} x${item.jumlah}`)
      .join(' | ');
    const catatan = p.catatan && p.catatan !== 'tidak ada catatan' ? p.catatan : '-';

    return [
      orderId,
      p.nama,
      p.noHP,
      menuStr,
      formatRupiah(p.totalHarga),
      STATUS_LABEL[p.status] ?? p.status,
      catatan,
      formatDate(p.createdAt),
    ];
  });

  const escapeCsvCell = (value: string) => {
    const str = String(value);
    // Wrap in quotes if contains comma, newline, or quote
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent =
    '\uFEFF' + // BOM for Excel UTF-8 compatibility
    [headers, ...rows]
      .map((row) => row.map(escapeCsvCell).join(','))
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().slice(0, 10);
  const filename = `${filenamePrefix}-${today}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
