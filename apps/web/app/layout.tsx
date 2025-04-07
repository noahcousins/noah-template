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
import { Session } from "better-auth";
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

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers session={session?.session ?? null}>
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
