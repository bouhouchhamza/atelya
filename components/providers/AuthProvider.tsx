"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, authenticateUser, findUserById } from "@/lib/auth-data";

interface AuthContextType {
  user: AuthUser | null;
  role: "guest" | "customer" | "admin";
  isLoading: boolean;
  login: (email: string, password: string, requiredRole: "admin" | "customer") => { success: boolean; error: string | null };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "aura_session_uid";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session on mount
  useEffect(() => {
    try {
      const storedId = localStorage.getItem(SESSION_KEY);
      if (storedId) {
        const foundUser = findUserById(storedId);
        if (foundUser) {
          setUser(foundUser);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      // SSR or localStorage unavailable
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string, requiredRole: "admin" | "customer") => {
    const result = authenticateUser(email, password, requiredRole);

    if (result.user) {
      localStorage.setItem(SESSION_KEY, result.user.id);
      setUser(result.user);
      return { success: true, error: null };
    }

    return { success: false, error: result.error };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    // Navigate after state clears
    router.push("/");
  };

  const role = user?.role || "guest";

  return (
    <AuthContext.Provider value={{ user, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
