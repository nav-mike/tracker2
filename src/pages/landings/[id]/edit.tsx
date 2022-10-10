import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { SubmitHandler } from "react-hook-form";
import { commonLayout } from "../../../components/common/Layout";
import LandingForm, {
  FormInputs,
  LandingPageType,
} from "../../../components/form/LandingForm";
import { ProtectedPage } from "../../../types/auth-required";
import { trpc } from "../../../utils/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";

const EditLandingPage: ProtectedPage<{ landing: LandingPageType }> = ({
  landing,
}) => {
  const updateLandingPage = trpc.useMutation("landingPages.update");
  const router = useRouter();

  const handleSubmit: SubmitHandler<FormInputs> = (data) => {
    const landingPage = {
      ...data,
      countries: data.countries?.map((country) => country.value.toUpperCase()),
      offersCount: data.offersCount ? +data.offersCount : null,
    };
    updateLandingPage
      .mutateAsync({ id: landing.id, landing: landingPage })
      .then(() => router.push("/landing"))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>Edit Landing Page</title>
      </Head>

      <div className="p-4">
        <h1 className="text-2xl">Edit Landing Page</h1>
        <LandingForm landingPage={landing} onSubmit={handleSubmit} />
      </div>
    </>
  );
};

EditLandingPage.getLayout = commonLayout;

export default EditLandingPage;

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
