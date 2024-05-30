import type { Metadata } from "next";
import { SignInCard } from "./_components/sign-in-card";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sing In to Web3 Auth Starter",
};

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center py-12">
      <SignInCard />
    </main>
  );
}
