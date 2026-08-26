"use client";

import Link from "next/link";
import { Menu, Sprout } from "lucide-react";

export function MobileHeader({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  return (
    <header className="fixed top-0 inset-x-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md lg:hidden shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile Drawer Menu Button (Positioned on the Left) */}
        <button
          onClick={onOpenMobileMenu}
          className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer shadow-sm"
          aria-label="Open Navigation Drawer"
        >
          <Menu size={20} />
        </button>

        {/* AgriRisk Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-crop text-white shadow-md">
            <Sprout size={20} />
          </span>
          <div>
            <span className="font-extrabold text-lg text-slate-950 leading-none block">AgriRisk</span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-tight block">AI Risk Intelligence</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
