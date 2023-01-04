import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { questionRouter } from "./question";
import { quizRouter } from "./quiz";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  question: questionRouter,
  quiz: quizRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
