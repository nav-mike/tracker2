import { useSession } from "next-auth/react";
import { FC, ReactNode } from "react";

const Auth: FC<{ children: ReactNode }> = ({ children }) => {
  const { status } = useSession({ required: true });

  if (status === "loading") return <div>Loading...</div>;

  return <>{children}</>;
};

export default Auth;
