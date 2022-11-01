import { LandingPage } from "@prisma/client";
import { GetServerSideProps } from "next";
import platform from "platform";

const ShowLandingPagePage = () => {
  return <div>Loading...</div>;
};

export default ShowLandingPagePage;

const LOCAL_IP = "::1";
const FAKE_IP = "134.201.250.155";

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

  const ip =
    context.req.socket.remoteAddress == LOCAL_IP
      ? FAKE_IP
      : context.req.socket.remoteAddress;
  const response = await fetch(
    `http://api.ipstack.com/${ip}?access_key=${process.env.IP_STACK_API_KEY}`
  );
  const jsonData = await response.json();

  const client = platform.parse(context.req.headers["user-agent"] || "");

  const data = {
    landingPageId,
    pathId: campaign.paths[0].id,
    country: jsonData.country_code,
    os: client.os?.family || "Unknown",
    browser: client.name || "Unknown",
    device: client.product || "Unknown",
  };

  console.log(ip);

  await prisma?.visit.create({
    data,
  });

  return {
    redirect: {
      destination: campaign.paths[0].landingPage.url,
      permanent: false,
    },
  };
};
