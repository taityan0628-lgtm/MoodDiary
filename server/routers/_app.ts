import { router } from "../trpc";
import { userRouter } from "./user";
import { diaryRouter } from "./diary";
import { moodRouter } from "./mood";

export const appRouter = router({
  user: userRouter,
  diary: diaryRouter,
  mood: moodRouter,
});

export type AppRouter = typeof appRouter;
