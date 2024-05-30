"use client";
import { useEffect, useState } from "react";
import { SiweMessage } from "siwe";
import { mainnet } from "viem/chains";
import { useAccount, useSignMessage } from "wagmi";
import { getCsrfToken, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useConnect, useDisconnect } from "wagmi";
import { useModal } from "connectkit";
import { useIsMounted } from "../_hooks/use-is-mounted";

export function SignInCard() {
  const isMounted = useIsMounted();
  const { address, isConnected } = useAccount();
  const [hasSigned, setHasSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { signMessageAsync } = useSignMessage();
  const { error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { open, setOpen } = useModal();

  useEffect(() => {
    async function handleSign() {
      try {
        const message = new SiweMessage({
          domain: window.location.host,
          uri: window.location.origin,
          version: "1",
          address: address,
          statement: process.env.NEXT_PUBLIC_SIGNIN_MESSAGE,
          nonce: await getCsrfToken(),
          chainId: mainnet.id,
        });

        const signedMessage = await signMessageAsync({
          message: message.prepareMessage(),
        });

        setHasSigned(true);

        const response = await signIn("web3", {
          message: JSON.stringify(message),
          signedMessage,
          redirect: true,
          callbackUrl: "/",
        });

        if (response?.error) {
          console.log("Error occured:", response.error);
          setIsConnecting(false);
          setIsSigning(false);
        }
      } catch (error) {
        console.log("Error Occured", error);
        setIsConnecting(false);
        setIsSigning(false);
      }
    }

    if (!hasSigned && isConnected && (open || isConnecting)) {
      setIsSigning(true);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleSign();
    }

    if (error) {
      setIsConnecting(false);
      setIsSigning(false);
    }
  }, [
    hasSigned,
    address,
    signMessageAsync,
    isConnected,
    isConnecting,
    error,
    open,
  ]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex w-full max-w-xs flex-col items-center justify-center space-y-4 rounded-lg border border-foreground p-4">
      {!isConnected && (
        <Button
          onMouseDown={() => setOpen(true)}
          disabled={isPending || isConnecting || open}
          className="w-full"
        >
          Connect Wallet
        </Button>
      )}

      {isConnected && !hasSigned && (
        <>
          <Button
            variant="default"
            onMouseDown={() => setIsConnecting(true)}
            disabled={isPending || isConnecting || isSigning}
            className="w-full"
          >
            Sign In
          </Button>
          <Button
            variant="default"
            onMouseDown={() => disconnect()}
            disabled={isPending || isConnecting || isSigning}
            className="w-full"
          >
            Disconnect
          </Button>
        </>
      )}

      {isConnected && hasSigned && (
        <div className="grid gap-2 text-center">
          <p className="text-balance font-semibold text-muted-foreground">
            Signed In Sucessfully
          </p>
          <p className="text-balance text-muted-foreground">
            Redirecting you to the dashboard...
          </p>
        </div>
      )}
    </div>
  );
}
