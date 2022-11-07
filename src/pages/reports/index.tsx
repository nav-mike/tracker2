import Head from "next/head";
import { commonLayout } from "../../components/common/Layout";
import { ProtectedPage } from "../../types/auth-required";

const IndexReportPage: ProtectedPage = () => {
  return (
    <>
      <Head>
        <title>Reports</title>
      </Head>

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl">Reports</h1>
      </div>
    </>
  );
};

IndexReportPage.getLayout = commonLayout;

export default IndexReportPage;
