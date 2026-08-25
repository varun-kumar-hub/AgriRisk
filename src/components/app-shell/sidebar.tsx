"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, Bell, Bot, FlaskConical, Home, Lightbulb, LineChart, Loader2, Map, Sprout, Tractor } from "lucide-react";

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
  const pathname = usePathname();
  const [navigatingHref, setNavigatingHref] = useState<string | null>(null);

  const handleNavClick = (href: string) => {
    if (href !== pathname) {
      setNavigatingHref(href);
      setTimeout(() => setNavigatingHref(null), 800);
    }
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between overflow-y-auto border-r border-slate-200 bg-white px-4 py-5 lg:flex">
      <div>
        <Link href="/dashboard" className="flex items-center gap-3 px-2">
          <span className="grid size-10 place-items-center rounded-xl bg-crop text-white shadow-md">
            <Sprout size={22} />
          </span>
          <span>
            <span className="block text-lg font-bold text-slate-950">AgriRisk</span>
            <span className="text-xs text-slate-500 font-medium">Decision intelligence</span>
          </span>
        </Link>
        <nav className="mt-6 space-y-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{group.label}</p>
              <div className="mt-1.5 space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const isNavigating = navigatingHref === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-150 active:scale-95 cursor-pointer ${
                        isActive
                          ? "bg-crop/15 text-crop font-bold shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={isActive ? "text-crop" : "text-slate-400"} />
                        <span>{item.label}</span>
                      </div>
                      {isNavigating && <Loader2 size={14} className="animate-spin text-crop" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-slate-100 pt-3 px-2 text-xs font-semibold text-slate-400 flex justify-between items-center">
        <span>AgriRisk v2.0 Platform</span>
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </aside>
  );
}
