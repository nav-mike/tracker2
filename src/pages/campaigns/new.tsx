import Head from "next/head";
import { useRouter } from "next/router";
import { SubmitHandler } from "react-hook-form";
import { commonLayout } from "../../components/common/Layout";
import CampaignForm, { FormInputs } from "../../components/form/CampaignForm";
import { ProtectedPage } from "../../types/auth-required";
import { trpc } from "../../utils/trpc";

const NewCampaignPage: ProtectedPage = () => {
  const createCampaign = trpc.useMutation("campaigns.create");
  const router = useRouter();

  const handleSubmit: SubmitHandler<FormInputs> = (data) => {
    const campaign = {
      ...data,
      countries: data.countries?.map((country) => country.value.toUpperCase()),
    };

    createCampaign
      .mutateAsync(campaign)
      .then(() => router.push("/campaigns"))
      .catch((err: Error) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>New Campaign</title>
      </Head>

      <div className="p-4">
        <h1 className="text-2xl">New Campaign</h1>
        <CampaignForm onSubmit={handleSubmit} />
      </div>
    </>
  );
};

NewCampaignPage.getLayout = commonLayout;
NewCampaignPage.auth = true;

export default NewCampaignPage;
