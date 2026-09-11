import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const branches = [
    {
      id: "srinakarin",
      name: "Chaba Inn Srinakarin",
      location: "ศรีนครินทร์, กรุงเทพฯ",
      distanceNote: "3.1 กม. จากย่านใจกลาง",
      stars: 4,
      reviewScore: 8.9,
      reviewCount: 412,
      lineOaUrl: "https://lin.ee/pt0a7DN",
      phone: "02 720 6030",
      facebookUrl: "https://facebook.com/ChabaInnSrinakarin",
      policyExtra: "ต้องใส่สายจูงหรือกรงในพื้นที่ส่วนกลาง",
      rooms: [
        { name: "Standard Room", bedType: "เตียงควีนไซส์ 1 เตียง", sizeSqm: 22, capacity: 2, price: 1290 },
        { name: "Deluxe Room", bedType: "เตียงคิงไซส์ 1 เตียง", sizeSqm: 28, capacity: 3, price: 1690 },
        { name: "Family Suite", bedType: "เตียงคิงไซส์ 1 + โซฟาเบด 1", sizeSqm: 40, capacity: 4, price: 2450 },
      ],
      promotions: [{ title: "จองตรงล่วงหน้า 30 วัน", discountPct: 15 }],
    },
    {
      id: "cbp",
      name: "Chaba @CBP เชียงใหม่",
      location: "แม่ริม, เชียงใหม่",
      distanceNote: "8.4 กม. จากตัวเมือง",
      stars: 4,
      reviewScore: 8.3,
      reviewCount: 187,
      lineOaUrl: "https://lin.ee/ualls0NN",
      policyExtra: "มีสนามหญ้าให้วิ่งเล่นด้านหลังอาคาร เปิด 06:00–20:00 น.",
      rooms: [
        { name: "Standard Twin", bedType: "เตียงคู่ 2 เตียง", sizeSqm: 24, capacity: 2, price: 990 },
        { name: "Garden View Room", bedType: "เตียงควีนไซส์ 1 เตียง", sizeSqm: 26, capacity: 2, price: 1150 },
      ],
      promotions: [{ title: "เข้าพัก 3 คืน จ่าย 2 คืน", discountPct: 33 }],
    },
    {
      id: "varee",
      name: "Chaba Varee ดอยสะเก็ด",
      location: "ดอยสะเก็ด, เชียงใหม่",
      distanceNote: "12 กม. จากตัวเมือง",
      stars: 4,
      reviewScore: 8.7,
      reviewCount: 96,
      lineOaUrl: "https://lin.ee/SlZII6f",
      policyExtra: "ห้ามสัตว์เลี้ยงลงเล่นในสระว่ายน้ำส่วนกลาง",
      rooms: [
        { name: "Deluxe Mountain View", bedType: "เตียงคิงไซส์ 1 เตียง", sizeSqm: 30, capacity: 2, price: 1590 },
        { name: "Pool Access Room", bedType: "เตียงคิงไซส์ 1 เตียง", sizeSqm: 32, capacity: 2, price: 1890 },
      ],
      promotions: [],
    },
    {
      id: "rayong",
      name: "Chaba Station ระยอง",
      location: "เมืองระยอง, ระยอง",
      distanceNote: "2.2 กม. จากตัวเมือง",
      stars: 3,
      reviewScore: 7.8,
      reviewCount: 54,
      lineOaUrl: "https://lin.ee/635ZXtF",
      policyExtra: "",
      rooms: [
        { name: "Standard Double", bedType: "เตียงคู่ 2 เตียง", sizeSqm: 22, capacity: 2, price: 850 },
      ],
      promotions: [{ title: "วันธรรมดาลดพิเศษ", discountPct: 20 }],
    },
    {
      id: "villa",
      name: "Chaba Pool Villa Terrace",
      location: "เชียงใหม่",
      distanceNote: "6.5 กม. จากตัวเมือง",
      stars: 5,
      reviewScore: 9.1,
      reviewCount: 61,
      lineOaUrl: "", // ยังไม่ได้รับลิงก์ LINE OA ของสาขานี้ — เพิ่มได้ที่หลังบ้าน > ตั้งค่าสาขา
      policyExtra: "",
      rooms: [
        { name: "1-Bedroom Pool Villa", bedType: "เตียงคิงไซส์ 1 เตียง", sizeSqm: 55, capacity: 2, price: 3390 },
      ],
      promotions: [],
    },
  ];

  for (const b of branches) {
    const { rooms, promotions, ...branchData } = b;
    await prisma.branch.upsert({
      where: { id: b.id },
      update: {},
      create: {
        ...branchData,
        rooms: { create: rooms.map((r, i) => ({ ...r, sortOrder: i })) },
        promotions: { create: promotions },
      },
    });
  }

  const adminUsername = process.env.SEED_ADMIN_USERNAME || "patt";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "changeme123";
  const existingAdmin = await prisma.user.findUnique({ where: { username: adminUsername } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        username: adminUsername,
        passwordHash: await bcrypt.hash(adminPassword, 10),
        name: "คุณแพท",
        role: "ADMIN",
      },
    });
    console.log(`สร้างบัญชีผู้ดูแลหลักแล้ว: ${adminUsername} (เปลี่ยนรหัสผ่านนี้ทันทีหลังเข้าระบบครั้งแรก)`);
  }

  console.log("Seed ข้อมูลตั้งต้นเสร็จสมบูรณ์ — 5 สาขา พร้อมห้องพัก โปรโมชัน และบัญชีผู้ดูแล");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
