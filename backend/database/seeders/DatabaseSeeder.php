<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Product;
use App\Models\Tenant;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with demo multi-tenant data.
     */
    public function run(): void
    {
        $password = Hash::make('password123');

        // ==========================================
        // 1. TENANT 1: PT Nusantara Niaga Mandiri
        // ==========================================
        $tenantA = Tenant::create([
            'name' => 'PT Nusantara Niaga Mandiri',
        ]);

        $ownerA = User::create([
            'tenant_id' => $tenantA->id,
            'name' => 'Budi Pratama (Owner A)',
            'email' => 'owner1@nusantara.com',
            'password' => $password,
            'role' => UserRole::OWNER,
        ]);

        $staffA = User::create([
            'tenant_id' => $tenantA->id,
            'name' => 'Siti Rahma (Staff A)',
            'email' => 'staff1@nusantara.com',
            'password' => $password,
            'role' => UserRole::STAFF,
        ]);

        // Products for Tenant A
        $prodA1 = Product::create([
            'tenant_id' => $tenantA->id,
            'name' => 'Paket ERP Cloud Subscription (Tahunan)',
            'price' => '12500000.00',
        ]);

        $prodA2 = Product::create([
            'tenant_id' => $tenantA->id,
            'name' => 'Dedicated Server Hosting Intel Xeon',
            'price' => '4250000.00',
        ]);

        $prodA3 = Product::create([
            'tenant_id' => $tenantA->id,
            'name' => 'Implementasi & Training Sistem ERP',
            'price' => '7800000.00',
        ]);

        $prodA4 = Product::create([
            'tenant_id' => $tenantA->id,
            'name' => 'Maintenance & Support SLA Platinum',
            'price' => '2500000.00',
        ]);

        $prodA5 = Product::create([
            'tenant_id' => $tenantA->id,
            'name' => 'Lisensi User Tambahan (Per Seat)',
            'price' => '450000.00',
        ]);

        // Transactions for Tenant A (Current month & Previous month)
        $now = Carbon::now();
        $prevMonth = $now->copy()->subMonth();

        // Transaction A1 (Previous month)
        $trxA1 = Transaction::create([
            'tenant_id' => $tenantA->id,
            'transaction_code' => 'TRX-T1-' . $prevMonth->format('Ymd') . '-001',
            'user_id' => $ownerA->id,
            'transaction_date' => $prevMonth->copy()->startOfMonth()->addDays(5)->toDateString(),
            'total' => '20300000.00', // 12.5M + 7.8M
        ]);
        TransactionItem::create([
            'tenant_id' => $tenantA->id,
            'transaction_id' => $trxA1->id,
            'product_id' => $prodA1->id,
            'qty' => 1,
            'price_at_transaction' => '12500000.00',
            'subtotal' => '12500000.00',
        ]);
        TransactionItem::create([
            'tenant_id' => $tenantA->id,
            'transaction_id' => $trxA1->id,
            'product_id' => $prodA3->id,
            'qty' => 1,
            'price_at_transaction' => '7800000.00',
            'subtotal' => '7800000.00',
        ]);

        // Transaction A2 (Current month - early)
        $trxA2 = Transaction::create([
            'tenant_id' => $tenantA->id,
            'transaction_code' => 'TRX-T1-' . $now->format('Ymd') . '-002',
            'user_id' => $staffA->id,
            'transaction_date' => $now->copy()->startOfMonth()->addDays(2)->toDateString(),
            'total' => '8500000.00', // 2x 4.25M
        ]);
        TransactionItem::create([
            'tenant_id' => $tenantA->id,
            'transaction_id' => $trxA2->id,
            'product_id' => $prodA2->id,
            'qty' => 2,
            'price_at_transaction' => '4250000.00',
            'subtotal' => '8500000.00',
        ]);

        // Transaction A3 (Current month - today)
        $trxA3 = Transaction::create([
            'tenant_id' => $tenantA->id,
            'transaction_code' => 'TRX-T1-' . $now->format('Ymd') . '-003',
            'user_id' => $staffA->id,
            'transaction_date' => $now->toDateString(),
            'total' => '3850000.00', // 1x 2.5M + 3x 450k (1.35M)
        ]);
        TransactionItem::create([
            'tenant_id' => $tenantA->id,
            'transaction_id' => $trxA3->id,
            'product_id' => $prodA4->id,
            'qty' => 1,
            'price_at_transaction' => '2500000.00',
            'subtotal' => '2500000.00',
        ]);
        TransactionItem::create([
            'tenant_id' => $tenantA->id,
            'transaction_id' => $trxA3->id,
            'product_id' => $prodA5->id,
            'qty' => 3,
            'price_at_transaction' => '450000.00',
            'subtotal' => '1350000.00',
        ]);


        // ==========================================
        // 2. TENANT 2: CV Sentosa Solusindo
        // ==========================================
        $tenantB = Tenant::create([
            'name' => 'CV Sentosa Solusindo',
        ]);

        $ownerB = User::create([
            'tenant_id' => $tenantB->id,
            'name' => 'Hendra Wijaya (Owner B)',
            'email' => 'owner2@sentosa.com',
            'password' => $password,
            'role' => UserRole::OWNER,
        ]);

        $staffB = User::create([
            'tenant_id' => $tenantB->id,
            'name' => 'Dewi Lestari (Staff B)',
            'email' => 'staff2@sentosa.com',
            'password' => $password,
            'role' => UserRole::STAFF,
        ]);

        // Products for Tenant B
        $prodB1 = Product::create([
            'tenant_id' => $tenantB->id,
            'name' => 'Mesin Kasir POS Android Dual Screen',
            'price' => '3850000.00',
        ]);

        $prodB2 = Product::create([
            'tenant_id' => $tenantB->id,
            'name' => 'Barcode Scanner Laser Wireless 2D',
            'price' => '650000.00',
        ]);

        $prodB3 = Product::create([
            'tenant_id' => $tenantB->id,
            'name' => 'Printer Thermal Kasir Bluetooth 80mm',
            'price' => '850000.00',
        ]);

        $prodB4 = Product::create([
            'tenant_id' => $tenantB->id,
            'name' => 'Kertas Struk Thermal Roll (Pack isi 10)',
            'price' => '750000.00',
        ]);

        // Transaction for Tenant B (Current month)
        $trxB1 = Transaction::create([
            'tenant_id' => $tenantB->id,
            'transaction_code' => 'TRX-T2-' . $now->format('Ymd') . '-001',
            'user_id' => $staffB->id,
            'transaction_date' => $now->toDateString(),
            'total' => '5350000.00', // 1x 3.85M + 1x 650k + 1x 850k
        ]);
        TransactionItem::create([
            'tenant_id' => $tenantB->id,
            'transaction_id' => $trxB1->id,
            'product_id' => $prodB1->id,
            'qty' => 1,
            'price_at_transaction' => '3850000.00',
            'subtotal' => '3850000.00',
        ]);
        TransactionItem::create([
            'tenant_id' => $tenantB->id,
            'transaction_id' => $trxB1->id,
            'product_id' => $prodB2->id,
            'qty' => 1,
            'price_at_transaction' => '650000.00',
            'subtotal' => '650000.00',
        ]);
        TransactionItem::create([
            'tenant_id' => $tenantB->id,
            'transaction_id' => $trxB1->id,
            'product_id' => $prodB3->id,
            'qty' => 1,
            'price_at_transaction' => '850000.00',
            'subtotal' => '850000.00',
        ]);
    }
}
