import {
  DefaultSession,
  DefaultUser,
  getServerSession,
  NextAuthOptions,
} from "next-auth";
import { env } from "@/env.js";
import CredentialsProvider from "next-auth/providers/credentials";
import { SiweMessage } from "siwe";
import { getCsrfToken } from "next-auth/react";
import { DefaultJWT } from "next-auth/jwt";
import { db } from "./db";
import { users } from "./db/schema";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      address: string | null;
    };
  }

  interface JWT {
    id: string;
    address: string | null;
  }

  interface User extends DefaultUser {
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

export type AuthSession = {
  session: {
    user: {
      id: string;
      address: string | null;
    };
  } | null;
};

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.address = user.address;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user.id = token.id;
      session.user.address = token.address;
      return session;
    },
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
          const siwe = new SiweMessage(JSON.parse(credentials?.message));

          const result = await siwe.verify({
            signature: credentials.signedMessage,
            nonce: await getCsrfToken({ req: { headers: req.headers } }),
          });

          if (!result.success) throw new Error("Invalid Signature");

          if (result.data.statement !== env.NEXT_PUBLIC_SIGNIN_MESSAGE)
            throw new Error("Statement Mismatch");

          if (new Date(result.data.expirationTime as string) < new Date())
            throw new Error("Signature Already expired");

          const user = await db.query.users.findFirst({
            where: (model, { eq }) => eq(model.address, siwe.address),
          });

          if (!user) {
            const [newUser] = await db
              .insert(users)
              .values({ address: siwe.address })
              .returning();

            return newUser ?? null;
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

export const getServerAuthSession = () => getServerSession(authOptions);
