import * as React from "react";
import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "muted" | "subtle" | "outline";
  interactive?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
};

export function Card({
  className,
  variant = "default",
  interactive = false,
  padding = "md",
  ...props
}: CardProps) {
  const variants: Record<NonNullable<CardProps["variant"]>, string> = {
    default:
      "bg-surface border border-[var(--border)] shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_1px_rgba(15,23,42,0.03)]",
    muted: "bg-surface-muted border border-[var(--border-soft)]",
    subtle:
      "bg-white/60 backdrop-blur-sm border border-[var(--border-soft)] shadow-[0_1px_2px_rgba(15,23,42,0.03)]",
    outline: "bg-transparent border border-[var(--border-strong)]",
  };

  const paddings: Record<NonNullable<CardProps["padding"]>, string> = {
    none: "",
    sm: "p-3",
    md: "p-5",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={cn(
        "rounded-xl",
        variants[variant],
        paddings[padding],
        interactive && "hover-lift cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}
