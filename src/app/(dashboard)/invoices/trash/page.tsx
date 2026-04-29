"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  RotateCcw,
  FileText,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { formatDate, formatCurrency } from "@/lib/utils";
import { apiRequest, API_BASE } from "@/lib/api";
import type { Metadata } from "next";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TrashedInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  totalAmount: string;
  deletedAt: string;
  clientId: string;
  clientName: string | null;
  clientEmail: string | null;
}

// ─── Days remaining helper ─────────────────────────────────────────────────────

function daysUntilPurge(deletedAt: string): number {
  const deleted = new Date(deletedAt).getTime();
  const purgeAt = deleted + 30 * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((purgeAt - Date.now()) / (24 * 60 * 60 * 1000)));
}

// ─── Status colors ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  draft: { bg: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" },
  sent: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  paid: { bg: "rgba(34,197,94,0.12)", color: "#4ade80" },
  overdue: { bg: "rgba(239,68,68,0.12)", color: "#f87171" },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function TrashPage() {
  const router = useRouter();
  const toast = useToast();

  const [items, setItems] = useState<TrashedInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [permanentTarget, setPermanentTarget] = useState<TrashedInvoice | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/invoices/trash`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load Trash");
        const { data } = await res.json();
        setItems(data);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Restore ──────────────────────────────────────────────────────────────

  const handleRestore = async (invoice: TrashedInvoice) => {
    setRestoring(invoice.id);
    try {
      await apiRequest(`/invoices/${invoice.id}/restore`, { method: "POST" });
      setItems((prev) => prev.filter((i) => i.id !== invoice.id));
      toast.success(`${invoice.invoiceNumber} restored`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRestoring(null);
    }
  };

  // ── Permanent delete ─────────────────────────────────────────────────────

  const handlePermanentDelete = async () => {
    if (!permanentTarget) return;
    setDeleting(true);
    try {
      await apiRequest(`/invoices/${permanentTarget.id}/permanent`, {
        method: "DELETE",
      });
      setItems((prev) => prev.filter((i) => i.id !== permanentTarget.id));
      toast.success(`${permanentTarget.invoiceNumber} permanently deleted`);
      setPermanentTarget(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  if (loading) return <PageLoader />;

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <Link
          href="/invoices"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.4)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.8)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.4)";
          }}
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-[22px] sm:text-[28px] font-bold text-white">
            Trash
          </h1>
          <p className="text-[13px] text-white/35 mt-0.5">
            Deleted invoices are kept for 30 days before being permanently
            removed.
          </p>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div
          className="rounded-2xl flex flex-col items-center justify-center py-20 text-center"
          style={{
            background: "#161b27",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <Trash2 size={24} className="text-white/20" />
          </div>
          <p className="text-[16px] font-semibold text-white/50">
            Trash is empty
          </p>
          <p className="text-[14px] text-white/25 mt-1">
            Deleted invoices will appear here.
          </p>
        </div>
      )}

      {/* Invoice list */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((invoice) => {
            const days = daysUntilPurge(invoice.deletedAt);
            const statusCfg =
              STATUS_COLORS[invoice.status] ?? STATUS_COLORS.draft;
            const isRestoring = restoring === invoice.id;

            return (
              <div
                key={invoice.id}
                className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                style={{
                  background: "#161b27",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  <FileText size={17} className="text-white/30" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-[15px] text-white/80">
                      {invoice.invoiceNumber}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[12px] font-semibold"
                      style={{
                        background: statusCfg.bg,
                        color: statusCfg.color,
                      }}
                    >
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-[13px] text-white/40 truncate">
                    {invoice.clientName ?? "Unknown client"} ·{" "}
                    {formatCurrency(Number(invoice.totalAmount))}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Clock
                      size={11}
                      className={days <= 3 ? "text-red-400" : "text-white/25"}
                    />
                    <span
                      className="text-[12px]"
                      style={{
                        color: days <= 3 ? "#f87171" : "rgba(255,255,255,0.25)",
                      }}
                    >
                      {days === 0
                        ? "Purged today"
                        : days === 1
                          ? "Purged tomorrow"
                          : `${days} days left`}
                    </span>
                    <span className="text-[12px] text-white/20">
                      · Deleted {formatDate(invoice.deletedAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleRestore(invoice)}
                    disabled={isRestoring}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors disabled:opacity-50"
                    style={{
                      background: "rgba(74,222,128,0.08)",
                      color: "#4ade80",
                      border: "1px solid rgba(74,222,128,0.2)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isRestoring)
                        (e.currentTarget as HTMLElement).style.background =
                          "rgba(74,222,128,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(74,222,128,0.08)";
                    }}
                  >
                    <RotateCcw
                      size={13}
                      className={isRestoring ? "animate-spin" : ""}
                    />
                    Restore
                  </button>

                  <button
                    onClick={() => setPermanentTarget(invoice)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                    style={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.25)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(239,68,68,0.1)";
                      (e.currentTarget as HTMLElement).style.color = "#f87171";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(239,68,68,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.25)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(255,255,255,0.08)";
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Permanent delete confirmation modal */}
      <Modal
        open={!!permanentTarget}
        onClose={() => !deleting && setPermanentTarget(null)}
        title="Permanently delete invoice"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setPermanentTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handlePermanentDelete}
              loading={deleting}
            >
              Delete forever
            </Button>
          </>
        }
      >
        <div className="flex gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-ce