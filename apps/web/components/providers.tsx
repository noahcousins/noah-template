"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth-context";

interface ProvidersProps {
  children: React.ReactNode;
  session: any | null;
}

export function Providers({ children, session }: ProvidersProps) {
  return (
    <AuthProvider userId={session?.user?.id}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </AuthProvider>
  );
}
