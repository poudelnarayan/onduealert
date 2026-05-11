"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Reminder, ReminderSchedule } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { computeEscalationLevel } from "@/lib/escalation";
import { cn } from "@/lib/cn";

type ReminderWithSchedule = Reminder & { schedule: ReminderSchedule };

function formatDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

function formatDateNice(d: Date) {
  return new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ReminderListClient(props: {
  reminders: ReminderWithSchedule[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = React.useState<string | null>(null);

  async function complete(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/reminders/${id}/complete`, { method: "POST" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function del(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/reminders/${id}`, { method: "DELETE" });
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
    <div className="space-y-2.5">
      {props.reminders.map((r) => {
        const esc =
          r.status === "OPEN"
            ? computeEscalationLevel({
                dueAt: r.dueAt,
                status: r.status,
                timeZone: r.schedule.timezone,
              })
            : null;

        const tone =
          r.status !== "OPEN"
            ? ("success" as const)
            : esc?.level === "CRITICAL"
              ? ("critical" as const)
              : esc?.level === "WARNING"
                ? ("warning" as const)
                : ("live" as const);

        const accentBar =
          tone === "critical"
            ? "bg-[var(--danger)]"
            : tone === "warning"
              ? "bg-[var(--warning)]"
              : tone === "success"
                ? "bg-[var(--success)]"
                : "bg-[var(--accent)]";

        const dueLabel = (() => {
          if (r.status !== "OPEN") return "Completed";
          if (!esc) return "—";
          if (esc.daysToDue < 0)
            return `Overdue · ${Math.abs(esc.daysToDue)}d`;
          if (esc.daysToDue === 0) return "Due today";
          if (esc.daysToDue === 1) return "Due tomorrow";
          return `Due in ${esc.daysToDue}d`;
        })();

        return (
          <div
            key={r.id}
            className={cn(
              "group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-[var(--border)] bg-white p-4 transition",
              "hover:border-[var(--border-strong)] hover:shadow-[0_6px_20px_-8px_rgba(15,23,42,0.10),0_2px_6px_-2px_rgba(15,23,42,0.06)]",
              "sm:flex-row sm:items-center sm:justify-between sm:gap-4",
            )}
          >
            {/* Status accent bar */}
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-0 h-full w-1",
                accentBar,
              )}
            />

            <div className="min-w-0 pl-2">
              <div className="flex flex-wrap items-center gap-2">
                <div className="min-w-0 truncate text-[14.5px] font-semibold text-[var(--foreground-strong)]">
                  {r.title}
                </div>
                {r.status === "COMPLETED" ? (
                  <StatusPill tone="success" pulse={false}>
                    Completed
                  </StatusPill>
                ) : (
                  <StatusPill tone={tone} pulse={tone === "critical"}>
                    {dueLabel}
                  </StatusPill>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge variant="soft">{r.category}</Badge>
                {r.clientName ? (
                  <Badge variant="outline">{r.clientName}</Badge>
                ) : null}
                <Badge variant="neutral">{r.schedule.frequency}</Badge>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-[var(--muted-2)]">
                <span>
                  Due{" "}
                  <span className="font-mono text-[var(--muted)]">
                    {formatDateNice(r.dueAt)}
                  </span>
                </span>
                {r.snoozedUntil ? (
                  <span>
                    Snoozed until{" "}
                    <span className="font-mono">
                      {formatDate(r.snoozedUntil)}
                    </span>
                  </span>
                ) : null}
              </div>

              {r.description ? (
                <div className="mt-2 line-clamp-1 text-[12.5px] text-[var(--muted)]">
                  {r.description}
                </div>
              ) : null}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              {r.status === "OPEN" ? (
                <>
                  <Button
                    size="sm"
                    disabled={busyId === r.id}
                    onClick={() => complete(r.id)}
                  >
                    Mark complete
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={busyId === r.id}
                    onClick={() => snooze(r.id, 3)}
                  >
                    Snooze 3d
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={busyId === r.id}
                    onClick={() => snooze(r.id, 7)}
                  >
                    Snooze 7d
                  </Button>
                  <Link href={`/reminders/${r.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </>
              ) : null}
              <Button
                variant="ghost"
                size="sm"
                disabled={busyId === r.id}
                onClick={() => del(r.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
