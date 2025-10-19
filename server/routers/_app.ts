import { router } from "../trpc";
import { userRouter } from "./user";
import { diaryRouter } from "./diary";

export const appRouter = router({
  user: userRouter,
  diary: diaryRouter, // ←追加！
});

export type AppRouter = typeof appRouter;
