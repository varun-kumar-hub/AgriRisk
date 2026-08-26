"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MobileHeader } from "@/components/app-shell/mobile-header";
import { Sidebar } from "@/components/app-shell/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isAuthPage) {
    return <main className="min-h-screen w-full bg-slate-50">{children}</main>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 relative">
      {/* Mobile Top Header (Fixed at top for mobile devices) */}
      <MobileHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Collapsible Sidebar Shell & Mobile Navigation Drawer */}
      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      {/* Main Content Area - Independent Vertical Scroll */}
      <main className="flex-1 h-full overflow-y-auto min-w-0 pt-14 pb-4 lg:pt-0 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
