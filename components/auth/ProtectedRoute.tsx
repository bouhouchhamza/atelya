"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "customer")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { role, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!allowedRoles.includes(role as "admin" | "customer")) {
      if (role === "guest") {
        // Redirect guests to the appropriate login page
        if (pathname.startsWith("/admin")) {
          router.replace("/admin/login");
        } else {
          router.replace("/login");
        }
      } else if (role === "customer") {
        // Customer trying to access admin → send to their dashboard
        router.replace("/dashboard");
      } else if (role === "admin") {
        // Admin trying to access customer area → send to admin panel
        router.replace("/admin");
      }
    }
  }, [role, isLoading, router, pathname, allowedRoles]);

  if (isLoading || !allowedRoles.includes(role as "admin" | "customer")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size={40} className="text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
