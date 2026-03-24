"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  User,
  MapPin,
  Heart,
  Settings,
  LogOut,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/components/providers/AuthProvider";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/orders", icon: Package, label: "Orders" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
  { href: "/dashboard/addresses", icon: MapPin, label: "Addresses" },
  { href: "/dashboard/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <div className="flex min-h-screen bg-background text-foreground container mx-auto py-12 px-4 md:px-6">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0">
              <nav className="flex flex-col space-y-1 sticky top-24">
                <div className="px-3 pb-4 mb-4 border-b border-border">
                  <h2 className="text-xl font-bold">My Account</h2>
                  <p className="text-sm text-muted-foreground mt-1">Welcome back, {user?.name || "Guest"}</p>
                </div>

                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = link.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                      {link.label}
                    </Link>
                  );
                })}

                <div className="mt-8 pt-4 border-t border-border">
                  <nav className="space-y-1">
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </nav>
                </div>
              </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 bg-card/10 border border-white/5 rounded-2xl p-6 lg:p-10 shadow-sm min-h-[600px]">
              <main className="flex-1">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
