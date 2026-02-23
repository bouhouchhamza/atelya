<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseApiController;
use App\Models\PageView;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\CarbonPeriod;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class AdminAnalyticsController extends BaseApiController
{
    public function overview(Request $request)
    {
        $validated = $request->validate([
            'range' => ['nullable', Rule::in(['7d', '30d', '90d'])],
            'days' => ['nullable', 'integer', 'min:1', 'max:90'],
        ]);

        // Prefer explicit `days` query param, fall back to legacy `range`.
        $rangeKey = $validated['range'] ?? null;
        $days = $validated['days'] ?? ($rangeKey ? (int) str_replace('d', '', $rangeKey) : 30);
        $days = max(1, min(90, $days));

        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $dates = collect(CarbonPeriod::create($startDate, $endDate))
            ->map(fn (Carbon $date) => $date->toDateString());

        // Visits aggregation
        $visitsSeries = PageView::query()
            ->selectRaw('DATE(created_at) as date, COUNT(*) as visits')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupByRaw('DATE(created_at)')
            ->pluck('visits', 'date');

        $ordersSeries = Order::query()
            ->selectRaw('DATE(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total),0) as revenue')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupByRaw('DATE(created_at)')
            ->get()
            ->keyBy('date');

        $totalVisits = (int) PageView::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // Unique visitors: ip_hash (ip + ua-prefix); fallback to session_id when ip_hash null
        $uniqueVisitors = (int) PageView::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('ip_hash')
            ->distinct('ip_hash')
            ->count('ip_hash');

        $series = $dates
            ->map(function ($date) use ($visitsSeries, $ordersSeries) {
                $ordersRow = $ordersSeries[$date] ?? null;

                return [
                    'date' => $date,
                    'visits' => (int) ($visitsSeries[$date] ?? 0),
                    'orders' => (int) ($ordersRow->orders ?? 0),
                    'revenue' => round((float) ($ordersRow->revenue ?? 0), 2),
                ];
            })
            ->all();

        $totalOrders = (int) Order::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->count();

        $totalRevenue = (float) Order::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->sum('total');

        $topProducts = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->groupBy('order_items.product_id', 'order_items.title_snapshot')
            ->selectRaw('
                order_items.product_id as id,
                order_items.title_snapshot as name,
                SUM(order_items.qty) as qty,
                SUM(order_items.qty * COALESCE(order_items.unit_price, order_items.price_snapshot)) as revenue
            ')
            ->orderByDesc('revenue')
            ->limit(8)
            ->get()
            ->map(fn ($row) => [
                'id' => (int) $row->id,
                'name' => $row->name,
                'qty' => (int) $row->qty,
                'revenue' => round((float) $row->revenue, 2),
            ])
            ->all();

        return $this->success([
            'range' => [
                'days' => $days,
                'from' => $startDate->toDateString(),
                'to' => $endDate->toDateString(),
            ],
            'visitors' => [
                'total_visits' => $totalVisits,
                'unique_visitors' => $uniqueVisitors,
            ],
            'sales' => [
                'total_orders' => $totalOrders,
                'total_revenue' => round($totalRevenue, 2),
            ],
            'series' => $series,
            'top_products' => $topProducts,
        ], 'Analytics overview retrieved successfully.');
    }

    public function topProducts(Request $request)
    {
        $limit = (int) $request->query('limit', 8);
        $limit = max(3, min(20, $limit));

        $rows = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->selectRaw('
                products.id as id,
                products.title as name,
                SUM(order_items.qty) as qty,
                SUM(order_items.qty * order_items.price_snapshot) as revenue
            ')
            ->groupBy('products.id', 'products.title')
            ->orderByDesc('revenue')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => [
                'id' => (int) $row->id,
                'name' => $row->name,
                'qty' => (int) $row->qty,
                'revenue' => round((float) $row->revenue, 2),
            ])
            ->all();

        return $this->success($rows, 'Top products retrieved successfully.');
    }

    public function dashboard(Request $request)
    {
        $days = (int) $request->query('days', 30);
        $days = in_array($days, [7, 30, 90], true) ? $days : 30;

        $from = now()->subDays($days - 1)->startOfDay();
        $to = now()->endOfDay();

        // Stats
        $totalOrders = Order::query()->count();
        $totalProducts = DB::table('products')->count();
        $featuredProducts = DB::table('products')->where('is_featured', true)->count();
        $revenue = (float) Order::query()->sum('total');

        // Visitors
        $todayVisits = (int) PageView::query()->whereDate('created_at', now()->toDateString())->count();
        $last7Visits = (int) PageView::query()->whereBetween('created_at', [now()->subDays(6)->startOfDay(), now()->endOfDay()])->count();
        $last30Visits = (int) PageView::query()->whereBetween('created_at', [now()->subDays(29)->startOfDay(), now()->endOfDay()])->count();
        $uniqueVisitors = (int) PageView::query()->whereBetween('created_at', [$from, $to])->distinct('ip')->count('ip');

        // Series
        $labels = [];
        $ordersSeries = [];
        $revenueSeries = [];
        $visitsSeries = [];

        $ordersPerDay = Order::query()
            ->selectRaw('DATE(created_at) as d, COUNT(*) as orders, SUM(total) as revenue')
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('d')
            ->get()
            ->keyBy('d');

        $visitsPerDay = PageView::query()
            ->selectRaw('DATE(created_at) as d, COUNT(*) as visits')
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('d')
            ->pluck('visits', 'd');

        for ($i = 0; $i < $days; $i++) {
            $date = $from->copy()->addDays($i)->toDateString();
            $labels[] = $date;
            $ordersRow = $ordersPerDay[$date] ?? null;
            $ordersSeries[] = (int) ($ordersRow->orders ?? 0);
            $revenueSeries[] = round((float) ($ordersRow->revenue ?? 0), 2);
            $visitsSeries[] = (int) ($visitsPerDay[$date] ?? 0);
        }

        $topProducts = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->selectRaw('
                products.id as id,
                products.title as name,
                SUM(order_items.qty) as sales,
                SUM(order_items.qty * order_items.price_snapshot) as revenue
            ')
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
            'stats' => [
                'total_orders' => $totalOrders,
                'total_products' => $totalProducts,
                'featured_products' => $featuredProducts,
                'revenue' => round($revenue, 2),
            ],
            'visitors' => [
                'today' => $todayVisits,
                'last_7_days' => $last7Visits,
                'last_30_days' => $last30Visits,
                'unique' => $uniqueVisitors,
            ],
            'charts' => [
                'labels' => $labels,
                'orders' => $ordersSeries,
                'revenue' => $revenueSeries,
                'visits' => $visitsSeries,
            ],
            'topProducts' => $topProducts,
            'recentOrders' => $recentOrders,
        ], 'Dashboard data retrieved successfully.');
    }
}
