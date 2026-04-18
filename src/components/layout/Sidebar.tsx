/**
 * SIDEBAR COMPONENT
 *
 * This is the main navigation panel fixed to the left side of the screen.
 *
 * `usePathname()` is a Next.js hook that returns the current URL path
 * (e.g. "/clients"). We use it to highlight the active nav item.
 *
 * `Link` from next/link is Next.js's client-side navigation component.
 * Unlike a regular <a> tag, it doesn't do a full page reload — it just
 * swaps the content, making the app feel instant.
 *
 * The sidebar has three sections:
 * 1. Logo at the top
 * 2. Navigation items in the middle
 * 3. User profile + logout at the bottom
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// ─── Nav item definition ──────────────────────────────────────────────────────
const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/clients",   icon: Users,           label: "Clients"   },
  { href: "/invoices",  icon: FileText,        label: "Invoices"  },
  { href: "/settings",  icon: Settings,        label: "Settings"  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/sign-in");
  };

  // Get user's initials for the avatar — e.g. "Ikenna Obi" → "IO"
  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-40">

      {/* ── Logo ── */}
      <div className="h-16 flex items-center px-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
            <Receipt size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-gray-900 text-[15px] tracking-tight">InvoiceDev</span>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          // A route is active if the path starts with the href
          // e.g. /clients/add is still "active" for /clients
          const isActive = pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700"   // Active: blue tint
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900" // Idle
              )}
            >
              <Icon
                size={18}
                className={cn(
                  isActive ? "text-brand-600" : "text-gray-400"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ── User profile + logout ── */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          {/* Avatar with user initials */}
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          {/* Logout button */}
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
