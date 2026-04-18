/**
 * MODAL COMPONENT
 *
 * Built using React Portals concept — but in Next.js App Router we just
 * render it at the component level and use fixed positioning + z-index
 * to overlay the entire screen.
 *
 * `useEffect` with `document.body.style.overflow` prevents the background
 * page from scrolling while a modal is open — standard UX behaviour.
 *
 * The backdrop click handler closes the modal when you click outside the
 * modal box. The `e.stopPropagation()` on the inner div prevents clicks
 * inside the modal from bubbling up to the backdrop.
 */

"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open:       boolean;
  onClose:    () => void;
  title?:     string;
  size?:      "sm" | "md" | "lg";
  children:   React.ReactNode;
  footer?:    React.ReactNode;
}

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, size = "md", children, footer }: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape key — standard accessibility behaviour
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    // Backdrop — semi-transparent overlay covering the full screen
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      {/* Modal box — stop click propagation so backdrop click doesn't fire */}
      <div
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-xl",
          "flex flex-col max-h-[90vh]",
          sizeStyles[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Body — scrollable if content is tall */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer — action buttons */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
