"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Globe,
  Bell,
  Tractor,
  Bot,
  Database,
  ShieldCheck,
  HelpCircle,
  Settings
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const sections = [
    {
      group: t("settings.navAccount"),
      items: [
        { href: "/settings/profile", label: t("settings.tabProfile"), icon: User }
      ]
    },
    {
      group: t("settings.navPreferences"),
      items: [
        { href: "/settings/language", label: t("settings.tabLanguage"), icon: Globe },
        { href: "/settings/notifications", label: t("settings.tabNotifications"), icon: Bell },
        { href: "/settings/farm", label: t("settings.tabFarm"), icon: Tractor },
        { href: "/settings/ai", label: t("settings.tabAi"), icon: Bot }
      ]
    },
    {
      group: t("settings.navIntelligence"),
      items: [
        { href: "/settings/data", label: t("settings.tabData"), icon: Database }
      ]
    },
    {
      group: t("settings.navPrivacy"),
      items: [
        { href: "/settings/privacy", label: t("settings.tabPrivacy"), icon: ShieldCheck }
      ]
    },
    {
      group: t("settings.navSupport"),
      items: [
        { href: "/settings/help", label: t("settings.tabHelp"), icon: HelpCircle }
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-crop/20 text-crop shadow-xs">
            <Settings size={22} />
          </span>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950">{t("settings.title")}</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {t("settings.subtitle")}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Left Navigation Sidebar (Desktop) / Horizontal Stacked Tab Bar (Mobile) */}
        <aside className="space-y-6">
          <div className="flex overflow-x-auto pb-2 lg:block lg:space-y-6 lg:pb-0 scrollbar-none">
            {sections.map((sec, idx) => (
              <div key={idx} className="shrink-0 pr-4 lg:pr-0">
                <p className="hidden px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 lg:block">
                  {sec.group}
                </p>
                <div className="mt-1.5 flex gap-1 lg:block lg:space-y-1">
                  {sec.items.map((item) => {
                    const isActive = pathname === item.href || (item.href === "/settings/profile" && pathname === "/settings");
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                          isActive
                            ? "bg-crop/15 text-crop font-bold shadow-xs ring-1 ring-crop/30"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <item.icon size={18} className={isActive ? "text-crop shrink-0" : "text-slate-400 shrink-0"} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Child Settings Page Container */}
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
