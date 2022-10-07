import Head from "next/head";
import { commonLayout } from "../../components/common/Layout";
import { ProtectedPage } from "../../types/auth-required";
import { SubmitHandler } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import LandingForm from "../../components/form/LandingForm";

type Inputs = {
  name: string;
  countries?: { label: string; value: string }[];
  offersCount?: number;
  url: string;
};

const NewLandingPage: ProtectedPage = () => {
  const createLandingPage = trpc.useMutation("landingPages.create");
  const router = useRouter();

  const handleSubmit: SubmitHandler<Inputs> = (data) => {
    const landingPage = {
      ...data,
      countries: data.countries?.map((country) => country.value.toUpperCase()),
      offersCount: data.offersCount ? +data.offersCount : null,
    };
    createLandingPage
      .mutateAsync(landingPage)
      .then(() => router.push("/landing"))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>New Landing Page</title>
      </Head>

      <div className="p-4">
        <h1 className="text-2xl">New Landing Page</h1>
        <LandingForm onSubmit={handleSubmit} />
      </div>
    </>
  );
};

NewLandingPage.getLayout = commonLayout;

export default NewLandingPage;
