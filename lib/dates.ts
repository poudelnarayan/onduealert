export function startOfDayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

type ZonedParts = {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number; // 0-23
  minute: number; // 0-59
  second: number; // 0-59
};

function zonedParts(date: Date, timeZone: string): ZonedParts {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = dtf.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

/**
 * Convert a local date-time in an IANA timezone into a UTC Date.
 * This avoids adding a heavy timezone library, while staying DST-aware.
 */
export function zonedTimeToUtc(parts: ZonedParts, timeZone: string): Date {
  // Start with an assumption that the local parts are UTC.
  let utc = new Date(
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
      0
    )
  );

  // Two-pass correction (handles DST edges better than a single pass).
  for (let i = 0; i < 2; i++) {
    const zp = zonedParts(utc, timeZone);
    const asIfUtc = Date.UTC(
      zp.year,
      zp.month - 1,
      zp.day,
      zp.hour,
      zp.minute,
      zp.second,
      0
    );
    const desired = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
      0
    );
    const diff = asIfUtc - desired;
    utc = new Date(utc.getTime() - diff);
  }

  return utc;
}

export function startOfDayUtcInTimeZone(d: Date, timeZone: string): Date {
  const p = zonedParts(d, timeZone);
  return zonedTimeToUtc(
    {
      year: p.year,
      month: p.month,
      day: p.day,
      hour: 0,
      minute: 0,
      second: 0,
    },
    timeZone
  );
}

export function addDaysUtcInTimeZone(
  day: Date,
  timeZone: string,
  days: number
): Date {
  const p = zonedParts(day, timeZone);
  const shifted = new Date(Date.UTC(p.year, p.month - 1, p.day + days, 0, 0, 0, 0));
  const sp = {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: 0,
    minute: 0,
    second: 0,
  };
  return zonedTimeToUtc(sp, timeZone);
}

export function addDaysUtc(d: Date, days: number): Date {
  const next = new Date(d);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function addWeeksUtc(d: Date, weeks: number): Date {
  return addDaysUtc(d, weeks * 7);
}

export function addMonthsUtc(d: Date, months: number): Date {
  const next = new Date(d);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

export function addYearsUtc(d: Date, years: number): Date {
  const next = new Date(d);
  next.setUTCFullYear(next.getUTCFullYear() + years);
  return next;
}

// Input format: "YYYY-MM-DD"
export function parseDateOnlyToUtcDateTime(
  dateOnly: string,
  hourUtc = 9
): Date {
  const [y, m, d] = dateOnly.split("-").map((x) => Number(x));
  if (!y || !m || !d) throw new Error("Invalid date");
  return new Date(Date.UTC(y, m - 1, d, hourUtc, 0, 0, 0));
}

// Input format: "YYYY-MM-DD" interpreted as a local date in the provided timezone.
export function parseDateOnlyToUtcDateTimeInTimeZone(
  dateOnly: string,
  timeZone: string,
  hourLocal = 9
): Date {
  const [y, m, d] = dateOnly.split("-").map((x) => Number(x));
  if (!y || !m || !d) throw new Error("Invalid date");
  return zonedTimeToUtc(
    { year: y, month: m, day: d, hour: hourLocal, minute: 0, second: 0 },
    timeZone
  );
}

export function formatDateOnlyUtc(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}


