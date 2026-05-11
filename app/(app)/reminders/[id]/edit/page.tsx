import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { ReminderForm } from "@/components/ReminderForm";
import { CompleteReminderClient } from "@/components/CompleteReminderClient";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";

type Props = { params: Promise<{ id: string }> };

function dateOnly(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export default async function EditReminderPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;
  const reminder = await prisma.reminder.findFirst({
    where: { id, clerkUserId: userId },
    include: {
      schedule: true,
      completions: {
        orderBy: { completedAt: "desc" },
        take: 10,
        include: {
          attachments: { select: { id: true, filename: true, sizeBytes: true } },
        },
      },
    },
  });
  if (!reminder) redirect("/reminders");

  const initial = {
    clientName: reminder.clientName ?? "",
    title: reminder.title,
    description: reminder.description ?? "",
    category: reminder.category,
    frequency: reminder.schedule.frequency,
    interval: String(reminder.schedule.interval ?? 1),
    customIntervalDays: reminder.schedule.customIntervalDays
      ? String(reminder.schedule.customIntervalDays)
      : "",
    cronExpression: reminder.schedule.cronExpression ?? "",
    dueDate: dateOnly(reminder.dueAt),
    timezone: reminder.schedule.timezone ?? "UTC",
    offsetsDays: (reminder.schedule.offsetsDays ?? []).join(","),
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow={
          <Link
            href="/reminders"
            className="text-[var(--muted)] transition hover:text-[var(--foreground-strong)]"
          >
            ← Back to deadlines
          </Link>
        }
        title={reminder.title}
        description={
          reminder.clientName
            ? `${reminder.clientName} · ${reminder.category}`
            : `${reminder.category} · ${reminder.schedule.frequency
                .replace("_", " ")
                .toLowerCase()}`
        }
        actions={
          reminder.status === "COMPLETED" ? (
            <StatusPill tone="success" pulse={false}>
              Completed
            </StatusPill>
          ) : (
            <StatusPill tone="live">Active</StatusPill>
          )
        }
      />

      <ReminderForm
        mode="edit"
        reminderId={reminder.id}
        initial={initial}
      />

      {/* Completion */}
      <div className="rounded-2xl border border-[var(--border)] bg-white">
        <div className="border-b border-[var(--border)] px-6 py-4">
          <h2 className="text-[14px] font-semibold tracking-tight text-[var(--foreground-strong)]">
            Completion
          </h2>
          <p className="mt-0.5 text-[12.5px] text-[var(--muted)]">
            Mark complete with optional proof. Recorded in the audit trail.
          </p>
        </div>
        <div className="p-6">
          {reminder.status === "OPEN" ? (
            <CompleteReminderClient reminderId={reminder.id} />
          ) : (
            <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-[13px] text-[var(--muted)]">
              This deadline is completed. Review the history below.
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="rounded-2xl border border-[var(--border)] bg-white">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div>
            <h2 className="text-[14px] font-semibold tracking-tight text-[var(--foreground-strong)]">
              History
            </h2>
            <p className="mt-0.5 text-[12.5px] text-[var(--muted)]">
              {reminder.completions.length
                ? `${reminder.completions.length} recorded ${
                    reminder.completions.length === 1 ? "entry" : "entries"
                  }`
                : "Nothing recorded yet"}
            </p>
          </div>
        </div>

        {reminder.completions.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <div className="text-[13px] text-[var(--muted-2)]">
              When this deadline is completed, the entry appears here.
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-[var(--border-soft)]">
            {reminder.completions.map((c) => (
              <li key={c.id} className="px-6 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[13px] font-medium text-[var(--foreground)]">
                    {new Date(c.completedAt).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <StatusPill tone="success" pulse={false}>
                    Recorded
                  </StatusPill>
                </div>
                {c.note ? (
                  <div className="mt-2 whitespace-pre-wrap rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-[12.5px] text-[var(--foreground)]">
                    {c.note}
                  </div>
                ) : null}
                {c.attachments.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.attachments.map((a) => (
                      <a
                        key={a.id}
                        href={`/api/completions/attachments/${a.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-white px-2 py-1 text-[11.5px] font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-muted)]"
                      >
                        {a.filename}
                        <span className="text-[var(--muted-2)]">
                          {Math.round(a.sizeBytes / 1024)} KB
                        </span>
                      </a>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Cancel / footer hint */}
      <div className="flex items-center justify-end">
        <Link href="/reminders">
          <Button variant="ghost">Done</Button>
        </Link>
      </div>
    </div>
  );
}
