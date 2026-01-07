import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EmptyState(props: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface p-6 text-center shadow-sm">
      <div className="text-base font-semibold text-brand-900">{props.title}</div>
      <div className="mx-auto mt-2 max-w-prose text-sm leading-6 text-brand-600">
        {props.description}
      </div>
      {props.ctaHref && props.ctaLabel ? (
        <div className="mt-4 flex justify-center">
          <Link href={props.ctaHref}>
            <Button>{props.ctaLabel}</Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}


