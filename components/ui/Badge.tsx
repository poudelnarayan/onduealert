import * as React from "react";
import { cn } from "@/lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?:
    | "neutral"
    | "soft"
    | "accent"
    | "success"
    | "warning"
    | "critical"
    | "outline";
  size?: "sm" | "md";
  dot?: boolean;
};

export function Badge({
  className,
  variant = "neutral",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const styles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    neutral:
      "bg-[var(--surface-muted)] text-[var(--muted)] ring-1 ring-inset ring-[var(--border)]",
    soft:
      "bg-[var(--surface-strong)] text-[var(--foreground)] ring-1 ring-inset ring-[var(--border)]",
    outline:
      "bg-transparent text-[var(--muted)] ring-1 ring-inset ring-[var(--border-strong)]",
    accent:
      "bg-[var(--accent-bg)] text-[var(--accent-strong)] ring-1 ring-inset ring-[rgba(37,99,235,0.25)]",
    success:
      "bg-[var(--success-bg)] text-[var(--success-strong)] ring-1 ring-inset ring-[var(--success-ring)]",
    warning:
      "bg-[var(--warning-bg)] text-[var(--warning-strong)] ring-1 ring-inset ring-[var(--warning-ring)]",
    critical:
      "bg-[var(--danger-bg)] text-[var(--danger-strong)] ring-1 ring-inset ring-[var(--danger-ring)]",
  };

  const sizes: Record<NonNullable<BadgeProps["size"]>, string> = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  const dotColor: Record<NonNullable<BadgeProps["variant"]>, string> = {
    neutral: "bg-[var(--muted-2)]",
    soft: "bg-[var(--muted)]",
    outline: "bg-[var(--muted-2)]",
    accent: "bg-[var(--accent)]",
    success: "bg-[var(--success)]",
    warning: "bg-[var(--warning)]",
    critical: "bg-[var(--danger)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium leading-none",
        sizes[size],
        styles[variant],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            dotColor[variant],
          )}
          aria-hidden
        />
      ) : null}
      {children}
    </span>
  );
}
