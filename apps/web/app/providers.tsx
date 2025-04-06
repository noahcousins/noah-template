"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { api, trpcClient } from "@/lib/trpc/client";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  session: {
    session: {
      id: string;
      createdAt: string;
      updatedAt: string;
      userId: string;
      expiresAt: string;
      token: string;
      ipAddress?: string | null;
      userAgent?: string | null;
    };
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  } | null;
};

export function Providers({ children, session }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {children}
      </api.Provider>
    </QueryClientProvider>
  );
}
