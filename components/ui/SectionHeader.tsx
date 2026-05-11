import * as React from "react";
import { cn } from "@/lib/cn";

export function SectionHeader(props: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const align = props.align ?? "left";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        props.className,
      )}
    >
      {props.eyebrow ? (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]",
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />
          {props.eyebrow}
        </div>
      ) : null}
      <h2 className="mt-4 text-pretty text-3xl font-semibold tracking-tight text-[var(--foreground-strong)] sm:text-4xl">
        {props.title}
      </h2>
      {props.description ? (
        <p className="mt-4 text-pretty text-[15px] leading-7 text-[var(--muted)]">
          {props.description}
        </p>
      ) : null}
    </div>
  );
}
