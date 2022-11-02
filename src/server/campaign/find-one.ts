import { Session } from "next-auth";

export const findOneCampaign = async (id?: string, session?: Session) => {
  if (!id) throw Error("id is required");
  if (!session) throw Error("session is required");

  const campaign = await prisma?.campaign.findUnique({
    where: { id: id },
    include: {
      paths: {
        include: {
          landingPage: true,
          offerPage: true,
        },
      },
    },
  });
  if (!campaign) throw Error("Campaign not found");
  if (campaign.userId !== session.user?.id) throw Error("Unauthorized");

  return campaign;
};
