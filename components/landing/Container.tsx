import * as React from "react";
import { cn } from "@/lib/cn";

export function Container({
  className,
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  size?: "default" | "wide" | "narrow";
}) {
  const max =
    size === "wide"
      ? "max-w-7xl"
      : size === "narrow"
        ? "max-w-3xl"
        : "max-w-6xl";
  return (
    <div
      className={cn("mx-auto w-full px-5 sm:px-8 lg:px-10", max, className)}
      {...props}
    />
  );
}
