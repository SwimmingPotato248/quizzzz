import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

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
  getMyQuizzes: protectedProcedure.query(async ({ ctx }) => {
    const quizzes = await ctx.prisma.quiz.findMany({
      where: { user_id: ctx.session.user.id },
    });
    return quizzes;
  }),
  getMyOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: { id: input.id },
        include: { questions: true },
      });
      if (quiz?.user_id !== ctx.session.user.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });
      return quiz;
    }),
  getQuizzes: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.quiz.findMany({});
  }),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const quiz = await ctx.prisma.quiz.findUnique({
        where: { id: input.id },
        include: { questions: { include: { answers: true } }, user: true },
      });
      return quiz;
    }),
});
