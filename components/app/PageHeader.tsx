import * as React from "react";
import { cn } from "@/lib/cn";

export function PageHeader(props: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        props.className,
      )}
    >
      <div className="min-w-0">
        {props.eyebrow ? (
          <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">
            {props.eyebrow}
          </div>
        ) : null}
        <h1 className="text-[26px] font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-[30px]">
          {props.title}
        </h1>
        {props.description ? (
          <p className="mt-1.5 text-[14.5px] leading-6 text-[var(--muted)]">
            {props.description}
          </p>
        ) : null}
      </div>
      {props.actions ? (
        <div className="flex flex-wrap items-center gap-2">{props.actions}</div>
      ) : null}
    </div>
  );
}
