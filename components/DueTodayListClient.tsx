"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Reminder, ReminderSchedule } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

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
          className={cn(
            "group flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 transition",
            "hover:border-[var(--border-strong)] hover:shadow-sm",
            "sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-[var(--warning)] status-dot" />
              <div className="min-w-0 truncate text-[13.5px] font-semibold text-[var(--foreground-strong)]">
                {r.title}
              </div>
              {r.clientName ? (
                <Badge variant="outline">{r.clientName}</Badge>
              ) : null}
              <Badge variant="neutral">{r.category}</Badge>
            </div>
            <div className="mt-1 text-[11.5px] text-[var(--muted-2)]">
              Due <span className="font-mono">{formatDate(r.dueAt)}</span>
              <span className="mx-2 opacity-40">•</span>
              {r.schedule.frequency}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-1.5">
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
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </Link>
          </div>
        </div>
      ))}

      {props.reminders.length > max ? (
        <div className="pt-1 text-[12.5px] text-[var(--muted-2)]">
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
