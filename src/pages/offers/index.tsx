import { LandingPage, OfferPage } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { commonLayout } from "../../components/common/Layout";
import Table from "../../components/common/Table/Table";
import { ProtectedPage } from "../../types/auth-required";
import { trpc } from "../../utils/trpc";

const IndexOfferPage: ProtectedPage = () => {
  const [data, setData] = useState<OfferPage[]>([]);
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
            data={data as LandingPage[]}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </>
  );
};

IndexOfferPage.getLayout = commonLayout;

export default IndexOfferPage;
