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
      title: "朝の散歩",
      date: new Date("2025-10-08"),
      timestamp: new Date("2025-10-08T07:30:00Z"),
      content:
        "朝日を浴びながら散歩した。小鳥のさえずりが心地よく、自然と一体になれた気がする。",
      moodId: getMoodByName("自然").id,
    },
    {
      userId: user1.id,
      title: "プロジェクトスタート",
      date: new Date("2025-10-09"),
      timestamp: new Date("2025-10-09T09:00:00Z"),
      content:
        "新しいプロジェクトがスタート。チーム全員のエネルギーを感じて、やる気が湧いてくる！",
      moodId: getMoodByName("活力").id,
    },
    {
      userId: user1.id,
      title: "プロジェクト完了",
      date: new Date("2025-10-10"),
      timestamp: new Date("2025-10-10T18:30:00Z"),
      content:
        "プロジェクトが無事完了。達成感で心が満たされている。みんなで祝杯をあげた。",
      moodId: getMoodByName("幸せ").id,
    },
    {
      userId: user1.id,
      title: "美術館訪問",
      date: new Date("2025-10-11"),
      timestamp: new Date("2025-10-11T14:00:00Z"),
      content: "美術館で不思議な絵画に出会った。何か深いメッセージを感じる。",
      moodId: getMoodByName("神秘").id,
    },
    {
      userId: user1.id,
      title: "午後の読書",
      date: new Date("2025-10-12"),
      timestamp: new Date("2025-10-12T15:00:00Z"),
      content: "ゆっくりお茶を飲みながら読書。心が落ち着く穏やかな時間。",
      moodId: getMoodByName("穏やか").id,
    },
    {
      userId: user1.id,
      title: "バグとの戦い",
      date: new Date("2025-10-13"),
      timestamp: new Date("2025-10-13T22:00:00Z"),
      content: "バグ修正に追われた。なかなか解決せず、気持ちが沈んでいる...",
      moodId: getMoodByName("憂鬱").id,
    },
    {
      userId: user1.id,
      title: "朝のコーヒー",
      date: new Date("2025-10-14"),
      timestamp: new Date("2025-10-14T08:00:00Z"),
      content: "朝のコーヒーが美味しい。今日も頑張ろう！",
      moodId: getMoodByName("活力").id,
    },

    // 佐藤花子の日記
    {
      userId: user2.id,
      title: "家族との電話",
      date: new Date("2025-10-08"),
      timestamp: new Date("2025-10-08T20:00:00Z"),
      content:
        "家族と久しぶりに電話。温かい気持ちになった。愛されているって幸せ。",
      moodId: getMoodByName("愛情").id,
    },
    {
      userId: user2.id,
      title: "新しい挑戦",
      date: new Date("2025-10-09"),
      timestamp: new Date("2025-10-09T10:30:00Z"),
      content: "新しい挑戦を決意した！情熱を持って取り組みたい。",
      moodId: getMoodByName("情熱").id,
    },
    {
      userId: user2.id,
      title: "カフェでおしゃべり",
      date: new Date("2025-10-10"),
      timestamp: new Date("2025-10-10T14:30:00Z"),
      content: "カフェで友達とゆっくり話せた。穏やかな午後のひととき。",
      moodId: getMoodByName("穏やか").id,
    },
    {
      userId: user2.id,
      title: "ジムトレーニング",
      date: new Date("2025-10-11"),
      timestamp: new Date("2025-10-11T18:00:00Z"),
      content: "ジムで久々に運動。体を動かすと元気が出る！",
      moodId: getMoodByName("活力").id,
    },
    {
      userId: user2.id,
      title: "仕事のミス",
      date: new Date("2025-10-12"),
      timestamp: new Date("2025-10-12T16:00:00Z"),
      content: "仕事でミスをしてしまった。落ち込んでいる...",
      moodId: getMoodByName("憂鬱").id,
    },
    {
      userId: user2.id,
      title: "美しい夕焼け",
      date: new Date("2025-10-13"),
      timestamp: new Date("2025-10-13T18:30:00Z"),
      content: "夕焼けがとても綺麗だった。自然の美しさに癒された。",
      moodId: getMoodByName("自然").id,
    },
    {
      userId: user2.id,
      title: "友達からの手紙",
      date: new Date("2025-10-14"),
      timestamp: new Date("2025-10-14T12:00:00Z"),
      content: "友達から手紙が届いた。嬉しくて涙が出そう。",
      moodId: getMoodByName("愛情").id,
    },

    // 同じ日に複数の日記（田中太郎）
    {
      userId: user1.id,
      title: "昼のランチ",
      date: new Date("2025-10-14"),
      timestamp: new Date("2025-10-14T12:30:00Z"),
      content: "美味しいパスタを食べた。幸せな気分。",
      moodId: getMoodByName("幸せ").id,
    },
    {
      userId: user1.id,
      title: "夕方の散歩",
      date: new Date("2025-10-14"),
      timestamp: new Date("2025-10-14T17:00:00Z"),
      content: "公園を散歩。秋の風が心地よい。",
      moodId: getMoodByName("穏やか").id,
    },
  ];

  await Promise.all(
    diaryEntriesData.map((data) => prisma.diaryEntry.create({ data }))
  );

  return diaryEntriesData.length;
}
