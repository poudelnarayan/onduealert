"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/landing/Container";
import { FadeIn, Stagger } from "@/components/landing/Motion";
import {
  IconAlert,
  IconBell,
  IconCalendar,
  IconChecklist,
  IconHistory,
  IconShield,
} from "@/components/landing/Icons";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

function SectionTitle(props: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {props.eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">
          {props.eyebrow}
        </div>
      ) : null}
      <h2 className="mt-2 text-pretty text-2xl font-semibold tracking-tight text-brand-900 sm:text-3xl">
        {props.title}
      </h2>
      {props.description ? (
        <p className="mt-3 text-pretty text-base leading-7 text-brand-700">
          {props.description}
        </p>
      ) : null}
    </div>
  );
}

function FeatureCard(props: {
  icon: React.ReactNode;
  title: string;
  description: string;
  tone?: "default" | "emergency";
}) {
  const tone = props.tone ?? "default";
  const iconWrap =
    tone === "emergency"
      ? "mt-0.5 rounded-md border border-danger/40 bg-danger-bg p-2 text-danger"
      : "mt-0.5 rounded-md border border-border bg-surface-muted p-2 text-accent";
  return (
    <FadeIn>
      <Card className="h-full border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <div className={iconWrap}>{props.icon}</div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-brand-900">
              {props.title}
            </div>
            <div className="mt-1 text-sm leading-6 text-brand-700">
              {props.description}
            </div>
          </div>
        </div>
      </Card>
    </FadeIn>
  );
}

// (Audience section removed in favor of Reliability — keep component slot for future expansion.)

function ComparisonRow(props: {
  label: string;
  onduealert: string;
  other: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 border-t border-border py-4 sm:grid-cols-3 sm:items-start">
      <div className="text-sm font-medium text-brand-900">{props.label}</div>
      <div className="text-sm text-brand-700">
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-success/10 text-accent-success">
          ✓
        </span>
        {props.onduealert}
      </div>
      <div className="text-sm text-brand-700">
        <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-200 text-brand-900">
          –
        </span>
        {props.other}
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      <LandingHeader />

      <main>
        {/* Hero */}
        <section className="border-b border-border">
          <Container className="py-14 sm:py-20">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
              <div className="min-w-0">
                <Stagger>
                  <FadeIn>
                    <Badge>
                      Compliance enforcement for recurring deadlines
                    </Badge>
                  </FadeIn>
                  <FadeIn>
                    <h1 className="mt-4 text-pretty text-4xl font-semibold tracking-tight text-brand-950 sm:text-5xl">
                      Never <span className="text-danger">miss</span> a deadline
                      again.
                    </h1>
                  </FadeIn>
                  <FadeIn>
                    <p className="mt-4 max-w-prose text-pretty text-base leading-7 text-brand-700">
                      OnDueAlert tracks deadlines, sends timely notifications, and
                      escalates overdue items until they’re resolved—so critical
                      work doesn’t disappear into calendars and spreadsheets.
                    </p>
                  </FadeIn>
                  <FadeIn>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <Link href="/sign-up" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                          Get started
                        </Button>
                      </Link>
                      <a href="#how" className="w-full sm:w-auto">
                        <Button
                          variant="secondary"
                          className="w-full sm:w-auto"
                        >
                          See how it works
                        </Button>
                      </a>
                    </div>
                    <div className="mt-3 text-sm text-brand-600">
                      No clutter. Clear escalation. Built for accountability.
                    </div>
                  </FadeIn>
                </Stagger>
              </div>

              <FadeIn className="min-w-0">
                <div
                  id="how"
                  className="rounded-xl border border-border bg-surface p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-brand-900">
                      Today & upcoming
                    </div>
                    <Badge variant="success">Notifications active</Badge>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      {
                        title: "Quarterly filing",
                        due: "2026-01-31",
                        note: "Offsets: 7, 3, 1, 0",
                      },
                      {
                        title: "License renewal",
                        due: "2026-02-10",
                        note: "Recurring yearly",
                      },
                      {
                        title: "Contract review",
                        due: "2026-02-15",
                        note: "Recurring monthly",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-lg border border-border bg-surface-muted p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-brand-900">
                              {item.title}
                            </div>
                            <div className="mt-1 text-sm text-brand-700">
                              Due:{" "}
                              <span className="font-mono">{item.due}</span>
                            </div>
                          </div>
                          <Badge className="shrink-0">{item.note}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-lg border border-border bg-surface-muted p-3">
                    <div className="text-sm font-semibold text-brand-900">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-danger" aria-hidden />
                        Overdue escalation
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-brand-700">
                      When a deadline becomes overdue, OnDueAlert raises
                      severity and sends daily alerts until completion—so it
                      stays visible.
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Problem */}
        <section className="border-b border-border bg-surface">
          <Container className="py-12 sm:py-16">
            <SectionTitle
              eyebrow="The problem"
              title="Compliance tracking breaks down under real workload."
              description="Professionals don’t miss deadlines because they don’t care. They miss them because tracking lives in too many places, alerts are inconsistent, and accountability is unclear."
            />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={<IconAlert className="h-5 w-5" title="Alert" />}
                title="Missed deadlines"
                description="A calendar invite is easy to ignore. Deadlines still arrive—often with penalties."
                tone="emergency"
              />
              <FeatureCard
                icon={<IconShield className="h-5 w-5" title="Shield" />}
                title="Financial and operational risk"
                description="Late filings, renewals, and reports introduce avoidable risk for you and your clients."
              />
              <FeatureCard
                icon={<IconChecklist className="h-5 w-5" title="Checklist" />}
                title="Manual tracking chaos"
                description="Spreadsheets and ad‑hoc notes become untrusted the moment they fall out of date."
              />
            </div>
          </Container>
        </section>

        {/* Solution */}
        <section className="border-b border-border">
          <Container className="py-12 sm:py-16">
            <SectionTitle
              eyebrow="How it works"
              title="Three steps. No clutter."
              description="Predictable schedules, clear ownership, and escalation that keeps overdue work visible."
            />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={<IconCalendar className="h-5 w-5" title="Calendar" />}
                title="1) Add deadlines"
                description="Create deadlines for taxes, renewals, contracts, and reports. Set the due date and recurrence."
              />
              <FeatureCard
                icon={<IconBell className="h-5 w-5" title="Bell" />}
                title="2) Get alerts"
                description="Choose offsets like 7, 1, and 0 days before. Email notifications are sent based on your schedule."
              />
              <FeatureCard
                icon={<IconShield className="h-5 w-5" title="Shield" />}
                title="3) Stay compliant"
                description="Mark items complete. Recurring deadlines automatically roll forward to the next cycle."
              />
            </div>
          </Container>
        </section>

        {/* Features */}
        <section id="features" className="border-b border-border bg-surface">
          <Container className="py-12 sm:py-16">
            <SectionTitle
              eyebrow="Core capabilities"
              title="Built for enforcement, not just alerts."
              description="Operational features designed for deadlines with consequences."
            />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<IconCalendar className="h-5 w-5" title="Recurring" />}
                title="Recurring deadlines"
                description="Monthly/quarterly/yearly/custom schedules that roll forward on completion."
              />
              <FeatureCard
                icon={<IconAlert className="h-5 w-5" title="Overdue" />}
                title="Escalation levels"
                description="Normal → Warning → Critical with daily overdue alerts until resolved."
              />
              <FeatureCard
                icon={<IconChecklist className="h-5 w-5" title="Templates" />}
                title="Proof & completion history"
                description="Record completion notes and attach evidence for auditability."
              />
              <FeatureCard
                icon={<IconShield className="h-5 w-5" title="Client tracking" />}
                title="Client context"
                description="Tag deadlines with a client/business so ownership and risk are explicit."
              />
              <FeatureCard
                icon={<IconBell className="h-5 w-5" title="Email" />}
                title="Multi-offset alerts"
                description="Offsets like 7/3/1/0 plus overdue enforcement."
              />
              <FeatureCard
                icon={<IconHistory className="h-5 w-5" title="Audit history" />}
                title="Reliability"
                description="Idempotency prevents duplicates; failures are retried and tracked."
              />
            </div>
          </Container>
        </section>

        {/* Reliability */}
        <section id="reliability" className="border-b border-border">
          <Container className="py-12 sm:py-16">
            <SectionTitle
              eyebrow="Reliability"
              title="Designed to be trusted."
              description="Deadlines are only useful if notifications consistently fire, remain visible when overdue, and leave a record you can reference."
            />

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FeatureCard
                icon={<IconHistory className="h-5 w-5" title="Log" />}
                title="Notification log"
                description="Track what was scheduled, sent, or failed—per deadline and day."
              />
              <FeatureCard
                icon={<IconShield className="h-5 w-5" title="Idempotency" />}
                title="No duplicate sends"
                description="Idempotency prevents accidental double-notifications."
              />
              <FeatureCard
                icon={<IconBell className="h-5 w-5" title="Retries" />}
                title="Retries & escalation"
                description="Failed sends are retried and overdue items continue until completed."
              />
            </div>
          </Container>
        </section>

        {/* How it's different */}
        <section id="different" className="border-b border-border bg-surface">
          <Container className="py-12 sm:py-16">
            <SectionTitle
              eyebrow="How it’s different"
              title="Designed for enforcement, not just alerts."
              description="Calendar tools and spreadsheets can track a date. OnDueAlert focuses on consistent delivery, escalation, and auditability."
            />

            <div className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-sm">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  Capability
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  OnDueAlert
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  Calendar / Spreadsheet
                </div>
              </div>
              <ComparisonRow
                label="Overdue escalation"
                onduealert="Daily emails until completion."
                other="Manual follow-up; easy to overlook."
              />
              <ComparisonRow
                label="Recurring cycles"
                onduealert="Next cycle created automatically when completed."
                other="Recurring events drift or get ignored."
              />
              <ComparisonRow
                label="Audit history"
                onduealert="Logged notification sends for reliability."
                other="No reliable record of what was sent."
              />
              <ComparisonRow
                label="Compliance-focused workflow"
                onduealert="Built around due dates, offsets, and completion."
                other="Generic tools; enforcement is incidental."
              />
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-background">
          <Container className="py-12 sm:py-16">
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
                <div className="min-w-0">
                  <h2 className="text-pretty text-2xl font-semibold tracking-tight text-brand-950 sm:text-3xl">
                    Deadlines shouldn’t be a{" "}
                    <span className="text-danger">risk</span>.
                  </h2>
                  <p className="mt-3 max-w-prose text-pretty text-base leading-7 text-brand-700">
                    Set up predictable deadlines, receive notifications ahead of
                    time, and escalate overdue items until they’re resolved.
                  </p>
                  <div className="mt-3 text-sm text-brand-600">
                    Calm workflow. Clear escalation. Durable history.
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Link href="/sign-up" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto">Get started</Button>
                  </Link>
                  <Link href="/sign-in" className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full sm:w-auto">
                      Sign in
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}


