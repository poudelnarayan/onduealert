import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/Button";

export function EmptyState(props: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-strong)] bg-white/50 p-8 text-center">
      {props.icon ? (
        <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-bg)] text-[var(--accent-strong)]">
          {props.icon}
        </div>
      ) : null}
      <div className="text-base font-semibold text-[var(--foreground-strong)]">
        {props.title}
      </div>
      <div className="mx-auto mt-1.5 max-w-prose text-sm leading-6 text-[var(--muted)]">
        {props.description}
      </div>
      {props.ctaHref && props.ctaLabel ? (
        <div className="mt-5 flex justify-center">
          <Link href={props.ctaHref}>
            <Button>{props.ctaLabel}</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
