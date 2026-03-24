"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, MoreHorizontal } from "lucide-react";

export default function AdminCustomersPage() {
  const { data: customers, isLoading } = useQuery({ queryKey: ["admin-customers"], queryFn: api.getAdminCustomers });

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Customers</h1>
          <p className="text-sm text-muted-foreground">Manage your customer base and view histories.</p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card/30 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." className="pl-9 bg-background h-9 border-white/10" />
        </div>
      </div>

      <div className="bg-card/40 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Orders</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {customers?.map((customer) => (
                <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-semibold flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                      {customer.name.charAt(0)}
                    </div>
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{customer.email}</td>
                  <td className="px-6 py-4 font-medium">${Number(customer.totalSpent ?? 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-muted-foreground">{customer.orderCount ?? 0} orders</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-1 text-muted-foreground hover:text-foreground transition-colors mx-auto opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {customers?.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
