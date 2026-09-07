<template>
  <div class="h-screen w-full bg-slate-50 flex overflow-hidden">
    <!-- Sidebar for Desktop -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 shrink-0 h-screen bg-slate-900 text-white transition-transform duration-300 ease-in-out md:translate-x-0 md:static flex flex-col',
        mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      ]"
    >
      <!-- Brand & Tenant Header (Fixed Top) -->
      <div class="p-5 border-b border-slate-800 shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <Layers class="w-6 h-6" />
            </div>
            <div>
              <h1 class="font-bold text-base leading-tight text-white tracking-wide">Mini ERP SaaS</h1>
              <span class="text-xs text-indigo-400 font-medium">Multi-Tenant Platform</span>
            </div>
          </div>
          <button @click="mobileOpen = false" class="md:hidden text-slate-400 hover:text-white">
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Current Active Tenant Box -->
        <div class="mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
          <div class="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <Building2 class="w-3.5 h-3.5 text-indigo-400" />
            <span class="uppercase tracking-wider font-semibold">Tenant Aktif</span>
          </div>
          <div class="font-semibold text-sm text-slate-100 truncate" :title="authStore.tenant?.name">
            {{ authStore.tenant?.name || 'Loading...' }}
          </div>
          <div class="mt-2 flex items-center justify-between">
            <span
              :class="[
                'text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider',
                authStore.isOwner ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              ]"
            >
              {{ authStore.user?.role }}
            </span>
            <span class="text-[11px] text-slate-400">ID: #{{ authStore.tenant?.id }}</span>
          </div>
        </div>
      </div>

      <!-- Navigation Menu (Independent Scrollbar) -->
      <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto custom-dark-scrollbar">
        <router-link
          to="/dashboard"
          @click="mobileOpen = false"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="[
            $route.name === 'dashboard'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <LayoutDashboard class="w-5 h-5" />
          <span>Dashboard</span>
        </router-link>

        <router-link
          to="/products"
          @click="mobileOpen = false"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="[
            $route.name === 'products'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <Package class="w-5 h-5" />
          <span>Kelola Produk</span>
        </router-link>

        <router-link
          to="/transactions"
          @click="mobileOpen = false"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="[
            $route.name === 'transactions'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <ShoppingCart class="w-5 h-5" />
          <span>Transaksi / POS</span>
        </router-link>

        <!-- Reports (Owner Only) -->
        <router-link
          v-if="authStore.isOwner"
          to="/reports"
          @click="mobileOpen = false"
          class="flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all"
          :class="[
            $route.name === 'reports'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <BarChart3 class="w-5 h-5" />
          <span>Laporan Omzet</span>
        </router-link>

        <!-- Locked indicator for Staff -->
        <div
          v-else
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-500 bg-slate-800/30 border border-slate-800/60 cursor-not-allowed select-none transition-colors"
          title="Menu Laporan Omzet hanya dapat diakses oleh akun Owner"
        >
          <div class="flex items-center space-x-3 min-w-0">
            <BarChart3 class="w-5 h-5 text-slate-600 shrink-0" />
            <span class="text-slate-400 text-sm whitespace-nowrap">Laporan Omzet</span>
          </div>
          <span class="inline-flex items-center space-x-1 text-[10px] font-medium text-slate-400 bg-slate-800/90 border border-slate-700/60 px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
            <Lock class="w-3 h-3 text-slate-400" />
            <span>Owner</span>
          </span>
        </div>
      </nav>

      <!-- Bottom User Profile & Logout (Fixed Bottom) -->
      <div class="p-4 border-t border-slate-800 bg-slate-900 shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3 min-w-0">
            <div class="w-9 h-9 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-200 font-semibold text-xs shrink-0">
              {{ initials }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-200 truncate">{{ authStore.user?.name }}</p>
              <p class="text-xs text-slate-400 truncate">{{ authStore.user?.email }}</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            title="Keluar / Logout"
            class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-2 shrink-0"
          >
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay backdrop for mobile -->
    <div
      v-if="mobileOpen"
      @click="mobileOpen = false"
      class="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
    ></div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Top Navigation Bar -->
      <header class="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0 shadow-xs gap-4">
        <div class="flex items-center space-x-3 min-w-0">
          <button
            @click="mobileOpen = true"
            class="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg md:hidden shrink-0"
          >
            <Menu class="w-5 h-5" />
          </button>
          <div class="min-w-0">
            <span class="text-[10px] sm:text-xs font-semibold text-indigo-600 uppercase tracking-wider block truncate">
              PT Oka Iki Indonesia Technical Test
            </span>
            <h2 class="text-xs sm:text-sm md:text-base font-bold text-slate-800 flex items-center space-x-2 truncate">
              <span>SaaS Mini ERP</span>
              <span class="text-slate-300">|</span>
              <span class="text-slate-600 font-medium truncate">{{ authStore.tenant?.name }}</span>
            </h2>
          </div>
        </div>

        <!-- Evaluator Quick Switcher Helper -->
        <div class="flex items-center space-x-3 shrink-0">
          <div class="hidden lg:flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-slate-500 font-medium">Isolasi:</span>
            <span class="font-bold text-slate-700">{{ authStore.tenant?.name }}</span>
          </div>

          <button
            @click="handleLogout"
            class="flex items-center space-x-1.5 text-xs font-medium text-slate-600 hover:text-red-600 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <LogOut class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Ganti Akun Demo</span>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div class="w-full max-w-[1720px] mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import {
  Layers,
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Building2,
  LogOut,
  Menu,
  X,
  Lock,
} from '@lucide/vue';

const authStore = useAuthStore();
const router = useRouter();
const mobileOpen = ref(false);

const initials = computed(() => {
  if (!authStore.user?.name) return 'U';
  return authStore.user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
});

async function handleLogout() {
  await authStore.logout();
  router.push({ name: 'login' });
}
</script>
