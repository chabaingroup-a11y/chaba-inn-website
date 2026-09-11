// สีไล่ระดับสำหรับใช้แทนภาพตัวอย่าง เมื่อห้อง/สาขายังไม่มีรูปจริงอัปโหลด
const PALETTE = [
  "135deg,#0E5C49,#3FA483",
  "135deg,#C97A1E,#0E5C49",
  "135deg,#4B5E58,#0E5C49",
  "135deg,#1E7A5B,#4B5E58",
  "135deg,#0A4A3A,#C97A1E",
];

export function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}
