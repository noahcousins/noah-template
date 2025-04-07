"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { Session } from "better-auth";
import { AuthProvider } from "@/lib/auth-context";
type Props = {
  children: React.ReactNode;
  session: Session | null;
};

export function Providers({ children, session }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthProvider userId={session?.userId ?? null}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}
