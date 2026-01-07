"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-semibold tracking-tight text-brand-900">
            OnDueAlert
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-brand-700 sm:flex">
            <a href="#features" className="hover:text-brand-900">
              Features
            </a>
            <a href="#different" className="hover:text-brand-900">
              Comparison
            </a>
            <a href="#reliability" className="hover:text-brand-900">
              Reliability
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/sign-in" className="hidden sm:block">
            <Button variant="secondary" size="sm">Sign in</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}


