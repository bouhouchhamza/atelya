import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ClientShell } from "@/components/layout/ClientShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AURA - Premium Electronics",
  description: "Built for purists. Engineered for creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ReactQueryProvider>
          <AuthProvider>
            <ClientShell>{children}</ClientShell>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
