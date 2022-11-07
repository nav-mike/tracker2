import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { commonLayout } from "../../components/common/Layout";
import Table from "../../components/common/Table/Table";
import { Report } from "../../models/report";
import { ProtectedPage } from "../../types/auth-required";
import { trpc } from "../../utils/trpc";

const IndexLandingPage: ProtectedPage = () => {
  const [data, setData] = useState<Report[]>([]);
  const landingPages = trpc.useQuery(["landingPages.index"]);
  const deleteLandingPage = trpc.useMutation("landingPages.delete");

  useEffect(() => {
    if (landingPages.data) setData(landingPages.data);
  }, [landingPages.data]);

  const handleDelete = (id: string) => {
    deleteLandingPage
      .mutateAsync({ id })
      .then(() => {
        setData(data.filter((landingPage) => landingPage.id !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Head>
        <title>Landing Pages</title>
      </Head>

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl">Landing Pages</h1>
        <Link href="/landings/new">
          <a className="button button-success max-w-[4rem]">Create</a>
        </Link>

        <div className="flex w-full p-2">
          <Table type="landings" data={data} onDelete={handleDelete} />
        </div>
      </div>
    </>
  );
};

IndexLandingPage.getLayout = commonLayout;

export default IndexLandingPage;
