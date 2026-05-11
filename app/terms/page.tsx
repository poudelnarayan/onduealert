import { Container } from "@/components/landing/Container";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function TermsPage() {
  return (
    <div>
      <LandingHeader />
      <main>
        <Container size="narrow" className="py-20 sm:py-28">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
            Legal
          </div>
          <h1 className="mt-3 text-pretty text-4xl font-semibold tracking-tight text-[var(--foreground-strong)]">
            Terms of Service
          </h1>
          <div className="mt-6 space-y-4 text-[15px] leading-7 text-[var(--muted)]">
            <p>
              OnDueAlert helps you track deadlines and sends notifications
              based on the schedules you configure. You are responsible for
              confirming the accuracy of due dates and meeting deadlines.
            </p>
            <p>
              The service is provided &ldquo;as is&rdquo; without warranties.
              Liability is limited to the maximum extent permitted by law.
            </p>
            <p>
              Questions? Contact{" "}
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
