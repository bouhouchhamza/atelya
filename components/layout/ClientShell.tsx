"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/**
 * ClientShell conditionally renders the public Header and Footer.
 * Admin routes and login pages have their own full-screen layouts,
 * so they should NOT render the public Header/Footer.
 */
export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";

  // Admin and Login pages have their own full-screen layouts
  if (isAdminRoute || isLoginRoute) {
    return <>{children}</>;
  }

  // Public + Customer Dashboard routes get the shared Header/Footer
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}
