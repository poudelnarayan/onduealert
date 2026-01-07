"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Reminder, ReminderSchedule } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { computeEscalationLevel, escalationBadge } from "@/lib/escalation";

type ReminderWithSchedule = Reminder & { schedule: ReminderSchedule };

function formatDate(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
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
    <div className="space-y-3">
      {props.reminders.map((r) => (
        <div key={r.id}>
          {(() => {
            const esc =
              r.status === "OPEN"
                ? computeEscalationLevel({
                    dueAt: r.dueAt,
                    status: r.status,
                    timeZone: r.schedule.timezone,
                  })
                : null;
            const level = esc?.level ?? "NORMAL";
            const border =
              r.status !== "OPEN"
                ? "border-l-brand-200"
                : "border-l-accent";

            return (
              <div
                className={[
                  "flex flex-col gap-3 rounded-lg border border-border border-l-4 bg-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between",
                  border,
                ].join(" ")}
              >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-0 truncate text-sm font-semibold text-brand-900">
                {r.title}
              </div>
              {r.status === "COMPLETED" ? (
                <Badge variant="success">Completed</Badge>
              ) : null}
              {r.status === "OPEN" && esc ? (() => {
                const b = escalationBadge(esc.level);
                const label =
                  esc.daysToDue < 0
                    ? `Overdue · ${Math.abs(esc.daysToDue)}d`
                    : esc.daysToDue === 0
                      ? "Due today"
                      : esc.daysToDue === 1
                        ? "Due tomorrow"
                        : `Due in ${esc.daysToDue}d`;

                const variant =
                  esc.level === "CRITICAL"
                    ? "critical"
                    : esc.level === "WARNING"
                      ? "warning"
                      : "neutral";
                return (
                  <Badge variant={variant}>
                    {esc.level === "NORMAL" ? label : `${b.label} · ${label}`}
                  </Badge>
                );
              })() : null}
              <Badge variant="neutral">{r.category}</Badge>
              {r.clientName ? <Badge variant="neutral">{r.clientName}</Badge> : null}
              <Badge variant="neutral">{r.schedule.frequency}</Badge>
            </div>
            <div className="mt-1 text-sm text-brand-600">
              Due: <span className="font-mono">{formatDate(r.dueAt)}</span>
              {r.snoozedUntil ? (
                <span className="ml-2 text-xs text-brand-600">
                  Snoozed until <span className="font-mono">{formatDate(r.snoozedUntil)}</span>
                </span>
              ) : null}
              {r.description ? (
                <span className="mt-1 block truncate text-brand-700">
                  {r.description}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {r.status === "OPEN" ? (
              <Button
                variant="primary"
                disabled={busyId === r.id}
                onClick={() => complete(r.id)}
                size="sm"
              >
                Mark completed
              </Button>
            ) : null}
            {r.status === "OPEN" ? (
              <>
                <Button
                  variant="secondary"
                  disabled={busyId === r.id}
                  onClick={() => snooze(r.id, 3)}
                  size="sm"
                >
                  Snooze 3d
                </Button>
                <Button
                  variant="secondary"
                  disabled={busyId === r.id}
                  onClick={() => snooze(r.id, 7)}
                  size="sm"
                >
                  Snooze 7d
                </Button>
              </>
            ) : null}
            {r.status === "OPEN" ? (
              <Link href={`/reminders/${r.id}/edit`}>
                <Button variant="secondary" size="sm">Edit</Button>
              </Link>
            ) : null}
            <Button
              variant="ghost"
              disabled={busyId === r.id}
              onClick={() => del(r.id)}
              size="sm"
            >
              Delete
            </Button>
          </div>
              </div>
            );
          })()}
        </div>
      ))}
    </div>
  );
}


