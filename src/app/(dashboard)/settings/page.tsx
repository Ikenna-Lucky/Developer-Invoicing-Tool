"use client";

import { useState, useEffect } from "react";
import { User, Building2, SlidersHorizontal, Check } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Tab = "profile" | "business" | "preferences";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile",     label: "Profile",     icon: User              },
  { id: "business",    label: "Business",    icon: Building2         },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
];

// ─── Save button — animates to checkmark ───────────────────────────────────────

function SaveButton({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold
                 transition-all duration-200 disabled:cursor-not-allowed"
      style={
        saving
          ? { background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }
          : { background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "white", boxShadow: "0 4px 16px rgba(37,99,235,0.25)" }
      }
    >
      {saving ? (
        <>
          <Check size={15} />
          Saved
        </>
      ) : (
        "Save changes"
      )}
    </button>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
  accent = "#60a5fa",
}: {
  title:        string;
  description?: string;
  children:     React.ReactNode;
  accent?:      string;
}) {
  return (
    <div
      className="rounded-2xl p-7 relative overflow-hidden"
      style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Accent top line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, ${accent}60, transparent 60%)` }} />

      <div className="mb-6">
        <h3 className="text-[16px] font-bold text-white mb-1">{title}</h3>
        {description && (
          <p className="text-[13px] text-white/35">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Avatar preview ────────────────────────────────────────────────────────────

function AvatarPreview({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-bold text-white shrink-0"
        style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
      >
        {initials}
      </div>
      <div>
        <p className="text-[14px] font-semibold text-white">{name || "Your Name"}</p>
        <p className="text-[12px] text-white/35 mt-0.5">Avatar is generated from your initials</p>
      </div>
    </div>
  );
}

// ─── Divider ───────────────────────────────────────────────────────────────────

const Divider = () => (
  <div className="h-px my-6" style={{ background: "rgba(255,255,255,0.06)" }} />
);

// ─── Main page ─────────────────────────────────────────────────────────────────

const LS_KEY = "billd_settings";

export default function SettingsPage() {
  const { user } = useAuth();
  const toast    = useToast();
  const [tab, setTab] = useState<Tab>("profile");

  // ── Form state (loads from localStorage) ──────────────────────────────────
  const [profile, setProfile] = useState({
    fullName: user?.fullName ?? "",
    phone:    "",
  });

  const [business, setBusiness] = useState({
    companyName: "",
    address:     "",
    taxId:       "",
    website:     "",
  });

  const [prefs, setPrefs] = useState({
    dueDays:       "14",
    currency:      "USD",
    defaultNotes:  "",
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile)  setProfile(p  => ({ ...p,  ...parsed.profile  }));
        if (parsed.business) setBusiness(b => ({ ...b,  ...parsed.business }));
        if (parsed.prefs)    setPrefs(pr   => ({ ...pr, ...parsed.prefs    }));
      }
    } catch { /* ignore */ }
  }, []);

  // Sync name from auth user if not locally overridden
  useEffect(() => {
    if (user?.fullName) {
      setProfile(p => p.fullName ? p : { ...p, fullName: user.fullName });
    }
  }, [user]);

  // ── Save helpers ───────────────────────────────────────────────────────────
  const [saving, setSaving] = useState<Tab | null>(null);

  const save = (section: Tab) => {
    setSaving(section);
    const current = (() => {
      try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}"); }
      catch { return {}; }
    })();
    localStorage.setItem(LS_KEY, JSON.stringify({
      ...current,
      [section === "profile" ? "profile" : section === "business" ? "business" : "prefs"]:
        section === "profile" ? profile : section === "business" ? business : prefs,
    }));
    toast.success(
      section === "profile"     ? "Profile saved"
      : section === "business" ? "Business info saved"
      : "Preferences saved"
    );
    setTimeout(() => setSaving(null), 2000);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.18em] mb-1.5">
          Account
        </p>
        <h1 className="text-[28px] font-bold text-white tracking-tight">Settings</h1>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">

        {/* ── Left tab rail ── */}
        <div
          className="w-52 shrink-0 rounded-2xl p-2 sticky top-6"
          style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold
                           transition-all duration-150 text-left"
                style={{
                  background: active ? "rgba(255,255,255,0.08)" : "transparent",
                  color:      active ? "white"                   : "rgba(255,255,255,0.4)",
                }}
              >
                <Icon size={15} style={{ color: active ? "#60a5fa" : "rgba(255,255,255,0.3)" }} />
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Right content ── */}
        <div className="flex-1 space-y-4">

          {/* ── PROFILE TAB ── */}
          {tab === "profile" && (
            <>
              <Section
                title="Your identity"
                description="How you appear across Billd and on your invoices."
                accent="#60a5fa"
              >
                <div className="space-y-5">
                  <AvatarPreview name={profile.fullName} />

                  <Divider />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Full name"
                      value={profile.fullName}
                      onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                      placeholder="Ikenna Obi"
                    />
                    <Input
                      label="Email address"
                      value={user?.email ?? ""}
                      disabled
                      hint="Email cannot be changed here."
                    />
                  </div>

                  <Input
                    label="Phone number"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+234 800 000 0000"
                    hint="Used on invoices when filled in."
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <SaveButton onClick={() => save("profile")} saving={saving === "profile"} />
                </div>
              </Section>
            </>
          )}

          {/* ── BUSINESS TAB ── */}
          {tab === "business" && (
            <>
              <Section
                title="Business details"
                description={`This information appears in the "from" section of every invoice you send.`}
                accent="#a78bfa"
              >
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Company name"
                      value={business.companyName}
                      onChange={(e) => setBusiness(b => ({ ...b, companyName: e.target.value }))}
                      placeholder="Acme Design Studio"
                    />
                    <Input
                      label="Website"
                      type="url"
                      value={business.website}
                      onChange={(e) => setBusiness(b => ({ ...b, website: e.target.value }))}
                      placeholder="https://yoursite.com"
                    />
                  </div>

                  <Textarea
                    label="Business address"
                    value={business.address}
                    onChange={(e) => setBusiness(b => ({ ...b, address: e.target.value }))}
                    placeholder={"123 Lagos Island\nLagos, Nigeria"}
                    rows={3}
                    hint="Shown on invoice PDFs."
                  />

                  <Input
                    label="Tax / VAT ID"
                    value={business.taxId}
                    onChange={(e) => setBusiness(b => ({ ...b, taxId: e.target.value }))}
                    placeholder="e.g. VAT-12345678"
                    hint="Optional. Appears on invoice footer."
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <SaveButton onClick={() => save("business")} saving={saving === "business"} />
                </div>
              </Section>
            </>
          )}

          {/* ── PREFERENCES TAB ── */}
          {tab === "preferences" && (
            <>
              <Section
                title="Invoice defaults"
                description="Pre-fill new invoices so you spend less time on repetitive inputs."
                accent="#4ade80"
              >
                <div className="space-y-5">
                  {/* Due days + currency */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Due days */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-semibold text-white/60 uppercase tracking-wider">
                        Default payment terms
                      </label>
                      <select
                        value={prefs.dueDays}
                        onChange={(e) => setPrefs(p => ({ ...p, dueDays: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-[15px] text-white
                                   focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        {[
                          { value: "7",  label: "Net 7 — due in 7 days"  },
                          { value: "14", label: "Net 14 — due in 14 days" },
                          { value: "30", label: "Net 30 — due in 30 days" },
                          { value: "60", label: "Net 60 — due in 60 days" },
                        ].map(o => (
                          <option key={o.value} value={o.value}
                            style={{ background: "#1c2333", color: "white" }}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Currency */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-semibold text-white/60 uppercase tracking-wider">
                        Currency
                      </label>
                      <select
                        value={prefs.currency}
                        onChange={(e) => setPrefs(p => ({ ...p, currency: e.target.value }))}
                        className="w-full rounded-xl px-4 py-3 text-[15px] text-white
                                   focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                      >
                        {[
                          { value: "USD", label: "USD — US Dollar"          },
                          { value: "EUR", label: "EUR — Euro"                },
                          { value: "GBP", label: "GBP — British Pound"       },
                          { value: "NGN", label: "NGN — Nigerian Naira"      },
                          { value: "CAD", label: "CAD — Canadian Dollar"     },
                          { value: "AUD", label: "AUD — Australian Dollar"   },
                        ].map(o => (
                          <option key={o.value} value={o.value}
                            style={{ background: "#1c2333", color: "white" }}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Textarea
                    label="Default invoice notes"
                    value={prefs.defaultNotes}
                    onChange={(e) => setPrefs(p => ({ ...p, defaultNotes: e.target.value }))}
                    placeholder={"Payment due within 14 days.\nBank transfer preferred.\nThank you for your business."}
                    rows={4}
                    hint="Pre-filled on every new invoice. You can always edit per invoice."
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <SaveButton onClick={() => save("preferences")} saving={saving === "preferences"} />
                </div>
              </Section>

              {/* Danger zone */}
              <Section
                title="Danger zone"
                description="Permanent actions that cannot be undone."
                accent="#f87171"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-white/70">Delete account</p>
                    <p className="text-[13px] text-white/30 mt-0.5">
                      Permanently remove your account and all invoice data.
                    </p>
                  </div>
                  <button
                    disabled
                    className="px-4 py-2 rounded-xl text-[14px] font-semibold transition-colors"
                    style={{
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "rgba(248,113,113,0.5)",
                      cursor: "not-allowed",
                    }}
                  >
                    Delete account
                  </button>
                </div>
              </Section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
