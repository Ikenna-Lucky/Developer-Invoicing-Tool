"use client";

import { useAuth } from "@/context/AuthContext";

/**
 * Returns the current user's avatar URL.
 *
 * The value lives in AuthContext so every component that calls this hook
 * re-renders automatically whenever the avatar changes — whether the update
 * came from an upload, a DB sync, or a login.
 *
 * No localStorage polling, no custom events, no timing issues.
 */
export function useAvatar(): string {
  const { avatarUrl } = useAuth();
  return avatarUrl;
}
