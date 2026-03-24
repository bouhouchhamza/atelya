"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerLoginPage() {
  const { login, role, isLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in as customer, redirect to dashboard
  useEffect(() => {
    if (!isLoading && role === "customer") {
      router.replace("/dashboard");
    } else if (!isLoading && role === "admin") {
      router.replace("/admin");
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
    // Simulate network delay for realism
    setTimeout(() => {
      const result = login(email, password, "customer");
      setIsSubmitting(false);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed.");
      }
    }, 600);
  };

  if (isLoading || role !== "guest") return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      
      {/* Premium Background */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] -z-10 mix-blend-screen opacity-50 animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10 mix-blend-screen opacity-40" />
      
      <div className="w-full max-w-md animate-in relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-glow">AURA</h1>
          <p className="text-muted-foreground tracking-widest text-sm uppercase">Customer Portal</p>
        </div>

        <Card className="glass-card border-white/10 shadow-2xl bg-card/40 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your account to continue shopping.</p>
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
                    placeholder="alex@example.com"
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
                {isSubmitting ? <><LoadingSpinner size={18} className="text-primary-foreground" /> Signing in...</> : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-muted-foreground text-center mb-3">Demo Credentials</p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => { setEmail("alex@example.com"); setPassword("customer123"); }}
                  className="text-xs text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-muted-foreground"
                >
                  <span className="font-medium text-foreground">Alex Mercer</span> — alex@example.com
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail("jordan@example.com"); setPassword("customer123"); }}
                  className="text-xs text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-muted-foreground"
                >
                  <span className="font-medium text-foreground">Jordan Rivera</span> — jordan@example.com
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Are you an administrator? <a href="/admin/login" className="text-primary hover:underline font-medium">Sign in here</a>
        </p>
      </div>
    </div>
  );
}
