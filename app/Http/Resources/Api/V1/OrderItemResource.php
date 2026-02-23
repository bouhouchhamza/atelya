<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\OrderItem */
class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'title_snapshot' => $this->title_snapshot,
            'price_snapshot' => (float) $this->price_snapshot,
            'unit_price' => (float) ($this->unit_price ?? $this->price_snapshot),
            'qty' => $this->qty,
            'line_total' => round((float) ($this->unit_price ?? $this->price_snapshot) * $this->qty, 2),
        ];
    }
}
