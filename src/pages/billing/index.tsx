import { User } from "@prisma/client";
import { loadStripe } from "@stripe/stripe-js";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import { commonLayout } from "../../components/common/Layout";
import { stripeClient } from "../../server/billing/stripe";
import { ProtectedPage } from "../../types/auth-required";
import { trpc } from "../../utils/trpc";
import { authOptions } from "../api/auth/[...nextauth]";

type StripePlan = {
  id: string;
  price: number;
  interval: string;
};

const IndexBillingPage: ProtectedPage<{ user: User; plans?: StripePlan[] }> = ({
  user,
  plans,
}) => {
  const subscribe = trpc.useMutation("billing.subscribeToPlan");
  const router = useRouter();

  const handleSubscribe = async (planId: string) => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) return;

    const session = await subscribe.mutateAsync({ planId });

    if (session?.type === "checkout_session") {
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );

      if (!session || !stripe) return;

      await stripe?.redirectToCheckout({ sessionId: session.id });
    } else {
      router.push("/billing/payment/success");
    }
  };

  return (
    <>
      <Head>
        <title>Billing</title>
      </Head>

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl">Billing</h1>
        <div>
          <h2 className="text-xl m-4">Manage your subscription</h2>
          <div className="grid grid-cols-2 gap-4">
            {plans?.map((plan) => (
              <div
                key={plan.id}
                className="border-2 p-4 border-black rounded-md flex flex-col gap-2"
              >
                <div className="flex flex-row justify-between items-center">
                  <h3 className="text-lg">
                    Prmium {plan.interval === "month" ? "Monthly" : "Annual"}{" "}
                    Plan
                  </h3>
                  {(!user.activeSubscription ||
                    (user.activeSubscription &&
                      user.subscriptionInterval !== plan.interval)) && (
                    <button
                      className="button button-success"
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      Subscribe
                    </button>
                  )}
                  {user.activeSubscription &&
                    user.subscriptionInterval === plan.interval && (
                      <button className="button button-primary">
                        Manage subscription
                      </button>
                    )}
                </div>
                <p className="text-sm">
                  &euro;{plan.price} /{" "}
                  <span className="text-red-500 font-bold">
                    {plan.interval}
                  </span>
                </p>
                <span className="my-4">Benefits:</span>
                <ul className="list-disc list-inside">
                  <li>Access to custom reports</li>
                  {plan.interval === "year" && (
                    <li>Save 20% compared to monthly plan</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-300 m-4">
        <a
          href="https://stripe.com"
          target="__blank"
          className="hover:underline"
        >
          Stripe
        </a>{" "}
        is used to process payments.
      </p>

      <p className="m-4 p-4 border-2 border-red-500 rounded-md">
        This is an educational project. Please do not use your real credit card.
        For testing purposes, you can use the stripe{" "}
        <Link
          href="https://stripe.com/docs/testing#testing-interactively"
          target="_blank"
        >
          <a target="_blank" className="underline">
            test cards
          </a>
        </Link>
        .
      </p>
    </>
  );
};

IndexBillingPage.getLayout = commonLayout;

export default IndexBillingPage;

export const getServerSideProps: GetServerSideProps<{
  user: User;
  plans?: StripePlan[];
}> = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session)
    return { redirect: { destination: "/auth/signin", permanent: false } };

  const user = await prisma?.user.findUnique({
    where: { id: session.user?.id },
  });

  if (!user) return { notFound: true };

  const prices = await stripeClient.prices.list({
    product: process.env.GENERAL_PLAN_ID,
  });
  const plans: StripePlan[] = prices.data.map((price) => ({
    id: price.id,
    price: price.unit_amount ? price.unit_amount / 100 : 0,
    interval: price.recurring?.interval ?? "month",
  }));

  return { props: { user, plans } };
};
