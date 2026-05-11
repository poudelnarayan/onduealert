"use client";

import * as React from "react";
import ReactDatePicker from "react-datepicker";
import { format, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/cn";

type DatePickerProps = {
  id?: string;
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
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 3v3M16 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.7"
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

const DatePickerButton = React.forwardRef<
  HTMLButtonElement,
  {
    id?: string;
    value?: string;
    onClick?: () => void;
    disabled?: boolean;
    placeholder?: string;
    hasError?: boolean;
    "aria-labelledby"?: string;
    "aria-describedby"?: string;
  }
>(({ id, value, onClick, disabled, placeholder, hasError, ...aria }, ref) => {
  return (
    <button
      ref={ref}
      id={id}
      type="button"
      onClick={onClick}
      disabled={disabled}
      {...aria}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg border bg-surface px-3 py-2 text-left text-sm transition shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)]",
        "h-10",
        hasError
          ? "border-[var(--danger)] focus-visible:ring-2 focus-visible:ring-[var(--danger-ring)]"
          : "border-[var(--border-strong)] focus-visible:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.20)]",
        disabled && "opacity-60 pointer-events-none",
      )}
    >
      <span className={cn(value ? "text-[var(--foreground)]" : "text-[var(--muted-3)]")}>
        {value || placeholder || "Select a date"}
      </span>
      <CalendarIcon className="h-[18px] w-[18px] text-[var(--muted-2)]" />
    </button>
  );
});
DatePickerButton.displayName = "DatePickerButton";

export function DatePicker({
  id,
  label,
  hint,
  error,
  value,
  onChange,
  required,
  disabled,
}: DatePickerProps) {
  const selected = parseYmd(value);
  const reactId = React.useId();
  const controlId = id ?? `date-${reactId}`;
  const labelId = `${controlId}-label`;
  const helpId = `${controlId}-help`;
  const [open, setOpen] = React.useState(false);

  return (
    <div className="block">
      {label ? (
        <div
          id={labelId}
          className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]"
        >
          {label}
          {required ? <span className="text-[var(--danger)]"> *</span> : null}
        </div>
      ) : null}

      <ReactDatePicker
        selected={selected ?? null}
        open={open}
        onInputClick={() => setOpen(true)}
        onClickOutside={() => setOpen(false)}
        onCalendarClose={() => setOpen(false)}
        onChange={(d: Date | null) => {
          if (!d) {
            onChange("");
            return;
          }
          onChange(toYmd(d));
          setOpen(false);
        }}
        disabled={disabled}
        dateFormat="MMM d, yyyy"
        popperPlacement="bottom-start"
        showPopperArrow={false}
        popperClassName="z-50"
        customInput={
          <DatePickerButton
            id={controlId}
            placeholder="Select a date"
            hasError={Boolean(error)}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={hint || error ? helpId : undefined}
          />
        }
      />

      {error ? (
        <div className="mt-1.5 text-xs font-medium text-[var(--danger-strong)]">
          {error}
        </div>
      ) : null}
      {!error && hint ? (
        <div id={helpId} className="mt-1.5 text-xs text-[var(--muted-2)]">
          {hint}
        </div>
      ) : null}
    </div>
  );
}
