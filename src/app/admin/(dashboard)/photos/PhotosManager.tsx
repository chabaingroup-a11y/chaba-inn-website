"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Room = { id: string; name: string; photos: { id: string; url: string }[] };

export default function PhotosManager({ rooms }: { rooms: Room[] }) {
  const router = useRouter();
  const [activeRoomId, setActiveRoomId] = useState(rooms[0]?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!activeRoomId || files.length === 0) return;
    setUploading(true);
    for (const file of files) {
      const form = new FormData();
      form.append("roomId", activeRoomId);
      form.append("file", file);
      await fetch("/api/photos", { method: "POST", body: form });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  async function deletePhoto(id: string) {
    if (!confirm("ลบรูปภาพนี้ใช่หรือไม่?")) return;
    await fetch(`/api/photos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (rooms.length === 0) {
    return <div className="empty-note">ยังไม่มีห้องพักในสาขานี้ — เพิ่มห้องก่อนที่เมนู "ห้องพัก & ราคา"</div>;
  }

  return (
    <div className="panel">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {rooms.map((r) => (
          <button
            key={r.id}
            className="btn"
            style={activeRoomId === r.id ? { background: "var(--brand)", color: "#fff", borderColor: "var(--brand)" } : undefined}
            onClick={() => setActiveRoomId(r.id)}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div className="photo-grid">
        {activeRoom?.photos.map((p, i) => (
          <div key={p.id} className="photo-tile">
            <img src={p.url} alt={`${activeRoom.name} รูปที่ ${i + 1}`} />
            <button className="del" onClick={() => deletePhoto(p.id)}>
              ×
            </button>
          </div>
        ))}
        <label
          className="photo-tile"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "2px dashed var(--line)",
            color: "var(--ink-soft)",
            fontSize: "1.4rem",
          }}
        >
          {uploading ? "…" : "＋"}
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={onFilesSelected} style={{ display: "none" }} />
        </label>
      </div>
    </div>
  );
}
