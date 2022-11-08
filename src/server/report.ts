import { Campaign, LandingPage, OfferPage, Path, Prisma } from "@prisma/client";
import { getName } from "country-list";
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

export const landingPagesReport = async (landingPages: LandingPage[]) => {
  const landingPageIds = landingPages.map((landingPage) => landingPage.id);
  const visitsReport = await visitsSliceForLandingPages(landingPageIds);
  const clicksReport = await clicksSliceForLandingPages(landingPageIds);

  return landingPages?.map((landingPage) => {
    const visits = visitsReport?.find(
      (v) => v.landingPageId === landingPage.id
    );
    const clicks = clicksReport?.find(
      (c) => c.landingPageId === landingPage.id
    );

    return {
      id: landingPage.id,
      name: landingPage.name,
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

export const offerPagesReport = async (offerPages: OfferPage[]) => {
  const offerPageIds = offerPages.map((offerPage) => offerPage.id);
  const visitsReport = await visitsSliceForOfferPages(offerPageIds);
  const clicksReport = await clicksSliceForOfferPages(offerPageIds);

  return offerPages?.map((offerPage) => {
    const visits = visitsReport?.find((v) => v.offerPageId === offerPage.id);
    const clicks = clicksReport?.find((c) => c.offerPageId === offerPage.id);

    return {
      id: offerPage.id,
      name: offerPage.name,
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

export const pathsReport = async (
  paths: (Path & {
    campaign: Campaign;
  })[]
) => {
  const pathIds = paths.map((path) => path.id);
  const visitsReport = await visitsSliceForPaths(pathIds);
  const clicksReport = await clicksSliceForPaths(pathIds);

  return paths?.map((path) => {
    const visits = visitsReport?.find((v) => v.pathId === path.id);
    const clicks = clicksReport?.find((c) => c.pathId === path.id);

    return {
      id: path.id,
      name: `Path [${path.campaign.name}]`,
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

export const countriesReport = async (campaignIds: string[]) => {
  const visitsReport = await visitsSliceForCountry(campaignIds);
  const clicksReport = await clicksSliceForCountries(campaignIds);

  return visitsReport?.map((visit) => {
    const clicks = clicksReport?.find((c) => c.country === visit.country);

    return {
      id: visit.country,
      name: getName(visit.country),
      visits: visit._count?.id || 0,
      clicks: clicks?._count?.id || 0,
      cost: visit._sum?.cost || 0,
      revenue: clicks?._sum?.cost || 0,
      profit: profit(clicks?._sum?.cost || 0, visit._sum?.cost || 0),
      roi: roi(clicks?._sum?.cost || 0, visit._sum?.cost || 0),
      ctr: ctr(clicks?._count?.id || 0, visit._count?.id || 0),
      cpv: cpv(visit._sum?.cost || 0, visit._count?.id || 0),
      epv: epv(clicks?._sum?.cost || 0, visit._count?.id || 0),
      epc: epc(clicks?._sum?.cost || 0, clicks?._count?.id || 0),
    } as Report;
  });
};

export const osReport = async (campaignIds: string[]) => {
  const visitsReport = await visitsSliceForOs(campaignIds);
  const clicksReport = await clicksSliceForOs(campaignIds);

  return visitsReport?.map((visit) => {
    const clicks = clicksReport?.find((c) => c.os === visit.os);

    return {
      id: visit.os,
      name: visit.os,
      visits: visit._count?.id || 0,
      clicks: clicks?._count?.id || 0,
      cost: visit._sum?.cost || 0,
      revenue: clicks?._sum?.cost || 0,
      profit: profit(clicks?._sum?.cost || 0, visit._sum?.cost || 0),
      roi: roi(clicks?._sum?.cost || 0, visit._sum?.cost || 0),
      ctr: ctr(clicks?._count?.id || 0, visit._count?.id || 0),
      cpv: cpv(visit._sum?.cost || 0, visit._count?.id || 0),
      epv: epv(clicks?._sum?.cost || 0, visit._count?.id || 0),
      epc: epc(clicks?._sum?.cost || 0, clicks?._count?.id || 0),
    } as Report;
  });
};

export const browsersReport = async (campaignIds: string[]) => {
  const visitsReport = await visitsSliceForBrowsers(campaignIds);
  const clicksReport = await clicksSliceForBrowsers(campaignIds);

  return visitsReport?.map((visit) => {
    const clicks = clicksReport?.find((c) => c.browser === visit.browser);

    return {
      id: visit.browser,
      name: visit.browser,
      visits: visit._count?.id || 0,
      clicks: clicks?._count?.id || 0,
      cost: visit._sum?.cost || 0,
      revenue: clicks?._sum?.cost || 0,
      profit: profit(clicks?._sum?.cost || 0, visit._sum?.cost || 0),
      roi: roi(clicks?._sum?.cost || 0, visit._sum?.cost || 0),
      ctr: ctr(clicks?._count?.id || 0, visit._count?.id || 0),
      cpv: cpv(visit._sum?.cost || 0, visit._count?.id || 0),
      epv: epv(clicks?._sum?.cost || 0, visit._count?.id || 0),
      epc: epc(clicks?._sum?.cost || 0, clicks?._count?.id || 0),
    } as Report;
  });
};

export const devicesReport = async (campaignIds: string[]) => {
  const visitsReport = await visitsSliceForDevices(campaignIds);
  const clicksReport = await clicksSliceForDevices(campaignIds);

  return visitsReport?.map((visit) => {
    const clicks = clicksReport?.find((c) => c.device === visit.device);

    return {
      id: visit.device,
      name: visit.device,
      visits: visit._count?.id || 0,
      clicks: clicks?._count?.id || 0,
      cost: visit._sum?.cost || 0,
      revenue: clicks?._sum?.cost || 0,
      profit: profit(clicks?._sum?.cost || 0, visit._sum?.cost || 0),
      roi: roi(clicks?._sum?.cost || 0, visit._sum?.cost || 0),
      ctr: ctr(clicks?._count?.id || 0, visit._count?.id || 0),
      cpv: cpv(visit._sum?.cost || 0, visit._count?.id || 0),
      epv: epv(clicks?._sum?.cost || 0, visit._count?.id || 0),
      epc: epc(clicks?._sum?.cost || 0, clicks?._count?.id || 0),
    } as Report;
  });
};

export const datesReport = async (campaignIds: string[]) => {
  const visitsReport = await visitsSliceForDates(campaignIds);
  const clicksReport = await clicksSliceForDates(campaignIds);

  return visitsReport?.map((visit) => {
    const clicks = clicksReport?.find((c) => c.date === visit.date);

    return {
      id: visit.date.toLocaleDateString(),
      name: visit.date.toLocaleDateString(),
      visits: visit._count?.id || 0,
      clicks: clicks?._count?.id || 0,
      cost: visit._sum?.cost || 0,
      revenue: clicks?._sum?.cost || 0,
      profit: profit(clicks?._sum?.cost || 0, visit._sum?.cost || 0),
      roi: roi(clicks?._sum?.cost || 0, visit._sum?.cost || 0),
      ctr: ctr(clicks?._count?.id || 0, visit._count?.id || 0),
      cpv: cpv(visit._sum?.cost || 0, visit._count?.id || 0),
      epv: epv(clicks?._sum?.cost || 0, visit._count?.id || 0),
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

const visitsSliceForPaths = async (pathIds: string[]) => {
  return await prisma?.visit.groupBy({
    by: ["pathId"],
    _count: {
      id: true,
    },
    _sum: {
      cost: true,
    },
    where: {
      pathId: {
        in: pathIds,
      },
    },
  });
};

const clicksSliceForPaths = async (pathIds: string[]) => {
  return await prisma?.click.groupBy({
    by: ["pathId"],
    _count: {
      id: true,
    },
    _sum: {
      cost: true,
    },
    where: {
      pathId: {
        in: pathIds,
      },
    },
  });
};

const visitsSliceForOfferPages = async (offerPageIds: string[]) => {
  return await prisma?.visit.groupBy({
    by: ["offerPageId"],
    _count: {
      id: true,
    },
    _sum: {
      cost: true,
    },
    where: {
      offerPageId: {
        in: offerPageIds,
      },
    },
  });
};

const clicksSliceForOfferPages = async (offerPageIds: string[]) => {
  return await prisma?.click.groupBy({
    by: ["offerPageId"],
    _count: {
      id: true,
    },
    _sum: {
      cost: true,
    },
    where: {
      offerPageId: {
        in: offerPageIds,
      },
    },
  });
};

const visitsSliceForLandingPages = async (landingPageIds: string[]) => {
  return await prisma?.visit.groupBy({
    by: ["landingPageId"],
    where: {
      landingPageId: {
        in: landingPageIds,
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

const clicksSliceForLandingPages = async (landingPageIds: string[]) => {
  return await prisma?.click.groupBy({
    by: ["landingPageId"],
    where: {
      landingPageId: {
        in: landingPageIds,
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

const visitsSliceForCountry = async (campaignIds: string[]) => {
  return await prisma?.visit.groupBy({
    by: ["country"],
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

const clicksSliceForCountries = async (campaignIds: string[]) => {
  return await prisma?.click.groupBy({
    by: ["country"],
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

const visitsSliceForOs = async (campaignIds: string[]) => {
  return await prisma?.visit.groupBy({
    by: ["os"],
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

const clicksSliceForOs = async (campaignIds: string[]) => {
  return await prisma?.click.groupBy({
    by: ["os"],
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

const visitsSliceForBrowsers = async (campaignIds: string[]) => {
  return await prisma?.visit.groupBy({
    by: ["browser"],
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

const clicksSliceForBrowsers = async (campaignIds: string[]) => {
  return await prisma?.click.groupBy({
    by: ["browser"],
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

const visitsSliceForDevices = async (campaignIds: string[]) => {
  return await prisma?.visit.groupBy({
    by: ["device"],
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

const clicksSliceForDevices = async (campaignIds: string[]) => {
  return await prisma?.click.groupBy({
    by: ["device"],
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

type DatesReport = {
  date: Date;
  _count: {
    id: number;
  };
  _sum: {
    cost: number;
  };
};

const visitsSliceForDates = async (campaignIds: string[]) => {
  if (!prisma) throw new Error("Prisma is not initialized");

  return await prisma.$queryRaw<DatesReport[]>`
    SELECT DATE(createdAt) as date, COUNT(id) as _count, SUM(cost) as _sum
    FROM Visit
    WHERE campaignId IN (${Prisma.join(campaignIds)})
    GROUP BY DATE(createdAt)
  `;
};

const clicksSliceForDates = async (campaignIds: string[]) => {
  if (!prisma) throw new Error("Prisma is not initialized");

  return await prisma.$queryRaw<DatesReport[]>`
    SELECT DATE(createdAt) as date, COUNT(id) as _count, SUM(cost) as _sum
    FROM Click
    WHERE campaignId IN (${Prisma.join(campaignIds)})
    GROUP BY DATE(createdAt)
  `;
};
