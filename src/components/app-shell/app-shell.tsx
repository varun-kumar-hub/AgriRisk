"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MobileHeader } from "@/components/app-shell/mobile-header";
import { Sidebar } from "@/components/app-shell/sidebar";
import { FloatingCopilot } from "@/components/copilot/floating-copilot";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalonePage = pathname === "/" || pathname.startsWith("/auth");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isStandalonePage) {
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

      {/* Global Floating AI Copilot Assistant Widget (Available in Every Section) */}
      <FloatingCopilot />
    </div>
  );
}
