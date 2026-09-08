# Backend API – Mini ERP SaaS Multi-Tenant
### Technical Test Fullstack Developer – PT Oka Iki Indonesia

Modul backend ini dibangun menggunakan **Laravel 11 REST API** dengan arsitektur **Shared Database with User Context Tenant Scoping**. Backend bertindak sebagai **Single Source of Truth** untuk seluruh autentikasi, isolasi data penyewa (*tenant*), otorisasi berbasis peran (*role/permission*), penetapan harga produk (*price snapshotting*), transaksi atomik, dan agregasi laporan keuangan.

---

## 🛠️ Tech Stack & Ekosistem
- **Framework**: Laravel 11.x
- **Bahasa**: PHP >= 8.2 (dengan ekstensi `bcmath`, `pdo_mysql`, `mbstring`, `openssl`)
- **Autentikasi**: Laravel Sanctum (Token-based Bearer Authentication)
- **Database**: MySQL (Production/Local Demo) & SQLite in-memory (Automated Feature Testing)
- **Arsitektur**: Layered Architecture (Controllers, Form Requests, Services, Policies, Resources, Global Scopes, Enums)
- **Testing**: PHPUnit / Laravel Test Suite (100% Pass pada 10 skenario wajib)

---

## 🏛️ Desain Arsitektur & Pola Multi-Tenant

### 1. Isolasi Data Multi-Tenant (Zero Data Leakage)
Setiap data milik tenant memiliki atribut `tenant_id`. Sistem **tidak pernah mempercayai parameter `tenant_id` dari client**, melainkan meresolusi tenant dari token user yang terautentikasi:
- **`TenantScope` (`app/Models/Scopes/TenantScope.php`)**:
  Global scope Eloquent yang otomatis menambahkan klausa `WHERE table.tenant_id = auth()->user()->tenant_id` pada setiap pembacaan model `Product`, `Transaction`, dan `TransactionItem`.
- **`BelongsToTenant` Trait (`app/Traits/BelongsToTenant.php`)**:
  Menyuntikkan `TenantScope` dan menangani event `creating` untuk otomatis mengisi `tenant_id` dari `Auth::user()->tenant_id` saat penyimpanan data baru.
- **Pencegahan Manipulasi ID (Cross-Tenant Tampering)**:
  Jika User dari Tenant A mengakses endpoint detail atau edit dengan ID milik Tenant B (misal: `GET /api/products/{tenant_b_product_id}`), Eloquent Scope menyebabkan data tidak ditemukan dalam batas tenant A, menghasilkan respons **404 Not Found** (atau **403 Forbidden**).

### 2. Pola ERP: Price Snapshotting & Transaksi Atomik
- **`TransactionService` (`app/Services/TransactionService.php`)**:
  - Mengambil harga produk langsung dari database saat transaksi diproses (`price_at_transaction`), mengabaikan harga manipulasi yang mungkin dikirim oleh client.
  - Perhitungan matematis desimal menggunakan `bcmath` (`bcmul` dan `bcadd`) dengan kolom `decimal(15,2)` pada MySQL (tidak pernah menggunakan `float`).
  - Seluruh header transaksi dan detail item dibungkus dalam blok atomik **`DB::transaction()`**.
  - Mengisolasi harga historis: perubahan harga pada master produk tidak akan merubah `price_at_transaction` transaksi lama.
  - Sifat transaksi **Immutable** (transaksi yang sudah terbit tidak dapat dihapus, endpoint `DELETE /api/transactions/{id}` diblokir dan mengembalikan **405 Method Not Allowed**).

### 3. Role-Based Access Control (RBAC)
- **Owner**:
  - Mengelola produk: tambah, edit, list, dan **soft delete** (`ProductPolicy@delete`).
  - Membuat transaksi kasir.
  - Melihat laporan omzet dan pendapatan tenant (`role:owner` middleware + `ReportFilterRequest`).
- **Staff**:
  - Melihat list produk, tambah dan edit produk.
  - **Dilarang menghapus produk** (ditolak oleh `ProductPolicy` dengan status **403 Forbidden**).
  - Membuat transaksi kasir.
  - **Dilarang mengakses laporan** (ditolak oleh middleware `EnsureRole` dengan status **403 Forbidden**).

### 4. Server-Side Report Aggregation
- **`ReportService` (`app/Services/ReportService.php`)**:
  - Agregasi omzet dan volume order dilakukan langsung di database menggunakan query SQL (`COUNT(*)`, `SUM(total)`, `AVG(total)`) yang terisolasi oleh `tenant_id`.
  - Mendukung filter rentang tanggal dinamis (`start_date`, `end_date`), breakdown omzet harian, dan ringkasan bulan berjalan (*Month-To-Date*).

---

## 📂 Struktur Direktori Backend

```
backend/
├── app/
│   ├── Enums/
│   │   └── UserRole.php               # Enum: 'owner', 'staff'
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php      # Login, Me, Logout (Sanctum)
│   │   │   ├── ProductController.php   # CRUD Produk + Soft Deletes
│   │   │   ├── TransactionController.php # List, Checkout & Detail Transaksi
│   │   │   └── ReportController.php    # Laporan Omzet (Khusus Owner)
│   │   ├── Middleware/
│   │   │   └── EnsureRole.php          # Middleware proteksi role endpoint
│   │   ├── Requests/
│   │   │   ├── LoginRequest.php
│   │   │   ├── StoreProductRequest.php
│   │   │   ├── UpdateProductRequest.php
│   │   │   ├── StoreTransactionRequest.php # Validasi tenant product & qty >= 1
│   │   │   └── ReportFilterRequest.php # Validasi rentang tanggal & Owner check
│   │   └── Resources/
│   │       ├── UserResource.php
│   │       ├── ProductResource.php
│   │       ├── TransactionResource.php
│   │       └── TransactionItemResource.php
│   ├── Models/
│   │   ├── Tenant.php
│   │   ├── User.php                   # HasApiTokens, casts role to UserRole
│   │   ├── Product.php                # BelongsToTenant, SoftDeletes, decimal(15,2)
│   │   ├── Transaction.php            # BelongsToTenant, relations to items
│   │   ├── TransactionItem.php        # BelongsToTenant, snapshot price
│   │   └── Scopes/
│   │       └── TenantScope.php        # Global Scope WHERE tenant_id = auth()->user()->tenant_id
│   ├── Policies/
│   │   ├── ProductPolicy.php          # Owner soft-delete, staff restriction
│   │   └── TransactionPolicy.php      # Disallow delete (immutable)
│   ├── Services/
│   │   ├── TransactionService.php     # DB Transaction, snapshot pricing, bcmath
│   │   └── ReportService.php          # SQL aggregations & daily breakdown
│   └── Traits/
│       └── BelongsToTenant.php        # Trait auto tenant_id & scope attachment
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php (Tenants & Users)
│   │   ├── 2026_09_08_000001_create_products_table.php (SoftDeletes, Decimals)
│   │   ├── 2026_09_08_000002_create_transactions_table.php (Transaction Code)
│   │   └── 2026_09_08_000003_create_transaction_items_table.php (Snapshot Items)
│   └── seeders/
│       └── DatabaseSeeder.php         # 2 Tenants, 4 Users, Products & Historical Trx
├── routes/
│   └── api.php                        # Sanitized API route groups
└── tests/
    └── Feature/
        └── MiniErpMultiTenantTest.php # 10 Automated Feature Test Scenarios
```

---

## ⚙️ Panduan Instalasi & Menjalankan Backend

1. **Install Dependensi Composer**:
   ```bash
   composer install
   ```

2. **Setup Konfigurasi Environment**:
   ```bash
   copy .env.example .env
   php artisan key:generate
   ```

3. **Pastikan Konfigurasi Database pada `.env`**:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=mini_erp_saas
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Buat Database MySQL (jika belum ada)**:
   ```sql
   CREATE DATABASE IF NOT EXISTS mini_erp_saas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

5. **Jalankan Migrasi & Data Seeder**:
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Jalankan Server API**:
   ```bash
   php artisan serve --port=8000
   ```
   *Server backend siap menerima request di `http://127.0.0.1:8000`.*

---

## 🧪 Automated Feature Testing (10/10 Passed)

Seluruh 10 skenario pengujian bisnis yang diwajibkan oleh penguji (Zhorief Zainul Muttaqin) telah diimplementasikan dalam file test `tests/Feature/MiniErpMultiTenantTest.php`:

Jalankan perintah:
```bash
php artisan test --filter=MiniErpMultiTenantTest
```

### Hasil Pengujian:
```text
   PASS  Tests\Feature\MiniErpMultiTenantTest
  ✓ 1 user tenant a can only see tenant a products                                0.25s  
  ✓ 2 user tenant a cannot access or edit tenant b product via id                 0.02s  
  ✓ 3 staff cannot delete product while owner can soft delete                     0.02s  
  ✓ 4 transaction created with multiple items and accurate total                  0.03s  
  ✓ 5 transaction price snapshot taken from database not client manipulation      0.02s  
  ✓ 6 updating product price does not change past transaction snapshot            0.02s  
  ✓ 7 product from other tenant cannot be included in transaction                 0.02s  
  ✓ 8 zero or negative quantity is rejected with clear feedback                   0.02s  
  ✓ 9 report only aggregates active tenant transactions                           0.02s  
  ✓ 10 transactions cannot be deleted                                             0.02s  

  Tests:    10 passed (41 assertions)
  Duration: 0.56s
```

---

## 🔑 Data Akun Demo Uji Coba

| Tenant / Perusahaan | Role | Nama Akun | Email | Password | Hak Akses |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tenant A** (PT Nusantara Niaga Mandiri) | **Owner** | Budi Pratama | `owner1@nusantara.com` | `password123` | Full CRUD, POS, Laporan |
| **Tenant A** (PT Nusantara Niaga Mandiri) | **Staff** | Siti Rahma | `staff1@nusantara.com` | `password123` | View/Edit Produk, POS (No Delete, No Laporan) |
| **Tenant B** (CV Sentosa Solusindo) | **Owner** | Hendra Wijaya | `owner2@sentosa.com` | `password123` | Full CRUD, POS, Laporan (Data Terisolasi) |
| **Tenant B** (CV Sentosa Solusindo) | **Staff** | Dewi Lestari | `staff2@sentosa.com` | `password123` | View/Edit Produk, POS (Data Terisolasi) |

---

## 📡 Ringkasan API Endpoints

Semua endpoint dilayani di bawah prefix `/api`. Request yang terautentikasi menyertakan header:
`Authorization: Bearer <personal_access_token>`

| Method | Endpoint | Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Publik | Otentikasi dan penerbitan Sanctum token |
| `GET` | `/api/me` | Authed | Profil user login dan informasi tenant |
| `POST` | `/api/logout` | Authed | Pencabutan (*revocation*) token aktif |
| `GET` | `/api/products` | Owner & Staff | List produk tenant (support search & pagination) |
| `POST` | `/api/products` | Owner & Staff | Tambah produk baru (validasi desimal) |
| `GET` | `/api/products/{id}` | Owner & Staff | Detail produk (terisolasi tenant) |
| `PUT` | `/api/products/{id}` | Owner & Staff | Update produk (terisolasi tenant) |
| `DELETE` | `/api/products/{id}` | **Owner Only** | Soft delete produk (Staff ditolak 403) |
| `GET` | `/api/transactions` | Owner & Staff | Riwayat transaksi tenant |
| `POST` | `/api/transactions` | Owner & Staff | Buat transaksi kasir dengan price snapshotting |
| `GET` | `/api/transactions/{id}` | Owner & Staff | Detail struk transaksi |
| `DELETE` | `/api/transactions/{id}` | **Ditolak** | Mengembalikan **405 Method Not Allowed** |
| `GET` | `/api/reports` | **Owner Only** | Agregasi omzet MTD & filter tanggal (Staff ditolak 403) |

---

## 📮 Postman Collection & Environment

Koleksi Postman v2.1.0 dan file Environment variabel tersedia di direktori root [`../postman/`](file:///c:/xampp/htdocs/oka-iki-indonesia/technical-test/postman):
- **Collection**: [`Mini_ERP_MultiTenant_API.postman_collection.json`](file:///c:/xampp/htdocs/oka-iki-indonesia/technical-test/postman/Mini_ERP_MultiTenant_API.postman_collection.json)
- **Environment**: [`Mini_ERP_Local.postman_environment.json`](file:///c:/xampp/htdocs/oka-iki-indonesia/technical-test/postman/Mini_ERP_Local.postman_environment.json)
- **Dokumentasi & Panduan**: [`postman/README.md`](file:///c:/xampp/htdocs/oka-iki-indonesia/technical-test/postman/README.md)

