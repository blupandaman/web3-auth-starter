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
      <div className="rounded border p-4 text-center">
        <p>{hello.greeting}</p>
        <p>{secretMessage}</p>
      </div>

      <pre className="rounded bg-muted p-4 shadow">
        {JSON.stringify(session, null, 2)}
      </pre>

      <SignOutButton />
    </main>
  );
}
