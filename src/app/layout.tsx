import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/app-shell/app-shell";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
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
        <AuthProvider>
          <AuthGuard>
            <ToastProvider>
              <UserInputProvider>
                <AppShell>{children}</AppShell>
              </UserInputProvider>
            </ToastProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
