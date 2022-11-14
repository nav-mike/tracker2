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

      if (user.subscriptionId) {
        return updateSubscription(user.subscriptionId, input.planId);
      } else {
        return createSubscription(user.customerId, input.planId);
      }
    },
  }
);

const createSubscription = async (customerId: string, planId: string) => {
  const lineItems = [
    {
      price: planId,
      quantity: 1,
    },
  ];

  const session = await stripeClient.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/billing/payment/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/billing/payment/cancel`,
  });

  return {
    id: session.id,
    type: "checkout_session",
  };
};

const updateSubscription = async (subscriptionId: string, planId: string) => {
  const subscription = await stripeClient.subscriptions.retrieve(
    subscriptionId
  );

  if (!subscription.items.data[0]) throw new Error("No subscription items");

  const result = await stripeClient.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
    proration_behavior: "create_prorations",
    items: [
      {
        id: subscription.items.data[0].id,
        price: planId,
      },
    ],
  });

  return {
    id: result.id,
    type: "subscription",
  };
};
