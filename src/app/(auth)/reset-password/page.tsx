"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

const darkInput =
  "w-full rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-white/25 " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/50 " +
  "transition-all duration-200";

const darkInputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
};

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertTriangle size={30} className="text-red-400" />
        </div>
        <h1 className="font-display text-[28px] font-bold text-white tracking-tight mb-3">
          Invalid reset link
        </h1>
        <p className="text-[15px] text-white/50 leading-relaxed mb-8">
          This link is missing or has already been used.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-brand-400 hover:text-brand-300 transition-colors"
        >
          Request a new link →
        </Link>
      </div>
    );
  }

  if (done) {
    return (
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
          Password updated!
        </h1>
        <p className="text-[15px] text-white/50 leading-relaxed mb-8">
          Your password has been changed. All other sessions have been signed
          out for security.
        </p>
        <button
          onClick={() => router.push("/sign-in")}
          className="inline-flex items-center gap-2 text-white font-semibold text-[14px] px-6 py-3 rounded-xl transition-all duration-200"
          style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}
        >
          Sign in now →
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[12px] font-semibold text-brand-400 uppercase tracking-widest mb-2">
          Account recovery
        </p>
        <h1 className="font-display text-[32px] font-bold text-white tracking-tight leading-tight mb-2">
          Set new password
        </h1>
        <p className="text-[15px] text-white/50">
          Choose a strong password for your Billd account.
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
        {/* New password */}
        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-[13px] font-semibold text-white/50 uppercase tracking-wider"
          >
            New password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
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

        {/* Confirm password */}
        <div className="space-y-2">
          <label
            htmlFor="confirm"
            className="block text-[13px] font-semibold text-white/50 uppercase tracking-wider"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className={`${darkInput} pr-12`}
              style={{
                ...darkInputStyle,
                borderColor:
                  confirm && confirm !== password
                    ? "rgba(239,68,68,0.4)"
                    : (darkInputStyle.border as string).replace(
                        "1px solid ",
                        "",
                      ),
              }}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {confirm && confirm !== password && (
            <p className="text-[12px] text-red-400">Passwords don't match</p>
          )}
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
              <Loader2 size={16} className="animate-spin" /> Updating password…
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
