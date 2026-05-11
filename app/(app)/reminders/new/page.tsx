import { redirect } from "next/navigation";
import { ReminderForm } from "@/components/ReminderForm";
import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/app/PageHeader";
import { IconCalendar } from "@/components/landing/Icons";

export default async function NewReminderPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={
          <>
            <IconCalendar className="h-3.5 w-3.5" />
            New deadline
          </>
        }
        title="Create deadline"
        description="Define the deadline, its schedule, and the notifications you want before it's due."
      />
      <ReminderForm mode="create" />
    </div>
  );
}
