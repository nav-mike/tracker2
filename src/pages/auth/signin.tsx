import { GetServerSideProps, NextPage } from "next";
import { getProviders, signIn } from "next-auth/react";
import { SiAuth0, SiGithub, SiDiscord } from "react-icons/si";

type ProvidersProps = {
  providers: ReturnType<typeof getProviders>;
};

const providerIcon = (providerName: "Discord" | "GitHub" | "Auth0") => {
  switch (providerName) {
    case "Discord":
      return <SiDiscord />;
    case "GitHub":
      return <SiGithub />;
    case "Auth0":
      return <SiAuth0 />;
    default:
      return null;
  }
};

const SignIn: NextPage<ProvidersProps> = ({ providers }) => {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            {providerIcon(provider.name)}
          </button>
        </div>
      ))}
    </>
  );
};

export default SignIn;

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  console.log(providers);

  return { props: { providers } };
};
