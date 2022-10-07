import { NextPageWithLayout } from "../pages/_app";

export type AuthRequired = {
  auth?: {
    unauthorized: "/auth/signin";
  };
};

export type ProtectedPage<
  P = Record<string, unknown>,
  IP = P
> = NextPageWithLayout<P, IP> & AuthRequired;
