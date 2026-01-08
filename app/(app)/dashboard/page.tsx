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
        }).level === "CRITICAL"
    ).length ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="text-lg font-semibold text-brand-900">
            Dashboard
          </div>
          <div className="mt-1 text-sm text-brand-600">
            Today’s deadlines, upcoming <span className="text-danger">risk</span>
            , and overdue enforcement.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{openCount} open</Badge>
            <Badge variant={overdueCount ? "warning" : "neutral"}>
              {overdueCount} overdue
            </Badge>
            <Badge variant={criticalCount ? "critical" : "neutral"}>
              {criticalCount} critical
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/reminders/new">
            <Button>Create deadline</Button>
          </Link>
          <Link href="/reminders">
            <Button variant="secondary">All deadlines</Button>
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-wide text-accent">
            Overdue
          </div>
          <div className="text-sm text-brand-600">
            {overdueCount ? "Requires attention" : "Clear"}
          </div>
        </div>
        {overdue.length === 0 ? (
          <EmptyState
            title="No overdue deadlines"
            description="Overdue deadlines stay visible and continue to escalate until completed."
          />
        ) : (
          <ReminderListClient reminders={overdue} />
        )}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <div className="text-sm font-semibold tracking-wide text-accent">
            Due today
          </div>
          <Card>
            {dueToday.length === 0 ? (
              <div className="text-sm text-[rgba(238,238,238,0.7)]">
                Nothing due today.
              </div>
            ) : (
              <DueTodayListClient reminders={dueToday} maxItems={8} />
            )}
          </Card>
        </section>

        <section className="space-y-3">
          <div className="text-sm font-semibold tracking-wide text-accent">
            Next 7 days
          </div>
          {next7.length === 0 ? (
            <EmptyState
              title="No deadlines in the next 7 days"
              description="Keep a light workload by setting offsets and handling items early."
            />
          ) : (
            <ReminderListClient reminders={next7} />
          )}
        </section>
      </div>

      <section className="space-y-3">
        <div className="text-sm font-semibold tracking-wide text-accent">
          Next 30 days
        </div>
        {next30.length === 0 ? (
          <EmptyState
            title="No deadlines in the next 30 days"
            description="Create a deadline to begin tracking recurring or one-time work."
            ctaLabel="Create deadline"
            ctaHref="/reminders/new"
          />
        ) : (
          <ReminderListClient reminders={next30} />
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold tracking-wide text-accent">
            Recently completed
          </div>
          <div className="text-sm text-brand-600">
            {completed.length ? `Showing ${completed.length}` : "—"}
          </div>
        </div>
        {completed.length === 0 ? (
          <EmptyState
            title="No completion history yet"
            description="When you complete a deadline, it will appear here along with its proof and notes."
          />
        ) : (
          <div className="space-y-2">
            {completed.map((r) => (
              <Card key={r.id} className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="truncate text-sm font-semibold text-brand-900">
                        {r.title}
                      </div>
                      <Badge variant="success">Completed</Badge>
                    </div>
                    <div className="mt-1 text-sm text-brand-600">
                      Due <span className="font-mono">{dateOnly(r.dueAt)}</span>
                    </div>
                  </div>
                  <Link href={`/reminders/${r.id}/edit`}>
                    <Button size="sm" variant="secondary">
                      View
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


