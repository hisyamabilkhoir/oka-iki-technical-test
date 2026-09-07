<template>
  <div class="min-h-screen bg-slate-50 relative flex flex-col justify-between overflow-x-hidden font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
    <!-- Right Dark Navy Wave Background (Smooth Rounded Gelombang) -->
    <div class="hidden lg:block absolute top-0 right-0 w-[46%] xl:w-[42%] h-full z-0 overflow-hidden pointer-events-none">
      <svg class="absolute top-0 right-0 h-full w-full" viewBox="0 0 500 1000" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="waveNavyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0E1E38" />
            <stop offset="50%" stop-color="#0B1528" />
            <stop offset="100%" stop-color="#070D1A" />
          </linearGradient>
        </defs>

        <!-- Secondary Soft Blue Ambient Underlay Wave -->
        <path
          d="M 20 0 C 80 250, 20 450, 80 700 C 120 850, 40 950, 80 1000 L 500 1000 L 500 0 Z"
          fill="#1E3A8A"
          opacity="0.25"
        />

        <!-- Primary Smooth Organic Gelombang Wave -->
        <path
          d="M 60 0 C 120 250, 50 480, 110 720 C 150 870, 70 950, 110 1000 L 500 1000 L 500 0 Z"
          fill="url(#waveNavyGradient)"
        />

        <!-- Architectural subtle lines -->
        <line x1="140" y1="0" x2="420" y2="1000" stroke="white" stroke-opacity="0.04" stroke-width="1.5" />
        <line x1="240" y1="0" x2="480" y2="800" stroke="white" stroke-opacity="0.04" stroke-width="1.5" />
      </svg>

      <!-- Right Tagline Accent Box -->
      <div class="absolute top-1/2 -translate-y-1/2 right-6 xl:right-10 flex items-center space-x-3 text-white/90 max-w-[170px] z-10">
        <div class="w-1 h-14 bg-blue-500 rounded-full shrink-0 shadow-sm shadow-blue-500/50"></div>
        <p class="text-xs font-medium leading-relaxed text-slate-300">
          Solusi ERP untuk bisnis yang lebih baik.
        </p>
      </div>

      <!-- Bottom Right Motto -->
      <div class="absolute bottom-6 right-8 flex items-center space-x-2 text-xs font-medium text-slate-400 z-10">
        <span>Efisien</span>
        <span>&bull;</span>
        <span>Terukur</span>
        <span>&bull;</span>
        <span>Berkelanjutan</span>
        <span class="w-6 h-[1.5px] bg-slate-500 inline-block ml-1"></span>
      </div>
    </div>

    <!-- Top Navigation Bar -->
    <header class="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
          <Layers class="w-5 h-5" />
        </div>
        <div>
          <div class="font-extrabold text-base tracking-tight text-slate-900 leading-tight">Mini ERP</div>
          <div class="text-[11px] text-slate-400 font-medium">PT Oka Iki Indonesia</div>
        </div>
      </div>

      <!-- Top Right Tagline -->
      <div class="hidden md:flex items-center space-x-2 text-xs font-medium text-slate-400 lg:text-slate-300 pr-4">
        <span>Satu Sistem, Banyak Kemungkinan.</span>
        <span class="w-6 h-[1.5px] bg-slate-300 lg:bg-slate-400 inline-block"></span>
      </div>
    </header>

    <!-- Main Content Grid -->
    <main class="relative z-10 w-full max-w-7xl mx-auto px-6 py-2 flex-1 flex items-center">
      <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        <!-- LEFT COLUMN: Hero Typography, Features, & Realistic Laptop Preview (7 cols) -->
        <div class="lg:col-span-7 space-y-5">
          <!-- Tagline Badge -->
          <div>
            <span class="text-[11px] font-extrabold tracking-[0.22em] text-blue-600 uppercase">
              SISTEM ERP RINGKAS
            </span>
            <h1 class="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.18] mt-2">
              Kelola Bisnis Anda <br />
              <span class="text-blue-600">Lebih Mudah dan Efisien.</span>
            </h1>
            <p class="text-sm text-slate-500 leading-relaxed max-w-xl mt-3">
              Mini ERP membantu Anda mengelola operasional, data, dan laporan multi-tenant dalam satu aplikasi yang aman, ringan, dan fleksibel.
            </p>
          </div>

          <!-- 3 Feature Highlight Badges (Matches Mockup) -->
          <div class="grid grid-cols-3 gap-3 max-w-md pt-1">
            <!-- 1. Multi-tenant -->
            <div class="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-2">
              <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 class="w-4 h-4" />
              </div>
              <span class="text-[11px] font-bold text-slate-800 leading-tight">Multi-tenant<br />Ready</span>
            </div>

            <!-- 2. Keamanan Data -->
            <div class="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-2">
              <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Shield class="w-4 h-4" />
              </div>
              <span class="text-[11px] font-bold text-slate-800 leading-tight">Keamanan<br />Data</span>
            </div>

            <!-- 3. Ringan & Fleksibel -->
            <div class="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-2">
              <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers class="w-4 h-4" />
              </div>
              <span class="text-[11px] font-bold text-slate-800 leading-tight">Ringan &<br />Fleksibel</span>
            </div>
          </div>

          <!-- High-Resolution Laptop Image Mockup + Cursive Handwriting Note -->
          <div class="relative pt-1 max-w-xl">
            <!-- Rendered Laptop Image with high resolution 3D illustration -->
            <div class="relative w-full max-w-[480px] lg:max-w-[510px]">
              <img
                :src="laptopMockup"
                alt="Mini ERP Dashboard on Laptop"
                class="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(15,23,42,0.14)] select-none transition-transform duration-500 hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Floating Login Card (5 cols, overlapping over the gelombang wave) -->
        <div class="lg:col-span-5 flex justify-center lg:justify-start lg:-ml-4 xl:-ml-8">
          <div class="bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(8,15,30,0.18)] border border-slate-100 w-full max-w-[430px] relative z-20">
            <!-- Header inside card -->
            <div>
              <span class="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400 block mb-1">
                SELAMAT DATANG KEMBALI
              </span>
              <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">
                Masuk ke Mini ERP
              </h2>
              <p class="text-xs text-slate-500 mt-1">
                Lanjutkan untuk mengakses dashboard Anda.
              </p>
            </div>

            <!-- Error Alert if any -->
            <div v-if="authStore.error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-start space-x-2">
              <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
              <span>{{ authStore.error }}</span>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="mt-5 space-y-4">
              <!-- Email Input -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Pengguna
                </label>
                <div class="relative flex items-center">
                  <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    v-model="email"
                    type="email"
                    required
                    placeholder="nama@perusahaan.com"
                    class="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <!-- Password Input -->
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div class="relative flex items-center">
                  <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    placeholder="••••••••"
                    class="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                  >
                    <EyeOff v-if="showPassword" class="w-4 h-4" />
                    <Eye v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- Remember me & Forgot Password Row -->
              <div class="flex items-center justify-between pt-1">
                <label class="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    v-model="rememberMe"
                    type="checkbox"
                    class="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span>Ingat saya</span>
                </label>
                <a href="#" @click.prevent class="text-xs font-medium text-blue-600 hover:underline">
                  Lupa kata sandi?
                </a>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="authStore.loading"
                class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span v-if="authStore.loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ authStore.loading ? 'Memproses...' : 'Masuk ke Dashboard' }}</span>
                <ArrowRight v-if="!authStore.loading" class="w-4 h-4" />
              </button>
            </form>

            <!-- Divider -->
            <div class="relative my-5">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-200"></div>
              </div>
              <div class="relative flex justify-center text-[10px] uppercase">
                <span class="bg-white px-2.5 text-slate-400 font-bold tracking-wider">
                  ATAU
                </span>
              </div>
            </div>

            <!-- Demo Account Switcher Section (Matches Mockup 2x2 Grid) -->
            <div>
              <h3 class="text-xs font-bold text-slate-800">
                Akun Uji Coba Demo (1-Click)
              </h3>
              <p class="text-[11px] text-slate-500 mt-0.5 mb-3 leading-snug">
                Klik salah satu akun di bawah untuk verifikasi isolasi data multi-tenant secara instan.
              </p>

              <!-- 2x2 Buttons Grid -->
              <div class="grid grid-cols-2 gap-2.5">
                <!-- 1. Tenant A - Owner -->
                <button
                  type="button"
                  @click="quickLogin('owner1@nusantara.com', 'password123')"
                  class="p-2.5 text-left bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-400 rounded-xl transition-all group"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-extrabold text-blue-600 uppercase">TENANT A</span>
                    <span class="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Owner</span>
                  </div>
                  <p class="text-xs font-bold text-slate-800 mt-1 truncate">PT Nusantara</p>
                  <p class="text-[10px] text-slate-500 truncate">Full CRUD & Laporan</p>
                </button>

                <!-- 2. Tenant A - Staff -->
                <button
                  type="button"
                  @click="quickLogin('staff1@nusantara.com', 'password123')"
                  class="p-2.5 text-left bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 rounded-xl transition-all group"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-extrabold text-emerald-600 uppercase">TENANT A</span>
                    <span class="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Staff</span>
                  </div>
                  <p class="text-xs font-bold text-slate-800 mt-1 truncate">PT Nusantara</p>
                  <p class="text-[10px] text-slate-500 truncate">No Delete, No Laporan</p>
                </button>

                <!-- 3. Tenant B - Owner -->
                <button
                  type="button"
                  @click="quickLogin('owner2@sentosa.com', 'password123')"
                  class="p-2.5 text-left bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-400 rounded-xl transition-all group"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-extrabold text-blue-600 uppercase">TENANT B</span>
                    <span class="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Owner</span>
                  </div>
                  <p class="text-xs font-bold text-slate-800 mt-1 truncate">CV Sentosa</p>
                  <p class="text-[10px] text-slate-500 truncate">Data terisolasi total</p>
                </button>

                <!-- 4. Tenant B - Staff -->
                <button
                  type="button"
                  @click="quickLogin('staff2@sentosa.com', 'password123')"
                  class="p-2.5 text-left bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-400 rounded-xl transition-all group"
                >
                  <div class="flex items-center justify-between">
                    <span class="text-[11px] font-extrabold text-emerald-600 uppercase">TENANT B</span>
                    <span class="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">Staff</span>
                  </div>
                  <p class="text-xs font-bold text-slate-800 mt-1 truncate">CV Sentosa</p>
                  <p class="text-[10px] text-slate-500 truncate">Data terisolasi total</p>
                </button>
              </div>

              <!-- Password Helper Pill -->
              <div class="mt-3 text-center">
                <span class="text-[10px] text-slate-500">
                  Password seluruh akun demo: <strong class="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">password123</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Footer (Matches Mockup) -->
    <footer class="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/60 text-xs">
      <div>
        <span class="font-bold text-slate-800">PT Oka Iki Indonesia</span>
        <span class="text-slate-400 ml-2 hidden sm:inline">&bull; Build Better Systems for a Smarter Tomorrow.</span>
      </div>

      <div class="flex items-center space-x-2 text-slate-400 lg:hidden">
        <span>Efisien</span>
        <span>&bull;</span>
        <span>Terukur</span>
        <span>&bull;</span>
        <span>Berkelanjutan</span>
        <span class="w-6 h-[1.5px] bg-slate-300 inline-block ml-1"></span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import laptopMockup from '../assets/laptop_mockup.png';
import {
  Layers,
  BarChart3,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
} from '@lucide/vue';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('owner1@nusantara.com');
const password = ref('password123');
const rememberMe = ref(true);
const showPassword = ref(false);

async function handleSubmit() {
  try {
    await authStore.login(email.value, password.value);
    router.push({ name: 'dashboard' });
  } catch (err) {
    // Error is stored in authStore.error
  }
}

async function quickLogin(targetEmail, targetPassword) {
  email.value = targetEmail;
  password.value = targetPassword;
  await handleSubmit();
}
</script>
