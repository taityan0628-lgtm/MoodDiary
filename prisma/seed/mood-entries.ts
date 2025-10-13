// ============================================
// 気分エントリー
// ============================================
import { Mood, PrismaClient, User } from "@prisma/client";

export async function seedMoodEntries(
  prisma: PrismaClient,
  users: User[],
  moods: Mood[]
): Promise<number> {
  const [user1, user2] = users;
  const today = new Date("2025-10-14");

  // 田中太郎の2週間の気分記録
  const user1Pattern = [0, 1, 5, 3, 4, 6, 7, 2, 0, 1, 3, 5, 6, 1];
  const user1Entries = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return {
      userId: user1.id,
      date,
      moodId: moods[user1Pattern[i]].id,
    };
  });

  // 佐藤花子の2週間の気分記録
  const user2Pattern = [7, 2, 1, 5, 3, 6, 0, 4, 1, 7, 3, 2, 6, 5];
  const user2Entries = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    return {
      userId: user2.id,
      date,
      moodId: moods[user2Pattern[i]].id,
    };
  });

  const allEntries = [...user1Entries, ...user2Entries];

  await Promise.all(
    allEntries.map((data) => prisma.moodEntry.create({ data }))
  );

  return allEntries.length;
}
