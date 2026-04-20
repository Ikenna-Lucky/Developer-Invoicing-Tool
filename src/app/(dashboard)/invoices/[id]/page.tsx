"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Trash2, Send, CheckCircle,
  Clock, FileText, Building2, Mail, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageLoader } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { formatDate, formatCurrency } from "@/lib/utils";
import { apiRequest, API_BASE } from "@/lib/api";
import type { Invoice, InvoiceItem, Client, InvoiceStatus, ApiResponse } from "@/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FullInvoice extends Invoice {
  items:  InvoiceItem[];
  client: Client;
}

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; bg: string; color: string }> = {
  draft:   { label: "Draft",   bg: "rgba(255,255,255,0.08)",  color: "rgba(255,255,255,0.5)"  },
  sent:    { label: "Sent",    bg: "rgba(59,130,246,0.15)",   color: "#60a5fa"                },
  paid:    { label: "Paid",    bg: "rgba(34,197,94,0.12)",    color: "#4ade80"                },
  overdue: { label: "Overdue", bg: "rgba(239,68,68,0.12)",    color: "#f87171"                },
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast  = useToast();

  const [invoice,        setInvoice]        = useState<FullInvoice | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [showDelete,     setShowDelete]      = useState(false);
  const [deleting,       setDeleting]        = useState(false);
  const [updatingStatus, setUpdatingStatus]  = useState(false);

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
      await apiRequest<ApiResponse<Invoice>>(
        `/invoices/${invoice.id}/status`,
        { method: "PATCH", body: { status } }
      );
      setInvoice((prev) => prev ? { ...prev, status } : prev);
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

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loading) return <PageLoader />;
  if (!invoice) return null;

  const statusCfg = STATUS_CONFIG[invoice.status];
  const subtotal  = invoice.items.reduce((s, i) => s + Number(i.amount), 0);
  const isOverdue = invoice.status !== "paid" && new Date(invoice.dueDate) < new Date();

  const cardStyle = {
    background: "#161b27",
    border: "1px solid rgba(255,255,255,0.07)",
  };

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/invoices"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[28px] font-bold text-white font-mono tracking-tight">
                {invoice.invoiceNumber}
              </h1>
              <span
                className="px-2.5 py-1 rounded-full text-[12px] font-semibold"
                style={{ background: statusCfg.bg, color: statusCfg.color }}
              >
                {statusCfg.label}
              </span>
            </div>
            <p className="text-[14px] text-white/40 mt-0.5">
              Created {formatDate(invoice.createdAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {invoice.status === "draft" && (
            <Button
              variant="secondary"
              size="sm"
              loading={updatingStatus}
              onClick={() => updateStatus("sent")}
            >
              <Send size={14} />
              Mark as sent
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
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)";
              (e.currentTarget as HTMLElement).style.color = "#f87171";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.3)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

        {/* ── Invoice document card ── */}
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>

          {/* Brand bar */}
          <div className="h-1 bg-brand-600" />

          {/* Invoice header */}
          <div className="p-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <FileText size={18} className="text-brand-500" />
                  <span className="font-bold text-white text-[15px]">Billd</span>
                </div>
                <p className="text-[11px] text-white/30 uppercase tracking-widest mb-1">Invoice</p>
                <p className="font-mono font-bold text-[22px] text-white">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right space-y-4">
                <div>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest mb-1">Issued</p>
                  <p className="font-mono text-[14px] text-white/70">{formatDate(invoice.issueDate)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-white/30 uppercase tracking-widest mb-1">Due</p>
                  <p className={`font-mono text-[14px] font-semibold ${isOverdue ? "text-red-400" : "text-white/70"}`}>
                    {formatDate(invoice.dueDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* From / Bill To */}
          <div className="px-8 py-6 grid grid-cols-2 gap-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <p className="text-[11px] text-white/30 uppercase tracking-widest mb-2">Bill To</p>
              <p className="font-semibold text-[15px] text-white">{invoice.client.name}</p>
              {invoice.client.companyName && (
                <p className="text-[13px] text-white/45 flex items-center gap-1 mt-1">
                  <Building2 size={12} /> {invoice.client.companyName}
                </p>
              )}
              <p className="text-[13px] text-white/45 flex items-center gap-1 mt-1">
                <Mail size={12} /> {invoice.client.email}
              </p>
            </div>
          </div>

          {/* Line items */}
          <div className="px-8 py-6">
            {/* Table header */}
            <div
              className="grid grid-cols-[1fr_80px_100px_100px] gap-4 pb-3 mb-1"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              {["Item", "Qty", "Rate", "Amount"].map((h) => (
                <p key={h} className="text-[10px] font-semibold text-white/30 uppercase tracking-widest text-right first:text-left">
                  {h}
                </p>
              ))}
            </div>

            {invoice.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_80px_100px_100px] gap-4 py-3.5 last:border-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                <p className="text-[14px] font-medium text-white/80">{item.description}</p>
                <p className="text-[13px] font-mono text-white/45 text-right">{Number(item.quantity)}</p>
                <p className="text-[13px] font-mono text-white/45 text-right">{formatCurrency(Number(item.rate))}</p>
                <p className="text-[13px] font-mono font-semibold text-white/80 text-right">
                  {formatCurrency(Number(item.amount))}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-8 pb-8 space-y-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem" }}>
            <div className="flex justify-between text-[14px] text-white/45">
              <span>Subtotal</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[14px] text-white/25">
              <span>Tax (0%)</span>
              <span className="font-mono">$0.00</span>
            </div>
            <div
              className="flex justify-between font-bold text-white text-[17px] pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span>Total</span>
              <span className="font-mono">{formatCurrency(Number(invoice.totalAmount))}</span>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="px-8 pb-8">
              <p className="text-[11px] text-white/30 uppercase tracking-widest mb-2">Notes</p>
              <p className="text-[14px] text-white/55 whitespace-pre-wrap leading-relaxed">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">

          {/* Client summary */}
          <div className="rounded-2xl p-5" style={cardStyle}>
            <h3 className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-4">Client</h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-[12px] font-bold text-white shrink-0">
                {invoice.client.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p className="font-semibold text-[14px] text-white">{invoice.client.name}</p>
                {invoice.client.companyName && (
                  <p className="text-[12px] text-white/40">{invoice.client.companyName}</p>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-2 text-[13px] text-white/40">
              <p className="flex items-center gap-1.5">
                <Mail size={12} /> {invoice.client.email}
              </p>
              {invoice.client.phone && (
                <p className="flex items-center gap-1.5">
                  <Calendar size={12} /> {invoice.client.phone}
                </p>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl p-5" style={cardStyle}>
            <h3 className="text-[11px] font-semibold text-white/30 uppercase tracking-widest mb-4">Timeline</h3>
            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between">
                <span className="text-white/40">Created</span>
                <span className="text-white/70 font-medium">{formatDate(invoice.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Issued</span>
                <span className="text-white/70 font-medium">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Due</span>
                <span
                  className="font-medium"
                  style={{ color: isOverdue ? "#f87171" : "rgba(255,255,255,0.7)" }}
                >
                  {formatDate(invoice.dueDate)}
                </span>
              </div>
            </div>
          </div>
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
            <Button variant="secondary" onClick={() => setShowDelete(false)} disabled={deleting}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>Delete invoice</Button>
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
            <p className="text-[14px] text-white/80">
              Delete <span className="font-semibold font-mono text-white">{invoice.invoiceNumber}</span>?
            </p>
            <p className="text-[13px] text-white/40 mt-1.5 leading-relaxed">
              All line items will be removed. This cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
