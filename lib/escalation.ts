import { startOfDayUtc, startOfDayUtcInTimeZone } from "@/lib/dates";
import type { EscalationLevel, ReminderStatus } from "@prisma/client";

const dayMs = 24 * 60 * 60 * 1000;

export function computeEscalationLevel(params: {
  dueAt: Date;
  status: ReminderStatus;
  timeZone?: string | null;
  now?: Date;
}): { level: EscalationLevel; daysToDue: number } {
  const now = params.now ?? new Date();
  const tz = params.timeZone ?? "UTC";
  const today =
    tz && tz !== "UTC" ? startOfDayUtcInTimeZone(now, tz) : startOfDayUtc(now);
  const dueDay =
    tz && tz !== "UTC"
      ? startOfDayUtcInTimeZone(params.dueAt, tz)
      : startOfDayUtc(params.dueAt);
  const daysToDue = Math.round((dueDay.getTime() - today.getTime()) / dayMs);

  if (params.status !== "OPEN") return { level: "NORMAL", daysToDue };

  // Overdue: escalate.
  if (daysToDue < 0) {
    const overdueDays = Math.abs(daysToDue);
    if (overdueDays >= 3) return { level: "CRITICAL", daysToDue };
    return { level: "WARNING", daysToDue };
  }

  // Due today / soon: warning.
  if (daysToDue <= 1) return { level: "WARNING", daysToDue };

  // Within a week: still normal (but "due soon" UX can be layered on top).
  return { level: "NORMAL", daysToDue };
}

export function escalationBadge(level: EscalationLevel): {
  label: string;
  className: string;
} {
  if (level === "CRITICAL") {
    return { label: "Critical", className: "bg-accent-bg-strong text-foreground" };
  }
  if (level === "WARNING") {
    return { label: "Warning", className: "bg-accent-bg text-foreground" };
  }
  return { label: "Normal", className: "bg-transparent text-[rgba(238,238,238,0.7)]" };
}


