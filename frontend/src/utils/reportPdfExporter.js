import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatDate } from './formatters';

/**
 * Generate and download an executive PDF report with official layout and tables.
 *
 * @param {Object} options
 * @param {Object} options.reportData - The report API response data
 * @param {string} options.tenantName - Name of current tenant
 * @param {string|number} options.tenantId - Tenant ID
 * @param {string} options.userName - Name of user downloading the report
 * @param {string} options.startDate - Selected filter start date
 * @param {string} options.endDate - Selected filter end date
 * @param {number} options.totalCalculatedTrx - Total calculated transactions sum
 * @param {number} options.totalCalculatedRevenue - Total calculated revenue sum
 */
export function exportReportToPdf({
  reportData,
  tenantName = 'Tenant',
  tenantId = '1',
  userName = 'Owner',
  startDate = '-',
  endDate = '-',
  totalCalculatedTrx = 0,
  totalCalculatedRevenue = 0,
}) {
  if (!reportData) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const currentDateStr = new Date().toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  // Top Indigo Accent Line
  doc.setFillColor(30, 58, 138); // Navy #1E3A8A
  doc.rect(0, 0, 210, 5, 'F');

  // Tenant Title Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(tenantName.toUpperCase(), 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('Mini ERP SaaS Multi-Tenant • Dokumen Laporan Omzet Resmi', 14, 21);

  // Status Badge / Metadata Block
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Periode: ${formatDate(startDate)} s/d ${formatDate(endDate)}`, 14, 27);
  doc.text(`Dicetak: ${currentDateStr} WIB | Oleh: ${userName} (Owner)`, 14, 32);
  doc.text(`Tenant ID: #${tenantId} | Isolasi Data: Terverifikasi Multi-Tenant`, 14, 37);

  // Divider Line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(14, 40, 196, 40);

  // 1. Executive Summary Table
  const totalOmzet = formatCurrency(reportData.filtered_summary?.total_revenue || 0);
  const totalTrx = (reportData.filtered_summary?.total_transactions || 0) + ' Transaksi';
  const aov = formatCurrency(reportData.filtered_summary?.avg_order_value || 0);
  const mtdOmzet = formatCurrency(reportData.current_month?.total_revenue || 0);

  autoTable(doc, {
    startY: 44,
    theme: 'grid',
    head: [['RINGKASAN EKSEKUTIF (KPI)', 'NILAI']],
    body: [
      ['Total Omzet Periode Terpilih', totalOmzet],
      ['Total Transaksi Periode Terpilih', totalTrx],
      ['Rata-rata Nilai per Transaksi (AOV)', aov],
      ['Omzet Bulan Berjalan (MTD)', mtdOmzet],
    ],
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 8.5,
      textColor: [30, 41, 59],
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 120, fontStyle: 'bold' },
      1: { cellWidth: 62, halign: 'right', fontStyle: 'bold', textColor: [67, 56, 202] },
    },
    margin: { left: 14, right: 14 },
  });

  // 2. Daily Breakdown Table
  let currentY = doc.lastAutoTable.finalY + 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Agregasi Omzet Harian (Database-Level Grouping)', 14, currentY);

  const dailyRows = (reportData.daily_breakdown || []).map((item, idx) => [
    idx + 1,
    formatDate(item.transaction_date),
    item.transaction_count + ' Trx',
    formatCurrency(item.daily_revenue),
  ]);

  dailyRows.push([
    'TOTAL',
    'Semua Hari',
    totalCalculatedTrx + ' Trx',
    formatCurrency(totalCalculatedRevenue),
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    theme: 'striped',
    head: [['No', 'Tanggal', 'Jumlah Transaksi', 'Total Omzet Harian']],
    body: dailyRows,
    headStyles: {
      fillColor: [51, 65, 85], // slate-700
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      textColor: [51, 65, 85],
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { cellWidth: 60, fontStyle: 'bold' },
      2: { halign: 'center', cellWidth: 40 },
      3: { halign: 'right', cellWidth: 70, fontStyle: 'bold', textColor: [67, 56, 202] },
    },
    margin: { left: 14, right: 14 },
  });

  // 3. Transactions Detail Table
  currentY = doc.lastAutoTable.finalY + 8;
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Rincian Transaksi Terkait Periode Filter', 14, currentY);

  const trxRows = (reportData.recent_transactions || []).map((trx, idx) => [
    idx + 1,
    trx.transaction_code,
    formatDate(trx.transaction_date),
    trx.user?.name || 'Kasir',
    formatCurrency(trx.total),
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    theme: 'striped',
    head: [['No', 'Kode Transaksi', 'Tanggal', 'Kasir / Petugas', 'Total Transaksi']],
    body: trxRows,
    headStyles: {
      fillColor: [51, 65, 85],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      textColor: [51, 65, 85],
      cellPadding: 2.5,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 },
      1: { cellWidth: 55, fontStyle: 'bold' },
      2: { cellWidth: 35 },
      3: { cellWidth: 40 },
      4: { halign: 'right', cellWidth: 40, fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  // Signatures & Integrity Footer
  let finalY = doc.lastAutoTable.finalY + 12;
  if (finalY > 245) {
    doc.addPage();
    finalY = 25;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(
    'Data di atas dihasilkan otomatis oleh Sistem Mini ERP SaaS PT Oka Iki Indonesia dengan isolasi database multi-tenant terverifikasi.',
    14,
    finalY
  );

  // Signature Block
  const sigY = finalY + 8;
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Dibuat & Diverifikasi:', 25, sigY);
  doc.text('Mengetahui / Pimpinan:', 135, sigY);

  doc.setFont('helvetica', 'bold');
  doc.text(userName, 25, sigY + 18);
  doc.text('( Owner / Direksi )', 135, sigY + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Kasir / Owner Tenant', 25, sigY + 22);
  doc.text(tenantName, 135, sigY + 22);

  // Add Page Numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Halaman ${i} dari ${pageCount} • PT Oka Iki Indonesia Technical Test`, 105, 292, { align: 'center' });
  }

  const cleanFilename = `Laporan_Omzet_${tenantName.replace(/[^a-zA-Z0-9]/g, '_')}_${startDate}_sd_${endDate}.pdf`;
  doc.save(cleanFilename);
}
