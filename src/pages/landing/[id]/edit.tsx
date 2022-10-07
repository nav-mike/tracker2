import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { commonLayout } from "../../../components/common/Layout";
import { ProtectedPage } from "../../../types/auth-required";
import { authOptions } from "../../api/auth/[...nextauth]";

const EditLandingPage: ProtectedPage<{ landing: LandingPageType }> = ({
  landing,
}) => {
  console.log(landing);

  return (
    <>
      <Head>
        <title>Edit Landing Page</title>
      </Head>

      <div className="p-4">
        <h1 className="text-2xl">Edit Landing Page</h1>
      </div>
    </>
  );
};

EditLandingPage.getLayout = commonLayout;

export default EditLandingPage;

type LandingPageType = {
  id: string;
  name: string;
  countries: string[];
  offersCount: number | null;
  url: string;
};

export const getServerSideProps: GetServerSideProps<
  { landing: LandingPageType },
  { id: string }
> = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session)
    return { redirect: { destination: "/auth/signin", permanent: false } };

  const id = context.params?.id;
  if (!id) return { notFound: true };

  const landingPage = await prisma?.landingPage.findUnique({ where: { id } });
  if (!landingPage) return { notFound: true };

  return {
    props: {
      landing: {
        id: landingPage.id,
        name: landingPage.name,
        countries: landingPage.countries as string[],
        offersCount: landingPage.offersCount,
        url: landingPage.url,
      },
    },
  };
};
