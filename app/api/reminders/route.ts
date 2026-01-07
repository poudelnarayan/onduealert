export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonBadRequest, jsonOk, jsonServerError, jsonUnauthorized } from "@/lib/http";
import { createReminderSchema } from "@/lib/validation";
import { parseDateOnlyToUtcDateTimeInTimeZone } from "@/lib/dates";
import { prismaErrorResponse } from "@/lib/prisma-error";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return jsonUnauthorized();

  try {
    const reminders = await prisma.reminder.findMany({
      where: { clerkUserId: userId },
      include: { schedule: true },
      orderBy: [{ status: "asc" }, { dueAt: "asc" }],
    });

    return jsonOk({ reminders });
  } catch (err) {
    return prismaErrorResponse(err) ?? jsonServerError();
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return jsonUnauthorized();
  const body = await req.json().catch(() => null);
  const parsed = createReminderSchema.safeParse(body);
  if (!parsed.success) return jsonBadRequest("Invalid deadline payload");

  const input = parsed.data;
  if (input.frequency === "CUSTOM" && !input.customIntervalDays && !input.cronExpression) {
    return jsonBadRequest("CUSTOM frequency requires customIntervalDays (or cronExpression for future support).");
  }

  const timeZone = input.timezone ?? "UTC";
  const dueAt = parseDateOnlyToUtcDateTimeInTimeZone(input.dueDate, timeZone, 9);
  const interval = input.interval ?? 1;

  try {
    const created = await prisma.$transaction(async (tx) => {
      const schedule = await tx.reminderSchedule.create({
        data: {
          clerkUserId: userId,
          frequency: input.frequency,
          interval,
          customIntervalDays: input.customIntervalDays,
          cronExpression: input.cronExpression,
          timezone: timeZone,
          offsetsDays: input.offsetsDays,
        },
      });

      const reminder = await tx.reminder.create({
        data: {
          clerkUserId: userId,
          scheduleId: schedule.id,
          clientName: input.clientName ?? null,
          title: input.title,
          description: input.description ?? null,
          category: input.category,
          dueAt,
        },
        include: { schedule: true },
      });

      return reminder;
    });

    return jsonOk({ reminder: created }, { status: 201 });
  } catch (err) {
    return prismaErrorResponse(err) ?? jsonServerError();
  }
}


