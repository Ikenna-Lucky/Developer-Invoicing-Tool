import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?:    "sm" | "md" | "lg";
  loading?: boolean;
}

const variantStyles = {
  primary:   "bg-brand-600 text-white hover:bg-brand-500 shadow-lg shadow-brand-600/20",
  secondary: "bg-white/[0.07] text-white/80 border border-white/[0.1] hover:bg-white/[0.12] hover:text-white",
  ghost:     "text-white/60 hover:bg-white/[0.07] hover:text-white/90",
  danger:    "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20",
};

const sizeStyles = {
  sm: "px-3.5 py-2 text-[13px] gap-1.5",
  md: "px-5 py-2.5 text-[14px] gap-2",
  lg: "px-6 py-3 text-[15px] gap-2",
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
        "inline-flex items-center justify-center font-semibold rounded-xl",
        "transition-all duration-150 focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117]",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}
