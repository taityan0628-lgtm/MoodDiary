import { z } from "zod";
import { prisma } from "../db";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  // 全ユーザー取得
  list: publicProcedure.query(async () => {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  // ID指定でユーザー取得
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.user.findUnique({
        where: { id: input.id },
      });
    }),

  // Email指定でユーザー取得
  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input }) => {
      return await prisma.user.findUnique({
        where: { email: input.email },
      });
    }),
});
