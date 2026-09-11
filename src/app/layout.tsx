import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chaba Inn — จองตรงถูกกว่า พาสัตว์เลี้ยงมาได้ทุกที่",
  description:
    "จองตรงกับ Chaba Group ราคาดีที่สุด ไม่มีค่าธรรมเนียมตัวกลาง รับสัตว์เลี้ยงฟรีทุกห้อง ทุกสาขา",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
