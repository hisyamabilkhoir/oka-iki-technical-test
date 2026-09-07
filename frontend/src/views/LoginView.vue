<template>
  <div class="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
    <!-- Subtle Background Glows -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
      <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-xl shadow-indigo-500/30 mb-4">
        <Layers class="w-8 h-8" />
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Mini ERP SaaS
      </h1>
      <p class="mt-1 text-sm text-slate-400 font-medium">
        Technical Test Fullstack Developer — PT Oka Iki Indonesia
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
      <div class="bg-slate-800/90 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl border border-slate-700/80 sm:px-10">
        <!-- Error Alert -->
        <div v-if="authStore.error" class="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3 text-red-400 text-sm">
          <AlertCircle class="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p class="font-medium">{{ authStore.error }}</p>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Email Pengguna
            </label>
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                placeholder="nama@perusahaan.com"
                class="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Kata Sandi
            </label>
            <div class="relative">
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ authStore.loading ? 'Memproses...' : 'Masuk ke Dashboard' }}</span>
            <ArrowRight v-if="!authStore.loading" class="w-4 h-4" />
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-700"></div>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-slate-800 px-3 text-slate-400 font-semibold tracking-wider">
              Akun Uji Coba Demo (1-Click)
            </span>
          </div>
        </div>

        <!-- Quick Demo Switcher Buttons -->
        <div class="space-y-2">
          <p class="text-[11px] text-slate-400 text-center mb-2">
            Klik salah satu akun di bawah untuk verifikasi isolasi data multi-tenant secara instan:
          </p>

          <div class="grid grid-cols-2 gap-2">
            <!-- Tenant A - Owner -->
            <button
              @click="quickLogin('owner1@nusantara.com', 'password123')"
              type="button"
              class="p-2.5 text-left bg-slate-900/70 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-500/50 rounded-xl transition-all group"
            >
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-indigo-400 uppercase">Tenant A</span>
                <span class="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-semibold">Owner</span>
              </div>
              <p class="text-xs font-semibold text-slate-200 mt-1 truncate">PT Nusantara</p>
              <p class="text-[10px] text-slate-400 truncate">Full CRUD & Laporan</p>
            </button>

            <!-- Tenant A - Staff -->
            <button
              @click="quickLogin('staff1@nusantara.com', 'password123')"
              type="button"
              class="p-2.5 text-left bg-slate-900/70 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 rounded-xl transition-all group"
            >
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-emerald-400 uppercase">Tenant A</span>
                <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold">Staff</span>
              </div>
              <p class="text-xs font-semibold text-slate-200 mt-1 truncate">PT Nusantara</p>
              <p class="text-[10px] text-slate-400 truncate">No Delete, No Laporan</p>
            </button>

            <!-- Tenant B - Owner -->
            <button
              @click="quickLogin('owner2@sentosa.com', 'password123')"
              type="button"
              class="p-2.5 text-left bg-slate-900/70 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-500/50 rounded-xl transition-all group"
            >
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-indigo-400 uppercase">Tenant B</span>
                <span class="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-semibold">Owner</span>
              </div>
              <p class="text-xs font-semibold text-slate-200 mt-1 truncate">CV Sentosa</p>
              <p class="text-[10px] text-slate-400 truncate">Data terisolasi total</p>
            </button>

            <!-- Tenant B - Staff -->
            <button
              @click="quickLogin('staff2@sentosa.com', 'password123')"
              type="button"
              class="p-2.5 text-left bg-slate-900/70 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500/50 rounded-xl transition-all group"
            >
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-bold text-emerald-400 uppercase">Tenant B</span>
                <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold">Staff</span>
              </div>
              <p class="text-xs font-semibold text-slate-200 mt-1 truncate">CV Sentosa</p>
              <p class="text-[10px] text-slate-400 truncate">Data terisolasi total</p>
            </button>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-700/60 text-center">
          <p class="text-[11px] text-slate-400">
            Password seluruh akun demo: <span class="font-mono text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded">password123</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Layers, ArrowRight, AlertCircle } from '@lucide/vue';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('owner1@nusantara.com');
const password = ref('password123');

async function handleSubmit() {
  try {
    await authStore.login(email.value, password.value);
    router.push({ name: 'dashboard' });
  } catch (err) {
    // Error is handled in auth store
  }
}

async function quickLogin(targetEmail, targetPassword) {
  email.value = targetEmail;
  password.value = targetPassword;
  await handleSubmit();
}
</script>
