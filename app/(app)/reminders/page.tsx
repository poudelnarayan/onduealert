import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { startOfDayUtc } from "@/lib/dates";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { ReminderListClient } from "@/components/ReminderListClient";
import { auth } from "@clerk/nextjs/server";

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
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-brand-900">Deadlines</div>
          <div className="mt-1 text-sm text-brand-600">
            Track recurring and one-time deadlines with escalation and proof.
          </div>
        </div>
        <Link href="/reminders/new">
          <Button>Create deadline</Button>
        </Link>
      </div>

      {reminders.length === 0 ? (
        <EmptyState
          title="No deadlines yet"
          description="Create your first deadline to start tracking. Add offsets like 7,3,1,0 to get notified before the due date."
          ctaLabel="Create deadline"
          ctaHref="/reminders/new"
        />
      ) : (
        <div className="space-y-8">
          <section className="space-y-3">
            <div className="text-sm font-semibold text-brand-900">
              Overdue ({overdue.length})
            </div>
            {overdue.length === 0 ? (
              <div className="text-sm text-brand-600">No overdue deadlines.</div>
            ) : (
              <ReminderListClient reminders={overdue} />
            )}
          </section>

          <section className="space-y-3">
            <div className="text-sm font-semibold text-brand-900">
              Upcoming ({upcoming.length})
            </div>
            {upcoming.length === 0 ? (
              <div className="text-sm text-brand-600">
                No upcoming deadlines.
              </div>
            ) : (
              <ReminderListClient reminders={upcoming} />
            )}
          </section>

          <section className="space-y-3">
            <div className="text-sm font-semibold text-brand-900">
              Completed ({completed.length})
            </div>
            {completed.length === 0 ? (
              <div className="text-sm text-brand-600">
                No completed deadlines.
              </div>
            ) : (
              <ReminderListClient reminders={completed} />
            )}
          </section>
        </div>
      )}
    </div>
  );
}


