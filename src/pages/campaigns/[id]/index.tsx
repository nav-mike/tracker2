import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IoCopyOutline } from "react-icons/io5";
import { commonLayout } from "../../../components/common/Layout";
import { CampaignType } from "../../../components/form/CampaignForm";
import { findOneCampaign } from "../../../server/campaign/find-one";
import { ProtectedPage } from "../../../types/auth-required";
import { authOptions } from "../../api/auth/[...nextauth]";

const landingPageUrl = (campaignId: string, landingPageId: string) =>
  `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/campaigns/${campaignId}/landing-pages/${landingPageId}`;

const offerPageUrl = (campaignId: string, offerPageId: string) =>
  `${process.env.NEXT_PUBLIC_TRACKING_BASE_URL}/campaigns/${campaignId}/offer-pages/${offerPageId}`;

const ShowCampaignPage: ProtectedPage<{ campaign: CampaignType }> = ({
  campaign,
}) => {
  return (
    <>
      <Head>
        <title>Campaign - {campaign.name}</title>
      </Head>

      <div className="p-4">
        <Link href="/campaigns">
          <a className="text-blue-500">Back to campaigns</a>
        </Link>

        <h1 className="text-2xl">{campaign.name}</h1>

        <div className="flex flex-col gap-4 m-4">
          <h3>Paths</h3>
          {campaign.paths.map((path) => (
            <div
              key={path.id}
              className="grid grid-cols-2 gap-4 border-2 p-2 rounded-md bg-gray-100"
            >
              <div className="bg-white p-2 rounded-md">
                <span>{landingPageUrl(campaign.id, path.landingPageId)}</span>
                <CopyToClipboard
                  text={landingPageUrl(campaign.id, path.landingPageId)}
                >
                  <IoCopyOutline
                    title="Copy to clipboard"
                    className="cursor-pointer active:text-gray-500"
                  />
                </CopyToClipboard>
              </div>
              <div className="bg-white p-2 rounded-md">
                <span>{offerPageUrl(campaign.id, path.offerPageId)}</span>
                <CopyToClipboard
                  text={offerPageUrl(campaign.id, path.offerPageId)}
                >
                  <IoCopyOutline
                    title="Copy to clipboard"
                    className="cursor-pointer active:text-gray-500"
                  />
                </CopyToClipboard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

ShowCampaignPage.getLayout = commonLayout;

export default ShowCampaignPage;

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
