export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonBadRequest, jsonNotFound, jsonOk, jsonServerError, jsonUnauthorized } from "@/lib/http";
import { prismaErrorResponse } from "@/lib/prisma-error";
import { addDaysUtc, startOfDayUtc } from "@/lib/dates";
import { auth } from "@clerk/nextjs/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return jsonUnauthorized();
  const { id } = await params;

  try {
    const body = await req.json().catch(() => null);
    const days = Number(body?.days);
    if (!Number.isFinite(days) || !Number.isInteger(days) || days < 1) {
      return jsonBadRequest("days must be a positive integer.");
    }

    // Guardrails: cannot snooze forever.
    const maxSnoozes = 3;
    const maxDays = 30;
    if (days > maxDays) return jsonBadRequest(`Max snooze is ${maxDays} days.`);

    const now = new Date();
    const snoozedUntil = addDaysUtc(startOfDayUtc(now), days);

    const reminder = await prisma.reminder.findFirst({
      where: { id, clerkUserId: userId },
      select: { id: true, status: true, snoozeCount: true },
    });
    if (!reminder) return jsonNotFound();
    if (reminder.status !== "OPEN") {
      return jsonBadRequest("Only OPEN deadlines can be snoozed.");
    }
    if (reminder.snoozeCount >= maxSnoozes) {
      return jsonBadRequest("Snooze limit reached for this deadline.");
    }

    const updated = await prisma.reminder.update({
      where: { id: reminder.id },
      data: {
        snoozedUntil,
        snoozeCount: { increment: 1 },
      },
      select: { id: true, snoozedUntil: true, snoozeCount: true },
    });

    return jsonOk({ ok: true, reminder: updated });
  } catch (err) {
    return prismaErrorResponse(err) ?? jsonServerError();
  }
}


