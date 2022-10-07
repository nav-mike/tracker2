import Head from "next/head";
import { commonLayout } from "../../../components/common/Layout";
import { ProtectedPage } from "../../../types/auth-required";

const EditLandingPage: ProtectedPage = () => {
  return (
    <>
      <Head>
        <title>Edit Landing Page</title>
      </Head>

      <div className="p-4">
        <h1 className="text-2xl">Edit Landing Page</h1>
      </div>
    </>
  );
};

EditLandingPage.getLayout = commonLayout;

export default EditLandingPage;
