import { prisma } from "@/lib/db";
import BranchSwitcher from "../BranchSwitcher";
import PolicyForm from "./PolicyForm";

export const dynamic = "force-dynamic";

export default async function AdminPolicyPage({ searchParams }: { searchParams: { branch?: string } }) {
  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });
  const currentId = searchParams.branch && branches.some((b) => b.id === searchParams.branch)
    ? searchParams.branch
    : branches[0]?.id;
  const branch = currentId ? await prisma.branch.findUnique({ where: { id: currentId } }) : null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "1.2rem" }}>นโยบายสัตว์เลี้ยง</h1>
        {currentId && <BranchSwitcher branches={branches} current={currentId} />}
      </div>

      <div className="policy-lock">
        <b>🔒 นโยบายหลักของ Chaba Group (ล็อกไว้ทุกสาขา แก้ไม่ได้จากหน้านี้)</b>
        <ul>
          <li>✅ ไม่มีค่าใช้จ่าย — รับสัตว์เลี้ยงฟรี ไม่มีค่าธรรมเนียมใดๆ</li>
          <li>✅ ไม่จำกัดน้ำหนัก — รับสัตว์เลี้ยงทุกขนาด</li>
          <li>✅ ไม่จำกัดจำนวน — ไม่จำกัดจำนวนตัวต่อห้อง</li>
          <li>✅ ไม่จำกัดพื้นที่ — พาสัตว์เลี้ยงเข้าได้ทุกพื้นที่ภายในโรงแรม</li>
        </ul>
        <div className="warn-box">⚠️ ห้ามทิ้งสัตว์เลี้ยงไว้ในห้องพักตามลำพังโดยเด็ดขาด — แสดงบนหน้าบ้านทุกจุดที่เกี่ยวข้องกับสัตว์เลี้ยงเสมอ</div>
      </div>

      {branch && <PolicyForm branchId={branch.id} initialValue={branch.policyExtra} />}
    </div>
  );
}
