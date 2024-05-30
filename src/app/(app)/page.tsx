import { checkAuth, getServerAuthSession } from "@/server/auth";
import { SignOutButton } from "./_components/sign-out-button";
import { api } from "@/trpc/server";

export default async function AppHome() {
  await checkAuth();

  const session = await getServerAuthSession();

  const hello = await api.example.hello({ text: "World" });
  const secretMessage = await api.example.getSecretMessage();

  return (
    <main className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-4">
      <div className="w-full max-w-lg rounded border p-4 text-center">
        <p>{hello.greeting}</p>
        <p>{secretMessage}</p>
      </div>

      <div className="w-full max-w-lg break-all rounded bg-muted p-4 shadow">
        <p>
          <span className="font-semibold">User ID: </span>
          <span>{session?.user.id}</span>
        </p>
        <p>
          <span className="font-semibold">Address: </span>
          <span>{session?.user.address}</span>
        </p>
      </div>

      <SignOutButton />
    </main>
  );
}
