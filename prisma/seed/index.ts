// ============================================
// 実行エントリーポイント
// ============================================
import { PrismaClient } from "@prisma/client";
import { seedDiaryEntries } from "./diary-entries";
import { seedMoods } from "./moods";
import { seedUsers } from "./users";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 シードデータを投入開始...\n");

  // 既存データをクリア（開発時のみ）
  console.log("🗑️  既存データをクリア中...");
  await prisma.diaryEntry.deleteMany();
  await prisma.mood.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ 既存データをクリアしました\n");

  // 1. ユーザー作成
  console.log("👤 ユーザーを作成中...");
  const users = await seedUsers(prisma);
  console.log(`✅ ユーザーを ${users.length} 人作成しました\n`);

  // 2. 気分マスター作成
  console.log("🎨 気分マスターデータを作成中...");
  const moods = await seedMoods(prisma);
  console.log(`✅ 気分マスターを ${moods.length} 種類作成しました\n`);

  // 3. 日記エントリー作成
  console.log("📝 日記エントリーを作成中...");
  const diaryCount = await seedDiaryEntries(prisma, users, moods);
  console.log(`✅ 日記エントリーを ${diaryCount} 件作成しました\n`);

  // サマリー表示
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 投入データサマリー");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  ユーザー:       ${await prisma.user.count()} 人`);
  console.log(`  気分マスター:   ${await prisma.mood.count()} 種類`);
  console.log(`  日記エントリー: ${await prisma.diaryEntry.count()} 件`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("🎉 シードデータ投入完了！");
}

main()
  .catch((e) => {
    console.error("❌ エラーが発生しました:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
