import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/lib/auth";
import "./globals.css";
import { Providers } from "./providers";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Providers session={serializedSession}>{children}</Providers>
      </body>
    </html>
  );
}
