import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReminderForm } from "@/components/ReminderForm";
import { CompleteReminderClient } from "@/components/CompleteReminderClient";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/app/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { IconArrowRight, IconHistory, IconShield } from "@/components/landing/Icons";

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
    <div className="space-y-8">
      <PageHeader
        eyebrow={
          <Link
            href="/reminders"
            className="inline-flex items-center gap-1 text-[var(--muted)] transition hover:text-[var(--foreground-strong)]"
          >
            ← All deadlines
          </Link>
        }
        title={reminder.title}
        description="Update details and scheduling. Completed deadlines are read-only."
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

      <Card padding="lg" className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-bg)] text-[var(--accent-strong)]">
              <IconShield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[15px] font-semibold tracking-tight text-[var(--foreground-strong)]">
                Completion & proof
              </div>
              <div className="text-[12.5px] text-[var(--muted-2)]">
                Mark complete with evidence. Stored in immutable history.
              </div>
            </div>
          </div>
        </div>

        {reminder.status === "OPEN" ? (
          <CompleteReminderClient reminderId={reminder.id} />
        ) : (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-[13px] text-[var(--muted)]">
            This deadline is completed. Review history below.
          </div>
        )}
      </Card>

      <Card padding="lg" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--muted)] ring-1 ring-[var(--border)]">
              <IconHistory className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[15px] font-semibold tracking-tight text-[var(--foreground-strong)]">
                Completion history
              </div>
              <div className="text-[12.5px] text-[var(--muted-2)]">
                {reminder.completions.length
                  ? `Latest ${reminder.completions.length} entries`
                  : "Nothing recorded yet"}
              </div>
            </div>
          </div>
        </div>

        {reminder.completions.length ? (
          <ul className="space-y-2">
            {reminder.completions.map((c) => (
              <li
                key={c.id}
                className="rounded-xl border border-[var(--border)] bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[13px] font-semibold text-[var(--foreground-strong)]">
                    Completed at{" "}
                    <span className="font-mono text-[var(--muted)]">
                      {new Date(c.completedAt).toISOString()}
                    </span>
                  </div>
                  <StatusPill tone="success" pulse={false}>
                    Recorded
                  </StatusPill>
                </div>
                {c.note ? (
                  <div className="mt-2 whitespace-pre-wrap rounded-lg bg-[var(--surface-muted)] p-3 text-[13px] text-[var(--foreground)]">
                    {c.note}
                  </div>
                ) : null}
                {c.attachments.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {c.attachments.map((a) => (
                      <a
                        key={a.id}
                        href={`/api/completions/attachments/${a.id}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-white px-2.5 py-1 text-[11.5px] font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-muted)]"
                      >
                        {a.filename}
                        <span className="text-[var(--muted-2)]">
                          ({Math.round(a.sizeBytes / 1024)} KB)
                        </span>
                        <IconArrowRight className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border-strong)] bg-white/50 p-6 text-center text-[13px] text-[var(--muted-2)]">
            When this deadline is completed, the entry will appear here.
          </div>
        )}
      </Card>
    </div>
  );
}
