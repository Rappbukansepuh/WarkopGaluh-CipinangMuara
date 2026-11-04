import { IPesanan } from '@/types';

/**
 * Ekspor data pesanan ke file CSV / Excel kompatibel (.csv dengan UTF-8 BOM dan baris ringkasan)
 */
export function exportPesananToCsv(
  data: IPesanan[],
  filenamePrefix = 'laporan-transaksi-warkop'
) {
  if (!data || data.length === 0) return;

  const formatRupiah = (num: number) => `Rp ${Number(num || 0).toLocaleString('id-ID')}`;

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
    selesai: 'Selesai (Lunas)',
    dibatalkan: 'Dibatalkan',
  };

  // 1. Kolom Header
  const headers = [
    'No. Pesanan',
    'Waktu Transaksi',
    'Nama Pemesan',
    'No. WhatsApp / HP',
    'Daftar Menu & Qty',
    'Total Porsi/Item',
    'Metode Pembayaran',
    'Total Transaksi',
    'Status Pesanan',
    'Catatan Khusus',
  ];

  // 2. Baris Data Transaksi
  let totalItemTerjual = 0;
  let totalOmsetSelesai = 0;
  let totalOmsetSemua = 0;
  let totalQRIS = 0;
  let countQRIS = 0;
  let totalTunai = 0;
  let countTunai = 0;

  const rows = data.map((p) => {
    const orderId = `#${(p._id || '').slice(-6).toUpperCase()}`;
    const totalPorsi = (p.menu || []).reduce((acc, curr) => acc + (curr.jumlah || 1), 0);
    totalItemTerjual += totalPorsi;

    const harga = Number(p.totalHarga || 0);
    totalOmsetSemua += harga;

    if (p.status === 'selesai') {
      totalOmsetSelesai += harga;
    }

    const metode = p.metodePembayaran || 'QRIS';
    if (metode === 'QRIS') {
      countQRIS++;
      if (p.status === 'selesai') totalQRIS += harga;
    } else {
      countTunai++;
      if (p.status === 'selesai') totalTunai += harga;
    }

    const menuStr = (p.menu || [])
      .map((item) => `${item.nama} (${item.jumlah}x)`)
      .join('; ');
    const catatan = p.catatan && p.catatan !== 'tidak ada catatan' ? p.catatan : '-';

    return [
      orderId,
      formatDate(p.createdAt),
      p.nama,
      p.noHP,
      menuStr,
      totalPorsi.toString(),
      metode,
      formatRupiah(harga),
      STATUS_LABEL[p.status] ?? p.status,
      catatan,
    ];
  });

  // 3. Baris Ringkasan Rekap Keuangan di Bagian Bawah
  const separator = ['', '', '', '', '', '', '', '', '', ''];
  const summaryHeader = ['--- RINGKASAN LAPORAN KEUANGAN & TRANSAKSI ---', '', '', '', '', '', '', '', '', ''];
  const summaryRows = [
    separator,
    summaryHeader,
    ['Total Pesanan Masuk', `${data.length} transaksi`, '', '', '', '', '', '', '', ''],
    ['Total Item/Porsi Terjual', `${totalItemTerjual} item`, '', '', '', '', '', '', '', ''],
    ['Total Omset Pesanan Selesai (Lunas)', formatRupiah(totalOmsetSelesai), '', '', '', '', '', '', '', ''],
    ['Total Nominal Seluruh Pesanan', formatRupiah(totalOmsetSemua), '', '', '', '', '', '', '', ''],
    ['Pembayaran via QRIS (Selesai)', `${formatRupiah(totalQRIS)} (${countQRIS} transaksi)`, '', '', '', '', '', '', '', ''],
    ['Pembayaran via Tunai (Selesai)', `${formatRupiah(totalTunai)} (${countTunai} transaksi)`, '', '', '', '', '', '', '', ''],
    ['Waktu Ekspor Laporan', formatDate(new Date()), '', '', '', '', '', '', '', ''],
  ];

  const escapeCsvCell = (value: string | number) => {
    const str = String(value ?? '');
    // Wrap in quotes if contains comma, newline, semicolon, or quote
    if (str.includes(',') || str.includes(';') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent =
    '\uFEFF' + // UTF-8 BOM untuk Microsoft Excel agar terbaca rapi otomatis
    [headers, ...rows, ...summaryRows]
      .map((row) => row.map(escapeCsvCell).join(','))
      .join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const filename = `${filenamePrefix}-${dateStr}_${timeStr}.csv`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
