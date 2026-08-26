"use client";

import Link from "next/link";
import { Menu, Sprout, Bell, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

export function MobileHeader({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  const auth = useAuth();
  const user = auth?.user ?? null;

  return (
    <header className="fixed top-0 inset-x-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-3.5 backdrop-blur-md lg:hidden shadow-sm">
      <div className="flex items-center gap-2.5">
        {/* Mobile Drawer Menu Button (Positioned on the Left) */}
        <button
          onClick={onOpenMobileMenu}
          className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer shadow-sm"
          aria-label="Open Navigation Drawer"
        >
          <Menu size={20} />
        </button>

        {/* AgriRisk Brand Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-xl bg-crop text-white shadow-md shrink-0">
            <Sprout size={18} />
          </span>
          <div>
            <span className="font-extrabold text-base text-slate-950 leading-none block">AgriRisk</span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-tight block">AI Risk Intelligence</span>
          </div>
        </Link>
      </div>

      {/* Right Side Quick Actions: Alerts Bell & User Profile Avatar */}
      <div className="flex items-center gap-2">
        <Link
          href="/alerts"
          className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 cursor-pointer shadow-sm relative"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-emerald-500 ring-2 ring-white" />
        </Link>

        <button
          onClick={onOpenMobileMenu}
          className="grid size-9 place-items-center rounded-xl bg-crop text-white font-extrabold text-xs shadow-md uppercase active:scale-95 cursor-pointer"
          aria-label="User Profile"
        >
          {user?.email?.[0] || <UserIcon size={16} />}
        </button>
      </div>
    </header>
  );
}
