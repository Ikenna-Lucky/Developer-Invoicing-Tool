"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const darkInput =
  "w-full rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-white/25 " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 " +
  "transition-all duration-200";

const darkInputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
};

const darkInputFocusStyle = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(59,130,246,0.5)",
};

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <p className="text-[12px] font-semibold text-brand-400 uppercase tracking-widest mb-2">
          Welcome back
        </p>
        <h1 className="font-display text-[32px] font-bold text-white tracking-tight leading-tight mb-2">
          Sign in to Billd
        </h1>
        <p className="text-[15px] text-white/50">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            Create one free →
          </Link>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="mb-5 rounded-xl px-4 py-3 text-[14px] text-red-400 flex items-center gap-2"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}
        >
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            style={{ background: "rgba(239,68,68,0.2)", color: "#f87171" }}
          >
            !
          </span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-[13px] font-semibold text-white/50 uppercase tracking-wider"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={darkInput}
            style={darkInputStyle}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-[13px] font-semibold text-white/50 uppercase tracking-wider"
            >
              Password
            </label>
            <a
              href="#"
              className="text-[13px] text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${darkInput} pr-12`}
              style={darkInputStyle}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-white font-semibold
                     text-[15px] py-3.5 rounded-xl mt-1 transition-all duration-200
                     disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", boxShadow: "0 4px 20px rgba(37,99,235,0.35)" }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        <span className="text-[12px] text-white/30 font-medium">or continue with</span>
        <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
      </div>

      {/* Social placeholder — Google */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2.5 rounded-xl
                   py-3.5 text-[14px] font-medium text-white/60 hover:text-white/80
                   transition-all duration-200"
        style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
      >
        <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>
    </div>
  );
}
