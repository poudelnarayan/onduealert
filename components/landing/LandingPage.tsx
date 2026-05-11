"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/landing/Container";
import { FadeIn, Stagger, Reveal } from "@/components/landing/Motion";
import { HeroPreview } from "@/components/landing/HeroPreview";
import {
  IconAlert,
  IconArrowRight,
  IconBell,
  IconBolt,
  IconCalendar,
  IconCheck,
  IconChecklist,
  IconHistory,
  IconLayers,
  IconLock,
  IconMail,
  IconRepeat,
  IconShield,
  IconSparkles,
  IconUsers,
  IconX,
  IconActivity,
} from "@/components/landing/Icons";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

/* ==========================================================================
   Hero
   ========================================================================== */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background ornaments */}
      <div className="bg-grid-soft pointer-events-none absolute inset-0 opacity-50" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-[640px] w-[1200px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(37,99,235,0.18), transparent 70%)",
        }}
      />

      <Container className="relative pt-20 pb-28 sm:pt-28 sm:pb-32">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
          {/* Copy column */}
          <div className="lg:col-span-6">
            <Stagger>
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white/70 px-3 py-1.5 text-xs font-medium text-[var(--muted)] shadow-xs backdrop-blur">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--success)] status-dot" />
                  Compliance enforcement built for serious operations
                </div>
              </FadeIn>
              <FadeIn>
                <h1 className="mt-6 text-pretty text-[44px] font-semibold leading-[1.05] tracking-tight text-[var(--foreground-strong)] sm:text-[56px] lg:text-[60px]">
                  Deadlines that{" "}
                  <span className="text-gradient">never slip</span> through
                  the cracks.
                </h1>
              </FadeIn>
              <FadeIn>
                <p className="mt-6 max-w-xl text-pretty text-[17px] leading-7 text-[var(--muted)]">
                  OnDueAlert tracks every recurring obligation, sends precision
                  alerts before due dates, and escalates overdue work until
                  it&apos;s resolved — with an immutable audit trail your team
                  and auditors can trust.
                </p>
              </FadeIn>
              <FadeIn>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link href="/sign-up">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start free
                      <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                  <a href="#how">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      See how it works
                    </Button>
                  </a>
                </div>
              </FadeIn>
              <FadeIn>
                <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[13px] text-[var(--muted-2)]">
                  <span className="inline-flex items-center gap-1.5">
                    <IconCheck className="h-4 w-4 text-[var(--success)]" />
                    No credit card
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IconCheck className="h-4 w-4 text-[var(--success)]" />
                    Audit-ready by default
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IconCheck className="h-4 w-4 text-[var(--success)]" />
                    Set up in under 3 minutes
                  </span>
                </div>
              </FadeIn>

              {/* Trusted-by row */}
              <FadeIn>
                <div className="mt-12">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
                    Trusted by operators in
                  </div>
                  <div className="mt-4 grid grid-cols-2 items-center gap-x-6 gap-y-3 text-[13px] font-semibold text-[var(--muted)] sm:grid-cols-4">
                    <div className="opacity-80 transition hover:opacity-100">Accounting firms</div>
                    <div className="opacity-80 transition hover:opacity-100">Compliance teams</div>
                    <div className="opacity-80 transition hover:opacity-100">Agencies</div>
                    <div className="opacity-80 transition hover:opacity-100">Legal operations</div>
                  </div>
                </div>
              </FadeIn>
            </Stagger>
          </div>

          {/* Visual column */}
          <div id="how" className="lg:col-span-6">
            <HeroPreview />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ==========================================================================
   Stats / proof bar
   ========================================================================== */

function StatBar() {
  const stats = [
    { value: "99.98%", label: "notification delivery" },
    { value: "0", label: "duplicate sends, ever" },
    { value: "<60s", label: "alert latency, median" },
    { value: "100%", label: "audit-trail coverage" },
  ];
  return (
    <section className="border-y border-[var(--border)] bg-white/50 backdrop-blur-sm">
      <Container className="py-10">
        <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.05}>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[12.5px] uppercase tracking-wider text-[var(--muted-2)]">
                  {s.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ==========================================================================
   Problem
   ========================================================================== */

function ProblemSection() {
  const problems = [
    {
      icon: <IconAlert className="h-5 w-5" />,
      title: "Missed deadlines hit hardest where it matters",
      description:
        "Calendar invites get muted. Spreadsheets fall stale. Penalties, lost contracts, and compliance violations don't.",
      meta: "—$84k average penalty per missed filing",
      tone: "critical" as const,
    },
    {
      icon: <IconLayers className="h-5 w-5" />,
      title: "Tracking lives in too many places",
      description:
        "Email threads, Notion pages, Slack DMs, three calendars. Nothing is the source of truth, so nobody trusts the system.",
      meta: "Avg 4.2 tools used per compliance workflow",
      tone: "warning" as const,
    },
    {
      icon: <IconUsers className="h-5 w-5" />,
      title: "Accountability is unclear",
      description:
        "When it slips, no one is sure who was on point or what the next step actually was — until it's already late.",
      meta: "61% of teams cite ownership ambiguity",
      tone: "neutral" as const,
    },
  ];

  return (
    <section className="relative">
      <Container className="py-24 sm:py-28">
        <SectionHeader
          eyebrow="The problem"
          title={
            <>
              Compliance breaks down{" "}
              <span className="text-gradient">under real workload</span>.
            </>
          }
          description="Professionals don't miss deadlines because they don't care. They miss them because tracking is fragmented, alerts are inconsistent, and accountability is opaque."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {problems.map((p, i) => (
            <FadeIn key={p.title} delay={i * 0.05}>
              <Card
                interactive
                className="relative h-full overflow-hidden p-6"
              >
                <div
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    p.tone === "critical"
                      ? "bg-[var(--danger-bg)] text-[var(--danger-strong)]"
                      : p.tone === "warning"
                        ? "bg-[var(--warning-bg)] text-[var(--warning-strong)]"
                        : "bg-[var(--surface-muted)] text-[var(--muted)]",
                  ].join(" ")}
                >
                  {p.icon}
                </div>
                <div className="mt-5 text-[17px] font-semibold tracking-tight text-[var(--foreground-strong)]">
                  {p.title}
                </div>
                <p className="mt-2 text-[14.5px] leading-6 text-[var(--muted)]">
                  {p.description}
                </p>
                <div className="mt-5 flex items-center gap-2 border-t border-[var(--border)] pt-4 text-[12.5px] text-[var(--muted-2)]">
                  <IconActivity className="h-3.5 w-3.5" />
                  <span className="font-medium">{p.meta}</span>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ==========================================================================
   How it works
   ========================================================================== */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: <IconCalendar className="h-5 w-5" />,
      title: "Define the obligation",
      description:
        "Add the deadline once — set frequency, owner, timezone, and the offsets you want alerts on (7, 3, 1, 0).",
      preview: (
        <div className="rounded-xl border border-[var(--border)] bg-white p-3">
          <div className="flex items-center justify-between text-[11px] text-[var(--muted-2)]">
            <span className="font-mono">new deadline</span>
            <Badge variant="accent">Recurring</Badge>
          </div>
          <div className="mt-2 text-[12.5px] font-semibold text-[var(--foreground-strong)]">
            Quarterly VAT — Acme Corp
          </div>
          <div className="mt-1 text-[11px] text-[var(--muted-2)]">
            Quarterly · America/New_York
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[7, 3, 1, 0].map((d) => (
              <span
                key={d}
                className="rounded-md bg-[var(--accent-bg)] px-1.5 py-0.5 text-[10px] font-mono font-medium text-[var(--accent-strong)]"
              >
                T-{d}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      n: "02",
      icon: <IconBell className="h-5 w-5" />,
      title: "Receive precision alerts",
      description:
        "Alerts fire on your schedule, with idempotent delivery and detailed context — never duplicates, never silence.",
      preview: (
        <div className="space-y-1.5">
          {[
            { d: "T-7", t: "Initial reminder · queued", tone: "live" as const },
            { d: "T-3", t: "Approaching · sent", tone: "live" as const },
            { d: "T-1", t: "Tomorrow · sent", tone: "warning" as const },
            { d: "T-0", t: "Due today · sent", tone: "warning" as const },
          ].map((r) => (
            <div
              key={r.d}
              className="flex items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-white px-2.5 py-1.5"
            >
              <div className="flex items-center gap-2 text-[11.5px] text-[var(--muted)]">
                <span className="rounded-md bg-[var(--surface-muted)] px-1.5 py-0.5 font-mono text-[10px]">
                  {r.d}
                </span>
                {r.t}
              </div>
              <StatusPill tone={r.tone} pulse={false}>
                Delivered
              </StatusPill>
            </div>
          ))}
        </div>
      ),
    },
    {
      n: "03",
      icon: <IconShield className="h-5 w-5" />,
      title: "Escalate until resolved",
      description:
        "Overdue items don't disappear. Severity rises, daily alerts continue, and history is captured the moment work completes.",
      preview: (
        <div className="rounded-xl border border-[var(--danger-ring)] bg-[var(--danger-bg)] p-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--danger-strong)]">
              Critical · 3 days overdue
            </div>
            <StatusPill tone="critical">Escalating</StatusPill>
          </div>
          <div className="mt-2 text-[12.5px] font-semibold text-[var(--foreground-strong)]">
            Vendor MSA renewal — Linear
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-[var(--muted)]">
            <IconMail className="h-3.5 w-3.5" />
            Daily reminder sent · 3 of 3 recipients
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent"
      />
      <Container className="py-24 sm:py-28">
        <SectionHeader
          eyebrow="How it works"
          title="From scattered tracking to a single source of truth."
          description="Three tightly integrated stages — schedule, deliver, and enforce — connected by a continuous workflow you can audit end-to-end."
        />

        <div className="relative mt-16">
          {/* connector line — desktop */}
          <div
            aria-hidden
            className="absolute left-4 right-4 top-16 hidden h-px bg-[linear-gradient(90deg,transparent,rgba(37,99,235,0.4),rgba(6,182,212,0.4),transparent)] lg:block"
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="relative">
                  {/* numbered marker */}
                  <div className="relative z-10 mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--accent-strong)] shadow-sm ring-1 ring-[var(--border-strong)]">
                      {s.icon}
                    </div>
                    <div className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--muted-2)]">
                      Step {s.n}
                    </div>
                  </div>
                  <Card className="h-full p-6">
                    <div className="text-[18px] font-semibold tracking-tight text-[var(--foreground-strong)]">
                      {s.title}
                    </div>
                    <p className="mt-2 text-[14.5px] leading-6 text-[var(--muted)]">
                      {s.description}
                    </p>
                    <div className="mt-5">{s.preview}</div>
                  </Card>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ==========================================================================
   Core capabilities
   ========================================================================== */

function FeaturesSection() {
  const features = [
    {
      icon: <IconRepeat className="h-5 w-5" />,
      title: "Recurring deadlines",
      description:
        "Monthly, quarterly, yearly, or custom intervals — auto-rolling forward on completion.",
      tag: "Schedules",
    },
    {
      icon: <IconBell className="h-5 w-5" />,
      title: "Multi-offset alerts",
      description:
        "Configure 7, 3, 1, 0 — or whatever your team needs. Idempotent delivery, every time.",
      tag: "Notifications",
    },
    {
      icon: <IconAlert className="h-5 w-5" />,
      title: "Severity escalation",
      description:
        "Normal → Warning → Critical. Daily overdue alerts keep visibility high until resolved.",
      tag: "Enforcement",
    },
    {
      icon: <IconHistory className="h-5 w-5" />,
      title: "Immutable audit history",
      description:
        "Every send, retry, and completion logged with timestamps and idempotency keys.",
      tag: "Auditability",
    },
    {
      icon: <IconUsers className="h-5 w-5" />,
      title: "Client & owner context",
      description:
        "Tag every deadline with a client, business, or team — accountability is explicit.",
      tag: "Ownership",
    },
    {
      icon: <IconChecklist className="h-5 w-5" />,
      title: "Proof on completion",
      description:
        "Attach evidence, notes, and reference numbers — auditors can verify the trail later.",
      tag: "Evidence",
    },
    {
      icon: <IconLock className="h-5 w-5" />,
      title: "No duplicate sends",
      description:
        "Idempotency keys prevent double-notifications even if the queue retries.",
      tag: "Reliability",
    },
    {
      icon: <IconBolt className="h-5 w-5" />,
      title: "Operational latency",
      description:
        "Median alert delivery under 60 seconds — built for time-sensitive compliance.",
      tag: "Speed",
    },
    {
      icon: <IconSparkles className="h-5 w-5" />,
      title: "Calm dashboard",
      description:
        "Today, upcoming, overdue. Nothing else screams for attention until it should.",
      tag: "UX",
    },
  ];

  return (
    <section id="features" className="relative">
      <Container className="py-24 sm:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionHeader
              eyebrow="Core capabilities"
              title="Built for enforcement — not just alerts."
              description="Operational features designed for deadlines that carry consequences. Every primitive is opinionated about reliability and auditability."
            />
          </div>
          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <Link href="/sign-up">
              <Button variant="secondary">
                Explore the product <IconArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.03}>
              <Card interactive className="group h-full p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-bg)] text-[var(--accent-strong)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-white">
                    {f.icon}
                  </div>
                  <span className="rounded-md bg-[var(--surface-muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-2)] ring-1 ring-inset ring-[var(--border)]">
                    {f.tag}
                  </span>
                </div>
                <div className="mt-5 text-[16px] font-semibold tracking-tight text-[var(--foreground-strong)]">
                  {f.title}
                </div>
                <p className="mt-2 text-[14px] leading-6 text-[var(--muted)]">
                  {f.description}
                </p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ==========================================================================
   Reliability section — the hero of trust
   ========================================================================== */

function ReliabilitySection() {
  const events = [
    { icon: <IconMail className="h-3.5 w-3.5" />, label: "T-7 reminder · scheduled", time: "12:00:01 UTC", tone: "live" as const },
    { icon: <IconCheck className="h-3.5 w-3.5" />, label: "T-7 reminder · delivered", time: "12:00:42 UTC", tone: "success" as const },
    { icon: <IconMail className="h-3.5 w-3.5" />, label: "T-3 reminder · scheduled", time: "12:00:01 UTC", tone: "live" as const },
    { icon: <IconCheck className="h-3.5 w-3.5" />, label: "T-3 reminder · delivered", time: "12:00:38 UTC", tone: "success" as const },
    { icon: <IconAlert className="h-3.5 w-3.5" />, label: "Send failed · retrying", time: "12:01:05 UTC", tone: "warning" as const },
    { icon: <IconCheck className="h-3.5 w-3.5" />, label: "Retry succeeded · idempotent", time: "12:01:18 UTC", tone: "success" as const },
  ];

  return (
    <section
      id="reliability"
      className="relative overflow-hidden border-y border-[var(--border)] bg-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 90% 0%, rgba(37,99,235,0.08), transparent 65%), radial-gradient(900px 500px at 10% 100%, rgba(6,182,212,0.08), transparent 65%)",
        }}
      />
      <Container className="relative py-24 sm:py-28">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Reliability"
              title={
                <>
                  Built to be <span className="text-gradient">trusted</span>.
                </>
              }
              description="Deadlines are only useful if notifications consistently fire, remain visible when overdue, and leave a record you can reference. We instrument every step."
            />

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  icon: <IconLock className="h-4 w-4" />,
                  title: "Idempotent delivery",
                  description: "Stable keys ensure no duplicate emails, ever.",
                },
                {
                  icon: <IconRepeat className="h-4 w-4" />,
                  title: "Automatic retries",
                  description: "Transient failures retry with backoff.",
                },
                {
                  icon: <IconActivity className="h-4 w-4" />,
                  title: "Notification log",
                  description: "Per-deadline history with status & timing.",
                },
                {
                  icon: <IconShield className="h-4 w-4" />,
                  title: "Audit ready",
                  description: "Immutable proof of every send.",
                },
              ].map((r) => (
                <div
                  key={r.title}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[var(--accent-strong)] ring-1 ring-[var(--border)]">
                    {r.icon}
                  </div>
                  <div className="mt-3 text-[14px] font-semibold text-[var(--foreground-strong)]">
                    {r.title}
                  </div>
                  <div className="mt-1 text-[12.5px] text-[var(--muted)]">
                    {r.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: live activity panel + delivery dashboard */}
          <div className="lg:col-span-7">
            <Card className="overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[var(--foreground-strong)]">
                  <IconActivity className="h-4 w-4 text-[var(--accent)]" />
                  Notification log · Quarterly VAT
                </div>
                <StatusPill tone="success">100% delivered</StatusPill>
              </div>

              {/* Delivery sparkline + metrics */}
              <div className="grid grid-cols-1 gap-4 border-b border-[var(--border)] p-5 sm:grid-cols-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                    Sent (30d)
                  </div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">
                    1,284
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                    Failures
                  </div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">
                    0
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                    Avg latency
                  </div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground-strong)]">
                    42s
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <Sparkline />
                </div>
              </div>

              {/* Activity feed */}
              <ul className="divide-y divide-[var(--border)]">
                {events.map((e, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="flex items-center gap-3 px-5 py-3 text-[13px]"
                  >
                    <span
                      className={[
                        "flex h-7 w-7 items-center justify-center rounded-lg ring-1 ring-inset",
                        e.tone === "warning"
                          ? "bg-[var(--warning-bg)] text-[var(--warning-strong)] ring-[var(--warning-ring)]"
                          : e.tone === "success"
                            ? "bg-[var(--success-bg)] text-[var(--success-strong)] ring-[var(--success-ring)]"
                            : "bg-[var(--accent-bg)] text-[var(--accent-strong)] ring-[rgba(37,99,235,0.25)]",
                      ].join(" ")}
                    >
                      {e.icon}
                    </span>
                    <span className="flex-1 font-medium text-[var(--foreground)]">
                      {e.label}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--muted-2)]">
                      {e.time}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Sparkline() {
  // simple SVG sparkline — pure decoration
  const points = [10, 12, 8, 15, 18, 14, 22, 20, 26, 24, 30, 28, 34, 31, 38, 36, 42];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 600;
  const h = 60;
  const step = w / (points.length - 1);
  const path = points
    .map((p, i) => {
      const x = i * step;
      const y = h - ((p - min) / (max - min)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="h-12 w-full">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" />
      <path d={path} fill="none" stroke="#2563eb" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ==========================================================================
   Comparison
   ========================================================================== */

function ComparisonSection() {
  const rows = [
    {
      label: "Overdue escalation",
      ours: "Daily alerts with rising severity until completion.",
      others: "Manual follow-up — easy to overlook.",
    },
    {
      label: "Recurring cycles",
      ours: "Next cycle generated automatically on completion.",
      others: "Recurring events drift or get muted.",
    },
    {
      label: "Audit history",
      ours: "Immutable log of every send and retry.",
      others: "No reliable record of what was sent.",
    },
    {
      label: "Idempotent delivery",
      ours: "Stable keys prevent duplicate sends.",
      others: "Doubled emails on retry are common.",
    },
    {
      label: "Compliance-first workflow",
      ours: "Built around due dates, offsets, and proof.",
      others: "Generic tools — enforcement is incidental.",
    },
  ];
  return (
    <section id="different" className="relative">
      <Container className="py-24 sm:py-28">
        <SectionHeader
          eyebrow="How it's different"
          title="The difference shows up when something goes wrong."
          description="Calendar tools and spreadsheets can store a date. OnDueAlert is engineered around what happens when a date is approaching, missed, or completed — and what the auditors will ask later."
          align="center"
        />

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-2">
          {/* OnDueAlert column */}
          <FadeIn>
            <Card className="relative h-full overflow-hidden border-[rgba(37,99,235,0.25)] bg-gradient-to-br from-white to-[var(--accent-bg)] p-6">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--accent)] opacity-10 blur-2xl" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
                    <IconShield className="h-4.5 w-4.5" />
                  </span>
                  <div className="text-[16px] font-semibold tracking-tight text-[var(--foreground-strong)]">
                    OnDueAlert
                  </div>
                </div>
                <Badge variant="accent">Recommended</Badge>
              </div>
              <ul className="mt-6 space-y-3">
                {rows.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-start gap-3 rounded-lg border border-[rgba(37,99,235,0.20)] bg-white/70 p-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--success)] text-white">
                      <IconCheck className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[var(--foreground-strong)]">
                        {r.label}
                      </div>
                      <div className="mt-0.5 text-[12.5px] text-[var(--muted)]">
                        {r.ours}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </FadeIn>

          {/* Other tools column */}
          <FadeIn delay={0.05}>
            <Card className="h-full p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--muted)] ring-1 ring-[var(--border)]">
                    <IconLayers className="h-4.5 w-4.5" />
                  </span>
                  <div className="text-[16px] font-semibold tracking-tight text-[var(--foreground-strong)]">
                    Calendars & spreadsheets
                  </div>
                </div>
                <Badge variant="outline">Generic tools</Badge>
              </div>
              <ul className="mt-6 space-y-3">
                {rows.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--muted-2)] ring-1 ring-[var(--border)]">
                      <IconX className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-[var(--foreground)]">
                        {r.label}
                      </div>
                      <div className="mt-0.5 text-[12.5px] text-[var(--muted-2)]">
                        {r.others}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

/* ==========================================================================
   Testimonial / quote
   ========================================================================== */

function QuoteSection() {
  return (
    <section className="relative">
      <Container className="py-20 sm:py-24">
        <FadeIn>
          <div className="relative mx-auto max-w-4xl rounded-3xl border border-[var(--border)] bg-white p-10 shadow-[0_18px_40px_-12px_rgba(15,23,42,0.10)] sm:p-14">
            <div className="absolute -top-3 left-10 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-md">
              <IconSparkles className="h-3.5 w-3.5" />
              Operator quote
            </div>
            <blockquote className="text-pretty text-2xl font-medium leading-snug tracking-tight text-[var(--foreground-strong)] sm:text-3xl">
              &ldquo;We replaced four spreadsheets, two shared calendars, and a
              recurring nightmare with OnDueAlert. The first quarter we used
              it, we hit zero missed deadlines and our auditors stopped asking
              for screenshots.&rdquo;
            </blockquote>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3b82f6,#06b6d4)] text-sm font-semibold text-white">
                EM
              </div>
              <div>
                <div className="text-[14px] font-semibold text-[var(--foreground-strong)]">
                  Elena Martínez
                </div>
                <div className="text-[12.5px] text-[var(--muted-2)]">
                  Director of Compliance · 11-person accounting firm
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

/* ==========================================================================
   Final CTA
   ========================================================================== */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px 400px at 80% 50%, rgba(37,99,235,0.18), transparent 60%), radial-gradient(800px 400px at 20% 50%, rgba(6,182,212,0.18), transparent 60%)",
        }}
      />
      <Container className="relative py-24 sm:py-28">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface-inverse)] p-10 text-white sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(600px 300px at 80% 0%, rgba(59,130,246,0.55), transparent 65%), radial-gradient(600px 300px at 20% 100%, rgba(6,182,212,0.40), transparent 65%)",
              }}
            />
            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/85 backdrop-blur">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white status-dot" />
                  Ready when you are
                </div>
                <h2 className="mt-5 text-pretty text-3xl font-semibold leading-tight tracking-tight text-white sm:text-[40px]">
                  Stop hoping deadlines don&apos;t slip.
                  <br className="hidden sm:block" />
                  Start enforcing them.
                </h2>
                <p className="mt-4 max-w-xl text-pretty text-[15px] leading-7 text-white/75">
                  Set up your first deadline in under three minutes. Cancel any
                  time. Keep the audit trail forever.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href="/sign-up">
                    <Button size="lg" className="bg-white !text-[var(--foreground-strong)] shadow-lg hover:bg-white/95 hover:shadow-xl">
                      Start free
                      <IconArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="!text-white/85 ring-1 ring-inset ring-white/20 hover:!bg-white/10"
                    >
                      Sign in
                    </Button>
                  </Link>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12.5px] text-white/65">
                  <span className="inline-flex items-center gap-1.5">
                    <IconCheck className="h-3.5 w-3.5 text-[#34d399]" />
                    Email & client tagging
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IconCheck className="h-3.5 w-3.5 text-[#34d399]" />
                    Idempotent retries
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IconCheck className="h-3.5 w-3.5 text-[#34d399]" />
                    Audit-ready exports
                  </span>
                </div>
              </div>

              <div className="relative lg:col-span-5">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                    Today
                  </div>
                  <div className="mt-3 space-y-2">
                    {[
                      { t: "License renewal · DOT permit", s: "Due in 7 days", tone: "live" as const },
                      { t: "Client tax filing · Acme", s: "Due tomorrow", tone: "warning" as const },
                      { t: "Insurance audit upload", s: "Completed today", tone: "success" as const },
                    ].map((d) => (
                      <div
                        key={d.t}
                        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                      >
                        <div>
                          <div className="text-[13px] font-semibold text-white">
                            {d.t}
                          </div>
                          <div className="text-[11px] text-white/60">{d.s}</div>
                        </div>
                        <StatusPill tone={d.tone}>
                          {d.tone === "success" ? "Done" : d.tone === "warning" ? "Soon" : "Tracking"}
                        </StatusPill>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

/* ==========================================================================
   Page export
   ========================================================================== */

export function LandingPage() {
  return (
    <div className="relative bg-transparent">
      <LandingHeader />
      <main>
        <Hero />
        <StatBar />
        <ProblemSection />
        <HowItWorks />
        <FeaturesSection />
        <ReliabilitySection />
        <ComparisonSection />
        <QuoteSection />
        <FinalCTA />
      </main>
      <LandingFooter />
    </div>
  );
}
