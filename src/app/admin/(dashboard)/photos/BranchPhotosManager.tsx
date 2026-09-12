"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Photo = { id: string; url: string };

export default function BranchPhotosManager({ branchId, photos }: { branchId: string; photos: Photo[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    for (const file of files) {
      const form = new FormData();
      form.append("branchId", branchId);
      form.append("file", file);
      await fetch("/api/branch-photos", { method: "POST", body: form });
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  async function deletePhoto(id: string) {
    if (!confirm("ลบรูปภาพนี้ใช่หรือไม่?")) return;
    await fetch(`/api/branch-photos/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="panel">
      <div className="photo-grid">
        {photos.map((p, i) => (
          <div key={p.id} className="photo-tile">
            <img src={p.url} alt={`รูปสาขา ${i + 1}`} />
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
      {photos.length === 0 && (
        <div className="empty-note" style={{ paddingTop: 0 }}>
          ยังไม่มีรูปภาพสาขา — กด ＋ เพื่อเพิ่มได้เลย (เลือกได้หลายรูปพร้อมกัน)
        </div>
      )}
    </div>
  );
}
