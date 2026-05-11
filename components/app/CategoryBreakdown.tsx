import * as React from "react";
import { cn } from "@/lib/cn";

type Row = {
  label: string;
  open: number;
  overdue: number;
};

export function CategoryBreakdown({ rows }: { rows: Row[] }) {
  const total = rows.reduce((sum, r) => sum + r.open, 0) || 1;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[var(--foreground-strong)]">
          By category
        </h3>
        <span className="text-[11px] text-[var(--muted-2)]">
          {total} open
        </span>
      </div>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => {
          const pct = Math.round((r.open / total) * 100);
          return (
            <li key={r.label}>
              <div className="flex items-baseline justify-between text-[12.5px]">
                <span className="font-medium text-[var(--foreground)]">
                  {r.label}
                </span>
                <span className="flex items-baseline gap-2 font-mono text-[var(--muted)]">
                  {r.overdue > 0 ? (
                    <span className="rounded bg-[var(--danger-bg)] px-1 text-[11px] font-semibold text-[var(--danger-strong)]">
                      {r.overdue} late
                    </span>
                  ) : null}
                  <span>{r.open}</span>
                </span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]">
                <div
                  className={cn(
                    "h-full rounded-full",
                    r.overdue > 0 ? "bg-[var(--danger)]" : "bg-[var(--accent)]",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
