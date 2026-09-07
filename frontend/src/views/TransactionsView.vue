<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Modul Transaksi (Mini ERP)</h1>
        <p class="text-sm text-slate-500 mt-1">
          Kasir POS & pencatatan transaksi tenant <strong class="text-slate-800">{{ authStore.tenant?.name }}</strong> dengan <em>Price Snapshotting</em>.
        </p>
      </div>

      <!-- Tab Switcher -->
      <div class="flex bg-slate-200/80 p-1 rounded-xl shrink-0 self-start">
        <button
          @click="activeTab = 'checkout'"
          :class="[
            'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5',
            activeTab === 'checkout'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <ShoppingCart class="w-4 h-4" />
          <span>Kasir / Checkout Baru</span>
        </button>
        <button
          @click="activeTab = 'history'"
          :class="[
            'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5',
            activeTab === 'history'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          <Clock class="w-4 h-4" />
          <span>Riwayat Transaksi</span>
        </button>
      </div>
    </div>

    <!-- TAB 1: CHECKOUT / KASIR -->
    <div v-if="activeTab === 'checkout'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Product Selection Grid (7 cols) -->
      <div class="lg:col-span-7 space-y-4">
        <!-- Search bar -->
        <div class="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex items-center space-x-2">
          <Search class="w-4 h-4 text-slate-400 ml-2" />
          <input
            v-model="productSearch"
            type="text"
            placeholder="Cari produk katalog untuk ditambahkan..."
            class="w-full px-2 py-1.5 bg-transparent border-none text-sm focus:outline-none placeholder-slate-400"
          />
        </div>

        <!-- Product Cards Grid -->
        <div v-if="loadingProducts" class="p-12 text-center text-slate-400 text-sm">
          <span class="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></span>
          <p>Memuat produk...</p>
        </div>

        <div v-else-if="filteredProducts.length === 0" class="bg-white rounded-2xl p-8 border border-slate-200/80 text-center">
          <Package class="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p class="text-sm font-semibold text-slate-700">Produk tidak ditemukan</p>
          <p class="text-xs text-slate-500 mt-1">Pastikan nama produk sesuai dengan katalog tenant Anda.</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div
            v-for="prod in filteredProducts"
            :key="prod.id"
            @click="addToCart(prod)"
            class="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div class="flex items-start justify-between gap-2">
                <h4 class="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {{ prod.name }}
                </h4>
                <span class="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                  #{{ prod.id }}
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-1">Master DB Snapshot Target</p>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span class="text-sm font-extrabold text-indigo-600">
                {{ formatCurrency(prod.price) }}
              </span>
              <button
                type="button"
                class="p-1.5 rounded-lg bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white transition-colors text-xs font-semibold flex items-center space-x-1"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>Pilih</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Cart & Checkout Summary (5 cols) -->
      <div class="lg:col-span-5">
        <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sticky top-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center space-x-2">
              <ShoppingCart class="w-5 h-5 text-indigo-600" />
              <h3 class="font-bold text-base text-slate-900">Keranjang Transaksi</h3>
            </div>
            <button
              v-if="cart.length > 0"
              @click="cart = []"
              class="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Kosongkan
            </button>
          </div>

          <!-- Transaction Date Input -->
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Tanggal Transaksi
            </label>
            <input
              v-model="transactionDate"
              type="date"
              class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Cart Items List -->
          <div v-if="cart.length === 0" class="py-12 text-center">
            <ShoppingCart class="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p class="text-xs font-medium text-slate-400">Keranjang masih kosong</p>
            <p class="text-[11px] text-slate-400 mt-0.5">Pilih produk di sebelah kiri untuk memulai.</p>
          </div>

          <div v-else class="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
            <div
              v-for="(item, idx) in cart"
              :key="item.product_id"
              class="py-3 flex items-center justify-between gap-3"
            >
              <div class="min-w-0 flex-1">
                <p class="text-xs font-bold text-slate-900 truncate">{{ item.product_name }}</p>
                <p class="text-[11px] text-indigo-600 font-semibold mt-0.5">
                  {{ formatCurrency(item.price) }} / unit
                </p>
              </div>

              <!-- Qty Stepper -->
              <div class="flex items-center space-x-1">
                <button
                  @click="updateQty(idx, item.qty - 1)"
                  type="button"
                  class="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  v-model.number="item.qty"
                  @change="validateItemQty(idx)"
                  class="w-10 text-center text-xs font-bold border border-slate-200 rounded py-0.5 focus:outline-none"
                />
                <button
                  @click="updateQty(idx, item.qty + 1)"
                  type="button"
                  class="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>

              <!-- Subtotal & Remove -->
              <div class="text-right shrink-0">
                <p class="text-xs font-extrabold text-slate-900">
                  {{ formatCurrency(item.qty * item.price) }}
                </p>
                <button
                  @click="removeFromCart(idx)"
                  class="text-[11px] text-red-500 hover:underline mt-0.5"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>

          <!-- Checkout Calculation Summary -->
          <div class="pt-4 border-t border-slate-100 space-y-2">
            <div class="flex justify-between text-xs text-slate-500">
              <span>Total Item Produk</span>
              <span class="font-bold text-slate-800">{{ totalItemsCount }} item</span>
            </div>
            <div class="flex justify-between text-xs text-slate-500">
              <span>Sumber Validasi Harga</span>
              <span class="font-bold text-emerald-600">Database Price Snapshot</span>
            </div>
            <div class="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
              <span>Grand Total</span>
              <span class="text-indigo-600">{{ formatCurrency(calculatedTotal) }}</span>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="checkoutError" class="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-start space-x-2">
            <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
            <span>{{ checkoutError }}</span>
          </div>

          <!-- Checkout Button -->
          <button
            @click="handleCheckout"
            :disabled="cart.length === 0 || processingCheckout"
            type="button"
            class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="processingCheckout" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ processingCheckout ? 'Menyimpan ke ERP...' : 'Checkout & Cetak Struk' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 2: RIWAYAT TRANSAKSI -->
    <div v-if="activeTab === 'history'" class="space-y-4">
      <!-- Immutability Alert Banner -->
      <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
        <div class="flex items-center space-x-2">
          <ShieldAlert class="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Aturan Integritas ERP:</strong> Seluruh transaksi yang tersimpan bersifat permanen (immutable) dan tidak dapat dihapus. Perubahan harga pada master produk tidak mempengaruhi <em>price snapshot</em> transaksi lama.
          </span>
        </div>
      </div>

      <!-- History Filter & Search Bar -->
      <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3">
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <!-- Search input -->
          <div class="relative flex-1">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              v-model="historySearch"
              @input="handleHistoryFilterChange"
              type="text"
              placeholder="Cari kode transaksi, kasir, atau nama item..."
              class="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <button
              v-if="historySearch"
              @click="historySearch = ''; handleHistoryFilterChange()"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Sort dropdown -->
          <div class="flex items-center space-x-2 shrink-0">
            <label class="text-xs text-slate-400 hidden sm:inline">Urutan:</label>
            <select
              v-model="historySortBy"
              @change="handleHistoryFilterChange"
              class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date_desc">Tanggal Terbaru</option>
              <option value="date_asc">Tanggal Terlama</option>
              <option value="total_desc">Total Tertinggi</option>
              <option value="total_asc">Total Terendah</option>
              <option value="id_desc">ID Terbaru</option>
            </select>

            <!-- Toggle Date Filter Button -->
            <button
              @click="showDateFilter = !showDateFilter"
              :class="[
                'px-3 py-2 rounded-xl text-xs font-medium border flex items-center space-x-1.5 transition-all',
                showDateFilter || historyStartDate || historyEndDate
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              ]"
            >
              <Calendar class="w-3.5 h-3.5" />
              <span>Filter Tanggal</span>
              <span
                v-if="historyStartDate || historyEndDate"
                class="w-2 h-2 rounded-full bg-indigo-600"
              ></span>
            </button>
          </div>
        </div>

        <!-- Expandable Date Filter Row -->
        <div
          v-if="showDateFilter"
          class="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs bg-slate-50/50 p-3 rounded-xl"
        >
          <span class="text-slate-500 font-medium">Rentang Tanggal Transaksi:</span>
          <div class="flex items-center space-x-2">
            <input
              v-model="historyStartDate"
              @change="handleHistoryFilterChange"
              type="date"
              class="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span class="text-slate-400">&ndash;</span>
            <input
              v-model="historyEndDate"
              @change="handleHistoryFilterChange"
              type="date"
              class="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            v-if="historySearch || historyStartDate || historyEndDate"
            @click="resetHistoryFilters"
            class="text-indigo-600 hover:text-indigo-800 font-semibold ml-auto"
          >
            Reset Filter
          </button>
        </div>
      </div>

      <!-- Transactions List Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div v-if="loadingHistory && historyTransactions.length === 0" class="p-12 text-center text-slate-400 text-sm">
          <span class="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></span>
          <p>Memuat riwayat transaksi...</p>
        </div>

        <div v-else-if="historyTransactions.length === 0" class="p-16 text-center">
          <Clock class="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p class="text-base font-bold text-slate-800">Tidak ada riwayat transaksi</p>
          <p class="text-xs text-slate-500 mt-1">
            {{ historySearch || historyStartDate || historyEndDate ? 'Tidak ada transaksi yang cocok dengan kata kunci atau filter tanggal.' : 'Transaksi yang dibuat akan tercatat di sini secara permanen.' }}
          </p>
          <button
            v-if="historySearch || historyStartDate || historyEndDate"
            @click="resetHistoryFilters"
            class="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
          >
            Reset Filter
          </button>
        </div>

        <div v-else>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th class="px-5 py-3">Kode Transaksi</th>
                  <th class="px-5 py-3">Tanggal</th>
                  <th class="px-5 py-3">Petugas / Kasir</th>
                  <th class="px-5 py-3">Rincian Item</th>
                  <th class="px-5 py-3 text-right">Total Transaksi</th>
                  <th class="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="trx in historyTransactions" :key="trx.id" class="hover:bg-slate-50/70 transition-colors">
                  <td class="px-5 py-3.5 font-mono font-bold text-xs text-indigo-600">
                    {{ trx.transaction_code }}
                  </td>
                  <td class="px-5 py-3.5 text-xs text-slate-600">
                    {{ formatDate(trx.transaction_date) }}
                  </td>
                  <td class="px-5 py-3.5 text-xs">
                    <div class="font-medium text-slate-800">{{ trx.creator?.name || 'Kasir' }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ trx.creator?.role }}</div>
                  </td>
                  <td class="px-5 py-3.5 text-xs text-slate-600">
                    {{ trx.items?.length || 0 }} Jenis Produk
                  </td>
                  <td class="px-5 py-3.5 text-right font-bold text-slate-900">
                    {{ formatCurrency(trx.total) }}
                  </td>
                  <td class="px-5 py-3.5 text-right">
                    <button
                      @click="viewReceipt(trx)"
                      class="px-3 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-lg text-xs font-semibold transition-colors inline-flex items-center space-x-1"
                    >
                      <Receipt class="w-3.5 h-3.5" />
                      <span>Lihat Struk</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls for History Table -->
          <PaginationControls
            :current-page="historyPagination.currentPage"
            :last-page="historyPagination.lastPage"
            :total="historyPagination.total"
            :from="historyPagination.from"
            :to="historyPagination.to"
            :per-page="historyPagination.perPage"
            :loading="loadingHistory"
            @page-change="onHistoryPageChange"
            @per-page-change="onHistoryPerPageChange"
          />
        </div>
      </div>
    </div>

    <!-- RECEIPT / NOTA MODAL -->
    <ReceiptModal
      v-model:show="showReceiptModal"
      :receipt="currentReceipt"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../api/axios';
import { formatCurrency, formatDate } from '../utils/formatters';
import ReceiptModal from '../components/ReceiptModal.vue';
import PaginationControls from '../components/PaginationControls.vue';
import {
  ShoppingCart,
  Clock,
  Search,
  Plus,
  Package,
  Receipt,
  AlertCircle,
  ShieldAlert,
  Calendar,
  X,
  Filter,
} from '@lucide/vue';

const authStore = useAuthStore();
const activeTab = ref('checkout');

// Products & Cart
const products = ref([]);
const loadingProducts = ref(true);
const productSearch = ref('');
const cart = ref([]);
const transactionDate = ref(new Date().toISOString().split('T')[0]);
const checkoutError = ref(null);
const processingCheckout = ref(false);

// History Table State
const historyTransactions = ref([]);
const loadingHistory = ref(false);
const historySearch = ref('');
const historyStartDate = ref('');
const historyEndDate = ref('');
const historySortBy = ref('date_desc');
const showDateFilter = ref(false);

const historyPagination = reactive({
  currentPage: 1,
  lastPage: 1,
  total: 0,
  from: 0,
  to: 0,
  perPage: 10,
});

// Receipt Modal
const showReceiptModal = ref(false);
const currentReceipt = ref(null);

onMounted(async () => {
  await fetchProducts();
  await fetchHistory();
});

const filteredProducts = computed(() => {
  if (!productSearch.value) return products.value;
  const q = productSearch.value.toLowerCase();
  return products.value.filter((p) => p.name.toLowerCase().includes(q));
});

const totalItemsCount = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.qty, 0);
});

const calculatedTotal = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.qty * item.price, 0);
});

async function fetchProducts() {
  loadingProducts.value = true;
  try {
    const res = await api.get('/products?per_page=100');
    products.value = res.data.data || [];
  } catch (err) {
    console.error('Failed to load products', err);
  } finally {
    loadingProducts.value = false;
  }
}

let historyFilterTimeout = null;
function handleHistoryFilterChange() {
  clearTimeout(historyFilterTimeout);
  historyFilterTimeout = setTimeout(() => {
    fetchHistory(1);
  }, 300);
}

function resetHistoryFilters() {
  historySearch.value = '';
  historyStartDate.value = '';
  historyEndDate.value = '';
  historySortBy.value = 'date_desc';
  showDateFilter.value = false;
  fetchHistory(1);
}

function onHistoryPageChange(page) {
  fetchHistory(page);
}

function onHistoryPerPageChange(newPerPage) {
  historyPagination.perPage = newPerPage;
  fetchHistory(1);
}

async function fetchHistory(page = historyPagination.currentPage) {
  loadingHistory.value = true;
  try {
    const [field, dir] = historySortBy.value.split('_');
    const sortFieldMap = {
      date: 'transaction_date',
      total: 'total',
      id: 'id',
    };

    const params = {
      page,
      per_page: historyPagination.perPage,
      sort_by: sortFieldMap[field] || 'transaction_date',
      sort_dir: dir || 'desc',
    };

    if (historySearch.value.trim()) {
      params.search = historySearch.value.trim();
    }
    if (historyStartDate.value) {
      params.start_date = historyStartDate.value;
    }
    if (historyEndDate.value) {
      params.end_date = historyEndDate.value;
    }

    const res = await api.get('/transactions', { params });
    historyTransactions.value = res.data.data || [];

    // Capture meta pagination
    const meta = res.data.meta;
    if (meta) {
      historyPagination.currentPage = meta.current_page || 1;
      historyPagination.lastPage = meta.last_page || 1;
      historyPagination.total = meta.total || 0;
      historyPagination.from = meta.from || 0;
      historyPagination.to = meta.to || 0;
      historyPagination.perPage = meta.per_page || historyPagination.perPage;
    } else {
      historyPagination.currentPage = 1;
      historyPagination.lastPage = 1;
      historyPagination.total = historyTransactions.value.length;
      historyPagination.from = historyTransactions.value.length > 0 ? 1 : 0;
      historyPagination.to = historyTransactions.value.length;
    }
  } catch (err) {
    console.error('Failed to load history', err);
  } finally {
    loadingHistory.value = false;
  }
}

function addToCart(product) {
  const existing = cart.value.find((i) => i.product_id === product.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.value.push({
      product_id: product.id,
      product_name: product.name,
      price: parseFloat(product.price),
      qty: 1,
    });
  }
}

function updateQty(idx, newQty) {
  if (newQty <= 0) {
    removeFromCart(idx);
  } else {
    cart.value[idx].qty = newQty;
  }
}

function validateItemQty(idx) {
  if (cart.value[idx].qty < 1 || isNaN(cart.value[idx].qty)) {
    cart.value[idx].qty = 1;
  }
}

function removeFromCart(idx) {
  cart.value.splice(idx, 1);
}

async function handleCheckout() {
  if (cart.value.length === 0) return;
  processingCheckout.value = true;
  checkoutError.value = null;

  try {
    const payload = {
      transaction_date: transactionDate.value,
      items: cart.value.map((item) => ({
        product_id: item.product_id,
        qty: item.qty,
      })),
    };

    const res = await api.post('/transactions', payload);
    const createdTrx = res.data.transaction;

    // Reset cart
    cart.value = [];

    // Show receipt
    currentReceipt.value = createdTrx;
    showReceiptModal.value = true;

    // Refresh history
    await fetchHistory(1);
  } catch (err) {
    checkoutError.value =
      err.response?.data?.message || 'Gagal memproses transaksi. Cek kembali item yang dipilih.';
  } finally {
    processingCheckout.value = false;
  }
}

function viewReceipt(trx) {
  currentReceipt.value = trx;
  showReceiptModal.value = true;
}
</script>
