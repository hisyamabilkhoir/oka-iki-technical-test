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
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';
import { formatCurrency, formatDate } from '../utils/formatters';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
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
const dailyPagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  from: 0,
  to: 0,
  perPage: 5,
});

const filteredDailyBreakdown = computed(() => {
  const list = reportData.value?.daily_breakdown || [];
  if (!dailySearch.value.trim()) return list;
  const q = dailySearch.value.trim().toLowerCase();
  return list.filter((d) => {
    return (d.transaction_date || '').toLowerCase().includes(q);
  });
});

const paginatedDailyBreakdown = computed(() => {
  const start = (dailyPagination.currentPage - 1) * dailyPagination.perPage;
  return filteredDailyBreakdown.value.slice(start, start + dailyPagination.perPage);
});

function updateDailyPaginationMeta() {
  const total = filteredDailyBreakdown.value.length;
  dailyPagination.total = total;
  dailyPagination.lastPage = Math.max(1, Math.ceil(total / dailyPagination.perPage));
  if (dailyPagination.currentPage > dailyPagination.lastPage) {
    dailyPagination.currentPage = dailyPagination.lastPage;
  }
  if (total === 0) {
    dailyPagination.from = 0;
    dailyPagination.to = 0;
  } else {
    dailyPagination.from = (dailyPagination.currentPage - 1) * dailyPagination.perPage + 1;
    dailyPagination.to = Math.min(dailyPagination.currentPage * dailyPagination.perPage, total);
  }
}

function handleDailyFilter() {
  dailyPagination.currentPage = 1;
  updateDailyPaginationMeta();
}

function onDailyPageChange(page) {
  dailyPagination.currentPage = page;
  updateDailyPaginationMeta();
}

function onDailyPerPageChange(newPerPage) {
  dailyPagination.perPage = newPerPage;
  dailyPagination.currentPage = 1;
  updateDailyPaginationMeta();
}

// Related Transactions Search & Pagination
const relatedTrxSearch = ref('');
const relatedPagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  from: 0,
  to: 0,
  perPage: 5,
});

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

const paginatedRelatedTransactions = computed(() => {
  const start = (relatedPagination.currentPage - 1) * relatedPagination.perPage;
  return filteredRelatedTransactions.value.slice(start, start + relatedPagination.perPage);
});

function updateRelatedPaginationMeta() {
  const total = filteredRelatedTransactions.value.length;
  relatedPagination.total = total;
  relatedPagination.lastPage = Math.max(1, Math.ceil(total / relatedPagination.perPage));
  if (relatedPagination.currentPage > relatedPagination.lastPage) {
    relatedPagination.currentPage = relatedPagination.lastPage;
  }
  if (total === 0) {
    relatedPagination.from = 0;
    relatedPagination.to = 0;
  } else {
    relatedPagination.from = (relatedPagination.currentPage - 1) * relatedPagination.perPage + 1;
    relatedPagination.to = Math.min(relatedPagination.currentPage * relatedPagination.perPage, total);
  }
}

function handleRelatedFilter() {
  relatedPagination.currentPage = 1;
  updateRelatedPaginationMeta();
}

function onRelatedPageChange(page) {
  relatedPagination.currentPage = page;
  updateRelatedPaginationMeta();
}

function onRelatedPerPageChange(newPerPage) {
  relatedPagination.perPage = newPerPage;
  relatedPagination.currentPage = 1;
  updateRelatedPaginationMeta();
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

    const res = await api.get('/reports', { params });
    reportData.value = res.data.data;
    updateDailyPaginationMeta();
    updateRelatedPaginationMeta();
  } catch (err) {
    console.error('Failed to load reports', err);
  } finally {
    loading.value = false;
  }
}

/**
 * Download Clean & Formal PDF Report using jsPDF + autoTable
 */
function downloadPdf() {
  if (!reportData.value) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const tenantName = authStore.tenant?.name || 'Tenant';
  const tenantId = authStore.tenant?.id || '1';
  const userName = authStore.user?.name || 'Owner';
  const startDate = filters.startDate || reportData.value.period?.start_date || '-';
  const endDate = filters.endDate || reportData.value.period?.end_date || '-';
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
  const totalOmzet = formatCurrency(reportData.value.filtered_summary?.total_revenue || 0);
  const totalTrx = (reportData.value.filtered_summary?.total_transactions || 0) + ' Transaksi';
  const aov = formatCurrency(reportData.value.filtered_summary?.avg_order_value || 0);
  const mtdOmzet = formatCurrency(reportData.value.current_month?.total_revenue || 0);

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

  const dailyRows = (reportData.value.daily_breakdown || []).map((item, idx) => [
    idx + 1,
    formatDate(item.transaction_date),
    item.transaction_count + ' Trx',
    formatCurrency(item.daily_revenue),
  ]);

  dailyRows.push([
    'TOTAL',
    'Semua Hari',
    totalCalculatedTrx.value + ' Trx',
    formatCurrency(totalCalculatedRevenue.value),
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

  const trxRows = (reportData.value.recent_transactions || []).map((trx, idx) => [
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

/**
 * Download Comprehensive Excel Sheet (.xlsx) using SheetJS
 */
function downloadExcel() {
  if (!reportData.value) return;

  const tenantName = authStore.tenant?.name || 'Tenant';
  const tenantId = authStore.tenant?.id || '1';
  const userName = authStore.user?.name || 'Owner';
  const startDate = filters.startDate || reportData.value.period?.start_date || '-';
  const endDate = filters.endDate || reportData.value.period?.end_date || '-';
  const currentDateStr = new Date().toLocaleString('id-ID');

  const wb = XLSX.utils.book_new();

  // Sheet 1: Ringkasan & Harian
  const sheet1Data = [
    ['PT OKA IKI INDONESIA - MINI ERP SAAS MULTI-TENANT'],
    ['LAPORAN RESMI OMZET & PENDAPATAN'],
    [],
    ['Nama Tenant', tenantName],
    ['Tenant ID', `#${tenantId}`],
    ['Periode Laporan', `${startDate} s/d ${endDate}`],
    ['Tanggal Unduh', `${currentDateStr} WIB`],
    ['Diunduh Oleh', `${userName} (Owner)`],
    [],
    ['RINGKASAN EKSEKUTIF (KPI)', 'NILAI'],
    ['Total Omzet Periode Terpilih (Rp)', Number(reportData.value.filtered_summary?.total_revenue || 0)],
    ['Total Transaksi Periode Terpilih', Number(reportData.value.filtered_summary?.total_transactions || 0)],
    ['Rata-rata per Transaksi / AOV (Rp)', Number(reportData.value.filtered_summary?.avg_order_value || 0)],
    ['Omzet Bulan Berjalan / MTD (Rp)', Number(reportData.value.current_month?.total_revenue || 0)],
    ['Total Transaksi Bulan Berjalan', Number(reportData.value.current_month?.total_transactions || 0)],
    [],
    ['AGREGASI OMZET HARIAN'],
    ['No', 'Tanggal', 'Jumlah Transaksi', 'Total Omzet Harian (Rp)'],
  ];

  (reportData.value.daily_breakdown || []).forEach((item, idx) => {
    sheet1Data.push([
      idx + 1,
      item.transaction_date,
      Number(item.transaction_count || 0),
      Number(item.daily_revenue || 0),
    ]);
  });

  sheet1Data.push([
    'TOTAL',
    'Semua Hari',
    totalCalculatedTrx.value,
    totalCalculatedRevenue.value,
  ]);

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
  ws1['!cols'] = [
    { wch: 8 },
    { wch: 30 },
    { wch: 20 },
    { wch: 26 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan & Harian');

  // Sheet 2: Rincian Transaksi
  const sheet2Data = [
    ['PT OKA IKI INDONESIA - MINI ERP SAAS MULTI-TENANT'],
    ['DAFTAR RINCIAN TRANSAKSI PERIODE ' + startDate + ' S/D ' + endDate],
    ['Tenant: ' + tenantName],
    [],
    ['No', 'Kode Transaksi', 'Tanggal Transaksi', 'Kasir / Petugas', 'Role', 'Total Transaksi (Rp)'],
  ];

  (reportData.value.recent_transactions || []).forEach((trx, idx) => {
    sheet2Data.push([
      idx + 1,
      trx.transaction_code,
      trx.transaction_date,
      trx.user?.name || 'Kasir',
      trx.user?.role || 'user',
      Number(trx.total || 0),
    ]);
  });

  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);
  ws2['!cols'] = [
    { wch: 6 },
    { wch: 28 },
    { wch: 18 },
    { wch: 24 },
    { wch: 12 },
    { wch: 22 },
  ];
  XLSX.utils.book_append_sheet(wb, ws2, 'Daftar Transaksi');

  const cleanFilename = `Laporan_Omzet_${tenantName.replace(/[^a-zA-Z0-9]/g, '_')}_${startDate}_sd_${endDate}.xlsx`;
  XLSX.writeFile(wb, cleanFilename);
}

/**
 * Print Report via Browser Native Print with Print-Ready Stylesheet
 */
function printReport() {
  window.print();
}
</script>
