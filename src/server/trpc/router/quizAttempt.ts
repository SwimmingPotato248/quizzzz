import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const quizAttemptRouter = router({
  submitAttempt: publicProcedure
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
          correct: answer.answer_id === correct_answer_id,
        };
      });
      const score = attemptDetail.filter((e) => e.correct === true).length;
      if (ctx.session?.user) {
        const attempt = await ctx.prisma.quizAttempt.create({
          data: {
            user_id: ctx.session.user.id,
            quizId: input.quiz_id,
          },
        });
        await ctx.prisma.quizAttemptDetail.createMany({
          data: attemptDetail.map((e) => {
            return { ...e, quiz_attempt_id: attempt.id };
          }),
        });
        await ctx.prisma.quizAttempt.update({
          where: { id: attempt.id },
          data: { score },
        });
      }
      return score;
    }),
  getLeaderboard: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.quizAttempt.findMany({
        where: { quizId: input.id },
        orderBy: [{ score: "desc" }, { created_at: "asc" }],
        distinct: ["user_id"],
        include: { user: { select: { username: true, id: true } } },
        take: 10,
      });
    }),
});
