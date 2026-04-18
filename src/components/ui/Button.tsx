/**
 * BUTTON COMPONENT
 *
 * This is a compound component pattern — one component handles multiple
 * visual "variants" through props instead of creating separate components
 * for each style.
 *
 * The `cn()` utility merges Tailwind classes and handles conflicts —
 * e.g. if you pass className="bg-red-500" it won't conflict with the
 * default bg color from the variant.
 *
 * `React.ButtonHTMLAttributes<HTMLButtonElement>` means this component
 * accepts ALL native HTML button attributes (onClick, disabled, type, etc.)
 * automatically — we don't have to manually list them.
 */

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?:    "sm" | "md" | "lg";
  loading?: boolean;
}

const variantStyles = {
  primary:   "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm",
  ghost:     "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  danger:    "bg-red-600 text-white hover:bg-red-700 shadow-sm",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

export function Button({
  variant  = "primary",
  size     = "md",
  loading  = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        // Base styles all buttons share
        "inline-flex items-center justify-center font-medium rounded-lg",
        "transition-colors duration-150 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {/* Show a spinning loader icon when loading=true, hide actual content */}
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}
