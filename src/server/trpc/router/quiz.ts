import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const quizRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        questions: z.array(z.object({ id: z.string() })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const quiz = await ctx.prisma.quiz.create({
          data: {
            title: input.title,
            description: input.description,
            user_id: ctx.session.user.id,
            questions: { connect: input.questions },
          },
          select: { id: true },
        });
        return quiz;
      } catch (e) {
        console.error(e);
      }
    }),
});
