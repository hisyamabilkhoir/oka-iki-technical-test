<template>
  <div class="space-y-6">
    <!-- Welcome Header Banner -->
    <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
      <div class="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
      <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-500/30 mb-3">
            <Building2 class="w-3.5 h-3.5" />
            <span>Multi-Tenant Context: {{ authStore.tenant?.name }}</span>
          </div>
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight">
            Selamat Datang, {{ authStore.user?.name }}!
          </h1>
          <p class="text-slate-300 text-sm mt-1 max-w-2xl">
            Sistem Mini ERP SaaS aktif dengan isolasi data terenkapsulasi penuh. Seluruh data transaksi, produk, dan laporan di bawah ini milik perusahaan <strong class="text-white">{{ authStore.tenant?.name }}</strong>.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <router-link
            to="/transactions"
            class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 shrink-0"
          >
            <Plus class="w-4 h-4" />
            <span>Buat Transaksi</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Metric Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Card 1: Total Produk -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Katalog Produk</span>
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package class="w-5 h-5" />
          </div>
        </div>
        <div class="mt-3">
          <div v-if="loading" class="h-8 w-20 bg-slate-100 animate-pulse rounded"></div>
          <div v-else class="text-2xl font-bold text-slate-900">{{ productCount }} Item</div>
          <p class="text-xs text-slate-500 mt-1">Hanya milik {{ authStore.tenant?.name }}</p>
        </div>
      </div>

      <!-- Card 2: Total Transaksi Bulan Ini -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Transaksi Bulan Ini</span>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingCart class="w-5 h-5" />
          </div>
        </div>
        <div class="mt-3">
          <div v-if="loading" class="h-8 w-20 bg-slate-100 animate-pulse rounded"></div>
          <div v-else class="text-2xl font-bold text-slate-900">{{ monthlyTransactionsCount }} Trx</div>
          <p class="text-xs text-slate-500 mt-1">Periode bulan berjalan</p>
        </div>
      </div>

      <!-- Card 3: Omzet Bulan Ini (Owner Only view) -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Omzet Bulan Ini</span>
          <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <DollarSign class="w-5 h-5" />
          </div>
        </div>
        <div class="mt-3">
          <div v-if="loading" class="h-8 w-28 bg-slate-100 animate-pulse rounded"></div>
          <div v-else-if="authStore.isOwner" class="text-2xl font-bold text-slate-900">
            {{ formatCurrency(monthlyRevenue) }}
          </div>
          <div v-else class="text-sm font-semibold text-slate-400 italic py-1.5 flex items-center space-x-1">
            <ShieldAlert class="w-4 h-4 text-amber-500" />
            <span>Terbatas (Hanya Owner)</span>
          </div>
          <p class="text-xs text-slate-500 mt-1">Perhitungan server-side</p>
        </div>
      </div>

      <!-- Card 4: Role & Keamanan -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-500">Hak Akses Sistem</span>
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldCheck class="w-5 h-5" />
          </div>
        </div>
        <div class="mt-3">
          <div class="text-2xl font-bold uppercase tracking-wide" :class="authStore.isOwner ? 'text-indigo-600' : 'text-emerald-600'">
            {{ authStore.user?.role }}
          </div>
          <p class="text-xs text-slate-500 mt-1">
            {{ authStore.isOwner ? 'Full Control: Produk, Trx, Laporan' : 'Kasir & View Produk (No Delete/Report)' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Transactions Section -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900">Transaksi Terakhir</h2>
          <p class="text-xs text-slate-500 mt-0.5">Daftar transaksi mutakhir tenant {{ authStore.tenant?.name }}</p>
        </div>
        <router-link
          to="/transactions"
          class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
        >
          <span>Lihat Semua</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <div v-if="loading" class="p-8 text-center text-slate-400 text-sm">
          <span class="inline-block w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></span>
          Memuat data transaksi...
        </div>

        <div v-else-if="recentTransactions.length === 0" class="p-12 text-center">
          <ShoppingCart class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p class="text-sm font-semibold text-slate-700">Belum ada transaksi</p>
          <p class="text-xs text-slate-500 mt-1">Silakan buat transaksi baru melalui modul Kasir / Transaksi.</p>
        </div>

        <table v-else class="w-full text-left text-sm">
          <thead class="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <tr>
              <th class="px-5 py-3">Kode Transaksi</th>
              <th class="px-5 py-3">Tanggal</th>
              <th class="px-5 py-3">Dibuat Oleh</th>
              <th class="px-5 py-3">Jumlah Item</th>
              <th class="px-5 py-3 text-right">Total Transaksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="trx in recentTransactions" :key="trx.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="px-5 py-3.5 font-mono font-semibold text-indigo-600 text-xs">
                {{ trx.transaction_code }}
              </td>
              <td class="px-5 py-3.5 text-slate-600 text-xs">
                {{ formatDate(trx.transaction_date) }}
              </td>
              <td class="px-5 py-3.5">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-slate-800 text-xs">{{ trx.creator?.name || 'User' }}</span>
                  <span class="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                    {{ trx.creator?.role }}
                  </span>
                </div>
              </td>
              <td class="px-5 py-3.5 text-slate-600 text-xs">
                {{ trx.items?.length || 0 }} Item
              </td>
              <td class="px-5 py-3.5 text-right font-bold text-slate-900">
                {{ formatCurrency(trx.total) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Building2,
  Package,
  ShoppingCart,
  DollarSign,
  ShieldCheck,
  ShieldAlert,
  Plus,
  ArrowRight,
} from '@lucide/vue';

const authStore = useAuthStore();
const loading = ref(true);

const productCount = ref(0);
const monthlyTransactionsCount = ref(0);
const monthlyRevenue = ref(0);
const recentTransactions = ref([]);

onMounted(async () => {
  await loadDashboardData();
});

async function loadDashboardData() {
  loading.value = true;
  try {
    // 1. Fetch products count
    const prodRes = await api.get('/products?per_page=1');
    productCount.value = prodRes.data.meta?.total || prodRes.data.data?.length || 0;

    // 2. Fetch transactions
    const trxRes = await api.get('/transactions?per_page=5');
    recentTransactions.value = trxRes.data.data || [];

    // 3. Fetch reports if owner
    if (authStore.isOwner) {
      const reportRes = await api.get('/reports');
      monthlyTransactionsCount.value = reportRes.data.data?.current_month?.total_transactions || 0;
      monthlyRevenue.value = reportRes.data.data?.current_month?.total_revenue || 0;
    } else {
      monthlyTransactionsCount.value = trxRes.data.meta?.total || recentTransactions.value.length;
      monthlyRevenue.value = 0;
    }
  } catch (err) {
    console.error('Error fetching dashboard metrics', err);
  } finally {
    loading.value = false;
  }
}
</script>
