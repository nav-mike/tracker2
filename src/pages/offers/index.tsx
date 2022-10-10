import Head from "next/head";
import { commonLayout } from "../../components/common/Layout";
import { ProtectedPage } from "../../types/auth-required";

const IndexOfferPage: ProtectedPage = () => {
  return (
    <>
      <Head>
        <title>Offer Pages</title>
      </Head>

      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl">Offer Pages</h1>
      </div>
    </>
  );
};

IndexOfferPage.getLayout = commonLayout;

export default IndexOfferPage;
