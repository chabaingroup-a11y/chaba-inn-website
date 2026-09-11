import { prisma } from "@/lib/db";
import type { SessionData } from "@/lib/auth";

/** ตรวจว่า session นี้มีสิทธิ์แก้ไขข้อมูลของสาขา branchId หรือไม่
 *  ผู้ดูแลหลัก (ADMIN) แก้ได้ทุกสาขา, ผู้ช่วย (STAFF) แก้ได้เฉพาะสาขาที่ถูกมอบหมาย */
export async function canEditBranch(session: SessionData, branchId: string) {
  if (!session.userId) return false;
  if (session.role === "ADMIN") return true;
  const link = await prisma.staffBranch.findUnique({
    where: { userId_branchId: { userId: session.userId, branchId } },
  });
  return !!link;
}
