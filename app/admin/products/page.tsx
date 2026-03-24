"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export default function AdminProductsPage() {
  const { data: products, isLoading } = useQuery({ queryKey: ["admin-products"], queryFn: api.getAdminProducts });

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your storefront inventory and catalogs.</p>
        </div>
        <Link href="/admin/products/new"><Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button></Link>
      </div>

      <div className="flex items-center gap-4 bg-card/30 p-4 rounded-xl border border-white/5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9 bg-background h-9 border-white/10" />
        </div>
        <Button variant="outline" size="sm" className="h-9">Filter</Button>
        <Button variant="outline" size="sm" className="h-9">Export</Button>
      </div>

      <div className="bg-card/40 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 text-muted-foreground text-xs uppercase font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Inventory</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products?.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-muted bg-cover bg-center shrink-0 border border-white/10" style={{ backgroundImage: `url(${product.image})` }} />
                    <span className="font-semibold">{product.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    {product.stock > 0 
                      ? <Badge variant="glass" className="bg-green-500/10 text-green-500 border-green-500/20 px-2 py-0">Active</Badge>
                      : <Badge variant="glass" className="bg-destructive/10 text-destructive border-destructive/20 px-2 py-0">Out of Stock</Badge>
                    }
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{product.stock} in stock</td>
                  <td className="px-6 py-4 text-muted-foreground">{product.categoryName}</td>
                  <td className="px-6 py-4 font-medium text-right">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-muted-foreground hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                      <button className="p-1 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                      <button className="p-1 text-muted-foreground hover:text-foreground transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {products?.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
