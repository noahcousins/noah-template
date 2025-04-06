import { Geist, Geist_Mono } from "next/font/google";

import "@repo/ui/styles/globals.css";
import { Providers } from "@/components/providers";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
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
