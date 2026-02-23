import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LineChart, Line, BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { getAdminDashboard, getDashboardSettings, updateDashboardSettings } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { fallbackPublicSettings, fallbackAdminSettings } from '../../lib/fallbacks';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';

const ranges: Array<7 | 30 | 90> = [7, 30, 90];

interface ChartSurfaceProps {
  className?: string;
  children: (size: { width: number; height: number }) => ReactNode;
}

function ChartSurface({ className, children }: ChartSurfaceProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const updateSize = () => {
      const rect = host.getBoundingClientRect();
      const width = Math.max(0, Math.floor(rect.width));
      const height = Math.max(0, Math.floor(rect.height));
      setSize((prev) => (
        prev.width === width && prev.height === height
          ? prev
          : { width, height }
      ));
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(host);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={className}>
      {size.width > 0 && size.height > 0 ? children(size) : null}
    </div>
  );
}

export default function DashboardPage() {
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const queryClient = useQueryClient();
  const [localSettings, setLocalSettings] = useState({ ...fallbackAdminSettings });

  const dashboardQuery = useQuery({
    queryKey: ['admin-dashboard', days],
    queryFn: () => getAdminDashboard(days),
  });

  const settingsQuery = useQuery({
    queryKey: ['admin-dashboard-settings'],
    queryFn: getDashboardSettings,
  });

  useEffect(() => {
    if (settingsQuery.data) {
      setLocalSettings(settingsQuery.data);
    } else if (settingsQuery.isError) {
      setLocalSettings({ ...fallbackAdminSettings });
    }
  }, [settingsQuery.data, settingsQuery.isError]);

  const updateSettings = useMutation({
    mutationFn: updateDashboardSettings,
    onSuccess: (data) => {
      const merged = data ?? fallbackPublicSettings;
      setLocalSettings(merged);
      queryClient.setQueryData(['admin-dashboard-settings'], merged);
    },
  });

  if (dashboardQuery.isLoading) {
    return <div className="p-3 text-sm text-primary-500">Loading analytics...</div>;
  }

  if (dashboardQuery.isError || !dashboardQuery.data) {
    return (
      <div className="p-3 text-sm text-red-500 space-y-2">
        <div>Unable to load analytics.</div>
        <Button size="sm" variant="outline" onClick={() => dashboardQuery.refetch()}>Retry</Button>
      </div>
    );
  }

  const data = dashboardQuery.data ?? { stats: {}, charts: {}, topProducts: [], recentOrders: [] };
  const labels = Array.isArray(data.charts?.labels) ? data.charts.labels : [];
  const visitsArr = Array.isArray(data.charts?.visits) ? data.charts.visits : [];
  const ordersArr = Array.isArray(data.charts?.orders) ? data.charts.orders : [];
  const revenueArr = Array.isArray(data.charts?.revenue) ? data.charts.revenue : [];
  const series = labels.map((date: string, index: number) => ({
    date,
    visits: visitsArr[index] ?? 0,
    orders: ordersArr[index] ?? 0,
    revenue: revenueArr[index] ?? 0,
  }));

  const topProducts = Array.isArray(data.topProducts) ? data.topProducts : [];
  const recentOrders = Array.isArray(data.recentOrders) ? data.recentOrders : [];

  const formatNumber = (value?: number | string | null) => Number(value ?? 0).toLocaleString();
  const formatCurrency = (value?: number | string | null) => `$${Number(value ?? 0).toLocaleString()}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900 dark:text-primary-100">Dashboard</h1>
          <p className="text-sm text-primary-600 dark:text-primary-400">Store overview at a glance</p>
        </div>
        <div className="flex items-center gap-2">
          {ranges.map((value) => (
            <Button
              key={value}
              size="sm"
              variant={days === value ? 'default' : 'outline'}
              onClick={() => setDays(value)}
            >
              Last {value}d
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Orders" value={formatNumber(data.stats?.total_orders)} />
        <StatCard label="Total Products" value={formatNumber(data.stats?.total_products)} />
        <StatCard label="Featured Products" value={formatNumber(data.stats?.featured_products)} />
        <StatCard label="Revenue" value={formatCurrency(data.stats?.revenue)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Traffic &amp; Sales</CardTitle>
          </CardHeader>
          <CardContent className="h-[360px] min-w-0">
            <ChartSurface className="h-full w-full">
              {({ width, height }) => (
                <LineChart width={width} height={height} data={series}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} allowDecimals={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="visits" stroke="#2563eb" strokeWidth={2} dot={false} name="Visits" />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#16a34a" strokeWidth={2} dot={false} name="Orders" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={false} name="Revenue" />
                </LineChart>
              )}
            </ChartSurface>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Quick Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {settingsQuery.isLoading ? (
              <p className="text-primary-500">Loading settings...</p>
            ) : (
              <>
                <div className="grid gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-primary-500">Store Name</p>
                    <Input
                      value={localSettings.store_name}
                      onChange={(e) => setLocalSettings({ ...localSettings, store_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-primary-500">Primary Color</p>
                    <Input
                      type="color"
                      value={localSettings.primary_color}
                      onChange={(e) => setLocalSettings({ ...localSettings, primary_color: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-primary-500">Currency</p>
                    <select
                      className="h-10 w-full rounded-xl border border-primary-200 bg-white px-3 text-sm dark:bg-dark-900"
                      value={localSettings.currency}
                      onChange={(e) => setLocalSettings({ ...localSettings, currency: e.target.value })}
                    >
                      {['MAD', 'USD', 'EUR'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-primary-500">Contact Email</p>
                    <Input
                      type="email"
                      value={localSettings.contact_email ?? ''}
                      onChange={(e) => setLocalSettings({ ...localSettings, contact_email: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                    <span>Maintenance</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={localSettings.maintenance_mode ? 'warning' : 'default'}>
                        {localSettings.maintenance_mode ? 'ON' : 'OFF'}
                      </Badge>
                      <Switch
                        checked={!!localSettings.maintenance_mode}
                        onCheckedChange={(v) => setLocalSettings({ ...localSettings, maintenance_mode: v })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="default"
                    disabled={updateSettings.isPending}
                    onClick={() => updateSettings.mutate(localSettings)}
                  >
                    {updateSettings.isPending ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setLocalSettings(settingsQuery.data ?? fallbackPublicSettings)}
                  >
                    Reset
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Orders per Day</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px] min-w-0">
            <ChartSurface className="h-full w-full">
              {({ width, height }) => (
                <BarChart width={width} height={height} data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="#2563eb" radius={[6, 6, 0, 0]} name="Orders" />
                </BarChart>
              )}
            </ChartSurface>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px] min-w-0">
            {topProducts.length === 0 ? (
              <p className="text-sm text-primary-500">No sales data for this range.</p>
            ) : (
              <ChartSurface className="h-full w-full">
                {({ width, height }) => (
                  <BarChart width={width} height={height} data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} name="Revenue" />
                  <Bar dataKey="sales" fill="#16a34a" radius={[6, 6, 0, 0]} name="Units" />
                  </BarChart>
                )}
              </ChartSurface>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-primary-200 bg-primary-50 dark:border-dark-700 dark:bg-dark-800">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Customer</th>
                <th className="px-3 py-2 text-left font-medium">Total</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-primary-100 dark:border-dark-700">
                  <td className="px-3 py-2">{order.customer_name}</td>
                  <td className="px-3 py-2">${Number(order.total ?? 0).toFixed(2)}</td>
                  <td className="px-3 py-2">
                    <Badge variant="secondary">{order.status}</Badge>
                  </td>
                  <td className="px-3 py-2">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-primary-200 bg-white p-5 shadow-sm dark:border-dark-700 dark:bg-dark-900">
      <p className="text-sm text-primary-600 dark:text-primary-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-primary-900 dark:text-primary-100">{value}</p>
    </div>
  );
}
