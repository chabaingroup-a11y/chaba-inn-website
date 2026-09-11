"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="admin-navlink"
      style={{ width: "100%", textAlign: "left", border: "none", background: "transparent", marginTop: 6, cursor: "pointer" }}
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
    >
      🚪 ออกจากระบบ
    </button>
  );
}
