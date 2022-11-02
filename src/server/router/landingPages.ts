import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { createProtectedRouter } from "./context";

const CreateLandingDTO = z.object({
  name: z.string(),
  countries: z.array(z.string()).default(["ALL"]),
  url: z.string(),
});

export const landingPagesRouter = createProtectedRouter()
  .mutation("create", {
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
  })
  .query("index", {
    resolve: async ({ ctx }) => {
      if (!ctx.session.user) return [];

      const landingPages = await ctx.prisma.landingPage.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });
      return landingPages;
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      landing: CreateLandingDTO,
    }),
    resolve: async ({ ctx, input }) => {
      if (!ctx.session.user.id) return null;

      if (!isLandingPresented(input.id, ctx.session.user.id, ctx.prisma))
        return null;

      const landing = await ctx.prisma.landingPage.update({
        where: {
          id: input.id,
        },
        data: {
          ...input.landing,
        },
      });
      return landing;
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      if (!ctx.session.user.id) return null;

      if (!isLandingPresented(input.id, ctx.session.user.id, ctx.prisma))
        return null;

      const landing = await ctx.prisma.landingPage.delete({
        where: {
          id: input.id,
        },
      });
      return landing;
    },
  });

export const isLandingPresented = async (
  id: string,
  userId: string,
  prisma: PrismaClient
) => {
  const landing = await prisma.landingPage.findUnique({
    where: {
      id,
    },
  });
  return landing?.userId === userId;
};
