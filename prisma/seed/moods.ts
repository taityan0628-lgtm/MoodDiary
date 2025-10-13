// ============================================
// 気分マスターデータ
// ============================================
import { Mood, PrismaClient } from "@prisma/client";

export async function seedMoods(prisma: PrismaClient): Promise<Mood[]> {
  const moodsData = [
    { name: "幸せ", color: "#fef08a", icon: "Heart", order: 1 },
    { name: "穏やか", color: "#bfdbfe", icon: "Sun", order: 2 },
    { name: "情熱", color: "#fecaca", icon: "Zap", order: 3 },
    { name: "自然", color: "#bbf7d0", icon: "Leaf", order: 4 },
    { name: "神秘", color: "#e9d5ff", icon: "Moon", order: 5 },
    { name: "活力", color: "#fed7aa", icon: "Coffee", order: 6 },
    { name: "憂鬱", color: "#e2e8f0", icon: "Cloud", order: 7 },
    { name: "愛情", color: "#fbcfe8", icon: "Smile", order: 8 },
  ];

  const moods = await Promise.all(
    moodsData.map((data) =>
      prisma.mood.upsert({
        where: { name: data.name },
        update: { color: data.color, icon: data.icon, order: data.order },
        create: data,
      })
    )
  );

  return moods;
}
