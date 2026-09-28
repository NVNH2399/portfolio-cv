import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Tu Prisma 7, PrismaClient bat buoc phai nhan 1 "driver adapter" de biet
// cach ket noi DB (khong con doc url truc tiep tu schema.prisma nua).
// PrismaPg dung driver `pg` chuan de noi toi Postgres (Neon dung duoc luon).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
