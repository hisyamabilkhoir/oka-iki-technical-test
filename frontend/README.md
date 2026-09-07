# Frontend Web SPA – Mini ERP SaaS Multi-Tenant
### Technical Test Fullstack Developer – PT Oka Iki Indonesia

Modul frontend ini dibangun menggunakan **Vue 3** berbasis **Vite**, **Composition API (`<script setup>`)**, **Pinia State Management**, **Vue Router 4**, dan **Tailwind CSS**.

Aplikasi menyajikan antarmuka pengguna (*User Interface*) Single Page Application (SPA) yang responsif, modern, dan profesional tanpa *AI slop*. Terdapat fitur kenyamanan evaluator berupa **1-Click Quick Demo Account Switcher** untuk memudahkan penguji menguji akun Owner dan Staff dari Tenant A dan Tenant B secara instan.

---

## 🛠️ Tech Stack Frontend
- **Framework**: Vue 3 (Composition API dengan `<script setup>`)
- **Build Tool**: Vite 6.x
- **State Management**: Pinia 2.x
- **Routing**: Vue Router 4 (Navigation Guards untuk autentikasi & otorisasi role)
- **Styling**: Tailwind CSS 3.4 (Custom Design Tokens & Enterprise Slate/Indigo Palette)
- **Icons**: `@lucide/vue` (Lucide Icons)
- **HTTP Client**: Axios (dengan Request/Response Interceptors terpusat)

---

## 🌟 Fitur & Keunggulan Antarmuka

### 1. 1-Click Quick Demo Switcher (Halaman Login)
Pada halaman `/login`, tersedia 4 kartu tombol demo instan:
- `Owner (Tenant A)`: PT Nusantara Niaga Mandiri (`owner1@nusantara.com`)
- `Staff (Tenant A)`: PT Nusantara Niaga Mandiri (`staff1@nusantara.com`)
- `Owner (Tenant B)`: CV Sentosa Solusindo (`owner2@sentosa.com`)
- `Staff (Tenant B)`: CV Sentosa Solusindo (`staff2@sentosa.com`)
*Satu klik akan langsung mengisi kredensial dan melakukan autentikasi ke backend.*

### 2. Dashboard Informatif & Indikator Tenant
- **Header Tenant Aktif**: Menampilkan nama perusahaan tenant dan ID tenant yang sedang aktif untuk memverifikasi isolasi konteks.
- **Kartu Metrik KPI**: Total produk katalog, transaksi bulan berjalan, omzet bulan berjalan (terenkapsulasi khusus Owner), dan indikator role pengguna aktif.
- **Tabel Transaksi Terakhir**: Rangkuman transaksi mutakhir tenant yang sedang login.

### 3. Modul Produk (`/products`)
- **Pencarian Real-Time**: Filter instan nama produk dengan debounce.
- **Modal Tambah & Edit Produk**: Validasi form, formatting preview Rupiah instan, dan error feedback.
- **Proteksi Soft Delete**:
  - Pada akun **Owner**: Tombol hapus aktif dan memicu modal konfirmasi penghapusan.
  - Pada akun **Staff**: Tombol hapus ditampilkan non-aktif dengan tooltip petunjuk *"Hanya Owner"*, dan request hapus tetap diproteksi backend via Policy (HTTP 403).

### 4. Modul Kasir & Transaksi POS (`/transactions`)
- **Layout Split Screen**:
  - *Sisi Kiri*: Katalog kartu produk tenant dengan tombol cepat *"Pilih"*.
  - *Sisi Kanan*: Keranjang transaksi interaktif dengan kuantitas stepper (`-` / `+` / manual input), validasi kuantitas minimal 1, pemilih tanggal transaksi, serta kalkulasi live subtotal dan grand total.
- **Struk Resmi Transaksi (Nota Modal)**:
  Setelah transaksi sukses disimpan, struk transaksi resmi langsung muncul menampilkan kode transaksi ERP unik, tanggal, kasir, rincian produk, dan snapshot harga yang tersimpan di basis data.
- **Tab Riwayat Transaksi**:
  Daftar transaksi tersimpan dengan tombol *"Lihat Struk"* untuk memeriksa kembali transaksi masa lalu beserta alert penegasan aturan integritas ERP (transaksi bersifat *immutable*).

### 5. Modul Laporan Omzet (`/reports`)
- **Proteksi Akses Khusus Owner**: Jika user ber-role Staff mencoba mengakses rute ini, Vue Router Navigation Guard akan otomatis mengalihkan navigasi dan menu laporan di sidebar dikunci.
- **Filter Rentang Tanggal & Preset Cepat**: Tombol preset *"Bulan Ini"* dan *"Bulan Lalu"*, serta pemilih tanggal kustom.
- **Kartu Metrik**: Omzet bulan berjalan (MTD), volume transaksi, total pendapatan periode filter, dan *Average Order Value* (AOV).
- **Agregasi Harian Server-Side**: Tabel tren pendapatan harian yang dihitung langsung melalui query SQL backend, bukan kalkulasi client-side.

---

## 📂 Struktur Direktori Frontend

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── axios.js            # Axios client + Bearer Token Interceptor + 401 Auto Logout
│   ├── layouts/
│   │   └── MainLayout.vue      # Layout enterprise: Sidebar, Tenant Context Header, Profile
│   ├── router/
│   │   └── index.js            # Vue Router + Navigation Guards (requiresAuth, requiresOwner)
│   ├── stores/
│   │   └── auth.js             # Pinia store (token, user, tenant, isOwner, isStaff)
│   ├── utils/
│   │   └── formatters.js       # Formatter Rupiah (IDR) & Tanggal Bahasa Indonesia
│   ├── views/
│   │   ├── LoginView.vue       # Halaman login + 1-Click Quick Demo Switcher
│   │   ├── DashboardView.vue   # Metrik KPI, Tenant Banner, Transaksi Terakhir
│   │   ├── ProductsView.vue    # Tabel produk, search, modal tambah/edit, soft-delete
│   │   ├── TransactionsView.vue# Kasir POS, live cart, cetak struk nota, riwayat
│   │   └── ReportsView.vue     # Laporan omzet MTD, date filter, breakdown harian
│   ├── App.vue                 # Root component (<router-view />)
│   ├── main.js                 # Inisialisasi Vue, Pinia, Router, CSS
│   └── style.css               # Tailwind CSS directives & custom typography
├── .env                        # VITE_API_BASE_URL=http://localhost:8000/api
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## ⚙️ Panduan Menjalankan Frontend

1. **Masuk ke folder `frontend`**:
   ```bash
   cd frontend
   ```

2. **Install dependensi node**:
   ```bash
   npm install
   ```

3. **Pastikan file environment telah tersedia**:
   File `.env` sudah dikonfigurasi secara default mengarah ke backend lokal:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```
   *(Jika belum ada, salin dari `.env.example`: `copy .env.example .env`)*

4. **Jalankan Vite Development Server**:
   ```bash
   npm run dev
   ```
   *Buka di browser*: `http://localhost:5173`

5. **Build Produksi (Opsional)**:
   ```bash
   npm run build
   ```
   *Output bundle teroptimasi akan tersimpan di folder `dist/`.*
