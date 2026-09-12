import { prisma } from "@/lib/db";
import BranchSwitcher from "../BranchSwitcher";
import PhotosManager from "./PhotosManager";
import BranchPhotosManager from "./BranchPhotosManager";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage({ searchParams }: { searchParams: { branch?: string } }) {
  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });
  const currentId = searchParams.branch && branches.some((b) => b.id === searchParams.branch)
    ? searchParams.branch
    : branches[0]?.id;

  const branchPhotos = currentId
    ? await prisma.branchPhoto.findMany({ where: { branchId: currentId }, orderBy: { sortOrder: "asc" } })
    : [];

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
        <h1 style={{ fontSize: "1.2rem" }}>รูปภาพ</h1>
        {currentId && <BranchSwitcher branches={branches} current={currentId} />}
      </div>
      {currentId ? (
        <>
          <h3 style={{ fontSize: ".95rem", margin: "0 0 8px 4px" }}>🖼️ แกลเลอรีภาพรวมสาขา</h3>
          <p style={{ fontSize: ".8rem", color: "var(--ink-soft)", margin: "0 4px 10px" }}>
            รูปที่เพิ่มตรงนี้จะแสดงเป็นรูปหน้าปกและแกลเลอรีให้ลูกค้ากดดูรูปขยายในหน้าสาขา — เพิ่มได้หลายรูป
          </p>
          <BranchPhotosManager
            branchId={currentId}
            photos={branchPhotos.map((p) => ({ id: p.id, url: p.url }))}
          />

          <h3 style={{ fontSize: ".95rem", margin: "26px 0 8px 4px" }}>🛏️ รูปภาพห้องพัก</h3>
          <PhotosManager
            rooms={rooms.map((r) => ({
              id: r.id,
              name: r.name,
              photos: r.photos.map((p) => ({ id: p.id, url: p.url })),
            }))}
          />
        </>
      ) : (
        <div className="empty-note">ยังไม่มีสาขาในระบบ</div>
      )}
    </div>
  );
}
