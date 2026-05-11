import Link from "next/link";
import { Container } from "@/components/landing/Container";
import { IconLogo } from "@/components/landing/Icons";

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-white/60 backdrop-blur-sm">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-[var(--foreground-strong)]"
            >
              <IconLogo className="h-7 w-7" />
              OnDueAlert
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--muted)]">
              Compliance enforcement for deadlines that carry consequences.
              Recurring schedules, multi-offset alerts, and overdue escalation
              that stays visible until resolved.
            </p>
          </div>

          <div className="sm:col-span-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">
              Product
            </div>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li>
                <a
                  href="#features"
                  className="transition-colors hover:text-[var(--foreground-strong)]"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#reliability"
                  className="transition-colors hover:text-[var(--foreground-strong)]"
                >
                  Reliability
                </a>
              </li>
              <li>
                <a
                  href="#different"
                  className="transition-colors hover:text-[var(--foreground-strong)]"
                >
                  Comparison
                </a>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">
              Company
            </div>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-[var(--foreground-strong)]"
                >
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-[var(--foreground-strong)]"
                >
                  Terms of service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@onduealert.app"
                  className="transition-colors hover:text-[var(--foreground-strong)]"
                >
                  support@onduealert.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted-2)] sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} OnDueAlert. All rights reserved.</div>
          <div className="flex items-center gap-2 rounded-full bg-[var(--success-bg)] px-3 py-1 ring-1 ring-inset ring-[var(--success-ring)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--success)] status-dot" />
            <span className="font-medium text-[var(--success-strong)]">
              All systems operational
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
