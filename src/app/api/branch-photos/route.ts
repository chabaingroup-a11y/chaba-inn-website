import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { guardBranchEdit } from "@/lib/apiGuard";

// รูปภาพแกลเลอรีของสาขา (บรรยากาศ/ภาพรวมโรงแรม) — เก็บไฟล์ใต้ /public/uploads เหมือนรูปห้องพัก
// หมายเหตุ: ใช้ไม่ได้บนแพลตฟอร์ม serverless ที่ไฟล์ระบบชั่วคราว (ดู README.md)

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const branchId = form.get("branchId");
  const file = form.get("file");

  if (typeof branchId !== "string" || !(file instanceof File)) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) return NextResponse.json({ error: "ไม่พบสาขานี้" }, { status: 404 });
  const guardError = await guardBranchEdit(branchId);
  if (guardError) return guardError;

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", branchId, "gallery");
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const url = `/uploads/${branchId}/gallery/${filename}`;
  const count = await prisma.branchPhoto.count({ where: { branchId } });
  const photo = await prisma.branchPhoto.create({
    data: { branchId, url, sortOrder: count },
  });
  return NextResponse.json({ photo });
}
