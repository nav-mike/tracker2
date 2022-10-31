import { Campaign, LandingPage } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { commonLayout } from "../../components/common/Layout";
import Table from "../../components/common/Table/Table";
import { ProtectedPage } from "../../types/auth-required";
import { trpc } from "../../utils/trpc";

const IndexCampaignPage: ProtectedPage = () => {
  const [data, setData] = useState<Campaign[]>([]);
  const campaigns = trpc.useQuery(["campaigns.index"]);
  const deleteCampauign = trpc.useMutation("campaigns.delete");

  useEffect(() => {
    if (campaigns.data) setData(campaigns.data);
  }, [campaigns.data]);

  const handleDelete = (id: string) => {
    deleteCampauign
      .mutateAsync({ id })
      .then(() => {
        setData(data.filter((campaign) => campaign.id !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>Campaigns</title>
      </Head>

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl">Campaigns</h1>
        <Link href="/campaigns/new">
          <a className="button button-success max-w-[4rem]">Create</a>
        </Link>

        <div className="flex w-full p-2">
          <Table
            type="campaigns"
            data={data as unknown as LandingPage[]}
            showPreview={true}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
};

IndexCampaignPage.getLayout = commonLayout;

export default IndexCampaignPage;
