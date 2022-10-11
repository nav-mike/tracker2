import Head from "next/head";
import Link from "next/link";
import { commonLayout } from "../../components/common/Layout";
import OfferForm from "../../components/form/OfferForm";
import { ProtectedPage } from "../../types/auth-required";

const IndexOfferPage: ProtectedPage = () => {
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
          <p>TODO</p>
        </div>
      </div>
    </>
  );
};

IndexOfferPage.getLayout = commonLayout;

export default IndexOfferPage;
