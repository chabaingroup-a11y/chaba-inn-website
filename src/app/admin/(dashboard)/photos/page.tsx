import { prisma } from "@/lib/db";
import BranchSwitcher from "../BranchSwitcher";
import PhotosManager from "./PhotosManager";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage({ searchParams }: { searchParams: { branch?: string } }) {
  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });
  const currentId = searchParams.branch && branches.some((b) => b.id === searchParams.branch)
    ? searchParams.branch
    : branches[0]?.id;

  const rooms = currentId
    ? await prisma.room.findMany({
        where: { branchId: currentId },
        orderBy: { sortOrder: "asc" },
        include: { photos: { orderBy: { sortOrder: "asc" } } },
      })
    : [];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "1.2rem" }}>รูปภาพห้องพัก</h1>
        {currentId && <BranchSwitcher branches={branches} current={currentId} />}
      </div>
      {currentId ? (
        <PhotosManager
          rooms={rooms.map((r) => ({
            id: r.id,
            name: r.name,
            photos: r.photos.map((p) => ({ id: p.id, url: p.url })),
          }))}
        />
      ) : (
        <div className="empty-note">ยังไม่มีสาขาในระบบ</div>
      )}
    </div>
  );
}
