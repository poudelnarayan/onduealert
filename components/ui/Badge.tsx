import * as React from "react";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "neutral" | "success" | "warning" | "critical";
};

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  const styles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    neutral:
      "bg-transparent text-[rgba(238,238,238,0.7)] ring-1 ring-inset ring-[rgba(238,238,238,0.28)]",
    success: "bg-accent-bg text-foreground ring-1 ring-inset ring-accent/40",
    warning: "bg-accent-bg text-foreground ring-1 ring-inset ring-accent/55",
    critical: "bg-accent-bg-strong text-foreground ring-1 ring-inset ring-accent/70",
  };
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        styles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}


