import { PrismaClient } from "@prisma/client";

// ป้องกันการสร้าง PrismaClient ซ้ำหลายตัวตอน hot-reload ใน dev mode
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
