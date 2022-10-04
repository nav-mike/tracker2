import { z } from "zod";
import { createProtectedRouter } from "./context";

const CreateLandingDTO = z.object({
  name: z.string(),
  countries: z.array(z.string()).default(["ALL"]),
  offersCount: z.number().nullish(),
  url: z.string(),
});

export const landingPagesRouter = createProtectedRouter().mutation("create", {
  input: CreateLandingDTO,
  resolve: async ({ ctx, input }) => {
    const landing = await ctx.prisma.landingPage.create({
      data: {
        ...input,
        userId: ctx.session.user.id,
      },
    });
    return landing;
  },
});
