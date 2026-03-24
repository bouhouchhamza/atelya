"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Check, Heart, Plus, Minus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", params.slug],
    queryFn: () => api.getProductBySlug(params.slug),
  });

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      setIsAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }, 600);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-background"><LoadingSpinner size={48} /></div>;

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products"><Button>Return to Shop</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background pt-12 pb-24">
      <div className="container mx-auto px-4">
        <Link href="/products" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-12 group transition-colors">
          <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Collection
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* Image Section */}
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden glass-card bg-muted/20">
            <div 
              className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
              style={{ backgroundImage: `url(${product.image})` }} 
            />
            <div className="absolute inset-0 bg-cover bg-center mix-blend-normal opacity-90 transition-transform duration-1000 hover:scale-105 cursor-crosshair" style={{ backgroundImage: `url(${product.image})` }} />
            
            {product.featured && (
              <Badge variant="glass" className="absolute top-6 left-6 px-3 py-1 shadow-2xl backdrop-blur-xl">Featured</Badge>
            )}
          </div>

          {/* Content Section */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <Link href={`/products?category=${product.categoryId}`} className="text-sm font-semibold tracking-widest uppercase text-primary hover:text-primary/80 transition-colors">
                {product.categoryName}
              </Link>
              {product.stock > 0 ? (
                <span className="flex items-center text-xs font-semibold uppercase tracking-wider text-green-500">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" /> In Stock
                </span>
              ) : (
                <span className="flex items-center text-xs font-semibold uppercase tracking-wider text-destructive">
                  <span className="w-2 h-2 rounded-full bg-destructive mr-2" /> Out of Stock
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">{product.name}</h1>
            <p className="text-2xl md:text-3xl font-light text-foreground mb-8 text-glow">${product.price.toFixed(2)}</p>

            <div className="prose prose-invert border-t border-b border-border py-8 mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Key Benefits</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-center text-muted-foreground">
                    <Check className="w-4 h-4 mr-3 text-primary shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Area */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex items-center border border-border rounded-lg h-12 bg-background px-2 sm:max-w-32 justify-between">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors" disabled={product.stock === 0}>
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold px-4">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors" disabled={product.stock === 0}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button 
                size="lg" 
                className="flex-1 h-12 text-base" 
                disabled={product.stock === 0 || isAdding || added}
                onClick={handleAddToCart}
              >
                {isAdding ? <LoadingSpinner size={20} className="text-primary-foreground mr-2" /> : null}
                {added ? "Added to Cart ✓" : product.stock === 0 ? "Sold Out" : "Add to Cart"}
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 shrink-0">
                <Heart className="w-5 h-5" />
                <span className="sr-only">Add to Wishlist</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">Free shipping on orders over $150. Returns within 30 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
