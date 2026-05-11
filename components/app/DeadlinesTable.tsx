"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  Reminder,
  ReminderSchedule,
  ReminderStatus,
} from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { cn } from "@/lib/cn";

type ReminderWithSchedule = Reminder & { schedule: ReminderSchedule };

type FilterKey = "all" | "today" | "week" | "overdue" | "completed";

type Props = {
  reminders: ReminderWithSchedule[];
  initialFilter?: FilterKey;
};

const dayMs = 24 * 60 * 60 * 1000;

function startOfDayUtc(d: Date) {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function daysBetween(due: Date, today: Date) {
  return Math.round(
    (startOfDayUtc(due).getTime() - startOfDayUtc(today).getTime()) / dayMs,
  );
}

function dueLabel(d: number, status: ReminderStatus) {
  if (status !== "OPEN") return "Completed";
  if (d < 0) return `Overdue ${Math.abs(d)}d`;
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d < 7) return `In ${d}d`;
  if (d < 30) return `In ${Math.round(d / 7)}w`;
  return `In ${Math.round(d / 30)}mo`;
}

function dueTone(
  d: number,
  status: ReminderStatus,
): "critical" | "warning" | "live" | "success" | "neutral" {
  if (status !== "OPEN") return "success";
  if (d < 0) return d <= -3 ? "critical" : "warning";
  if (d <= 1) return "warning";
  return "live";
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "overdue", label: "Overdue" },
  { key: "completed", label: "Completed" },
];

const CATEGORIES = ["TAX", "CONTRACT", "LICENSE", "CUSTOM"] as const;

export function DeadlinesTable({ reminders, initialFilter = "all" }: Props) {
  const router = useRouter();
  const [filter, setFilter] = React.useState<FilterKey>(initialFilter);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("");
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const today = React.useMemo(() => new Date(), []);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return reminders.filter((r) => {
      if (category && r.category !== category) return false;
      if (q) {
        const hay = `${r.title} ${r.clientName ?? ""} ${r.description ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      const d = daysBetween(r.dueAt, today);
      switch (filter) {
        case "today":
          return r.status === "OPEN" && d === 0;
        case "week":
          return r.status === "OPEN" && d >= 0 && d <= 7;
        case "overdue":
          return r.status === "OPEN" && d < 0;
        case "completed":
          return r.status === "COMPLETED";
        case "all":
        default:
          return true;
      }
    });
  }, [reminders, filter, category, query, today]);

  async function action(
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

  const counts = React.useMemo(() => {
    const c = { today: 0, week: 0, overdue: 0, completed: 0, all: reminders.length };
    for (const r of reminders) {
      const d = daysBetween(r.dueAt, today);
      if (r.status === "COMPLETED") c.completed++;
      else if (d < 0) c.overdue++;
      else if (d === 0) c.today++;
      else if (d <= 7) c.week++;
    }
    return c;
  }, [reminders, today]);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12.5px] font-medium transition-colors active:scale-[0.97]",
                filter === f.key
                  ? "bg-white text-[var(--foreground-strong)] shadow-[0_1px_2px_rgba(15,23,42,0.05)] ring-1 ring-inset ring-[var(--border-strong)]"
                  : "text-[var(--muted)] hover:bg-white/60 hover:text-[var(--foreground-strong)]",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded px-1 text-[10.5px] font-semibold",
                  filter === f.key
                    ? "bg-[var(--accent-bg)] text-[var(--accent-strong)]"
                    : "bg-[var(--border)] text-[var(--muted-2)]",
                )}
              >
                {counts[f.key as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-2)]"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, client…"
              className="h-8 w-44 rounded-md border border-[var(--border-strong)] bg-white pl-8 pr-2 text-[12.5px] text-[var(--foreground)] outline-none placeholder:text-[var(--muted-3)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(37,99,235,0.20)]"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-8 rounded-md border border-[var(--border-strong)] bg-white px-2 text-[12.5px] text-[var(--foreground)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(37,99,235,0.20)]"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="px-4 py-12 text-center">
          <div className="text-sm font-medium text-[var(--foreground)]">
            No deadlines match
          </div>
          <div className="mt-1 text-[13px] text-[var(--muted-2)]">
            Try a different filter, clear the search, or create a new one.
          </div>
          <div className="mt-4 flex justify-center">
            <Link href="/reminders/new">
              <Button size="sm">New deadline</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="hidden sm:block">
          <div className="grid grid-cols-[1fr_120px_120px_140px_180px] gap-3 border-b border-[var(--border)] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
            <div>Deadline</div>
            <div>Category</div>
            <div>Schedule</div>
            <div>Due</div>
            <div className="text-right">Actions</div>
          </div>
          <ul>
            {filtered.map((r) => {
              const d = daysBetween(r.dueAt, today);
              const tone = dueTone(d, r.status);
              return (
                <li
                  key={r.id}
                  className="group grid grid-cols-[1fr_120px_120px_140px_180px] items-center gap-3 border-b border-[var(--border-soft)] px-4 py-3 transition-colors hover:bg-[var(--surface-muted)]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/reminders/${r.id}/edit`}
                        className="truncate text-[13.5px] font-semibold text-[var(--foreground-strong)] hover:text-[var(--accent-strong)]"
                      >
                        {r.title}
                      </Link>
                    </div>
                    <div className="mt-0.5 truncate text-[12px] text-[var(--muted-2)]">
                      {r.clientName ?? "No client"}
                      {r.description ? ` · ${r.description}` : ""}
                    </div>
                  </div>
                  <div>
                    <Badge variant="soft">{r.category}</Badge>
                  </div>
                  <div className="text-[12.5px] text-[var(--muted)]">
                    {r.schedule.frequency.replace("_", " ").toLowerCase()}
                  </div>
                  <div>
                    <div className="text-[12.5px] font-medium text-[var(--foreground)]">
                      {formatDate(r.dueAt)}
                    </div>
                    <div className="mt-0.5">
                      <StatusPill tone={tone} pulse={tone === "critical"}>
                        {dueLabel(d, r.status)}
                      </StatusPill>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center justify-end gap-1">
                    {r.status === "OPEN" ? (
                      <>
                        <Button
                          size="sm"
                          loading={busyId === r.id}
                          onClick={() =>
                            action(r.id, "/complete", undefined, "POST")
                          }
                          loadingText="Saving…"
                        >
                          Complete
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          loading={busyId === r.id}
                          onClick={() =>
                            action(r.id, "/snooze", { days: 3 }, "POST")
                          }
                          loadingText="…"
                        >
                          Snooze
                        </Button>
                      </>
                    ) : (
                      <Link href={`/reminders/${r.id}/edit`}>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Mobile */}
      <ul className="divide-y divide-[var(--border-soft)] sm:hidden">
        {filtered.map((r) => {
          const d = daysBetween(r.dueAt, today);
          const tone = dueTone(d, r.status);
          return (
            <li key={r.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/reminders/${r.id}/edit`}
                  className="min-w-0 flex-1 truncate text-[13.5px] font-semibold text-[var(--foreground-strong)]"
                >
                  {r.title}
                </Link>
                <StatusPill tone={tone} pulse={tone === "critical"}>
                  {dueLabel(d, r.status)}
                </StatusPill>
              </div>
              <div className="mt-1 text-[12px] text-[var(--muted-2)]">
                {r.clientName ?? "No client"} · {r.category} ·{" "}
                {r.schedule.frequency.replace("_", " ").toLowerCase()}
              </div>
              <div className="mt-1 text-[12px] text-[var(--muted)]">
                Due {formatDate(r.dueAt)}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {r.status === "OPEN" ? (
                  <>
                    <Button
                      size="sm"
                      loading={busyId === r.id}
                      onClick={() =>
                        action(r.id, "/complete", undefined, "POST")
                      }
                    >
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      loading={busyId === r.id}
                      onClick={() =>
                        action(r.id, "/snooze", { days: 3 }, "POST")
                      }
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
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
