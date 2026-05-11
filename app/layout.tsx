import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "react-datepicker/dist/react-datepicker.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OnDueAlert — Compliance enforcement for deadlines that matter",
  description:
    "Track recurring deadlines, deliver precision alerts, and escalate overdue work until it's resolved — with an immutable audit trail.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#2563EB",
          colorTextOnPrimaryBackground: "#FFFFFF",
          colorBackground: "#FFFFFF",
          colorInputBackground: "#FFFFFF",
          colorInputText: "#0F172A",
          colorText: "#0F172A",
          colorTextSecondary: "#475569",
          colorNeutral: "#475569",
          colorDanger: "#EF4444",
          colorSuccess: "#10B981",
          colorWarning: "#F59E0B",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        },
        elements: {
          rootBox: "w-full",
          main: "bg-transparent w-full",
          pageScrollBox: "bg-transparent w-full",
          layout: "bg-transparent w-full",
          card:
            "bg-white border border-[rgba(15,23,42,0.08)] shadow-[0_18px_40px_-12px_rgba(15,23,42,0.18),0_4px_10px_-4px_rgba(15,23,42,0.08)] rounded-2xl",
          cardBox:
            "bg-white border border-[rgba(15,23,42,0.08)] shadow-[0_18px_40px_-12px_rgba(15,23,42,0.18),0_4px_10px_-4px_rgba(15,23,42,0.08)] rounded-2xl w-full",
          modalBackdrop: "bg-[rgba(15,23,42,0.45)] backdrop-blur-sm",

          headerTitle: "text-[#0F172A] text-2xl font-semibold tracking-tight",
          headerSubtitle: "text-[#475569]",
          formFieldLabel: "text-[#0F172A] text-[13px] font-medium",
          formFieldHintText: "text-[#475569]",
          formFieldErrorText: "text-[#B91C1C]",
          footerActionText: "text-[#475569]",
          footerActionLink:
            "text-[#2563EB] font-medium hover:text-[#1D4ED8]",
          identityPreviewText: "text-[#475569]",
          userPreviewMainIdentifier: "text-[#0F172A]",
          userPreviewSecondaryIdentifier: "text-[#475569]",

          formFieldInput:
            "bg-white text-[#0F172A] border border-[rgba(15,23,42,0.14)] rounded-lg focus:border-[#2563EB] focus:ring-2 focus:ring-[rgba(37,99,235,0.20)] placeholder:text-[#94A3B8]",

          formButtonPrimary:
            "bg-[linear-gradient(180deg,#3b82f6_0%,#2563eb_100%)] text-white shadow-[0_8px_24px_-8px_rgba(37,99,235,0.55)] hover:shadow-[0_12px_32px_-8px_rgba(37,99,235,0.65)] rounded-lg",
          formButtonReset:
            "bg-transparent text-[#0F172A] ring-1 ring-inset ring-[rgba(15,23,42,0.14)] hover:bg-[#F5F7FB] rounded-lg",
          socialButtonsBlockButton:
            "bg-white text-[#0F172A] ring-1 ring-inset ring-[rgba(15,23,42,0.14)] hover:bg-[#F5F7FB] rounded-lg",
          socialButtonsBlockButtonText: "text-[#0F172A] font-medium",

          dividerLine: "bg-[rgba(15,23,42,0.08)]",
          dividerText: "text-[#94A3B8]",

          userButtonTrigger: "text-[#0F172A]",
          userButtonAvatarBox:
            "bg-white rounded-full ring-1 ring-[rgba(15,23,42,0.14)] overflow-hidden",
          userButtonAvatarImage: "rounded-full",
          userButtonPopoverCard:
            "bg-white border border-[rgba(15,23,42,0.08)] shadow-[0_18px_40px_-12px_rgba(15,23,42,0.18)] rounded-xl",
          userButtonPopoverFooter:
            "bg-[#F5F7FB] border-t border-[rgba(15,23,42,0.08)]",
          userButtonPopoverActionButton:
            "text-[#0F172A] hover:bg-[#F5F7FB]",
          userButtonPopoverActionButtonText: "text-[#0F172A]",
          userButtonPopoverActionButtonIcon: "text-[#475569]",

          navbar: "bg-white border-r border-[rgba(15,23,42,0.08)]",
          navbarButton: "text-[#0F172A] hover:bg-[#F5F7FB]",
          navbarButtonText: "text-[#0F172A]",
          navbarButtonIcon: "text-[#475569]",
          profileSectionTitleText: "text-[#0F172A]",
          profileSectionContent:
            "bg-white border border-[rgba(15,23,42,0.08)] rounded-xl",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
