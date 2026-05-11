import { Container } from "@/components/landing/Container";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function PrivacyPage() {
  return (
    <div>
      <LandingHeader />
      <main>
        <Container size="narrow" className="py-20 sm:py-28">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
            Legal
          </div>
          <h1 className="mt-3 text-pretty text-4xl font-semibold tracking-tight text-[var(--foreground-strong)]">
            Privacy Policy
          </h1>
          <div className="mt-6 space-y-4 text-[15px] leading-7 text-[var(--muted)]">
            <p>
              OnDueAlert collects the minimum data required to operate the
              service: account email, hashed password, and reminder data you
              create. Email notifications are sent to the email address on
              your account.
            </p>
            <p>
              We do not sell personal data. We keep operational logs for
              reliability and auditing (for example, when notifications are
              scheduled and sent).
            </p>
            <p>
              For privacy questions, contact{" "}
              <a
                className="font-medium text-[var(--accent-strong)] underline-offset-4 hover:underline"
                href="mailto:support@onduealert.app"
              >
                support@onduealert.app
              </a>
              .
            </p>
          </div>
        </Container>
      </main>
      <LandingFooter />
    </div>
  );
}
