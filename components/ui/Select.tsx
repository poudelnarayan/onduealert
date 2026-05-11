"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Option = { value: string; label: string };

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Option[];
  error?: string | null;
  hint?: string;
};

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={props.className ?? "h-4 w-4"}
      aria-hidden
    >
      <path
        d="M6 8l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Select({
  label,
  options,
  error,
  hint,
  className,
  id,
  ...props
}: SelectProps) {
  const reactId = React.useId();
  const selectId = id ?? `select-${reactId}`;

  return (
    <div className="block">
      {label ? (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]"
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          "relative flex items-center rounded-lg border bg-surface transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]",
          error
            ? "border-[var(--danger)] ring-2 ring-[var(--danger-ring)]"
            : "border-[var(--border-strong)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[rgba(37,99,235,0.20)]",
        )}
      >
        <select
          id={selectId}
          className={cn(
            "h-10 w-full appearance-none bg-transparent px-3 pr-9 text-sm text-[var(--foreground)] outline-none",
            className,
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-[var(--muted-2)]" />
      </div>
      {error ? (
        <div className="mt-1.5 text-xs font-medium text-[var(--danger-strong)]">
          {error}
        </div>
      ) : null}
      {!error && hint ? (
        <div className="mt-1.5 text-xs text-[var(--muted-2)]">{hint}</div>
      ) : null}
    </div>
  );
}
