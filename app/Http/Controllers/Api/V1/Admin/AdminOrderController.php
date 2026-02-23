<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Requests\Api\V1\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\Api\V1\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminOrderController extends BaseApiController
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'status' => ['nullable', Rule::in(['pending', 'paid', 'shipped', 'delivered', 'cancelled'])],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
            'search' => ['nullable', 'string', 'max:255'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Order::query()
            ->with(['user:id,name,email'])
            ->latest();

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (! empty($validated['search'])) {
            $query->where('order_number', 'like', '%' . $validated['search'] . '%');
        }

        if (! empty($validated['from'])) {
            $query->whereDate('created_at', '>=', $validated['from']);
        }

        if (! empty($validated['to'])) {
            $query->whereDate('created_at', '<=', $validated['to']);
        }

        $paginator = $query
            ->paginate($validated['per_page'] ?? 12)
            ->withQueryString();

        return $this->paginated(
            $paginator,
            OrderResource::collection($paginator),
            'Orders retrieved successfully.'
        );
    }

    public function show(Order $order)
    {
        return $this->success(
            OrderResource::make($order->load(['items', 'user:id,name,email'])),
            'Order retrieved successfully.'
        );
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order)
    {
        $order->update($request->validated());

        return $this->success(
            OrderResource::make($order->load(['items', 'user:id,name,email'])),
            'Order status updated successfully.'
        );
    }
}
