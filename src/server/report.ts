import { Campaign } from "@prisma/client";
import { Report } from "../models/report";

export const campaignsReport = async (campaigns: Campaign[]) => {
  const campaignIds = campaigns.map((campaign) => campaign.id);
  const visitsReport = await visitsSliceForCampaigns(campaignIds);
  const clicksReport = await clicksSliceForCampaigns(campaignIds);

  return campaigns?.map((campaign) => {
    const visits = visitsReport?.find((v) => v.campaignId === campaign.id);
    const clicks = clicksReport?.find((c) => c.campaignId === campaign.id);

    return {
      id: campaign.id,
      name: campaign.name,
      visits: visits?._count?.id || 0,
      clicks: clicks?._count?.id || 0,
      cost: visits?._sum?.cost || 0,
      revenue: clicks?._sum?.cost || 0,
      profit: profit(clicks?._sum?.cost || 0, visits?._sum?.cost || 0),
      roi: roi(clicks?._sum?.cost || 0, visits?._sum?.cost || 0),
      ctr: ctr(clicks?._count?.id || 0, visits?._count?.id || 0),
      cpv: cpv(visits?._sum?.cost || 0, visits?._count?.id || 0),
      epv: epv(clicks?._sum?.cost || 0, visits?._count?.id || 0),
      epc: epc(clicks?._sum?.cost || 0, clicks?._count?.id || 0),
    } as Report;
  });
};

const profit = (revenue: number, cost: number) => revenue - cost;
const roi = (revenue: number, cost: number) =>
  cost !== 0 ? profit(revenue, cost) / cost : 0;
const ctr = (clicks: number, visits: number) =>
  visits !== 0 ? clicks / visits : 0;
const cpv = (cost: number, visits: number) =>
  visits !== 0 ? cost / visits : 0;
const epv = (revenue: number, visits: number) =>
  visits !== 0 ? revenue / visits : 0;
const epc = (revenue: number, clicks: number) =>
  clicks !== 0 ? revenue / clicks : 0;

const visitsSliceForCampaigns = async (campaignIds: string[]) => {
  return await prisma?.visit.groupBy({
    by: ["campaignId"],
    where: {
      campaignId: {
        in: campaignIds,
      },
    },
    _count: {
      id: true,
    },
    _sum: {
      cost: true,
    },
  });
};

const clicksSliceForCampaigns = async (campaignIds: string[]) => {
  return await prisma?.click.groupBy({
    by: ["campaignId"],
    where: {
      campaignId: {
        in: campaignIds,
      },
    },
    _count: {
      id: true,
    },
    _sum: {
      cost: true,
    },
  });
};
