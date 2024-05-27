"use client";

import { ConnectKitProvider as ConnectKitProviderRoot } from "connectkit";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

export function ConnectKitProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ConnectKitProviderRoot
      mode={resolvedTheme === "light" ? "light" : "dark"}
      customTheme={{
        "--ck-border-radius": "0rem",
        "--ck-primary-button-border-radius": "0rem",
        "--ck-secondary-button-border-radius": "0rem",
        "--ck-tertiary-button-border-radius": "0rem",
      }}
    >
      {children}
    </ConnectKitProviderRoot>
  );
}
