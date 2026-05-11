import * as React from "react";
import Link from "next/link";
import type { Reminder, ReminderSchedule } from "@prisma/client";
import { StatusPill } from "@/components/ui/StatusPill";

type R = Reminder & { schedule: ReminderSchedule };

const dayMs = 24 * 60 * 60 * 1000;

function startOfDayUtc(d: Date) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function dueWord(d: number) {
  if (d < 0) return `${Math.abs(d)}d overdue`;
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  return `In ${d}d`;
}

export function UpcomingTimeline({ items }: { items: R[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
        <h3 className="text-[14px] font-semibold text-[var(--foreground-strong)]">
          Upcoming
        </h3>
        <div className="mt-3 text-[13px] text-[var(--muted-2)]">
          Nothing scheduled in the next 14 days.
        </div>
      </div>
    );
  }
  const today = startOfDayUtc(new Date());
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[var(--foreground-strong)]">
          Upcoming
        </h3>
        <Link
          href="/reminders"
          className="text-[12px] font-medium text-[var(--accent-strong)] hover:underline"
        >
          View all
        </Link>
      </div>
      <ol className="mt-4 space-y-3">
        {items.slice(0, 6).map((r) => {
          const d = Math.round(
            (startOfDayUtc(r.dueAt).getTime() - today.getTime()) / dayMs,
          );
          const tone = d < 0 ? "critical" : d <= 1 ? "warning" : "live";
          return (
            <li key={r.id} className="flex items-start gap-3">
              <div className="mt-1 flex w-12 shrink-0 flex-col items-center">
                <div className="text-[11px] font-semibold uppercase text-[var(--muted-2)]">
                  {new Date(r.dueAt).toLocaleDateString(undefined, { month: "short" })}
                </div>
                <div className="text-[18px] font-semibold leading-tight tracking-tight text-[var(--foreground-strong)]">
                  {new Date(r.dueAt).getUTCDate()}
                </div>
              </div>
              <div className="min-w-0 flex-1 border-l border-[var(--border)] pl-3">
                <Link
                  href={`/reminders/${r.id}/edit`}
                  className="block truncate text-[13.5px] font-semibold text-[var(--foreground)] hover:text-[var(--accent-strong)]"
                >
                  {r.title}
                </Link>
                <div className="mt-0.5 truncate text-[12px] text-[var(--muted-2)]">
                  {r.clientName ?? "No client"} · {r.category}
                </div>
                <div className="mt-1">
                  <StatusPill tone={tone} pulse={tone === "critical"}>
                    {dueWord(d)}
                  </StatusPill>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
