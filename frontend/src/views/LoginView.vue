<template>
  <div class="min-h-screen bg-slate-50 relative flex flex-col justify-between overflow-x-hidden font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
    <!-- Right Dark Navy Wave Background (Matches Mockup) -->
    <div class="hidden lg:block absolute top-0 right-0 w-[42%] xl:w-[40%] h-full bg-[#0B1528] z-0 overflow-hidden">
      <!-- Subtle Radial Grid Pattern -->
      <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div class="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Architectural subtle geometric lines -->
      <svg class="absolute bottom-0 right-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 500 800" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 800L350 300V0H500V800H100Z" fill="white" />
        <line x1="150" y1="800" x2="380" y2="350" stroke="white" stroke-width="1.5" />
        <line x1="220" y1="800" x2="420" y2="400" stroke="white" stroke-width="1.5" />
      </svg>

      <!-- Right Tagline Accent Box (Visible to the right of login card) -->
      <div class="absolute top-1/2 -translate-y-1/2 right-6 xl:right-12 flex items-center space-x-3 text-white/90 max-w-[170px] z-10">
        <div class="w-1 h-14 bg-blue-500 rounded-full shrink-0"></div>
        <p class="text-xs font-medium leading-relaxed text-slate-300">
          Solusi ERP untuk bisnis yang lebih baik.
        </p>
      </div>

      <!-- Bottom Right Motto -->
      <div class="absolute bottom-6 right-10 flex items-center space-x-2 text-xs font-medium text-slate-400 z-10">
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
    <main class="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex-1 flex items-center">
      <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- LEFT COLUMN: Hero Typography, Features, & Laptop Preview (7 cols) -->
        <div class="lg:col-span-7 space-y-6">
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

          <!-- Laptop Preview + Hand-written Cursive Note Side by Side -->
          <div class="relative pt-4 flex items-end">
            <!-- 3D Perspective Laptop Screen Mockup -->
            <div class="relative w-full max-w-[430px] rounded-t-2xl bg-slate-800 p-2 sm:p-2.5 shadow-2xl border border-slate-700">
              <!-- Camera Dot -->
              <div class="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-600 mx-auto mb-1.5"></div>

              <!-- Screen Bezel & Dashboard UI Replica -->
              <div class="bg-slate-50 rounded-lg overflow-hidden border border-slate-200 text-[10px] text-slate-700 aspect-[16/10] flex flex-col select-none">
                <!-- Mini Dashboard Header -->
                <div class="h-6 bg-white border-b border-slate-200 px-3 flex items-center justify-between">
                  <div class="flex items-center space-x-1.5">
                    <div class="w-2.5 h-2.5 rounded bg-blue-600 flex items-center justify-center text-[7px] text-white font-bold">M</div>
                    <span class="font-bold text-[9px] text-slate-800">Mini ERP</span>
                  </div>
                  <div class="flex items-center space-x-1 bg-slate-100 px-1.5 py-0.5 rounded text-[8px] font-semibold text-slate-600">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>Owner</span>
                  </div>
                </div>

                <!-- Mini Dashboard Body (Sidebar + Content) -->
                <div class="flex-1 flex overflow-hidden">
                  <!-- Mini Sidebar -->
                  <div class="w-20 bg-slate-900 text-slate-300 p-2 flex flex-col space-y-1 shrink-0">
                    <div class="bg-blue-600 text-white rounded px-1.5 py-1 text-[8px] font-bold flex items-center space-x-1">
                      <LayoutDashboard class="w-2.5 h-2.5" />
                      <span>Dashboard</span>
                    </div>
                    <div class="px-1.5 py-0.5 text-[8px] text-slate-400 flex items-center space-x-1">
                      <Package class="w-2.5 h-2.5" />
                      <span>Master Data</span>
                    </div>
                    <div class="px-1.5 py-0.5 text-[8px] text-slate-400 flex items-center space-x-1">
                      <ShoppingCart class="w-2.5 h-2.5" />
                      <span>Transaksi</span>
                    </div>
                    <div class="px-1.5 py-0.5 text-[8px] text-slate-400 flex items-center space-x-1">
                      <BarChart3 class="w-2.5 h-2.5" />
                      <span>Laporan</span>
                    </div>
                  </div>

                  <!-- Mini Dashboard Main Content Area -->
                  <div class="flex-1 p-2 bg-slate-50 space-y-1.5 overflow-hidden flex flex-col justify-between">
                    <div>
                      <div class="font-bold text-[9px] text-slate-900 leading-tight">Selamat Datang,</div>
                      <div class="text-[7px] text-slate-400">Kelola bisnis Anda dengan lebih mudah.</div>
                    </div>

                    <!-- 3 Mini Stats -->
                    <div class="grid grid-cols-3 gap-1">
                      <div class="bg-white p-1 rounded border border-slate-200/80 shadow-2xs">
                        <div class="text-[6px] text-slate-400 font-medium">Tenant Aktif</div>
                        <div class="text-[9px] font-extrabold text-slate-800">4</div>
                      </div>
                      <div class="bg-white p-1 rounded border border-slate-200/80 shadow-2xs">
                        <div class="text-[6px] text-slate-400 font-medium">Pengguna</div>
                        <div class="text-[9px] font-extrabold text-slate-800">12</div>
                      </div>
                      <div class="bg-white p-1 rounded border border-slate-200/80 shadow-2xs">
                        <div class="text-[6px] text-slate-400 font-medium">Data Tersimpan</div>
                        <div class="text-[9px] font-extrabold text-slate-800">1,250</div>
                      </div>
                    </div>

                    <!-- Mini Bar Chart (Aktivitas Terbaru) -->
                    <div class="bg-white p-1.5 rounded border border-slate-200/80 flex-1 flex flex-col justify-between">
                      <div class="flex items-center justify-between">
                        <span class="text-[7px] font-bold text-slate-800">Aktivitas Terbaru</span>
                        <span class="text-[6px] text-slate-400 font-medium">7 Hari Terakhir</span>
                      </div>
                      <!-- Bar Columns -->
                      <div class="flex items-end justify-between h-7 pt-1 px-1 gap-1">
                        <div class="w-full bg-blue-200 rounded-t h-[30%]"></div>
                        <div class="w-full bg-blue-300 rounded-t h-[45%]"></div>
                        <div class="w-full bg-blue-400 rounded-t h-[35%]"></div>
                        <div class="w-full bg-blue-500 rounded-t h-[70%]"></div>
                        <div class="w-full bg-blue-600 rounded-t h-[85%]"></div>
                        <div class="w-full bg-blue-500 rounded-t h-[60%]"></div>
                        <div class="w-full bg-blue-600 rounded-t h-[100%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Laptop Base & Lip -->
              <div class="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-300 h-2.5 w-[108%] rounded-b-xl shadow-lg border-t border-slate-400 flex items-center justify-center">
                <div class="w-14 h-1 bg-slate-400 rounded-full"></div>
              </div>
            </div>

            <!-- Hand-written cursive callout with Arrow (Positioned cleanly beside laptop) -->
            <div class="hidden sm:flex flex-col items-start ml-4 mb-10 shrink-0 z-20 select-none">
              <span class="font-handwriting text-2xl text-slate-800 font-bold -rotate-6 leading-tight">
                Dari Data<br />Menuju Pertumbuhan
              </span>
              <!-- Curved Doodle Arrow pointing left towards laptop screen -->
              <svg class="w-10 h-8 text-slate-700 mt-1 ml-1" viewBox="0 0 50 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M40 5 C 30 15, 20 20, 8 26" />
                <polyline points="15 22 7 26 12 33" />
              </svg>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Floating Login Card (5 cols, overlapping on dark wave) -->
        <div class="lg:col-span-5 flex justify-center lg:justify-start lg:-ml-6 xl:-ml-10">
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
  LayoutDashboard,
  Package,
  ShoppingCart,
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
