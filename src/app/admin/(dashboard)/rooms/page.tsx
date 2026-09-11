import { prisma } from "@/lib/db";
import BranchSwitcher from "../BranchSwitcher";
import RoomsManager from "./RoomsManager";

export const dynamic = "force-dynamic";

export default async function AdminRoomsPage({ searchParams }: { searchParams: { branch?: string } }) {
  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });
  const currentId = searchParams.branch && branches.some((b) => b.id === searchParams.branch)
    ? searchParams.branch
    : branches[0]?.id;

  const rooms = currentId
    ? await prisma.room.findMany({ where: { branchId: currentId }, orderBy: { sortOrder: "asc" } })
    : [];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "1.2rem" }}>ห้องพัก, ประเภทเตียง & ราคา</h1>
        {currentId && <BranchSwitcher branches={branches} current={currentId} />}
      </div>
      {currentId ? (
        <RoomsManager branchId={currentId} initialRooms={rooms} />
      ) : (
        <div className="empty-note">ยังไม่มีสาขาในระบบ</div>
      )}
    </div>
  );
}
