// ============================================
// 気分マスターデータ
// ============================================
import { Mood, PrismaClient } from "@prisma/client";

export async function seedMoods(prisma: PrismaClient): Promise<Mood[]> {
  const moodsData = [
    { name: "幸せ", color: "#fef08a" }, // 黄色系
    { name: "穏やか", color: "#bfdbfe" }, // 青色系
    { name: "情熱", color: "#fecaca" }, // 赤色系
    { name: "自然", color: "#bbf7d0" }, // 緑色系
    { name: "神秘", color: "#e9d5ff" }, // 紫色系
    { name: "活力", color: "#fed7aa" }, // オレンジ色系
    { name: "憂鬱", color: "#e2e8f0" }, // グレー系
    { name: "愛情", color: "#fbcfe8" }, // ピンク色系
  ];

  const moods = await Promise.all(
    moodsData.map((data) => prisma.mood.create({ data }))
  );

  return moods;
}
