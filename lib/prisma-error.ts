import { jsonServiceUnavailable } from "@/lib/http";

type PrismaKnownRequestErrorLike = {
  code?: string;
  message?: string;
};

function getPrismaCode(err: unknown): string | undefined {
  if (!err || typeof err !== "object") return undefined;
  const code = (err as PrismaKnownRequestErrorLike).code;
  return typeof code === "string" ? code : undefined;
}

/**
 * Map common Prisma startup/runtime errors to a helpful HTTP response.
 * Returns null if the error isn't recognized.
 */
export function prismaErrorResponse(err: unknown): Response | null {
  const code = getPrismaCode(err);

  // P2021: "The table `...` does not exist in the current database."
  if (code === "P2021") {
    return jsonServiceUnavailable(
      "Database schema not initialized. Run `npm run db:init` (or `npm run prisma:migrate:init`) to create tables, then restart the dev server."
    );
  }

  // Common connection/setup errors (not exhaustive).
  if (code === "P1000") {
    return jsonServiceUnavailable(
      "Database authentication failed. Check DATABASE_URL credentials."
    );
  }
  if (code === "P1001") {
    return jsonServiceUnavailable(
      "Cannot reach the database server. Check DATABASE_URL and ensure Postgres is running/accessible."
    );
  }
  if (code === "P1003") {
    return jsonServiceUnavailable(
      "Database does not exist. Create the database referenced by DATABASE_URL, then run `npm run db:init`."
    );
  }

  return null;
}


