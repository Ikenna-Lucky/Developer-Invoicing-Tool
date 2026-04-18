/**
 * INPUT, TEXTAREA, SELECT COMPONENTS
 *
 * These are "controlled" form components — meaning the parent component
 * owns the value state and passes it in via props. The component just
 * renders the UI and calls onChange when the user types.
 *
 * The `label`, `error`, and `hint` props are optional — when provided
 * they render above/below the input automatically, keeping the API clean.
 *
 * `forwardRef` allows parent components to attach a ref to the underlying
 * <input> element — used for focus management (e.g. autofocus a field when
 * a modal opens).
 */

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  label?:    string;
  error?:    string;
  hint?:     string;
  required?: boolean;
  children:  React.ReactNode;
}

// Shared wrapper that renders the label, the input slot, and error/hint text
function FieldWrapper({ label, error, hint, required, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// ─── Base input class shared by all fields ───────────────────────────────────
const baseInputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 " +
  "placeholder:text-gray-400 transition-colors " +
  "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent " +
  "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed";

const errorInputClass = "border-red-400 focus:ring-red-400";

// ─── Input ───────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?:    string;
  error?:    string;
  hint?:     string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      <input
        ref={ref}
        className={cn(baseInputClass, error && errorInputClass, className)}
        {...props}
      />
    </FieldWrapper>
  )
);
Input.displayName = "Input";

// ─── Textarea ────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?:  string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        rows={3}
        className={cn(baseInputClass, "resize-none", error && errorInputClass, className)}
        {...props}
      />
    </FieldWrapper>
  )
);
Textarea.displayName = "Textarea";

// ─── Select ──────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?:   string;
  error?:   string;
  hint?:    string;
  options:  { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, options, className, ...props }, ref) => (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      <select
        ref={ref}
        className={cn(baseInputClass, "cursor-pointer", error && errorInputClass, className)}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  )
);
Select.displayName = "Select";
