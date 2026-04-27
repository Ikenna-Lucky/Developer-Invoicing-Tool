"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, Users, FileText, LayoutDashboard, Settings,
  ArrowRight, FileText as InvoiceIcon, User, Hash,
  ChevronRight, Command, Zap,
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Client, Invoice } from "@/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CommandItem {
  id:       string;
  type:     "action" | "invoice" | "client" | "nav";
  label:    string;
  sublabel?: string;
  icon:     React.ElementType;
  iconColor?: string;
  action:   () => void;
  keywords?: string;
}

// ─── Keyboard shortcut hint ────────────────────────────────────────────────────

export function CmdKHint({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors text-left"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <Search size={13} className="text-white/25 shrink-0" />
      <span className="flex-1 text-[13px] text-white/25">Search anything…</span>
      <kbd
        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-semibold text-white/20 shrink-0"
        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <span style={{ fontFamily: "system-ui" }}>⌘</span>K
      </kbd>
    </button>
  );
}

// ─── Main palette ──────────────────────────────────────────────────────────────

export function CommandPalette() {
  const router  = useRouter();
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState("");
  const [idx,   setIdx]   = useState(0);
  const [clients,   setClients]   = useState<Client[]>([]);
  const [invoices,  setInvoices]  = useState<Invoice[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Global keyboard trigger ───────────────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // ── Fetch data lazily ──────────────────────────────────────────────────────

  useEffect(() => {
    if (!open) return;
    Promise.all([
      fetch(`${API_BASE}/clients`, { credentials: "include" }).then((r) => r.json()).catch(() => ({ data: [] })),
      fetch(`${API_BASE}/invoices`, { credentials: "include" }).then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([c, i]) => {
      setClients(c.data ?? []);
      setInvoices(i.data ?? []);
    });
  }, [open]);

  // ── Build command list ─────────────────────────────────────────────────────

  const navigate = useCallback((path: string) => {
    router.push(path);
    setOpen(false);
  }, [router]);

  const QUICK_ACTIONS: CommandItem[] = [
    {
      id: "new-invoice", type: "action", label: "New invoice",
      sublabel: "Create a blank invoice", icon: Plus,
      iconColor: "#60a5fa",
      action: () => navigate("/invoices/create"),
      keywords: "create add invoice",
    },
    {
      id: "add-client", type: "action", label: "Add client",
      sublabel: "Register a new client", icon: Users,
      iconColor: "#a78bfa",
      action: () => navigate("/clients"),
      keywords: "create add client contact",
    },
    {
      id: "dashboard", type: "nav", label: "Dashboard",
      icon: LayoutDashboard, iconColor: "rgba(255,255,255,0.4)",
      action: () => navigate("/dashboard"),
      keywords: "home overview stats",
    },
    {
      id: "invoices", type: "nav", label: "Invoices",
      icon: FileText, iconColor: "rgba(255,255,255,0.4)",
      action: () => navigate("/invoices"),
      keywords: "all invoices list",
    },
    {
      id: "clients", type: "nav", label: "Clients",
      icon: Users, iconColor: "rgba(255,255,255,0.4)",
      action: () => navigate("/clients"),
      keywords: "all clients list contacts",
    },
    {
      id: "settings", type: "nav", label: "Settings",
      icon: Settings, iconColor: "rgba(255,255,255,0.4)",
      action: () => navigate("/settings"),
      keywords: "preferences account business profile",
    },
  ];

  const q = query.toLowerCase().trim();

  const filteredActions = q
    ? QUICK_ACTIONS.filter((a) =>
        a.label.toLowerCase().includes(q) ||
        (a.sublabel ?? "").toLowerCase().includes(q) ||
        (a.keywords ?? "").toLowerCase().includes(q)
      )
    : QUICK_ACTIONS;

  const filteredClients: CommandItem[] = (q.length >= 1 ? clients : clients.slice(0, 4))
    .filter((c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.companyName ?? "").toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((c) => ({
      id: `client-${c.id}`,
      type: "client" as const,
      label: c.name,
      sublabel: c.companyName ?? c.email,
      icon: User,
      iconColor: "#a78bfa",
      action: () => navigate(`/clients/${c.id}`),
    }));

  type InvoiceRow = Invoice & { clientName?: string; clientEmail?: string };

  const filteredInvoices: CommandItem[] = (q.length >= 1 ? invoices : (invoices as InvoiceRow[]).slice(0, 4))
    .filter((i: InvoiceRow) =>
      !q ||
      i.invoiceNumber.toLowerCase().includes(q) ||
      (i.clientName ?? "").toLowerCase().includes(q) ||
      (i.clientEmail ?? "").toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((i: InvoiceRow) => ({
      id: `inv-${i.id}`,
      type: "invoice" as const,
      label: i.invoiceNumber,
      sublabel: `${i.clientName ?? "Client"} · ${formatCurrency(Number(i.totalAmount))}`,
      icon: InvoiceIcon,
      iconColor: "#60a5fa",
      action: () => navigate(`/invoices/${i.id}`),
    }));

  // Group structure
  type Group = { title: string; items: CommandItem[] };
  const groups: Group[] = [];
  if (filteredActions.length)  groups.push({ title: q ? "Actions"  : "Quick actions", items: filteredActions });
  if (filteredInvoices.length) groups.push({ title: "Invoices", items: filteredInvoices });
  if (filteredClients.length)  groups.push({ title: "Clients",  items: filteredClients });

  // Flat list for arrow nav
  const flat = groups.flatMap((g) => g.items);
  const safeIdx = Math.min(idx, Math.max(0, flat.length - 1));

  // ── Keyboard nav inside palette ────────────────────────────────────────────

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, flat.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter")     { e.preventDefault(); flat[safeIdx]?.action(); }
    if (e.key === "Escape")    { setOpen(false); }
  };

  // Reset active idx on query change
  useEffect(() => { setIdx(0); }, [query]);

  if (!open) return null;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-[999] flex items-start justify-center pt-[12vh]"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-[600px] mx-4 rounded-2xl overflow-hidden"
        style={{
          background: "#0e1420",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKey}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Search size={17} className="text-white/35 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoices, clients, actions…"
            className="flex-1 bg-transparent text-[16px] text-white placeholder:text-white/25 outline-none"
          />
          <kbd
            className="flex items-center gap-0.5 px-2 py-1 rounded-lg text-[11px] text-white/25 shrink-0"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto">
          {flat.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <Search size={20} className="text-white/20" />
              </div>
              <p className="text-[14px] text-white/30">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            groups.map((group, gi) => {
              // Calculate the starting flat index for this group
              const groupStart = groups.slice(0, gi).reduce((s, g) => s + g.items.length, 0);

              return (
                <div key={group.title}>
                  <p
                    className="px-5 pt-4 pb-2 text-[11px] font-bold text-white/20 uppercase tracking-[0.14em]"
                  >
                    {group.title}
                  </p>

                  {group.items.map((item, ii) => {
                    const flatI  = groupStart + ii;
                    const active = flatI === safeIdx;
                    const Icon   = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setIdx(flatI)}
                        className="w-full flex items-center gap-3.5 px-5 py-3 text-left transition-colors"
                        style={{
                          background: active ? "rgba(255,255,255,0.07)" : "transparent",
                          borderLeft: active ? "2px solid #60a5fa" : "2px solid transparent",
                        }}
                      >
                        {/* Icon */}
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            background: active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                          }}
                        >
                          <Icon size={15} style={{ color: item.iconColor ?? "rgba(255,255,255,0.4)" }} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-white/85 leading-tight">{item.label}</p>
                          {item.sublabel && (
                            <p className="text-[12px] text-white/30 mt-0.5 truncate">{item.sublabel}</p>
                          )}
                        </div>

                        {/* Enter hint when active */}
                        {active && (
                          <div className="flex items-center gap-1 shrink-0">
                            <kbd
                              className="px-1.5 py-0.5 rounded-md text-[11px] text-white/25"
                              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                            >
                              ↵
                            </kbd>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] text-white/20">
              <kbd className="px-1.5 py-0.5 rounded text-[10px]"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}>↑↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-white/20">
              <kbd className="px-1.5 py-0.5 rounded text-[10px]"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}>↵</kbd>
              open
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-white/20">
              <kbd className="px-1.5 py-0.5 rounded text-[10px]"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}>esc</kbd>
              close
            </span>
          </div>
          <span className="text-[11px] text-white/15">
            {flat.length} {flat.length === 1 ? "result" : "results"}
          </span>
        </div>
      </div>
    </div>
  );
}
