# 📮 Dokumentasi Postman & Environment Variables
### Mini ERP SaaS Multi-Tenant Platform – PT Oka Iki Indonesia

Direktori ini berisi berkas ekspor **Postman Collection (v2.1.0)** dan **Postman Environment** yang siap diimpor ke aplikasi Postman. Koleksi ini telah dirancang untuk mencakup seluruh skenario teknis, mulai dari pengujian multi-tenancy, autentikasi Sanctum dengan *auto-token capture*, Role-Based Access Control (RBAC), Price Snapshotting transaksi, hingga pengujian keamanan (*security & zero data leakage tests*).

---

## 📁 Berkas Tersedia

| Berkas | Deskripsi |
| :--- | :--- |
| [`Mini_ERP_MultiTenant_API.postman_collection.json`](file:///c:/xampp/htdocs/oka-iki-indonesia/technical-test/postman/Mini_ERP_MultiTenant_API.postman_collection.json) | Koleksi lengkap endpoint API (22 requests) terorganisir rapi dalam 5 folder modul beserta assertion tests & automated script. |
| [`Mini_ERP_Local.postman_environment.json`](file:///c:/xampp/htdocs/oka-iki-indonesia/technical-test/postman/Mini_ERP_Local.postman_environment.json) | Variabel environment untuk pengujian lokal (`base_url`, `token`, kredensial 4 user demo, ID sample produk & transaksi). |
| [`README.md`](file:///c:/xampp/htdocs/oka-iki-indonesia/technical-test/postman/README.md) | Panduan langkah demi langkah impor, konfigurasi, dan alur pengujian API. |

---

## 🚀 Cara Impor ke Postman

1. **Buka Aplikasi Postman**.
2. Klik tombol **Import** di pojok kiri atas (atau tekan shortcut `Ctrl + O`).
3. Tarik (*drag & drop*) atau pilih kedua berkas berikut dari direktori project:
   - `postman/Mini_ERP_MultiTenant_API.postman_collection.json`
   - `postman/Mini_ERP_Local.postman_environment.json`
4. Di pojok kanan atas jendela Postman, ubah dropdown environment dari **No Environment** menjadi **Mini ERP - Local Environment**.
5. Pastikan server backend Laravel Anda telah berjalan:
   ```bash
   cd backend
   php artisan serve
   ```
   *(Secara default berjalan di `http://127.0.0.1:8000`)*.

---

## ⚙️ Variabel Environment (Postman Environment)

Berikut adalah daftar variabel yang dikonfigurasi dalam `Mini_ERP - Local Environment`:

| Variabel | Tipe | Nilai Default | Keterangan |
| :--- | :---: | :--- | :--- |
| `base_url` | default | `http://127.0.0.1:8000/api` | Base URL endpoint API Laravel backend |
| `token` | secret | *(Otomatis terisi saat Login)* | Sanctum Personal Access Token (`Bearer`) |
| `user_role` | default | *(Otomatis terisi saat Login)* | Peran user aktif (`owner` atau `staff`) |
| `tenant_name` | default | *(Otomatis terisi saat Login)* | Nama tenant user yang aktif |
| `owner_a_email` | default | `owner1@nusantara.com` | Email Owner Tenant A (PT Nusantara Niaga Mandiri) |
| `owner_a_password` | secret | `password123` | Password akun Owner Tenant A |
| `staff_a_email` | default | `staff1@nusantara.com` | Email Staff Tenant A (PT Nusantara Niaga Mandiri) |
| `staff_a_password` | secret | `password123` | Password akun Staff Tenant A |
| `owner_b_email` | default | `owner2@sentosa.com` | Email Owner Tenant B (CV Sentosa Solusindo) |
| `owner_b_password` | secret | `password123` | Password akun Owner Tenant B |
| `staff_b_email` | default | `staff2@sentosa.com` | Email Staff Tenant B (CV Sentosa Solusindo) |
| `staff_b_password` | secret | `password123` | Password akun Staff Tenant B |
| `product_id` | default | `1` | ID produk sample untuk pengujian detail, update, delete |
| `product_b_id` | default | `6` | ID produk milik Tenant B (untuk uji cross-tenant isolation) |
| `transaction_id`| default | `1` | ID transaksi sample untuk pengujian detail & immutability |

---

## ⚡ Fitur Otomasi Token (Zero Copy-Paste)

Setiap request login pada folder **`1. Authentication`** telah dilengkapi dengan **Postman Test Script** otomatis:

```javascript
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

pm.test("Token received and saved to environment", function () {
    var res = pm.response.json();
    pm.environment.set("token", res.token);
    pm.environment.set("user_role", res.user.role);
    pm.environment.set("tenant_name", res.user.tenant.name);
});
```

> [!TIP]
> **Anda tidak perlu menyalin token secara manual!** Cukup klik **Send** pada salah satu request login (misal: *1.1 Login - Owner Tenant A*), maka variabel `{{token}}` di environment akan otomatis diperbarui dan langsung digunakan oleh seluruh request lainnya.

---

## 📚 Struktur & Rincian Koleksi Postman

Koleksi terbagi menjadi 5 folder terstruktur:

### 1. Modul Authentication
Endpoint autentikasi dan manajemen sesi user:
* **`POST {{base_url}}/login`** (*1.1 Login - Owner Tenant A*): Login sebagai Owner PT Nusantara Niaga Mandiri.
* **`POST {{base_url}}/login`** (*1.2 Login - Staff Tenant A*): Login sebagai Staff PT Nusantara Niaga Mandiri.
* **`POST {{base_url}}/login`** (*1.3 Login - Owner Tenant B*): Login sebagai Owner CV Sentosa Solusindo.
* **`POST {{base_url}}/login`** (*1.4 Login - Staff Tenant B*): Login sebagai Staff CV Sentosa Solusindo.
* **`POST {{base_url}}/login`** (*1.5 Login - Negative Test*): Menguji login dengan password salah (ekspektasi: `422 Unprocessable Content`).
* **`GET {{base_url}}/me`** (*1.6 Get Current User Profile*): Mengambil data user yang sedang aktif beserta objek tenant.
* **`POST {{base_url}}/logout`** (*1.7 Logout*): Mencabut Personal Access Token yang sedang digunakan.

---

### 2. Modul Products (Katalog Produk)
Endpoint manajemen katalog produk (terisolasi otomatis oleh `TenantScope`):
* **`GET {{base_url}}/products`** (*2.1 Get All Products*): Mengambil daftar produk tenant aktif dengan paginasi (`per_page=10&page=1`). Otomatis mengupdate `{{product_id}}`.
* **`GET {{base_url}}/products`** (*2.2 Search & Filter Products*): Filter pencarian kata kunci, batas harga min/max, dan pengurutan (`search=ERP&min_price=1000000&sort_by=price&sort_dir=desc`).
* **`POST {{base_url}}/products`** (*2.3 Create Product*): Menambah produk baru. Nilai `tenant_id` otomatis diinject dari user login.
  ```json
  {
    "name": "Add-on API Integration Gateway",
    "price": 3500000.00
  }
  ```
* **`GET {{base_url}}/products/{{product_id}}`** (*2.4 Get Product Detail*): Menampilkan detail produk spesifik.
* **`PUT {{base_url}}/products/{{product_id}}`** (*2.5 Update Product*): Memperbarui nama dan harga produk master.
* **`DELETE {{base_url}}/products/{{product_id}}`** (*2.6 Delete Product - Soft Delete*): Menghapus produk secara aman menggunakan Soft Delete. Hanya bisa dijalankan oleh role `owner`.
* **`POST {{base_url}}/products`** (*2.7 Validation Error - Negative Test*): Uji validasi input kosong dan harga negatif (ekspektasi: `422`).

---

### 3. Modul Transactions (Kasir & Transaksi ERP)
Endpoint transaksi dengan integritas enterprise:
* **`GET {{base_url}}/transactions`** (*3.1 Get All Transactions*): Riwayat transaksi tenant aktif dengan pagination. Otomatis mengupdate `{{transaction_id}}`.
* **`GET {{base_url}}/transactions`** (*3.2 Filter Transactions*): Filter rentang tanggal transaksi (`start_date`, `end_date`, `sort_by`, `sort_dir`).
* **`POST {{base_url}}/transactions`** (*3.3 Create Transaction - Atomic Checkout*):
  - Harga produk diambil langsung dari database saat transaksi dibuat (**Price Snapshotting**).
  - Perhitungan matematis desimal menggunakan `bcmath` dengan kolom `decimal(15,2)`.
  - Dibungkus dalam blok atomik `DB::transaction()`.
  ```json
  {
    "transaction_date": "2026-09-08",
    "items": [
      { "product_id": 1, "qty": 2 },
      { "product_id": 2, "qty": 1 }
    ]
  }
  ```
* **`GET {{base_url}}/transactions/{{transaction_id}}`** (*3.4 Get Transaction Detail*): Menampilkan rincian nota transaksi lengkap beserta item breakdown dan data kasir pembuat.
* **`DELETE {{base_url}}/transactions/{{transaction_id}}`** (*3.5 Delete Transaction - ERP Immutability*):
  - Prinsip ERP: Transaksi yang sudah terbit bersifat kekal (*immutable*).
  - Ekspektasi respon: **`405 Method Not Allowed`** dengan pesan integritas data.

---

### 4. Modul Reports (Laporan Omzet - Owner Only)
Endpoint laporan analitik pendapatan tenant:
* **`GET {{base_url}}/reports`** (*4.1 Get Revenue Report - Month-to-Date*): Menampilkan total omzet bulan berjalan, total transaksi, rata-rata order value (AOV), breakdown omzet harian, dan 5 transaksi terbaru.
* **`GET {{base_url}}/reports`** (*4.2 Get Revenue Report with Date Range Filter*): Filter laporan omzet dengan parameter `start_date` dan `end_date`.

---

### 5. Modul Multi-Tenant & Security Tests (Pengujian Ketat)
Folder ini didedikasikan untuk membuktikan ketahanan sistem terhadap kebocoran data dan pembobolan hak akses:
* **`GET {{base_url}}/products/{{product_b_id}}`** (*5.1 Cross-Tenant Isolation: Tenant A access Tenant B Product*):
  - Login sebagai Tenant A, lalu panggil produk ID `6` (milik Tenant B).
  - Ekspektasi: **`404 Not Found`** (*Zero Data Leakage: Tenant A tidak bisa melihat bahwa produk Tenant B ada*).
* **`POST {{base_url}}/transactions`** (*5.2 Cross-Tenant Injection: Tenant A checkout Tenant B Product*):
  - Tenant A mencoba checkout dengan menyisipkan `product_id: 6` (milik Tenant B).
  - Ekspektasi: **`422 Unprocessable Content`** dengan pesan error *"Produk tidak ditemukan atau bukan milik tenant Anda"*.
* **`DELETE {{base_url}}/products/{{product_id}}`** (*5.3 RBAC Test: Staff tries to Delete Product*):
  - Login sebagai Staff (Request 1.2), lalu kirim request hapus produk.
  - Ekspektasi: **`403 Forbidden`** (*Akses ditolak: Hanya Owner yang berhak menghapus produk*).
* **`GET {{base_url}}/reports`** (*5.4 RBAC Test: Staff tries to Access Reports*):
  - Login sebagai Staff (Request 1.2), lalu akses laporan omzet.
  - Ekspektasi: **`403 Forbidden`** (*Middleware role:owner memblokir akses*).
* **`GET {{base_url}}/products`** (*5.5 Security Test: Access Protected Route without Token*):
  - Panggil endpoint produk tanpa Bearer Token.
  - Ekspektasi: **`401 Unauthorized`**.

---

## 🧪 Panduan Skenario Pengujian Langkah Demi Langkah

### Skenario A: Uji Isolasi Data Multi-Tenant (Zero Data Leakage)
1. Jalankan **1.1 Login - Owner Tenant A**.
2. Jalankan **2.1 Get All Products** (Perhatikan hanya produk Tenant 1 yang muncul, ID 1 s/d 5).
3. Jalankan **5.1 Cross-Tenant Isolation**. Respon harus `404 Not Found`.
4. Jalankan **5.2 Cross-Tenant Injection**. Respon harus `422 Unprocessable Content`.
5. Jalankan **1.3 Login - Owner Tenant B**.
6. Jalankan **2.1 Get All Products** (Perhatikan produk berubah menjadi milik Tenant 2, ID 6 s/d 9).

### Skenario B: Uji Role-Based Access Control (Owner vs Staff)
1. Jalankan **1.2 Login - Staff Tenant A** (Peran: `staff`).
2. Jalankan **5.3 RBAC Test: Staff tries to Delete Product**. Respon harus `403 Forbidden`.
3. Jalankan **5.4 RBAC Test: Staff tries to Access Reports**. Respon harus `403 Forbidden`.
4. Jalankan **1.1 Login - Owner Tenant A** (Peran: `owner`).
5. Jalankan **4.1 Get Revenue Report**. Respon harus `200 OK` dengan data keuangan lengkap.
6. Jalankan **2.6 Delete Product**. Respon harus `200 OK` (Soft Delete berhasil).

### Skenario C: Uji Price Snapshotting & Atomisitas Transaksi
1. Jalankan **1.1 Login - Owner Tenant A**.
2. Jalankan **3.3 Create Transaction**. Transaksi sukses dibuat dengan status `201 Created`.
3. Periksa respon: atribut `price_at_transaction` terisi dengan harga produk saat itu dan `subtotal` dihitung otomatis di backend.
4. Jalankan **3.5 Delete Transaction**. Respon harus `405 Method Not Allowed` yang membuktikan sifat immutability transaksi ERP.

---

## 🏃 Menjalankan Seluruh Koleksi Otomatis (Collection Runner)

Anda dapat menguji seluruh 22 skenario secara sekaligus menggunakan fitur **Postman Runner**:
1. Klik kanan pada nama koleksi **Mini ERP Multi-Tenant SaaS API**.
2. Pilih **Run Collection**.
3. Pastikan urutan pengujian tercentang semua dan Environment aktif adalah **Mini ERP - Local Environment**.
4. Klik tombol **Run Mini ERP Multi-Tenant SaaS API**.
5. Semua assertions akan bernilai **100% Passed (Hijau)**.
