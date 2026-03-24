"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Package, MapPin, Heart, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DashboardOverviewPage() {
  const { data: profile } = useQuery({ queryKey: ["customer-profile"], queryFn: api.getCustomerProfile });
  const { data: orders, isLoading } = useQuery({ queryKey: ["customer-orders"], queryFn: api.getCustomerOrders });

  const recentOrders = orders?.slice(0, 3) || [];

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground">Manage your orders, profile, and preferences from one central hub.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10 rounded-full mix-blend-screen" />

        <Card className="glass-card border-white/10 hover:border-primary/20 transition-all hover:-translate-y-1 shadow-lg">
          <CardContent className="p-6 flex flex-col justify-center">
            <Package className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-2xl font-bold">{orders?.length || 0}</h3>
            <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/10 hover:border-rose-500/20 transition-all hover:-translate-y-1 shadow-lg">
          <CardContent className="p-6 flex flex-col justify-center">
            <Heart className="w-8 h-8 text-rose-500 mb-4" />
            <h3 className="text-2xl font-bold">1</h3>
            <p className="text-sm font-medium text-muted-foreground">Saved Items</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 hover:border-blue-500/20 transition-all hover:-translate-y-1 shadow-lg">
          <CardContent className="p-6 flex flex-col justify-center">
            <MapPin className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-2xl font-bold">1</h3>
            <p className="text-sm font-medium text-muted-foreground">Saved Addresses</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 hover:border-orange-500/20 transition-all hover:-translate-y-1 shadow-lg">
          <CardContent className="p-6 flex flex-col justify-center">
            <Clock className="w-8 h-8 text-orange-500 mb-4" />
            <h3 className="text-2xl font-bold">1</h3>
            <p className="text-sm font-medium text-muted-foreground">Processing Order</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 relative z-10">
        <Card className="glass-card border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 mix-blend-screen" />
          <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Orders</CardTitle>
            <Link href="/dashboard/orders" className="text-sm text-primary hover:underline">View All</Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrders.length > 0 ? (
              <ul className="divide-y divide-border/50">
                {recentOrders.map((order) => (
                  <li key={order.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">${order.total}</p>
                      <p className={`text-xs capitalize mt-1 ${order.status === 'delivered' ? 'text-green-500' : 'text-orange-500'}`}>
                        {order.status}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">No recent orders found.</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -z-10 mix-blend-screen" />
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-lg">Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Name</p>
              <p className="font-medium">{profile?.name || "Loading..."}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
              <p className="font-medium">{profile?.email || "Loading..."}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
              <p className="font-medium">{profile?.phone || "Loading..."}</p>
            </div>
            <Link href="/dashboard/profile" className="inline-block mt-4">
              <Button size="sm" variant="outline">Edit Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
