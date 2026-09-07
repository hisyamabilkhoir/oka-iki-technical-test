<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_name' => $this->product?->name ?? 'Produk Dihapus',
            'qty' => $this->qty,
            'price_at_transaction' => (string) number_format((float) $this->price_at_transaction, 2, '.', ''),
            'subtotal' => (string) number_format((float) $this->subtotal, 2, '.', ''),
        ];
    }
}
