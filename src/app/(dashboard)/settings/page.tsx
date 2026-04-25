"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Building2,
  SlidersHorizontal,
  Check,
  Camera,
  X,
  Upload,
} from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { apiRequest } from "@/lib/api";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Tab = "profile" | "business" | "preferences";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "business", label: "Business", icon: Building2 },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
];

// ─── Save button — animates to checkmark ───────────────────────────────────────

function SaveButton({
  onClick,
  saving,
}: {
  onClick: () => void;
  saving: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold
                 transition-all duration-200 disabled:cursor-not-allowed"
      style={
        saving
          ? {
              background: "rgba(74,222,128,0.15)",
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.25)",
            }
          : {
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "white",
              boxShadow: "0 4px 16px rgba(37,99,235,0.25)",
            }
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
  title: string;
  description?: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-7 relative overflow-hidden"
      style={{
        background: "#161b27",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Accent top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, ${accent}60, transparent 60%)`,
        }}
      />

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

// ─── Avatar editor ─────────────────────────────────────────────────────────────

function AvatarEditor({
  name,
  avatarUrl,
  onAvatarChange,
}: {
  name: string;
  avatarUrl: string;
  onAvatarChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onAvatarChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Avatar circle with upload overlay */}
      <div className="relative shrink-0 group/av">
        <div
          className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-[22px] font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            boxShadow: "0 8px 24px rgba(124,58,237,0.3)",
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        {/* Hover overlay */}
        <button
          onClick={() => fileRef.current?.click()}
          className="absolute inset-0 rounded-full flex items-center justify-center
                     opacity-0 group-hover/av:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <Camera size={18} className="text-white" />
        </button>
        {/* Remove button */}
        {avatarUrl && (
          <button
            onClick={() => onAvatarChange("")}
            title="Remove photo"
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center
                       opacity-0 group-hover/av:opacity-100 transition-opacity duration-200 z-10"
            style={{ background: "#ef4444", border: "1.5px solid #0d1117" }}
          >
            <X size={10} className="text-white" />
          </button>
        )}
      </div>

      <div className="flex-1">
        <p className="text-[15px] font-semibold text-white mb-0.5">
          {name || "Your Name"}
        </p>
        <p className="text-[12px] text-white/35 mb-3">
          {avatarUrl
            ? "Photo uploaded — hover avatar to change"
            : "Upload a photo or leave blank for initials"}
        </p>

        {/* Drop zone / button */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl cursor-pointer transition-all duration-150 w-fit"
          style={{
            background: drag
              ? "rgba(37,99,235,0.15)"
              : "rgba(255,255,255,0.05)",
            border: `1px solid ${drag ? "rgba(37,99,235,0.4)" : "rgba(255,255,255,0.1)"}`,
          }}
        >
          <Upload size={13} className="text-white/40" />
          <span className="text-[13px] font-semibold text-white/50">
            {drag ? "Drop to upload" : "Upload photo"}
          </span>
        </div>
        <p className="text-[11px] text-white/20 mt-2">
          JPG, PNG or GIF · max 4 MB
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
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
  const { user, refreshUser, setAvatarUrl } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("profile");

  // ── Form state (loads from localStorage) ──────────────────────────────────
  const [profile, setProfile] = useState({
    fullName: user?.fullName ?? "",
    phone: "",
    avatarUrl: "",
  });

  const [business, setBusiness] = useState({
    companyName: "",
    address: "",
    taxId: "",
    website: "",
  });

  const [prefs, setPrefs] = useState({
    dueDays: "14",
    currency: "USD",
    defaultNotes: "",
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile((p) => ({ ...p, ...parsed.profile }));
        if (parsed.business) setBusiness((b) => ({ ...b, ...parsed.business }));
        if (parsed.prefs) setPrefs((pr) => ({ ...pr, ...parsed.prefs }));
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Sync auth user fields if not locally overridden — ensures DB values pre-fill on fresh sessions
  useEffect(() => {
    if (!user) return;
    setProfile((p) => ({
      ...p,
      fullName: p.fullName || user.fullName || "",
      phone: p.phone || user.phone || "",
      avatarUrl: p.avatarUrl || user.logoUrl || "",
    }));
  }, [user]);

  // ── Save helpers ───────────────────────────────────────────────────────────
  const [saving, setSaving] = useState<Tab | null>(null);

  const save = async (section: Tab) => {
    setSaving(section);

    // Always persist to localStorage immediately (fast, optimistic)
    const current = (() => {
      try {
        return JSON.parse(localStorage.getItem(LS_KEY) ?? "{}");
      } catch {
        return {};
      }
    })();
    localStorage.setItem(
      LS_KEY,
      JSON.stringify({
        ...current,
        [section === "profile"
          ? "profile"
          : section === "business"
            ? "business"
            : "prefs"]:
          section === "profile"
            ? profile
            : section === "business"
              ? business
              : prefs,
      }),
    );

    // For the profile section — persist to backend so avatar survives across devices/sessions
    if (section === "profile") {
      // Push avatar into context immediately (covers the case where user
      // clicked Save without having touched the upload widget this session)
      if (profile.avatarUrl) setAvatarUrl(profile.avatarUrl);

      try {
        await apiRequest("/auth/me", {
          method: "PATCH",
          body: {
            fullName: profile.fullName || undefined,
            phone: profile.phone || undefined,
            logoUrl: profile.avatarUrl || undefined,
          },
        });
        // Re-sync from DB — sets avatarUrl from the server-confirmed logoUrl
        await refreshUser();
      } catch {
        // Non-blocking — AuthContext already has the local value
      }
    }

    toast.success(
      section === "profile"
        ? "Profile saved"
        : section === "business"
          ? "Business info saved"
          : "Preferences saved",
    );
    setTimeout(() => setSaving(null), 2000);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <p className="text-[11px] font-bold text-white/20 uppercase tracking-[0.18em] mb-1.5">
          Account
        </p>
        <h1 className="text-[22px] sm:text-[28px] font-bold text-white tracking-tight">
          Settings
        </h1>
      </div>

      {/* Layout: stacked on mobile, side-by-side on lg+ */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-start">
        {/* ── Tab rail — horizontal pill strip on mobile, vertical sidebar on desktop ── */}
        <div
          className="w-full lg:w-52 lg:shrink-0 lg:sticky lg:top-[80px] rounded-2xl p-1.5 lg:p-2"
          style={{
            background: "#161b27",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex lg:flex-col gap-0.5 overflow-x-auto lg:overflow-visible">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="flex-1 lg:flex-none flex items-center justify-center lg:justify-start
                             gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl
                             text-[13px] lg:text-[14px] font-semibold transition-all duration-150
                             whitespace-nowrap lg:w-full"
                  style={{
                    background: active
                      ? "rgba(255,255,255,0.08)"
                      : "transparent",
                    color: active ? "white" : "rgba(255,255,255,0.4)",
                  }}
                >
                  <Icon
                    size={14}
                    style={{
                      color: active ? "#60a5fa" : "rgba(255,255,255,0.3)",
                    }}
                  />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right content ── */}
        <div className="w-full lg:flex-1 min-w-0 space-y-4">
          {/* ── PROFILE TAB ── */}
          {tab === "profile" && (
            <>
              <Section
                title="Your identity"
                description="How you appear across Billd and on your invoices."
                accent="#60a5fa"
              >
                <div className="space-y-5">
                  <AvatarEditor
                    name={profile.fullName}
                    avatarUrl={profile.avatarUrl}
                    onAvatarChange={(url) => {
                      // Update local form state
                      setProfile((p) => ({ ...p, avatarUrl: url }));
                      // Push into AuthContext immediately — header + sidebar re-render right now
                      setAvatarUrl(url);
                    }}
                  />

                  <Divider />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full name"
                      value={profile.fullName}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, fullName: e.target.value }))
                      }
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
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="+234 800 000 0000"
                    hint="Used on invoices when filled in."
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <SaveButton
                    onClick={() => save("profile")}
                    saving={saving === "profile"}
                  />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Company name"
                      value={business.companyName}
                      onChange={(e) =>
                        setBusiness((b) => ({
                          ...b,
                          companyName: e.target.value,
                        }))
                      }
                      placeholder="Acme Design Studio"
                    />
                    <Input
                      label="Website"
                      type="url"
                      value={business.website}
                      onChange={(e) =>
                        setBusiness((b) => ({ ...b, website: e.target.value }))
                      }
                      placeholder="https://yoursite.com"
                    />
                  </div>

                  <Textarea
                    label="Business address"
                    value={business.address}
                    onChange={(e) =>
                      setBusiness((b) => ({ ...b, address: e.target.value }))
                    }
                    placeholder={"123 Lagos Island\nLagos, Nigeria"}
                    rows={3}
                    hint="Shown on invoice PDFs."
                  />

                  <Input
                    label="Tax / VAT ID"
                    value={business.taxId}
                    onChange={(e) =>
                      setBusiness((b) => ({ ...b, taxId: e.target.value }))
                    }
                    placeholder="e.g. VAT-12345678"
                    hint="Optional. Appears on invoice footer."
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <SaveButton
                    onClick={() => save("business")}
                    saving={saving === "business"}
                  />
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Due days */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px] font-semibold text-white/60 uppercase tracking-wider">
                        Default payment terms
                      </label>
                      <select
                        value={prefs.dueDays}
                        onChange={(e) =>
                          setPrefs((p) => ({ ...p, dueDays: e.target.value }))
                        }
                        className="w-full rounded-xl px-4 py-3 text-[15px] text-white
                                   focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {[
                          { value: "7", label: "Net 7 — due in 7 days" },
                          { value: "14", label: "Net 14 — due in 14 days" },
                          { value: "30", label: "Net 30 — due in 30 days" },
                          { value: "60", label: "Net 60 — due in 60 days" },
                        ].map((o) => (
                          <option
                            key={o.value}
                            value={o.value}
                            style={{ background: "#1c2333", color: "white" }}
                          >
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
                        onChange={(e) =>
                          setPrefs((p) => ({ ...p, currency: e.target.value }))
                        }
                        className="w-full rounded-xl px-4 py-3 text-[15px] text-white
                                   focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {[
                          { value: "USD", label: "USD — US Dollar" },
                          { value: "EUR", label: "EUR — Euro" },
                          { value: "GBP", label: "GBP — British Pound" },
                          { value: "NGN", label: "NGN — Nigerian Naira" },
                          { value: "CAD", label: "CAD — Canadian Dollar" },
                          { value: "AUD", label: "AUD — Australian Dollar" },
                        ].map((o) => (
                          <option
                            key={o.value}
                            value={o.value}
                            style={{ background: "#1c2333", color: "white" }}
                          >
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Textarea
                    label="Default invoice notes"
                    value={prefs.defaultNotes}
                    onChange={(e) =>
                      setPrefs((p) => ({ ...p, defaultNotes: e.target.value }))
                    }
                    placeholder={
                      "Payment due within 14 days.\nBank transfer preferred.\nThank you for your business."
                    }
                    rows={4}
                    hint="Pre-filled on every new invoice. You can always edit per invoice."
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <SaveButton
                    onClick={() => save("preferences")}
                    saving={saving === "preferences"}
                  />
                </div>
              </Section>

              {/* Danger zone */}
              <Section
                title="Danger zone"
                description="Permanent actions that cannot be undone."
                accent="#f87171"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-[14px] font-semibold text-white/70">
                      Delete account
                    </p>
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
