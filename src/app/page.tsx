import Link from "next/link";
import { prisma } from "@/lib/db";
import { gradientFor } from "@/lib/gradients";

export const dynamic = "force-dynamic"; // ข้อมูลห้อง/ราคาที่แก้ในหลังบ้านต้องเห็นผลทันทีที่หน้านี้

export default async function HomePage() {
  const branches = await prisma.branch.findMany({
    where: { active: true },
    include: {
      rooms: { where: { active: true } },
      photos: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { id: "asc" },
  });

  return (
    <>
      <div className="topbar">
        <div className="row">
          <span>🐾 ทุกสาขารับสัตว์เลี้ยงฟรี ไม่จำกัดน้ำหนัก/จำนวน</span>
          <span>ช่วยเหลือ · ติดต่อเรา</span>
        </div>
      </div>
      <header className="site">
        <div className="wrap nav">
          <div className="logo">
            <span className="mark">🐾</span>Chaba Group
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <span className="hero-eyebrow">✅ จองตรง ไม่ผ่านตัวกลาง</span>
          <h1>
            พักผ่อนพร้อมเพื่อนขนฟู <span className="accent">ที่ Chaba Group</span>
          </h1>
          <p className="sub">
            5 สาขาทั่วไทย รับสัตว์เลี้ยงทุกห้อง ทุกสาขา 100% ไม่มีค่าใช้จ่ายเพิ่ม จองตรงกับเราราคาดีกว่า
            ไม่มีค่าธรรมเนียมตัวกลาง ยืนยันการจองรวดเร็วผ่าน LINE
          </p>
          <div className="trust-row">
            <span className="trust-chip">💚 จองตรงถูกกว่า OTA</span>
            <span className="trust-chip">🚫 ไม่มีค่าธรรมเนียมตัวกลาง</span>
            <span className="trust-chip">⚡ ยืนยันไว ผ่าน LINE</span>
            <span className="trust-chip">🐾 Pet Friendly 100%</span>
          </div>
        </div>
      </section>

      <main className="wrap" style={{ paddingBottom: 60 }}>
        <h1 style={{ fontSize: "1.4rem", marginTop: 20 }}>
          ค้นหาที่พักของ Chaba Group — {branches.length} สาขา
        </h1>
        <div className="pet-strip">🐾 ไม่มีค่าใช้จ่ายสำหรับสัตว์เลี้ยง ไม่จำกัดน้ำหนัก ไม่จำกัดจำนวน ไม่จำกัดพื้นที่</div>

        <div>
          {branches.map((b) => {
            const minPrice = b.rooms.length ? Math.min(...b.rooms.map((r) => r.price)) : null;
            return (
              <Link key={b.id} href={`/branch/${b.id}`} className="branch-card" style={{ display: "flex" }}>
                {b.photos[0] ? (
                  <div className="ph" style={{ padding: 0, overflow: "hidden" }}>
                    <img
                      src={b.photos[0].url}
                      alt={b.photos[0].altText || b.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                ) : (
                  <div className="ph" style={{ background: `linear-gradient(${gradientFor(b.id)})` }}>
                    🏨
                  </div>
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="name">{b.name}</div>
                  <div className="stars">{"★".repeat(b.stars)}</div>
                  <div className="loc">📍 {b.location}</div>
                  <div className="bottom">
                    <span className="score-pill">{b.reviewScore.toFixed(1)}</span>
                    <span className="reviews-note">รีวิว {b.reviewCount} รายการ</span>
                    <div className="price-tag">
                      <div className="n">{minPrice !== null ? `฿${minPrice.toLocaleString()}` : "-"}</div>
                      <div className="u">ต่อคืน</div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
          {branches.length === 0 && (
            <div className="empty-note">
              ยังไม่มีข้อมูลสาขา — เข้าสู่ระบบหลังบ้านที่ <Link href="/admin/login">/admin/login</Link> เพื่อเริ่มตั้งค่า
            </div>
          )}
        </div>
      </main>
    </>
  );
}
