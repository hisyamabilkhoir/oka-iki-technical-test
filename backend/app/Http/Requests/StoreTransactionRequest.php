<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'transaction_date' => ['nullable', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => [
                'required',
                'integer',
                function (string $attribute, mixed $value, \Closure $fail) {
                    // TenantScope ensures only active products belonging to the active user's tenant can be found
                    $product = Product::find($value);
                    if (! $product) {
                        $fail("Produk ID {$value} tidak ditemukan atau bukan milik tenant Anda.");
                    }
                },
            ],
            'items.*.qty' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Daftar item transaksi wajib diisi.',
            'items.array' => 'Format item transaksi harus berupa list array.',
            'items.min' => 'Transaksi minimal harus memiliki 1 item produk.',
            'items.*.product_id.required' => 'ID Produk wajib disertakan pada setiap item.',
            'items.*.qty.required' => 'Kuantitas (qty) wajib diisi.',
            'items.*.qty.integer' => 'Kuantitas (qty) harus berupa bilangan bulat.',
            'items.*.qty.min' => 'Kuantitas (qty) minimal 1.',
        ];
    }
}
