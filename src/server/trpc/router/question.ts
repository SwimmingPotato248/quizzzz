import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const questionRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        answers: z.array(
          z.object({
            content: z.string(),
            status: z.boolean(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const question = await ctx.prisma.question.create({
        data: {
          content: input.content,
          user_id: ctx.session.user.id,
        },
      });
      const answers = input.answers.map((a) => {
        return { ...a, question_id: question.id };
      });
      await ctx.prisma.answer.createMany({ data: answers });
    }),
});
