"use client";

import * as React from "react";
import ReactDatePicker from "react-datepicker";
import { format, parseISO, isValid } from "date-fns";

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
      className={[
        "flex w-full items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-left text-sm text-foreground outline-none",
        "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30",
        hasError ? "border-accent focus-visible:ring-accent/40" : "",
        disabled ? "opacity-60 pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={value ? "text-foreground" : "text-[rgba(238,238,238,0.6)]"}>
        {value || placeholder || "Select a date"}
      </span>
      <CalendarIcon className="h-5 w-5 text-[rgba(238,238,238,0.7)]" />
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
        <div id={labelId} className="mb-1 text-sm font-medium text-brand-900">
          {label}
          {required ? <span className="text-danger"> *</span> : null}
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
        calendarClassName="!bg-surface !border !border-border !text-foreground"
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

      {error ? <div className="mt-1 text-sm text-accent">{error}</div> : null}
      {!error && hint ? (
        <div
          id={helpId}
          className="mt-1 text-sm text-[rgba(238,238,238,0.7)]"
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
}


