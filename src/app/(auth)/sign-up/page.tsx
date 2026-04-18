"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPage() {
  const { register } = useAuth();
  const router       = useRouter();

  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [showCf,   setShowCf]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const strengthLevel = (pw: string) => {
    if (!pw) return 0;
    if (pw.length < 6) return 1;
    if (pw.length < 8) return 2;
    return /[A-Z]/.test(pw) && /[0-9]/.test(pw) ? 4 : 3;
  };

  const strength      = strengthLevel(password);
  const strengthLabel = ["", "Too short", "Weak", "Fair", "Strong"][strength];
  const strengthColor = ["", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 8)  { setError("Password must be at least 8 characters"); return; }
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
    placeholder:text-gray-300 bg-gray-50
    focus:outline-none focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/8
    transition-all duration-200`;

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display text-[28px] font-bold text-gray-900 tracking-tight leading-tight mb-2">
          Create your account
        </h1>
        <p className="text-sm text-gray-400">Free forever. No credit card required.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Full name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
          <label htmlFor="email" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
          <label htmlFor="password" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
            <button type="button" tabIndex={-1} onClick={() => setShowPw(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-gray-200"}`} />
                ))}
              </div>
              <span className="text-[10px] text-gray-400 font-medium w-14 text-right">{strengthLabel}</span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label htmlFor="confirm" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
            <button type="button" tabIndex={-1} onClick={() => setShowCf(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
              {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700
                     text-white font-semibold text-sm py-3.5 rounded-xl mt-2
                     transition-all duration-200 shadow-lg shadow-brand-500/25
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? <><Loader2 size={15} className="animate-spin" /> Creating account...</>
            : "Create free account →"}
        </button>

        <p className="text-xs text-center text-gray-300">
          By signing up you agree to our{" "}
          <a href="#" className="underline underline-offset-2 hover:text-gray-500">Terms</a> and{" "}
          <a href="#" className="underline underline-offset-2 hover:text-gray-500">Privacy Policy</a>.
        </p>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-300">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-brand-600 hover:text-brand-700 transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
