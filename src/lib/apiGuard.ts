import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canEditBranch } from "@/lib/branchAccess";

/** ตรวจสิทธิ์แก้ไขข้อมูลของสาขา branchId สำหรับ API route หนึ่งครั้ง
 *  คืนค่า null เมื่อผ่าน หรือคืน NextResponse ที่ควร return ทันทีเมื่อไม่ผ่าน */
export async function guardBranchEdit(branchId: string) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }
  const allowed = await canEditBranch(session, branchId);
  if (!allowed) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์แก้ไขข้อมูลสาขานี้" }, { status: 403 });
  }
  return null;
}
