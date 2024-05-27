import { checkAuth, getServerAuthSession } from "@/server/auth";
import { SignOutButton } from "./_components/sign-out-button";

export default async function AppHome() {
  await checkAuth();

  const session = await getServerAuthSession();

  return (
    <main className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-semibold tracking-tight">User data</h1>
      <pre className="bg-muted rounded p-4 shadow">
        {JSON.stringify(session?.user, null, 2)}
      </pre>
      <SignOutButton />
    </main>
  );
}
