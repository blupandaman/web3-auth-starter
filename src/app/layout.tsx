import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import { WagmiProvider } from "./_providers/wagmi";
import { ConnectKitProvider } from "./_providers/connectkit";
import { NextAuthProvider } from "./_providers/next-auth";

export const metadata = {
  title: "Web3 Auth Starter",
  description:
    "A Next.js starter kit that has Web3 based authentication through NextAuth JWTs, tRPC, and Drizzle with Postgres set up. Created by Blu | @blupandaman.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <WagmiProvider>
          <NextAuthProvider>
            <TRPCReactProvider>
              <ConnectKitProvider>{children}</ConnectKitProvider>
            </TRPCReactProvider>
          </NextAuthProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
