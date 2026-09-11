"use client";
import { useRouter, usePathname } from "next/navigation";

type Branch = { id: string; name: string };

export default function BranchSwitcher({ branches, current }: { branches: Branch[]; current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <select
      value={current}
      onChange={(e) => router.push(`${pathname}?branch=${e.target.value}`)}
      style={{ maxWidth: 260, fontWeight: 700 }}
    >
      {branches.map((b) => (
        <option key={b.id} value={b.id}>
          {b.name}
        </option>
      ))}
    </select>
  );
}
