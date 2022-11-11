import { User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { GetServerSideProps } from "next/types";
import { commonLayout } from "../../components/common/Layout";
import { stripeClient } from "../../server/billing/stripe";
import { ProtectedPage } from "../../types/auth-required";
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
                      user.subscriptionInterval === plan.interval)) && (
                    <button className="button button-success">Subscribe</button>
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
