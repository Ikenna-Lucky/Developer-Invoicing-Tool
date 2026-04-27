"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LogOut,
  Settings,
  ChevronDown,
  Plus,
  Users,
  FileText,
  LayoutDashboard,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { BilldLogo } from "@/components/ui/BilldLogo";
import { useAuth } from "@/context/AuthContext";
import { useAvatar } from "@/lib/useAvatar";
import { API_BASE } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Client, Invoice } from "@/types";
import Link from "next/link";

// ─── Avatar bubble ────────────────────────────────────────────────────────────

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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          className="w-full h-full object-cover"
          key={avatarUrl.slice(-16)}
        />
      ) : (
        initials
      )}
    </div>
  );
}

// ─── Inline search with results dropdown ─────────────────────────────────────

type CommandItem = {
  id: string;
  type: "action" | "invoice" | "client" | "nav";
  label: string;
  sublabel?: string;
  icon: React.ElementType;
  iconColor?: string;
  action: () => void;
  keywords?: string;
};

function HeaderSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── ⌘K / Ctrl+K global shortcut ───────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 30);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Click outside to close ─────────────────────────────────────────────────
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // ── Lazy-load clients + invoices on first open ────────────────────────────
  useEffect(() => {
    if (!open || dataLoaded) return;
    Promise.all([
      fetch(`${API_BASE}/clients`, { credentials: "include" })
        .then((r) => r.json())
        .catch(() => ({ data: [] })),
      fetch(`${API_BASE}/invoices`, { credentials: "include" })
        .then((r) => r.json())
        .catch(() => ({ data: [] })),
    ]).then(([c, i]) => {
      setClients(c.data ?? []);
      setInvoices(i.data ?? []);
      setDataLoaded(true);
    });
  }, [open, dataLoaded]);

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
      setOpen(false);
      setQuery("");
      inputRef.current?.blur();
    },
    [router],
  );

  // ── Quick actions ──────────────────────────────────────────────────────────

  const QUICK_ACTIONS: CommandItem[] = [
    {
      id: "new-invoice",
      type: "action",
      label: "New invoice",
      sublabel: "Create a blank invoice",
      icon: Plus,
      iconColor: "#60a5fa",
      action: () => navigate("/invoices/create"),
      keywords: "create add invoice",
    },
    {
      id: "add-client",
      type: "action",
      label: "Add client",
      sublabel: "Register a new client",
      icon: Users,
      iconColor: "#a78bfa",
      action: () => navigate("/clients"),
      keywords: "create add client contact",
    },
    {
      id: "dashboard",
      type: "nav",
      label: "Dashboard",
      icon: LayoutDashboard,
      iconColor: "rgba(255,255,255,0.4)",
      action: () => navigate("/dashboard"),
      keywords: "home overview stats",
    },
    {
      id: "invoices",
      type: "nav",
      label: "Invoices",
      icon: FileText,
      iconColor: "rgba(255,255,255,0.4)",
      action: () => navigate("/invoices"),
      keywords: "all invoices list",
    },
    {
      id: "clients",
      type: "nav",
      label: "Clients",
      icon: Users,
      iconColor: "rgba(255,255,255,0.4)",
      action: () => navigate("/clients"),
      keywords: "all clients list contacts",
    },
    {
      id: "settings",
      type: "nav",
      label: "Settings",
      icon: Settings,
      iconColor: "rgba(255,255,255,0.4)",
      action: () => navigate("/settings"),
      keywords: "preferences account business profile",
    },
  ];

  const q = query.toLowerCase().trim();

  const filteredActions = q
    ? QUICK_ACTIONS.filter(
        (a) =>
          a.label.toLowerCase().includes(q) ||
          (a.sublabel ?? "").toLowerCase().includes(q) ||
          (a.keywords ?? "").toLowerCase().includes(q),
      )
    : QUICK_ACTIONS;

  const filteredClients: CommandItem[] = (
    q.length >= 1 ? clients : clients.slice(0, 4)
  )
    .filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.companyName ?? "").toLowerCase().includes(q),
    )
    .slice(0, 5)
    .map((c) => ({
      id: `client-${c.id}`,
      type: "client" as const,
      label: c.name,
      sublabel: c.companyName ?? c.email,
      icon: UserIcon,
      iconColor: "#a78bfa",
      action: () => navigate(`/clients/${c.id}`),
    }));

  type InvoiceRow = Invoice & { clientName?: string };

  const filteredInvoices: CommandItem[] = (
    q.length >= 1 ? invoices : (invoices as InvoiceRow[]).slice(0, 4)
  )
    .filter(
      (i: InvoiceRow) =>
        !q ||
        i.invoiceNumber.toLowerCase().includes(q) ||
        (i.clientName ?? "").toLowerCase().includes(q),
    )
    .slice(0, 5)
    .map((i: InvoiceRow) => ({
      id: `inv-${i.id}`,
      type: "invoice" as const,
      label: i.invoiceNumber,
      sublabel: `${i.clientName ?? "Client"} · ${formatCurrency(Number(i.totalAmount))}`,
      icon: FileText,
      iconColor: "#60a5fa",
      action: () => navigate(`/invoices/${i.id}`),
    }));

  type Group = { title: string; items: CommandItem[] };
  const groups: Group[] = [];
  if (filteredActions.length)
    groups.push({
      title: q ? "Actions" : "Quick actions",
      items: filteredActions,
    });
  if (filteredInvoices.length)
    groups.push({ title: "Invoices", items: filteredInvoices });
  if (filteredClients.length)
    groups.push({ title: "Clients", items: filteredClients });

  const flat = groups.flatMap((g) => g.items);
  const safeIdx = Math.min(idx, Math.max(0, flat.length - 1));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(i + 1, flat.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      flat[safeIdx]?.action();
    }
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    setIdx(0);
  }, [query]);

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="relative w-full min-w-0"
      style={{ maxWidth: 540 }}
    >
      {/* ── Search input bar ── */}
      <div
        className="flex items-center gap-3 h-10 px-4 rounded-xl transition-all duration-200 cursor-text"
        style={{
          background: open
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.05)",
          border: open
            ? "1px solid rgba(255,255,255,0.18)"
            : "1px solid rgba(255,255,255,0.09)",
          boxShadow: open ? "0 0 0 3px rgba(37,99,235,0.15)" : "none",
        }}
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <Search
          size={14}
          className="shrink-0 transition-colors"
          style={{
            color: open ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)",
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder="Search invoices, clients, actions…"
          className="flex-1 min-w-0 w-full bg-transparent text-[14px] text-white placeholder:text-white/25 outline-none"
        />
        {!open && (
          <kbd
            className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] font-semibold text-white/20 shrink-0"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span style={{ fontFamily: "system-ui" }}>⌘</span>K
          </kbd>
        )}
      </div>

      {/* ── Dropdown results panel ── */}
      {open && (
        <div
          className="absolute left-0 right-0 rounded-2xl overflow-hidden z-[200]"
          style={{
            top: "calc(100% + 8px)",
            background: "#0e1420",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto py-2">
            {flat.length === 0 && query.length > 0 ? (
              <div className="py-10 flex flex-col items-center text-center">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <Search size={16} className="text-white/20" />
                </div>
                <p className="text-[13px] text-white/30">
                  No results for &ldquo;{query}&rdquo;
                </p>
              </div>
            ) : (
              groups.map((group, gi) => {
                const groupStart = groups
                  .slice(0, gi)
                  .reduce((s, g) => s + g.items.length, 0);
                return (
                  <div key={group.title}>
                    <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-white/20 uppercase tracking-[0.14em]">
                      {group.title}
                    </p>
                    {group.items.map((item, ii) => {
                      const flatI = groupStart + ii;
                      const active = flatI === safeIdx;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setIdx(flatI)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                          style={{
                            background: active
                              ? "rgba(255,255,255,0.07)"
                              : "transparent",
                            borderLeft: active
                              ? "2px solid #60a5fa"
                              : "2px solid transparent",
                          }}
                        >
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: active
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(255,255,255,0.05)",
                            }}
                          >
                            <Icon
                              size={13}
                              style={{
                                color:
                                  item.iconColor ?? "rgba(255,255,255,0.4)",
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-white/85 leading-tight truncate">
                              {item.label}
                            </p>
                            {item.sublabel && (
                              <p className="text-[11px] text-white/30 mt-0.5 truncate">
                                {item.sublabel}
                              </p>
                            )}
                          </div>
                          {active && (
                            <kbd
                              className="px-1.5 py-0.5 rounded text-[10px] text-white/25 shrink-0"
                              style={{
                                background: "rgba(255,255,255,0.07)",
                                border: "1px solid rgba(255,255,255,0.1)",
                              }}
                            >
                              ↵
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>

          {/* Keyboard hints footer */}
          <div
            className="px-4 py-2.5 flex items-center gap-4"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <span className="flex items-center gap-1.5 text-[10px] text-white/20">
              <kbd
                className="px-1.5 py-0.5 rounded text-[9px]"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-white/20">
              <kbd
                className="px-1.5 py-0.5 rounded text-[9px]"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                ↵
              </kbd>
              open
            </span>
            <span className="flex items-center gap-1.5 text-[10px] text-white/20">
              <kbd
                className="px-1.5 py-0.5 rounded text-[9px]"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                esc
              </kbd>
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Profile dropdown ─────────────────────────────────────────────────────────

function ProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const avatarUrl = useAvatar();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
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
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
    }
    router.push("/sign-in");
  };

  return (
    <div ref={ref} className="relative shrink-0">
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 sm:gap-3 h-10 pl-1.5 pr-1.5 sm:pl-2.5 sm:pr-4 rounded-xl transition-all duration-150"
        style={{
          background: open
            ? "rgba(255,255,255,0.09)"
            : "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        <AvatarBubble avatarUrl={avatarUrl} initials={initials} size={32} />
        {/* Name + email — hidden on mobile, visible on sm+ */}
        <div className="hidden sm:flex flex-col items-start min-w-0">
          <span className="text-[13px] font-semibold text-white/90 leading-tight truncate max-w-[130px]">
            {user?.fullName ?? "Account"}
          </span>
          <span className="text-[11px] text-white/30 leading-tight truncate max-w-[130px]">
            {user?.email ?? ""}
          </span>
        </div>
        {/* Chevron — hidden on mobile */}
        <ChevronDown
          size={14}
          className="hidden sm:block text-white/30 transition-transform duration-200 shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          className="absolute right-0 rounded-2xl overflow-hidden z-[200]"
          style={{
            top: "calc(100% + 8px)",
            width: "280px",
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
                  className="text-[12px] mt-0.5 truncate"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-2">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors"
              style={{ color: "rgba(255,255,255,0.65)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
              }}
            >
              <Settings size={14} className="text-white/30 shrink-0" />
              Profile &amp; Settings
            </Link>

            <button
              onClick={handleLogout}
              disabled={signingOut}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors text-left mt-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ color: "rgba(248,113,113,0.85)" }}
              onMouseEnter={(e) => {
                if (!signingOut)
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(239,68,68,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
              }}
            >
              {signingOut ? (
                <Loader2 size={14} className="shrink-0 animate-spin" />
              ) : (
                <LogOut size={14} className="shrink-0" />
              )}
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Animated hamburger / X toggle (mobile only) ─────────────────────────────

function MenuToggle({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className="lg:hidden relative flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all duration-200 focus:outline-none"
      style={{
        background: isOpen ? "rgba(37,99,235,0.12)" : "rgba(255,255,255,0.05)",
        border: isOpen
          ? "1px solid rgba(37,99,235,0.4)"
          : "1px solid rgba(255,255,255,0.09)",
        boxShadow: isOpen ? "0 0 0 4px rgba(37,99,235,0.08)" : "none",
      }}
    >
      {/* Gradient dot indicator — top-right corner, visible when open */}
      <span
        className="absolute top-[5px] right-[5px] w-1.5 h-1.5 rounded-full transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #2563eb, #7c3aed)",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1)" : "scale(0)",
        }}
      />

      {/* The three lines — each is a thin bar that morphs via CSS transform */}
      <span className="flex flex-col items-center justify-center gap-0 w-4 h-4">
        {/* Line 1 */}
        <span
          className="block h-[1.5px] rounded-full bg-current transition-all duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            width: "14px",
            color: isOpen ? "#60a5fa" : "rgba(255,255,255,0.75)",
            transform: isOpen ? "translateY(6px) rotate(45deg)" : "none",
            transformOrigin: "center",
          }}
        />
        {/* Line 2 — shorter, offset left for editorial character */}
        <span
          className="block h-[1.5px] rounded-full bg-current transition-all duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            width: isOpen ? "0px" : "10px",
            marginLeft: isOpen ? "0px" : "-4px",
            color: isOpen ? "#60a5fa" : "rgba(255,255,255,0.75)",
            opacity: isOpen ? 0 : 1,
            transformOrigin: "center",
          }}
        />
        {/* Line 3 */}
        <span
          className="block h-[1.5px] rounded-full bg-current transition-all duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{
            width: "14px",
            color: isOpen ? "#60a5fa" : "rgba(255,255,255,0.75)",
            transform: isOpen ? "translateY(-6px) rotate(-45deg)" : "none",
            transformOrigin: "center",
          }}
        />
      </span>
    </button>
  );
}