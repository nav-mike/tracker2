import { NextPageWithLayout } from "../pages/_app";

export type AuthRequired = {
  auth?: true;
};

export type ProtectedPage<
  P = Record<string, unknown>,
  IP = P
> = NextPageWithLayout<P, IP> & AuthRequired;
