import { prisma } from "../db";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const moodRouter = router({
  // 全気分データ取得
  list: publicProcedure.query(async () => {
    return await prisma.mood.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),
});
