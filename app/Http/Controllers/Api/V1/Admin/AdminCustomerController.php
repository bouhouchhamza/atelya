<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Http\Resources\Api\V1\CustomerResource;
use App\Models\User;

class AdminCustomerController extends BaseApiController
{
    public function index()
    {
        $customers = User::query()
            ->where('role', 'customer')
            ->withCount('orders')
            ->withSum('orders as total_spent', 'total')
            ->orderByDesc('created_at')
            ->paginate(20);

        return $this->paginated(
            $customers,
            CustomerResource::collection($customers),
            'Customers retrieved successfully.'
        );
    }
}
