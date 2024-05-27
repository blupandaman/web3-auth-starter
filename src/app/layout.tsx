import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "@/trpc/react";
import { WagmiProvider } from "./_providers/wagmi";
import { ConnectKitProvider } from "./_providers/connectkit";

export const metadata = {
  title: "Blu Web3 Auth Starter",
  description:
    "A starter kit that has Web3 based authentication and a database hooked up.",
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
          <TRPCReactProvider>
            <ConnectKitProvider>{children}</ConnectKitProvider>
          </TRPCReactProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
