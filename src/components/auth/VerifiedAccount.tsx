"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function VerifiedAccount({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) router.replace("/sign-in");
    else if (!loading && !user?.emailVerifiedAt)
      router.replace("/verify-email");
  }, [user, loading, router]);
  if (loading || !user?.emailVerifiedAt)
    return (
      <p className="p-8 text-white/60" role="status">
        Checking your account…
      </p>
    );
  return children;
}
