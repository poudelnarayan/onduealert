"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  IconBell,
  IconCheck,
  IconAlert,
  IconMail,
  IconShield,
} from "@/components/landing/Icons";

type Item = {
  title: string;
  meta: string;
  due: string;
  tone: "live" | "warning" | "critical" | "success";
  badge: string;
};

const ITEMS: Item[] = [
  {
    title: "Quarterly VAT filing — Acme Corp",
    meta: "Tax · Quarterly · 7,3,1,0 offsets",
    due: "Jan 31, 2026",
    tone: "live",
    badge: "T-7 days",
  },
  {
    title: "Vendor MSA renewal — Linear",
    meta: "Contract · Yearly",
    due: "Feb 10, 2026",
    tone: "warning",
    badge: "T-3 days",
  },
  {
    title: "Operating license renewal",
    meta: "License · Yearly",
    due: "Feb 15, 2026",
    tone: "live",
    badge: "On track",
  },
  {
    title: "SOC 2 evidence collection",
    meta: "Custom · Monthly",
    due: "Overdue · 2 days",
    tone: "critical",
    badge: "Critical",
  },
];

const ACTIVITY = [
  { icon: <IconMail className="h-3.5 w-3.5" />, text: "Reminder sent · Quarterly VAT", time: "2m ago", tone: "live" as const },
  { icon: <IconAlert className="h-3.5 w-3.5" />, text: "Escalated · SOC 2 evidence", time: "11m ago", tone: "critical" as const },
  { icon: <IconCheck className="h-3.5 w-3.5" />, text: "Completed · Insurance audit", time: "44m ago", tone: "success" as const },
];

export function HeroPreview() {
  return (
    <div className="relative">
      {/* Glow backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-12 rounded-[3rem] opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 70% 30%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(60% 60% at 20% 80%, rgba(6,182,212,0.16) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl border border-[var(--border)] bg-white/80 p-3 shadow-[0_28px_60px_-20px_rgba(15,23,42,0.20),0_8px_18px_-6px_rgba(15,23,42,0.10)] backdrop-blur-xl"
      >
        {/* Inner dashboard shell */}
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {/* Top chrome */}
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] text-[var(--muted)]">
              <IconShield className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span className="font-mono">app.onduealert.com/dashboard</span>
            </div>
            <StatusPill tone="success">Active</StatusPill>
          </div>

          {/* Body */}
          <div className="grid gap-3 p-4 sm:grid-cols-5">
            {/* Left column: KPIs + activity */}
            <div className="space-y-3 sm:col-span-2">
              <div className="grid grid-cols-2 gap-2.5">
                <KPI label="Open" value="14" tone="live" />
                <KPI label="Overdue" value="3" tone="critical" />
                <KPI label="On time" value="96%" tone="success" />
                <KPI label="Critical" value="1" tone="warning" />
              </div>

              {/* Reliability score */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                    Compliance score
                  </div>
                  <span className="text-[11px] font-medium text-[var(--success-strong)]">
                    +2.4%
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">
                    98.4
                  </div>
                  <div className="text-[11px] text-[var(--muted-2)]">/ 100</div>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "98.4%" }}
                    transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
                    className="h-full rounded-full bg-[linear-gradient(90deg,#06b6d4,#2563eb)]"
                  />
                </div>
              </div>

              {/* Activity feed */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                    Live activity
                  </div>
                  <StatusPill tone="live">Streaming</StatusPill>
                </div>
                <ul className="space-y-2">
                  {ACTIVITY.map((a, i) => (
                    <motion.li
                      key={a.text}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
                      className="flex items-center gap-2.5 text-[12.5px]"
                    >
                      <span
                        className={[
                          "flex h-6 w-6 items-center justify-center rounded-md ring-1 ring-inset",
                          a.tone === "critical"
                            ? "bg-[var(--danger-bg)] text-[var(--danger-strong)] ring-[var(--danger-ring)]"
                            : a.tone === "success"
                              ? "bg-[var(--success-bg)] text-[var(--success-strong)] ring-[var(--success-ring)]"
                              : "bg-[var(--accent-bg)] text-[var(--accent-strong)] ring-[rgba(37,99,235,0.25)]",
                        ].join(" ")}
                      >
                        {a.icon}
                      </span>
                      <span className="flex-1 truncate text-[var(--foreground)]">
                        {a.text}
                      </span>
                      <span className="text-[11px] text-[var(--muted-2)]">
                        {a.time}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right column: deadlines list */}
            <div className="sm:col-span-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                  Today & upcoming
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted)]">
                    Due
                  </span>
                  <span className="rounded-md bg-[var(--surface-muted)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--muted-2)]">
                    Status
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {ITEMS.map((it, i) => (
                  <motion.div
                    key={it.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.25 + i * 0.08 }}
                    className="group flex items-center gap-3 rounded-lg border border-[var(--border)] bg-white p-2.5 transition hover:border-[var(--border-strong)] hover:shadow-sm"
                  >
                    <span
                      className={[
                        "h-9 w-1 shrink-0 rounded-full",
                        it.tone === "critical"
                          ? "bg-[var(--danger)]"
                          : it.tone === "warning"
                            ? "bg-[var(--warning)]"
                            : "bg-[var(--accent)]",
                      ].join(" ")}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[12.5px] font-semibold text-[var(--foreground-strong)]">
                        {it.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--muted-2)]">
                        <span className="truncate">{it.meta}</span>
                      </div>
                    </div>
                    <div className="hidden flex-col items-end gap-1 sm:flex">
                      <span className="font-mono text-[11px] text-[var(--muted)]">
                        {it.due}
                      </span>
                      <StatusPill tone={it.tone} pulse={it.tone === "live"}>
                        {it.badge}
                      </StatusPill>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Escalation timeline */}
              <div className="mt-3 rounded-xl border border-[var(--border)] bg-gradient-to-br from-white to-[var(--surface-muted)] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                    <IconBell className="h-3.5 w-3.5" /> Escalation timeline
                  </div>
                  <span className="text-[11px] text-[var(--muted-2)]">
                    SOC 2 evidence collection
                  </span>
                </div>
                <div className="relative h-8">
                  <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[var(--border)]" />
                  {[
                    { x: "5%", label: "T-7", tone: "live" as const },
                    { x: "25%", label: "T-3", tone: "live" as const },
                    { x: "45%", label: "T-1", tone: "warning" as const },
                    { x: "62%", label: "Due", tone: "warning" as const },
                    { x: "82%", label: "+2d", tone: "critical" as const },
                    { x: "95%", label: "Now", tone: "critical" as const },
                  ].map((p, i) => (
                    <motion.div
                      key={p.label}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.35, delay: 0.7 + i * 0.07 }}
                      style={{ left: p.x }}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div
                        className={[
                          "flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white",
                          p.tone === "critical"
                            ? "bg-[var(--danger)]"
                            : p.tone === "warning"
                              ? "bg-[var(--warning)]"
                              : "bg-[var(--accent)]",
                        ].join(" ")}
                      />
                      <div className="mt-1 -translate-x-1/2 whitespace-nowrap text-center text-[9px] font-medium text-[var(--muted-2)]" style={{ marginLeft: 0 }}>
                        {p.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating notification card */}
      <motion.div
        initial={{ opacity: 0, y: 16, x: 16 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="float-soft absolute -right-2 -top-6 hidden w-72 rounded-xl border border-[var(--border)] bg-white/95 p-3 shadow-[0_18px_40px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:block"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-bg)] text-[var(--accent-strong)]">
            <IconMail className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-semibold text-[var(--foreground-strong)]">
              Reminder · Quarterly VAT
            </div>
            <div className="mt-0.5 text-[11.5px] text-[var(--muted)]">
              T-7 alert delivered to 3 recipients · 2:14pm
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <StatusPill tone="success">Delivered</StatusPill>
              <span className="rounded-md bg-[var(--surface-muted)] px-1.5 py-0.5 text-[10px] text-[var(--muted-2)]">
                Idempotency: 1f9c
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating compliance score badge */}
      <motion.div
        initial={{ opacity: 0, y: -10, x: -10 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.7, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="float-soft absolute -bottom-6 -left-2 hidden w-64 rounded-xl border border-[var(--border)] bg-white/95 p-3 shadow-[0_18px_40px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:block"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
              <circle cx="18" cy="18" r="15" stroke="rgba(15,23,42,0.08)" strokeWidth="3" fill="none" />
              <circle
                cx="18"
                cy="18"
                r="15"
                stroke="url(#scoreGrad)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="92.6 6.4"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="36" y2="36">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[var(--foreground-strong)]">
              98
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[12.5px] font-semibold text-[var(--foreground-strong)]">
              Compliance score
            </div>
            <div className="text-[11px] text-[var(--muted-2)]">
              Above target · last 30 days
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function KPI(props: {
  label: string;
  value: string;
  tone: "live" | "critical" | "success" | "warning";
}) {
  const toneAccent: Record<typeof props.tone, string> = {
    live: "bg-[var(--accent-bg)] text-[var(--accent-strong)]",
    critical: "bg-[var(--danger-bg)] text-[var(--danger-strong)]",
    success: "bg-[var(--success-bg)] text-[var(--success-strong)]",
    warning: "bg-[var(--warning-bg)] text-[var(--warning-strong)]",
  };
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-2.5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
          {props.label}
        </div>
        <span className={`h-1.5 w-1.5 rounded-full ${toneAccent[props.tone].split(" ")[0]}`} />
      </div>
      <div className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground-strong)]">
        {props.value}
      </div>
    </div>
  );
}
