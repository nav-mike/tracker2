import { PrismaClient } from "@prisma/client";
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
// TODO: fix cost and revenue
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
      return campaign;
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
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      campaign: CreateCampaignDTO,
    }),
    resolve: async ({ ctx, input }) => {
      if (!ctx.session.user.id) return null;

      if (!isCampaignPresented(input.id, ctx.session.user.id, ctx.prisma))
        return null;

      const result = await ctx.prisma.campaign.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.campaign.name,
          countries: input.campaign.countries,
        },
      });

      const campaign = await ctx.prisma.campaign.findUnique({
        where: { id: input.id },
        include: { paths: true },
      });
      if (!campaign) return null;

      await ctx.prisma.path.deleteMany({
        where: {
          id: {
            in: campaign.paths
              .map((path) => path.id)
              .filter((id) => {
                return !input.campaign.paths.some((path) => path.id === id);
              }),
          },
        },
      });

      await ctx.prisma.path.createMany({
        data: input.campaign.paths
          .filter((path) => !path.id)
          .map((path) => ({
            landingPageId: path.landingPageId,
            offerPageId: path.offerPageId,
            campaignId: campaign.id,
          })),
      });

      input.campaign.paths.forEach(async (path) => {
        if (path.id) {
          await ctx.prisma.path.update({
            where: {
              id: path.id,
            },
            data: {
              landingPageId: path.landingPageId,
              offerPageId: path.offerPageId,
            },
          });
        }
      });

      return result;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      if (!ctx.session.user.id) return null;

      if (!isCampaignPresented(input.id, ctx.session.user.id, ctx.prisma))
        return null;

      const result = await ctx.prisma.campaign.delete({
        where: {
          id: input.id,
        },
      });

      return result;
    },
  });

const isCampaignPresented = async (
  id: string,
  userId: string,
  prisma: PrismaClient
) => {
  const campaign = await prisma.campaign.findFirst({
    where: {
      id,
      userId,
    },
  });
  return !!campaign;
};
