import { prisma } from "@/lib/db";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const branches = await prisma.branch.findMany({ orderBy: { id: "asc" } });

  return (
    <div>
      <h1 style={{ fontSize: "1.2rem", marginBottom: 4 }}>ตั้งค่าสาขา & ลิงก์ LINE OA</h1>
      <div style={{ fontSize: ".84rem", color: "var(--ink-soft)", marginBottom: 18 }}>
        เมื่อลูกค้ากด &quot;กดจอง&quot; ที่หน้าบ้าน ระบบจะเปิดลิงก์ LINE OA ของสาขานั้นให้ทันที แทนขั้นตอนชำระเงินออนไลน์
      </div>
      <SettingsForm
        branches={branches.map((b) => ({
          id: b.id,
          name: b.name,
          lineOaUrl: b.lineOaUrl || "",
          phone: b.phone || "",
          facebookUrl: b.facebookUrl || "",
        }))}
      />
    </div>
  );
}
