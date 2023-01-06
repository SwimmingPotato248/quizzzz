import { router } from "../trpc";
import { authRouter } from "./auth";
import { questionRouter } from "./question";
import { quizRouter } from "./quiz";
import { quizAttemptRouter } from "./quizAttempt";

export const appRouter = router({
  auth: authRouter,
  question: questionRouter,
  quiz: quizRouter,
  quizAttempt: quizAttemptRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
