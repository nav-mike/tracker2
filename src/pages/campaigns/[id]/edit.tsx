import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { SubmitHandler } from "react-hook-form";
import { commonLayout } from "../../../components/common/Layout";
import CampaignForm, {
  CampaignType,
} from "../../../components/form/CampaignForm";
import { ProtectedPage } from "../../../types/auth-required";
import { authOptions } from "../../api/auth/[...nextauth]";

const EditCampaignPage: ProtectedPage<{ campaign: CampaignType }> = ({
  campaign,
}) => {
  console.log(campaign);

  const handleSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
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
  if (!id) return { notFound: true };

  const campaign = await prisma?.campaign.findUnique({
    where: { id: id },
    include: { paths: true },
  });
  if (!campaign) return { notFound: true };
  if (campaign.userId !== session.user?.id) return { notFound: true };

  return {
    props: {
      campaign: {
        id: campaign.id,
        name: campaign.name,
        countries: campaign.countries as string[],
        paths: campaign.paths.map((path) => ({
          id: path.id,
          landingPageId: path.landingPageId,
          offerPageId: path.offerPageId,
        })),
      },
    },
  };
};
