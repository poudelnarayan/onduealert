import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/app/PageHeader";
import { DeadlinesTable } from "@/components/app/DeadlinesTable";
import { IconCalendar } from "@/components/landing/Icons";

export default async function RemindersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const reminders = await prisma.reminder.findMany({
    where: { clerkUserId: userId },
    include: { schedule: true },
    orderBy: [{ status: "asc" }, { dueAt: "asc" }],
    take: 500,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deadlines"
        description="Every deadline across all clients and categories."
        actions={
          <Link href="/reminders/new">
            <Button>
              <IconCalendar className="h-4 w-4" />
              New deadline
            </Button>
          </Link>
        }
      />

      {reminders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-white/60 p-10 text-center">
          <div className="text-base font-semibold text-[var(--foreground-strong)]">
            No deadlines yet
          </div>
          <div className="mx-auto mt-1 max-w-md text-[13.5px] text-[var(--muted)]">
            Create your first deadline. Add offsets like 7,1,0 to get
            reminders before the due date.
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
        <DeadlinesTable reminders={reminders} initialFilter="all" />
      )}
    </div>
  );
}
