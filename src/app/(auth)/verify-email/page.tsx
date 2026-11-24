"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";

export default function VerifyEmailPage() {
  const { user, loading, refreshUser, logout } = useAuth();
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  useEffect(() => {
    const value =
      new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    if (/^[a-f0-9]{64}$/.test(value)) setToken(value);
  }, []);
  useEffect(() => {
    if (!user || user.emailVerifiedAt || done) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    async function check() {
      try {
        const result = await apiRequest<{ data: { status: string } | null }>(
          "/auth/verification-status",
        );
        if (cancelled) return;
        setDeliveryStatus(result.data?.status ?? "");
        if (
          result.data &&
          ["pending", "processing"].includes(result.data.status)
        )
          timer = setTimeout(check, 5000);
      } catch {
        if (!cancelled) setDeliveryStatus("unavailable");
      }
    }
    check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [user, done, message]);

  async function confirm() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await apiRequest("/auth/verify-email", {
        method: "POST",
        body: { token },
      });
      window.history.replaceState(null, "", "/verify-email");
      setToken("");
      setDone(true);
      setDeliveryStatus("");
      await refreshUser();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not verify your email. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await apiRequest<{ message: string }>(
        "/auth/resend-verification",
        { method: "POST" },
      );
      setMessage(result.message + " Check your inbox and spam folder.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not request another link.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold text-white">
        {done || user?.emailVerifiedAt ? "Email verified" : "Verify your email"}
      </h1>
      {loading ? (
        <p role="status" className="text-white/60">
          Checking your account…
        </p>
      ) : done || user?.emailVerifiedAt ? (
        <>
          <p className="text-white/60">
            Your email is confirmed. You can now use your dashboard.
          </p>
          <Link
            href="/dashboard"
            className="inline-block rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white"
          >
            Open dashboard
          </Link>
        </>
      ) : !user ? (
        <>
          <p className="text-white/60">
            Sign in to the account this link was sent to, then return to this
            page to confirm your email. Keep this tab open.
          </p>
          <Link
            href="/sign-in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 underline"
          >
            Sign in in a new tab
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="block text-white underline"
          >
            I have signed in — check again
          </button>
        </>
      ) : (
        <>
          <p className="text-white/60">
            Confirm <strong className="text-white">{user.email}</strong> before
            using your dashboard. Your verification link expires in 24 hours.
          </p>
          {token && (
            <button
              disabled={busy}
              onClick={confirm}
              className="w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
            >
              {busy ? "Please wait…" : "Confirm my email"}
            </button>
          )}
          <button
            disabled={busy}
            onClick={resend}
            className="text-brand-400 underline disabled:opacity-50"
          >
            Send a new verification link
          </button>
          <button
            disabled={busy}
            onClick={async () => {
              try {
                await logout();
                window.location.assign("/sign-in");
              } catch {
                setError("Could not sign out. Please try again.");
              }
            }}
            className="block text-white/60 underline"
          >
            Use a different account
          </button>
        </>
      )}
      {message && (
        <p role="status" className="text-green-400">
          {message}
        </p>
      )}
      {deliveryStatus === "failed" && (
        <p role="alert" className="text-red-400">
          We could not confirm this email was sent. Request another link or
          contact support if it keeps failing.
        </p>
      )}
      {deliveryStatus === "pending" && (
        <p role="status" className="text-white/60">
          Your verification email is queued.
        </p>
      )}
      {deliveryStatus === "accepted" && (
        <p role="status" className="text-white/60">
          Resend accepted the email. Check your inbox and spam folder.
        </p>
      )}
      {error && (
        <p role="alert" className="text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
