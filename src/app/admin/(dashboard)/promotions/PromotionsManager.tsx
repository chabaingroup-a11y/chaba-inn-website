"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Promo = { id: string; title: string; discountPct: number };

export default function PromotionsManager({ branchId, initialPromos }: { branchId: string; initialPromos: Promo[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [pct, setPct] = useState(10);
  const [busy, setBusy] = useState(false);

  async function addPromo(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branchId, title, discountPct: pct }),
    });
    setBusy(false);
    setTitle("");
    setShowForm(false);
    router.refresh();
  }

  async function deletePromo(id: string) {
    if (!confirm("ลบโปรโมชันนี้ใช่หรือไม่?")) return;
    await fetch(`/api/promotions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>โปรโมชันของสาขานี้</h3>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          + เพิ่มโปรโมชันใหม่
        </button>
      </div>

      {initialPromos.length === 0 && <div className="empty-note">ยังไม่มีโปรโมชันสำหรับสาขานี้</div>}
      {initialPromos.map((p) => (
        <div
          key={p.id}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--line)" }}
        >
          <span>
            {p.title} — ลด {p.discountPct}%
          </span>
          <button className="btn btn-danger" onClick={() => deletePromo(p.id)}>
            ลบ
          </button>
        </div>
      ))}

      {showForm && (
        <form onSubmit={addPromo} style={{ marginTop: 14, borderTop: "1px dashed var(--line)", paddingTop: 14 }}>
          <div className="form-grid">
            <div>
              <span className="field-lbl">ชื่อโปรโมชัน</span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="เช่น จองล่วงหน้า 30 วัน" required />
            </div>
            <div>
              <span className="field-lbl">ส่วนลด (%)</span>
              <input type="number" min={1} max={90} value={pct} onChange={(e) => setPct(Number(e.target.value))} />
            </div>
          </div>
          <button className="btn btn-primary" disabled={busy}>
            บันทึก
          </button>{" "}
          <button type="button" className="btn" onClick={() => setShowForm(false)}>
            ยกเลิก
          </button>
        </form>
      )}
    </div>
  );
}
