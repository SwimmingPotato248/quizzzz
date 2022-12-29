import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { questionRouter } from "./question";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  question: questionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
