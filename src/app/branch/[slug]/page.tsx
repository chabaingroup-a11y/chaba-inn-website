import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { gradientFor } from "@/lib/gradients";
import Gallery from "./Gallery";

export const dynamic = "force-dynamic";

export default async function BranchPage({ params }: { params: { slug: string } }) {
  const branch = await prisma.branch.findUnique({
    where: { id: params.slug },
    include: {
      rooms: { where: { active: true }, orderBy: { sortOrder: "asc" }, include: { photos: true } },
      promotions: { where: { active: true } },
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!branch) return notFound();

  return (
    <>
      <header className="site">
        <div className="wrap nav">
          <div className="logo">
            <span className="mark">🐾</span>Chaba Group
          </div>
        </div>
      </header>
      <main className="wrap" style={{ paddingBottom: 60 }}>
        <Link href="/" style={{ fontSize: ".85rem", color: "var(--brand-ink)", fontWeight: 600 }}>
          ‹ กลับไปหน้าค้นหา
        </Link>
        <h1 style={{ fontSize: "1.35rem", marginTop: 10 }}>{branch.name}</h1>
        <div style={{ fontSize: ".85rem", color: "var(--ink-soft)", marginTop: 4 }}>
          📍 {branch.location} {branch.distanceNote ? `· ${branch.distanceNote}` : ""}
        </div>
        {branch.photos.length > 0 ? (
          <div className="p-hero" style={{ padding: 0, overflow: "hidden" }}>
            <img
              src={branch.photos[0].url}
              alt={branch.photos[0].altText || branch.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ) : (
          <div className="p-hero" style={{ background: `linear-gradient(${gradientFor(branch.id)})` }}>
            🏨
          </div>
        )}

        {branch.photos.length > 0 && (
          <div style={{ margin: "14px 0 4px" }}>
            <Gallery
              photos={branch.photos.map((p) => ({ id: p.id, url: p.url, altText: p.altText }))}
              branchName={branch.name}
            />
          </div>
        )}

        {branch.promotions.length > 0 && (
          <div className="promo-strip">
            {branch.promotions.map((p) => (
              <span key={p.id} className="promo-chip">
                🎉 {p.title} -{p.discountPct}%
              </span>
            ))}
          </div>
        )}

        <div className="pet-box">
          <b>🐾 นโยบายสัตว์เลี้ยง</b>
          <ul>
            <li>ไม่มีค่าใช้จ่าย · ไม่จำกัดน้ำหนัก · ไม่จำกัดจำนวน · ไม่จำกัดพื้นที่</li>
            {branch.policyExtra && <li>{branch.policyExtra}</li>}
            <li style={{ fontWeight: 700, color: "var(--warn)" }}>
              ⚠️ ห้ามทิ้งสัตว์เลี้ยงไว้ในห้องพักตามลำพังโดยเด็ดขาด
            </li>
          </ul>
        </div>

        <h2 style={{ fontSize: "1.05rem", margin: "20px 4px 10px" }}>ห้องพักที่เปิดขาย</h2>
        {branch.rooms.length === 0 && <div className="empty-note">ยังไม่มีห้องพักเปิดขายในสาขานี้</div>}
        {branch.rooms.map((r) => (
          <div key={r.id} className="room-card">
            <div>
              <div className="rn">{r.name}</div>
              <div className="rm">
                {r.bedType} · เข้าพักได้ {r.capacity} ท่าน{r.sizeSqm ? ` · ${r.sizeSqm} ตร.ม.` : ""}
              </div>
              <div className="room-price">
                ฿{r.price.toLocaleString()}
                <span style={{ fontSize: ".7rem", color: "var(--ink-soft)", fontWeight: 400 }}> /คืน</span>
              </div>
            </div>
            {branch.lineOaUrl ? (
              <a className="btn btn-amber" href={branch.lineOaUrl} target="_blank" rel="noopener noreferrer">
                กดจอง
              </a>
            ) : (
              <span className="btn" style={{ opacity: 0.6, cursor: "not-allowed" }}>
                ยังไม่ระบุ LINE OA
              </span>
            )}
          </div>
        ))}
      </main>
    </>
  );
}
