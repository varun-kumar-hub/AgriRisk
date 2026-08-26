"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bot, Home, Sprout, Tractor } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

export function MobileNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const items = [
    { href: "/dashboard", label: t("navigation.dashboard"), icon: Home },
    { href: "/crop-advisor", label: t("navigation.cropAdvisor"), icon: Sprout },
    { href: "/farms", label: t("navigation.myFarms"), icon: Tractor },
    { href: "/copilot", label: t("navigation.aiCopilot"), icon: Bot },
    { href: "/alerts", label: t("navigation.alerts"), icon: Bell }
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-1 py-1 backdrop-blur-lg lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
              isActive
                ? "text-crop font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <div className={`grid size-8 place-items-center rounded-xl transition-all ${
              isActive ? "bg-crop/15 text-crop scale-105 shadow-sm" : "bg-transparent text-slate-400"
            }`}>
              <item.icon size={20} className={isActive ? "text-crop stroke-[2.5]" : "text-slate-500"} />
            </div>
            <span className={`mt-0.5 text-[10px] leading-tight tracking-tight font-extrabold max-w-[68px] truncate text-center ${
              isActive ? "text-crop font-extrabold" : "text-slate-600"
            }`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
