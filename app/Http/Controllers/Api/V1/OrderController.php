<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Api\V1\StoreOrderRequest;
use App\Http\Resources\Api\V1\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderController extends BaseApiController
{
    public function store(StoreOrderRequest $request)
    {
        $payload = $request->validated();
        $productIds = collect($payload['items'])->pluck('product_id')->unique()->all();
        $products = Product::query()
            ->whereIn('id', $productIds)
            ->where('status', 'active')
            ->get()
            ->keyBy('id');

        $shipping = (float) ($payload['shipping'] ?? 0);
        $tax = (float) ($payload['tax'] ?? 0);

        $order = DB::transaction(function () use ($payload, $products, $request, $shipping, $tax) {
            $subtotal = 0.0;

            foreach ($payload['items'] as $item) {
                $product = $products->get($item['product_id']);
                if (! $product) {
                    abort(422, 'Some items are unavailable.');
                }

                $subtotal += ((float) $product->price) * $item['qty'];
            }

            $order = Order::query()->create([
                'order_number' => 'AT-' . str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT),
                'user_id' => $request->user()?->id,
                'status' => 'pending',
                'subtotal' => round($subtotal, 2),
                'shipping' => round($shipping, 2),
                'tax' => round($tax, 2),
                'total' => round($subtotal + $shipping + $tax, 2),
                'currency' => strtoupper($payload['currency'] ?? 'USD'),
            ]);

            foreach ($payload['items'] as $item) {
                $product = $products->get($item['product_id']);

                OrderItem::query()->create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'title_snapshot' => $product->title,
                    'price_snapshot' => $product->price,
                    'qty' => $item['qty'],
                ]);
            }

            return $order->load(['items', 'user']);
        });

        return $this->success(
            OrderResource::make($order),
            'Order created successfully.',
            201
        );
    }
}
