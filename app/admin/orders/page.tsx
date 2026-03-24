"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: api.getAdminOrders });

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Orders</h1>
          <p className="text-sm text-muted-foreground">View and fulfill incoming customer orders.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card/30 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Filter orders..." className="pl-9 bg-background h-9 border-white/10" />
        </div>
        <Button variant="outline" size="sm" className="h-9">Export CSV</Button>
      </div>

      <div className="bg-card/40 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-semibold">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant="glass" 
                      className={`px-2 py-0 ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' : order.status === 'processing' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-right">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center mx-auto opacity-0 group-hover:opacity-100">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </button>
                  </td>
                </tr>
              ))}
              {orders?.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
