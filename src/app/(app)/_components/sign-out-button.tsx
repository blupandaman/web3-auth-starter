"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function SignOutButton() {
  const { status } = useSession();
  const isLoading = status === "loading";

  return (
    <Button disabled={isLoading} onMouseDown={() => signOut()}>
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Sign Out"}
    </Button>
  );
}
