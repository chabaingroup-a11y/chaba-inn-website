"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Room = {
  id: string;
  name: string;
  bedType: string;
  capacity: number;
  price: number;
  active: boolean;
};

const BED_TYPES = ["เตียงคิงไซส์ 1 เตียง", "เตียงควีนไซส์ 1 เตียง", "เตียงคู่ 2 เตียง", "เตียงคิงไซส์ 1 + โซฟาเบด 1"];

export default function RoomsManager({ branchId, initialRooms }: { branchId: string; initialRooms: Room[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [bedType, setBedType] = useState(BED_TYPES[0]);
  const [capacity, setCapacity] = useState(2);
  const [price, setPrice] = useState(1200);
  const [busy, setBusy] = useState(false);

  async function addRoom(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branchId, name, bedType, capacity, price }),
    });
    setBusy(false);
    setName("");
    setShowForm(false);
    router.refresh();
  }

  async function toggleActive(room: Room) {
    await fetch(`/api/rooms/${room.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !room.active }),
    });
    router.refresh();
  }

  async function deleteRoom(id: string) {
    if (!confirm("ลบห้องนี้ใช่หรือไม่? การลบจะไม่กระทบการจองที่มีอยู่แล้ว")) return;
    await fetch(`/api/rooms/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="panel">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>ห้องพักของสาขานี้</h3>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          + เพิ่มห้องใหม่
        </button>
      </div>

      <table className="grid">
        <thead>
          <tr>
            <th>ชื่อห้อง</th>
            <th>เตียง</th>
            <th>ผู้เข้าพัก</th>
            <th>ราคา/คืน</th>
            <th>สถานะ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {initialRooms.map((r) => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.bedType}</td>
              <td>{r.capacity}</td>
              <td>฿{r.price.toLocaleString()}</td>
              <td>
                <span className={`pill ${r.active ? "ok" : "off"}`}>{r.active ? "เปิดขาย" : "ปิดขาย"}</span>
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button className="btn" onClick={() => toggleActive(r)}>
                  {r.active ? "ปิด" : "เปิด"}
                </button>{" "}
                <button className="btn btn-danger" onClick={() => deleteRoom(r.id)}>
                  ลบ
                </button>
              </td>
            </tr>
          ))}
          {initialRooms.length === 0 && (
            <tr>
              <td colSpan={6} className="empty-note">
                ยังไม่มีห้องพักในสาขานี้
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <form onSubmit={addRoom} style={{ marginTop: 14, borderTop: "1px dashed var(--line)", paddingTop: 14 }}>
          <div className="form-grid">
            <div>
              <span className="field-lbl">ชื่อห้อง</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น ดีลักซ์ทวิน" required />
            </div>
            <div>
              <span className="field-lbl">ประเภทเตียง</span>
              <select value={bedType} onChange={(e) => setBedType(e.target.value)}>
                {BED_TYPES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="field-lbl">ผู้เข้าพักสูงสุด</span>
              <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
            </div>
            <div>
              <span className="field-lbl">ราคา (บาท/คืน)</span>
              <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
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
