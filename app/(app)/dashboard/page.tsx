import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addDaysUtc, startOfDayUtc } from "@/lib/dates";
import { Button } from "@/components/ui/Button";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/app/PageHeader";
import { MetricCard } from "@/components/app/MetricCard";
import { CategoryBreakdown } from "@/components/app/CategoryBreakdown";
import { UpcomingTimeline } from "@/components/app/UpcomingTimeline";
import { DeadlinesTable } from "@/components/app/DeadlinesTable";
import {
  IconAlert,
  IconCalendar,
  IconCheck,
  IconChecklist,
} from "@/components/landing/Icons";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const today = startOfDayUtc(new Date());
  const in14 = addDaysUtc(today, 14);
  const in60 = addDaysUtc(today, 60);
  const past30 = addDaysUtc(today, -30);

  const [allActive, upcoming, recentCompletions, sumByCategory, completed30dCount] =
    await Promise.all([
      // everything still relevant to show in main table — open + recently completed
      prisma.reminder.findMany({
        where: {
          clerkUserId: userId,
          OR: [
            { status: "OPEN" },
            { status: "COMPLETED", completedAt: { gte: past30 } },
          ],
        },
        include: { schedule: true },
        orderBy: [{ status: "asc" }, { dueAt: "asc" }],
        take: 200,
      }),
      // next 14 days upcoming
      prisma.reminder.findMany({
        where: {
          clerkUserId: userId,
          status: "OPEN",
          dueAt: { gte: today, lt: in14 },
        },
        include: { schedule: true },
        orderBy: { dueAt: "asc" },
        take: 8,
      }),
      // recent activity (completions)
      prisma.reminderCompletion.findMany({
        where: { clerkUserId: userId },
        orderBy: { completedAt: "desc" },
        take: 6,
        include: {
          reminder: { select: { title: true, id: true, clientName: true } },
        },
      }),
      prisma.reminder.groupBy({
        by: ["category"],
        where: { clerkUserId: userId, status: "OPEN" },
        _count: { _all: true },
      }),
      prisma.reminder.count({
        where: {
          clerkUserId: userId,
          status: "COMPLETED",
          completedAt: { gte: past30 },
        },
      }),
    ]);

  const openCount = allActive.filter((r) => r.status === "OPEN").length;
  const overdueOpen = allActive.filter(
    (r) => r.status === "OPEN" && r.dueAt < today,
  );
  const overdueCount = overdueOpen.length;
  const dueIn7Count = allActive.filter(
    (r) =>
      r.status === "OPEN" &&
      r.dueAt >= today &&
      r.dueAt < addDaysUtc(today, 7),
  ).length;

  // overdue categorized by category for breakdown
  const overdueByCat = overdueOpen.reduce<Record<string, number>>((m, r) => {
    m[r.category] = (m[r.category] ?? 0) + 1;
    return m;
  }, {});

  const breakdownRows = ["TAX", "CONTRACT", "LICENSE", "CUSTOM"].map(
    (cat) => ({
      label: cat,
      open: sumByCategory.find((g) => g.category === cat)?._count._all ?? 0,
      overdue: overdueByCat[cat] ?? 0,
    }),
  );

  return (
    <div className="space-y-7">
      <PageHeader
        title="Dashboard"
        description="Active deadlines across all clients and categories."
        actions={
          <>
            <Link href="/reminders">
              <Button variant="secondary">All deadlines</Button>
            </Link>
            <Link href="/reminders/new">
              <Button>
                <IconCalendar className="h-4 w-4" /> New deadline
              </Button>
            </Link>
          </>
        }
      />

      {/* KPI strip */}
      <section>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MetricCard
            label="Open"
            value={openCount}
            hint="Currently tracked"
            icon={<IconChecklist className="h-4 w-4" />}
            tone="live"
          />
          <MetricCard
            label="Due in 7 days"
            value={dueIn7Count}
            hint={dueIn7Count === 0 ? "Calm week" : "Plan time this week"}
            icon={<IconCalendar className="h-4 w-4" />}
            tone={dueIn7Count > 0 ? "warning" : "neutral"}
          />
          <MetricCard
            label="Overdue"
            value={overdueCount}
            hint={overdueCount === 0 ? "All caught up" : "Escalating daily"}
            icon={<IconAlert className="h-4 w-4" />}
            tone={overdueCount > 0 ? "critical" : "success"}
          />
          <MetricCard
            label="Completed · 30d"
            value={completed30dCount}
            hint="Closed in the last month"
            icon={<IconCheck className="h-4 w-4" />}
            tone="success"
          />
        </div>
      </section>

      {/* Main grid: table + sidebar */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {allActive.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-white/60 p-10 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-bg)] text-[var(--accent-strong)]">
                <IconCalendar className="h-5 w-5" />
              </div>
              <div className="text-base font-semibold text-[var(--foreground-strong)]">
                Add your first deadline
              </div>
              <div className="mx-auto mt-1 max-w-md text-[13.5px] text-[var(--muted)]">
                Track recurring filings, license renewals, contract reviews,
                and one-off compliance work in one place.
              </div>
              <div className="mt-4">
                <Link href="/reminders/new">
                  <Button>
                    <IconCalendar className="h-4 w-4" /> New deadline
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <DeadlinesTable reminders={allActive} initialFilter="all" />
          )}
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <UpcomingTimeline items={upcoming} />
          <CategoryBreakdown rows={breakdownRows} />

          {/* Recent activity — sourced from real completions */}
          <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[var(--foreground-strong)]">
                Recent activity
              </h3>
              {recentCompletions.length > 0 ? (
                <span className="text-[11px] text-[var(--muted-2)]">
                  Last {recentCompletions.length}
                </span>
              ) : null}
            </div>
            {recentCompletions.length === 0 ? (
              <div className="mt-3 text-[13px] text-[var(--muted-2)]">
                Completions you record will appear here.
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {recentCompletions.map((c) => (
                  <li key={c.id} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--success-bg)] text-[var(--success-strong)] ring-1 ring-inset ring-[var(--success-ring)]">
                      <IconCheck className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/reminders/${c.reminder.id}/edit`}
                        className="block truncate text-[13px] font-semibold text-[var(--foreground)] hover:text-[var(--accent-strong)]"
                      >
                        {c.reminder.title}
                      </Link>
                      <div className="mt-0.5 text-[11.5px] text-[var(--muted-2)]">
                        Completed{" "}
                        {new Date(c.completedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                        {c.reminder.clientName ? ` · ${c.reminder.clientName}` : ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
