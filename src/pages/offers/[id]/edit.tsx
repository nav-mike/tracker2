import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { SubmitHandler } from "react-hook-form";
import { commonLayout } from "../../../components/common/Layout";
import OfferForm, {
  FormInputs,
  OfferPageType,
} from "../../../components/form/OfferForm";
import { ProtectedPage } from "../../../types/auth-required";
import { trpc } from "../../../utils/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";

const EditOfferPage: ProtectedPage<{ offer: OfferPageType }> = ({ offer }) => {
  const updateOfferPage = trpc.useMutation("offerPages.update");
  const router = useRouter();

  const handleSubmit: SubmitHandler<FormInputs> = (data) => {
    let countries = data.countries?.map((country) =>
      country.value.toUpperCase()
    );
    if (countries?.length === 0) countries = undefined;

    const offerPage = {
      ...data,
      countries,
    };
    updateOfferPage
      .mutateAsync({ id: offer.id, offer: offerPage })
      .then(() => router.push("/offers"))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>Edit Offer Page</title>
      </Head>

      <div className="p-4">
        <h1 className="text-2xl">Edit Offer Page</h1>
        <OfferForm offerPage={offer} onSubmit={handleSubmit} />
      </div>
    </>
  );
};

EditOfferPage.getLayout = commonLayout;
EditOfferPage.auth = true;

export default EditOfferPage;

export const getServerSideProps: GetServerSideProps<
  { offer: OfferPageType },
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

  const offer = await prisma?.offerPage.findUnique({
    where: { id },
  });
  if (!offer) return { notFound: true };
  if (offer.userId !== session.user?.id) return { notFound: true };

  return {
    props: {
      offer: {
        id: offer.id,
        name: offer.name,
        url: offer.url,
        countries: offer.countries as string[],
      },
    },
  };
};
