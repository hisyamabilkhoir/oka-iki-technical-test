<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'tenant_id' => $this->tenant_id,
            'transaction_code' => $this->transaction_code,
            'transaction_date' => $this->transaction_date?->format('Y-m-d'),
            'total' => (string) number_format((float) $this->total, 2, '.', ''),
            'creator' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name,
                'role' => is_object($this->user?->role) ? $this->user->role->value : $this->user?->role,
            ],
            'items' => TransactionItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
