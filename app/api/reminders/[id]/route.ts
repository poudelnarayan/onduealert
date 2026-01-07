export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  jsonBadRequest,
  jsonNotFound,
  jsonOk,
  jsonServerError,
  jsonUnauthorized,
} from "@/lib/http";
import { updateReminderSchema } from "@/lib/validation";
import { parseDateOnlyToUtcDateTimeInTimeZone } from "@/lib/dates";
import { prismaErrorResponse } from "@/lib/prisma-error";
import { auth } from "@clerk/nextjs/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return jsonUnauthorized();
  const { id } = await params;

  try {
    const reminder = await prisma.reminder.findFirst({
      where: { id, clerkUserId: userId },
      include: { schedule: true },
    });
    if (!reminder) return jsonNotFound();

    return jsonOk({ reminder });
  } catch (err) {
    return prismaErrorResponse(err) ?? jsonServerError();
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return jsonUnauthorized();
  const { id } = await params;

  const body = await req.json().catch(() => null);
  const parsed = updateReminderSchema.safeParse(body);
  if (!parsed.success) return jsonBadRequest("Invalid deadline payload");
  const input = parsed.data;

  try {
    const existing = await prisma.reminder.findFirst({
      where: { id, clerkUserId: userId },
      include: { schedule: true },
    });
    if (!existing) return jsonNotFound();
    if (existing.status === "COMPLETED") {
      return jsonBadRequest("Completed deadlines cannot be edited.");
    }

    const nextTimeZone = input.timezone ?? existing.schedule.timezone ?? "UTC";
    const dueAt =
      input.dueDate !== undefined
        ? parseDateOnlyToUtcDateTimeInTimeZone(input.dueDate, nextTimeZone, 9)
        : undefined;

    const updated = await prisma.$transaction(async (tx) => {
      if (
        input.frequency !== undefined ||
        input.interval !== undefined ||
        input.customIntervalDays !== undefined ||
        input.cronExpression !== undefined ||
        input.timezone !== undefined ||
        input.offsetsDays !== undefined
      ) {
        await tx.reminderSchedule.updateMany({
          where: { id: existing.scheduleId, clerkUserId: userId },
          data: {
            frequency: input.frequency,
            interval: input.interval,
            customIntervalDays: input.customIntervalDays,
            cronExpression: input.cronExpression,
            timezone: input.timezone,
            offsetsDays: input.offsetsDays,
          },
        });
      }

      const reminder = await tx.reminder.update({
        where: { id },
        data: {
          clientName:
            input.clientName === undefined ? undefined : input.clientName ?? null,
          title: input.title,
          description:
            input.description === undefined ? undefined : input.description ?? null,
          category: input.category,
          dueAt,
        },
        include: { schedule: true },
      });

      return reminder;
    });

    return jsonOk({ reminder: updated });
  } catch (err) {
    return prismaErrorResponse(err) ?? jsonServerError();
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return jsonUnauthorized();
  const { id } = await params;

  try {
    const existing = await prisma.reminder.findFirst({
      where: { id, clerkUserId: userId },
      select: { id: true, scheduleId: true },
    });
    if (!existing) return jsonNotFound();

    await prisma.$transaction(async (tx) => {
      await tx.reminder.delete({ where: { id: existing.id } });
      const remaining = await tx.reminder.count({
        where: { scheduleId: existing.scheduleId, clerkUserId: userId },
      });
      if (remaining === 0) {
        await tx.reminderSchedule.deleteMany({
          where: { id: existing.scheduleId, clerkUserId: userId },
        });
      }
    });

    return jsonOk({ ok: true });
  } catch (err) {
    return prismaErrorResponse(err) ?? jsonServerError();
  }
}


