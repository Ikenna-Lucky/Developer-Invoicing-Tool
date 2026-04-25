"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
  Send,
  CheckCircle,
  Clock,
  FileText,
  Building2,
  Mail,
  Calendar,
  Copy,
  Check,
  Download,
  Pencil,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { formatDate, formatCurrency } from "@/lib/utils";
import { apiRequest, API_BASE } from "@/lib/api";
import type {
  Invoice,
  InvoiceItem,
  Client,
  InvoiceStatus,
  ApiResponse,
} from "@/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FullInvoice extends Invoice {
  items: InvoiceItem[];
  client: Client;
}

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

// ─── Status stepper ────────────────────────────────────────────────────────────

const STEPS: { status: InvoiceStatus; label: string; icon: React.ReactNode }[] =
  [
    { status: "draft", label: "Draft", icon: <Pencil size={14} /> },
    { status: "sent", label: "Sent", icon: <Send size={14} /> },
    { status: "paid", label: "Paid", icon: <CheckCircle size={14} /> },
  ];

function StatusStepper({
  current,
  onStep,
  loading,
}: {
  current: InvoiceStatus;
  onStep: (s: InvoiceStatus) => void;
  loading: boolean;
}) {
  const isOverdue = current === "overdue";
  // map overdue → sent for step index purposes
  const activeIdx =
    current === "paid"
      ? 2
      : current === "sent" || current === "overdue"
        ? 1
        : 0;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#161b27",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <h3 className="text-[12px] font-semibold text-white/30 uppercase tracking-widest mb-4">
        Status
      </h3>

      <div className="flex items-center gap-0">
        {STEPS.map((step, idx) => {
          const isDone = idx < activeIdx;
          const isActive = idx === activeIdx;
          const isLocked = idx > activeIdx; // can't go backward
          const isOverdueStep = isOverdue && idx === 1;

          const accentColor = isOverdueStep
            ? "#f87171"
            : isDone || isActive
              ? idx === 2
                ? "#4ade80"
                : idx === 1
                  ? "#60a5fa"
                  : "rgba(255,255,255,0.6)"
              : "rgba(255,255,255,0.15)";

          return (
            <div key={step.status} className="flex items-center flex-1">
              {/* Step bubble */}
              <div className="flex flex-col items-center flex-1 gap-2">
                <button
                  onClick={() => {
                    if (loading || isLocked || isActive) return;
                    // Only allow forward progression
                    if (idx === 1 && activeIdx === 0) onStep("sent");
                    if (idx === 2 && activeIdx <= 1) onStep("paid");
                  }}
                  disabled={loading || isLocked || isActive}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 relative"
                  title={
                    isLocked ? "Cannot go backward" : `Mark as ${step.label}`
                  }
                  style={{
                    background:
                      isDone || isActive
                        ? `${accentColor}20`
                        : "rgba(255,255,255,0.04)",
                    border: `2px solid ${isDone || isActive ? accentColor : "rgba(255,255,255,0.1)"}`,
                    cursor: isLocked || isActive ? "default" : "pointer",
                    boxShadow: isActive ? `0 0 16px ${accentColor}35` : "none",
                  }}
                >
                  <div
                    style={{
                      color:
                        isDone || isActive
                          ? accentColor
                          : "rgba(255,255,255,0.2)",
                    }}
                  >
                    {isDone ? <Check size={14} /> : step.icon}
                  </div>
                </button>
                <span
                  className="text-[12px] font-semibold"
                  style={{
                    color:
                      isDone || isActive
                        ? accentColor
                        : "rgba(255,255,255,0.2)",
                  }}
                >
                  {isOverdueStep ? "Overdue" : step.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div
                  className="h-0.5 flex-1 mx-0 -mt-6 transition-all duration-300"
                  style={{
                    background:
                      idx < activeIdx
                        ? "linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.3))"
                        : "rgba(255,255,255,0.08)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Overdue warning */}
      {isOverdue && (
        <div
          className="mt-4 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <Clock size={14} className="text-red-400 shrink-0" />
          <p className="text-[13px] text-red-400">
            This invoice is past its due date.
          </p>
          <button
            onClick={() => onStep("paid")}
            className="ml-auto text-[12px] font-semibold text-red-400 hover:text-red-300 whitespace-nowrap transition-colors"
          >
            Mark paid →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title={`Copy ${label ?? text}`}
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-150 text-[12px] font-medium"
      style={{
        background: copied ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.06)",
        color: copied ? "#4ade80" : "rgba(255,255,255,0.35)",
        border: `1px solid ${copied ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.09)"}`,
      }}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : (label ?? "Copy")}
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const [invoice, setInvoice] = useState<FullInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/invoices/${params.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Invoice not found");
        const { data } = await res.json();
        setInvoice(data);
      } catch (err: any) {
        toast.error(err.message);
        router.push("/invoices");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  // ── Status update ──────────────────────────────────────────────────────────

  const updateStatus = async (status: InvoiceStatus) => {
    if (!invoice) return;
    setUpdatingStatus(true);
    try {
      await apiRequest<ApiResponse<Invoice>>(`/invoices/${invoice.id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setInvoice((prev) => (prev ? { ...prev, status } : prev));
      toast.success(`Invoice marked as ${status}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!invoice) return;
    setDeleting(true);
    try {
      await apiRequest(`/invoices/${invoice.id}`, { method: "DELETE" });
      toast.success(`${invoice.invoiceNumber} deleted`);
      router.push("/invoices");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // ── Send invoice ───────────────────────────────────────────────────────────

  const handleSendInvoice = async () => {
    if (!invoice) return;
    setSending(true);
    try {
      const res = await apiRequest<{ data: FullInvoice; message: string }>(
        `/invoices/${invoice.id}/send`,
        { method: "POST" },
      );
      setInvoice(res.data);
      setShowSendModal(false);
      toast.success("Invoice sent to client!");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to send invoice");
    } finally {
      setSending(false);
    }
  };

  // ── PDF download ───────────────────────────────────────────────────────────

  const handleDownloadPDF = async () => {
    if (!invoice || downloadingPDF) return;
    setDownloadingPDF(true);
    try {
      const res = await fetch(`${API_BASE}/invoices/${invoice.id}/pdf`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      toast.error(err.message ?? "Could not download PDF");
    } finally {
      setDownloadingPDF(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loading) return <PageLoader />;
  if (!invoice) return null;

  const statusCfg = STATUS_CONFIG[invoice.status];
  const subtotal = invoice.items.reduce((s, i) => s + Number(i.amount), 0);
  const isOverdue =
    invoice.status !== "paid" && new Date(invoice.dueDate) < new Date();

  const cardStyle = {
    background: "#161b27",
    border: "1px solid rgba(255,255,255,0.07)",
  };

  return (
    <>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
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
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="text-[20px] sm:text-[28px] font-bold text-white font-mono tracking-tight">
                {invoice.invoiceNumber}
              </h1>
              <span
                className="px-2.5 py-1 rounded-full text-[13px] font-semibold"
                style={{ background: statusCfg.bg, color: statusCfg.color }}
              >
                {statusCfg.label}
              </span>
              <CopyButton text={invoice.invoiceNumber} label="number" />
            </div>
            <p className="text-[14px] text-white/40 mt-0.5">
              Created {formatDate(invoice.createdAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.55)",
              background: "rgba(255,255,255,0.04)",
            }}
            onMouseEnter={(e) => {
              if (!downloadingPDF) {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.08)";
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.85)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(255,255,255,0.04)";
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.55)";
            }}
          >
            {downloadingPDF ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}
            {downloadingPDF ? "Generating…" : "PDF"}
          </button>

          {invoice.status === "draft" && (
            <Button size="sm" onClick={() => setShowSendModal(true)}>
              <Send size={14} />
              Send to client
            </Button>
          )}

          {(invoice.status === "sent" || invoice.status === "overdue") && (
            <Button
              size="sm"
              loading={updatingStatus}
              onClick={() => updateStatus("paid")}
            >
              <CheckCircle size={14} />
              Mark as paid
            </Button>
          )}

          {invoice.status === "sent" && (
            <Button
              variant="secondary"
              size="sm"
              loading={updatingStatus}
              onClick={() => updateStatus("overdue")}
            >
              <Clock size={14} />
              Mark overdue
            </Button>
          )}

          <button
            onClick={() => setShowDelete(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "rgba(239,68,68,0.1)";
              (e.currentTarget as HTMLElement).style.color = "#f87171";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(239,68,68,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color =
                "rgba(255,255,255,0.3)";
              (e.currentTarget as HTMLElement).style.borderColor =
                "rgba(255,255,255,0.1)";
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* ── Invoice document card ── */}
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          {/* Brand bar — gradient */}
          <div
            className="h-1"
            style={{
              background: "linear-gradient(90deg, #2563eb, #7c3aed, #ec4899)",
            }}
          />

          {/* Invoice header */}
          <div
            className="p-5 sm:p-8"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <FileText size={18} className="text-brand-500" />
                  <span className="font-bold text-white text-[16px]">
                    Billd
                  </span>
                </div>
                <p className="text-[12px] text-white/30 uppercase tracking-widest mb-1">
                  Invoice
                </p>
                <p className="font-mono font-bold text-[24px] text-white">
                  {invoice.invoiceNumber}
                </p>
              </div>
              <div className="text-right space-y-4">
                <div>
                  <p className="text-[12px] text-white/30 uppercase tracking-widest mb-1">
                    Issued
                  </p>
                  <p className="font-mono text-[15px] text-white/70">
                    {formatDate(invoice.issueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-white/30 uppercase tracking-widest mb-1">
                    Due
                  </p>
                  <p
                    className={`font-mono text-[15px] font-semibold ${isOverdue ? "text-red-400" : "text-white/70"}`}
                  >
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div
            className="px-5 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div>
              <p className="text-[12px] text-white/30 uppercase tracking-widest mb-3">
                Bill To
              </p>
              <p className="font-semibold text-[16px] text-white">
                {invoice.client.name}
              </p>
              {invoice.client.companyName && (
                <p className="text-[14px] text-white/45 flex items-center gap-1.5 mt-1.5">
                  <Building2 size={13} /> {invoice.client.companyName}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                <p className="text-[14px] text-white/45 flex items-center gap-1.5">
                  <Mail size={13} /> {invoice.client.email}
                </p>
                <CopyButton text={invoice.client.email} label="email" />
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="px-5 sm:px-8 py-6">
            <div className="overflow-x-auto">
              <div style={{ minWidth: "400px" }}>
                {/* Table header */}
                <div
                  className="grid grid-cols-[1fr_70px_100px_100px] gap-3 sm:gap-4 pb-3 mb-1"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {["Item", "Qty", "Rate", "Amount"].map((h) => (
                    <p
                      key={h}
                      className="text-[12px] font-semibold text-white/30 uppercase tracking-widest text-right first:text-left"
                    >
                      {h}
                    </p>
                  ))}
                </div>

                {invoice.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_70px_100px_100px] gap-3 sm:gap-4 py-4"
                    style={{
                      borderBottom:
                        idx < invoice.items.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                    }}
                  >
                    <p className="text-[14px] sm:text-[15px] font-medium text-white/80">
                      {item.description}
                    </p>
                    <p className="text-[13px] sm:text-[14px] font-mono text-white/45 text-right">
                      {Number(item.quantity)}
                    </p>
                    <p className="text-[13px] sm:text-[14px] font-mono text-white/45 text-right">
                      {formatCurrency(Number(item.rate))}
                    </p>
                    <p className="text-[13px] sm:text-[14px] font-mono font-semibold text-white/80 text-right">
                      {formatCurrency(Number(item.amount))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Totals */}
          <div
            className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-3"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "1.5rem",
            }}
          >
            <div className="flex justify-between text-[15px] text-white/45">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[15px] text-white/25">
              <span>Tax (0%)</span>
              <span className="font-mono">$0.00</span>
            </div>
            <div
              className="flex justify-between font-bold text-white text-[20px] pt-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span>Total</span>
              <span className="font-mono">
                {formatCurrency(Number(invoice.totalAmount))}
              </span>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div
              className="px-5 sm:px-8 pb-6 sm:pb-8"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: "1.5rem",
              }}
            >
              <p className="text-[12px] text-white/30 uppercase tracking-widest mb-2">
                Notes
              </p>
              <p className="text-[15px] text-white/55 whitespace-pre-wrap leading-relaxed">
                {invoice.notes}
              </p>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Status stepper */}
          <StatusStepper
            current={invoice.status}
            onStep={updateStatus}
            loading={updatingStatus}
          />

          {/* Client summary */}
          <div className="rounded-2xl p-5" style={cardStyle}>
            <h3 className="text-[12px] font-semibold text-white/30 uppercase tracking-widest mb-4">
              Client
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-[13px] font-bold text-white shrink-0">
                {invoice.client.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-[15px] text-white">
                  {invoice.client.name}
                </p>
                {invoice.client.companyName && (
                  <p className="text-[13px] text-white/40">
                    {invoice.client.companyName}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14px] text-white/40 flex items-center gap-1.5">
                  <Mail size={13} className="shrink-0" /> {invoice.client.email}
                </p>
                <CopyButton text={invoice.client.email} />
              </div>
              {invoice.client.phone && (
                <p className="text-[14px] text-white/40 flex items-center gap-1.5">
                  <Calendar size={13} /> {invoice.client.phone}
                </p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl p-5" style={cardStyle}>
            <h3 className="text-[12px] font-semibold text-white/30 uppercase tracking-widest mb-4">
              Timeline
            </h3>
            <div className="space-y-3 text-[15px]">
              <div className="flex justify-between">
                <span className="text-white/40">Created</span>
                <span className="text-white/70 font-medium font-mono">
                  {formatDate(invoice.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Issued</span>
                <span className="text-white/70 font-medium font-mono">
                  {formatDate(invoice.issueDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Due</span>
                <span
                  className="font-medium font-mono"
                  style={{
                    color: isOverdue ? "#f87171" : "rgba(255,255,255,0.7)",
                  }}
                >
                  {formatDate(invoice.dueDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Amount summary */}
          <div className="rounded-2xl p-5" style={cardStyle}>
            <h3 className="text-[12px] font-semibold text-white/30 uppercase tracking-widest mb-4">
              Amount
            </h3>
            <p
              className="font-mono font-bold text-[30px] tracking-tight"
              style={{
                color:
                  invoice.status === "paid"
                    ? "#4ade80"
                    : invoice.status === "overdue"
                      ? "#f87171"
                      : "white",
              }}
            >
              {formatCurrency(Number(invoice.totalAmount))}
            </p>
            <p
              className="text-[13px] mt-1.5"
              style={{ color: statusCfg.color }}
            >
              {invoice.status === "paid"
                ? "Payment received"
                : invoice.status === "overdue"
                  ? "Past due date"
                  : invoice.status === "sent"
                    ? "Awaiting payment"
                    : "Not sent yet"}
            </p>
          </div>

          {/* Payment link — shown when invoice has been sent via Paystack */}
          {invoice.stripePaymentLink && (
            <div className="rounded-2xl p-5" style={cardStyle}>
              <h3 className="text-[12px] font-semibold text-white/30 uppercase tracking-widest mb-3">
                Payment link
              </h3>
              <a
                href={invoice.stripePaymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-150"
                style={{
                  background: "rgba(37,99,235,0.12)",
                  color: "#60a5fa",
                  border: "1px solid rgba(37,99,235,0.25)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(37,99,235,0.2)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(37,99,235,0.12)";
                }}
              >
                <ExternalLink size={14} className="shrink-0" />
                Open Paystack link
              </a>
              <div className="mt-3 flex items-center gap-2">
                <p className="text-[12px] text-white/25 truncate flex-1 font-mono">
                  {invoice.stripePaymentLink.replace("https://", "")}
                </p>
                <CopyButton text={invoice.stripePaymentLink} label="link" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete invoice"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDelete(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete invoice
            </Button>
          </>
        }
      >
        <div className="flex gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(239,68,68,0.15)" }}
          >
            <Trash2 size={18} className="text-red-400" />
          </div>
          <div>
            <p className="text-[15px] text-white/80">
              Delete{" "}
              <span className="font-semibold font-mono text-white">
                {invoice.invoiceNumber}
              </span>
              ?
            </p>
            <p className="text-[14px] text-white/40 mt-1.5 leading-relaxed">
              All line items will be removed. This cannot be undone.
            </p>
          </div>
        </div>
      </Modal>

      {/* Send invoice modal */}
      <Modal
        open={showSendModal}
        onClose={() => !sending && setShowSendModal(false)}
        title="Send invoice to client"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowSendModal(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button onClick={handleSendInvoice} loading={sending}>
              <Send size={14} />
              Send invoice
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div
            className="rounded-xl p-4 flex items-center gap-4"
            style={{
              background: "rgba(37,99,235,0.08)",
              border: "1px solid rgba(37,99,235,0.18)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-[13px] text-white"
              style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)" }}
            >
              {invoice.client.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-[15px] truncate">
                {invoice.client.name}
              </p>
              <p className="text-[13px] text-white/40 truncate">
                {invoice.client.email}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-mono font-bold text-white text-[16px]">
                {formatCurrency(Number(invoice.totalAmount))}
              </p>
              <p className="text-[12px] text-white/35 font-mono">
                {invoice.invoiceNumber}
              </p>
            </div>
          </div>
          <p className="text-[14px] text-white/55 leading-relaxed">
            This will email the invoice to{" "}
            <span className="text-white/80 font-medium">
              {invoice.client.email}
            </span>{" "}
            with a Paystack payment link so they can pay directly.
          </p>
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-2.5"
            style={{
              background: "rgba(74,222,128,0.07)",
              border: "1px solid rgba(74,222,128,0.15)",
            }}
          >
            <CheckCircle size={15} className="text-green-400 mt-0.5 shrink-0" />
            <p className="text-[13px] text-green-400/80 leading-relaxed">
              The invoice status will automatically change to{" "}
              <strong className="text-green-400">Sent</strong> and a Paystack
              payment link will be generated.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
