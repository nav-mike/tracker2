import { z } from "zod";
import { createProtectedRouter } from "./context";

const CreateCampaignDTO = z.object({
  name: z.string(),
  countries: z.array(z.string()).default(["ALL"]),
  paths: z.array(
    z.object({
      id: z.string().optional(),
      landingPageId: z.string(),
      offerPageId: z.string(),
    })
  ),
});

export const campaignsRouter = createProtectedRouter()
  .mutation("create", {
    input: CreateCampaignDTO,
    resolve: async ({ ctx, input }) => {
      const campaign = await ctx.prisma.campaign.create({
        data: {
          name: input.name,
          countries: input.countries,
          userId: ctx.session.user.id,
        },
      });
      await ctx.prisma.path.createMany({
        data: input.paths.map((path) => ({
          landingPageId: path.landingPageId,
          offerPageId: path.offerPageId,
          campaignId: campaign.id,
        })),
      });
      const result = await ctx.prisma.campaign.findUnique({
        where: {
          id: campaign.id,
        },
        include: {
          paths: true,
        },
      });
      return result;
    },
  })
  .query("index", {
    resolve: async ({ ctx }) => {
      if (!ctx.session.user) return [];

      const campaigns = await ctx.prisma.campaign.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
      return campaigns;
    },
  });
