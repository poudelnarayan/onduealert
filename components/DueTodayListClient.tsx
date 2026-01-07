"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Reminder, ReminderSchedule } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type ReminderWithSchedule = Reminder & { schedule: ReminderSchedule };

function formatDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export function DueTodayListClient(props: {
  reminders: ReminderWithSchedule[];
  maxItems?: number;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const max = props.maxItems ?? 8;
  const items = props.reminders.slice(0, max);

  async function complete(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/reminders/${id}/complete`, { method: "POST" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function snooze(id: string, days: number) {
    setBusyId(id);
    try {
      await fetch(`/api/reminders/${id}/snooze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-2">
      {items.map((r) => (
        <div
          key={r.id}
          className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-accent" />
              <div className="min-w-0 truncate text-sm font-semibold text-foreground">
                {r.title}
              </div>
              {r.clientName ? <Badge variant="neutral">{r.clientName}</Badge> : null}
              <Badge variant="neutral">{r.category}</Badge>
            </div>
            <div className="mt-1 text-xs text-[rgba(238,238,238,0.7)]">
              Due <span className="font-mono">{formatDate(r.dueAt)}</span>
              <span className="mx-2 opacity-40">•</span>
              {r.schedule.frequency}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <Button
              size="sm"
              disabled={busyId === r.id}
              onClick={() => complete(r.id)}
            >
              Complete
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={busyId === r.id}
              onClick={() => snooze(r.id, 3)}
            >
              Snooze 3d
            </Button>
            <Link href={`/reminders/${r.id}/edit`}>
              <Button size="sm" variant="secondary">
                Edit
              </Button>
            </Link>
          </div>
        </div>
      ))}

      {props.reminders.length > max ? (
        <div className="pt-1 text-sm text-[rgba(238,238,238,0.7)]">
          Showing {max} of {props.reminders.length}.{" "}
          <Link href="/reminders" className="text-accent hover:text-accent/90">
            View all
          </Link>
          .
        </div>
      ) : null}
    </div>
  );
}


