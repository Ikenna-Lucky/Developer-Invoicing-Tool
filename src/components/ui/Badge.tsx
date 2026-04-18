import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  variant?:  BadgeVariant;
  children:  React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
  warning: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20",
  danger:  "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  info:    "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
  neutral: "bg-gray-100 text-gray-700 ring-1 ring-gray-500/20",
};

export function Badge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Specific invoice status badge — maps status string to the right variant
export function InvoiceStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    paid:    { variant: "success", label: "Paid" },
    sent:    { variant: "info",    label: "Sent" },
    overdue: { variant: "danger",  label: "Overdue" },
    draft:   { variant: "neutral", label: "Draft" },
  };
  const { variant, label } = map[status] ?? { variant: "neutral", label: status };
  return <Badge variant={variant}>{label}</Badge>;
}
