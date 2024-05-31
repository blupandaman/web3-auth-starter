import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (model, { eq }) => eq(model.id, ctx.session.user.id),
    });

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found from database.",
      });

    return user;
  }),

  updateUsername: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [updatedUser] = await ctx.db
        .update(users)
        .set({
          username: input.username,
        })
        .where(eq(users.id, ctx.session.user.id))
        .returning();

      return updatedUser;
    }),
});
