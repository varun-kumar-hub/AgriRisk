import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MobileNav } from "@/components/app-shell/mobile-nav";
import { Sidebar } from "@/components/app-shell/sidebar";
import { UserInputProvider } from "@/components/providers/user-input-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgriRisk",
  description: "AI-powered agricultural decision and risk intelligence platform",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <UserInputProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="min-w-0 flex-1 pb-20 lg:pb-0">{children}</main>
            <MobileNav />
          </div>
        </UserInputProvider>
      </body>
    </html>
  );
}

