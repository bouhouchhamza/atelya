<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\Order;
use App\Models\Product;
use App\Models\PageView;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends BaseApiController
{
    public function index(Request $request)
    {
        $days = (int) $request->query('days', 30);
        $days = in_array($days, [7, 14, 30, 90], true) ? $days : 30;

        $from = Carbon::now()->subDays($days - 1)->startOfDay();
        $to = Carbon::now()->endOfDay();

        $revenueStatuses = ['paid', 'shipped', 'delivered'];

        $revenue = (float) Order::query()
            ->whereIn('status', $revenueStatuses)
            ->sum('total');

        $totals = [
            'orders' => (int) Order::query()->count(),
            'products' => Product::query()->count(),
            'featuredProducts' => Product::query()->where('is_featured', true)->count(),
            'revenue' => round($revenue, 2),
        ];

        $period = collect(CarbonPeriod::create($from, $to))->map(fn (Carbon $d) => $d->toDateString());

        $ordersDaily = Order::query()
            ->selectRaw('DATE(created_at) as d, COUNT(*) as total')
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('d')
            ->pluck('total', 'd');

        $revenueDaily = Order::query()
            ->selectRaw('DATE(created_at) as d, SUM(total) as total')
            ->whereIn('status', $revenueStatuses)
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('d')
            ->pluck('total', 'd');

        $visitorsDaily = PageView::query()
            ->selectRaw('DATE(created_at) as d, COUNT(*) as total')
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('d')
            ->pluck('total', 'd');

        $charts = [
            'labels' => $period->all(),
            'revenueDaily' => $period->map(fn ($d) => ['date' => $d, 'total' => round((float) ($revenueDaily[$d] ?? 0), 2)])->all(),
            'ordersDaily' => $period->map(fn ($d) => ['date' => $d, 'total' => (int) ($ordersDaily[$d] ?? 0)])->all(),
            'visitorsDaily' => $period->map(fn ($d) => ['date' => $d, 'total' => (int) ($visitorsDaily[$d] ?? 0)])->all(),
        ];

        $topProducts = DB::table('order_items')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->selectRaw('products.id, products.title as name, SUM(order_items.qty) as sales, SUM(order_items.qty * order_items.price_snapshot) as revenue')
            ->groupBy('products.id', 'products.title')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'id' => (int) $row->id,
                'name' => $row->name,
                'sales' => (int) $row->sales,
                'revenue' => round((float) $row->revenue, 2),
            ])
            ->all();

        $recentOrders = Order::query()
            ->latest()
            ->limit(8)
            ->get(['id', 'customer_name', 'total', 'status', 'created_at'])
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'customer_name' => $order->customer_name ?? 'Guest',
                'total' => (float) $order->total,
                'status' => $order->status,
                'created_at' => $order->created_at?->toDateTimeString(),
            ])
            ->all();

        return $this->success([
            'totals' => $totals,
            'charts' => $charts,
            'topProducts' => $topProducts,
            'recentOrders' => $recentOrders,
        ], 'Admin stats retrieved successfully.');
    }
}
