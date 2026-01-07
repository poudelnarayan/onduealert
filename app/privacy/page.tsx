import { Container } from "@/components/landing/Container";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function PrivacyPage() {
  return (
    <div className="bg-background text-foreground">
      <LandingHeader />
      <main>
        <Container className="py-12 sm:py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-950">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-prose text-base leading-7 text-brand-700">
            OnDueAlert collects the minimum data required to operate the service:
            account email, hashed password, and reminder data you create. Email
            notifications are sent to the email address on your account.
          </p>
          <p className="mt-4 max-w-prose text-base leading-7 text-brand-700">
            We do not sell personal data. We keep operational logs for
            reliability and auditing (for example, when notifications are
            scheduled and sent).
          </p>
          <p className="mt-4 max-w-prose text-base leading-7 text-brand-700">
            For privacy questions, contact{" "}
            <a
              className="font-medium text-brand-900 underline"
              href="mailto:support@onduealert.app"
            >
              support@onduealert.app
            </a>
            .
          </p>
        </Container>
      </main>
      <LandingFooter />
    </div>
  );
}


