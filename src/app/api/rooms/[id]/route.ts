import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardBranchEdit } from "@/lib/apiGuard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const room = await prisma.room.findUnique({ where: { id: params.id } });
  if (!room) return NextResponse.json({ error: "ไม่พบห้องนี้" }, { status: 404 });
  const guardError = await guardBranchEdit(room.branchId);
  if (guardError) return guardError;

  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const key of ["name", "bedType", "capacity", "price", "sizeSqm", "active"] as const) {
    if (key in body) data[key] = body[key];
  }
  const updated = await prisma.room.update({ where: { id: params.id }, data });
  return NextResponse.json({ room: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const room = await prisma.room.findUnique({ where: { id: params.id } });
  if (!room) return NextResponse.json({ error: "ไม่พบห้องนี้" }, { status: 404 });
  const guardError = await guardBranchEdit(room.branchId);
  if (guardError) return guardError;

  await prisma.room.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
