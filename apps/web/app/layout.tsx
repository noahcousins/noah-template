import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/lib/auth";
import "@repo/ui/styles/globals.css";
import { headers } from "next/headers";

import { Geist, Geist_Mono } from "next/font/google";

import "@repo/ui/styles/globals.css";
import { Providers } from "./providers";
import { SidebarProvider, SidebarTrigger } from "@repo/ui/components/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Squircle } from "@squircle-js/react";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo app built with Next.js and tRPC",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Serialize the session data
  const serializedSession = session
    ? {
        session: {
          ...session.session,
          createdAt: session.session.createdAt.toISOString(),
          updatedAt: session.session.updatedAt.toISOString(),
          expiresAt: session.session.expiresAt.toISOString(),
        },
        user: session.user,
      }
    : null;

  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers session={serializedSession}>
          <SidebarProvider>
            <AppSidebar />
            <main className="bg-primary/5 border border-primary/10 rounded-lg w-full m-2 p-4">
              <SidebarTrigger />

              {children}
            </main>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
