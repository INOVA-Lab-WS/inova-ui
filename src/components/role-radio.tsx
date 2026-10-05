import * as React from "react";
import { cn } from "../lib/cn";

/** RoleRadio · Figma "role-radio". Choice between roles shown as pill options, with validation error. */
export interface RoleRadioOption {
  value: string;
  label: React.ReactNode;
}
export interface RoleRadioProps {
  label?: React.ReactNode;
  name: string;
  options: RoleRadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: React.ReactNode;
  className?: string;
}

export function RoleRadio({ label, name, options, value, onValueChange, error, className }: RoleRadioProps) {
  const errorId = React.useId();
  return (
    <fieldset className={cn("flex flex-col gap-2 font-sans", className)} aria-describedby={error ? errorId : undefined}>
      {label && <legend className="mb-2 text-sm font-medium text-text-primary">{label}</legend>}
      <div className="flex gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "inline-flex h-9 cursor-pointer items-center rounded-pill px-3 text-sm font-medium transition-colors",
              "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-text-primary",
              value === o.value ? "bg-surface-selected text-text-primary" : "text-text-muted hover:bg-surface-control",
              error && "ring-1 ring-status-error-fg",
            )}
          >
            <input type="radio" className="sr-only" name={name} value={o.value} checked={value === o.value} onChange={() => onValueChange?.(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-status-error-fg">
          {error}
        </p>
      )}
    </fieldset>
  );
}
