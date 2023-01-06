import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const quizAttemptRouter = router({
  submitAttempt: protectedProcedure
    .input(
      z.object({
        quiz_id: z.string(),
        answers: z.array(
          z.object({
            question_id: z.string(),
            answer_id: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const attempt = await ctx.prisma.quizAttempt.create({
        data: {
          user_id: ctx.session.user.id,
        },
      });
      const quiz = await ctx.prisma.quiz.findUnique({
        where: {
          id: input.quiz_id,
        },
        select: {
          questions: { include: { answers: { where: { status: true } } } },
        },
      });
      const attemptDetail = input.answers.map((answer) => {
        const question = quiz?.questions.find(
          (e) => e.id === answer.question_id
        );
        const correct_answer_id = question?.answers.find(
          (e) => e.status === true
        )?.id;
        return {
          ...answer,
          quiz_attempt_id: attempt.id,
          correct: answer.answer_id === correct_answer_id,
        };
      });
      await ctx.prisma.quizAttemptDetail.createMany({
        data: attemptDetail,
      });
      const score = await ctx.prisma.quizAttemptDetail.count({
        where: { quiz_attempt_id: attempt.id, correct: true },
      });
      await ctx.prisma.quizAttempt.update({
        where: { id: attempt.id },
        data: { score },
      });
      return score;
    }),
});
