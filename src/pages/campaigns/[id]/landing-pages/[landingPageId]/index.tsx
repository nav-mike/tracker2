import { LandingPage } from "@prisma/client";
import { GetServerSideProps } from "next";

const ShowLandingPagePage = () => {
  return <div>TODO</div>;
};

export default ShowLandingPagePage;

export const getServerSideProps: GetServerSideProps<
  { landingPage: LandingPage },
  { id: string; landingPageId: string }
> = async (context) => {
  const id = context.params?.id;
  const landingPageId = context.params?.landingPageId;

  if (!id || !landingPageId) return { notFound: true };

  const landingPage = await prisma?.landingPage.findUnique({
    where: { id: landingPageId },
  });

  if (!landingPage) return { notFound: true };

  const campaign = await prisma?.campaign.findUnique({
    where: { id },
    include: {
      paths: {
        where: { landingPageId },
        include: {
          landingPage: true,
        },
      },
    },
  });

  if (!campaign) return { notFound: true };
  if (!campaign.paths[0]) return { notFound: true };

  return {
    redirect: {
      destination: campaign.paths[0].landingPage.url,
      permanent: false,
    },
  };
};
