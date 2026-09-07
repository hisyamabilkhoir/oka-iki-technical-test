<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => is_object($this->role) ? $this->role->value : $this->role,
            'tenant' => [
                'id' => $this->tenant_id,
                'name' => $this->tenant?->name,
            ],
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
