import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "live" | "success" | "warning" | "critical" | "neutral";

const ringTone: Record<Tone, string> = {
  live: "ring-[rgba(37,99,235,0.25)] bg-[var(--accent-bg)] text-[var(--accent-strong)]",
  success:
    "ring-[var(--success-ring)] bg-[var(--success-bg)] text-[var(--success-strong)]",
  warning:
    "ring-[var(--warning-ring)] bg-[var(--warning-bg)] text-[var(--warning-strong)]",
  critical:
    "ring-[var(--danger-ring)] bg-[var(--danger-bg)] text-[var(--danger-strong)]",
  neutral:
    "ring-[var(--border)] bg-[var(--surface-muted)] text-[var(--muted)]",
};

const dotColor: Record<Tone, string> = {
  live: "bg-[var(--accent)]",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  critical: "bg-[var(--danger)]",
  neutral: "bg-[var(--muted-2)]",
};

export function StatusPill(props: {
  tone?: Tone;
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const tone = props.tone ?? "live";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        ringTone[tone],
        props.className,
      )}
    >
      <span
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          dotColor[tone],
          props.pulse !== false && "status-dot",
        )}
        aria-hidden
      />
      {props.children}
    </span>
  );
}
