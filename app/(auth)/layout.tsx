import Link from "next/link";
import { IconLogo, IconShield, IconCheck } from "@/components/landing/Icons";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(700px 400px at 90% 10%, rgba(37,99,235,0.10), transparent 60%), radial-gradient(700px 400px at 10% 90%, rgba(6,182,212,0.10), transparent 60%)",
        }}
      />

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left side — auth form */}
        <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-[var(--foreground-strong)]"
          >
            <IconLogo className="h-7 w-7" />
            OnDueAlert
          </Link>

          <div className="flex flex-1 items-center">
            <div className="w-full max-w-md">{children}</div>
          </div>

          <div className="text-[12.5px] text-[var(--muted-2)]">
            © {new Date().getFullYear()} OnDueAlert · Compliance enforcement
            built for serious operations.
          </div>
        </div>

        {/* Right side — brand canvas */}
        <div className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_60%,#0f172a_100%)]" />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(600px 300px at 80% 20%, rgba(59,130,246,0.45), transparent 65%), radial-gradient(600px 300px at 20% 80%, rgba(6,182,212,0.40), transparent 65%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative flex h-full items-center justify-center p-12">
            <div className="max-w-md text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/85 backdrop-blur">
                <IconShield className="h-3.5 w-3.5" />
                Trusted by serious operators
              </div>
              <h2 className="mt-6 text-pretty text-3xl font-semibold leading-tight tracking-tight sm:text-[36px]">
                Deadlines that{" "}
                <span className="bg-[linear-gradient(135deg,#a5f3fc,#bfdbfe)] bg-clip-text text-transparent">
                  never slip
                </span>{" "}
                through the cracks.
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-white/70">
                A calm, audit-ready system for compliance teams, accountants,
                agencies, and operators. Set up in under three minutes.
              </p>
              <ul className="mt-8 space-y-3 text-[13.5px] text-white/85">
                {[
                  "Multi-offset alerts with idempotent delivery",
                  "Severity escalation that stays visible until resolved",
                  "Immutable audit history — auditors love it",
                ].map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                      <IconCheck className="h-3 w-3 text-[#a5f3fc]" />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
