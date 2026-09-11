"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PolicyForm({ branchId, initialValue }: { branchId: string; initialValue: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [saved, setSaved] = useState(false);

  async function save() {
    await fetch(`/api/branches/${branchId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ policyExtra: value }),
    });
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className="panel">
      <h3>กฎระเบียบเพิ่มเติมของสาขานี้ (แก้ไขได้อิสระ)</h3>
      <textarea value={value} onChange={(e) => setValue(e.target.value)} placeholder="เช่น ต้องใส่สายจูงในพื้นที่ส่วนกลาง" />
      <div style={{ marginTop: 8 }}>
        <button className="btn btn-primary" onClick={save}>
          บันทึก
        </button>
        {saved && <span style={{ marginLeft: 10, color: "var(--ok)", fontSize: ".82rem" }}>บันทึกแล้ว</span>}
      </div>
    </div>
  );
}
