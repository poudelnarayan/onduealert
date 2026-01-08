"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO, isValid } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";

type DatePickerProps = {
  label?: string;
  hint?: string;
  error?: string | null;
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
};

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M8 3v3M16 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function parseYmd(value: string): Date | undefined {
  if (!value) return undefined;
  try {
    const d = parseISO(value);
    return isValid(d) ? d : undefined;
  } catch {
    return undefined;
  }
}

function toYmd(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function DatePicker({
  label,
  hint,
  error,
  value,
  onChange,
  required,
  disabled,
}: DatePickerProps) {
  const selected = parseYmd(value);
  const [open, setOpen] = React.useState(false);

  const buttonClasses = [
    "flex w-full items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-left text-sm text-foreground outline-none",
    "placeholder:text-[rgba(238,238,238,0.6)]",
    "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30",
    error ? "border-accent focus-visible:ring-accent/40" : "",
    disabled ? "opacity-60 pointer-events-none" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-sm font-medium text-brand-900">
          {label}
          {required ? <span className="text-danger"> *</span> : null}
        </div>
      ) : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className={buttonClasses} disabled={disabled}>
            <span className={selected ? "text-foreground" : "text-[rgba(238,238,238,0.6)]"}>
              {selected ? format(selected, "MMM d, yyyy") : "Select a date"}
            </span>
            <CalendarIcon className="h-5 w-5 text-[rgba(238,238,238,0.7)]" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-3" align="start">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(d) => {
              if (!d) return;
              onChange(toYmd(d));
              setOpen(false);
            }}
            captionLayout="dropdown"
            fromYear={2000}
            toYear={new Date().getFullYear() + 10}
            showOutsideDays
            className="text-foreground"
            classNames={{
              months: "flex flex-col gap-3",
              month: "space-y-3",
              caption:
                "flex items-center justify-between gap-2 rounded-lg bg-surface-muted px-2 py-1.5",
              caption_label: "text-sm font-semibold text-foreground",
              nav: "flex items-center gap-1",
              nav_button:
                "inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-accent-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell:
                "w-9 text-center text-xs font-medium text-[rgba(238,238,238,0.7)]",
              row: "mt-2 flex w-full",
              cell: "relative w-9 text-center",
              day:
                "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm text-foreground hover:bg-accent-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
              day_today: "ring-1 ring-inset ring-accent/60",
              day_selected:
                "bg-accent text-[#222831] hover:bg-accent/90 focus:bg-accent",
              day_outside:
                "text-[rgba(238,238,238,0.35)] hover:text-[rgba(238,238,238,0.55)]",
              day_disabled: "opacity-40",
              dropdown:
                "rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
              dropdown_month: "mr-2",
              dropdown_year: "",
            }}
          />

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3">
            <button
              type="button"
              className="text-sm text-[rgba(238,238,238,0.7)] hover:text-foreground"
              onClick={() => onChange("")}
              disabled={disabled}
            >
              Clear
            </button>
            <button
              type="button"
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-[#222831] hover:bg-accent/90"
              onClick={() => setOpen(false)}
            >
              Done
            </button>
          </div>
        </PopoverContent>
      </Popover>

      {error ? <div className="mt-1 text-sm text-accent">{error}</div> : null}
      {!error && hint ? (
        <div className="mt-1 text-sm text-[rgba(238,238,238,0.7)]">{hint}</div>
      ) : null}
    </label>
  );
}


