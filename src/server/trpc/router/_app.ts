import { router } from "../trpc";
import { authRouter } from "./auth";
import { questionRouter } from "./question";
import { quizRouter } from "./quiz";

export const appRouter = router({
  auth: authRouter,
  question: questionRouter,
  quiz: quizRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
