export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonNotFound, jsonOk, jsonServerError, jsonUnauthorized } from "@/lib/http";
import { computeNextDueAt } from "@/lib/reminders";
import { prismaErrorResponse } from "@/lib/prisma-error";
import { createHash } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return jsonUnauthorized();
  const { id } = await params;

  try {
    // Optional completion proof.
    let note: string | null = null;
    let file:
      | { filename: string; mimeType: string; sizeBytes: number; data: Buffer; sha256: string }
      | null = null;

    const contentType = req.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const fd = await req.formData();
      const rawNote = fd.get("note");
      if (typeof rawNote === "string") {
        const trimmed = rawNote.trim();
        note = trimmed ? trimmed.slice(0, 2000) : null;
      }

      const uploaded = fd.get("file");
      if (uploaded && uploaded instanceof File && uploaded.size > 0) {
        // Hard limit to keep DB lean. (Can be upgraded to object storage later.)
        const maxBytes = 2 * 1024 * 1024;
        if (uploaded.size > maxBytes) {
          return jsonOk(
            { error: "File too large (max 2MB)." },
            { status: 400 }
          );
        }
        const buf = Buffer.from(await uploaded.arrayBuffer());
        const sha256 = createHash("sha256").update(buf).digest("hex");
        file = {
          filename: uploaded.name.slice(0, 200),
          mimeType: uploaded.type || "application/octet-stream",
          sizeBytes: buf.byteLength,
          data: buf,
          sha256,
        };
      }
    } else if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => null);
      if (body?.note && typeof body.note === "string") {
        const trimmed = body.note.trim();
        note = trimmed ? trimmed.slice(0, 2000) : null;
      }
    }

    const reminder = await prisma.reminder.findFirst({
      where: { id, clerkUserId: userId },
      include: { schedule: true },
    });
    if (!reminder) return jsonNotFound();
    if (reminder.status === "COMPLETED") return jsonOk({ ok: true, reminder });

    const completedAt = new Date();
    const nextDueAt = computeNextDueAt({
      dueAt: reminder.dueAt,
      frequency: reminder.schedule.frequency,
      interval: reminder.schedule.interval,
      customIntervalDays: reminder.schedule.customIntervalDays,
      timeZone: reminder.schedule.timezone,
    });

    const result = await prisma.$transaction(async (tx) => {
      const completion = await tx.reminderCompletion.create({
        data: {
          clerkUserId: userId,
          reminderId: reminder.id,
          completedAt,
          note,
        },
      });

      if (file) {
        const bucket =
          process.env.SUPABASE_STORAGE_BUCKET_PROOFS ?? "proofs";
        const safeName = file.filename.replaceAll("/", "_");
        const path = `${userId}/${reminder.id}/${completion.id}/${safeName}`;
        const sb = supabaseAdmin();
        const upload = await sb.storage
          .from(bucket)
          .upload(path, file.data, {
            contentType: file.mimeType,
            upsert: false,
          });
        if (upload.error) {
          throw new Error(upload.error.message);
        }

        await tx.completionAttachment.create({
          data: {
            completionId: completion.id,
            filename: file.filename,
            mimeType: file.mimeType,
            sizeBytes: file.sizeBytes,
            sha256: file.sha256,
            storageBucket: bucket,
            storagePath: path,
          },
        });
      }

      const completed = await tx.reminder.update({
        where: { id: reminder.id },
        data: {
          status: "COMPLETED",
          completedAt,
          snoozedUntil: null,
        },
        include: { schedule: true },
      });

      if (!nextDueAt) return { completed, next: null };

      if (
        reminder.schedule.frequency === "CUSTOM" &&
        !reminder.schedule.customIntervalDays
      ) {
        // cronExpression support is intentionally deferred in MVP
        return { completed, next: null };
      }

      const next = await tx.reminder.create({
        data: {
          clerkUserId: userId,
          scheduleId: reminder.scheduleId,
          clientName: reminder.clientName,
          title: reminder.title,
          description: reminder.description,
          category: reminder.category,
          dueAt: nextDueAt,
          previousReminderId: reminder.id,
        },
        include: { schedule: true },
      });

      return { completed, next, completionId: completion.id };
    });

    return jsonOk(result);
  } catch (err) {
    return prismaErrorResponse(err) ?? jsonServerError();
  }
}


