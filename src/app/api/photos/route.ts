import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { guardBranchEdit } from "@/lib/apiGuard";

// หมายเหตุสำคัญ: โค้ดนี้เก็บไฟล์รูปไว้ใต้ /public/uploads บนดิสก์ของเซิร์ฟเวอร์
// ใช้งานได้ปกติเมื่อ deploy บนเซิร์ฟเวอร์ที่มีดิสก์ถาวร (VPS, Docker, ฯลฯ)
// แต่ "ใช้ไม่ได้" บนแพลตฟอร์ม serverless ที่ไฟล์ระบบชั่วคราว (เช่น Vercel) —
// กรณีนั้นต้องเปลี่ยนไปเก็บที่ Amazon S3 / Cloudinary ฯลฯ แทน (ดู README.md)

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const roomId = form.get("roomId");
  const file = form.get("file");

  if (typeof roomId !== "string" || !(file instanceof File)) {
    return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) return NextResponse.json({ error: "ไม่พบห้องนี้" }, { status: 404 });
  const guardError = await guardBranchEdit(room.branchId);
  if (guardError) return guardError;

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", room.branchId, room.id);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const url = `/uploads/${room.branchId}/${room.id}/${filename}`;
  const count = await prisma.photo.count({ where: { roomId: room.id } });
  const photo = await prisma.photo.create({
    data: { roomId: room.id, url, sortOrder: count },
  });
  return NextResponse.json({ photo });
}
