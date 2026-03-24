"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export function Header() {
  const { role } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Mobile Menu */}
        <button className="md:hidden p-2 text-muted-foreground">
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-widest text-foreground">AURA</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-8 text-sm font-medium">
          <Link href="/products" className="text-muted-foreground transition-colors hover:text-foreground">
            Shop
          </Link>
          <Link href="/categories" className="text-muted-foreground transition-colors hover:text-foreground">
            Collections
          </Link>
          <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
            Story
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            <Search className="h-5 w-5" />
          </button>
          
          {role === "guest" && (
            <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
              <LogIn className="h-5 w-5" />
            </Link>
          )}
          {role === "customer" && (
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              <User className="h-5 w-5" />
            </Link>
          )}
          {role === "admin" && (
            <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              <ShieldCheck className="h-5 w-5" />
            </Link>
          )}

          <Link href="/checkout" className="text-muted-foreground hover:text-foreground transition-colors group relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
