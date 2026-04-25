"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { BilldLogo } from "@/components/ui/BilldLogo";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useAvatar } from "@/lib/useAvatar";
import { useSidebar } from "@/context/SidebarContext";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/clients", icon: Users, label: "Clients" },
  { href: "/invoices", icon: FileText, label: "Invoices" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const avatarUrl = useAvatar();
  const { isOpen, close } = useSidebar();
  const [signingOut, setSigningOut] = useState(false);

  // Auto-close on route change (mobile)
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Escape key closes sidebar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
    }
    router.push("/sign-in");
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        aria-hidden="true"
        onClick={close}
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          background: "rgba(3,6,15,0.75)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 flex flex-col z-50",
          // Smooth slide transition
          "transition-transform duration-[320ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
          // Desktop: always visible — lg: overrides mobile class because it's a responsive variant
          "lg:translate-x-0",
          // Mobile: slide in when open, hide offscreen when closed
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ background: "#0a0f1e" }}
      >
        {/* Subtle right border */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-white/[0.07]" />

        {/* Gradient accent strip on the left edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{
            background:
              "linear-gradient(180deg, #2563eb 0%, #7c3aed 55%, #ec4899 100%)",
            opacity: 0.7,
          }}
        />

        {/* Logo */}
        <div className="h-[70px] flex items-center px-6 shrink-0">
          <BilldLogo href="/dashboard" size="sm" />
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/[0.07]" />

        {/* Nav label */}
        <p className="px-6 pt-5 pb-2 text-[12px] font-semibold text-white/25 uppercase tracking-[0.12em]">
          Menu
        </p>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium transition-all duration-150",
                  isActive
                    ? "bg-white/[0.1] text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]",
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    "shrink-0",
                    isActive ? "text-white" : "text-white/40",
                  )}
                />
                {label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/[0.07]" />

        {/* User profile */}
        <div className="p-4 shrink-0">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors group"
          >
            <div
              className="w-9 h-9 rounded-full shrink-0 overflow-hidden flex items-center justify-center text-[12px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                boxShadow: "0 0 0 2px rgba(124,58,237,0.35)",
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.fullName ?? ""}
                  key={avatarUrl.slice(-16)}
                  className="w-full h-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-white/90 truncate leading-tight">
                {user?.fullName}
              </p>
              <p className="text-[12px] text-white/35 truncate leading-tight mt-0.5">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={signingOut}
              title={signingOut ? "Signing out…" : "Sign out"}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/70 transition-colors opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed"
            >
              {signingOut ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <LogOut size={14} />
              )}
            </button>
          </Link>
        </div>
      </aside>
    </>
  );
}
