"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Home,
  Lightbulb,
  LineChart,
  Loader2,
  Map,
  Menu,
  Sprout,
  Tractor,
  X,
  LogIn,
  LogOut
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

const groups = [
  { label: "Overview", items: [{ href: "/dashboard", label: "Dashboard", icon: Home }] },
  {
    label: "Before Planting",
    items: [
      { href: "/crop-advisor", label: "Crop Advisor", icon: Sprout },
      { href: "/crop-advisor/compare", label: "Crop Comparison", icon: BarChart3 }
    ]
  },
  {
    label: "After Planting",
    items: [
      { href: "/farms", label: "My Farms", icon: Tractor },
      { href: "/crop-health", label: "Crop Health", icon: Activity },
      { href: "/alerts", label: "Alerts", icon: Bell }
    ]
  },
  {
    label: "Intelligence",
    items: [
      { href: "/recommendations", label: "Recommendations", icon: Lightbulb },
      { href: "/risk", label: "Risk Intelligence", icon: LineChart },
      { href: "/risk-map", label: "Regional Risk Map", icon: Map }
    ]
  },
  {
    label: "AI",
    items: [
      { href: "/copilot", label: "AI Copilot", icon: Bot },
      { href: "/simulator", label: "Farm Simulator", icon: FlaskConical }
    ]
  }
];

export function Sidebar() {
  const auth = useAuth();
  const user = auth?.user ?? null;
  const signOut = auth?.signOut ?? (async () => ({ error: null }));
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header Toggle Bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-crop text-white shadow-sm">
            <Sprout size={18} />
          </span>
          <span className="font-bold text-base text-slate-950">AgriRisk</span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg border border-slate-300 p-2 text-slate-700 hover:bg-slate-100 active:scale-95 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Main Collapsible Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`sticky top-0 z-50 flex h-screen shrink-0 flex-col justify-between overflow-y-auto border-r border-slate-200 bg-white py-5 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20 px-2" : "w-64 px-4"
        } ${
          mobileOpen
            ? "fixed inset-y-0 left-0 z-50 w-64 translate-x-0 shadow-2xl"
            : "hidden lg:flex"
        }`}
      >
        <div>
          {/* Header & Collapse Toggle Button */}
          <div className="flex items-center justify-between px-1">
            <Link href="/dashboard" className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-crop text-white shadow-md">
                <Sprout size={22} />
              </span>
              {!isCollapsed && (
                <span className="animate-in fade-in duration-200">
                  <span className="block text-lg font-bold text-slate-950">AgriRisk</span>
                  <span className="text-xs text-slate-500 font-medium">Decision intelligence</span>
                </span>
              )}
            </Link>

            {/* Desktop Collapse / Expand Toggle Icon */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:grid size-8 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-950 active:scale-95 cursor-pointer transition-all"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="mt-6 space-y-4">
            {groups.map((group) => (
              <div key={group.label}>
                {!isCollapsed ? (
                  <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {group.label}
                  </p>
                ) : (
                  <div className="my-2 border-t border-slate-100" />
                )}
                <div className="mt-1.5 space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const isNavigating = navigatingHref === item.href;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => handleNavClick(item.href)}
                        title={isCollapsed ? item.label : undefined}
                        className={`flex items-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
                          isCollapsed ? "justify-center px-0" : "justify-between px-3"
                        } ${
                          isActive
                            ? "bg-crop/15 text-crop font-bold shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={19} className={isActive ? "text-crop shrink-0" : "text-slate-400 shrink-0"} />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {!isCollapsed && isNavigating && (
                          <Loader2 size={14} className="animate-spin text-crop shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Auth User Profile Footer */}
        <div className="border-t border-slate-100 pt-3">
          {user ? (
            <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center" : "px-2"}`}>
              <div className="size-8 rounded-full bg-crop text-white font-bold grid place-items-center text-xs shadow-sm uppercase shrink-0">
                {user.email?.[0] || "U"}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                  <button
                    onClick={() => signOut()}
                    className="text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 mt-0.5"
                  >
                    <LogOut size={12} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className={`flex items-center gap-2 rounded-xl bg-crop text-white font-bold text-xs py-2 px-3 shadow-md hover:bg-crop/90 active:scale-95 transition-all cursor-pointer ${
                isCollapsed ? "justify-center" : "justify-center"
              }`}
            >
              <LogIn size={15} />
              {!isCollapsed && <span>Sign In / Register</span>}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
