import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ReminderForm } from "@/components/ReminderForm";
import { CompleteReminderClient } from "@/components/CompleteReminderClient";
import { auth } from "@clerk/nextjs/server";

type Props = { params: { id: string } };

function dateOnly(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export default async function EditReminderPage({ params }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = params;
  const reminder = await prisma.reminder.findFirst({
    where: { id, clerkUserId: userId },
    include: {
      schedule: true,
      completions: {
        orderBy: { completedAt: "desc" },
        take: 10,
        include: { attachments: { select: { id: true, filename: true, sizeBytes: true } } },
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
    <div className="space-y-4">
      <div>
        <div className="text-lg font-semibold text-brand-900">Edit deadline</div>
        <div className="mt-1 text-sm text-brand-600">
          Update details and scheduling. Completed deadlines are read-only.
        </div>
      </div>
      <Card>
        <ReminderForm mode="edit" reminderId={reminder.id} initial={initial} />
      </Card>

      <Card>
        <div className="space-y-3">
          <div className="text-base font-semibold text-brand-900">
            Completion & proof
          </div>
          {reminder.status === "OPEN" ? (
            <CompleteReminderClient reminderId={reminder.id} />
          ) : (
            <div className="text-sm text-brand-600">
              This deadline is completed. See history below.
            </div>
          )}

          {reminder.completions.length ? (
            <div className="pt-2">
              <div className="text-sm font-semibold text-brand-900">
                History (latest {reminder.completions.length})
              </div>
              <div className="mt-2 space-y-2">
                {reminder.completions.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-md border border-border bg-surface p-3 text-sm text-brand-700"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="font-medium text-brand-900">
                        Completed at{" "}
                        <span className="font-mono">
                          {new Date(c.completedAt).toISOString()}
                        </span>
                      </div>
                    </div>
                    {c.note ? (
                      <div className="mt-2 whitespace-pre-wrap text-sm text-brand-700">
                        {c.note}
                      </div>
                    ) : null}
                    {c.attachments.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {c.attachments.map((a) => (
                          <a
                            key={a.id}
                            className="rounded-md border border-border bg-surface-muted px-2 py-1 text-xs text-brand-900 hover:bg-surface"
                            href={`/api/completions/attachments/${a.id}`}
                          >
                            {a.filename} ({Math.round(a.sizeBytes / 1024)} KB)
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-brand-600">
              No completion history recorded yet.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}


