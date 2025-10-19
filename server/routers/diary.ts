import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma } from "../db";

/**
 * diaryRouter
 * - getAll: すべての日記を取得
 * - add: 日記を追加
 */

// 日付文字列を Date に変換して検証するスキーマ
const dateInput = z.preprocess(
  (arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg as string | Date);
    return arg;
  },
  z.date()
);

export const diaryRouter = router({
  // 🟢 すべての日記を取得
  getAll: publicProcedure.query(async () => {
    return await prisma.diaryEntry.findMany({
      include: {
        mood: true,
        user: true,
      },
      orderBy: { date: "desc" },
    });
  }),

  // 🟡 日記を追加
  add: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        moodId: z.string(),
        userId: z.string(),
        date: dateInput, // Date 型として受け取る
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.diaryEntry.create({
        data: {
          title: input.title,
          content: input.content,
          moodId: input.moodId,
          userId: input.userId,
          date: input.date,
        },
      });
    }),
});
