export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonNotFound, jsonServerError, jsonUnauthorized } from "@/lib/http";
import { prismaErrorResponse } from "@/lib/prisma-error";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { userId } = await auth();
  if (!userId) return jsonUnauthorized();
  const { id } = await params;

  try {
    const attachment = await prisma.completionAttachment.findFirst({
      where: {
        id,
        completion: { clerkUserId: userId },
      },
      select: {
        filename: true,
        mimeType: true,
        data: true,
        storageBucket: true,
        storagePath: true,
      },
    });
    if (!attachment) return jsonNotFound();

    // Legacy: DB-stored blob.
    if (attachment.data) {
      return new NextResponse(attachment.data, {
        status: 200,
        headers: {
          "Content-Type": attachment.mimeType || "application/octet-stream",
          "Content-Disposition": `attachment; filename="${attachment.filename.replaceAll(
            '"',
            ""
          )}"`,
        },
      });
    }

    if (attachment.storageBucket && attachment.storagePath) {
      const sb = supabaseAdmin();
      const signed = await sb.storage
        .from(attachment.storageBucket)
        .createSignedUrl(attachment.storagePath, 60);
      if (signed.error || !signed.data?.signedUrl) return jsonNotFound();
      return NextResponse.redirect(signed.data.signedUrl, { status: 302 });
    }

    return jsonNotFound();
  } catch (err) {
    return prismaErrorResponse(err) ?? jsonServerError();
  }
}


