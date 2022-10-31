import { OfferPage } from "@prisma/client";
import { GetServerSideProps } from "next";

const ShowOfferPagePage = () => {
  return <div>Loading...</div>;
};

export default ShowOfferPagePage;

export const getServerSideProps: GetServerSideProps<
  { offerPage: OfferPage },
  { id: string; offerPageId: string }
> = async (context) => {
  const id = context.params?.id;
  const offerPageId = context.params?.offerPageId;

  if (!id || !offerPageId) return { notFound: true };

  const offerPage = await prisma?.offerPage.findUnique({
    where: { id: offerPageId },
  });

  if (!offerPage) return { notFound: true };

  const campaign = await prisma?.campaign.findUnique({
    where: { id },
    include: {
      paths: {
        where: { offerPageId },
        include: {
          offerPage: true,
        },
      },
    },
  });

  if (!campaign) return { notFound: true };
  if (!campaign.paths[0]) return { notFound: true };

  return {
    redirect: {
      destination: campaign.paths[0].offerPage.url,
      permanent: false,
    },
  };
};
