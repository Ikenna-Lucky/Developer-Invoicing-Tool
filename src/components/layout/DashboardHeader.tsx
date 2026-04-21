"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, LogOut, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAvatar } from "@/lib/useAvatar";
import Link from "next/link";

// ─── Avatar bubble — shared between trigger button and dropdown ────────────────

function AvatarBubble({
  avatarUrl,
  initials,
  size,
}: {
  avatarUrl: string;
  initials: string;
  size: number;
}) {
  return (
    <div
      className="rounded-full overflow-hidden shrink-0 flex items-center justify-center font-bold text-white"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #2563eb, #7c3aed)",
        fontSize: size * 0.35,
        boxShadow: avatarUrl ? "none" : `0 0 0 2px rgba(124,58,237,0.4)`,
      }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          className="w-full h-full object-cover"
          /* key forces re-mount when URL changes so the image actually refreshes */
          key={avatarUrl.slice(-16)}
        />
      ) : (
        initials
      )}
    </div>
  );
}

// ─── ⌘K search trigger ────────────────────────────────────────────────────────

function SearchTrigger() {
  const trigger = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
    );
  };

  return (
    <button
      onClick={trigger}
      className="flex items-center gap-3 h-10 px-5 rounded-xl transition-all duration-150 group flex-1"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.09)",
        maxWidth: 520,
      }}
    >
      <Search
        size={15}
        className="text-white/30 group-hover:text-white/55 transition-colors shrink-0"
      />
      <span className="flex-1 text-left text-[14px] text-white/25 group-hover:text-white/45 transition-colors">
        Search invoices, clients, actions…
      </span>
      <kbd
        className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-semibold text-white/20 shrink-0"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <span style={{ fontFamily: "system-ui" }}>⌘</span>K
      </kbd>
    </button>
  );
}

// ─── Profile dropdown ──────────────────────────────────────────────────────────

function ProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const avatarUrl = useAvatar();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/sign-in");
  };

  return (
    <div ref={ref} className="relative shrink-0">
      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 h-10 pl-2.5 pr-4 rounded-xl transition-all duration-150"
        style={{
          background: open
            ? "rgba(255,255,255,0.09)"
            : "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        <AvatarBubble avatarUrl={avatarUrl} initials={initials} size={32} />

        <div className="flex flex-col items-start min-w-0">
          <span className="text-[13px] font-semibold text-white/90 leading-tight truncate max-w-[130px]">
            {user?.fullName ?? "Account"}
          </span>
          <span className="text-[11px] text-white/30 leading-tight truncate max-w-[130px]">
            {user?.email ?? ""}
          </span>
        </div>

        <ChevronDown
          size={14}
          className="text-white/30 transition-transform duration-200 ml-1 shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="absolute right-0 top-15 w-xs rounded-2xl overflow-hidden z-50"
          style={{
            background: "#0e1420",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow:
              "0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Identity block */}
          <div
            className="p-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-4">
              <AvatarBubble
                avatarUrl={avatarUrl}
                initials={initials}
                size={52}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-white truncate">
                  {user?.fullName}
                </p>
                <p
                  className="text-[12px] truncate mt-0.5"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors"
              style={{ color: "rgba(255,255,255,0.65)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <Settings size={14} className="text-white/30 shrink-0" />
              Profile &amp; Settings
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors text-left mt-0.5"
              style={{ color: "rgba(248,113,113,0.85)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(239,68,68,0.08)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <LogOut size={14} className="shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main header ───────────────────────────────────────────────────────────────

export function DashboardHeader() {
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-10 h-[68px]"
      style={{
        background: "rgba(13,17,23,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <SearchTrigger />
      <ProfileMenu />
    </header>
  );
}
