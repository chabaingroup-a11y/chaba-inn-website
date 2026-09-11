"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type BranchRow = { id: string; name: string; lineOaUrl: string; phone: string; facebookUrl: string };

export default function SettingsForm({ branches }: { branches: BranchRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(branches);
  const [savingId, setSavingId] = useState<string | null>(null);

  function update(id: string, field: keyof BranchRow, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  async function saveRow(row: BranchRow) {
    setSavingId(row.id);
    await fetch(`/api/branches/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineOaUrl: row.lineOaUrl, phone: row.phone, facebookUrl: row.facebookUrl }),
    });
    setSavingId(null);
    router.refresh();
  }

  return (
    <div className="panel">
      {rows.map((row) => (
        <div key={row.id} style={{ borderBottom: "1px solid var(--line)", padding: "14px 0" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{row.name}</div>
          <div className="form-grid">
            <div>
              <span className="field-lbl">ลิงก์ LINE OA</span>
              <input
                type="url"
                value={row.lineOaUrl}
                placeholder="https://lin.ee/xxxxxxx"
                onChange={(e) => update(row.id, "lineOaUrl", e.target.value)}
              />
              {!row.lineOaUrl && <div style={{ color: "var(--danger)", fontSize: ".76rem", marginTop: 3 }}>ยังไม่ได้ระบุ</div>}
            </div>
            <div>
              <span className="field-lbl">เบอร์โทร</span>
              <input type="text" value={row.phone} onChange={(e) => update(row.id, "phone", e.target.value)} />
            </div>
            <div>
              <span className="field-lbl">ลิงก์ Facebook</span>
              <input type="url" value={row.facebookUrl} onChange={(e) => update(row.id, "facebookUrl", e.target.value)} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => saveRow(row)} disabled={savingId === row.id}>
            {savingId === row.id ? "กำลังบันทึก…" : "บันทึกสาขานี้"}
          </button>
        </div>
      ))}
    </div>
  );
}
