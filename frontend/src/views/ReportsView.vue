<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
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
            class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Bulan Ini
          </button>
          <button
            @click="applyPreset('last_month')"
            type="button"
            class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Bulan Lalu
          </button>
          <button
            @click="loadReport"
            :disabled="loading"
            type="button"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Filter class="w-3.5 h-3.5" />
            <span>Terapkan Filter</span>
          </button>
        </div>
      </div>
    </div>

    <!-- KPI Metric Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- MTD Revenue -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Omzet Bulan Berjalan</span>
        <div class="mt-2 text-2xl font-extrabold text-indigo-600">
          {{ formatCurrency(reportData?.current_month?.total_revenue) }}
        </div>
        <p class="text-xs text-slate-400 mt-1">Standar bulan ini (1 s/d hari ini)</p>
      </div>

      <!-- MTD Trx Count -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Transaksi Bulan Ini</span>
        <div class="mt-2 text-2xl font-extrabold text-slate-900">
          {{ reportData?.current_month?.total_transactions || 0 }} Transaksi
        </div>
        <p class="text-xs text-slate-400 mt-1">Volume order bulan ini</p>
      </div>

      <!-- Filtered Period Revenue -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm bg-gradient-to-br from-indigo-50/50 to-transparent">
        <span class="text-xs font-semibold uppercase tracking-wider text-indigo-900">Total Omzet (Periode Terpilih)</span>
        <div class="mt-2 text-2xl font-extrabold text-indigo-700">
          {{ formatCurrency(reportData?.filtered_summary?.total_revenue) }}
        </div>
        <p class="text-xs text-indigo-500 mt-1">Hasil filter rentang tanggal</p>
      </div>

      <!-- Filtered Trx Count -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Rata-rata Transaksi (AOV)</span>
        <div class="mt-2 text-2xl font-extrabold text-slate-900">
          {{ formatCurrency(reportData?.filtered_summary?.avg_order_value) }}
        </div>
        <p class="text-xs text-slate-400 mt-1">Per transaksi di periode ini</p>
      </div>
    </div>

    <!-- Daily Breakdown Section -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Daily Aggregations (7 cols) -->
      <div class="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-base text-slate-900">Agregasi Harian Server-Side</h3>
            <p class="text-xs text-slate-500 mt-0.5">Dihitung langsung via query database SQL</p>
          </div>
          <span class="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md font-semibold">
            {{ reportData?.daily_breakdown?.length || 0 }} Hari Aktif
          </span>
        </div>

        <div v-if="loading" class="p-12 text-center text-slate-400 text-sm">
          <span class="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></span>
          <p>Mengagregasi data transaksi...</p>
        </div>

        <div v-else-if="!reportData?.daily_breakdown || reportData.daily_breakdown.length === 0" class="p-12 text-center text-slate-400 text-xs">
          Tidak ada transaksi tercatat dalam rentang tanggal ini.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th class="px-5 py-3">Tanggal</th>
                <th class="px-5 py-3 text-center">Jumlah Transaksi</th>
                <th class="px-5 py-3 text-right">Total Omzet Harian</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs">
              <tr v-for="daily in reportData.daily_breakdown" :key="daily.transaction_date" class="hover:bg-slate-50/70">
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
          </table>
        </div>
      </div>

      <!-- Detail Transactions in Period (5 cols) -->
      <div class="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100">
          <h3 class="font-bold text-base text-slate-900">Daftar Transaksi Terkait</h3>
          <p class="text-xs text-slate-500 mt-0.5">Transaksi tenant dalam rentang filter</p>
        </div>

        <div v-if="loading" class="p-12 text-center text-slate-400 text-sm">
          Memuat rincian transaksi...
        </div>

        <div v-else-if="!reportData?.recent_transactions || reportData.recent_transactions.length === 0" class="p-12 text-center text-slate-400 text-xs">
          Belum ada transaksi.
        </div>

        <div v-else class="divide-y divide-slate-100 max-h-96 overflow-y-auto">
          <div
            v-for="trx in reportData.recent_transactions"
            :key="trx.id"
            class="p-4 hover:bg-slate-50/70 transition-colors flex items-center justify-between"
          >
            <div>
              <p class="text-xs font-bold font-mono text-indigo-600">{{ trx.transaction_code }}</p>
              <p class="text-[11px] text-slate-500 mt-0.5">
                {{ formatDate(trx.transaction_date) }} &bull; Kasir: {{ trx.user?.name }}
              </p>
            </div>
            <span class="text-xs font-extrabold text-slate-900">
              {{ formatCurrency(trx.total) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ShieldCheck, Filter } from '@lucide/vue';

const authStore = useAuthStore();
const loading = ref(true);
const reportData = ref(null);

const filters = reactive({
  startDate: '',
  endDate: '',
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
  } catch (err) {
    console.error('Failed to load reports', err);
  } finally {
    loading.value = false;
  }
}
</script>
