import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../lib/api/client';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';

export default function CustomersAdminPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', page],
    queryFn: () => adminApi.customers(page),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Orders</th>
                <th className="px-4 py-3 text-left font-medium">Total Spent</th>
                <th className="px-4 py-3 text-left font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {(isLoading ? [] : data?.data ?? []).map((customer) => (
                <tr key={customer.id} className="border-b border-zinc-100 dark:border-zinc-800">
                  <td className="px-4 py-3">{customer.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{customer.email}</td>
                  <td className="px-4 py-3">{customer.orders_count}</td>
                  <td className="px-4 py-3">${customer.total_spent.toFixed(2)}</td>
                  <td className="px-4 py-3">{new Date(customer.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading ? <p className="p-4 text-sm text-zinc-500">Loading customers...</p> : null}
        </CardContent>
      </Card>

      {data?.meta ? (
        <div className="flex items-center justify-between text-sm">
          <p className="text-zinc-500">
            Page {data.meta.current_page} of {data.meta.last_page}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={data.meta.current_page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.meta.current_page >= data.meta.last_page}
              onClick={() => setPage((current) => Math.min(data.meta.last_page, current + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
