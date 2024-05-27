import { getServerSession, type NextAuthOptions } from "next-auth";
import { env } from "@/env.js";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { getCsrfToken } from "next-auth/react";
import { db } from "./db";
import { users } from "./db/schema";
import { redirect } from "next/navigation";
import type { DefaultJWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety. Also augments `next-auth/jwt` for types from our JWT token.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      address: string | null;
      // ...other properties
      // role: UserRole;
    };
  }

  interface User {
    address: string | null;
    // ...other properties
    // role: UserRole;
  }

  interface JWT extends DefaultJWT {
    id: string;
    address: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    address: string | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user?.id;
        token.address = user?.address;
      }
      return token;
    },
    session: async ({ session, token }) => ({
      ...session,
      user: {
        id: token.id,
        address: token.address,
      },
    }),
  },
  providers: [
    CredentialsProvider({
      id: "web3",
      name: "web3",
      credentials: {
        message: { label: "Message", type: "text" },
        signedMessage: { label: "Signed Message", type: "text" }, // aka signature
      },
      async authorize(credentials, req) {
        if (!credentials?.signedMessage || !credentials?.message) return null;

        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message) as string,
          );

          const result = await siwe.verify({
            signature: credentials.signedMessage,
            nonce: await getCsrfToken({ req: { headers: req.headers } }),
          });

          if (!result.success) throw new Error("Invalid Signature");

          if (result.data.statement !== env.NEXT_PUBLIC_SIGNIN_MESSAGE)
            throw new Error("Statement Mismatch");

          if (new Date(result.data.expirationTime!) < new Date())
            throw new Error("Signature Already expired");

          const user = await db.query.users.findFirst({
            where: (model, { eq }) => eq(model.address, siwe.address),
          });

          if (!user) {
            const [newUser] = await db
              .insert(users)
              .values({ address: siwe.address })
              .returning();

            if (!newUser) return null;

            return newUser;
          }

          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  debug: env.NODE_ENV === "development",
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);

/**
 * Helper function to redirect to sign-in if there is no session present.
 */
export async function checkAuth() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/sign-in");
}
