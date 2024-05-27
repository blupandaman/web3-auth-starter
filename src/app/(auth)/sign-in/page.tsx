import { Metadata } from "next";
import { SignInCard } from "./_components/sign-in-card";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to Web3 Auth Starter",
};

export default function SignInPage() {
  return <SignInCard />;
}
