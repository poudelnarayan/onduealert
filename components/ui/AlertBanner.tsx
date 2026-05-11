"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type AlertVariant = "info" | "warning" | "critical" | "success";

const ICONS: Record<AlertVariant, React.ReactNode> = {
  info: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M12 8.25v4.5m0 3.5h.008M3.75 12a8.25 8.25 0 1 0 16.5 0 8.25 8.25 0 0 0-16.5 0z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="m9 12 2 2 4-4M3.75 12a8.25 8.25 0 1 0 16.5 0 8.25 8.25 0 0 0-16.5 0z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M12 9v4m0 3h.01M10.3 4.3 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  critical: (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M12 9v4m0 3h.01M10.3 4.3 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function AlertBanner(props: {
  variant?: AlertVariant;
  title: string;
  description?: string;
  className?: string;
}) {
  const variant = props.variant ?? "info";

  const styles: Record<AlertVariant, string> = {
    info: "border-[var(--border)] bg-surface",
    success:
      "border-[var(--success-ring)] bg-[var(--success-bg)] text-[var(--foreground-strong)]",
    warning:
      "border-[var(--warning-ring)] bg-[var(--warning-bg)] text-[var(--foreground-strong)]",
    critical:
      "border-[var(--danger-ring)] bg-[var(--danger-bg)] text-[var(--foreground-strong)]",
  };

  const iconBg: Record<AlertVariant, string> = {
    info: "bg-[var(--accent-bg)] text-[var(--accent-strong)]",
    success: "bg-white/60 text-[var(--success-strong)]",
    warning: "bg-white/60 text-[var(--warning-strong)]",
    critical: "bg-white/60 text-[var(--danger-strong)]",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-4 shadow-xs",
        styles[variant],
        props.className,
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          iconBg[variant],
        )}
      >
        {ICONS[variant]}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{props.title}</div>
        {props.description ? (
          <div className="mt-0.5 text-sm leading-6 text-[var(--muted)]">
            {props.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}
