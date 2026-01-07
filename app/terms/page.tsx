import { Container } from "@/components/landing/Container";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function TermsPage() {
  return (
    <div className="bg-background text-foreground">
      <LandingHeader />
      <main>
        <Container className="py-12 sm:py-16">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-950">
            Terms of Service
          </h1>
          <p className="mt-4 max-w-prose text-base leading-7 text-brand-700">
            OnDueAlert helps you track deadlines and sends notifications based on
            the schedules you configure. You are responsible for confirming the
            accuracy of due dates and meeting deadlines.
          </p>
          <p className="mt-4 max-w-prose text-base leading-7 text-brand-700">
            The service is provided “as is” without warranties. Liability is
            limited to the maximum extent permitted by law.
          </p>
          <p className="mt-4 max-w-prose text-base leading-7 text-brand-700">
            Questions? Contact{" "}
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


