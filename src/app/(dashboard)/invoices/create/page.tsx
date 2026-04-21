"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency } from "@/lib/utils";
import { apiRequest, API_BASE } from "@/lib/api";
import type { Client, ApiResponse, Invoice } from "@/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LineItem {
  id:          string;
  description: string;
  quantity:    string;
  rate:        string;
}

const emptyItem = (): LineItem => ({
  id:          crypto.randomUUID(),
  description: "",
  quantity:    "1",
  rate:        "",
});

// ─── Shared dark input class ────────────────────────────────────────────────────

const darkInput =
  "w-full rounded-xl px-3 py-2.5 text-[14px] text-white placeholder:text-white/20 " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all duration-200";

const darkInputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
};

const darkInputErrorStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(239,68,68,0.45)",
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function CreateInvoicePage() {
  const router = useRouter();
  const toast  = useToast();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [clients,        setClients]        = useState<Client[]>([]);
  const [clientId,       setClientId]       = useState("");
  const [issueDate,      setIssueDate]      = useState(() => new Date().toISOString().split("T")[0]);
  const [dueDate,        setDueDate]        = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [notes,          setNotes]          = useState("");
  const [items,          setItems]          = useState<LineItem[]>([emptyItem()]);
  const [errors,         setErrors]         = useState<Record<string, string>>({});
  const [submitting,     setSubmitting]     = useState(false);
  const [loadingClients, setLoadingClients] = useState(true);

  // ── Load clients on mount ────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/clients`, { credentials: "include" });
        if (!res.ok) throw new Error();
        const { data } = await res.json();
        setClients(data);
        if (data.length > 0) setClientId(data[0].id);
      } catch {
        toast.error("Could not load clients.");
      } finally {
        setLoadingClients(false);
      }
    };
    load();
  }, []);

  // ── Line item helpers ────────────────────────────────────────────────────────

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof Omit<LineItem, "id">, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // ── Live totals ──────────────────────────────────────────────────────────────

  const subtotal = items.reduce((sum, item) => {
    const qty  = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate)     || 0;
    return sum + qty * rate;
  }, 0);

  // ── Validation ───────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!clientId)   errs.clientId  = "Please select a client";
    if (!issueDate)  errs.issueDate = "Issue date is required";
    if (!dueDate)    errs.dueDate   = "Due date is required";
    if (dueDate < issueDate) errs.dueDate = "Due date must be after issue date";

    items.forEach((item, i) => {
      if (!item.description.trim()) errs[`item_${i}_desc`] = "Description required";
      if (!item.quantity || parseFloat(item.quantity) <= 0) errs[`item_${i}_qty`] = "Invalid";
      if (!item.rate     || parseFloat(item.rate)     <= 0) errs[`item_${i}_rate`] = "Invalid";
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      const payload = {
        clientId,
        issueDate: new Date(issueDate).toISOString(),
        dueDate:   new Date(dueDate).toISOString(),
        notes:     notes.trim() || undefined,
        items: items.map((item) => ({
          description: item.description.trim(),
          quantity:    parseFloat(item.quantity),
          rate:        parseFloat(item.rate),
        })),
      };

      const res = await apiRequest<ApiResponse<Invoice>>("/invoices", {
        method: "POST",
        body:   payload,
      });

      toast.success(`${res.data.invoiceNumber} created successfully`);
      router.push(`/invoices/${res.data.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Card style helpers ───────────────────────────────────────────────────────

  const cardStyle = {
    background: "#161b27",
    border: "1px solid rgba(255,255,255,0.07)",
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl">
      {/* Page header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/invoices"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
          }}
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-[28px] font-bold text-white tracking-tight">New invoice</h1>
          <p className="text-[15px] text-white/40 mt-1">Fill in the details below</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">

        {/* ── Main form column ── */}
        <div className="space-y-5">

          {/* Client + dates card */}
          <div className="rounded-2xl p-6" style={cardStyle}>
            <h2 className="text-[15px] font-semibold text-white/60 uppercase tracking-widest mb-5">
              Invoice details
            </h2>

            {/* Client selector */}
            <div className="mb-5">
              <label className="block text-[14px] font-semibold text-white/50 uppercase tracking-wider mb-2">
                Bill to <span className="text-red-400 ml-0.5">*</span>
              </label>
              {loadingClients ? (
                <div
                  className="h-12 rounded-xl animate-pulse"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                />
              ) : clients.length === 0 ? (
                <div
                  className="p-3.5 rounded-xl text-[14px]"
                  style={{
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    color: "#fbbf24",
                  }}
                >
                  No clients yet.{" "}
                  <Link href="/clients" className="font-semibold underline">Add one first →</Link>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full appearance-none rounded-xl px-4 py-3 text-[15px] text-white pr-10
                               focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all duration-200
                               cursor-pointer"
                    style={darkInputStyle}
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id} style={{ background: "#1c2333", color: "white" }}>
                        {c.name}{c.companyName ? ` — ${c.companyName}` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              )}
              {errors.clientId && (
                <p className="text-[12px] text-red-400 mt-1.5">{errors.clientId}</p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Issue date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                error={errors.issueDate}
                required
              />
              <Input
                label="Due date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                error={errors.dueDate}
                required
              />
            </div>
          </div>

          {/* Line items card */}
          <div className="rounded-2xl p-6" style={cardStyle}>
            <h2 className="text-[15px] font-semibold text-white/60 uppercase tracking-widest mb-5">
              Line items
            </h2>

            {/* Table header */}
            <div className="grid grid-cols-[1fr_80px_100px_80px_36px] gap-3 mb-3 px-1">
              {["Description", "Qty", "Rate", "Amount", ""].map((h) => (
                <p key={h} className="text-[12px] font-semibold text-white/30 uppercase tracking-widest">
                  {h}
                </p>
              ))}
            </div>

            {/* Rows */}
            <div className="space-y-2.5">
              {items.map((item, i) => {
                const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);

                return (
                  <div key={item.id} className="grid grid-cols-[1fr_80px_100px_80px_36px] gap-3 items-start">
                    {/* Description */}
                    <div>
                      <input
                        type="text"
                        placeholder="e.g. Frontend development"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        className={darkInput}
                        style={errors[`item_${i}_desc`] ? darkInputErrorStyle : darkInputStyle}
                      />
                    </div>

                    {/* Quantity */}
                    <div>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                        className={darkInput}
                        style={errors[`item_${i}_qty`] ? darkInputErrorStyle : darkInputStyle}
                      />
                    </div>

                    {/* Rate */}
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[14px]">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                        className={`${darkInput} pl-6`}
                        style={errors[`item_${i}_rate`] ? darkInputErrorStyle : darkInputStyle}
                      />
                    </div>

                    {/* Computed amount */}
                    <div className="flex items-center py-2.5">
                      <span className="font-mono text-[14px] font-medium text-white/60">
                        {amount > 0 ? formatCurrency(amount) : "—"}
                      </span>
                    </div>

                    {/* Remove row */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20
                                   hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider */}
            <div className="mt-5 mb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

            {/* Add row */}
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 text-[14px] font-semibold text-brand-400
                         hover:text-brand-300 transition-colors"
            >
              <Plus size={14} />
              Add line item
            </button>
          </div>

          {/* Notes card */}
          <div className="rounded-2xl p-6" style={cardStyle}>
            <Textarea
              label="Notes (optional)"
              placeholder="Payment terms, bank details, or a thank-you note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* ── Sidebar: totals + actions ── */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5 sticky top-6" style={cardStyle}>
            <h2 className="text-[15px] font-semibold text-white/60 uppercase tracking-widest mb-5">
              Summary
            </h2>

            <div className="space-y-3 text-[14px]">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span className="font-mono text-white/70">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Tax</span>
                <span className="font-mono text-white/25">$0.00</span>
              </div>
              <div
                className="flex justify-between font-bold text-white pt-3 text-[15px]"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span>Total</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                onClick={handleSubmit}
                loading={submitting}
                disabled={clients.length === 0}
                className="w-full"
                size="md"
              >
                Save as draft
              </Button>
              <p className="text-[13px] text-center text-white/25">
                You can send it to the client from the invoice page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
