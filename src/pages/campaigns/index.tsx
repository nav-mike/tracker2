import Head from "next/head";
import Link from "next/link";
import { commonLayout } from "../../components/common/Layout";
import { ProtectedPage } from "../../types/auth-required";

const IndexCampaignPage: ProtectedPage = () => {
  return (
    <>
      <Head>
        <title>Campaigns</title>
      </Head>

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl">Campaigns</h1>
        <Link href="/campaings/new">
          <a className="button button-success max-w-[4rem]">Create</a>
        </Link>

        <div className="flex w-full p-2">
          <p>TODO: Campaigns Table</p>
        </div>
      </div>
    </>
  );
};

IndexCampaignPage.getLayout = commonLayout;

export default IndexCampaignPage;
