"use client";

import * as React from "react";

type Option = { value: string; label: string };

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Option[];
  error?: string | null;
};

export function Select({
  label,
  options,
  error,
  className,
  ...props
}: SelectProps) {
  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-sm font-medium text-foreground">{label}</div>
      ) : null}
      <select
        className={[
          "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/30",
          error ? "border-accent focus:border-accent focus:ring-accent/40" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <div className="mt-1 text-sm text-accent">{error}</div>
      ) : null}
    </label>
  );
}


