import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guardBranchEdit } from "@/lib/apiGuard";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const guardError = await guardBranchEdit(params.id);
  if (guardError) return guardError;

  const body = await req.json();
  const data: Record<string, unknown> = {};
  for (const key of ["policyExtra", "lineOaUrl", "phone", "facebookUrl"] as const) {
    if (key in body) data[key] = body[key];
  }
  const branch = await prisma.branch.update({ where: { id: params.id }, data });
  return NextResponse.json({ branch });
}
