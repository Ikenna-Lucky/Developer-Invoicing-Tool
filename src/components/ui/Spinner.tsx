import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?:      "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-4",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "rounded-full border-gray-200 border-t-brand-600 animate-spin",
        sizeStyles[size],
        className
      )}
    />
  );
}

// Full-page loading state used when a page is fetching initial data
export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spinner size="lg" />
    </div>
  );
}
