"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Check, ShieldCheck, CreditCard, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ["products-for-checkout"],
    queryFn: api.getProducts,
  });

  const cartItems = products ? products.slice(0, 2) : [];
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex-1 bg-background flex items-center justify-center py-32 px-4">
        <Card className="max-w-md w-full text-center py-12 px-6 glass-card border-white/10">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Order Confirmed</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Your order #{`ORD-${Math.floor(Math.random() * 10000)}`} has been placed successfully.
          </p>
          <Link href="/dashboard/orders">
            <Button className="w-full">View Order Status</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8 animate-in">
              
              {/* Contact Info */}
              <Card className="bg-card/30 border-white/5">
                <CardHeader>
                  <CardTitle className="text-xl">1. Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input required placeholder="Alex" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input required placeholder="Mercer" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input type="email" required placeholder="alex@example.com" />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-card/30 border-white/5">
                <CardHeader>
                  <CardTitle className="text-xl">2. Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Street Address</label>
                    <Input required placeholder="123 Minimalist St" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">City</label>
                      <Input required placeholder="New York" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ZIP Code</label>
                      <Input required placeholder="10001" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card className="bg-card/30 border-white/5">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center justify-between">
                    <span>3. Payment Details</span>
                    <div className="flex gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border border-primary/50 bg-primary/5 mb-4 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="font-medium text-sm">Demo Mode Active - No real card needed</span>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card Number</label>
                    <Input placeholder="4242 4242 4242 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expiry</label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CVC</label>
                      <Input placeholder="123" />
                    </div>
                  </div>
                </CardContent>
              </Card>

            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <Card className="glass-card border-white/10 shadow-2xl">
              <CardHeader className="bg-muted/30 pb-4 border-b border-white/5">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-muted bg-cover bg-center shrink-0 border border-white/10" style={{ backgroundImage: `url(${item.image})` }} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium leading-none mb-1">{item.name}</h4>
                        <span className="text-xs text-muted-foreground">Qty: 1</span>
                      </div>
                      <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-white/5 pt-3 mt-3">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 pt-6 flex flex-col gap-4">
                <Button 
                  type="submit" 
                  form="checkout-form" 
                  size="lg" 
                  className="w-full text-base font-bold h-14"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? "Processing..." : `Pay $${total.toFixed(2)}`}
                </Button>
                <div className="flex items-center justify-center text-xs text-muted-foreground gap-2">
                  <Lock className="w-3 h-3" /> Secure 256-bit SSL encryption
                </div>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
