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
  trend?: { value: string; direction: "up" | "down" | "flat" };
}) {
  const tone = props.tone ?? "neutral";
  const styles = toneStyles[tone];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">
          {props.label}
        </div>
        {props.icon ? (
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset",
              styles.bg,
              styles.text,
              styles.ring,
            )}
          >
            {props.icon}
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex items-baseline gap-2.5">
        <div className="text-[28px] font-semibold tracking-tight text-[var(--foreground-strong)]">
          {props.value}
        </div>
        {props.trend ? (
          <span
            className={cn(
              "rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
              props.trend.direction === "up"
                ? "bg-[var(--success-bg)] text-[var(--success-strong)]"
                : props.trend.direction === "down"
                  ? "bg-[var(--danger-bg)] text-[var(--danger-strong)]"
                  : "bg-[var(--surface-muted)] text-[var(--muted)]",
            )}
          >
            {props.trend.direction === "up" ? "▲" : props.trend.direction === "down" ? "▼" : "—"} {props.trend.value}
          </span>
        ) : null}
      </div>
      {props.hint ? (
        <div className="mt-1 text-[12.5px] text-[var(--muted-2)]">
          {props.hint}
        </div>
      ) : null}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-0.5",
          styles.bar,
        )}
      />
    </div>
  );
}
