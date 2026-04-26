"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Plus,
  ExternalLink,
  AlertCircle,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  Pencil,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea } from "@/components/ui/Input";
import { PageLoader } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { formatDate, formatCurrency } from "@/lib/utils";
import { API_BASE } from "@/lib/api";
import type { Client, Invoice, InvoiceStatus } from "@/types";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<
  InvoiceStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  draft: {
    label: "Draft",
    bg: "rgba(255,255,255,0.07)",
    color: "rgba(255,255,255,0.45)",
    dot: "rgba(255,255,255,0.3)",
  },
  sent: {
    label: "Sent",
    bg: "rgba(59,130,246,0.13)",
    color: "#60a5fa",
    dot: "#60a5fa",
  },
  paid: {
    label: "Paid",
    bg: "rgba(34,197,94,0.12)",
    color: "#4ade80",
    dot: "#4ade80",
  },
  overdue: {
    label: "Overdue",
    bg: "rgba(239,68,68,0.12)",
    color: "#f87171",
    dot: "#f87171",
  },
};

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??"
  );
}

// ─── Count-up animation ────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 900, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) {
      setVal(0);
      return;
    }
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start - delay;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      setVal(Math.round(ease * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return val;
}

// ─── Stat pill ────────────────────────────────────────────────────────────────

function StatPill({
  label,
  value,
  color,
  delay = 0,
}: {
  label: string;
  value: number;
  color: string;
  delay?: number;
}) {
  const counted = useCountUp(value, 900, delay);
  return (
    <div
      className="flex-1 min-w-0 rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: "#161b27",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          background: `radial-gradient(circle at 20% 50%, ${color}, transparent 70%)`,
        }}
      />
      <p className="text-[12px] font-bold text-white/30 uppercase tracking-[0.15em] mb-2">
        {label}
      </p>
      <p
        className="text-[26px] font-bold font-mono leading-none"
        style={{ color }}
      >
        {formatCurrency(counted)}
      </p>
    </div>
  );
}

// ─── Invoice timeline row ──────────────────────────────────────────────────────

function InvoiceRow({ inv, index }: { inv: Invoice; index: number }) {
  const cfg = STATUS_CFG[inv.status];
  const isOverdue = inv.status !== "paid" && new Date(inv.dueDate) < new Date();

  return (
    <Link
      href={`/invoices/${inv.id}`}
      className="group flex items-center gap-5 px-6 py-4 transition-colors"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        animationDelay: `${index * 50}ms`,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.025)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Status dot + line (timeline) */}
      <div className="flex flex-col items-center self-stretch py-1 shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
          style={{ background: cfg.dot, boxShadow: `0 0 8px ${cfg.dot}` }}
        />
        <div
          className="flex-1 w-px mt-2"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono font-semibold text-[14px] text-white/70 tracking-wide">
            {inv.invoiceNumber}
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {isOverdue && <AlertCircle size={10} />}
            {cfg.label}
          </span>
        </div>
        <p className="text-[13px] text-white/30">
          Issued {formatDate(inv.issueDate)} · Due {formatDate(inv.dueDate)}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right shrink-0">
        <p className="font-mono font-bold text-[16px] text-white">
          {formatCurrency(Number(inv.totalAmount))}
        </p>
        <p className="text-[12px] text-white/25 mt-0.5">
          {formatDate(inv.createdAt)}
        </p>
      </div>

      <ExternalLink
        size={14}
        className="text-white/15 group-hover:text-white/40 transition-colors shrink-0"
      />
    </Link>
  );
}

// ─── Edit client form (inline modal) ─────────────────────────────────────────

interface EditForm {
  name: string;
  email: string;
  companyName: string;
  phone: string;
  address: string;
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    email: "",
    companyName: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    try {
      const [clientRes, invoiceRes] = await Promise.all([
        fetch(`${API_BASE}/clients/${params.id}`, { credentials: "include" }),
        fetch(`${API_BASE}/invoices?clientId=${params.id}`, {
          credentials: "include",
        }),
      ]);

      if (!clientRes.ok) throw new Error("Client not found");

      const clientJson = await clientRes.json();
      const invoiceJson = invoiceRes.ok
        ? await invoiceRes.json()
        : { data: [] };

      setClient(clientJson.data);
      setInvoices(invoiceJson.data ?? []);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to load client");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  // ── Computed stats ─────────────────────────────────────────────────────────

  const totalBilled = invoices.reduce((s, i) => s + Number(i.totalAmount), 0);
  const totalCollected = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + Number(i.totalAmount), 0);
  const outstanding = invoices
    .filter((i) => i.status === "sent" || i.status === "overdue")
    .reduce((s, i) => s + Number(i.totalAmount), 0);
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;
  const collectionRate =
    totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  // Sort newest first
  const sorted = [...invoices].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // ── Edit handler ───────────────────────────────────────────────────────────

  const openEdit = () => {
    if (!client) return;
    setEditForm({
      name: client.name,
      email: client.email,
      companyName: client.companyName ?? "",
      phone: client.phone ?? "",
      address: client.address ?? "",
    });
    setShowEdit(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/clients/${params.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setClient(json.data);
      setShowEdit(false);
      toast.success("Client updated");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete handler ─────────────────────────────────────────────────────────

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/clients/${params.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Delete failed");
      }
      toast.success("Client deleted");
      router.push("/clients");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────────────

  if (loading) return <PageLoader />;
  if (!client)
    return (
      <div className="flex flex-col items-center justify-center py-32 text-white/30">
        <FileText size={40} className="mb-4" />
        <p className="text-[16px]">Client not found</p>
      </div>
    );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Back nav */}
      <button
        onClick={() => router.push("/clients")}
        className="flex items-center gap-2 text-[13px] text-white/35 hover:text-white/70 transition-colors mb-7 group"
      >
        <ArrowLeft
          size={15}
          className="group-hover:-translate-x-0.5 transition-transform"
        />
        All clients
      </button>

      {/* ── Hero card ── */}
      <div
        className="rounded-2xl p-5 sm:p-8 mb-5 relative overflow-hidden"
        style={{
          background: "#161b27",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-0 right-0 w-80 h-80 opacity-[0.06] pointer-events-none"
          style={{
            background: "radial-gradient(circle, #7c3aed, transparent 65%)",
            transform: "translate(30%, -30%)",
          }}
        />
        {/* Accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, #7c3aed60, #2563eb60, transparent 60%)",
          }}
        />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 sm:gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Avatar */}
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center text-[22px] sm:text-[26px] font-bold text-white shrink-0"
              style={{
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                boxShadow: "0 8px 32px rgba(124,58,237,0.35)",
              }}
            >
              {initials(client.name)}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-[22px] sm:text-[28px] font-bold text-white tracking-tight leading-tight">
                {client.name}
              </h1>
              {client.companyName && (
                <p className="text-[14px] sm:text-[15px] text-white/40 flex items-center gap-2 mt-1">
                  <Building2 size={13} />
                  {client.companyName}
                </p>
              )}

              {/* Contact chips */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
                <a
                  href={`mailto:${client.email}`}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-[12px] sm:text-[13px] text-white/55 hover:text-brand-400 transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Mail size={12} />
                  <span className="truncate max-w-[160px] sm:max-w-none">
                    {client.email}
                  </span>
                </a>
                {client.phone && (
                  <span
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-[12px] sm:text-[13px] text-white/45"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <Phone size={12} />
                    {client.phone}
                  </span>
                )}
                {client.address && (
                  <span
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-[12px] sm:text-[13px] text-white/40"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <MapPin size={12} />
                    <span className="truncate max-w-[140px] sm:max-w-none">
                      {client.address.split("\n")[0]}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:shrink-0">
            <Link
              href={`/invoices/create?clientId=${client.id}`}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                boxShadow: "0 4px 16px rgba(37,99,235,0.25)",
              }}
            >
              <Plus size={14} />
              New invoice
            </Link>
            <button
              onClick={openEdit}
              className="p-2.5 rounded-xl text-white/35 hover:text-white/70 transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="p-2.5 rounded-xl text-white/35 hover:text-red-400 transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div
          className="flex flex-wrap items-center gap-3 sm:gap-6 mt-5 sm:mt-6 pt-5 sm:pt-6 relative z-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-[12px] text-white/25">
            Client since {formatDate(client.createdAt)}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/15" />
          <span className="text-[12px] text-white/25">
            {invoices.length} {invoices.length === 1 ? "invoice" : "invoices"}{" "}
            total
          </span>
          {overdueCount > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/15" />
              <span className="flex items-center gap-1.5 text-[12px] text-red-400">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                {overdueCount} overdue
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:flex gap-3 sm:gap-4 mb-5">
        <StatPill
          label="Total Billed"
          value={totalBilled}
          color="rgba(255,255,255,0.6)"
          delay={0}
        />
        <StatPill
          label="Collected"
          value={totalCollected}
          color="#4ade80"
          delay={60}
        />
        <StatPill
          label="Outstanding"
          value={outstanding}
          color="#60a5fa"
          delay={120}
        />

        {/* Collection rate tile */}
        <div
          className="min-w-0 sm:flex-1 rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: "#161b27",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              background:
                "radial-gradient(circle at 20% 50%, #a78bfa, transparent 70%)",
            }}
          />
          <p className="text-[12px] font-bold text-white/30 uppercase tracking-[0.15em] mb-2">
            Collection Rate
          </p>
          <div className="flex items-end gap-3">
            <p className="text-[26px] font-bold font-mono leading-none text-white">
              {collectionRate}%
            </p>
            <div className="flex-1 mb-1.5">
              {/* Progress bar */}
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${collectionRate}%`,
                    background:
                      collectionRate >= 80
                        ? "#4ade80"
                        : collectionRate >= 50
                          ? "#60a5fa"
                          : "#f87171",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Invoice timeline ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#161b27",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h2 className="text-[16px] font-bold text-white">
              Invoice history
            </h2>
            <p className="text-[13px] text-white/30 mt-0.5">
              Every transaction with {client.name}
            </p>
          </div>
          <Link
            href={`/invoices/create?clientId=${client.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white/60 hover:text-white transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Plus size={13} />
            New invoice
          </Link>
        </div>

        {/* Status summary chips */}
        {invoices.length > 0 &&
          (() => {
            const counts: Record<string, number> = {};
            invoices.forEach((i) => {
              counts[i.status] = (counts[i.status] ?? 0) + 1;
            });
            return (
              <div
                className="px-6 py-3 flex items-center gap-2.5 flex-wrap"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
              >
                {(["paid", "sent", "overdue", "draft"] as InvoiceStatus[])
                  .filter((s) => counts[s])
                  .map((s) => {
                    const c = STATUS_CFG[s];
                    return (
                      <span
                        key={s}
                        className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[12px] font-semibold"
                        style={{ background: c.bg, color: c.color }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: c.dot }}
                        />
                        {counts[s]} {c.label}
                      </span>
                    );
                  })}
              </div>
            );
          })()}

        {/* Rows */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <FileText size={22} className="text-white/25" />
            </div>
            <p className="text-[14px] font-semibold text-white/40">
              No invoices yet
            </p>
            <p className="text-[13px] text-white/25 mt-1 mb-6">
              Create the first invoice for this client
            </p>
            <Link
              href={`/invoices/create?clientId=${client.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              }}
            >
              <Plus size={14} />
              Create invoice
            </Link>
          </div>
        ) : (
          <div>
            {sorted.map((inv, i) => (
              <InvoiceRow key={inv.id} inv={inv} index={i} />
            ))}
          </div>
        )}

        {/* Footer */}
        {sorted.length > 0 && (
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.01)",
            }}
          >
            <p className="text-[13px] text-white/25">
              {sorted.length} {sorted.length === 1 ? "invoice" : "invoices"} ·{" "}
              {formatDate(client.createdAt)} to present
            </p>
            <p className="text-[13px] font-mono text-white/25">
              {formatCurrency(totalBilled)} lifetime
            </p>
          </div>
        )}
      </div>

      {/* ── Edit modal ── */}
      <Modal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit client"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowEdit(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Save changes
            </Button>
          </>
        }
      >
        <div className=