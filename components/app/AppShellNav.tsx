"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import {
  IconActivity,
  IconCalendar,
  IconChecklist,
  IconLogo,
  IconShield,
} from "@/components/landing/Icons";

type Item = { label: string; href: string; icon: React.ReactNode };

const NAV: Item[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconActivity className="h-4 w-4" />,
  },
  {
    label: "Deadlines",
    href: "/reminders",
    icon: <IconChecklist className="h-4 w-4" />,
  },
];

export function AppShellNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-[var(--foreground-strong)]"
          >
            <IconLogo className="h-7 w-7" />
            <span>OnDueAlert</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13.5px] font-medium transition-colors",
                    active
                      ? "bg-[var(--accent-bg)] text-[var(--accent-strong)]"
                      : "text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground-strong)]",
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/reminders/new" className="hidden sm:block">
            <Button size="sm">
              <IconCalendar className="h-4 w-4" />
              New deadline
            </Button>
          </Link>
          <span className="hidden h-6 w-px bg-[var(--border)] sm:block" />
          <UserButton
            appearance={{
              elements: {
                userButtonTrigger:
                  "rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(37,99,235,0.35)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                userButtonAvatarBox:
                  "h-9 w-9 rounded-full ring-1 ring-[var(--border-strong)] overflow-hidden",
                userButtonAvatarImage: "rounded-full",
              },
            }}
          />
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-[var(--border)] px-3 py-2 sm:hidden">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium",
                active
                  ? "bg-[var(--accent-bg)] text-[var(--accent-strong)]"
                  : "text-[var(--muted)]",
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/reminders/new"
          className="ml-auto inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-1.5 text-[13px] font-semibold text-white"
        >
          <IconCalendar className="h-4 w-4" /> New
        </Link>
      </div>
    </header>
  );
}
