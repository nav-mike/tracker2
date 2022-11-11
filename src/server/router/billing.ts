import { z } from "zod";
import { stripeClient } from "../billing/stripe";
import { createProtectedRouter } from "./context";

const SubscribeToPlanDTO = z.object({
  planId: z.string(),
});

export const billingRouter = createProtectedRouter().mutation(
  "subscribeToPlan",
  {
    input: SubscribeToPlanDTO,
    resolve: async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });

      if (!user) return null;
      if (!user.customerId) return null;

      const lineItems = [
        {
          price: input.planId,
          quantity: 1,
        },
      ];

      const session = await stripeClient.checkout.sessions.create({
        customer: user.customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: lineItems,
        success_url: `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/billing/payment/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/billing/payment/cancel`,
      });

      return {
        id: session.id,
      };
    },
  }
);
