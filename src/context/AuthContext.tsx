"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  businessName?: string;
  logoUrl?: string;
  phone?: string;
  address?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loggingOut: boolean;
  /** Live avatar URL — updated immediately on upload and after DB sync */
  avatarUrl: string;
  /** Call this when the user uploads a new photo so all components update instantly */
  setAvatarUrl: (url: string) => void;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  /** Re-fetch /auth/me and sync user state + avatarUrl from DB */
  refreshUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Session-indicator cookie helpers ─────────────────────────────────────────
// The real auth tokens (access_token, refresh_token) are httpOnly cookies set
// by the backend on onrender.com. Next.js middleware runs on the frontend domain
// (netlify.app) and cannot see those cookies. We set/clear a plain "billd_session"
// cookie here on the frontend domain so the middleware knows whether to let the
// user through to protected routes.

function setSessionCookie() {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  // 7-day lifetime — matches the refresh token so they expire together
  document.cookie = `billd_session=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`;
}

function clearSessionCookie() {
  document.cookie = "billd_session=; path=/; max-age=0";
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
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
          method: "POST",
          credentials: "include",
        });
        if (refreshRes.ok) {
          const retryRes = await fetch(`${API_URL}/auth/me`, {
            credentials: "include",
          });
          if (retryRes.ok) {
            applyUser(await retryRes.json());
            return;
          }
        }
      }

      setUser(null);
      clearSessionCookie();
    } catch {
      setUser(null);
      clearSessionCookie();
    } finally {
      setLoading(false);
    }
  }, [applyUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ─── refreshUser — call after profile PATCH so UI reflects DB ─────────────
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
      if (res.ok) applyUser(await res.json());
    } catch {
      /* silent */
    }
  }, [applyUser]);

  // ─── Auth actions ──────────────────────────────────────────────────────────

  const login = async (email: string, password: string, rememberMe = false) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Login failed");
    applyUser(data.user);
    // Session cookie lifetime matches the refresh token duration
    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `billd_session=1; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
  };

  const register = async (
    fullName: string,
    email: string,
    password: string,
  ) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Registration failed");
    applyUser(data.user);
    setSessionCookie();
  };

  const logout = async () => {
    setLoggingOut(true);
    // Clear local state immediately so the UI starts transitioning
    setUser(null);
    setAvatarUrl("");
    clearSessionCookie();

    // Tell the server to clear cookies + revoke the refresh token.
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Network failure is non-fatal — access token expires in 15 min anyway.
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loggingOut,
        avatarUrl,
        setAvatarUrl,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}

      {/* Full-screen sign-out overlay — rendered at the root so it covers
          the entire dashboard while the logout request is in-flight. */}
      {loggingOut && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4"
          style={{
            background: "rgba(6,9,20,0.92)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Spinning gradient ring */}
          <div className="relative w-14 h-14">
            <div
              className="absolute inset-0 rounded-full animate-spin"
              style={{
                background:
                  "conic-gradient(from 0deg, #2563eb, #7c3aed, #ec4899, transparent)",
                WebkitMask:
                  "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
              }}
            />
            <div
              className="absolute inset-[5px] rounded-full flex items-center justify-center"
              style={{ background: "rgba(6,9,20,0.9)" }}
            >
              <div
                className="w-5 h-5 rounded-full"
                style={{
                  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                }}
              />
            </div>
          </div>
          <p className="text-[15px] font-semibold text-white/70 tracking-wide">
            Signing out…
          </p>
        </div>
      )}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const