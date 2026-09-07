<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
        @click.self="closeModal"
      >
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div
            v-if="show"
            id="printable-receipt"
            class="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100/80 overflow-hidden my-6 relative animate-in"
          >
            <!-- Top Subtle Indigo Decorative Bar -->
            <div class="h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600"></div>

            <!-- Modal Header -->
            <div class="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between no-print">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600">
                  <Receipt class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="font-bold text-sm text-slate-800 leading-tight">Bukti Pembayaran Resmi</h3>
                  <p class="text-[11px] text-slate-400">Mini ERP SaaS Multi-Tenant</p>
                </div>
              </div>
              <button
                @click="closeModal"
                class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
                title="Tutup"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Receipt Body Content -->
            <div class="p-5 space-y-4">
              <!-- Tenant Branding & Header -->
              <div class="text-center pb-3 border-b border-slate-100">
                <div class="inline-flex items-center space-x-1.5 bg-indigo-50/80 text-indigo-700 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-indigo-100 mb-2">
                  <Building2 class="w-3 h-3 text-indigo-500" />
                  <span>Tenant ID #{{ authStore.tenant?.id || receipt?.tenant_id || '1' }}</span>
                </div>
                <h4 class="font-bold text-base text-slate-800 tracking-tight">
                  {{ authStore.tenant?.name || 'PT Nusantara Niaga Mandiri' }}
                </h4>
                <p class="text-[11px] text-slate-500 mt-0.5 font-normal">
                  Sistem Mini ERP SaaS Terisolasi
                </p>

                <!-- Status Badge -->
                <div class="mt-2.5 inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[11px] font-medium px-3 py-0.5 rounded-full">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Transaksi Berhasil / Lunas</span>
                </div>
              </div>

              <!-- Transaction Meta Card -->
              <div class="bg-slate-50/80 rounded-xl p-3 border border-slate-100 text-xs space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-slate-500 text-[11px]">Kode Transaksi</span>
                  <div class="flex items-center space-x-1.5">
                    <span class="font-mono font-semibold text-slate-800 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200/80">
                      {{ receipt?.transaction_code || '-' }}
                    </span>
                    <button
                      @click="copyCode(receipt?.transaction_code)"
                      class="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-colors no-print cursor-pointer"
                      :title="copied ? 'Tersalin!' : 'Salin Kode'"
                    >
                      <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-600" />
                      <Copy v-else class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-slate-500">Tanggal Transaksi</span>
                  <span class="font-medium text-slate-700">{{ formatDate(receipt?.transaction_date) }}</span>
                </div>

                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-slate-500">Kasir / Operator</span>
                  <span class="font-medium text-slate-700">
                    {{ receipt?.creator?.name || authStore.user?.name || 'Kasir' }}
                    <span v-if="receipt?.creator?.role" class="text-[10px] text-slate-400 capitalize">
                      ({{ receipt.creator.role }})
                    </span>
                  </span>
                </div>
              </div>

              <!-- Items Breakdown -->
              <div>
                <div class="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  <span>Daftar Item</span>
                  <span>Subtotal</span>
                </div>

                <div class="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  <div
                    v-for="item in receipt?.items"
                    :key="item.id"
                    class="flex items-start justify-between text-xs"
                  >
                    <div class="min-w-0 pr-3">
                      <p class="font-medium text-slate-800 text-xs leading-snug">
                        {{ item.product_name }}
                      </p>
                      <p class="text-[11px] text-slate-400 mt-0.5 font-normal">
                        {{ item.qty }} × {{ formatCurrency(item.price_at_transaction) }}
                      </p>
                    </div>
                    <span class="font-semibold text-slate-800 text-xs shrink-0 pt-0.5">
                      {{ formatCurrency(item.subtotal) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Payment Summary Box -->
              <div class="bg-gradient-to-b from-slate-50 to-slate-100/70 rounded-xl p-3.5 border border-slate-200/70 space-y-2">
                <div class="flex justify-between text-xs text-slate-600">
                  <span>Total Produk ({{ totalItemsCount }} item)</span>
                  <span>{{ formatCurrency(receipt?.total) }}</span>
                </div>
                <div class="flex justify-between text-xs text-slate-600">
                  <span>Pajak / Diskon</span>
                  <span class="text-slate-400">Rp 0 (0%)</span>
                </div>
                <div class="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <div>
                    <span class="text-xs font-bold text-slate-800">TOTAL PEMBAYARAN</span>
                    <p class="text-[10px] text-slate-400">Metode: Tunai / Kasir POS</p>
                  </div>
                  <span class="text-base sm:text-lg font-extrabold text-indigo-600">
                    {{ formatCurrency(receipt?.total) }}
                  </span>
                </div>
              </div>

              <!-- Digital Integrity & Snapshot Guarantee -->
              <div class="flex items-start space-x-2 p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100/60 text-[10px] text-slate-500 leading-relaxed">
                <ShieldCheck class="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong class="font-semibold text-indigo-900">Price Snapshot Terverifikasi:</strong>
                  Harga tersimpan permanen di database transaksi dan tidak terpengaruh oleh perubahan harga master produk.
                </span>
              </div>
            </div>

            <!-- Modal Footer Actions -->
            <div class="px-5 py-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-end space-x-2.5 no-print">
              <button
                @click="closeModal"
                type="button"
                class="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                @click="printReceipt"
                type="button"
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-xl shadow-xs hover:shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer class="w-3.5 h-3.5" />
                <span>Cetak Struk</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Receipt,
  Building2,
  Check,
  Copy,
  Printer,
  ShieldCheck,
  X,
} from '@lucide/vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  receipt: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:show', 'close']);

const authStore = useAuthStore();
const copied = ref(false);

const totalItemsCount = computed(() => {
  if (!props.receipt?.items) return 0;
  return props.receipt.items.reduce((acc, item) => acc + (item.qty || 0), 0);
});

function closeModal() {
  emit('update:show', false);
  emit('close');
}

function copyCode(code) {
  if (!code) return;
  navigator.clipboard.writeText(code);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

function printReceipt() {
  window.print();
}
</script>
