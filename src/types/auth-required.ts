import { NextPageWithLayout } from "../pages/_app";

export type AuthRequired = {
  auth?: {
    unauthorized: "/auth/signin";
  };
};

export type ProtectedPage = NextPageWithLayout & AuthRequired;
