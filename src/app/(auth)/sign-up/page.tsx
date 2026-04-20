"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strengthLevel = (pw: string) => {
    if (!pw) return 0;
    if (pw.length < 6) return 1;
    if (pw.length < 8) return 2;
    return /[A-Z]/.test(pw) && /[0-9]/.test(pw) ? 4 : 3;
  };

  const strength = strengthLevel(password);
  const strengthLabel = ["", "Too short", "Weak", "Fair", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await register(fullName, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full rounded-xl border border-gray-200 px-4 py-3.5 text-sm text-gray-900
    placeholder:text-gray-300 bg-gray-50/80
    focus:outline-none focus:bg-white focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10
    transition-all duration-200`;

  return (
    <div>
      {/* Heading */}
      <div className="mb-7">
        <p className="text-[11px] font-semibold text-brand-600 uppercase tracking-widest mb-2">
          Get started
        </p>
        <h1 className="font-display text-[30px] font-bold text-gray-900 tracking-tight leading-tight mb-2">
          Create your account
        </h1>
        <p className="text-sm text-gray-400">
          Already have one?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            Sign in →
          </Link>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0 text-xs font-bold">
            !
          </span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full name */}
        <div className="space-y-1.5">
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ikenna Obi"
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider"
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
            className={inputClass}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-400 font-medium w-14 text-right">
                {strengthLabel}
              </span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirm"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wider"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm"
              type={showCf ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowCf((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
            >
              {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800
                     text-white font-semibold text-sm py-3.5 rounded-xl mt-1
                     transition-all duration-200 shadow-lg shadow-gray-900/20
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Creating account...
            </>
          ) : (
            "Create free account"
          )}
        </button>

        <p className="text-[11px] text-center text-gray-400">
          By signing up you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-gray-600 transition-colors"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-2 hover:text-gray-600 transition-colors"
          >
            Privacy Policy
          </a>
          .
        </p>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[11px] text-gray-300 font-medium">
          or continue with
        </span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Google */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl
                   py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300
                   transition-all duration-200"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      <p className="mt-5 text-center text-[11px] text-gray-300">
        Protected by 256-bit SSL encryption
      </p>
    </div>
  );
}
