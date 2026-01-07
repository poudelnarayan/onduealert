import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __onduealert_prisma_v2: PrismaClient | undefined;
}

function assertDatabaseUrlConfigured() {
  if (!process.env.DATABASE_URL) {
    // Fail fast with a clear message (common local setup issue).
    throw new Error(
      "DATABASE_URL is not set. Create a .env file in the project root (see env.example) and set DATABASE_URL to your Postgres connection string."
    );
  }
}

export const prisma: PrismaClient =
  globalThis.__onduealert_prisma_v2 ??
  (() => {
    assertDatabaseUrlConfigured();
    return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  })();

if (process.env.NODE_ENV !== "production") globalThis.__onduealert_prisma_v2 = prisma;


