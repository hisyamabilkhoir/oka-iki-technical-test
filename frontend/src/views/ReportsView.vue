<template>
  <div class="space-y-6">
    <!-- Print-Only Official Letterhead (KOP SURAT RESMI) -->
    <div class="print-only hidden pb-4 mb-4 border-b-2 border-slate-900">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-black uppercase text-slate-900 tracking-wider">
            {{ authStore.tenant?.name }}
          </h1>
          <p class="text-xs font-semibold text-slate-600 mt-0.5">
            SISTEM MINI ERP SAAS MULTI-TENANT • LAPORAN OMZET & PENDAPATAN RESMI
          </p>
          <p class="text-[10px] text-slate-500">
            Tenant ID: #{{ authStore.tenant?.id }} • Terverifikasi Multi-Tenant Database
          </p>
        </div>
        <div class="text-right text-[11px] text-slate-600 space-y-0.5">
          <p class="font-bold text-slate-900">STATUS: TERVERIFIKASI SISTEM</p>
          <p>Waktu Cetak: {{ printDateTimeString }} WIB</p>
          <p>Dicetak Oleh: {{ authStore.user?.name }} ({{ authStore.user?.role }})</p>
        </div>
      </div>
      <div class="mt-3 text-xs font-bold text-indigo-900 bg-slate-100 p-2 rounded border border-slate-200">
        PERIODE LAPORAN: {{ formatDate(filters.startDate) }} s/d {{ formatDate(filters.endDate) }}
      </div>
    </div>

    <!-- Header (Screen View) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Laporan Omzet & Pendapatan</h1>
        <p class="text-sm text-slate-500 mt-1">
          Agregasi data pendapatan resmi tenant <strong class="text-slate-800">{{ authStore.tenant?.name }}</strong> (Khusus Owner).
        </p>
      </div>

      <div class="inline-flex items-center space-x-1.5 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700">
        <ShieldCheck class="w-4 h-4 text-indigo-600" />
        <span>Akses Terproteksi: Owner Only</span>
      </div>
    </div>

    <!-- Filter Bar Card -->
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 no-print">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <!-- Date Inputs -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-w-xl">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Dari Tanggal
            </label>
            <input
              v-model="filters.startDate"
              type="date"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Sampai Tanggal
            </label>
            <input
              v-model="filters.endDate"
              type="date"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <!-- Preset Buttons & Submit -->
        <div class="flex items-center space-x-2 shrink-0">
          <button
            @click="applyPreset('this_month')"
            type="button"
            class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Bulan Ini
          </button>
          <button
            @click="applyPreset('last_month')"
            type="button"
            class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Bulan Lalu
          </button>
          <button
            @click="loadReport"
            :disabled="loading"
            type="button"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Filter class="w-3.5 h-3.5" />
            <span>Terapkan Filter</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Export & Print Action Bar (Prominent & Clean) -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
      <div class="flex items-center space-x-2 text-xs text-slate-600">
        <Download class="w-4 h-4 text-indigo-600" />
        <span class="font-semibold text-slate-700">Ekspor Dokumen Laporan:</span>
        <span class="text-slate-400 hidden md:inline">Format resmi PDF, lembar kerja Excel, atau cetak fisik</span>
      </div>

      <div class="flex items-center space-x-2 w-full sm:w-auto justify-end flex-wrap gap-2">
        <!-- Download PDF -->
        <button
          @click="downloadPdf"
          :disabled="loading || !reportData"
          class="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-2xs hover:shadow-xs"
          title="Unduh Laporan Format PDF Resmi"
        >
          <FileText class="w-3.5 h-3.5 text-rose-600" />
          <span>Unduh PDF</span>
        </button>

        <!-- Download Excel -->
        <button
          @click="downloadExcel"
          :disabled="loading || !reportData"
          class="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/90 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-2xs hover:shadow-xs"
          title="Unduh Lembar Kerja Excel (.xlsx) Multi-Sheet"
        >
          <FileSpreadsheet class="w-3.5 h-3.5 text-emerald-600" />
          <span>Unduh Excel</span>
        </button>

        <!-- Print Button -->
        <button
          @click="printReport"
          :disabled="loading || !reportData"
          class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
          title="Cetak Laporan atau Simpan via Print Dialog"
        >
          <Printer class="w-3.5 h-3.5" />
          <span>Cetak Laporan</span>
        </button>
      </div>
    </div>

    <!-- KPI Metric Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 break-inside-avoid">
      <!-- MTD Revenue -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Omzet Bulan Berjalan</span>
        <div class="mt-2 text-xl sm:text-2xl font-extrabold text-indigo-600">
          {{ formatCurrency(reportData?.current_month?.total_revenue) }}
        </div>
        <p class="text-xs text-slate-400 mt-1">Standar bulan ini (1 s/d hari ini)</p>
      </div>

      <!-- MTD Trx Count -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Transaksi Bulan Ini</span>
        <div class="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900">
          {{ reportData?.current_month?.total_transactions || 0 }} Transaksi
        </div>
        <p class="text-xs text-slate-400 mt-1">Volume order bulan ini</p>
      </div>

      <!-- Filtered Period Revenue -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs bg-gradient-to-br from-indigo-50/50 to-transparent">
        <span class="text-xs font-semibold uppercase tracking-wider text-indigo-900">Total Omzet (Periode Terpilih)</span>
        <div class="mt-2 text-xl sm:text-2xl font-extrabold text-indigo-700">
          {{ formatCurrency(reportData?.filtered_summary?.total_revenue) }}
        </div>
        <p class="text-xs text-indigo-500 mt-1">Hasil filter rentang tanggal</p>
      </div>

      <!-- Filtered Trx Count -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Rata-rata Transaksi (AOV)</span>
        <div class="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900">
          {{ formatCurrency(reportData?.filtered_summary?.avg_order_value) }}
        </div>
        <p class="text-xs text-slate-400 mt-1">Per transaksi di periode ini</p>
      </div>
    </div>

    <!-- Daily Breakdown Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Daily Aggregations (7 cols) -->
      <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden break-inside-avoid">
        <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-base text-slate-900">Agregasi Harian Server-Side</h3>
            <p class="text-xs text-slate-500 mt-0.5">Dihitung langsung via query database SQL</p>
          </div>

          <div class="flex items-center space-x-2">
            <!-- Search Date in daily breakdown -->
            <div class="relative w-40 sm:w-48">
              <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="dailySearch"
                @input="handleDailyFilter"
                type="text"
                placeholder="Cari tanggal..."
                class="w-full pl-7 pr-6 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                v-if="dailySearch"
                @click="dailySearch = ''; handleDailyFilter()"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X class="w-3 h-3" />
              </button>
            </div>

            <span class="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg font-semibold border border-indigo-100 shrink-0">
              {{ filteredDailyBreakdown.length }} Hari
            </span>
          </div>
        </div>

        <div v-if="loading" class="p-12 text-center text-slate-400 text-sm">
          <span class="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></span>
          <p>Mengagregasi data transaksi...</p>
        </div>

        <div v-else-if="filteredDailyBreakdown.length === 0" class="p-12 text-center text-slate-400 text-xs">
          {{ dailySearch ? 'Tidak ada data harian yang cocok dengan kata kunci tanggal.' : 'Tidak ada transaksi tercatat dalam rentang tanggal ini.' }}
        </div>

        <div v-else>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th class="px-5 py-3">Tanggal</th>
                  <th class="px-5 py-3 text-center">Jumlah Transaksi</th>
                  <th class="px-5 py-3 text-right">Total Omzet Harian</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-xs">
                <tr v-for="daily in paginatedDailyBreakdown" :key="daily.transaction_date" class="hover:bg-slate-50/70">
                  <td class="px-5 py-3 font-semibold text-slate-800">
                    {{ formatDate(daily.transaction_date) }}
                  </td>
                  <td class="px-5 py-3 text-center">
                    <span class="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                      {{ daily.transaction_count }}
                    </span>
                  </td>
                  <td class="px-5 py-3 text-right font-extrabold text-indigo-600">
                    {{ formatCurrency(daily.daily_revenue) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-slate-50 border-t-2 border-slate-200 text-xs font-bold text-slate-800">
                <tr>
                  <td class="px-5 py-3">TOTAL ({{ reportData?.daily_breakdown?.length || 0 }} Hari Aktif)</td>
                  <td class="px-5 py-3 text-center">{{ totalCalculatedTrx }} Trx</td>
                  <td class="px-5 py-3 text-right text-indigo-600 font-extrabold">
                    {{ formatCurrency(totalCalculatedRevenue) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Pagination for Daily Breakdown -->
          <PaginationControls
            :current-page="dailyPagination.currentPage"
            :last-page="dailyPagination.lastPage"
            :total="dailyPagination.total"
            :from="dailyPagination.from"
            :to="dailyPagination.to"
            :per-page="dailyPagination.perPage"
            :per-page-options="[5, 10, 20]"
            :loading="loading"
            @page-change="onDailyPageChange"
            @per-page-change="onDailyPerPageChange"
          />
        </div>
      </div>

      <!-- Detail Transactions in Period (5 cols) -->
      <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden break-inside-avoid">
        <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 class="font-bold text-base text-slate-900">Daftar Transaksi Terkait</h3>
            <p class="text-xs text-slate-500 mt-0.5">Transaksi tenant dalam rentang filter</p>
          </div>

          <!-- Search related transactions -->
          <div class="relative w-full sm:w-44">
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              v-model="relatedTrxSearch"
              @input="handleRelatedFilter"
              type="text"
              placeholder="Cari kode/kasir..."
              class="w-full pl-7 pr-6 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              v-if="relatedTrxSearch"
              @click="relatedTrxSearch = ''; handleRelatedFilter()"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X class="w-3 h-3" />
            </button>
          </div>
        </div>

        <div v-if="loading" class="p-12 text-center text-slate-400 text-sm">
          <span class="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></span>
          Memuat rincian transaksi...
        </div>

        <div v-else-if="filteredRelatedTransactions.length === 0" class="p-12 text-center text-slate-400 text-xs">
          {{ relatedTrxSearch ? 'Tidak ada transaksi yang cocok dengan pencarian.' : 'Belum ada transaksi dalam periode ini.' }}
        </div>

        <div v-else>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50/80 text-[10px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th class="px-4 py-2.5">Kode</th>
                  <th class="px-4 py-2.5">Tgl & Kasir</th>
                  <th class="px-4 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="trx in paginatedRelatedTransactions"
                  :key="trx.id"
                  class="hover:bg-slate-50/70 transition-colors"
                >
                  <td class="px-4 py-3 font-mono font-bold text-indigo-600">
                    {{ trx.transaction_code }}
                  </td>
                  <td class="px-4 py-3 text-slate-600">
                    <div>{{ formatDate(trx.transaction_date) }}</div>
                    <div class="text-[10px] text-slate-400">Oleh: {{ trx.user?.name || 'Kasir' }}</div>
                  </td>
                  <td class="px-4 py-3 text-right font-extrabold text-slate-900">
                    {{ formatCurrency(trx.total) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination for Related Transactions -->
          <PaginationControls
            :current-page="relatedPagination.currentPage"
            :last-page="relatedPagination.lastPage"
            :total="relatedPagination.total"
            :from="relatedPagination.from"
            :to="relatedPagination.to"
            :per-page="relatedPagination.perPage"
            :per-page-options="[5, 10, 20]"
            :loading="loading"
            @page-change="onRelatedPageChange"
            @per-page-change="onRelatedPerPageChange"
          />
        </div>
      </div>
    </div>

    <!-- Print-Only Official Signature Section -->
    <div class="print-only hidden pt-8 mt-8 border-t border-slate-300 break-inside-avoid">
      <div class="flex justify-between text-xs text-slate-700">
        <div class="text-center w-52">
          <p>Dibuat & Diverifikasi:</p>
          <div class="h-16"></div>
          <p class="font-bold underline text-slate-900">{{ authStore.user?.name }}</p>
          <p class="text-[10px] text-slate-500">Kasir / Owner Tenant</p>
        </div>
        <div class="text-center w-52">
          <p>Mengetahui / Pimpinan:</p>
          <div class="h-16"></div>
          <p class="font-bold underline text-slate-900">( ........................................ )</p>
          <p class="text-[10px] text-slate-500">{{ authStore.tenant?.name }}</p>
        </div>
      </div>
      <p class="text-[9px] text-slate-400 text-center mt-6">
        Dokumen ini sah dicetak langsung dari sistem Mini ERP SaaS PT Oka Iki Indonesia dengan isolasi data multi-tenant terverifikasi.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { reportService } from '../services';
import { useClientPagination } from '../composables/useClientPagination';
import { formatCurrency, formatDate } from '../utils/formatters';
import { exportReportToPdf } from '../utils/reportPdfExporter';
import { exportReportToExcel } from '../utils/reportExcelExporter';
import PaginationControls from '../components/PaginationControls.vue';
import {
  ShieldCheck,
  Filter,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  Search,
  X,
} from '@lucide/vue';

const authStore = useAuthStore();
const loading = ref(true);
const reportData = ref(null);

const filters = reactive({
  startDate: '',
  endDate: '',
});

// Daily Breakdown Search & Pagination
const dailySearch = ref('');
const filteredDailyBreakdown = computed(() => {
  const list = reportData.value?.daily_breakdown || [];
  if (!dailySearch.value.trim()) return list;
  const q = dailySearch.value.trim().toLowerCase();
  return list.filter((d) => (d.transaction_date || '').toLowerCase().includes(q));
});

const dailyPagination = useClientPagination(filteredDailyBreakdown, { initialPerPage: 5 });
const paginatedDailyBreakdown = dailyPagination.paginatedItems;

watch(dailySearch, () => {
  dailyPagination.reset();
});

function handleDailyFilter() {
  dailyPagination.reset();
}

function onDailyPageChange(page) {
  dailyPagination.setPage(page);
}

function onDailyPerPageChange(newPerPage) {
  dailyPagination.setPerPage(newPerPage);
}

// Related Transactions Search & Pagination
const relatedTrxSearch = ref('');
const filteredRelatedTransactions = computed(() => {
  const list = reportData.value?.recent_transactions || [];
  if (!relatedTrxSearch.value.trim()) return list;
  const q = relatedTrxSearch.value.trim().toLowerCase();
  return list.filter((trx) => {
    const code = (trx.transaction_code || '').toLowerCase();
    const user = (trx.user?.name || '').toLowerCase();
    return code.includes(q) || user.includes(q);
  });
});

const relatedPagination = useClientPagination(filteredRelatedTransactions, { initialPerPage: 5 });
const paginatedRelatedTransactions = relatedPagination.paginatedItems;

watch(relatedTrxSearch, () => {
  relatedPagination.reset();
});

function handleRelatedFilter() {
  relatedPagination.reset();
}

function onRelatedPageChange(page) {
  relatedPagination.setPage(page);
}

function onRelatedPerPageChange(newPerPage) {
  relatedPagination.setPerPage(newPerPage);
}

const printDateTimeString = computed(() => {
  return new Date().toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
});

const totalCalculatedTrx = computed(() => {
  if (!reportData.value?.daily_breakdown) return 0;
  return reportData.value.daily_breakdown.reduce(
    (acc, cur) => acc + Number(cur.transaction_count || 0),
    0
  );
});

const totalCalculatedRevenue = computed(() => {
  if (!reportData.value?.daily_breakdown) return 0;
  return reportData.value.daily_breakdown.reduce(
    (acc, cur) => acc + Number(cur.daily_revenue || 0),
    0
  );
});

onMounted(() => {
  applyPreset('this_month');
});

function applyPreset(preset) {
  const now = new Date();
  if (preset === 'this_month') {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    filters.startDate = firstDay.toISOString().split('T')[0];
    filters.endDate = now.toISOString().split('T')[0];
  } else if (preset === 'last_month') {
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
    filters.startDate = firstDay.toISOString().split('T')[0];
    filters.endDate = lastDay.toISOString().split('T')[0];
  }
  loadReport();
}

async function loadReport() {
  loading.value = true;
  try {
    const params = {};
    if (filters.startDate) params.start_date = filters.startDate;
    if (filters.endDate) params.end_date = filters.endDate;

    const res = await reportService.getReports(params);
    reportData.value = res.data;
    dailyPagination.reset();
    relatedPagination.reset();
  } catch (err) {
    console.error('Failed to load reports', err);
  } finally {
    loading.value = false;
  }
}

/**
 * Download Clean & Formal PDF Report
 */
function downloadPdf() {
  exportReportToPdf({
    reportData: reportData.value,
    tenantName: authStore.tenant?.name,
    tenantId: authStore.tenant?.id,
    userName: authStore.user?.name,
    startDate: filters.startDate || reportData.value?.period?.start_date,
    endDate: filters.endDate || reportData.value?.period?.end_date,
    totalCalculatedTrx: totalCalculatedTrx.value,
    totalCalculatedRevenue: totalCalculatedRevenue.value,
  });
}

/**
 * Download Executive Styled Excel Spreadsheet (.xlsx)
 */
async function downloadExcel() {
  await exportReportToExcel({
    reportData: reportData.value,
    tenantName: authStore.tenant?.name,
    tenantId: authStore.tenant?.id,
    userName: authStore.user?.name,
    startDate: filters.startDate || reportData.value?.period?.start_date,
    endDate: filters.endDate || reportData.value?.period?.end_date,
    totalCalculatedTrx: totalCalculatedTrx.value,
    totalCalculatedRevenue: totalCalculatedRevenue.value,
  });
}

/**
 * Print Report via Browser Native Print with Print-Ready Stylesheet
 */
function printReport() {
  window.print();
}
</script>
