import { redirect } from "next/navigation";
import Link from "next/link";
import { ReminderForm } from "@/components/ReminderForm";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/app/PageHeader";

export default async function NewReminderPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        eyebrow={
          <Link
            href="/reminders"
            className="text-[var(--muted)] transition hover:text-[var(--foreground-strong)]"
          >
            ← Back to deadlines
          </Link>
        }
        title="New deadline"
        description="Set a due date, repeat cadence, and which days you want reminders."
      />
      <ReminderForm mode="create" />
    </div>
  );
}
