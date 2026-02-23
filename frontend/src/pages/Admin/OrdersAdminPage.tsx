import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../lib/api/client';
import type { Order } from '../../lib/api/types';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';

const statuses: Array<Order['status']> = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function OrdersAdminPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', { page, status, search, from, to }],
    queryFn: () =>
      adminApi.orders({
        page,
        status: status || undefined,
        search: search || undefined,
        from: from || undefined,
        to: to || undefined,
      }),
  });

  const { data: selectedOrder } = useQuery({
    queryKey: ['admin-order', selectedOrderId],
    queryFn: () => adminApi.orderById(selectedOrderId as number),
    enabled: selectedOrderId !== null,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: number; nextStatus: Order['status'] }) =>
      adminApi.updateOrderStatus(id, nextStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      if (selectedOrderId) {
        queryClient.invalidateQueries({ queryKey: ['admin-order', selectedOrderId] });
      }
    },
  });

  const meta = data?.meta;

  const statusVariant = useMemo(
    () => ({
      pending: 'warning',
      paid: 'success',
      shipped: 'secondary',
      delivered: 'default',
      cancelled: 'danger',
    }),
    []
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-5">
          <Input
            placeholder="Search order number..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">All status</option>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          <Input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          <Button variant="outline" onClick={() => setPage(1)}>
            Apply
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Order</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Total</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(isLoading ? [] : data?.data ?? []).map((order) => (
                <tr key={order.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.order_number}</p>
                    <p className="text-xs text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3">{order.customer_name ?? 'Guest'}</td>
                  <td className="px-4 py-3">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[order.status] as 'default'}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrderId(order.id)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading ? <p className="p-4 text-sm text-zinc-500">Loading orders...</p> : null}
        </CardContent>
      </Card>

      {meta ? (
        <div className="flex items-center justify-between text-sm">
          <p className="text-zinc-500">
            Page {meta.current_page} of {meta.last_page}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={meta.current_page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.current_page >= meta.last_page}
              onClick={() => setPage((current) => Math.min(meta.last_page, current + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {selectedOrder ? (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg border-l border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Order {selectedOrder.order_number}</h2>
            <Button size="sm" variant="outline" onClick={() => setSelectedOrderId(null)}>
              Close
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <p>Customer: {selectedOrder.customer_name ?? 'Guest'}</p>
            <p>Total: ${selectedOrder.total.toFixed(2)}</p>
            <p>Date: {new Date(selectedOrder.created_at).toLocaleString()}</p>
          </div>
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium">Update Status</label>
            <div className="flex gap-2">
              <select
                value={selectedOrder.status}
                onChange={(event) =>
                  statusMutation.mutate({
                    id: selectedOrder.id,
                    nextStatus: event.target.value as Order['status'],
                  })
                }
                className="h-10 flex-1 rounded-xl border border-zinc-300 bg-white px-3 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              >
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-semibold">Items</h3>
            {selectedOrder.items?.map((item) => (
              <div key={item.id} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                <p className="text-sm font-medium">{item.title_snapshot}</p>
                <p className="text-xs text-zinc-500">
                  {item.qty} x ${(item.unit_price ?? item.price_snapshot).toFixed(2)} = ${item.line_total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
