"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-lg font-medium tracking-tight " +
    "transition-all duration-200 outline-none select-none whitespace-nowrap " +
    "focus-visible:ring-2 focus-visible:ring-accent/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-50";

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-8 px-3 text-[13px]",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-[15px]",
  };

  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-[linear-gradient(180deg,#3b82f6_0%,#2563eb_100%)] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(37,99,235,0.55),0_2px_4px_-1px_rgba(15,23,42,0.10)] " +
      "hover:shadow-[0_1px_0_0_rgba(255,255,255,0.30)_inset,0_12px_32px_-8px_rgba(37,99,235,0.65),0_3px_6px_-1px_rgba(15,23,42,0.12)] " +
      "hover:-translate-y-px active:translate-y-0 active:bg-accent-strong",
    secondary:
      "bg-surface text-foreground ring-1 ring-inset ring-[var(--border-strong)] shadow-xs hover:bg-surface-muted hover:ring-[rgba(15,23,42,0.20)]",
    outline:
      "bg-transparent text-foreground ring-1 ring-inset ring-[var(--border-strong)] hover:bg-surface-muted",
    ghost:
      "bg-transparent text-foreground hover:bg-surface-muted active:bg-surface-strong",
    danger:
      "bg-danger text-white shadow-sm hover:bg-danger-strong",
  };

  return (
    <button
      className={cn(base, sizes[size], styles[variant], className)}
      {...props}
    />
  );
}
