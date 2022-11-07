import { z } from "zod";
import {
  campaignsReport,
  landingPagesReport,
  offerPagesReport,
  pathsReport,
} from "../report";
import { createProtectedRouter } from "./context";

const ReportInputs = z.object({
  type: z.string(),
});

export const reportsRouter = createProtectedRouter().query("index", {
  input: ReportInputs,
  resolve: async ({ ctx, input }) => {
    if (!ctx.session.user) return [];

    switch (input.type) {
      case "landingPageId":
        const landingPages = await ctx.prisma.landingPage.findMany({
          where: {
            userId: ctx.session.user.id,
          },
        });
        return landingPagesReport(landingPages);

      case "offerPageId":
        const offerPages = await ctx.prisma.offerPage.findMany({
          where: {
            userId: ctx.session.user.id,
          },
        });
        return offerPagesReport(offerPages);

      case "campaignId":
        const campaigns = await ctx.prisma.campaign.findMany({
          where: {
            userId: ctx.session.user.id,
          },
        });
        return campaignsReport(campaigns);

      case "pathId":
        const campaignIds = (
          await ctx.prisma.campaign.findMany({
            where: {
              userId: ctx.session.user.id,
            },
          })
        ).map((campaign) => campaign.id);
        const paths = await ctx.prisma.path.findMany({
          where: {
            campaignId: {
              in: campaignIds,
            },
          },
          include: {
            campaign: true,
          },
        });
        return pathsReport(paths);

      default:
        return [];
    }
  },
});
