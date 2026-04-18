"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id:           string;
  email:        string;
  fullName:     string;
  businessName?: string;
  logoUrl?:     string;
}

interface AuthContextValue {
  user:     AuthUser | null;
  loading:  boolean;
  login:    (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout:   () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true); // true until we know auth state

  // On mount — try to fetch the current user from /auth/me
  // If the access_token cookie is valid, this succeeds silently.
  // If expired, we attempt a token refresh first.
  const loadUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return;
      }

      // Access token expired — try refreshing
      if (res.status === 401) {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (refreshRes.ok) {
          // Retry /me with the new access token
          const retryRes = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
          if (retryRes.ok) {
            setUser(await retryRes.json());
            return;
          }
        }
      }

      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ─── Auth actions ──────────────────────────────────────────────────────────

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method:      "POST",
      credentials: "include",
      headers:     { "Content-Type": "application/json" },
      body:        JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error ?? "Login failed");

    setUser(data.user);
  };

  const register = async (fullName: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method:      "POST",
      credentials: "include",
      headers:     { "Content-Type": "application/json" },
      body:        JSON.stringify({ fullName, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error ?? "Registration failed");

    setUser(data.user);
  };

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method:      "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
