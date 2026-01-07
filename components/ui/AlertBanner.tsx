"use client";

import * as React from "react";

export function AlertBanner(props: {
  variant?: "info" | "warning" | "critical" | "success";
  title: string;
  description?: string;
  className?: string;
}) {
  const variant = props.variant ?? "info";
  const styles: Record<typeof variant, string> = {
    info: "border-border bg-surface text-foreground",
    success: "border-accent/40 bg-accent-bg text-foreground",
    warning: "border-accent/55 bg-accent-bg text-foreground",
    critical: "border-accent/70 bg-accent-bg-strong text-foreground",
  };

  return (
    <div
      className={[
        "rounded-lg border p-4 shadow-sm",
        styles[variant],
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
    >
      <div className="text-sm font-semibold">{props.title}</div>
      {props.description ? (
        <div className="mt-1 text-sm opacity-90">{props.description}</div>
      ) : null}
    </div>
  );
}


