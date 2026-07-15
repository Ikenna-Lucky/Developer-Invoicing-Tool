// Small pop-up notifications ("Client created successfully", etc). Same
// Context pattern as AuthContext — call useToast() from anywhere to fire one.

"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Types

type ToastType = "success" | "error";

interface Toast {
  id:      string;
  type:    ToastType;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error:   (message: string) => void;
}

// Context

const ToastContext = createContext<ToastContextValue | null>(null);

// Provider

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider
      value={{
        success: (msg) => addToast("success", msg),
        error:   (msg) => addToast("error", msg),
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// Container — renders toasts in top-right corner

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts:    Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-3 p-4 rounded-xl shadow-lg border",
            "animate-in slide-in-from-right-5 duration-200",
            toast.type === "success"
              ? "bg-white border-green-200"
              : "bg-white border-red-200"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
          ) : (
            <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
          )}
          <p className="text-sm text-gray-700 flex-1 leading-snug">{toast.message}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

// Hook

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
