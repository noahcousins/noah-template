"use client";

import { Button } from "@repo/ui/components/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      });
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      className="w-full justify-start"
    >
      Sign out
    </Button>
  );
}
