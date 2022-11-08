import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  browsersReport,
  campaignsReport,
  countriesReport,
  devicesReport,
  landingPagesReport,
  offerPagesReport,
  osReport,
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
        const paths = await ctx.prisma.path.findMany({
          where: {
            campaignId: {
              in: await campaignIds(ctx.session.user.id, ctx.prisma),
            },
          },
          include: {
            campaign: true,
          },
        });
        return pathsReport(paths);

      case "country":
        return countriesReport(
          await campaignIds(ctx.session.user.id, ctx.prisma)
        );

      case "os":
        return osReport(await campaignIds(ctx.session.user.id, ctx.prisma));

      case "browser":
        return browsersReport(
          await campaignIds(ctx.session.user.id, ctx.prisma)
        );

      case "device":
        return devicesReport(
          await campaignIds(ctx.session.user.id, ctx.prisma)
        );

      default:
        return [];
    }
  },
});

const campaignIds = async (userId: string, prisma: PrismaClient) =>
  (
    await prisma.campaign.findMany({
      where: {
        userId: userId,
      },
    })
  ).map((campaign) => campaign.id);
