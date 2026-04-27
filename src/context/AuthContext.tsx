"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id:            string;
  email:         string;
  fullName:      string;
  businessName?: string;
  logoUrl?:      string;
  phone?:        string;
  address?:      string;
}

interface AuthContextValue {
  user:          AuthUser | null;
  loading:       boolean;
  /** Live avatar URL — updated immediately on upload and after DB sync */
  avatarUrl:     string;
  /** Call this when the user uploads a new photo so all components update instantly */
  setAvatarUrl:  (url: string) => void;
  login:         (email: string, password: string) => Promise<void>;
  register:      (fullName: string, email: string, password: string) => Promise<void>;
  logout:        () => Promise<void>;
  /** Re-fetch /auth/me and sync user state + avatarUrl from DB */
  refreshUser:   () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,      setUser]      = useState<AuthUser | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  // ─── Internal helper: apply a user payload from the API ───────────────────
  const applyUser = useCallback((data: AuthUser) => {
    setUser(data);
    // Only overwrite avatarUrl when the DB has a value — preserves any
    // in-session upload the user did before saving.
    if (data.logoUrl) setAvatarUrl(data.logoUrl);
  }, []);

  // ─── Initial load ─────────────────────────────────────────────────────────
  const loadUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });

      if (res.ok) {
        applyUser(await res.json());
        return;
      }

      // Access token expired — try a silent refresh
      if (res.status === 401) {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method:      "POST",
          credentials: "include",
        });
        if (refreshRes.ok) {
          const retryRes = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
          if (retryRes.ok) {
            applyUser(await retryRes.json());
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
  }, [applyUser]);

  useEffect(() => { loadUser(); }, [loadUser]);

  // ─── refreshUser — call after profile PATCH so UI reflects DB ─────────────
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
      if (res.ok) applyUser(await res.json());
    } catch { /* silent */ }
  }, [applyUser]);

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
    applyUser(data.user);
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
    applyUser(data.user);
  };

  const logout = async () => {
    // Clear local state IMMEDIATELY — the UI feels instant regardless of server speed.
    setUser(null);
    setAvatarUrl("");

    // Tell the server to clear cookies + revoke the refresh token.
    // We still await so the browser receives the Set-Cookie: delete headers
    // before the caller does router.push("/sign-in"). Without this, the
    // middleware would still see the access_token cookie and redirect back.
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method:      "POST",
        credentials: "include",
      });
    } catch {
      // Network failure — the server couldn't clear the cookies.
      // The access token expires in 15 min anyway; nothing else we can do
      // from JS since the cookies are httpOnly.
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, avatarUrl, setAvatarUrl, login, register, logout, refreshUser }}
    >
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
