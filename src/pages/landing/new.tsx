import Head from "next/head";
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

export default NewLandingPage;
