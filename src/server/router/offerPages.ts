import { z } from "zod";
import { createProtectedRouter } from "./context";

const CreateOfferDTO = z.object({
  name: z.string(),
  countries: z.array(z.string()).default(["ALL"]),
  url: z.string(),
});

export const offerPagesRouter = createProtectedRouter().mutation("create", {
  input: CreateOfferDTO,
  resolve: async ({ ctx, input }) => {
    const offer = await ctx.prisma.offerPage.create({
      data: {
        ...input,
        userId: ctx.session.user.id,
      },
    });
    return offer;
  },
});
