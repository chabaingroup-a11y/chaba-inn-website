import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.userId) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-shell">
      <nav className="admin-sidebar">
        <div className="brand">
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: ".9rem",
            }}
          >
            🐾
          </span>
          Chaba Manager
        </div>
        <Link className="admin-navlink" href="/admin/rooms">
          🛏️ ห้องพัก & ราคา
        </Link>
        <Link className="admin-navlink" href="/admin/promotions">
          🎉 โปรโมชัน
        </Link>
        <Link className="admin-navlink" href="/admin/photos">
          🖼️ รูปภาพห้องพัก
        </Link>
        <Link className="admin-navlink" href="/admin/policy">
          🐾 นโยบายสัตว์เลี้ยง
        </Link>
        <Link className="admin-navlink" href="/admin/settings">
          💬 ตั้งค่าสาขา & LINE OA
        </Link>
        <div style={{ marginTop: 16, padding: "10px 12px", fontSize: ".76rem", color: "#8FB3A4" }}>
          เข้าสู่ระบบในนาม {session.name} · {session.role === "ADMIN" ? "ผู้ดูแลหลัก" : "ผู้ช่วย"}
        </div>
        <LogoutButton />
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}
