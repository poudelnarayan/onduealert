"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightSlot,
  className,
  id,
  ...props
}: InputProps) {
  const reactId = React.useId();
  const inputId = id ?? `input-${reactId}`;

  return (
    <div className="block">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]"
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          "group relative flex items-center rounded-lg border bg-surface transition",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]",
          error
            ? "border-[var(--danger)] ring-2 ring-[var(--danger-ring)]"
            : "border-[var(--border-strong)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[rgba(37,99,235,0.20)]",
        )}
      >
        {leftIcon ? (
          <span className="pl-3 text-[var(--muted-2)]">{leftIcon}</span>
        ) : null}
        <input
          id={inputId}
          className={cn(
            "h-10 w-full bg-transparent px-3 text-sm text-[var(--foreground)] outline-none",
            "placeholder:text-[var(--muted-3)]",
            leftIcon ? "pl-2" : "",
            rightSlot ? "pr-2" : "",
            className,
          )}
          {...props}
        />
        {rightSlot ? <span className="pr-2">{rightSlot}</span> : null}
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
