"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const darkInput =
  "w-full rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-white/25 " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 " +
  "transition-all duration-200";

const darkInputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link
        href="/sign-in"
        className="inline-flex items-center gap-2 text-[13px] text-white/40 hover:text-white/70 transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Back to sign in
      </Link>

      {sent ? (
        /* ── Success state ── */
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.2)",
            }}
          >
            <CheckCircle size={30} className="text-green-400" />
          </div>
          <h1 className="font-display text-[28px] font-bold text-white tracking-tight mb-3">
            Check your inbox
          </h1>
          <p className="text-[15px] text-white/50 leading-relaxed max-w-xs mx-auto mb-8">
            If an account exists for{" "}
            <span className="text-white/80 font-medium">{email}</span>, we've
            sent a password reset link. It expires in 1 hour.
          </p>
          <p className="text-[13px] text-white/30">
            Didn't receive it?{" "}
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
            >
              Try again
            </button>
          </p>
        </div>
      ) : (
        /* ── Form state ── */
        <div>
          <div className="mb-8">
            <p className="text-[12px] font-semibold text-brand-400 uppercase tracking-widest mb-2">
              Account recovery
            </p>
            <h1 className="font-display text-[32px] font-bold text-white tracking-tight leading-tight mb-2">
              Forgot your password?
            </h1>
            <p className="text-[15px] text-white/50">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {error && (
            <div
              className="mb-5 rounded-xl px-4 py-3 text-[14px] text-red-400 flex items-center gap-2"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
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
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-[13px] font-semibold text-white/50 uppercase tracking-wider"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`${darkInput} pl-12`}
                  style={darkInputStyle}
                />
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold
                         text-[15px] py-3.5 rounded-xl transition-all duration-200
                         disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                boxShadow: "0 4px 20px rgba(37,99,235,0.35)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Sending link…
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
