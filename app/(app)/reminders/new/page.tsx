import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ReminderForm } from "@/components/ReminderForm";
import { auth } from "@clerk/nextjs/server";

export default async function NewReminderPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="space-y-4">
      <div>
        <div className="text-lg font-semibold text-brand-900">Create deadline</div>
        <div className="mt-1 text-sm text-brand-600">
          Define the deadline, its schedule, and the notifications you want before it’s due.
        </div>
      </div>
      <Card>
        <ReminderForm mode="create" />
      </Card>
    </div>
  );
}


