import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { guardBranchEdit } from "@/lib/apiGuard";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const photo = await prisma.branchPhoto.findUnique({ where: { id: params.id } });
  if (!photo) return NextResponse.json({ error: "ไม่พบรูปภาพนี้" }, { status: 404 });
  const guardError = await guardBranchEdit(photo.branchId);
  if (guardError) return guardError;

  await prisma.branchPhoto.delete({ where: { id: params.id } });
  try {
    await unlink(path.join(process.cwd(), "public", photo.url));
  } catch {
    // ไฟล์อาจถูกลบไปแล้วหรือไม่พบ — ไม่เป็นไร ข้อมูลในฐานข้อมูลลบสำเร็จแล้วเป็นหลัก
  }
  return NextResponse.json({ ok: true });
}
