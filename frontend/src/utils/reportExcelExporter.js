import ExcelJS from 'exceljs';

/**
 * Generate and download an executive corporate Excel spreadsheet (.xlsx) using ExcelJS.
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
export async function exportReportToExcel({
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

  const currentDateStr = new Date().toLocaleString('id-ID');

  const wb = new ExcelJS.Workbook();
  wb.creator = 'PT Oka Iki Indonesia';
  wb.lastModifiedBy = userName;
  wb.created = new Date();
  wb.modified = new Date();

  // Color & Border Palette
  const navyFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0F172A' } };
  const indigoFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4338CA' } };
  const slateSubFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
  const metaHeaderFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
  const sectionFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
  const tableHeaderFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
  const zebraFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
  const totalRowFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEF2FF' } };

  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  };

  const totalBorder = {
    top: { style: 'thin', color: { argb: 'FF94A3B8' } },
    bottom: { style: 'double', color: { argb: 'FF1E3A8A' } },
    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  };

  // -------------------------------------------------------------
  // SHEET 1: RINGKASAN & HARIAN
  // -------------------------------------------------------------
  const ws1 = wb.addWorksheet('Ringkasan & Harian', {
    views: [{ showGridLines: true }],
  });

  // Column definitions with generous widths
  ws1.columns = [
    { width: 4 },  // A: Spacer
    { width: 36 }, // B: Indikator / Tanggal
    { width: 22 }, // C: Jumlah Trx / Nilai
    { width: 32 }, // D: Total Omzet Rp / Keterangan
    { width: 22 }, // E: Status
  ];

  // 1. BRAND HEADER BANNER
  ws1.mergeCells('B1:E1');
  const b1 = ws1.getCell('B1');
  b1.value = 'PT OKA IKI INDONESIA';
  b1.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  b1.alignment = { horizontal: 'center', vertical: 'middle' };
  b1.fill = navyFill;
  ws1.getRow(1).height = 28;

  ws1.mergeCells('B2:E2');
  const b2 = ws1.getCell('B2');
  b2.value = 'LAPORAN RESMI EKSEKUTIF OMZET & PENDAPATAN';
  b2.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  b2.alignment = { horizontal: 'center', vertical: 'middle' };
  b2.fill = indigoFill;
  ws1.getRow(2).height = 22;

  ws1.mergeCells('B3:E3');
  const b3 = ws1.getCell('B3');
  b3.value = 'Mini ERP SaaS Enterprise • Multi-Tenant Data Isolation • Dokumen Sah & Rahasia';
  b3.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF475569' } };
  b3.alignment = { horizontal: 'center', vertical: 'middle' };
  b3.fill = slateSubFill;
  ws1.getRow(3).height = 18;

  ws1.getRow(4).height = 8;

  // 2. METADATA IDENTITAS TENANT
  const metaRows = [
    { k1: 'NAMA TENANT', v1: tenantName, k2: 'PERIODE LAPORAN', v2: `${startDate} s/d ${endDate}` },
    { k1: 'TENANT ID', v1: `#${tenantId} (Isolated Multi-Tenant)`, k2: 'TANGGAL UNDUH', v2: `${currentDateStr} WIB` },
    { k1: 'DIUNDUH OLEH', v1: `${userName} (Owner)`, k2: 'STATUS DATA', v2: 'Terverifikasi Valid & Terkunci' }
  ];

  metaRows.forEach((m, idx) => {
    const r = 5 + idx;
    ws1.getRow(r).height = 20;

    const cellK1 = ws1.getCell(`B${r}`);
    cellK1.value = m.k1;
    cellK1.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF334155' } };
    cellK1.fill = metaHeaderFill;
    cellK1.alignment = { horizontal: 'right', vertical: 'middle' };
    cellK1.border = thinBorder;

    const cellV1 = ws1.getCell(`C${r}`);
    cellV1.value = m.v1;
    cellV1.font = { name: 'Calibri', size: 10, bold: idx === 0, color: idx === 0 ? { argb: 'FF1D4ED8' } : { argb: 'FF0F172A' } };
    cellV1.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    cellV1.border = thinBorder;

    const cellK2 = ws1.getCell(`D${r}`);
    cellK2.value = m.k2;
    cellK2.font = { name: 'Calibri', size: 9, bold: true, color: { argb: 'FF334155' } };
    cellK2.fill = metaHeaderFill;
    cellK2.alignment = { horizontal: 'right', vertical: 'middle' };
    cellK2.border = thinBorder;

    const cellV2 = ws1.getCell(`E${r}`);
    cellV2.value = m.v2;
    cellV2.font = { name: 'Calibri', size: 10, bold: true, color: idx === 2 ? { argb: 'FF15803D' } : { argb: 'FF0F172A' } };
    cellV2.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    cellV2.border = thinBorder;
  });

  ws1.getRow(8).height = 12;

  // 3. RINGKASAN EKSEKUTIF (KPI)
  ws1.mergeCells('B9:E9');
  const kpiTitle = ws1.getCell('B9');
  kpiTitle.value = 'I. RINGKASAN EKSEKUTIF INDIKATOR FINANSIAL & OPERASIONAL (KPI)';
  kpiTitle.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  kpiTitle.fill = sectionFill;
  kpiTitle.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  ws1.getRow(9).height = 24;

  const kpiData = [
    { label: 'Total Omzet Periode Terpilih (Gross Revenue)', val: Number(reportData.filtered_summary?.total_revenue || 0), fmt: '"Rp"#,##0', isBold: true, color: 'FF047857' },
    { label: 'Total Volume Transaksi Terpilih', val: Number(reportData.filtered_summary?.total_transactions || 0), fmt: '#,##0 " Transaksi"', isBold: true, color: 'FF0F172A' },
    { label: 'Rata-rata Nilai per Transaksi (AOV / Basket Size)', val: Number(reportData.filtered_summary?.avg_order_value || 0), fmt: '"Rp"#,##0', isBold: false, color: 'FF0F172A' },
    { label: 'Omzet Akumulasi Bulan Berjalan (MTD)', val: Number(reportData.current_month?.total_revenue || 0), fmt: '"Rp"#,##0', isBold: false, color: 'FF0F172A' },
    { label: 'Total Transaksi Bulan Berjalan (MTD)', val: Number(reportData.current_month?.total_transactions || 0), fmt: '#,##0 " Transaksi"', isBold: false, color: 'FF0F172A' },
  ];

  kpiData.forEach((k, idx) => {
    const r = 10 + idx;
    ws1.getRow(r).height = 20;

    ws1.mergeCells(`B${r}:C${r}`);
    const lblCell = ws1.getCell(`B${r}`);
    lblCell.value = k.label;
    lblCell.font = { name: 'Calibri', size: 10, color: { argb: 'FF1E293B' } };
    lblCell.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    lblCell.fill = idx % 2 === 1 ? zebraFill : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    lblCell.border = thinBorder;
    ws1.getCell(`C${r}`).border = thinBorder;

    ws1.mergeCells(`D${r}:E${r}`);
    const valCell = ws1.getCell(`D${r}`);
    valCell.value = k.val;
    valCell.numFmt = k.fmt;
    valCell.font = { name: 'Calibri', size: 10, bold: k.isBold, color: { argb: k.color } };
    valCell.alignment = { horizontal: 'right', vertical: 'middle' };
    valCell.fill = idx % 2 === 1 ? zebraFill : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    valCell.border = thinBorder;
    ws1.getCell(`E${r}`).border = thinBorder;
  });

  ws1.getRow(15).height = 12;

  // 4. AGREGASI OMZET HARIAN
  ws1.mergeCells('B16:E16');
  const dailyTitle = ws1.getCell('B16');
  dailyTitle.value = 'II. TABEL AGREGASI OMZET HARIAN OPERASIONAL';
  dailyTitle.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  dailyTitle.fill = sectionFill;
  dailyTitle.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
  ws1.getRow(16).height = 24;

  const tableHeaders = [
    { col: 'B', label: 'No', align: 'center' },
    { col: 'C', label: 'Tanggal Transaksi', align: 'center' },
    { col: 'D', label: 'Volume Transaksi', align: 'center' },
    { col: 'E', label: 'Total Omzet Harian (Rp)', align: 'right' },
  ];

  ws1.getRow(17).height = 22;
  tableHeaders.forEach(th => {
    const c = ws1.getCell(`${th.col}17`);
    c.value = th.label;
    c.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = tableHeaderFill;
    c.alignment = { horizontal: th.align, vertical: 'middle' };
    c.border = thinBorder;
  });

  let currentDailyRow = 18;
  const breakdown = reportData.daily_breakdown || [];
  breakdown.forEach((item, idx) => {
    ws1.getRow(currentDailyRow).height = 20;
    const isEven = idx % 2 === 1;
    const rowFill = isEven ? zebraFill : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };

    const cB = ws1.getCell(`B${currentDailyRow}`);
    cB.value = idx + 1;
    cB.font = { name: 'Calibri', size: 10 };
    cB.alignment = { horizontal: 'center', vertical: 'middle' };
    cB.fill = rowFill;
    cB.border = thinBorder;

    const cC = ws1.getCell(`C${currentDailyRow}`);
    cC.value = item.transaction_date;
    cC.font = { name: 'Calibri', size: 10 };
    cC.alignment = { horizontal: 'center', vertical: 'middle' };
    cC.fill = rowFill;
    cC.border = thinBorder;

    const cD = ws1.getCell(`D${currentDailyRow}`);
    cD.value = Number(item.transaction_count || 0);
    cD.numFmt = '#,##0 " Trx"';
    cD.font = { name: 'Calibri', size: 10 };
    cD.alignment = { horizontal: 'center', vertical: 'middle' };
    cD.fill = rowFill;
    cD.border = thinBorder;

    const cE = ws1.getCell(`E${currentDailyRow}`);
    cE.value = Number(item.daily_revenue || 0);
    cE.numFmt = '"Rp"#,##0';
    cE.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    cE.alignment = { horizontal: 'right', vertical: 'middle' };
    cE.fill = rowFill;
    cE.border = thinBorder;

    currentDailyRow++;
  });

  // TOTAL ROW
  ws1.getRow(currentDailyRow).height = 24;
  ws1.mergeCells(`B${currentDailyRow}:C${currentDailyRow}`);
  const totalLbl = ws1.getCell(`B${currentDailyRow}`);
  totalLbl.value = 'TOTAL KESELURUHAN (SEMUA HARI)';
  totalLbl.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
  totalLbl.alignment = { horizontal: 'center', vertical: 'middle' };
  totalLbl.fill = totalRowFill;
  totalLbl.border = totalBorder;
  ws1.getCell(`C${currentDailyRow}`).border = totalBorder;

  const totalTrxCell = ws1.getCell(`D${currentDailyRow}`);
  totalTrxCell.value = totalCalculatedTrx;
  totalTrxCell.numFmt = '#,##0 " Trx"';
  totalTrxCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
  totalTrxCell.alignment = { horizontal: 'center', vertical: 'middle' };
  totalTrxCell.fill = totalRowFill;
  totalTrxCell.border = totalBorder;

  const totalRevCell = ws1.getCell(`E${currentDailyRow}`);
  totalRevCell.value = totalCalculatedRevenue;
  totalRevCell.numFmt = '"Rp"#,##0';
  totalRevCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF1E40AF' } };
  totalRevCell.alignment = { horizontal: 'right', vertical: 'middle' };
  totalRevCell.fill = totalRowFill;
  totalRevCell.border = totalBorder;

  // 5. SIGN-OFF BLOCK
  const signRow = currentDailyRow + 3;
  ws1.mergeCells(`B${signRow}:C${signRow}`);
  const s1 = ws1.getCell(`B${signRow}`);
  s1.value = 'Dibuat & Diverifikasi:';
  s1.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF64748B' } };
  s1.alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.mergeCells(`D${signRow}:E${signRow}`);
  const s2 = ws1.getCell(`D${signRow}`);
  s2.value = 'Mengetahui / Pimpinan Tenant:';
  s2.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF64748B' } };
  s2.alignment = { horizontal: 'center', vertical: 'middle' };

  const nameRow = signRow + 4;
  ws1.mergeCells(`B${nameRow}:C${nameRow}`);
  const n1 = ws1.getCell(`B${nameRow}`);
  n1.value = `( ${userName} )`;
  n1.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E293B' } };
  n1.alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.mergeCells(`D${nameRow}:E${nameRow}`);
  const n2 = ws1.getCell(`D${nameRow}`);
  n2.value = `( ${tenantName} )`;
  n2.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E293B' } };
  n2.alignment = { horizontal: 'center', vertical: 'middle' };

  const roleRow = nameRow + 1;
  ws1.mergeCells(`B${roleRow}:C${roleRow}`);
  const r1 = ws1.getCell(`B${roleRow}`);
  r1.value = 'Petugas / Kasir Operasional';
  r1.font = { name: 'Calibri', size: 8, color: { argb: 'FF64748B' } };
  r1.alignment = { horizontal: 'center', vertical: 'middle' };

  ws1.mergeCells(`D${roleRow}:E${roleRow}`);
  const r2 = ws1.getCell(`D${roleRow}`);
  r2.value = 'Owner / Management Tenant';
  r2.font = { name: 'Calibri', size: 8, color: { argb: 'FF64748B' } };
  r2.alignment = { horizontal: 'center', vertical: 'middle' };

  // -------------------------------------------------------------
  // SHEET 2: DAFTAR TRANSAKSI
  // -------------------------------------------------------------
  const ws2 = wb.addWorksheet('Daftar Transaksi', {
    views: [{ showGridLines: true }],
  });

  ws2.columns = [
    { width: 4 },  // A: Spacer
    { width: 6 },  // B: No
    { width: 24 }, // C: Kode Transaksi
    { width: 22 }, // D: Tanggal & Jam
    { width: 26 }, // E: Petugas / Kasir
    { width: 14 }, // F: Hak Akses
    { width: 28 }, // G: Total Transaksi (Rp)
  ];

  // Header Banner Sheet 2
  ws2.mergeCells('B1:G1');
  const sh2B1 = ws2.getCell('B1');
  sh2B1.value = 'PT OKA IKI INDONESIA - MINI ERP SAAS';
  sh2B1.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  sh2B1.alignment = { horizontal: 'center', vertical: 'middle' };
  sh2B1.fill = navyFill;
  ws2.getRow(1).height = 28;

  ws2.mergeCells('B2:G2');
  const sh2B2 = ws2.getCell('B2');
  sh2B2.value = 'LOG AUDIT TRANSAKSI PENJUALAN OPERASIONAL';
  sh2B2.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  sh2B2.alignment = { horizontal: 'center', vertical: 'middle' };
  sh2B2.fill = indigoFill;
  ws2.getRow(2).height = 22;

  const rawTransactions = reportData.recent_transactions || [];
  ws2.mergeCells('B3:G3');
  const sh2B3 = ws2.getCell('B3');
  sh2B3.value = `Tenant: ${tenantName} | Periode: ${startDate} s/d ${endDate} | Total: ${rawTransactions.length} Transaksi Terdata`;
  sh2B3.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'FF475569' } };
  sh2B3.alignment = { horizontal: 'center', vertical: 'middle' };
  sh2B3.fill = slateSubFill;
  ws2.getRow(3).height = 18;

  ws2.getRow(4).height = 10;

  // Table Headers Sheet 2
  const trxHeaders = [
    { col: 'B', label: 'No', align: 'center' },
    { col: 'C', label: 'Kode Transaksi', align: 'center' },
    { col: 'D', label: 'Tanggal & Jam', align: 'center' },
    { col: 'E', label: 'Petugas / Kasir', align: 'left' },
    { col: 'F', label: 'Hak Akses', align: 'center' },
    { col: 'G', label: 'Total Transaksi (Rp)', align: 'right' },
  ];

  ws2.getRow(5).height = 24;
  trxHeaders.forEach(th => {
    const c = ws2.getCell(`${th.col}5`);
    c.value = th.label;
    c.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = sectionFill;
    c.alignment = { horizontal: th.align, vertical: 'middle', indent: th.align === 'left' ? 1 : 0 };
    c.border = thinBorder;
  });

  let currentTrxRow = 6;
  let runningTrxTotal = 0;
  rawTransactions.forEach((trx, idx) => {
    ws2.getRow(currentTrxRow).height = 20;
    const isEven = idx % 2 === 1;
    const rowFill = isEven ? zebraFill : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    const trxTotal = Number(trx.total || 0);
    runningTrxTotal += trxTotal;

    const cB = ws2.getCell(`B${currentTrxRow}`);
    cB.value = idx + 1;
    cB.font = { name: 'Calibri', size: 10 };
    cB.alignment = { horizontal: 'center', vertical: 'middle' };
    cB.fill = rowFill;
    cB.border = thinBorder;

    const cC = ws2.getCell(`C${currentTrxRow}`);
    cC.value = trx.transaction_code;
    cC.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1D4ED8' } };
    cC.alignment = { horizontal: 'center', vertical: 'middle' };
    cC.fill = rowFill;
    cC.border = thinBorder;

    const cD = ws2.getCell(`D${currentTrxRow}`);
    cD.value = trx.transaction_date;
    cD.font = { name: 'Calibri', size: 10 };
    cD.alignment = { horizontal: 'center', vertical: 'middle' };
    cD.fill = rowFill;
    cD.border = thinBorder;

    const cE = ws2.getCell(`E${currentTrxRow}`);
    cE.value = trx.user?.name || 'Kasir';
    cE.font = { name: 'Calibri', size: 10 };
    cE.alignment = { horizontal: 'left', vertical: 'middle', indent: 1 };
    cE.fill = rowFill;
    cE.border = thinBorder;

    const cF = ws2.getCell(`F${currentTrxRow}`);
    const roleStr = (trx.user?.role || 'user').toUpperCase();
    cF.value = roleStr;
    cF.font = { name: 'Calibri', size: 9, bold: true, color: roleStr === 'OWNER' ? { argb: 'FF7C3AED' } : { argb: 'FF2563EB' } };
    cF.alignment = { horizontal: 'center', vertical: 'middle' };
    cF.fill = rowFill;
    cF.border = thinBorder;

    const cG = ws2.getCell(`G${currentTrxRow}`);
    cG.value = trxTotal;
    cG.numFmt = '"Rp"#,##0';
    cG.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF0F172A' } };
    cG.alignment = { horizontal: 'right', vertical: 'middle' };
    cG.fill = rowFill;
    cG.border = thinBorder;

    currentTrxRow++;
  });

  // Total Row Sheet 2
  ws2.getRow(currentTrxRow).height = 24;
  ws2.mergeCells(`B${currentTrxRow}:F${currentTrxRow}`);
  const trxTotalLbl = ws2.getCell(`B${currentTrxRow}`);
  trxTotalLbl.value = 'TOTAL AKUMULASI TRANSAKSI TERDATA';
  trxTotalLbl.font = { name: 'Calibri', size: 10, bold: true, color: { argb: 'FF1E3A8A' } };
  trxTotalLbl.alignment = { horizontal: 'right', vertical: 'middle', indent: 1 };
  trxTotalLbl.fill = totalRowFill;
  trxTotalLbl.border = totalBorder;
  for (const colCode of ['C', 'D', 'E', 'F']) {
    ws2.getCell(`${colCode}${currentTrxRow}`).border = totalBorder;
  }

  const trxTotalVal = ws2.getCell(`G${currentTrxRow}`);
  trxTotalVal.value = runningTrxTotal;
  trxTotalVal.numFmt = '"Rp"#,##0';
  trxTotalVal.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF1E40AF' } };
  trxTotalVal.alignment = { horizontal: 'right', vertical: 'middle' };
  trxTotalVal.fill = totalRowFill;
  trxTotalVal.border = totalBorder;

  // Export File to Browser
  const cleanFilename = `Laporan_Omzet_${tenantName.replace(/[^a-zA-Z0-9]/g, '_')}_${startDate}_sd_${endDate}.xlsx`;
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = cleanFilename;
  document.body.appendChild(link);
  link.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
}
