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

  if (daysToDue < 0) {
    const overdueDays = Math.abs(daysToDue);
    if (overdueDays >= 3) return { level: "CRITICAL", daysToDue };
    return { level: "WARNING", daysToDue };
  }

  if (daysToDue <= 1) return { level: "WARNING", daysToDue };

  return { level: "NORMAL", daysToDue };
}

export function escalationBadge(level: EscalationLevel): {
  label: string;
  className: string;
} {
  if (level === "CRITICAL") {
    return {
      label: "Critical",
      className:
        "bg-[var(--danger-bg)] text-[var(--danger-strong)] ring-1 ring-inset ring-[var(--danger-ring)]",
    };
  }
  if (level === "WARNING") {
    return {
      label: "Warning",
      className:
        "bg-[var(--warning-bg)] text-[var(--warning-strong)] ring-1 ring-inset ring-[var(--warning-ring)]",
    };
  }
  return {
    label: "Normal",
    className:
      "bg-[var(--surface-muted)] text-[var(--muted)] ring-1 ring-inset ring-[var(--border)]",
  };
}
