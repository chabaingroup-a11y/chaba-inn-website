import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardBranchEdit } from "@/lib/apiGuard";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { branchId, title, discountPct } = body;
  const guardError = await guardBranchEdit(branchId);
  if (guardError) return guardError;

  if (!branchId || !title || !discountPct) {
    return NextResponse.json({ error: "กรอกข้อมูลไม่ครบ" }, { status: 400 });
  }

  const promo = await prisma.promotion.create({
    data: { branchId, title, discountPct: Number(discountPct) },
  });
  return NextResponse.json({ promo });
}
