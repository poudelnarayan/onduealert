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
  title: "OnDueAlert",
  description:
    "Simple compliance reminders for freelancers and small businesses.",
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
          colorPrimary: "#00ADB5",
          colorTextOnPrimaryBackground: "#222831",
          colorBackground: "#222831",
          colorInputBackground: "#222831",
          colorInputText: "#EEEEEE",
          colorText: "#EEEEEE",
          colorTextSecondary: "rgba(238,238,238,0.7)",
          colorNeutral: "rgba(238,238,238,0.7)",
          colorDanger: "#00ADB5",
          colorSuccess: "#00ADB5",
        },
        elements: {
          /* Containers */
          rootBox: "bg-background text-foreground",
          main: "bg-transparent w-full",
          pageScrollBox: "bg-transparent w-full",
          layout: "bg-transparent w-full",
          card: "bg-surface border border-border shadow-none",
          cardBox: "bg-surface border border-border shadow-none w-full",
          modalBackdrop: "bg-black/50",

          /* Typography */
          headerTitle: "text-foreground",
          headerSubtitle: "text-[rgba(238,238,238,0.7)]",
          formFieldLabel: "text-foreground",
          formFieldHintText: "text-[rgba(238,238,238,0.7)]",
          formFieldErrorText: "text-accent",
          footerActionText: "text-[rgba(238,238,238,0.7)]",
          footerActionLink: "text-accent hover:text-accent/90",
          identityPreviewText: "text-[rgba(238,238,238,0.7)]",
          userPreviewMainIdentifier: "text-foreground",
          userPreviewSecondaryIdentifier: "text-[rgba(238,238,238,0.7)]",

          /* Inputs */
          formFieldInput:
            "bg-background text-foreground border border-border focus:border-accent focus:ring-2 focus:ring-accent/30 placeholder:text-[rgba(238,238,238,0.6)]",

          /* Buttons */
          formButtonPrimary:
            "bg-accent text-[#222831] hover:bg-accent/90",
          formButtonReset:
            "bg-transparent text-accent ring-1 ring-inset ring-accent/70 hover:bg-accent-bg",
          socialButtonsBlockButton:
            "bg-transparent text-foreground ring-1 ring-inset ring-border hover:bg-surface-muted",
          socialButtonsBlockButtonText: "text-foreground",

          /* Dividers */
          dividerLine: "bg-border",
          dividerText: "text-[rgba(238,238,238,0.7)]",

          /* UserButton / popover */
          userButtonTrigger: "text-foreground",
          userButtonAvatarBox:
            "bg-surface rounded-full ring-1 ring-border overflow-hidden",
          userButtonAvatarImage: "rounded-full bg-transparent",
          userButtonPopoverCard: "bg-surface border border-border shadow-none",
          userButtonPopoverFooter: "bg-surface border-t border-border",
          userButtonPopoverActionButton:
            "text-foreground hover:bg-surface-muted",
          userButtonPopoverActionButtonText: "text-foreground",
          userButtonPopoverActionButtonIcon: "text-[rgba(238,238,238,0.7)]",

          /* UserProfile / account management */
          navbar: "bg-surface border-r border-border",
          navbarButton: "text-foreground hover:bg-surface-muted",
          navbarButtonText: "text-foreground",
          navbarButtonIcon: "text-[rgba(238,238,238,0.7)]",
          profileSectionTitleText: "text-foreground",
          profileSectionContent: "bg-surface border border-border",
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
