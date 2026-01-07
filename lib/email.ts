import nodemailer from "nodemailer";
import { optionalEnv, requiredEnv } from "@/lib/env";

type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail(input: SendEmailInput): Promise<{
  messageId: string;
}> {
  const mode = (optionalEnv("EMAIL_MODE") ?? "smtp").toLowerCase();
  if (mode === "console") {
    // Dev-friendly mode: print and treat as sent to keep cron idempotent.
    // eslint-disable-next-line no-console
    console.log("[OnDueAlert email:console]", {
      to: input.to,
      subject: input.subject,
      text: input.text,
    });
    return { messageId: "console" };
  }

  const host = optionalEnv("SMTP_HOST");
  const port = Number(optionalEnv("SMTP_PORT") ?? "587");
  const user = optionalEnv("SMTP_USER");
  const pass = optionalEnv("SMTP_PASS");
  const from = optionalEnv("EMAIL_FROM") ?? requiredEnv("SMTP_USER");

  if (!host || !user || !pass) {
    // eslint-disable-next-line no-console
    console.warn(
      "SMTP env vars are not configured. Set EMAIL_MODE=console for local dev."
    );
    return { messageId: "skipped-no-smtp" };
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const info = await transport.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
  });

  return { messageId: info.messageId ?? "sent" };
}


