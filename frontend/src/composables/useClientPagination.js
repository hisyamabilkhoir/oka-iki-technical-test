import { ref, computed, watch, unref } from 'vue';

/**
 * Reusable client-side pagination composable for Vue 3.
 *
 * @param {import('vue').Ref<Array> | import('vue').ComputedRef<Array>} sourceListRef - Ref or Computed containing the array of filtered items
 * @param {Object} options
 * @param {number} [options.initialPerPage=5] - Default items per page
 * @returns {Object}
 */
export function useClientPagination(sourceListRef, options = {}) {
  const perPage = ref(options.initialPerPage || 5);
  const currentPage = ref(1);

  const total = computed(() => {
    const list = unref(sourceListRef);
    return Array.isArray(list) ? list.length : 0;
  });

  const lastPage = computed(() => {
    return Math.max(1, Math.ceil(total.value / perPage.value));
  });

  // Automatically ensure currentPage stays within valid bounds when the source list shrinks
  watch(lastPage, (newLastPage) => {
    if (currentPage.value > newLastPage) {
      currentPage.value = newLastPage;
    }
  });

  const from = computed(() => {
    if (total.value === 0) return 0;
    return (currentPage.value - 1) * perPage.value + 1;
  });

  const to = computed(() => {
    return Math.min(currentPage.value * perPage.value, total.value);
  });

  const paginatedItems = computed(() => {
    const list = unref(sourceListRef);
    if (!Array.isArray(list)) return [];
    const start = (currentPage.value - 1) * perPage.value;
    return list.slice(start, start + perPage.value);
  });

  function setPage(page) {
    if (page >= 1 && page <= lastPage.value) {
      currentPage.value = page;
    }
  }

  function setPerPage(newSize) {
    perPage.value = Number(newSize) || 5;
    currentPage.value = 1;
  }

  function reset() {
    currentPage.value = 1;
  }

  return {
    currentPage,
    lastPage,
    total,
    from,
    to,
    perPage,
    paginatedItems,
    setPage,
    setPerPage,
    reset,
  };
}
