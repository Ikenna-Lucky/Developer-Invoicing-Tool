"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Search, FileText, Trash2, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { formatDate, formatCurrency } from "@/lib/utils";
import { apiRequest, API_BASE } from "@/lib/api";
import type { Invoice, InvoiceStatus } from "@/types";

// ─── Status config ─────────────────────────────────────────────────────────────

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

const STATUS_FILTERS: { value: InvoiceStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
];

interface InvoiceRow extends Invoice {
  clientName: string;
  clientEmail: string;
  clientCompany: string | null;
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function InvoicesPage() {
  const router = useRouter();
  const toast = useToast();

  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">(
    "all",
  );
  const [deleteTarget, setDeleteTarget] = useState<InvoiceRow | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchInvoices = useCallback(
    async (search?: string, status?: InvoiceStatus | "all") => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (status && status !== "all") params.set("status", status);
        const qs = params.toString() ? `?${params.toString()}` : "";

        const res = await fetch(`${API_BASE}/invoices${qs}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load invoices");
        const { data } = await res.json();
        setInvoices(data);
      } catch {
        toast.error("Could not load invoices. Please refresh.");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    const t = setTimeout(() => fetchInvoices(searchQuery, statusFilter), 350);
    return () => clearTimeout(t);
  }, [searchQuery, statusFilter, fetchInvoices]);

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiRequest(`/invoices/${deleteTarget.id}`, { method: "DELETE" });
      setInvoices((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      toast.success(`${deleteTarget.invoiceNumber} deleted`);
      setShowDelete(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // Per-status counts for tab badges
  const counts = invoices.reduce(
    (acc, inv) => {
      acc[inv.status] = (acc[inv.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-[22px] sm:text-[28px] font-bold text-white tracking-tight">
            Invoices
          </h1>
          <p className="text-[14px] sm:text-[15px] text-white/40 mt-0.5 sm:mt-1">
            Create, send, and track all your invoices
          </p>
        </div>
        <Link
          href="/invoices/create"
          className="inline-flex items-center gap-2 text-white font-semibold text-[13px] sm:text-[14px]
                     px-4 sm:px-5 py-2.5 rounded-xl transition-all duration-150 shadow-lg shadow-brand-600/20 shrink-0"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
        >
          <Plus size={15} />
          New invoice
        </Link>
      </div>

      {/* ── Stats bar ── */}
      {!loading &&
        invoices.length > 0 &&
        (() => {
          const total = invoices.reduce((s, i) => s + Number(i.totalAmount), 0);
          const paid = invoices
            .filter((i) => i.status === "paid")
            .reduce((s, i) => s + Number(i.totalAmount), 0);
          const outstanding = invoices
            .filter((i) => i.status === "sent" || i.status === "overdue")
            .reduce((s, i) => s + Number(i.totalAmount), 0);
          const overdueAmt = invoices
            .filter((i) => i.status === "overdue")
            .reduce((s, i) => s + Number(i.totalAmount), 0);

          const chips = [
            {
              label: "Total value",
              value: formatCurrency(total),
              color: "rgba(255,255,255,0.55)",
              dot: "rgba(255,255,255,0.25)",
            },
            {
              label: "Collected",
              value: formatCurrency(paid),
              color: "#4ade80",
              dot: "#4ade80",
            },
            {
              label: "Outstanding",
              value: formatCurrency(outstanding),
              color: "#60a5fa",
              dot: "#60a5fa",
            },
            {
              label: "Overdue",
              value: formatCurrency(overdueAmt),
              color: overdueAmt > 0 ? "#f87171" : "rgba(255,255,255,0.3)",
              dot: overdueAmt > 0 ? "#f87171" : "rgba(255,255,255,0.15)",
            },
          ];

          return (
            <div className="flex flex-wrap gap-3 mb-5">
              {chips.map((chip) => (
                <div
                  key={chip.label}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl shrink-0"
                  style={{
                    background: "#161b27",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: chip.dot }}
                  />
                  <span className="text-[13px] text-white/40 whitespace-nowrap">
                    {chip.label}
                  </span>
                  <span
                    className="text-[14px] font-bold font-mono whitespace-nowrap"
                    style={{ color: chip.color }}
                  >
                    {chip.value}
                  </span>
                </div>
              ))}
            </div>
          );
        })()}

      {/* Content card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#161b27",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Toolbar */}
        <div
          className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Status filter tabs */}
          <div
            className="flex gap-0.5 p-1 rounded-xl overflow-x-auto shrink-0 max-w-full"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className="px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-150"
                style={
                  statusFilter === f.value
                    ? {
                        background: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.9)",
                      }
                    : { color: "rgba(255,255,255,0.35)" }
                }
              >
                {f.label}
                {f.value !== "all" && counts[f.value] != null && (
                  <span
                    className="ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {counts[f.value]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative sm:ml-auto w-full sm:w-72">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by number or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-[14px] rounded-xl
                         text-white placeholder:text-white/25
                         focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            />
          </div>
        </div>

        {/* Table / states */}
        {loading ? (
          <PageLoader />
        ) : invoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={
              searchQuery || statusFilter !== "all"
                ? "No invoices found"
                : "No invoices yet"
            }
            description={
              searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter."
                : "Create your first invoice to get started."
            }
            action={
              !searchQuery && statusFilter === "all"
                ? {
                    label: "Create your first invoice",
                    onClick: () => router.push("/invoices/create"),
                  }
                : undefined
            }
          />
        ) : (
          <>
            {/* ── Mobile card list (hidden on sm+) ── */}
            <div
              className="sm:hidden divide-y"
              style={{ borderColor: "rgba(255,255,255,0.04)" }}
            >
              {invoices.map((inv) => {
                const cfg = STATUS_CONFIG[inv.status];
                const isOverdue =
                  inv.status !== "paid" && new Date(inv.dueDate) < new Date();
                return (
                  <div
                    key={inv.id}
                    onClick={() => router.push(`/invoices/${inv.id}`)}
                    className="flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors"
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(255,255,255,0.025)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {/* Status dot */}
                    <div
                      className="w-2 h-2 rounded-full shrink-0 mt-0.5"
                      style={{ background: cfg.color }}
                    />

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[11px] font-semibold text-white/35 tracking-wide">
                          {inv.invoiceNumber}
                        </span>
                        <span
                          className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {isOverdue && (
                            <AlertCircle size={9} className="mr-0.5" />
                          )}
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-[14px] font-semibold text-white truncate leading-tight">
                        {inv.clientName}
                      </p>
                      <p
                        className="text-[12px] mt-0.5"
                        style={{
                          color: isOverdue
                            ? "#f87171"
                            : "rgba(255,255,255,0.3)",
                        }}
                      >
                        Due {formatDate(inv.dueDate)}
                      </p>
                    </div>

                    {/* Amount + actions */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="font-mono font-bold text-[14px] text-white">
                        {formatCurrency(Number(inv.totalAmount))}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(inv);
                          setShowDelete(true);
                        }}
                        className="p-1 rounded-lg text-white/20 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop table (hidden below sm) ── */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    {[
                      "Invoice",
                      "Client",
                      "Amount",
                      "Status",
                      "Due date",
                      "Created",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-4 text-[12px] font-semibold text-white/30 uppercase tracking-widest"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => {
                    const cfg = STATUS_CONFIG[inv.status];
                    const isOverdue =
                      inv.status !== "paid" &&
                      new Date(inv.dueDate) < new Date();

                    return (
                      <tr
                        key={inv.id}
                        onClick={() => router.push(`/invoices/${inv.id}`)}
                        className="group cursor-pointer transition-colors"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(255,255,255,0.025)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td className="px-6 py-5">
                          <span className="font-mono font-semibold text-white/70 text-[14px] tracking-wide">
                            {inv.invoiceNumber}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-[15px] font-semibold text-white leading-tight">
                            {inv.clientName}
                          </p>
                          {inv.clientCompany && (
                            <p className="text-[13px] text-white/35 mt-0.5">
                              {inv.clientCompany}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-mono font-bold text-[15px] text-white">
                            {formatCurrency(Number(inv.totalAmount))}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold"
                            style={{ background: cfg.bg, color: cfg.color }}
                          >
                            {isOverdue && <AlertCircle size={11} />}
                            {cfg.label}
                          </span>
                        </td>
                        <td
                          className="px-6 py-5 text-[14px]"
                          style={{
                            color: isOverdue
                              ? "#f87171"
                              : "rgba(255,255,255,0.4)",
                          }}
                        >
                          {formatDate(inv.dueDate)}
                        </td>
                        <td className="px-6 py-5 text-[13px] text-white/30">
                          {formatDate(inv.createdAt)}
                        </td>
                        <td
                          className="px-6 py-5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1 opacit