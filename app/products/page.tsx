"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Filter } from "lucide-react";

function ProductsGrid() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", categoryFilter],
    queryFn: () => categoryFilter ? api.getProducts().then(res => res.filter(p => p.categoryId === categoryFilter)) : api.getProducts(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: api.getCategories,
  });

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row gap-12">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 mb-6 text-foreground font-semibold pb-4 border-b border-border">
            <Filter className="w-4 h-4" /> Filters
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/products" className={`block hover:text-primary transition-colors ${!categoryFilter ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    All Products
                  </Link>
                </li>
                {categories?.map((c) => (
                  <li key={c.id}>
                    <Link href={`/products?category=${c.id}`} className={`block hover:text-primary transition-colors ${categoryFilter === c.id ? "text-primary font-medium" : "text-muted-foreground"}`}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Grid */}
      <div className="flex-1">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">The Collection</h1>
          <span className="text-sm text-muted-foreground">{products?.length || 0} Results</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32"><LoadingSpinner size={32} className="text-primary" /></div>
        ) : !products || products.length === 0 ? (
          <EmptyState title="No products found" description="Try removing some filters to see more results." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id} className="group flex h-full">
                <Card className="flex flex-col w-full overflow-hidden border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1">
                  <div className="aspect-square relative overflow-hidden bg-muted/50">
                    {product.stock === 0 && (
                      <div className="absolute top-4 left-4 z-20 bg-destructive/80 text-white backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Out of Stock</div>
                    )}
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${product.image})` }} />
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 mt-auto">{product.categoryName}</p>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold leading-tight">{product.name}</h3>
                      <span className="text-md font-medium text-foreground/90 ml-2">${product.price}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="flex-1 bg-background min-h-screen">
      <Suspense fallback={<div className="flex justify-center py-32"><LoadingSpinner size={32} /></div>}>
        <ProductsGrid />
      </Suspense>
    </div>
  );
}
