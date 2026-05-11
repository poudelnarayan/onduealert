import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { LandingPage } from "@/components/landing/LandingPage";
import { Analytics } from "@vercel/analytics/next";

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");
  return (
    <>
      <Analytics />
      <LandingPage />;
    </>
  );
}
