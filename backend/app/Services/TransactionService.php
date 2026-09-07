<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TransactionService
{
    /**
     * Create a new transaction with snapshot pricing and database transaction integrity.
     *
     * @param  User  $user
     * @param  array{transaction_date?: string, items: array<array{product_id: int, qty: int}>}  $data
     * @return Transaction
     *
     * @throws ValidationException
     */
    public function createTransaction(User $user, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $data) {
            $transactionDate = ! empty($data['transaction_date'])
                ? Carbon::parse($data['transaction_date'])->toDateString()
                : Carbon::now()->toDateString();

            // Extract unique product IDs requested
            $requestedProductIds = collect($data['items'])->pluck('product_id')->unique()->all();

            // Fetch products strictly scoped to current tenant (TenantScope applied)
            $products = Product::whereIn('id', $requestedProductIds)->get()->keyBy('id');

            // Verify all requested products exist and belong to active tenant
            foreach ($requestedProductIds as $productId) {
                if (! $products->has($productId)) {
                    throw ValidationException::withMessages([
                        'items' => ["Produk ID {$productId} tidak valid atau bukan milik tenant Anda."],
                    ]);
                }
            }

            // Generate unique transaction code
            $datePrefix = Carbon::parse($transactionDate)->format('Ymd');
            $randomSuffix = strtoupper(bin2hex(random_bytes(3)));
            $transactionCode = sprintf('TRX-T%d-%s-%s', $user->tenant_id, $datePrefix, $randomSuffix);

            // Compute snapshot prices and item lines
            $preparedItems = [];
            $grandTotal = '0.00';

            foreach ($data['items'] as $item) {
                /** @var Product $product */
                $product = $products->get($item['product_id']);
                $qty = (int) $item['qty'];

                if ($qty < 1) {
                    throw ValidationException::withMessages([
                        'items' => ['Kuantitas setiap item minimal 1.'],
                    ]);
                }

                // Price is taken directly from the database snapshot, NEVER trusting client input
                $priceAtTransaction = (string) $product->price;
                $subtotal = bcmul($priceAtTransaction, (string) $qty, 2);
                $grandTotal = bcadd($grandTotal, $subtotal, 2);

                $preparedItems[] = [
                    'tenant_id' => $user->tenant_id,
                    'product_id' => $product->id,
                    'qty' => $qty,
                    'price_at_transaction' => $priceAtTransaction,
                    'subtotal' => $subtotal,
                ];
            }

            // Create Transaction Header
            $transaction = Transaction::create([
                'tenant_id' => $user->tenant_id,
                'transaction_code' => $transactionCode,
                'user_id' => $user->id,
                'transaction_date' => $transactionDate,
                'total' => $grandTotal,
            ]);

            // Save Transaction Items
            foreach ($preparedItems as $itemData) {
                $transaction->items()->create($itemData);
            }

            return $transaction->load(['items.product', 'user']);
        });
    }
}
