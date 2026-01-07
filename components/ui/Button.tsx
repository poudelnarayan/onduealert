"use client";

import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
  };

  const styles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-accent text-[#222831] shadow-sm hover:bg-accent/90 active:bg-accent/85",
    secondary:
      "bg-transparent text-accent ring-1 ring-inset ring-accent/70 hover:bg-accent-bg active:bg-accent-bg-strong",
    danger:
      "bg-transparent text-accent ring-1 ring-inset ring-accent/70 hover:bg-accent-bg active:bg-accent-bg-strong",
    ghost:
      "bg-transparent text-foreground hover:bg-surface-muted active:bg-surface-muted/80",
  };

  return (
    <button
      className={[
        base,
        sizes[size],
        styles[variant],
        "select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}


