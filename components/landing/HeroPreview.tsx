"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { StatusPill } from "@/components/ui/StatusPill";
import { IconShield } from "@/components/landing/Icons";

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
    meta: "Tax · Quarterly",
    due: "Jan 31",
    tone: "live",
    badge: "In 7d",
  },
  {
    title: "Vendor MSA renewal — Linear",
    meta: "Contract · Yearly",
    due: "Feb 10",
    tone: "warning",
    badge: "In 3d",
  },
  {
    title: "Operating license renewal",
    meta: "License · Yearly",
    due: "Feb 15",
    tone: "live",
    badge: "On track",
  },
  {
    title: "SOC 2 evidence collection",
    meta: "Custom · Monthly",
    due: "Overdue",
    tone: "critical",
    badge: "Overdue",
  },
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
        className="relative rounded-2xl border border-[var(--border)] bg-white/85 p-3 shadow-[0_28px_60px_-20px_rgba(15,23,42,0.20),0_8px_18px_-6px_rgba(15,23,42,0.10)] backdrop-blur-xl"
      >
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          {/* Browser chrome */}
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
            </div>
            <div className="hidden items-center gap-2 rounded-md border border-[var(--border)] bg-white px-2.5 py-1 text-[11px] text-[var(--muted)] sm:flex">
              <IconShield className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span className="font-mono">app.onduealert.com / dashboard</span>
            </div>
            <span className="w-16" />
          </div>

          {/* Body */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">
                  Dashboard
                </div>
                <div className="mt-0.5 text-[15px] font-semibold tracking-tight text-[var(--foreground-strong)]">
                  Active deadlines
                </div>
              </div>
              <div className="flex items-center gap-1">
                <PillButton active>All</PillButton>
                <PillButton>Today</PillButton>
                <PillButton>This week</PillButton>
                <PillButton>Overdue</PillButton>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              {ITEMS.map((it, i) => (
                <motion.div
                  key={it.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.2 + i * 0.07 }}
                  className="group flex items-center gap-3 rounded-lg border border-[var(--border)] bg-white p-3 transition hover:border-[var(--border-strong)]"
                >
                  <span
                    className={[
                      "h-8 w-1 shrink-0 rounded-full",
                      it.tone === "critical"
                        ? "bg-[var(--danger)]"
                        : it.tone === "warning"
                          ? "bg-[var(--warning)]"
                          : "bg-[var(--accent)]",
                    ].join(" ")}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[13px] font-semibold text-[var(--foreground-strong)]">
                      {it.title}
                    </div>
                    <div className="mt-0.5 truncate text-[11.5px] text-[var(--muted-2)]">
                      {it.meta}
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <span className="text-[11.5px] text-[var(--muted)]">
                      {it.due}
                    </span>
                    <StatusPill tone={it.tone} pulse={it.tone === "critical"}>
                      {it.badge}
                    </StatusPill>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PillButton({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-md px-2 py-1 text-[11.5px] font-medium",
        active
          ? "bg-white text-[var(--foreground-strong)] ring-1 ring-inset ring-[var(--border-strong)]"
          : "text-[var(--muted)]",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
