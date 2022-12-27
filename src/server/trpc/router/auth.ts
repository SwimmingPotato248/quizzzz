import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import * as argon2 from "argon2";

export const authRouter = router({
  checkUnique: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const count = await ctx.prisma.user.count({
        where: {
          username: input.username,
        },
      });
      if (count === 1) return false;
      return true;
    }),
  signUp: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const password = await argon2.hash(input.password);
      await ctx.prisma.user.create({
        data: {
          username: input.username,
          password,
        },
      });
      return { username: input.username, password: input.password };
    }),
});
