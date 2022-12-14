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
    let countries = data.countries?.map((country) =>
      country.value.toUpperCase()
    );
    if (countries?.length === 0) countries = undefined;

    const landingPage = {
      ...data,
      countries,
    };
    console.log(landingPage);
    updateLandingPage
      .mutateAsync({ id: landing.id, landing: landingPage })
      .then(() => router.push("/landings"))
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
EditLandingPage.auth = true;

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
  if (landingPage.userId !== session.user?.id) return { notFound: true };

  return {
    props: {
      landing: {
        id: landingPage.id,
        name: landingPage.name,
        countries: landingPage.countries as string[],
        url: landingPage.url,
      },
    },
  };
};
