<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Product;
use App\Models\Tenant;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MiniErpMultiTenantTest extends TestCase
{
    use RefreshDatabase;

    protected Tenant $tenantA;
    protected Tenant $tenantB;
    protected User $ownerA;
    protected User $staffA;
    protected User $ownerB;
    protected User $staffB;
    protected Product $productA1;
    protected Product $productA2;
    protected Product $productB1;

    protected function setUp(): void
    {
        parent::setUp();

        // Tenant A
        $this->tenantA = Tenant::create(['name' => 'PT Nusantara Niaga Mandiri']);
        $this->ownerA = User::create([
            'tenant_id' => $this->tenantA->id,
            'name' => 'Owner Tenant A',
            'email' => 'owner.a@example.com',
            'password' => bcrypt('password'),
            'role' => UserRole::OWNER,
        ]);
        $this->staffA = User::create([
            'tenant_id' => $this->tenantA->id,
            'name' => 'Staff Tenant A',
            'email' => 'staff.a@example.com',
            'password' => bcrypt('password'),
            'role' => UserRole::STAFF,
        ]);
        $this->productA1 = Product::create([
            'tenant_id' => $this->tenantA->id,
            'name' => 'Product A1 (100.000)',
            'price' => '100000.00',
        ]);
        $this->productA2 = Product::create([
            'tenant_id' => $this->tenantA->id,
            'name' => 'Product A2 (50.000)',
            'price' => '50000.00',
        ]);

        // Tenant B
        $this->tenantB = Tenant::create(['name' => 'CV Sentosa Solusindo']);
        $this->ownerB = User::create([
            'tenant_id' => $this->tenantB->id,
            'name' => 'Owner Tenant B',
            'email' => 'owner.b@example.com',
            'password' => bcrypt('password'),
            'role' => UserRole::OWNER,
        ]);
        $this->staffB = User::create([
            'tenant_id' => $this->tenantB->id,
            'name' => 'Staff Tenant B',
            'email' => 'staff.b@example.com',
            'password' => bcrypt('password'),
            'role' => UserRole::STAFF,
        ]);
        $this->productB1 = Product::create([
            'tenant_id' => $this->tenantB->id,
            'name' => 'Product B1 (75.000)',
            'price' => '75000.00',
        ]);
    }

    /**
     * Skenario 1: User tenant A hanya melihat produk tenant A.
     */
    public function test_1_user_tenant_a_can_only_see_tenant_a_products(): void
    {
        Sanctum::actingAs($this->ownerA);

        $response = $this->getJson('/api/products');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment(['name' => 'Product A1 (100.000)'])
            ->assertJsonFragment(['name' => 'Product A2 (50.000)'])
            ->assertJsonMissing(['name' => 'Product B1 (75.000)']);
    }

    /**
     * Skenario 2: User tenant A tidak dapat membuka detail/edit produk tenant B dengan mengganti ID pada URL/API.
     */
    public function test_2_user_tenant_a_cannot_access_or_edit_tenant_b_product_via_id(): void
    {
        Sanctum::actingAs($this->ownerA);

        // Attempting to view Tenant B's product
        $showResponse = $this->getJson('/api/products/' . $this->productB1->id);
        $showResponse->assertNotFound();

        // Attempting to update Tenant B's product
        $updateResponse = $this->putJson('/api/products/' . $this->productB1->id, [
            'name' => 'Hacked Name',
            'price' => '999999.00',
        ]);
        $updateResponse->assertNotFound();
    }

    /**
     * Skenario 3: Staff tidak dapat menghapus produk, sedangkan Owner dapat melakukan soft delete.
     */
    public function test_3_staff_cannot_delete_product_while_owner_can_soft_delete(): void
    {
        // 1. Staff attempts to delete -> 403 Forbidden
        Sanctum::actingAs($this->staffA);
        $staffDeleteResponse = $this->deleteJson('/api/products/' . $this->productA1->id);
        $staffDeleteResponse->assertStatus(403);
        $this->assertDatabaseHas('products', ['id' => $this->productA1->id, 'deleted_at' => null]);

        // 2. Owner deletes -> 200 OK and soft deleted
        Sanctum::actingAs($this->ownerA);
        $ownerDeleteResponse = $this->deleteJson('/api/products/' . $this->productA1->id);
        $ownerDeleteResponse->assertOk();
        $this->assertSoftDeleted('products', ['id' => $this->productA1->id]);
    }

    /**
     * Skenario 4: Transaksi berhasil dibuat dengan beberapa item dan total dihitung akurat.
     */
    public function test_4_transaction_created_with_multiple_items_and_accurate_total(): void
    {
        Sanctum::actingAs($this->staffA);

        $payload = [
            'transaction_date' => '2026-09-08',
            'items' => [
                ['product_id' => $this->productA1->id, 'qty' => 2], // 2 x 100.000 = 200.000
                ['product_id' => $this->productA2->id, 'qty' => 3], // 3 x 50.000 = 150.000
            ],
        ];

        $response = $this->postJson('/api/transactions', $payload);

        $response->assertCreated()
            ->assertJsonPath('transaction.total', '350000.00')
            ->assertJsonCount(2, 'transaction.items');

        $this->assertDatabaseHas('transactions', [
            'tenant_id' => $this->tenantA->id,
            'user_id' => $this->staffA->id,
            'total' => '350000.00',
        ]);
    }

    /**
     * Skenario 5: Harga transaksi berasal dari database, bukan harga yang dimanipulasi dari client.
     */
    public function test_5_transaction_price_snapshot_taken_from_database_not_client_manipulation(): void
    {
        Sanctum::actingAs($this->staffA);

        // Client attempts to tamper with price
        $payload = [
            'transaction_date' => '2026-09-08',
            'items' => [
                [
                    'product_id' => $this->productA1->id,
                    'qty' => 1,
                    'price' => '10.00', // Tampered price
                    'price_at_transaction' => '1.00', // Tampered price
                    'subtotal' => '1.00', // Tampered subtotal
                ],
            ],
            'total' => '1.00', // Tampered grand total
        ];

        $response = $this->postJson('/api/transactions', $payload);

        // Backend must completely ignore client prices and snapshot DB price 100000.00
        $response->assertCreated()
            ->assertJsonPath('transaction.total', '100000.00')
            ->assertJsonPath('transaction.items.0.price_at_transaction', '100000.00')
            ->assertJsonPath('transaction.items.0.subtotal', '100000.00');
    }

    /**
     * Skenario 6: Perubahan harga produk setelah transaksi dibuat tidak mengubah price_at_transaction pada transaksi lama.
     */
    public function test_6_updating_product_price_does_not_change_past_transaction_snapshot(): void
    {
        Sanctum::actingAs($this->ownerA);

        // 1. Create transaction with initial price (100.000)
        $txResponse = $this->postJson('/api/transactions', [
            'items' => [
                ['product_id' => $this->productA1->id, 'qty' => 1],
            ],
        ]);
        $txId = $txResponse->json('transaction.id');

        // 2. Change product price to 250.000
        $this->productA1->update(['price' => '250000.00']);

        // 3. Inspect historical transaction -> snapshot must remain 100.000
        $detailResponse = $this->getJson('/api/transactions/' . $txId);
        $detailResponse->assertOk()
            ->assertJsonPath('transaction.total', '100000.00')
            ->assertJsonPath('transaction.items.0.price_at_transaction', '100000.00');
    }

    /**
     * Skenario 7: Product dari tenant lain tidak dapat dimasukkan ke transaksi.
     */
    public function test_7_product_from_other_tenant_cannot_be_included_in_transaction(): void
    {
        Sanctum::actingAs($this->staffA);

        // Attempting to include Product B1 (belongs to Tenant B)
        $payload = [
            'items' => [
                ['product_id' => $this->productB1->id, 'qty' => 1],
            ],
        ];

        $response = $this->postJson('/api/transactions', $payload);

        // Must reject with validation error (422 Unprocessable Entity)
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['items.0.product_id']);
    }

    /**
     * Skenario 8: Quantity nol/negatif atau input tidak valid ditolak dengan response/feedback yang jelas.
     */
    public function test_8_zero_or_negative_quantity_is_rejected_with_clear_feedback(): void
    {
        Sanctum::actingAs($this->staffA);

        // Qty = 0
        $responseZero = $this->postJson('/api/transactions', [
            'items' => [
                ['product_id' => $this->productA1->id, 'qty' => 0],
            ],
        ]);
        $responseZero->assertStatus(422)
            ->assertJsonValidationErrors(['items.0.qty']);

        // Qty = -5
        $responseNegative = $this->postJson('/api/transactions', [
            'items' => [
                ['product_id' => $this->productA1->id, 'qty' => -5],
            ],
        ]);
        $responseNegative->assertStatus(422)
            ->assertJsonValidationErrors(['items.0.qty']);

        // Empty items array
        $responseEmpty = $this->postJson('/api/transactions', [
            'items' => [],
        ]);
        $responseEmpty->assertStatus(422)
            ->assertJsonValidationErrors(['items']);
    }

    /**
     * Skenario 9: Laporan tanggal dan bulan berjalan hanya menghitung transaksi tenant yang benar.
     */
    public function test_9_report_only_aggregates_active_tenant_transactions(): void
    {
        $now = Carbon::now();

        // Create transaction for Tenant A
        Transaction::create([
            'tenant_id' => $this->tenantA->id,
            'transaction_code' => 'TRX-TA-TEST',
            'user_id' => $this->ownerA->id,
            'transaction_date' => $now->toDateString(),
            'total' => '500000.00',
        ]);

        // Create transaction for Tenant B
        Transaction::create([
            'tenant_id' => $this->tenantB->id,
            'transaction_code' => 'TRX-TB-TEST',
            'user_id' => $this->ownerB->id,
            'transaction_date' => $now->toDateString(),
            'total' => '1000000.00',
        ]);

        // 1. Owner A checks report -> should ONLY see Tenant A's 500,000, NOT Tenant B's 1,000,000
        Sanctum::actingAs($this->ownerA);
        $reportA = $this->getJson('/api/reports');
        $reportA->assertOk()
            ->assertJsonPath('data.current_month.total_transactions', 1)
            ->assertJsonPath('data.current_month.total_revenue', '500000.00');

        // 2. Staff A attempts to view reports -> 403 Forbidden
        Sanctum::actingAs($this->staffA);
        $staffReport = $this->getJson('/api/reports');
        $staffReport->assertStatus(403);
    }

    /**
     * Skenario 10: Transaksi yang sudah dibuat tidak dapat dihapus melalui endpoint/action normal.
     */
    public function test_10_transactions_cannot_be_deleted(): void
    {
        $transaction = Transaction::create([
            'tenant_id' => $this->tenantA->id,
            'transaction_code' => 'TRX-IMMUTABLE',
            'user_id' => $this->ownerA->id,
            'transaction_date' => '2026-09-08',
            'total' => '100000.00',
        ]);

        Sanctum::actingAs($this->ownerA);

        $response = $this->deleteJson('/api/transactions/' . $transaction->id);

        // Expected 405 Method Not Allowed
        $response->assertStatus(405)
            ->assertJson(['message' => 'Transaksi tidak dapat dihapus demi integritas data ERP.']);

        $this->assertDatabaseHas('transactions', [
            'id' => $transaction->id,
        ]);
    }
}
