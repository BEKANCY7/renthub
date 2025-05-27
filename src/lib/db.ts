import { PrismaClient } from "@prisma/client";

// Add proper type declaration for globalThis
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// Export prisma directly for convenience
export const prisma = db;
