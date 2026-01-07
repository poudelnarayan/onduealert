import Link from "next/link";
import { redirect } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { auth } from "@clerk/nextjs/server";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-semibold tracking-tight text-brand-900"
            >
              OnDueAlert
            </Link>
            <nav className="flex items-center gap-3 text-sm text-brand-700">
              <Link href="/dashboard" className="hover:text-brand-900">
                Dashboard
              </Link>
              <Link href="/reminders" className="hover:text-brand-900">
                Deadlines
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonTrigger:
                      "rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    userButtonAvatarBox:
                      "h-12 w-12 rounded-full bg-surface ring-1 ring-border overflow-hidden",
                    userButtonAvatarImage: "rounded-full bg-transparent",
                  },
                }}
              />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton>
                  <Button variant="secondary">Sign in</Button>
                </SignInButton>
                <SignUpButton>
                  <Button>Sign up</Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}


