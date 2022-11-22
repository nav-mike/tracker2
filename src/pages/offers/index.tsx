import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { commonLayout } from "../../components/common/Layout";
import Table from "../../components/common/Table/Table";
import { Report } from "../../models/report";
import { ProtectedPage } from "../../types/auth-required";
import { trpc } from "../../utils/trpc";

const IndexOfferPage: ProtectedPage = () => {
  const [data, setData] = useState<Report[]>([]);
  const offerPages = trpc.useQuery(["offerPages.index"]);
  const deleteOfferPage = trpc.useMutation("offerPages.delete");

  useEffect(() => {
    if (offerPages.data) setData(offerPages.data);
  }, [offerPages.data]);

  const handleDelete = (id: string) => {
    deleteOfferPage
      .mutateAsync({ id })
      .then(() => {
        setData(data.filter((offerPage) => offerPage.id !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>Offer Pages</title>
      </Head>

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl">Offer Pages</h1>
        <Link href="/offers/new">
          <a className="button button-success max-w-[4rem]">Create</a>
        </Link>

        <div className="flex w-full p-2">
          <Table
            type="offers"
            data={data}
            onDelete={handleDelete}
            showPreview={false}
          />
        </div>
      </div>
    </>
  );
};

IndexOfferPage.getLayout = commonLayout;
IndexOfferPage.auth = true;

export default IndexOfferPage;
