import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardBranchEdit } from "@/lib/apiGuard";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const promo = await prisma.promotion.findUnique({ where: { id: params.id } });
  if (!promo) return NextResponse.json({ error: "ไม่พบโปรโมชันนี้" }, { status: 404 });
  const guardError = await guardBranchEdit(promo.branchId);
  if (guardError) return guardError;

  await prisma.promotion.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
