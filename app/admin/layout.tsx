"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  Settings,
  LogOut,
  Bell,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";

const adminLinks = [
  { href: "/admin", icon: BarChart3, label: "Overview" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/categories", icon: Tags, label: "Categories" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/admin/customers", icon: Users, label: "Customers" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Admin login page has its OWN full-screen layout — skip the dashboard shell + guard
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen flex bg-background text-foreground">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border/50 bg-card/10 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border/50 shrink-0">
          <Link href="/" className="font-bold text-xl tracking-widest text-primary flex items-center gap-2">
            AURA <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-sm">ADMIN</span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2 mt-2">Manage Store</div>
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === "/admin" 
              ? pathname === "/admin" 
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary">{user?.name?.charAt(0) || "A"}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || "Admin User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@aura.com"}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 mt-2 text-sm font-medium w-full text-left rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/50 bg-card/10 flex items-center justify-between px-8 shrink-0">
          <div className="max-w-md w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search orders, customers, or products..." className="pl-9 bg-background/50 h-9" />
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-sm font-medium hover:text-primary transition-colors text-muted-foreground mr-2">
              View Store
            </Link>
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-accent">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </button>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
