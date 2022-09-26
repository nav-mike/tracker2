import { GetServerSideProps } from "next";
import { getProviders, signIn } from "next-auth/react";
import { SiAuth0, SiGithub, SiDiscord } from "react-icons/si";
import Layout from "../../components/auth/Layout";
import { NextPageWithLayout } from "../_app";

type ProvidersProps = {
  providers: Awaited<ReturnType<typeof getProviders>>;
};

const providerIcon = (providerName: string) => {
  switch (providerName) {
    case "Discord":
      return <SiDiscord size={40} />;
    case "GitHub":
      return <SiGithub size={40} />;
    case "Auth0":
      return <SiAuth0 size={40} />;
    default:
      return null;
  }
};

const SignIn: NextPageWithLayout<ProvidersProps> = ({ providers }) => {
  return (
    <>
      <div className="p-5 flex flex-col justify-center items-center">
        <h1 className="text-6xl m-4">Sign In</h1>
        <div className="m-4 italic">
          To log in use one of the providers below
        </div>
        <div className="flex justify-evenly w-full m-4">
          {providers &&
            Object.values(providers).map((provider) => (
              <div key={provider.name} className="hover:text-gray-500">
                <button onClick={() => signIn(provider.id)}>
                  {providerIcon(provider.name)}
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

SignIn.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  console.log(providers);

  return { props: { providers } };
};
