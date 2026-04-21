import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label?:    string;
  error?:    string;
  hint?:     string;
  required?: boolean;
  children:  React.ReactNode;
}

function FieldWrapper({ label, error, hint, required, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[14px] font-semibold text-white/60 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-[13px] text-red-400">{error}</p>}
      {hint && !error && <p className="text-[13px] text-white/40">{hint}</p>}
    </div>
  );
}

const baseInputClass =
  "w-full rounded-xl border px-4 py-3 text-[15px] text-white " +
  "placeholder:text-white/25 transition-all duration-200 " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500/60 " +
  "disabled:opacity-50 disabled:cursor-not-allowed";

const baseStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
};

const errorInputClass = "border-red-500/50 focus:ring-red-500/30";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  error?:    string;
  hint?:     string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className, style, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      <input
        ref={ref}
        className={cn(baseInputClass, error && errorInputClass, className)}
        style={{ ...baseStyle, ...style }}
        {...props}
      />
    </FieldWrapper>
  )
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?:  string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className, style, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        rows={3}
        className={cn(baseInputClass, "resize-none", error && errorInputClass, className)}
        style={{ ...baseStyle, ...style }}
        {...props}
      />
    </FieldWrapper>
  )
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string;
  error?:   string;
  hint?:    string;
  options:  { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, options, className, style, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      <select
        ref={ref}
        className={cn(baseInputClass, "cursor-pointer", error && errorInputClass, className)}
        style={{ ...baseStyle, ...style }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: "#1c2333", color: "white" }}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
);
Select.displayName = "Select";
