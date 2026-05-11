"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { IconLogo } from "@/components/landing/Icons";

export function LandingHeader() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-[var(--border)] bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(15,23,42,0.04)]"
          : "border-b border-transparent bg-white/50 backdrop-blur-sm",
      ].join(" ")}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-[var(--foreground-strong)]"
          >
            <IconLogo className="h-7 w-7 transition-transform group-hover:scale-105" />
            <span>OnDueAlert</span>
          </Link>
          <nav className="hidden items-center gap-7 text-[13.5px] text-[var(--muted)] sm:flex">
            <a
              href="#features"
              className="transition-colors hover:text-[var(--foreground-strong)]"
            >
              Features
            </a>
            <a
              href="#reliability"
              className="transition-colors hover:text-[var(--foreground-strong)]"
            >
              Reliability
            </a>
            <a
              href="#different"
              className="transition-colors hover:text-[var(--foreground-strong)]"
            >
              Comparison
            </a>
            <a
              href="#how"
              className="transition-colors hover:text-[var(--foreground-strong)]"
            >
              How it works
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/sign-in" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
