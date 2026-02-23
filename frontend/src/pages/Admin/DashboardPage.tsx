import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { getAdminDashboard } from '../../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

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
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-dashboard', days],
    queryFn: () => getAdminDashboard(days),
  });

  if (isLoading) {
    return <div className="p-3 text-sm text-zinc-500">Loading analytics...</div>;
  }

  if (isError || !data) {
    return (
      <div className="p-3 text-sm text-red-500 space-y-2">
        <div>Unable to load analytics.</div>
        <button
          className="rounded-xl border border-zinc-300 px-3 py-2 text-sm"
          onClick={() => refetch()}
        >
          Retry
        </button>
      </div>
    );
  }

  const safeData = data ?? { charts: { labels: [], visits: [], orders: [], revenue: [] }, stats: {}, visitors: {}, topProducts: [] };

  const series = Array.isArray(safeData.charts.labels)
    ? safeData.charts.labels.map((date: string, index: number) => ({
        date,
        visits: safeData.charts.visits?.[index] ?? 0,
        orders: safeData.charts.orders?.[index] ?? 0,
        revenue: safeData.charts.revenue?.[index] ?? 0,
      }))
    : [];

  const topProducts = Array.isArray((data as any)?.topProducts) ? (data as any).topProducts : Array.isArray((data as any)?.top_products) ? (data as any).top_products : [];

  const formatNumber = (value?: number | string | null) => Number(value ?? 0).toLocaleString();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-zinc-500">Traffic and sales performance</p>
        </div>
        <select
          value={days}
          onChange={(event) => setDays(Number(event.target.value) as 7 | 30 | 90)}
          className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
        >
          {ranges.map((value) => (
            <option key={value} value={value}>
              Last {value}d
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Orders" value={formatNumber(data.stats?.total_orders)} />
        <StatCard label="Total Visits" value={formatNumber(data.visitors?.last_30_days)} />
        <StatCard label="Unique Visitors" value={formatNumber(data.visitors?.unique)} />
        <StatCard label="Revenue" value={`$${formatNumber(data.stats?.revenue)}`} />
      </div>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Traffic & Sales</CardTitle>
        </CardHeader>
        <CardContent className="h-[360px] min-w-0">
          <ChartSurface className="h-full w-full">
            {({ width, height }) => (
              <LineChart width={width} height={height} data={series}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
              />
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
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px] min-w-0">
          {topProducts.length === 0 ? (
            <p className="text-sm text-zinc-500">No sales data for this range.</p>
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
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-zinc-500">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}
