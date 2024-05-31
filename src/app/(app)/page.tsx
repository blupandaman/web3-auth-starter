import { checkAuth } from "@/server/auth";
import { api } from "@/trpc/server";
import { UpdateUsernameForm } from "./_components/update-username-form";

export default async function AppHome() {
  await checkAuth();

  const user = await api.users.me();

  return (
    <main className="flex h-full flex-1 flex-col items-center justify-center gap-4 p-4">
      <div className="w-full max-w-lg break-all rounded bg-muted p-4 shadow">
        <p className="font-semibold">User object from the database</p>
        <p>
          <span className="font-semibold">User ID: </span>
          <span>{user.id}</span>
        </p>
        <p>
          <span className="font-semibold">Address: </span>
          <span>{user.address}</span>
        </p>
        <p>
          <span className="font-semibold">Username: </span>
          <span>{user?.username ?? "..."}</span>
        </p>
      </div>

      <UpdateUsernameForm />
    </main>
  );
}
