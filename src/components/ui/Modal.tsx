"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open:     boolean;
  onClose:  () => void;
  title?:   string;
  size?:    "sm" | "md" | "lg";
  children: React.ReactNode;
  footer?:  React.ReactNode;
}

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, size = "md", children, footer }: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full rounded-2xl shadow-2xl flex flex-col max-h-[90vh]",
          "border border-white/[0.08]",
          sizeStyles[size]
        )}
        style={{ background: "#1c2333" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
            <h3 className="text-[18px] font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.08] rounded-b-2xl"
            style={{ background: "rgba(255,255,255,0.02)" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
