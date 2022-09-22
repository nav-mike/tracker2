import { NextPage } from "next";

export type AuthRequired = {
  auth?: {
    unauthorized: "/auth/signin";
  };
};

export type ProtectedPage = NextPage & AuthRequired;
