import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "live" | "critical" | "warning" | "success" | "neutral";

const toneStyles: Record<
  Tone,
  { ring: string; bg: string; text: string; bar: string }
> = {
  live: {
    ring: "ring-[rgba(37,99,235,0.20)]",
    bg: "bg-[var(--accent-bg)]",
    text: "text-[var(--accent-strong)]",
    bar: "bg-[var(--accent)]",
  },
  critical: {
    ring: "ring-[var(--danger-ring)]",
    bg: "bg-[var(--danger-bg)]",
    text: "text-[var(--danger-strong)]",
    bar: "bg-[var(--danger)]",
  },
  warning: {
    ring: "ring-[var(--warning-ring)]",
    bg: "bg-[var(--warning-bg)]",
    text: "text-[var(--warning-strong)]",
    bar: "bg-[var(--warning)]",
  },
  success: {
    ring: "ring-[var(--success-ring)]",
    bg: "bg-[var(--success-bg)]",
    text: "text-[var(--success-strong)]",
    bar: "bg-[var(--success)]",
  },
  neutral: {
    ring: "ring-[var(--border)]",
    bg: "bg-[var(--surface-muted)]",
    text: "text-[var(--muted)]",
    bar: "bg-[var(--muted-2)]",
  },
};

export function MetricCard(props: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  tone?: Tone;
}) {
  const tone = props.tone ?? "neutral";
  const styles = toneStyles[tone];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-2)]">
          {props.label}
        </div>
        {props.icon ? (
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md ring-1 ring-inset",
              styles.bg,
              styles.text,
              styles.ring,
            )}
          >
            {props.icon}
          </div>
        ) : null}
      </div>
      <div className="mt-2.5 text-[26px] font-semibold leading-none tracking-tight text-[var(--foreground-strong)]">
        {props.value}
      </div>
      {props.hint ? (
        <div className="mt-1.5 text-[12px] text-[var(--muted-2)]">
          {props.hint}
        </div>
      ) : null}
    </div>
  );
}
