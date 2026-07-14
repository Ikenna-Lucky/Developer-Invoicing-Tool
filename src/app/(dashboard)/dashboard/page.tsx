"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Users,
  Zap,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { API_BASE } from "@/lib/api";
import type { Invoice, InvoiceStatus } from "@/types";

// Types

interface InvoiceRow extends Invoice {
  clientName: string;
  clientCompany: string | null;
}

// Count-up hook

function useCountUp(target: number, duration = 1400, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = setTimeout(() => {
      if (target === 0) {
        setValue(0);
        return;
      }
      let startTs: number | null = null;
      const step = (ts: number) => {
        if (!startTs) startTs = ts;
        const p = Math.min((ts - startTs) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 4); // quartic ease-out
        setValue(Math.floor(eased * target));
        if (p < 1) requestAnimationFrame(step);
        else setValue(target);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(start);
  }, [target, duration, delay]);
  return value;
}

// Collection ring (SVG arc)

function CollectionRing({
  rate,
  triggered,
}: {
  rate: number;
  triggered: boolean;
}) {
  const R = 54;
  const circ = 2 * Math.PI * R;
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    if (!triggered) return;
    const t = setTimeout(() => setDrawn(rate), 150);
    return () => clearTimeout(t);
  }, [rate, triggered]);

  const offset = circ - (drawn / 100) * circ;
  const displayRate = useCountUp(triggered ? Math.round(rate) : 0, 1200, 200);

  return (
    <svg width="144" height="144" viewBox="0 0 144 144">
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <filter id="ringGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Track */}
      <circle
        cx="72"
        cy="72"
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="7"
      />
      {/* Progress arc */}
      <circle
        cx="72"
        cy="72"
        r={R}
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 72 72)"
        filter="url(#ringGlow)"
        style={{
          transition: "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      {/* Center: percentage */}
      <text
        x="72"
        y="66"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="24"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
        style={{ letterSpacing: "-0.04em" }}
      >
        {displayRate}%
      </text>
      <text
        x="72"
        y="86"
        textAnchor="middle"
        fill="rgba(255,255,255,0.3)"
        fontSize="11"
        fontFamily="Inter, sans-serif"
        style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}
      >
        collected
      </text>
    </svg>
  );
}

// Status config

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; bg: string; color: string }
> = {
  draft: {
    label: "Draft",
    bg: "rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.5)",
  },
  sent: { label: "Sent", bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  paid: { label: "Paid", bg: "rgba(34,197,94,0.12)", color: "#4ade80" },
  overdue: { label: "Overdue", bg: "rgba(239,68,68,0.12)", color: "#f87171" },
};

// Fade-slide wrapper

function FadeUp({
  children,
  delay = 0,
  show,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  show: boolean;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0px)" : "translateY(18px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Main page

export default function DashboardPage() {
  const router = useRouter();

  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [clients, setClients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [invRes, cliRes] = await Promise.all([
        fetch(`${API_BASE}/invoices`, { credentials: "include" }),
        fetch(`${API_BASE}/clients`, { credentials: "include" }),
      ]);
      const [invJson, cliJson] = await Promise.all([
        invRes.json(),
        cliRes.json(),
      ]);
      setInvoices(invJson.data ?? []);
      setClients((cliJson.data ?? []).length);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
      setTimeout(() => setShow(true), 60);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived stats
  const totalInvoiced = invoices.reduce((s, i) => s + Number(i.totalAmount), 0);
  const totalCollected = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + Number(i.totalAmount), 0);
  const outstanding = invoices
    .filter((i) => i.status === "sent")
    .reduce((s, i) => s + Number(i.totalAmount), 0);
  const overdueAmt = invoices
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + Number(i.totalAmount), 0);
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;
  const sentCount = invoices.filter((i) => i.status === "sent").length;
  const paidCount = invoices.filter((i) => i.status === "paid").length;
  const collectionRate =
    totalInvoiced > 0 ? (totalCollected / totalInvoiced) * 100 : 0;
  const recentInvoices = [...invoices]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Animated numbers (only tick once `show` is true)
  const animCollected = useCountUp(
    show ? Math.round(totalCollected) : 0,
    1400,
    0,
  );

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  // Loading skeleton
  if (loading)
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div
              className="h-3.5 w-24 rounded-md animate-pulse"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />
            <div
              className="h-7 w-40 rounded-md animate-pulse"
              style={{ background: "rgba(255,255,255,0.07)" }}
            />
          </div>
        </div>
        {/* skeleton row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="sm:col-span-2 h-52 rounded-2xl animate-pulse"
            style={{ background: "#161b27" }}
          />
          <div
            className="h-52 rounded-2xl animate-pulse"
            style={{ background: "#161b27" }}
          />
        </div>
        {/* skeleton row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl animate-pulse"
              style={{ background: "#161b27" }}
            />
          ))}
        </div>
        <div
          className="h-64 rounded-2xl animate-pulse"
          style={{ background: "#161b27" }}
        />
      </div>
    );

  return (
    <div className="space-y-4">
      {/* Header */}
      <FadeUp show={show} delay={0}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <p className="text-[11px] font-semibold text-white/20 uppercase tracking-[0.18em] mb-1.5">
              {greeting}
            </p>
            <h1 className="text-[22px] sm:text-[26px] font-bold text-white tracking-tight">
              Overview
            </h1>
          </div>
          <Link
            href="/invoices/create"
            className="inline-flex items-center gap-2 text-white font-semibold text-[13px] sm:text-[14px] px-4 sm:px-5 py-2.5 rounded-xl shrink-0"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              boxShadow: "0 4px 24px rgba(37,99,235,0.28)",
            }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span className="hidden xs:inline">New invoice</span>
            <span className="xs:hidden">New</span>
          </Link>
        </div>
      </FadeUp>

      {/* Row 1: Hero card (2/3) + Collection ring (1/3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* HERO CARD */}
        <FadeUp show={show} delay={60} className="sm:col-span-2">
          <div
            className="rounded-2xl p-5 sm:p-7 relative overflow-hidden h-full"
            style={{
              background:
                "linear-gradient(145deg, #12172a 0%, #181f33 55%, #111826 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Top shimmer line */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(74,222,128,0.5) 40%, rgba(96,165,250,0.4) 70%, transparent 100%)",
              }}
            />

            {/* Background glow */}
            <div
              className="absolute -bottom-16 -left-12 w-72 h-72 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(74,222,128,0.07) 0%, transparent 65%)",
              }}
            />

            {/* Label */}
            <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] mb-3 sm:mb-4">
              Revenue Landed
            </p>

            {/* Main number */}
            <div className="flex items-start gap-1.5 mb-4 sm:mb-5">
              <span
                className="text-[16px] sm:text-[18px] font-semibold mt-2 sm:mt-3 leading-none"
                style={{ color: "rgba(74,222,128,0.5)" }}
              >
                ₦
              </span>
              <span
                className="text-[40px] sm:text-[58px] font-extrabold leading-none tracking-[-0.04em]"
                style={{
                  background:
                    "linear-gradient(135deg, #4ade80 0%, #22d3ee 50%, #818cf8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {animCollected.toLocaleString()}
              </span>
            </div>

            {/* Progress bar */}
            {totalInvoiced > 0 ? (
              <div className="mb-5 sm:mb-6">
                <div
                  className="h-[3px] rounded-full overflow-hidden mb-2"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: show ? `${Math.min(collectionRate, 100)}%` : "0%",
                      background:
                        "linear-gradient(90deg, #4ade80, #22d3ee, #818cf8)",
                      transition:
                        "width 1.5s cubic-bezier(0.22, 1, 0.36, 1) 200ms",
                      boxShadow: "0 0 8px rgba(74,222,128,0.5)",
                    }}
                  />
                </div>
                <p className="text-[12px] text-white/25">
                  <span className="text-white/50 font-semibold">
                    {Math.round(collectionRate)}%
                  </span>{" "}
                  of {formatCurrency(totalInvoiced)} invoiced
                </p>
              </div>
            ) : (
              <div className="mb-5 sm:mb-6">
                <div
                  className="h-[3px] rounded-full"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
                <p className="text-[12px] text-white/20 mt-2">
                  No invoices issued yet
                </p>
              </div>
            )}

            {/* Sub-metrics row */}
            <div className="flex items-center gap-5 sm:gap-7 flex-wrap">
              <div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.18em] mb-1">
                  En Route
                </p>
                <p className="text-[18px] sm:text-[20px] font-bold text-white/70 font-mono tracking-tight">
                  {formatCurrency(outstanding)}
                </p>
                {sentCount > 0 && (
                  <p className="text-[11px] text-white/25 mt-0.5">
                    {sentCount} invoice{sentCount !== 1 ? "s" : ""} sent
                  </p>
                )}
              </div>

              {overdueAmt > 0 && (
                <>
                  <div
                    className="w-px h-10 sm:h-12"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: "#f87171" }}
                      />
                      <p
                        className="text-[10px] font-bold uppercase tracking-[0.18em]"
                        style={{ color: "rgba(248,113,113,0.55)" }}
                      >
                        Past Due
                      </p>
                    </div>
                    <p
                      className="text-[18px] sm:text-[20px] font-bold font-mono tracking-tight"
                      style={{ color: "#f87171" }}
                    >
                      {formatCurrency(overdueAmt)}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "rgba(248,113,113,0.4)" }}
                    >
                      {overdueCount} invoice{overdueCount !== 1 ? "s" : ""}{" "}
                      overdue
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </FadeUp>

        {/* COLLECTION RING */}
        <FadeUp show={show} delay={140}>
          <div
            className="rounded-2xl p-6 flex flex-col items-center justify-center h-full relative overflow-hidden"
            style={{
              background: "#161b27",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Subtle radial glow behind ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="w-40 h-40 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
                }}
              />
            </div>

            <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em] mb-4 relative z-10">
              Collection Rate
            </p>

            <div className="relative z-10">
              <CollectionRing rate={collectionRate} triggered={show} />
            </div>

            <p className="text-[12px] text-white/30 mt-3 text-center relative z-10 leading-relaxed">
              {paidCount} of {invoices.length} invoice
              {invoices.length !== 1 ? "s" : ""} paid
            </p>
          </div>
        </FadeUp>
      </div>

      {/* Row 2: Three compact metric tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pipeline */}
        <FadeUp show={show} delay={220}>
          <div
            className="rounded-2xl px-5 py-5 relative overflow-hidden"
            style={{
              background: "#161b27",
              border: "1px solid rgba(255,255,255,0.07)",
              borderLeft: "2px solid #60a5fa",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.18em]">
                Pipeline
              </p>
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: "rgba(96,165,250,0.12)" }}
              >
                <TrendingUp size={12} className="text-blue-400" />
              </div>
            </div>
            <p className="text-[24px] sm:text-[26px] font-bold text-white font-mono tracking-tight mb-1">
              {formatCurrency(outstanding)}
            </p>
            <p className="text-[12px] text-white/30">
              {sentCount} invoice{sentCount !== 1 ? "s" : ""} awaiting payment
            </p>
          </div>
        </FadeUp>

        {/* Needs Attention */}
        <FadeUp show={show} delay={300}>
          <div
            className="rounded-2xl px-5 py-5 relative overflow-hidden"
            style={{
              background: overdueCount > 0 ? "rgba(239,68,68,0.04)" : "#161b27",
              border:
                overdueCount > 0
                  ? "1px solid rgba(239,68,68,0.18)"
                  : "1px solid rgba(255,255,255,0.07)",
              borderLeft: `2px solid ${overdueCount > 0 ? "#f87171" : "rgba(255,255,255,0.12)"}`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                {overdueCount > 0 && (
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "#f87171" }}
                  />
                )}
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{
                    color:
                      overdueCount > 0
                        ? "rgba(248,113,113,0.6)"
                        : "rgba(255,255,255,0.25)",
                  }}
                >
                  Needs Attention
                </p>
              </div>
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{
                  background:
                    overdueCount > 0
                      ? "rgba(239,68,68,0.12)"
                      : "rgba(255,255,255,0.05)",
                }}
              >
                <AlertTriangle
                  size={12}
                  style={{
                    color:
                      overdueCount > 0 ? "#f87171" : "rgba(255,255,255,0.2)",
                  }}
                />
              </div>
            </div>
            <p
              className="text-[24px] sm:text-[26px] font-bold font-mono tracking-tight mb-1"
              style={{
                color: overdueCount > 0 ? "#f87171" : "rgba(255,255,255,0.2)",
              }}
            >
              {overdueCount > 0 ? formatCurrency(overdueAmt) : "—"}
            </p>
            <p
              className="text-[12px]"
              style={{
                color:
                  overdueCount > 0
                    ? "rgba(248,113,113,0.45)"
                    : "rgba(255,255,255,0.2)",
              }}
            >
              {overdueCount > 0
                ? `${overdueCount} invoice${overdueCount !== 1 ? "s" : ""} past due`
                : "Everything on track"}
            </p>
          </div>
        </FadeUp>

        {/* Client Base */}
        <FadeUp show={show} delay={380}>
          <div
            className="rounded-2xl px-5 py-5 relative overflow-hidden"
            style={{
              background: "#161b27",
              border: "1px solid rgba(255,255,255,0.07)",
              borderLeft: "2px solid #a78bfa",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.18em]">
                Client Base
              </p>
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center"
                style={{ background: "rgba(167,139,250,0.12)" }}
              >
                <Users size={12} className="text-purple-400" />
              </div>
            </div>
            <p className="text-[24px] sm:text-[26px] font-bold text-white font-mono tracking-tight mb-1">
              {clients}
            </p>
            <p className="text-[12px] text-white/30">
              {invoices.length} invoice{invoices.length !== 1 ? "s" : ""} issued
              in total
            </p>
          </div>
        </FadeUp>
      </div>

      {/* Recently Issued */}
      <FadeUp show={show} delay={460}>
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#161b27",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Header */}
          <div
            className="px-4 sm:px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div>
              <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.18em] mb-0.5">
                Recently Issued
              </p>
              <p className="text-[15px] font-semibold text-white">
                {recentInvoices.length > 0
                  ? `Last ${recentInvoices.length} invoice${recentInvoices.length !== 1 ? "s" : ""}`
                  : "No invoices yet"}
              </p>
            </div>
            <Link
              href="/invoices"
              className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-400 hover:text-brand-300 transition-colors"
            >
              See all
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Empty state */}
          {recentInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <Zap size={18} className="text-white/20" />
              </div>
              <p className="text-[14px] font-semibold text-white/60 mb-1">
                Nothing here yet
              </p>
              <p className="text-[13px] text-white/25 mb-5">
                Your first invoice will show up right here.
              </p>
              <Link
                href="/invoices/create"
                className="inline-flex items-center gap-2 text-white text-[13px] font-semibold px-4 py-2 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                }}
              >
                <Plus size={14} /> Create invoice
              </Link>
            </div>
          ) : (
            <div>
              {recentInvoices.map((inv, idx) => {
                const cfg = STATUS_CONFIG[inv.status];
                const isOverdue =
                  inv.status !== "paid" && new Date(inv.dueDate) < new Date();

                return (
                  <div
                    key={inv.id}
                    onClick={() => router.push(`/invoices/${inv.id}`)}
                    className="px-4 sm:px-6 py-4 cursor-pointer"
                    style={{
                      borderBottom:
                        idx < recentInvoices.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.025)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Mobile layout: two-line card */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] font-semibold text-white/30 mb-0.5 tracking-wide">
                          {inv.invoiceNumber}
                        </p>
                        <p className="text-[15px] font-semibold text-white leading-tight truncate">
                          {inv.clientName}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Status badge — always visible */}
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                        {/* Amount */}
                        <p className="font-mono font-bold text-[15px] text-white whitespace-nowrap hidden sm:block">
                          {formatCurrency(Number(inv.totalAmount))}
                        </p>
                      </div>
                    </div>
                    {/* Amount + due date — second row on mobile */}
                    <div className="flex items-center justify-between mt-1.5 sm:hidden">
                      <p className="font-mono font-semibold text-[14px] text-white/70">
                        {formatCurrency(Number(inv.totalAmount))}
                      </p>
                      <p
                        className="text-[12px] font-mono"
                        style={{
                          color: isOverdue
                            ? "#f87171"
                            : "rgba(255,255,255,0.30)",
                        }}
                      >
                        Due {formatDate(inv.dueDate)}
                      </p>
                    </div>
                    {/* Due date on desktop */}
                    <p
                      className="hidden sm:block text-[12px] font-mono mt-0.5 ml-0"
                      style={{
                        color: isOverdue ? "#f87171" : "rgba(255,255,255,0.25)",
                      }}
                    >
                      Due {formatDate(inv.dueDate)}
                    </p>
                  </div>
                );
              })}

              {/* More link */}
              {invoices.length > 5 && (
                <div
                  className="px-4 sm:px-6 py-3.5"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.04)",
                    background: "rgba(255,255,255,0.01)",
                  }}
                >
                  <Link
                    href="/invoices"
                    className="text-[12px] text-white/20 hover:text-white/40 transition-colors"
                  >
                    + {invoices.length - 5} more invoice
                    {invoices.length - 5 !== 1 ? "s" : ""}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </FadeUp>
    </div>
  );
}
