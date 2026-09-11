import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardBranchEdit } from "@/lib/apiGuard";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { branchId, name, bedType, capacity, price, sizeSqm } = body;
  const guardError = await guardBranchEdit(branchId);
  if (guardError) return guardError;

  if (!branchId || !name || !bedType || !price) {
    return NextResponse.json({ error: "กรอกข้อมูลไม่ครบ" }, { status: 400 });
  }

  const count = await prisma.room.count({ where: { branchId } });
  const room = await prisma.room.create({
    data: {
      branchId,
      name,
      bedType,
      capacity: Number(capacity) || 2,
      price: Number(price),
      sizeSqm: sizeSqm ? Number(sizeSqm) : null,
      sortOrder: count,
    },
  });
  return NextResponse.json({ room });
}
