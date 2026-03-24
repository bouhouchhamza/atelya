"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default function CustomerOrdersPage() {
  const { data: orders, isLoading } = useQuery({ queryKey: ["customer-orders"], queryFn: api.getCustomerOrders });

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Order History</h1>
        <p className="text-muted-foreground">Check the status of recent orders, manage returns, and discover similar products.</p>
      </div>

      <div className="flex items-center gap-4 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by order number" className="pl-9 bg-background" />
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <EmptyState title="No orders found" description="You haven't placed any orders yet." />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="bg-card/30 border-white/5 overflow-hidden">
              <div className="bg-muted/30 px-6 py-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">Order Placed</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">Total</p>
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">Ship To</p>
                    <p className="text-primary hover:underline cursor-pointer">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">Order #</p>
                    <p>{order.orderNumber}</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg capitalize">{order.status}</h3>
                      <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                        {order.status === 'delivered' ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                    
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-24 h-24 rounded-md bg-muted bg-cover bg-center shrink-0 border border-white/5" style={{ backgroundImage: `url(${item.image})` }} />
                        <div>
                          <p className="font-medium text-lg">{item.name}</p>
                          <p className="text-muted-foreground text-sm mt-1">Qty: {item.quantity}</p>
                          <p className="font-semibold mt-2">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
