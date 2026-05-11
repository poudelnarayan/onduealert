import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { AppShellNav } from "@/components/app/AppShellNav";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen">
      <AppShellNav />
      <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
