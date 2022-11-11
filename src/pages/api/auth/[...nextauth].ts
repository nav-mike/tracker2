import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GitHubProvider from "next-auth/providers/github";
import Auth0Provider from "next-auth/providers/auth0";
import Stripe from "stripe";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.subscribed = user.activeSubscription as boolean;
      }
      return session;
    },
  },
  events: {
    createUser: async (message) => {
      if (!process.env.STRIPE_SECRET_KEY) return;

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2022-08-01",
      });

      const params: Stripe.CustomerCreateParams = {
        email: message.user.email ?? undefined,
        name: message.user.name ?? undefined,
        metadata: {
          userId: message.user.id,
        },
      };
      const customer = await stripe.customers.create(params);

      await prisma.user.update({
        where: {
          id: message.user.id,
        },
        data: {
          customerId: customer.id,
        },
      });
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
    Auth0Provider({
      clientId: env.AUTH0_CLIENT_ID,
      clientSecret: env.AUTH0_CLIENT_SECRET,
      issuer: env.AUTH0_ISSUER,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
