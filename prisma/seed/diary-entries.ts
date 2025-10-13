// ============================================
// 日記エントリー
// ============================================
import { Mood, PrismaClient, User } from "@prisma/client";

export async function seedDiaryEntries(
  prisma: PrismaClient,
  users: User[],
  moods: Mood[]
): Promise<number> {
  const [user1, user2] = users;

  // 気分を名前で検索するヘルパー
  const getMoodByName = (name: string) => moods.find((m) => m.name === name)!;

  const diaryEntriesData = [
    // 田中太郎の日記
    {
      userId: user1.id,
      date: new Date("2025-10-08"),
      content:
        "朝日を浴びながら散歩した。小鳥のさえずりが心地よく、自然と一体になれた気がする。",
      moodId: getMoodByName("自然").id,
    },
    {
      userId: user1.id,
      date: new Date("2025-10-09"),
      content:
        "新しいプロジェクトがスタート。チーム全員のエネルギーを感じて、やる気が湧いてくる！",
      moodId: getMoodByName("活力").id,
    },
    {
      userId: user1.id,
      date: new Date("2025-10-10"),
      content:
        "プロジェクトが無事完了。達成感で心が満たされている。みんなで祝杯をあげた。",
      moodId: getMoodByName("幸せ").id,
    },
    {
      userId: user1.id,
      date: new Date("2025-10-11"),
      content: "美術館で不思議な絵画に出会った。何か深いメッセージを感じる。",
      moodId: getMoodByName("神秘").id,
    },
    {
      userId: user1.id,
      date: new Date("2025-10-12"),
      content: "ゆっくりお茶を飲みながら読書。心が落ち着く穏やかな時間。",
      moodId: getMoodByName("穏やか").id,
    },
    {
      userId: user1.id,
      date: new Date("2025-10-13"),
      content: "バグ修正に追われた。なかなか解決せず、気持ちが沈んでいる...",
      moodId: getMoodByName("憂鬱").id,
    },
    // 佐藤花子の日記
    {
      userId: user2.id,
      date: new Date("2025-10-08"),
      content:
        "家族と久しぶりに電話。温かい気持ちになった。愛されているって幸せ。",
      moodId: getMoodByName("愛情").id,
    },
    {
      userId: user2.id,
      date: new Date("2025-10-09"),
      content: "新しい挑戦を決意した！情熱を持って取り組みたい。",
      moodId: getMoodByName("情熱").id,
    },
    {
      userId: user2.id,
      date: new Date("2025-10-10"),
      content: "カフェで友達とゆっくり話せた。穏やかな午後のひととき。",
      moodId: getMoodByName("穏やか").id,
    },
    {
      userId: user2.id,
      date: new Date("2025-10-11"),
      content: "ジムで久々に運動。体を動かすと元気が出る！",
      moodId: getMoodByName("活力").id,
    },
    {
      userId: user2.id,
      date: new Date("2025-10-12"),
      content: "仕事でミスをしてしまった。落ち込んでいる...",
      moodId: getMoodByName("憂鬱").id,
    },
    {
      userId: user2.id,
      date: new Date("2025-10-13"),
      content: "夕焼けがとても綺麗だった。自然の美しさに癒された。",
      moodId: getMoodByName("自然").id,
    },
  ];

  await Promise.all(
    diaryEntriesData.map((data) => prisma.diaryEntry.create({ data }))
  );

  return diaryEntriesData.length;
}
