import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const questionRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        tag: z.string(),
        difficulty: z.enum(["Easy", "Medium", "Hard"]),
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
          difficulty: input.difficulty,
          tag_id: input.tag,
          user_id: ctx.session.user.id,
        },
      });
      const answers = input.answers.map((a) => {
        return { ...a, question_id: question.id };
      });

      ((answers: any[]) => {
        let currentIndex = answers.length;
        while (currentIndex !== 0) {
          const randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          [answers[currentIndex], answers[randomIndex]] = [
            answers[randomIndex],
            answers[currentIndex],
          ];
        }

        return answers;
      })(answers);

      await ctx.prisma.answer.createMany({ data: answers });
    }),
  getQuestions: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.question.findMany({
        where: {
          user_id: ctx.session.user.id,
          content: { contains: input.query, mode: "insensitive" },
        },
        orderBy: { created_at: "desc" },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const question = await ctx.prisma.question.findUnique({
        where: { id: input.id },
        include: { answers: true },
      });
      if (!question) throw new TRPCError({ code: "NOT_FOUND" });
      if (question.user_id !== ctx.session.user.id) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      return question;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.question.delete({ where: { id: input.id } });
    }),
  getTags: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tag.findMany({});
  }),
  addTags: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.tag.create({ data: { name: input.name } });
    }),
});
