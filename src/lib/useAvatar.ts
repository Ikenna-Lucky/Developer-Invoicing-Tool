"use client";

import { useState, useEffect } from "react";

const LS_KEY = "billd_settings";

function readAvatarUrl(): string {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (!saved) return "";
    const parsed = JSON.parse(saved);
    return parsed.profile?.avatarUrl ?? "";
  } catch {
    return "";
  }
}

/**
 * Returns the stored avatar data-URL from localStorage.
 * Re-renders automatically when billd:avatar-updated is dispatched.
 */
export function useAvatar(): string {
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    // Sync immediately on mount (after hydration)
    setAvatarUrl(readAvatarUrl());

    const onUpdate = () => setAvatarUrl(readAvatarUrl());
    window.addEventListener("billd:avatar-updated", onUpdate);
    return () => window.removeEventListener("billd:avatar-updated", onUpdate);
  }, []);

  return avatarUrl;
}
