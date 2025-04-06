import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignoutButton } from "./signout-button";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";

export async function ServerComponent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return (
      <div>
        <Link className="cursor-pointer" href="/login">
          <Button>Login</Button>
        </Link>
        <Link className="cursor-pointer" href="/signup">
          <Button>Signup</Button>
        </Link>
        Not authenticated
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      {session.user.email}
      <SignoutButton />
    </div>
  );
}
