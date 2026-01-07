import type { ReminderFrequency } from "@prisma/client";
import { addDaysUtc, addMonthsUtc, addWeeksUtc, addYearsUtc, zonedTimeToUtc } from "@/lib/dates";

export function computeNextDueAt(params: {
  dueAt: Date;
  frequency: ReminderFrequency;
  interval: number;
  customIntervalDays?: number | null;
  timeZone?: string | null;
}): Date | null {
  const { dueAt, frequency, interval } = params;
  if (frequency === "ONE_TIME") return null;

  const tz = params.timeZone ?? "UTC";

  // Preserve local time (DST-aware) when a timezone is provided.
  if (tz && tz !== "UTC") {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const parts = dtf.formatToParts(dueAt);
    const map: Record<string, string> = {};
    for (const p of parts) {
      if (p.type !== "literal") map[p.type] = p.value;
    }
    const y = Number(map.year);
    const m = Number(map.month);
    const d = Number(map.day);
    const h = Number(map.hour);
    const min = Number(map.minute);
    const s = Number(map.second);

    let assumed = new Date(Date.UTC(y, m - 1, d, h, min, s, 0));
    if (frequency === "WEEKLY") assumed = new Date(Date.UTC(y, m - 1, d + interval * 7, h, min, s, 0));
    if (frequency === "MONTHLY") assumed = new Date(Date.UTC(y, m - 1 + interval, d, h, min, s, 0));
    if (frequency === "YEARLY") assumed = new Date(Date.UTC(y + interval, m - 1, d, h, min, s, 0));
    if (frequency === "CUSTOM") {
      const days = params.customIntervalDays ?? null;
      if (!days) return null;
      assumed = new Date(Date.UTC(y, m - 1, d + days, h, min, s, 0));
    }

    const ny = assumed.getUTCFullYear();
    const nm = assumed.getUTCMonth() + 1;
    const nd = assumed.getUTCDate();
    const nh = assumed.getUTCHours();
    const nmin = assumed.getUTCMinutes();
    const ns = assumed.getUTCSeconds();
    return zonedTimeToUtc(
      { year: ny, month: nm, day: nd, hour: nh, minute: nmin, second: ns },
      tz
    );
  }

  if (frequency === "WEEKLY") return addWeeksUtc(dueAt, interval);
  if (frequency === "MONTHLY") return addMonthsUtc(dueAt, interval);
  if (frequency === "YEARLY") return addYearsUtc(dueAt, interval);
  if (frequency === "CUSTOM") {
    const days = params.customIntervalDays ?? null;
    if (!days) return null;
    return addDaysUtc(dueAt, days);
  }

  return null;
}


