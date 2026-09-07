<template>
  <div class="space-y-4 md:space-y-5">
    <!-- Top Hero Welcome Banner (Snug, Balanced & Compact) -->
    <div
      class="bg-gradient-to-r from-[#edf2fe] via-[#e6edfd] to-[#dce6fc] rounded-2xl px-5 sm:px-6 md:px-7 py-3 sm:py-3.5 border border-blue-100/70 shadow-xs relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-5"
    >
      <!-- Left Content -->
      <div class="relative z-10 flex-1 min-w-0 max-w-2xl xl:max-w-3xl">
        <!-- Tenant Context Pill -->
        <div
          class="inline-flex items-center space-x-1.5 bg-white/90 text-indigo-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-indigo-200/70 shadow-2xs mb-1.5"
        >
          <Building2 class="w-3 h-3 text-indigo-600" />
          <span>Multi-Tenant Context: {{ authStore.tenant?.name }}</span>
        </div>

        <!-- Heading with User Name: Calm & Elegant -->
        <h1 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug">
          Selamat Datang, <span class="text-indigo-600">{{ authStore.user?.name }}</span>!
        </h1>

        <!-- Subtitle -->
        <p class="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed font-normal max-w-2xl">
          Sistem Mini ERP SaaS aktif dengan isolasi data tenant yang terverifikasi. Kelola transaksi, produk, dan laporan dengan lebih mudah dan efisien.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap items-center gap-2.5 mt-3">
          <router-link
            to="/transactions"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center space-x-1.5 shrink-0"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Buat Transaksi</span>
          </router-link>

          <router-link
            v-if="authStore.isOwner"
            to="/reports"
            class="px-4 py-2 bg-white/90 hover:bg-white text-indigo-600 text-xs font-medium rounded-xl border border-indigo-200/80 shadow-sm hover:border-indigo-300 transition-all flex items-center space-x-1.5 shrink-0"
          >
            <BarChart3 class="w-3.5 h-3.5" />
            <span>Lihat Laporan</span>
          </router-link>
        </div>
      </div>

      <!-- Right 3D Illustration matching latest graphic (Snug & Proportional) -->
      <div class="relative shrink-0 flex items-center justify-center lg:justify-end w-full lg:w-auto">
        <img
          :src="dashboardHeroImg"
          alt="Kelola Bisnis Lebih Mudah"
          class="h-28 sm:h-32 md:h-36 lg:h-38 w-auto object-contain select-none pointer-events-none drop-shadow-sm"
        />
      </div>
    </div>

    <!-- 4 Metric Stat Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
      <!-- Card 1: Katalog Produk -->
      <router-link
        to="/products"
        class="bg-white rounded-xl p-4 border border-slate-100 shadow-xs hover:shadow-md hover:border-indigo-100 transition-all flex items-center space-x-3.5 group cursor-pointer min-w-0"
      >
        <div class="w-10 h-10 rounded-xl bg-indigo-50/80 border border-indigo-100/60 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
          <Package class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">KATALOG PRODUK</span>
            <ChevronRight class="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div class="mt-0.5">
            <div v-if="loading" class="h-5 w-14 bg-slate-100 animate-pulse rounded"></div>
            <div v-else class="text-base sm:text-lg font-bold text-slate-800 leading-tight">
              {{ productCount }} Item
            </div>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5 truncate" :title="authStore.tenant?.name">
            Hanya milik {{ authStore.tenant?.name }}
          </p>
        </div>
      </router-link>

      <!-- Card 2: Transaksi Bulan Ini -->
      <router-link
        to="/transactions"
        class="bg-white rounded-xl p-4 border border-slate-100 shadow-xs hover:shadow-md hover:border-emerald-100 transition-all flex items-center space-x-3.5 group cursor-pointer min-w-0"
      >
        <div class="w-10 h-10 rounded-xl bg-emerald-50/80 border border-emerald-100/60 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
          <ShoppingCart class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">TRANSAKSI BULAN INI</span>
            <ChevronRight class="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div class="mt-0.5 flex items-center space-x-1.5">
            <div v-if="loading" class="h-5 w-12 bg-slate-100 animate-pulse rounded"></div>
            <div v-else class="text-base sm:text-lg font-bold text-slate-800 leading-tight">
              {{ monthlyTransactionsCount }} Trx
            </div>
            <span class="bg-emerald-50 text-emerald-600 border border-emerald-200/50 text-[10px] font-semibold px-1.5 py-0.2 rounded-full inline-flex items-center space-x-0.5">
              <span>↑</span>
              <span>25%</span>
            </span>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5">Periode bulan berjalan</p>
        </div>
      </router-link>

      <!-- Card 3: Omzet Bulan Ini -->
      <router-link
        :to="authStore.isOwner ? '/reports' : '#'"
        :class="[
          'bg-white rounded-xl p-4 border border-slate-100 shadow-xs transition-all flex items-center space-x-3.5 group min-w-0',
          authStore.isOwner ? 'hover:shadow-md hover:border-amber-100 cursor-pointer' : 'cursor-default'
        ]"
      >
        <div class="w-10 h-10 rounded-xl bg-amber-50/80 border border-amber-100/60 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition-transform">
          <ShieldAlert class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">OMZET BULAN INI</span>
            <ChevronRight class="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div class="mt-0.5">
            <div v-if="loading" class="h-5 w-24 bg-slate-100 animate-pulse rounded"></div>
            <div v-else-if="authStore.isOwner" class="flex items-center space-x-1.5 flex-wrap">
              <span class="text-base sm:text-lg font-bold text-slate-800 leading-tight">
                {{ formatCurrency(monthlyRevenue) }}
              </span>
              <span class="bg-emerald-50 text-emerald-600 border border-emerald-200/50 text-[10px] font-semibold px-1.5 py-0.2 rounded-full inline-flex items-center space-x-0.5">
                <span>↑</span>
                <span>12%</span>
              </span>
            </div>
            <div v-else class="text-xs font-medium text-slate-400 italic py-0.5">
              Terbatas (Hanya Owner)
            </div>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5">Perhitungan server-side</p>
        </div>
      </router-link>

      <!-- Card 4: Hak Akses Sistem -->
      <div class="bg-white rounded-xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all flex items-center space-x-3.5 group min-w-0">
        <div class="w-10 h-10 rounded-xl bg-blue-50/80 border border-blue-100/60 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
          <ShieldCheck class="w-5 h-5" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-400">HAK AKSES SISTEM</span>
            <ChevronRight class="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div class="mt-0.5">
            <div class="text-base sm:text-lg font-bold text-indigo-600 tracking-wide uppercase">
              {{ authStore.user?.role }}
            </div>
          </div>
          <p class="text-[11px] text-slate-400 mt-0.5 truncate">
            {{ authStore.isOwner ? 'Full Control: Master & Laporan' : 'Kasir & View Produk (Terbatas)' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Recent Transactions Table Section -->
    <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
      <!-- Card Header with Search and Filter Toolbar -->
      <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <div class="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600">
            <Package class="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 class="text-sm sm:text-base font-semibold text-slate-800 leading-tight">Transaksi Terakhir</h2>
            <p class="text-[11px] text-slate-400 mt-0.5 font-normal">Daftar transaksi mutakhir tenant {{ authStore.tenant?.name }}</p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <!-- Search input -->
          <div class="relative flex-1 md:w-56">
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="trxSearch"
              @input="handleTrxFilter"
              type="text"
              placeholder="Cari transaksi..."
              class="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
            />
            <button
              v-if="trxSearch"
              @click="trxSearch = ''; handleTrxFilter()"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X class="w-3 h-3" />
            </button>
          </div>

          <!-- Role Filter -->
          <select
            v-model="trxRoleFilter"
            @change="handleTrxFilter"
            class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Semua Petugas</option>
            <option value="owner">Owner Saja</option>
            <option value="staff">Staff Saja</option>
          </select>

          <router-link
            to="/transactions"
            class="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors border border-indigo-100/60 ml-auto md:ml-0"
          >
            <span>Buka Kasir</span>
            <ArrowRight class="w-3 h-3" />
          </router-link>
        </div>
      </div>

      <!-- Table Content -->
      <div class="overflow-x-auto">
        <div v-if="trxLoading && recentTransactions.length === 0" class="p-8 text-center text-slate-400 text-xs">
          <span class="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></span>
          Memuat data transaksi...
        </div>

        <div v-else-if="filteredTransactions.length === 0" class="p-12 text-center">
          <ShoppingCart class="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p class="text-sm font-medium text-slate-700">Tidak ada transaksi ditemukan</p>
          <p class="text-xs text-slate-400 mt-0.5 font-normal">
            {{ trxSearch || trxRoleFilter ? 'Tidak ada hasil yang sesuai dengan kata kunci atau filter petugas.' : 'Silakan buat transaksi baru melalui modul Kasir / Transaksi.' }}
          </p>
          <button
            v-if="trxSearch || trxRoleFilter"
            @click="resetTrxFilter"
            class="mt-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium"
          >
            Reset Filter
          </button>
        </div>

        <table v-else class="w-full min-w-[620px] text-left text-xs">
          <thead class="bg-white text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
            <tr>
              <th class="py-3 px-4">KODE TRANSAKSI</th>
              <th class="py-3 px-4">TANGGAL</th>
              <th class="py-3 px-4">DIBUAT OLEH</th>
              <th class="py-3 px-4">
                <div class="flex items-center space-x-1">
                  <span>JUMLAH ITEM</span>
                  <ChevronsUpDown class="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th class="py-3 px-4">
                <div class="flex items-center space-x-1">
                  <span>TOTAL TRANSAKSI</span>
                  <ChevronsUpDown class="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th class="py-3 px-4 text-center">AKSI</th>
            </tr>
          </thead>
          <tbody class="divide-y border-slate-100 divide-slate-100">
            <tr
              v-for="trx in paginatedTransactions"
              :key="trx.id"
              class="hover:bg-slate-50/60 transition-colors"
            >
              <td class="py-3 px-4">
                <button
                  @click="viewReceipt(trx)"
                  class="font-mono font-medium text-indigo-600 hover:text-indigo-800 hover:underline text-xs"
                >
                  {{ trx.transaction_code }}
                </button>
              </td>
              <td class="py-3 px-4 text-slate-500 text-xs font-normal">
                {{ formatDate(trx.transaction_date) }}
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center space-x-1.5">
                  <span class="font-medium text-slate-700 text-xs">{{ trx.creator?.name || 'User' }}</span>
                  <span
                    :class="[
                      'text-[10px] font-medium px-2 py-0.5 rounded-full capitalize',
                      trx.creator?.role === 'owner'
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/60'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100/60'
                    ]"
                  >
                    {{ trx.creator?.role }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-600 text-xs font-normal">
                {{ trx.items?.length || 1 }} Item
              </td>
              <td class="py-3 px-4 font-semibold text-slate-800 text-xs">
                {{ formatCurrency(trx.total) }}
              </td>
              <td class="py-3 px-4 text-center">
                <button
                  @click="viewReceipt(trx)"
                  title="Lihat Struk Resmi"
                  class="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <MoreHorizontal class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination for Recent Transactions -->
      <PaginationControls
        :current-page="trxPagination.currentPage"
        :last-page="trxPagination.lastPage"
        :total="trxPagination.total"
        :from="trxPagination.from"
        :to="trxPagination.to"
        :per-page="trxPagination.perPage"
        :per-page-options="[5, 10, 20]"
        :loading="trxLoading"
        @page-change="onTrxPageChange"
        @per-page-change="onTrxPerPageChange"
      />
    </div>

    <!-- Receipt Modal Dialog -->
    <ReceiptModal
      v-model:show="showReceiptModal"
      :receipt="currentReceipt"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import { productService, transactionService, reportService } from '../services';
import { useClientPagination } from '../composables/useClientPagination';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ROLES } from '../constants/roles';
import dashboardHeroImg from '../assets/dashboard_hero.png';
import ReceiptModal from '../components/ReceiptModal.vue';
import PaginationControls from '../components/PaginationControls.vue';
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
  Search,
  X,
} from '@lucide/vue';

const authStore = useAuthStore();
const loading = ref(true);
const trxLoading = ref(false);

const productCount = ref(0);
const monthlyTransactionsCount = ref(0);
const monthlyRevenue = ref(0);
const recentTransactions = ref([]);

// Search & Filter State for Transactions Table
const trxSearch = ref('');
const trxRoleFilter = ref('');

// Receipt Modal State
const showReceiptModal = ref(false);
const currentReceipt = ref(null);

onMounted(async () => {
  await loadDashboardData();
});

// Filtered list based on search and role
const filteredTransactions = computed(() => {
  let list = recentTransactions.value;
  if (trxSearch.value.trim()) {
    const q = trxSearch.value.trim().toLowerCase();
    list = list.filter((t) => {
      const code = (t.transaction_code || '').toLowerCase();
      const creator = (t.creator?.name || '').toLowerCase();
      const items = (t.items || []).map(i => (i.product_name || '').toLowerCase()).join(' ');
      return code.includes(q) || creator.includes(q) || items.includes(q);
    });
  }
  if (trxRoleFilter.value) {
    list = list.filter((t) => t.creator?.role === trxRoleFilter.value);
  }
  return list;
});

// Clean Reusable Client Pagination Composable
const trxPagination = useClientPagination(filteredTransactions, { initialPerPage: 5 });
const paginatedTransactions = trxPagination.paginatedItems;

// Reset page to 1 when filters change
watch([trxSearch, trxRoleFilter], () => {
  trxPagination.reset();
});

function handleTrxFilter() {
  trxPagination.reset();
}

function onTrxPageChange(page) {
  trxPagination.setPage(page);
}

function onTrxPerPageChange(newPerPage) {
  trxPagination.setPerPage(newPerPage);
}

async function loadDashboardData() {
  loading.value = true;
  try {
    // 1. Fetch products count using ProductService
    const prodRes = await productService.getProducts({ per_page: 1 });
    productCount.value = prodRes.meta?.total || prodRes.data?.length || 0;

    // 2. Fetch transactions using TransactionService (up to 100 for responsive client filtering)
    const trxRes = await transactionService.getTransactions({ per_page: 100 });
    recentTransactions.value = trxRes.data || [];

    // 3. Fetch reports if owner using ReportService
    if (authStore.isOwner) {
      const reportRes = await reportService.getReports();
      monthlyTransactionsCount.value = reportRes.data?.current_month?.total_transactions || 0;
      monthlyRevenue.value = reportRes.data?.current_month?.total_revenue || 0;
    } else {
      monthlyTransactionsCount.value = trxRes.meta?.total || recentTransactions.value.length;
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
