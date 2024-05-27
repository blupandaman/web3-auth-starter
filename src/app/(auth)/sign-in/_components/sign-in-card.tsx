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
    <main className="flex min-h-screen flex-col items-center justify-center space-y-4">
      {!isConnected && (
        <Button
          onClick={() => setOpen(true)}
          disabled={isPending || isConnecting || open}
        >
          Connect Wallet
        </Button>
      )}
      {isConnected && !hasSigned && (
        <>
          <Button
            variant="default"
            onClick={() => setIsConnecting(true)}
            disabled={isPending || isConnecting || isSigning}
          >
            Sign In
          </Button>
          <Button
            variant="default"
            onClick={() => disconnect()}
            disabled={isPending || isConnecting || isSigning}
          >
            Disconnect
          </Button>
        </>
      )}
    </main>
  );
}
