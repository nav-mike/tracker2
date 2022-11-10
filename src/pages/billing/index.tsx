import { User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { GetServerSideProps } from "next/types";
import { commonLayout } from "../../components/common/Layout";
import { ProtectedPage } from "../../types/auth-required";
import { authOptions } from "../api/auth/[...nextauth]";

const IndexBillingPage: ProtectedPage<{ user: User }> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Billing</title>
      </Head>

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl">Billing</h1>
        {user.activeSubscription && <div></div>}
        {!user.activeSubscription && (
          <div>
            <h2>Subscribe to get access to all features</h2>
          </div>
        )}
      </div>
    </>
  );
};

IndexBillingPage.getLayout = commonLayout;

export default IndexBillingPage;

export const getServerSideProps: GetServerSideProps<{ user: User }> = async (
  context
) => {
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

  return { props: { user } };
};
