import Head from "next/head";
import Layout from "../../components/common/Layout";
import { ProtectedPage } from "../../types/auth-required";

const NewLandingPage: ProtectedPage = () => {
  return (
    <>
      <Head>
        <title>New Landing Page</title>
      </Head>

      <div>
        <h1>New Landing Page</h1>
      </div>
    </>
  );
};

NewLandingPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default NewLandingPage;
