export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonOk, jsonServerError, jsonUnauthorized } from "@/lib/http";
import { requiredEnv } from "@/lib/env";
import { addDaysUtc, addDaysUtcInTimeZone, startOfDayUtc, startOfDayUtcInTimeZone } from "@/lib/dates";
import { sendEmail } from "@/lib/email";
import { prismaErrorResponse } from "@/lib/prisma-error";
import { computeEscalationLevel } from "@/lib/escalation";
import { clerkClient } from "@clerk/nextjs/server";

function isAuthorized(req: NextRequest): boolean {
  const token = req.nextUrl.searchParams.get("token");
  return token === requiredEnv("CRON_SECRET");
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return jsonUnauthorized();

  try {
    const now = new Date();
    const todayUtc = startOfDayUtc(now);
    const windowStart = addDaysUtc(todayUtc, -370);
    const windowEnd = addDaysUtc(todayUtc, 370);

    const reminders = await prisma.reminder.findMany({
      where: {
        status: "OPEN",
        dueAt: { gte: windowStart, lte: windowEnd },
        OR: [{ snoozedUntil: null }, { snoozedUntil: { lte: now } }],
      },
      include: { schedule: true },
      orderBy: { dueAt: "asc" },
      take: 2000,
    });

    const emailCache = new Map<string, string>();
    async function getUserEmail(clerkUserId: string): Promise<string> {
      const cached = emailCache.get(clerkUserId);
      if (cached) return cached;
      const client = await clerkClient();
      const u = await client.users.getUser(clerkUserId);
      const email =
        u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId)
          ?.emailAddress ?? u.emailAddresses[0]?.emailAddress;
      if (!email) throw new Error("Clerk user has no email address");
      emailCache.set(clerkUserId, email);
      return email;
    }

    let considered = 0;
    let enqueued = 0;
    let sent = 0;
    let skipped = 0;

    for (const r of reminders) {
      considered += 1;
      const tz = r.schedule.timezone ?? "UTC";
      const today = tz && tz !== "UTC" ? startOfDayUtcInTimeZone(now, tz) : todayUtc;
      const dueDay = tz && tz !== "UTC" ? startOfDayUtcInTimeZone(r.dueAt, tz) : startOfDayUtc(r.dueAt);
      const { level } = computeEscalationLevel({ dueAt: r.dueAt, status: r.status, now, timeZone: tz });
      const to = await getUserEmail(r.clerkUserId);

      // Overdue escalation: once per day while still OPEN and dueAt < today.
      if (dueDay < today) {
        const scheduledFor = today;
        const log = await prisma.notificationLog.upsert({
          where: {
            notification_idempotency: {
              reminderId: r.id,
              type: "OVERDUE_ESCALATION",
              scheduledFor,
              offsetDays: -1,
            },
          },
          create: {
            clerkUserId: r.clerkUserId,
            reminderId: r.id,
            type: "OVERDUE_ESCALATION",
            level,
            scheduledFor,
            offsetDays: -1,
            status: "PENDING",
          },
          update: { level },
        });

        if (log.status === "SENT") {
          skipped += 1;
        } else if (log.attemptCount >= 3) {
          skipped += 1;
        } else {
          enqueued += 1;
          try {
            const msg = await sendEmail({
              to,
              subject: `OnDueAlert (${level}): Overdue — ${r.title}`,
              text: [
                `Deadline: ${r.title}`,
                r.description ? `Details: ${r.description}` : null,
                `Due date: ${r.dueAt.toISOString().slice(0, 10)}`,
                "",
                "This deadline is overdue. OnDueAlert will email daily until it is completed.",
              ]
                .filter(Boolean)
                .join("\n"),
            });

            await prisma.notificationLog.update({
              where: { id: log.id },
              data: {
                status: "SENT",
                sentAt: new Date(),
                providerMessageId: msg.messageId,
                attemptCount: { increment: 1 },
              },
            });
            sent += 1;
          } catch (err) {
            await prisma.notificationLog.update({
              where: { id: log.id },
              data: {
                status: "FAILED",
                errorMessage: err instanceof Error ? err.message : "Unknown error",
                attemptCount: { increment: 1 },
              },
            });
          }
        }
      }

      // Offset-based reminders (including same-day offset=0).
      const offsets = Array.from(new Set(r.schedule.offsetsDays ?? [])).sort(
        (a, b) => b - a
      );
      for (const offsetDays of offsets) {
        const scheduledFor =
          tz && tz !== "UTC"
            ? addDaysUtcInTimeZone(dueDay, tz, -offsetDays)
            : startOfDayUtc(addDaysUtc(r.dueAt, -offsetDays));
        if (scheduledFor > now) continue;

        // Level for pre-due notifications can be stricter as it gets closer.
        const preDueLevel =
          offsetDays <= 1 ? "WARNING" : offsetDays <= 3 ? "WARNING" : "NORMAL";

        const log = await prisma.notificationLog.upsert({
          where: {
            notification_idempotency: {
              reminderId: r.id,
              type: "OFFSET_REMINDER",
              scheduledFor,
              offsetDays,
            },
          },
          create: {
            clerkUserId: r.clerkUserId,
            reminderId: r.id,
            type: "OFFSET_REMINDER",
            level: preDueLevel,
            scheduledFor,
            offsetDays,
            status: "PENDING",
          },
          update: { level: preDueLevel },
        });

        if (log.status === "SENT") {
          skipped += 1;
          continue;
        }
        if (log.attemptCount >= 3) {
          skipped += 1;
          continue;
        }

        enqueued += 1;
        try {
          const when =
            offsetDays === 0
              ? "today"
              : `in ${offsetDays} day${offsetDays === 1 ? "" : "s"}`;

          const msg = await sendEmail({
            to,
            subject: `OnDueAlert (${preDueLevel}): ${r.title} due ${when}`,
            text: [
              `Deadline: ${r.title}`,
              r.description ? `Details: ${r.description}` : null,
              `Due date: ${r.dueAt.toISOString().slice(0, 10)}`,
              "",
              "Sign in to OnDueAlert to view or complete this deadline.",
            ]
              .filter(Boolean)
              .join("\n"),
          });

          await prisma.notificationLog.update({
            where: { id: log.id },
            data: {
              status: "SENT",
              sentAt: new Date(),
              providerMessageId: msg.messageId,
              attemptCount: { increment: 1 },
            },
          });
          sent += 1;
        } catch (err) {
          await prisma.notificationLog.update({
            where: { id: log.id },
            data: {
              status: "FAILED",
              errorMessage: err instanceof Error ? err.message : "Unknown error",
              attemptCount: { increment: 1 },
            },
          });
        }
      }
    }

    return jsonOk({ ok: true, considered, enqueued, sent, skipped });
  } catch (err) {
    return prismaErrorResponse(err) ?? jsonServerError();
  }
}


