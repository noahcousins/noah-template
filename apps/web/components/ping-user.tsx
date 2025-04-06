"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { pingUser } from "@/lib/api";

export function PingUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const handlePing = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pingUser();
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Verify User</CardTitle>
        <CardDescription>
          Click the button below to verify your JWT token and get user
          information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handlePing} disabled={loading} className="w-full">
          {loading ? "Verifying..." : "Verify User"}
        </Button>

        {error && <div className="text-red-500 text-sm">Error: {error}</div>}

        {userData && (
          <div className="space-y-2">
            <h3 className="font-medium">User Information:</h3>
            <pre className="bg-muted p-2 rounded-md text-sm overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
