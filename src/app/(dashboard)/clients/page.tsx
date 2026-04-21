"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, Users, Mail, Phone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoader } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import type { Client } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

// ─── Form data shape ──────────────────────────────────────────────────────────
interface ClientFormData {
  name:        string;
  email:       string;
  companyName: string;
  phone:       string;
  address:     string;
}

const emptyForm: ClientFormData = {
  name: "", email: "", companyName: "", phone: "", address: "",
};

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function ClientsPage() {
  const toast = useToast();

  // ── Data state ──
  const [clients,     setClients]     = useState<Client[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ── Modal state ──
  const [showFormModal,   setShowFormModal]   = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient,  setSelectedClient]  = useState<Client | null>(null);
  const [isEditing,       setIsEditing]       = useState(false);

  // ── Form state ──
  const [formData,    setFormData]    = useState<ClientFormData>(emptyForm);
  const [formErrors,  setFormErrors]  = useState<Partial<ClientFormData>>({});
  const [submitting,  setSubmitting]  = useState(false);

  // ── Fetch clients ─────────────────────────────────────────────────────────
  const fetchClients = useCallback(async (search?: string) => {
    try {
      const url = search
        ? `${API_URL}/clients?search=${encodeURIComponent(search)}`
        : `${API_URL}/clients`;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load clients");
      const { data } = await res.json();
      setClients(data);
    } catch {
      toast.error("Could not load clients. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => fetchClients(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchClients]);

  // ── Open modals ───────────────────────────────────────────────────────────

  const openAddModal = () => {
    setIsEditing(false);
    setSelectedClient(null);
    setFormData(emptyForm);
    setFormErrors({});
    setShowFormModal(true);
  };

  const openEditModal = (client: Client) => {
    setIsEditing(true);
    setSelectedClient(client);
    setFormData({
      name:        client.name,
      email:       client.email,
      companyName: client.companyName ?? "",
      phone:       client.phone       ?? "",
      address:     client.address     ?? "",
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  const openDeleteModal = (client: Client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  // ── Form validation ───────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errors: Partial<ClientFormData> = {};
    if (!formData.name.trim())              errors.name  = "Name is required";
    if (!formData.email.trim())             errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email address";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Submit (create or edit) ────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    try {
      const url    = isEditing ? `${API_URL}/clients/${selectedClient!.id}` : `${API_URL}/clients`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong");

      if (isEditing) {
        setClients((prev) => prev.map((c) => c.id === json.data.id ? json.data : c));
        toast.success("Client updated successfully");
      } else {
        setClients((prev) => [json.data, ...prev]);
        toast.success("Client created successfully");
      }

      setShowFormModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!selectedClient) return;
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/clients/${selectedClient.id}`, {
        method:      "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Delete failed");
      }

      setClients((prev) => prev.filter((c) => c.id !== selectedClient.id));
      toast.success("Client deleted");
      setShowDeleteModal(false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-white tracking-tight">Clients</h1>
          <p className="text-[15px] text-white/40 mt-1">
            Manage your clients and their information
          </p>
        </div>
        <Button onClick={openAddModal} size="md">
          <Plus size={16} />
          Add client
        </Button>
      </div>

      {/* ── Content Card ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "#161b27", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* ── Search bar ── */}
        <div
          className="px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search clients..."
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

        {/* ── Table or states ── */}
        {loading ? (
          <PageLoader />
        ) : clients.length === 0 ? (
          <EmptyState
            icon={Users}
            title={searchQuery ? "No clients found" : "No clients yet"}
            description={
              searchQuery
                ? `No clients match "${searchQuery}". Try a different search.`
                : "Add your first client to start creating invoices."
            }
            action={!searchQuery ? { label: "Add your first client", onClick: openAddModal } : undefined}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-white/30 uppercase tracking-widest">Client</th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-white/30 uppercase tracking-widest">Email</th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-white/30 uppercase tracking-widest">Phone</th>
                  <th className="text-left px-6 py-4 text-[12px] font-semibold text-white/30 uppercase tracking-widest">Added</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="group transition-colors"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Name + company */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-[13px] font-bold text-white shrink-0">
                          {client.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold text-white leading-tight">{client.name}</p>
                          {client.companyName && (
                            <p className="text-[13px] text-white/40 flex items-center gap-1.5 mt-0.5">
                              <Building2 size={12} /> {client.companyName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5">
                      <a href={`mailto:${client.email}`}
                        className="text-[14px] text-white/60 hover:text-brand-400 flex items-center gap-2 transition-colors">
                        <Mail size={14} />
                        {client.email}
                      </a>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-5 text-[14px] text-white/50">
                      {client.phone ? (
                        <span className="flex items-center gap-2">
                          <Phone size={14} />
                          {client.phone}
                        </span>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>

                    {/* Date added */}
                    <td className="px-6 py-5 text-[14px] text-white/35">
                      {formatDate(client.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(client)}
                          className="p-2 rounded-lg text-white/30 hover:text-brand-400 hover:bg-white/[0.06] transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => openDeleteModal(client)}
                          className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Footer count ── */}
        {clients.length > 0 && (
          <div
            className="px-6 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}
          >
            <p className="text-[14px] text-white/30">
              {clients.length} {clients.length === 1 ? "client" : "clients"}
            </p>
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      <Modal
        open={showFormModal}
        onClose={() => setShowFormModal(false)}
        title={isEditing ? "Edit client" : "Add new client"}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowFormModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={submitting}>
              {isEditing ? "Save changes" : "Create client"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full name"
              placeholder="Ikenna Obi"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={formErrors.name}
              required
            />
            <Input
              label="Company name"
              placeholder="Acme Corp (optional)"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            />
          </div>
          <Input
            label="Email address"
            type="email"
            placeholder="client@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
            required
          />
          <Input
            label="Phone number"
            type="tel"
            placeholder="+234 800 000 0000 (optional)"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Textarea
            label="Address"
            placeholder="123 Main St, Lagos, Nigeria (optional)"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete client"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={submitting}>
              Delete client
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
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">{selectedClient?.name}</span>?
            </p>
            <p className="text-[14px] text-white/40 mt-1.5 leading-relaxed">
              This will also delete all invoices associated with this client. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
