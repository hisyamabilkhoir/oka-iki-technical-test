<template>
  <div class="space-y-6">
    <!-- Top Hero Welcome Banner -->
    <div
      class="bg-gradient-to-r from-[#EDF2FE] via-[#E4EAFE] to-[#DCE5FC] rounded-3xl p-6 md:p-8 border border-blue-100/80 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <!-- Left Content -->
      <div class="relative z-10 flex-1 min-w-0">
        <!-- Tenant Context Pill -->
        <div
          class="inline-flex items-center space-x-2 bg-white/90 text-indigo-700 text-xs font-semibold px-3.5 py-1 rounded-full border border-indigo-200/80 shadow-xs mb-3"
        >
          <Building2 class="w-3.5 h-3.5 text-indigo-600" />
          <span>Multi-Tenant Context: {{ authStore.tenant?.name }}</span>
        </div>

        <!-- Heading with User Name -->
        <h1 class="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Selamat Datang, <span class="text-indigo-600">{{ authStore.user?.name }}</span>!
        </h1>

        <!-- Subtitle -->
        <p class="text-slate-600 text-sm mt-2 max-w-xl leading-relaxed">
          Sistem Mini ERP SaaS aktif dengan isolasi data tenant yang terverifikasi. Kelola transaksi, produk, dan laporan dengan lebih mudah dan efisien.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap items-center gap-3 mt-5">
          <router-link
            to="/transactions"
            class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all flex items-center space-x-2 shrink-0"
          >
            <Plus class="w-4 h-4" />
            <span>Buat Transaksi</span>
          </router-link>

          <router-link
            v-if="authStore.isOwner"
            to="/reports"
            class="px-5 py-2.5 bg-white/90 hover:bg-white text-indigo-600 text-sm font-semibold rounded-xl border border-indigo-200/90 shadow-xs hover:border-indigo-300 transition-all flex items-center space-x-2 shrink-0"
          >
            <BarChart3 class="w-4 h-4" />
            <span>Lihat Laporan</span>
          </router-link>
        </div>
      </div>

      <!-- Right 3D Illustration matching mockup -->
      <div class="relative shrink-0 flex items-center justify-center md:justify-end">
        <img
          :src="dashboardHeroImg"
          alt="Kelola Bisnis Lebih Mudah"
          class="h-44 sm:h-48 md:h-52 object-contain select-none pointer-events-none drop-shadow-sm"
        />
      </div>
    </div>

    <!-- 4 Metric Stat Cards Grid matching mockup -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Card 1: Katalog Produk -->
      <router-link
        to="/products"
        class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all flex items-center space-x-4 group cursor-pointer"
      >
        <div class="w-14 h-14 rounded-2xl bg-indigo-50/80 border border-indigo-100/60 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
          <Package class="w-7 h-7" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">KATALOG PRODUK</span>
            <ChevronRight class="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div class="mt-1">
            <div v-if="loading" class="h-7 w-16 bg-slate-100 animate-pulse rounded"></div>
            <div v-else class="text-2xl font-extrabold text-slate-900 leading-tight">
              {{ productCount }} Item
            </div>
          </div>
          <p class="text-[11px] text-slate-400 mt-1 truncate" :title="authStore.tenant?.name">
            Hanya milik {{ authStore.tenant?.name }}
          </p>
        </div>
      </router-link>

      <!-- Card 2: Transaksi Bulan Ini -->
      <router-link
        to="/transactions"
        class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all flex items-center space-x-4 group cursor-pointer"
      >
        <div class="w-14 h-14 rounded-2xl bg-emerald-50/80 border border-emerald-100/60 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
          <ShoppingCart class="w-7 h-7" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">TRANSAKSI BULAN INI</span>
            <ChevronRight class="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div class="mt-1 flex items-center space-x-2">
            <div v-if="loading" class="h-7 w-14 bg-slate-100 animate-pulse rounded"></div>
            <div v-else class="text-2xl font-extrabold text-slate-900 leading-tight">
              {{ monthlyTransactionsCount }} Trx
            </div>
            <span class="bg-emerald-50 text-emerald-600 border border-emerald-200/50 text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center space-x-0.5">
              <span>↑</span>
              <span>25%</span>
            </span>
          </div>
          <p class="text-[11px] text-slate-400 mt-1">Periode bulan berjalan</p>
        </div>
      </router-link>

      <!-- Card 3: Omzet Bulan Ini -->
      <router-link
        :to="authStore.isOwner ? '/reports' : '#'"
        :class="[
          'bg-white rounded-2xl p-5 border border-slate-100 shadow-sm transition-all flex items-center space-x-4 group',
          authStore.isOwner ? 'hover:shadow-md hover:border-amber-100 cursor-pointer' : 'cursor-default'
        ]"
      >
        <div class="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-100/60 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition-transform">
          <ShieldAlert class="w-7 h-7" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">OMZET BULAN INI</span>
            <ChevronRight class="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div class="mt-1">
            <div v-if="loading" class="h-7 w-28 bg-slate-100 animate-pulse rounded"></div>
            <div v-else-if="authStore.isOwner" class="flex items-center space-x-2 flex-wrap">
              <span class="text-xl lg:text-2xl font-extrabold text-slate-900 leading-tight">
                {{ formatCurrency(monthlyRevenue) }}
              </span>
              <span class="bg-emerald-50 text-emerald-600 border border-emerald-200/50 text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center space-x-0.5">
                <span>↑</span>
                <span>12%</span>
              </span>
            </div>
            <div v-else class="text-xs font-semibold text-slate-400 italic py-1">
              Terbatas (Hanya Owner)
            </div>
          </div>
          <p class="text-[11px] text-slate-400 mt-1">Perhitungan server-side</p>
        </div>
      </router-link>

      <!-- Card 4: Hak Akses Sistem -->
      <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center space-x-4 group">
        <div class="w-14 h-14 rounded-2xl bg-blue-50/80 border border-blue-100/60 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
          <ShieldCheck class="w-7 h-7" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400">HAK AKSES SISTEM</span>
            <ChevronRight class="w-4 h-4 text-indigo-400" />
          </div>
          <div class="mt-1">
            <div class="text-2xl font-black text-indigo-600 tracking-wide uppercase">
              {{ authStore.user?.role }}
            </div>
          </div>
          <p class="text-[11px] text-slate-400 mt-1 truncate">
            {{ authStore.isOwner ? 'Full Control: Produk, Trx, Laporan' : 'Kasir & View Produk (No Delete/Report)' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Transactions Table Section matching mockup -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <!-- Card Header -->
      <div class="p-5 border-b border-slate-100 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-700">
            <Package class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base font-extrabold text-slate-900 leading-tight">Transaksi Terakhir</h2>
            <p class="text-xs text-slate-400 mt-0.5">Daftar transaksi mutakhir tenant {{ authStore.tenant?.name }}</p>
          </div>
        </div>

        <router-link
          to="/transactions"
          class="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/80 hover:bg-indigo-100 px-4 py-2 rounded-xl flex items-center space-x-1.5 transition-colors border border-indigo-100/60"
        >
          <span>Lihat Semua</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <div v-if="loading" class="p-10 text-center text-slate-400 text-sm">
          <span class="inline-block w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></span>
          Memuat data transaksi...
        </div>

        <div v-else-if="recentTransactions.length === 0" class="p-14 text-center">
          <ShoppingCart class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p class="text-sm font-semibold text-slate-700">Belum ada transaksi</p>
          <p class="text-xs text-slate-500 mt-1">Silakan buat transaksi baru melalui modul Kasir / Transaksi.</p>
        </div>

        <table v-else class="w-full text-left text-sm">
          <thead class="bg-white text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
            <tr>
              <th class="py-4 px-6">KODE TRANSAKSI</th>
              <th class="py-4 px-6">TANGGAL</th>
              <th class="py-4 px-6">DIBUAT OLEH</th>
              <th class="py-4 px-6">
                <div class="flex items-center space-x-1">
                  <span>JUMLAH ITEM</span>
                  <ChevronsUpDown class="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th class="py-4 px-6">
                <div class="flex items-center space-x-1">
                  <span>TOTAL TRANSAKSI</span>
                  <ChevronsUpDown class="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th class="py-4 px-6 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody class="divide-y border-slate-100 divide-slate-100">
            <tr
              v-for="trx in recentTransactions"
              :key="trx.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="py-4 px-6">
                <button
                  @click="viewReceipt(trx)"
                  class="font-mono font-bold text-indigo-600 hover:underline text-xs"
                >
                  {{ trx.transaction_code }}
                </button>
              </td>
              <td class="py-4 px-6 text-slate-600 text-xs font-medium">
                {{ formatDate(trx.transaction_date) }}
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-slate-800 text-xs">{{ trx.creator?.name || 'User' }}</span>
                  <span
                    :class="[
                      'text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize',
                      trx.creator?.role === 'owner'
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/60'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100/60'
                    ]"
                  >
                    {{ trx.creator?.role }}
                  </span>
                </div>
              </td>
              <td class="py-4 px-6 text-slate-700 text-xs font-medium">
                {{ trx.items?.length || 1 }} Item
              </td>
              <td class="py-4 px-6 font-bold text-slate-900 text-sm">
                {{ formatCurrency(trx.total) }}
              </td>
              <td class="py-4 px-6 text-center">
                <button
                  @click="viewReceipt(trx)"
                  title="Lihat Struk Resmi"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <MoreHorizontal class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Receipt Modal Dialog -->
    <div
      v-if="showReceiptModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center space-x-2 text-indigo-600">
            <CheckCircle2 class="w-5 h-5 text-emerald-500" />
            <h3 class="font-bold text-base text-slate-900">Struk Transaksi Resmi</h3>
          </div>
          <button @click="showReceiptModal = false" class="text-slate-400 hover:text-slate-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3 font-mono text-xs">
          <div class="text-center pb-3 border-b border-dashed border-slate-300">
            <h4 class="font-bold text-sm text-slate-900">{{ authStore.tenant?.name }}</h4>
            <p class="text-[11px] text-slate-500">Mini ERP SaaS Multi-Tenant</p>
            <p class="text-[10px] text-slate-400 mt-1">KODE: {{ currentReceipt?.transaction_code }}</p>
          </div>

          <div class="flex justify-between text-[11px] text-slate-600">
            <span>Tanggal: {{ formatDate(currentReceipt?.transaction_date) }}</span>
            <span>Kasir: {{ currentReceipt?.creator?.name || authStore.user?.name }}</span>
          </div>

          <div class="py-2 border-y border-dashed border-slate-300 space-y-1.5">
            <div
              v-for="item in currentReceipt?.items"
              :key="item.id"
              class="flex justify-between items-start text-[11px]"
            >
              <div class="min-w-0 pr-2">
                <p class="font-semibold text-slate-800">{{ item.product_name }}</p>
                <p class="text-slate-500 text-[10px]">
                  {{ item.qty }} x {{ formatCurrency(item.price_at_transaction) }}
                </p>
              </div>
              <span class="font-bold text-slate-900 shrink-0">
                {{ formatCurrency(item.subtotal) }}
              </span>
            </div>
          </div>

          <div class="flex justify-between text-sm font-extrabold text-slate-900 pt-1">
            <span>TOTAL DIBAYAR</span>
            <span class="text-indigo-600">{{ formatCurrency(currentReceipt?.total) }}</span>
          </div>

          <div class="text-center pt-2 text-[10px] text-slate-400 border-t border-dashed border-slate-300">
            Price snapshot tersimpan permanen di database.
          </div>
        </div>

        <div class="mt-5">
          <button
            @click="showReceiptModal = false"
            class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Tutup Struk
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';
import { formatCurrency, formatDate } from '../utils/formatters';
import dashboardHeroImg from '../assets/dashboard_hero.png';
import {
  Building2,
  Package,
  ShoppingCart,
  ShieldCheck,
  ShieldAlert,
  Plus,
  BarChart3,
  ChevronRight,
  ChevronsUpDown,
  ArrowRight,
  MoreHorizontal,
  X,
  CheckCircle2,
} from '@lucide/vue';

const authStore = useAuthStore();
const loading = ref(true);

const productCount = ref(0);
const monthlyTransactionsCount = ref(0);
const monthlyRevenue = ref(0);
const recentTransactions = ref([]);

const showReceiptModal = ref(false);
const currentReceipt = ref(null);

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

function viewReceipt(trx) {
  currentReceipt.value = trx;
  showReceiptModal.value = true;
}
</script>
