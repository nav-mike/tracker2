import { buffer } from "micro";
import { NextApiHandler } from "next";
import Stripe from "stripe";
import { stripeClient } from "../../../server/billing/stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    res.send({ error: "No secret" });
    return;
  }

  try {
    const event = stripeClient.webhooks.constructEvent(
      await buffer(req),
      req.headers["stripe-signature"] as string,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    const subscription = event.data.object as Stripe.Subscription;
    switch (event.type) {
      case "customer.subscription.created":
        await prisma?.user.update({
          where: {
            customerId: subscription.customer as string,
          },
          data: {
            subscriptionId: subscription.id,
            activeSubscription: true,
            subscriptionInterval:
              subscription.items?.data[0]?.price?.recurring?.interval,
          },
        });
        break;
      case "customer.subscription.deleted":
        await prisma?.user.update({
          where: {
            customerId: subscription.customer as string,
          },
          data: {
            subscriptionId: null,
            activeSubscription: false,
            subscriptionInterval: null,
          },
        });
        break;
      case "customer.subscription.updated":
        await prisma?.user.update({
          where: {
            customerId: subscription.customer as string,
          },
          data: {
            subscriptionId: subscription.id,
            activeSubscription: true,
            subscriptionInterval:
              subscription.items?.data[0]?.price?.recurring?.interval,
          },
        });
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.status(201).send("ok");
  } catch (err) {
    const error = err as Error;
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

export default handler;
