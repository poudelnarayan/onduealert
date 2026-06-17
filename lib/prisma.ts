import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __onduealert_prisma_v2: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    // Fail fast with a clear message (common local setup issue).
    throw new Error(
      "DATABASE_URL is not set. Create a .env file in the project root (see env.example) and set DATABASE_URL to your Postgres connection string."
    );
  }
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

let client: PrismaClient | undefined;

function getPrismaClient(): PrismaClient {
  if (client) return client;
  client = globalThis.__onduealert_prisma_v2 ?? createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalThis.__onduealert_prisma_v2 = client;
  }
  return client;
}

// Lazily instantiate Prisma on first use instead of at module import.
// `next build` evaluates every route module during "Collecting page data";
// eager instantiation used to run `new PrismaClient()` (and throw on a missing
// DATABASE_URL) in that phase, breaking the build. This Proxy keeps the
// `prisma` import API identical while deferring creation to the first query.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const c = getPrismaClient();
    const value = Reflect.get(c, prop);
    return typeof value === "function" ? value.bind(c) : value;
  },
});
