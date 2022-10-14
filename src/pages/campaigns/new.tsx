import Head from "next/head";
import { SubmitHandler } from "react-hook-form";
import { commonLayout } from "../../components/common/Layout";
import CampaignForm, { FormInputs } from "../../components/form/CampaignForm";
import { ProtectedPage } from "../../types/auth-required";

const NewCampaignPage: ProtectedPage = () => {
  const handleSubmit: SubmitHandler<FormInputs> = (data) => console.log(data);

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

export default NewCampaignPage;
