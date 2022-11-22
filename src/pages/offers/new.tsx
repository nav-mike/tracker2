import Head from "next/head";
import { useRouter } from "next/router";
import { SubmitHandler } from "react-hook-form";
import { commonLayout } from "../../components/common/Layout";
import OfferForm, { FormInputs } from "../../components/form/OfferForm";
import { ProtectedPage } from "../../types/auth-required";
import { trpc } from "../../utils/trpc";

const NewOfferPage: ProtectedPage = () => {
  const createOfferPage = trpc.useMutation("offerPages.create");
  const router = useRouter();

  const handleSubmit: SubmitHandler<FormInputs> = (data) => {
    const offerPage = {
      ...data,
      countries: data.countries?.map((country) => country.value.toUpperCase()),
    };
    createOfferPage
      .mutateAsync(offerPage)
      .then(() => router.push("/offers"))
      .catch((err: Error) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>New Offer Page</title>
      </Head>

      <div className="p-4">
        <h1 className="text-2xl">New Offer Page</h1>
        <OfferForm onSubmit={handleSubmit} />
      </div>
    </>
  );
};

NewOfferPage.getLayout = commonLayout;
NewOfferPage.auth = true;

export default NewOfferPage;
