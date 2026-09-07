<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Katalog Produk</h1>
        <p class="text-sm text-slate-500 mt-1">
          Kelola master data produk tenant <strong class="text-slate-800">{{ authStore.tenant?.name }}</strong>.
        </p>
      </div>

      <button
        @click="openCreateModal"
        class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2 shrink-0"
      >
        <Plus class="w-4 h-4" />
        <span>Tambah Produk Baru</span>
      </button>
    </div>

    <!-- Alert Banner for Role Guidance -->
    <div class="p-3.5 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between text-xs text-indigo-900">
      <div class="flex items-center space-x-2">
        <Info class="w-4 h-4 text-indigo-600 shrink-0" />
        <span>
          Login saat ini sebagai <strong>{{ authStore.user?.name }}</strong> (Role: <span class="uppercase font-bold">{{ authStore.user?.role }}</span>).
          {{ authStore.isOwner ? 'Anda memiliki akses penuh untuk Tambah, Edit, dan Soft Delete produk.' : 'Staff dapat menambah & mengubah produk, namun dilarang menghapus produk (Proteksi Backend 403).' }}
        </span>
      </div>
    </div>

    <!-- Filter & Search Card -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="relative w-full sm:w-80">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="searchQuery"
          @input="handleSearch"
          type="text"
          placeholder="Cari nama produk..."
          class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
        />
      </div>

      <div class="text-xs text-slate-500 self-end sm:self-center font-medium">
        Total: {{ products.length }} produk ditemukan
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-12 text-center text-slate-400 text-sm">
        <span class="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></span>
        <p>Memuat daftar produk tenant...</p>
      </div>

      <div v-else-if="products.length === 0" class="p-16 text-center">
        <Package class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p class="text-base font-bold text-slate-800">Tidak ada produk ditemukan</p>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Belum ada produk terdaftar untuk tenant ini atau tidak ada hasil yang cocok dengan pencarian Anda.
        </p>
        <button
          @click="openCreateModal"
          class="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
        >
          + Tambah Produk Sekarang
        </button>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-100">
            <tr>
              <th class="px-5 py-3">ID</th>
              <th class="px-5 py-3">Nama Produk</th>
              <th class="px-5 py-3">Harga Satuan</th>
              <th class="px-5 py-3">Tenant Terikat</th>
              <th class="px-5 py-3">Tgl Dibuat</th>
              <th class="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="product in products" :key="product.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="px-5 py-3.5 font-mono text-xs text-slate-500">
                #{{ product.id }}
              </td>
              <td class="px-5 py-3.5 font-semibold text-slate-900">
                {{ product.name }}
              </td>
              <td class="px-5 py-3.5 font-bold text-indigo-600">
                {{ formatCurrency(product.price) }}
              </td>
              <td class="px-5 py-3.5 text-xs text-slate-500">
                <span class="inline-flex items-center space-x-1 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                  <Building2 class="w-3 h-3 text-slate-400" />
                  <span>Tenant ID #{{ product.tenant_id }}</span>
                </span>
              </td>
              <td class="px-5 py-3.5 text-xs text-slate-500">
                {{ formatDate(product.created_at) }}
              </td>
              <td class="px-5 py-3.5 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="openEditModal(product)"
                    title="Edit Produk"
                    class="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Pencil class="w-4 h-4" />
                  </button>

                  <!-- Delete Button: Owner can click, Staff sees disabled icon -->
                  <button
                    v-if="authStore.isOwner"
                    @click="confirmDelete(product)"
                    title="Hapus Produk (Soft Delete)"
                    class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                  <span
                    v-else
                    title="Staff dilarang menghapus produk (Proteksi Policy)"
                    class="p-1.5 text-slate-300 cursor-not-allowed opacity-50"
                  >
                    <Trash2 class="w-4 h-4" />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <h3 class="text-lg font-bold text-slate-900">
            {{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div v-if="modalError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
          {{ modalError }}
        </div>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Nama Produk <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="Contoh: Paket Lisensi ERP Cloud"
              class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Harga Satuan (IDR / Decimal) <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.price"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="Contoh: 1500000.00"
              class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p class="text-[11px] text-slate-500 mt-1">
              Preview: <strong class="text-slate-700">{{ formatCurrency(form.price) }}</strong>
            </p>
          </div>

          <div class="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {{ submitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Produk') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center">
        <div class="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <Trash2 class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-slate-900">Konfirmasi Hapus Produk</h3>
        <p class="text-xs text-slate-500 mt-2">
          Apakah Anda yakin ingin menghapus produk <strong class="text-slate-800">"{{ deletingProduct?.name }}"</strong>?
          Produk akan dihapus secara <em>Soft Delete</em> dan tidak lagi muncul pada katalog kasir baru.
        </p>

        <div class="mt-6 flex items-center justify-center space-x-2">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            @click="handleDelete"
            :disabled="submitting"
            class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-red-600/20 disabled:opacity-50"
          >
            {{ submitting ? 'Menghapus...' : 'Ya, Hapus Produk' }}
          </button>
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
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Info,
  Building2,
} from '@lucide/vue';

const authStore = useAuthStore();
const products = ref([]);
const loading = ref(true);
const searchQuery = ref('');

// Form state
const showModal = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const modalError = ref(null);
const currentId = ref(null);

const form = reactive({
  name: '',
  price: '',
});

// Delete state
const showDeleteModal = ref(false);
const deletingProduct = ref(null);

onMounted(() => {
  fetchProducts();
});

let searchTimeout = null;
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchProducts();
  }, 300);
}

async function fetchProducts() {
  loading.value = true;
  try {
    const params = {};
    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    const response = await api.get('/products', { params });
    products.value = response.data.data || [];
  } catch (err) {
    console.error('Failed to fetch products', err);
  } finally {
    loading.value = false;
  }
}

function openCreateModal() {
  isEditing.value = false;
  currentId.value = null;
  form.name = '';
  form.price = '';
  modalError.value = null;
  showModal.value = true;
}

function openEditModal(product) {
  isEditing.value = true;
  currentId.value = product.id;
  form.name = product.name;
  form.price = product.price;
  modalError.value = null;
  showModal.value = true;
}

async function saveProduct() {
  submitting.value = true;
  modalError.value = null;
  try {
    if (isEditing.value) {
      await api.put(`/products/${currentId.value}`, form);
    } else {
      await api.post('/products', form);
    }
    showModal.value = false;
    await fetchProducts();
  } catch (err) {
    modalError.value = err.response?.data?.message || 'Gagal menyimpan produk.';
  } finally {
    submitting.value = false;
  }
}

function confirmDelete(product) {
  deletingProduct.value = product;
  showDeleteModal.value = true;
}

async function handleDelete() {
  if (!deletingProduct.value) return;
  submitting.value = true;
  try {
    await api.delete(`/products/${deletingProduct.value.id}`);
    showDeleteModal.value = false;
    await fetchProducts();
  } catch (err) {
    alert(err.response?.data?.message || 'Gagal menghapus produk.');
  } finally {
    submitting.value = false;
  }
}
</script>
