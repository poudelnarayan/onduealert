"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Reminder, ReminderSchedule } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type ReminderWithSchedule = Reminder & { schedule: ReminderSchedule };

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function DueTodayListClient(props: {
  reminders: ReminderWithSchedule[];
  maxItems?: number;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const max = props.maxItems ?? 8;
  const items = props.reminders.slice(0, max);

  async function call(
    id: string,
    path: string,
    body?: Record<string, unknown>,
  ) {
    setBusyId(id);
    try {
      await fetch(`/api/reminders/${id}${path}`, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-2">
      {items.map((r) => {
        const busy = busyId === r.id;
        return (
          <div
            key={r.id}
            className="flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 transition-colors hover:border-[var(--border-strong)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/reminders/${r.id}/edit`}
                  className="min-w-0 truncate text-[13.5px] font-semibold text-[var(--foreground-strong)] hover:text-[var(--accent-strong)]"
                >
                  {r.title}
                </Link>
                {r.clientName ? (
                  <Badge variant="outline">{r.clientName}</Badge>
                ) : null}
                <Badge variant="neutral">{r.category}</Badge>
              </div>
              <div className="mt-1 text-[11.5px] text-[var(--muted-2)]">
                Due {formatDate(r.dueAt)} ·{" "}
                {r.schedule.frequency.replace("_", " ").toLowerCase()}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-1.5">
              <Button
                size="sm"
                loading={busy}
                loadingText="…"
                onClick={() => call(r.id, "/complete")}
              >
                Complete
              </Button>
              <Button
                size="sm"
                variant="secondary"
                loading={busy}
                loadingText="…"
                onClick={() => call(r.id, "/snooze", { days: 3 })}
              >
                Snooze 3d
              </Button>
            </div>
          </div>
        );
      })}

      {props.reminders.length > max ? (
        <div className="pt-1 text-[12px] text-[var(--muted-2)]">
          Showing {max} of {props.reminders.length}.{" "}
          <Link
            href="/reminders"
            className="font-medium text-[var(--accent-strong)] hover:underline"
          >
            View all →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
