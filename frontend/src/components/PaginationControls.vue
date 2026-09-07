<template>
  <div
    v-if="total > 0"
    class="px-4 py-3 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
  >
    <!-- Left: Information & Page Size Selector -->
    <div class="flex items-center space-x-3 text-slate-500">
      <span>
        Menampilkan
        <strong class="font-semibold text-slate-800">{{ from || 0 }}</strong>
        –
        <strong class="font-semibold text-slate-800">{{ to || 0 }}</strong>
        dari
        <strong class="font-semibold text-slate-800">{{ total }}</strong>
        data
      </span>

      <div class="flex items-center space-x-1.5 pl-2 border-l border-slate-200">
        <label for="per-page-select" class="text-slate-400 hidden md:inline">Baris:</label>
        <select
          id="per-page-select"
          :value="perPage"
          @change="onPerPageChange($event.target.value)"
          class="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option v-for="opt in perPageOptions" :key="opt" :value="opt">
            {{ opt }} / hal
          </option>
        </select>
      </div>
    </div>

    <!-- Right: Pagination Buttons -->
    <div class="flex items-center space-x-1">
      <!-- Previous Button -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage <= 1 || loading"
        class="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1 cursor-pointer"
        title="Halaman Sebelumnya"
      >
        <ChevronLeft class="w-3.5 h-3.5" />
        <span class="hidden sm:inline">Sebelumnya</span>
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center space-x-1">
        <template v-for="(page, idx) in visiblePages" :key="idx">
          <span
            v-if="page === '...'"
            class="px-2 py-1 text-slate-400 select-none"
          >
            ...
          </span>
          <button
            v-else
            @click="goToPage(page)"
            :disabled="loading"
            :class="[
              'w-8 h-8 rounded-lg font-medium text-xs transition-all flex items-center justify-center cursor-pointer',
              page === currentPage
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            ]"
          >
            {{ page }}
          </button>
        </template>
      </div>

      <!-- Next Button -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage >= lastPage || loading"
        class="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center space-x-1 cursor-pointer"
        title="Halaman Berikutnya"
      >
        <span class="hidden sm:inline">Berikutnya</span>
        <ChevronRight class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ChevronLeft, ChevronRight } from '@lucide/vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    default: 0,
  },
  from: {
    type: Number,
    default: 0,
  },
  to: {
    type: Number,
    default: 0,
  },
  perPage: {
    type: Number,
    default: 10,
  },
  perPageOptions: {
    type: Array,
    default: () => [5, 10, 25, 50],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['page-change', 'update:perPage', 'per-page-change']);

const visiblePages = computed(() => {
  const current = props.currentPage;
  const last = props.lastPage;
  const delta = 1; // Number of pages to show around current
  const range = [];

  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(last - 1, current + delta);
    i++
  ) {
    range.push(i);
  }

  if (current - delta > 2) {
    range.unshift('...');
  }
  if (current + delta < last - 1) {
    range.push('...');
  }

  range.unshift(1);
  if (last > 1) {
    range.push(last);
  }

  return range;
});

function goToPage(page) {
  if (page < 1 || page > props.lastPage || page === props.currentPage) return;
  emit('page-change', page);
}

function onPerPageChange(val) {
  const num = parseInt(val, 10);
  emit('update:perPage', num);
  emit('per-page-change', num);
}
</script>
