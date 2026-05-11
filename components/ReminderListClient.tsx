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

  async function call(
    id: string,
    path: string,
    body?: Record<string, unknown>,
    method: "POST" | "DELETE" = "POST",
  ) {
    setBusyId(id);
    try {
      await fetch(`/api/reminders/${id}${path}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
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
          if (!esc) return "";
          if (esc.daysToDue < 0)
            return `Overdue ${Math.abs(esc.daysToDue)}d`;
          if (esc.daysToDue === 0) return "Due today";
          if (esc.daysToDue === 1) return "Due tomorrow";
          return `Due in ${esc.daysToDue}d`;
        })();

        const busy = busyId === r.id;

        return (
          <div
            key={r.id}
            className={cn(
              "group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-[var(--border)] bg-white p-4 transition-colors",
              "hover:border-[var(--border-strong)]",
              "sm:flex-row sm:items-center sm:justify-between sm:gap-4",
            )}
          >
            <span
              aria-hidden
              className={cn("absolute left-0 top-0 h-full w-1", accentBar)}
            />

            <div className="min-w-0 pl-2">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/reminders/${r.id}/edit`}
                  className="min-w-0 truncate text-[14px] font-semibold text-[var(--foreground-strong)] hover:text-[var(--accent-strong)]"
                >
                  {r.title}
                </Link>
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

              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Badge variant="soft">{r.category}</Badge>
                {r.clientName ? (
                  <Badge variant="outline">{r.clientName}</Badge>
                ) : null}
                <Badge variant="neutral">
                  {r.schedule.frequency.replace("_", " ").toLowerCase()}
                </Badge>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 text-[12px] text-[var(--muted-2)]">
                <span>
                  Due{" "}
                  <span className="font-medium text-[var(--muted)]">
                    {formatDate(r.dueAt)}
                  </span>
                </span>
                {r.snoozedUntil ? (
                  <span>
                    Snoozed to{" "}
                    <span className="font-medium text-[var(--muted)]">
                      {formatDate(r.snoozedUntil)}
                    </span>
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-1.5">
              {r.status === "OPEN" ? (
                <>
                  <Button
                    size="sm"
                    loading={busy}
                    loadingText="Saving…"
                    onClick={() => call(r.id, "/complete", undefined, "POST")}
                  >
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={busy}
                    loadingText="…"
                    onClick={() => call(r.id, "/snooze", { days: 3 }, "POST")}
                  >
                    Snooze 3d
                  </Button>
                  <Link href={`/reminders/${r.id}/edit`}>
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href={`/reminders/${r.id}/edit`}>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                loading={busy}
                loadingText="…"
                onClick={() => call(r.id, "", undefined, "DELETE")}
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
