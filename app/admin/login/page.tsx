"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Mail, Lock, AlertCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const { login, role, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in as admin, redirect to admin panel
  useEffect(() => {
    if (!isLoading && role === "admin") {
      router.replace("/admin");
    } else if (!isLoading && role === "customer") {
      router.replace("/dashboard");
    }
  }, [role, isLoading, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = login(email, password, "admin");
      setIsSubmitting(false);

      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.error || "Login failed.");
      }
    }, 600);
  };

  if (isLoading || role !== "guest") return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      
      {/* Dark Professional Background */}
      <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen opacity-30" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] -z-10 mix-blend-screen opacity-20" />
      
      <div className="w-full max-w-md animate-in relative z-10">
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">AURA <span className="text-primary">Admin</span></h1>
          <p className="text-muted-foreground tracking-wide text-sm">Backend Management Console</p>
        </div>

        <Card className="bg-card/40 border-white/10 shadow-2xl backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Admin Sign In</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Enter your admin credentials to continue.</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@aura.com"
                    className="pl-10 bg-background/50 border-white/10 h-12"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 bg-background/50 border-white/10 h-12"
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-base font-bold" disabled={isSubmitting}>
                {isSubmitting ? <><LoadingSpinner size={18} className="text-primary-foreground" /> Authenticating...</> : "Sign In to Admin"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-muted-foreground text-center mb-3">Demo Admin Credentials</p>
              <button
                type="button"
                onClick={() => { setEmail("admin@aura.com"); setPassword("admin123"); }}
                className="w-full text-xs text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-muted-foreground"
              >
                <span className="font-medium text-foreground">Sarah Chen</span> — admin@aura.com / admin123
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Looking for the customer portal? <a href="/login" className="text-primary hover:underline font-medium">Sign in here</a>
        </p>
      </div>
    </div>
  );
}
