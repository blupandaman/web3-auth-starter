"use client";

import { env } from "@/env.js";
import { createConfig, WagmiProvider as WagmiProviderRoot } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { mainnet } from "wagmi/chains";
import type { ReactNode } from "react";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet],
    transports: {
      // TODO: add alchemy key
      // RPC URL for each chain
      // [mainnet.id]: http(
      //   `https://eth-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_ID}`,
      // ),
    },

    // Required API Keys
    walletConnectProjectId: env.NEXT_PUBLIC_PROJECT_ID,

    // Required App Info
    appName: "Blu Web3 Auth Starter",

    // Optional App Info
    appDescription: "Blu Web3 Auth Starter",
    appUrl: "https://blupm.dev", // your app's url
    appIcon:
      "https://pbs.twimg.com/profile_images/1792860645555126272/oRSGLw-U_400x400.jpg", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  }),
);

export function WagmiProvider({ children }: { children: ReactNode }) {
  return <WagmiProviderRoot config={config}>{children}</WagmiProviderRoot>;
}
