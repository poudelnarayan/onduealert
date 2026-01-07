"use client";

import * as React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  hint?: string;
};

export function Input({ label, error, hint, className, ...props }: InputProps) {
  return (
    <label className="block">
      {label ? (
        <div className="mb-1 text-sm font-medium text-brand-900">{label}</div>
      ) : null}
      <input
        className={[
          "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-[rgba(238,238,238,0.6)] focus:border-accent focus:ring-2 focus:ring-accent/30",
          error ? "border-accent focus:border-accent focus:ring-accent/40" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
      {error ? (
        <div className="mt-1 text-sm text-accent">{error}</div>
      ) : null}
      {!error && hint ? (
        <div className="mt-1 text-sm text-[rgba(238,238,238,0.7)]">{hint}</div>
      ) : null}
    </label>
  );
}


