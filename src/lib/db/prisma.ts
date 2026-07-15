import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};
let prismaClient: PrismaClient | undefined;

function getPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Missing DATABASE_URL. Set this variable in the current environment before using Prisma.",
    );
  }

  if (prismaClient) {
    return prismaClient;
  }

  if (globalForPrisma.prisma) {
    prismaClient = globalForPrisma.prisma;
    return prismaClient;
  }

  if (!prismaClient) {
    const client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

    prismaClient = client;

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }

    return client;
  }

  return prismaClient;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();

    return Reflect.get(client, property, client);
  },
});
