// ─── Shared TypeScript types (mirrors the DB schema) ───────────────────────

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface User {
  id: string;
  email: string;
  fullName: string;
  businessName?: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  address?: string;
  phone?: string;
  companyName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  createdAt: string;
}

export interface Invoice {
  id: string;
  userId: string;
  clientId: string;
  client?: Client; // populated on detail view
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  notes?: string;
  pdfUrl?: string;
  stripePaymentLink?: string;
  items?: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amountPaid: number;
  paidAt: string;
  stripePaymentId?: string;
  createdAt: string;
}

// ─── API response wrappers ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
}

// ─── Dashboard stats ────────────────────────────────────────────────────────

export interface DashboardStats {
  totalEarned: number;
  totalPending: number;
  totalOverdue: number;
  invoiceCount: number;
  clientCount: number;
}
