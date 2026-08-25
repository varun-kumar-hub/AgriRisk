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
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200/80 bg-white/95 px-1 py-1.5 backdrop-blur-md lg:hidden shadow-lg">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1 text-[10px] font-bold transition-all cursor-pointer ${
              isActive ? "text-crop font-extrabold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <item.icon size={19} className={isActive ? "text-crop scale-110 transition-transform" : "text-slate-400"} />
            <span className="truncate max-w-full">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
