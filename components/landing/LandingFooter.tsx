import Link from "next/link";
import { Container } from "@/components/landing/Container";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-brand-900">OnDueAlert</div>
            <div className="mt-1 max-w-prose text-sm text-brand-600">
              Compliance enforcement for deadlines that carry consequences.
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-700">
            <Link href="/privacy" className="hover:text-brand-900">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-brand-900">
              Terms
            </Link>
            <a
              href="mailto:support@onduealert.app"
              className="hover:text-brand-900"
            >
              support@onduealert.app
            </a>
          </div>
        </div>
        <div className="mt-8 text-xs text-brand-600">
          © {new Date().getFullYear()} OnDueAlert. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}


