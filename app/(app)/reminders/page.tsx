import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { startOfDayUtc } from "@/lib/dates";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ReminderListClient } from "@/components/ReminderListClient";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  IconCalendar,
  IconChecklist,
} from "@/components/landing/Icons";

export default async function RemindersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const today = startOfDayUtc(new Date());
  const reminders = await prisma.reminder.findMany({
    where: { clerkUserId: userId },
    include: { schedule: true },
    orderBy: [{ status: "asc" }, { dueAt: "asc" }],
  });

  const open = reminders.filter((r) => r.status === "OPEN");
  const overdue = open.filter((r) => r.dueAt < today);
  const upcoming = open.filter((r) => r.dueAt >= today);
  const completed = reminders.filter((r) => r.status === "COMPLETED");

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow={
          <>
            <IconChecklist className="h-3.5 w-3.5" />
            All deadlines
          </>
        }
        title="Deadlines"
        description="Track recurring and one-time deadlines with escalation, proof, and audit history."
        actions={
          <Link href="/reminders/new">
            <Button>
              <IconCalendar className="h-4 w-4" />
              Create deadline
            </Button>
          </Link>
        }
      />

      {reminders.length === 0 ? (
        <EmptyState
          title="No deadlines yet"
          description="Create your first deadline to start tracking. Add offsets like 7,3,1,0 to get notified before the due date."
          ctaLabel="Create deadline"
          ctaHref="/reminders/new"
          icon={<IconCalendar className="h-5 w-5" />}
        />
      ) : (
        <div className="space-y-10">
          <Section
            title="Overdue"
            tone="critical"
            count={overdue.length}
            empty="No overdue deadlines."
          >
            {overdue.length > 0 ? <ReminderListClient reminders={overdue} /> : null}
          </Section>

          <Section
            title="Upcoming"
            tone="live"
            count={upcoming.length}
            empty="No upcoming deadlines."
          >
            {upcoming.length > 0 ? <ReminderListClient reminders={upcoming} /> : null}
          </Section>

          <Section
            title="Completed"
            tone="success"
            count={completed.length}
            empty="No completed deadlines."
          >
            {completed.length > 0 ? <ReminderListClient reminders={completed} /> : null}
          </Section>
        </div>
      )}
    </div>
  );
}

function Section(props: {
  title: string;
  count: number;
  tone: "critical" | "warning" | "live" | "success" | "neutral";
  empty: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold tracking-tight text-[var(--foreground-strong)]">
          {props.title}
        </h2>
        <StatusPill tone={props.tone} pulse={props.tone === "critical"}>
          {props.count} {props.count === 1 ? "item" : "items"}
        </StatusPill>
      </div>
      {props.count === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-white/50 p-5 text-center text-[13px] text-[var(--muted-2)]">
          {props.empty}
        </div>
      ) : (
        props.children
      )}
    </section>
  );
}
