"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function AdminOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: api.getAdminStats });
  const { data: analytics, isLoading: analyticsLoading } = useQuery({ queryKey: ["admin-analytics"], queryFn: api.getAdminAnalytics });

  const isLoading = statsLoading || analyticsLoading;

  if (isLoading) return <div className="flex justify-center py-32"><LoadingSpinner size={40} className="text-primary" /></div>;

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back. Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {/* Subtle background glow for the metrics row */}
        <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10 rounded-full mix-blend-screen" />

        <Card className="glass-card border-white/10 hover:border-primary/30 transition-colors shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 hover:border-primary/30 transition-colors shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
            <ShoppingCart className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +4.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 hover:border-primary/30 transition-colors shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +2.4% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/10 hover:border-primary/30 transition-colors shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Products</CardTitle>
            <Package className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeProducts}</div>
            <p className="text-xs text-muted-foreground mt-1 text-orange-500">
              {stats?.lowStockAlerts} items low in stock
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 pt-6 relative z-10">
        {/* Mock Chart Area */}
        <Card className="lg:col-span-4 glass-card border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10" />
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-end justify-between gap-2 border-b border-border/50 pb-4">
              {/* Fake bars for visualization */}
              {analytics?.salesByMonth.map((month, i) => {
                const height = Math.max(10, (month.revenue / 20000) * 100);
                return (
                  <div key={month.month} className="flex-1 flex flex-col justify-end items-center gap-2 group">
                    <div className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary transition-colors relative" style={{ height: `${height}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background border border-border px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        ${month.revenue}
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase">{month.month.substring(0,3)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="lg:col-span-3 glass-card border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -z-10" />
          <CardHeader>
            <CardTitle>Top Identifying Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {analytics?.topProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold">
                  {p.salesCount}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm line-clamp-1">{p.name}</p>
                  <p className="text-xs text-muted-foreground">${p.revenue.toLocaleString()} revenue</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
