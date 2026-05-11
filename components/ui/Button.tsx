"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "@/components/ui/Spinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  loadingText?: string;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight " +
    "transition-[transform,box-shadow,background-color,color] duration-150 outline-none select-none whitespace-nowrap " +
    "active:scale-[0.97] " +
    "focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.40)] focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-55";

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-9 px-3.5 text-[13.5px]",
    lg: "h-11 px-5 text-[15px]",
    icon: "h-9 w-9 p-0 text-[13.5px]",
  };

  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-[#2563eb] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_1px_2px_0_rgba(15,23,42,0.20)] " +
      "hover:bg-[#1d4ed8] active:bg-[#1e40af]",
    secondary:
      "bg-white text-[var(--foreground)] ring-1 ring-inset ring-[var(--border-strong)] " +
      "hover:bg-[var(--surface-muted)] hover:ring-[rgba(15,23,42,0.20)] active:bg-[var(--surface-strong)]",
    outline:
      "bg-transparent text-[var(--foreground)] ring-1 ring-inset ring-[var(--border-strong)] hover:bg-[var(--surface-muted)]",
    ghost:
      "bg-transparent text-[var(--foreground)] hover:bg-[var(--surface-muted)] active:bg-[var(--surface-strong)]",
    danger:
      "bg-[var(--danger)] text-white hover:bg-[var(--danger-strong)] active:brightness-95",
  };

  return (
    <button
      className={cn(base, sizes[size], styles[variant], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="h-3.5 w-3.5" />
          {loadingText ?? "Working…"}
        </>
      ) : (
        children
      )}
    </button>
  );
}
