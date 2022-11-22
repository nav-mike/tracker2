import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { SubmitHandler } from "react-hook-form";
import { commonLayout } from "../../../components/common/Layout";
import CampaignForm, {
  CampaignType,
  FormInputs,
} from "../../../components/form/CampaignForm";
import { findOneCampaign } from "../../../server/campaign/find-one";
import { ProtectedPage } from "../../../types/auth-required";
import { trpc } from "../../../utils/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";

const EditCampaignPage: ProtectedPage<{ campaign: CampaignType }> = ({
  campaign,
}) => {
  const updateCampaign = trpc.useMutation("campaigns.update");
  const router = useRouter();

  const handleSubmit: SubmitHandler<FormInputs> = (data) => {
    let countries = data.countries?.map((country) =>
      country.value.toUpperCase()
    );
    if (countries?.length === 0) countries = undefined;

    const updatedCampaign = {
      ...data,
      countries,
    };
    updateCampaign
      .mutateAsync({ id: campaign.id, campaign: updatedCampaign })
      .then(() => router.push("/campaigns"))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>Edit Campaign</title>
      </Head>

      <div className="p-4">
        <h1 className="text-2xl">Edit Campaign</h1>
        <CampaignForm campaign={campaign} onSubmit={handleSubmit} />
      </div>
    </>
  );
};

EditCampaignPage.getLayout = commonLayout;
EditCampaignPage.auth = true;

export default EditCampaignPage;

export const getServerSideProps: GetServerSideProps<
  { campaign: CampaignType },
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
  try {
    const campaign = await findOneCampaign(id, session);

    return {
      props: {
        campaign: {
          id: campaign.id,
          name: campaign.name,
          countries: campaign.countries as string[],
          cost: campaign.cost,
          revenue: campaign.revenue,
          paths: campaign.paths.map((path) => ({
            id: path.id,
            landingPageId: path.landingPageId,
            offerPageId: path.offerPageId,
          })),
        },
      },
    };
  } catch (error) {
    console.log(error);
    return { notFound: true };
  }
};
