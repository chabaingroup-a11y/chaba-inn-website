import { prisma } from "@/lib/db";
import BranchSwitcher from "../BranchSwitcher";
import PromotionsManager from "./PromotionsManager";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage({ searchParams }: { searchParams: { branch?: string } }) {
  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });
  const currentId = searchParams.branch && branches.some((b) => b.id === searchParams.branch)
    ? searchParams.branch
    : branches[0]?.id;

  const promos = currentId
    ? await prisma.promotion.findMany({ where: { branchId: currentId }, orderBy: { createdAt: "desc" } })
    : [];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "1.2rem" }}>โปรโมชัน</h1>
        {currentId && <BranchSwitcher branches={branches} current={currentId} />}
      </div>
      {currentId ? (
        <PromotionsManager branchId={currentId} initialPromos={promos.map((p) => ({ id: p.id, title: p.title, discountPct: p.discountPct }))} />
      ) : (
        <div className="empty-note">ยังไม่มีสาขาในระบบ</div>
      )}
    </div>
  );
}
