import { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";
import { authOptions } from "@/server/auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      address: string | null;
    };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };