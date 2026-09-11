"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/rooms");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
    }
  }

  return (
    <div className="login-wrap">
      <h1 style={{ fontSize: "1.2rem", marginBottom: 4 }}>Chaba Manager</h1>
      <div style={{ fontSize: ".8rem", color: "var(--ink-soft)", marginBottom: 18 }}>
        เข้าสู่ระบบหลังบ้าน Chaba Group
      </div>
      {error && <div className="error-note">{error}</div>}
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <span className="field-lbl">ชื่อผู้ใช้</span>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 18 }}>
          <span className="field-lbl">รหัสผ่าน</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
        </button>
      </form>
    </div>
  );
}
