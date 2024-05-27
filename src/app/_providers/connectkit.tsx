"use client";

import { ConnectKitProvider as ConnectKitProviderRoot } from "connectkit";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

export function ConnectKitProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ConnectKitProviderRoot mode={resolvedTheme === "light" ? "light" : "dark"}>
      {children}
    </ConnectKitProviderRoot>
  );
}
