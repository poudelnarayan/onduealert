import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addDaysUtc, startOfDayUtc } from "@/lib/dates";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ReminderListClient } from "@/components/ReminderListClient";
import { computeEscalationLevel } from "@/lib/escalation";
import { auth } from "@clerk/nextjs/server";
import { DueTodayListClient } from "@/components/DueTodayListClient";
import { PageHeader } from "@/components/app/PageHeader";
import { MetricCard } from "@/components/app/MetricCard";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  IconActivity,
  IconAlert,
  IconArrowRight,
  IconBell,
  IconCalendar,
  IconCheck,
  IconChecklist,
  IconShield,
} from "@/components/landing/Icons";

function dateOnly(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const today = startOfDayUtc(new Date());
  const tomorrow = addDaysUtc(today, 1);
  const in7 = addDaysUtc(today, 7);
  const in30 = addDaysUtc(today, 30);

  const [overdue, dueToday, next7, next30, completed, openCount, overdueCount] =
    await prisma.$transaction([
      prisma.reminder.findMany({
        where: { clerkUserId: userId, status: "OPEN", dueAt: { lt: today } },
        include: { schedule: true },
        orderBy: { dueAt: "asc" },
        take: 10,
      }),
      prisma.reminder.findMany({
        where: {
          clerkUserId: userId,
          status: "OPEN",
          dueAt: { gte: today, lt: tomorrow },
        },
        include: { schedule: true },
        orderBy: { dueAt: "asc" },
        take: 20,
      }),
      prisma.reminder.findMany({
        where: {
          clerkUserId: userId,
          status: "OPEN",
          dueAt: { gte: tomorrow, lt: in7 },
        },
        include: { schedule: true },
        orderBy: { dueAt: "asc" },
        take: 20,
      }),
      prisma.reminder.findMany({
        where: {
          clerkUserId: userId,
          status: "OPEN",
          dueAt: { gte: in7, lt: in30 },
        },
        include: { schedule: true },
        orderBy: { dueAt: "asc" },
        take: 20,
      }),
      prisma.reminder.findMany({
        where: { clerkUserId: userId, status: "COMPLETED" },
        include: { schedule: true },
        orderBy: { completedAt: "desc" },
        take: 10,
      }),
      prisma.reminder.count({ where: { clerkUserId: userId, status: "OPEN" } }),
      prisma.reminder.count({
        where: { clerkUserId: userId, status: "OPEN", dueAt: { lt: today } },
      }),
    ]);

  const criticalCount =
    overdue.filter(
      (r) =>
        computeEscalationLevel({
          dueAt: r.dueAt,
          status: r.status,
          timeZone: r.schedule.timezone,
        }).level === "CRITICAL",
    ).length ?? 0;

  // compute compliance score (rough heuristic)
  const totalActive = openCount + completed.length;
  const score =
    totalActive === 0
      ? 100
      : Math.max(
          0,
          Math.round(100 - (overdueCount * 100) / Math.max(1, totalActive)),
        );

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow={
          <>
            <IconActivity className="h-3.5 w-3.5" />
            Operations overview
          </>
        }
        title="Dashboard"
        description={
          <>
            Today&apos;s deadlines, upcoming risk, and overdue enforcement at a glance.
          </>
        }
        actions={
          <>
            <Link href="/reminders">
              <Button variant="secondary">All deadlines</Button>
            </Link>
            <Link href="/reminders/new">
              <Button>
                <IconCalendar className="h-4 w-4" /> Create deadline
              </Button>
            </Link>
          </>
        }
      />

      {/* KPI grid */}
      <section>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard
            label="Open"
            value={openCount}
            hint="Currently tracked deadlines"
            icon={<IconChecklist className="h-4 w-4" />}
            tone="live"
          />
          <MetricCard
            label="Overdue"
            value={overdueCount}
            hint={
              overdueCount === 0 ? "All clear" : "Daily escalation in progress"
            }
            icon={<IconAlert className="h-4 w-4" />}
            tone={overdueCount > 0 ? "critical" : "success"}
          />
          <MetricCard
            label="Critical"
            value={criticalCount}
            hint={criticalCount === 0 ? "None" : "≥ 3 days overdue"}
            icon={<IconBell className="h-4 w-4" />}
            tone={criticalCount > 0 ? "critical" : "neutral"}
          />
          <MetricCard
            label="Compliance score"
            value={`${score}`}
            hint="Heuristic — overdue vs. active"
            icon={<IconShield className="h-4 w-4" />}
            tone={score >= 95 ? "success" : score >= 80 ? "warning" : "critical"}
          />
        </div>
      </section>

      {/* Overdue */}
      <section className="space-y-4">
        <SectionTitle
          title="Overdue"
          tone={overdueCount ? "critical" : "success"}
          status={overdueCount ? "Requires attention" : "All clear"}
        />
        {overdue.length === 0 ? (
          <EmptyState
            title="No overdue deadlines"
            description="When a deadline becomes overdue, it will surface here and continue to escalate until completed."
            icon={<IconCheck className="h-5 w-5" />}
          />
        ) : (
          <ReminderListClient reminders={overdue} />
        )}
      </section>

      {/* Two-column: Due today + Next 7 days */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <SectionTitle title="Due today" tone="warning" status={`${dueToday.length} item${dueToday.length === 1 ? "" : "s"}`} />
          {dueToday.length === 0 ? (
            <Card variant="muted" className="text-center">
              <div className="text-sm font-medium text-[var(--foreground)]">
                Nothing due today.
              </div>
              <div className="mt-1 text-[13px] text-[var(--muted-2)]">
                Enjoy the calm. Upcoming work is in the next column.
              </div>
            </Card>
          ) : (
            <Card padding="sm">
              <DueTodayListClient reminders={dueToday} maxItems={8} />
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <SectionTitle title="Next 7 days" tone="live" status={`${next7.length} upcoming`} />
          {next7.length === 0 ? (
            <EmptyState
              title="Nothing in the next week"
              description="Set offsets like 7,3,1,0 to keep upcoming deadlines visible early."
            />
          ) : (
            <ReminderListClient reminders={next7} />
          )}
        </div>
      </section>

      {/* Next 30 days */}
      <section className="space-y-4">
        <SectionTitle
          title="Next 30 days"
          tone="neutral"
          status={`${next30.length} scheduled`}
        />
        {next30.length === 0 ? (
          <EmptyState
            title="No deadlines in the next 30 days"
            description="Create a deadline to begin tracking recurring or one-time work."
            ctaLabel="Create deadline"
            ctaHref="/reminders/new"
            icon={<IconCalendar className="h-5 w-5" />}
          />
        ) : (
          <ReminderListClient reminders={next30} />
        )}
      </section>

      {/* Recently completed */}
      <section className="space-y-4">
        <SectionTitle
          title="Recently completed"
          tone="success"
          status={completed.length ? `Showing ${completed.length}` : "—"}
        />
        {completed.length === 0 ? (
          <EmptyState
            title="No completion history yet"
            description="When you complete a deadline, it will appear here along with its proof and notes."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {completed.map((r) => (
              <Card key={r.id} padding="sm" className="hover-lift">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-sm font-semibold text-[var(--foreground-strong)]">
                        {r.title}
                      </div>
                      <Badge variant="success" dot>
                        Completed
                      </Badge>
                    </div>
                    <div className="mt-1 text-[12.5px] text-[var(--muted-2)]">
                      Due <span className="font-mono">{dateOnly(r.dueAt)}</span>
                    </div>
                  </div>
                  <Link href={`/reminders/${r.id}/edit`}>
                    <Button size="sm" variant="ghost">
                      View <IconArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SectionTitle(props: {
  title: string;
  status?: string;
  tone?: "live" | "critical" | "warning" | "success" | "neutral";
}) {
  const tone = props.tone ?? "live";
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-[15px] font-semibold tracking-tight text-[var(--foreground-strong)]">
        {props.title}
      </h2>
      {props.status ? <StatusPill tone={tone}>{props.status}</StatusPill> : null}
    </div>
  );
}
