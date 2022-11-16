import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { offerPagesReport } from "../report";
import { createProtectedRouter } from "./context";

const CreateOfferDTO = z.object({
  name: z.string(),
  countries: z.array(z.string()).default(["ALL"]),
  url: z.string(),
});

export const offerPagesRouter = createProtectedRouter()
  .mutation("create", {
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
  })
  .query("index", {
    resolve: async ({ ctx }) => {
      if (!ctx.session.user) return [];

      const offerPages = await ctx.prisma.offerPage.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
      return offerPagesReport(offerPages);
    },
  })
  .query("select-data", {
    resolve: async ({ ctx }) => {
      if (!ctx.session.user) return [];

      const offerPages = await ctx.prisma.offerPage.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
      return offerPages;
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      offer: CreateOfferDTO,
    }),
    resolve: async ({ ctx, input }) => {
      if (!ctx.session.user.id) return null;

      if (!isOfferPresented(input.id, ctx.session.user.id, ctx.prisma))
        return null;

      const offer = await ctx.prisma.offerPage.update({
        where: {
          id: input.id,
        },
        data: {
          ...input.offer,
        },
      });
      return offer;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      if (!ctx.session.user.id) return null;

      if (!isOfferPresented(input.id, ctx.session.user.id, ctx.prisma))
        return null;

      const offer = await ctx.prisma.offerPage.delete({
        where: {
          id: input.id,
        },
      });
      return offer;
    },
  });

export const isOfferPresented = async (
  id: string,
  userId: string,
  prisma: PrismaClient
) => {
  const offer = await prisma.offerPage.findUnique({
    where: {
      id,
    },
  });
  return offer?.userId === userId;
};
