"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CustomerWishlistPage() {
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  
  // We need to fetch both wishlist and products to match them
  const { data: wishlist, isLoading: isWishlistLoading } = useQuery({ queryKey: ["customer-wishlist"], queryFn: api.getWishlist });
  const { data: products, isLoading: isProductsLoading } = useQuery({ queryKey: ["products"], queryFn: api.getProducts });

  const handleRemove = (id: string) => {
    setRemovingIds(new Set([...removingIds, id]));
    // Fake remove transition
    setTimeout(() => {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 1000);
  };

  const isLoading = isWishlistLoading || isProductsLoading;

  if (isLoading) return <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>;

  const savedItems = wishlist?.map(w => {
    const p = products?.find(prod => prod.id === w.productId);
    return { ...w, product: p };
  }).filter(w => w.product) || [];

  return (
    <div className="space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">Keep track of the formulas you want to prioritize next.</p>
      </div>

      {savedItems.length === 0 ? (
        <EmptyState title="Your wishlist is empty" description="Discover our curated essentials and add items you love." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map((item) => {
            if (!item.product) return null;
            const isRemoving = removingIds.has(item.id);

            return (
              <Card 
                key={item.id} 
                className={`bg-card/30 border-white/5 overflow-hidden transition-all duration-300 ${isRemoving ? 'opacity-50 scale-95' : ''}`}
              >
                <div className="aspect-[4/3] bg-muted/50 bg-cover bg-center border-b border-white/5" style={{ backgroundImage: `url(${item.product.image})` }} />
                <CardContent className="p-5 flex flex-col gap-4">
                  <div>
                    <Link href={`/products/${item.product.slug}`} className="hover:underline">
                      <h3 className="font-semibold text-lg line-clamp-1">{item.product.name}</h3>
                    </Link>
                    <p className="text-primary font-bold mt-1">${item.product.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex gap-2 mt-auto pt-2">
                    <Button className="flex-1" size="sm">
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add 
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="shrink-0 text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
