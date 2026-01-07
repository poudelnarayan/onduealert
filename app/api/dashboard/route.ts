export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonOk, jsonServerError, jsonUnauthorized } from "@/lib/http";
import { startOfDayUtc } from "@/lib/dates";
import { prismaErrorResponse } from "@/lib/prisma-error";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return jsonUnauthorized();
  const today = startOfDayUtc(new Date());

  try {
    const [upcoming, overdue, completed, openCount, overdueCount, completedCount] =
      await prisma.$transaction([
        prisma.reminder.findMany({
          where: { clerkUserId: userId, status: "OPEN", dueAt: { gte: today } },
          include: { schedule: true },
          orderBy: { dueAt: "asc" },
          take: 20,
        }),
        prisma.reminder.findMany({
          where: { clerkUserId: userId, status: "OPEN", dueAt: { lt: today } },
          include: { schedule: true },
          orderBy: { dueAt: "asc" },
          take: 20,
        }),
        prisma.reminder.findMany({
          where: { clerkUserId: userId, status: "COMPLETED" },
          include: { schedule: true },
          orderBy: { completedAt: "desc" },
          take: 20,
        }),
        prisma.reminder.count({
          where: { clerkUserId: userId, status: "OPEN" },
        }),
        prisma.reminder.count({
          where: { clerkUserId: userId, status: "OPEN", dueAt: { lt: today } },
        }),
        prisma.reminder.count({
          where: { clerkUserId: userId, status: "COMPLETED" },
        }),
      ]);

    return jsonOk({
      stats: {
        openCount,
        overdueCount,
        completedCount,
        total: openCount + completedCount,
      },
      upcoming,
      overdue,
      completed,
    });
  } catch (err) {
    return prismaErrorResponse(err) ?? jsonServerError();
  }
}


