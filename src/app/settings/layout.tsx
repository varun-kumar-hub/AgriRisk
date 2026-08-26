"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Globe,
  Bell,
  Tractor,
  Bot,
  Database,
  ShieldCheck,
  HelpCircle,
  Settings,
  ChevronDown
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
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

  const currentHref = pathname === "/settings" ? "/settings/profile" : pathname;

  return (
    <div className="mx-auto max-w-7xl px-3.5 py-4 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <header className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 sm:size-10 place-items-center rounded-2xl bg-crop/20 text-crop shadow-xs shrink-0">
            <Settings size={20} className="sm:size-[22px]" />
          </span>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-950 truncate tracking-tight">
              {t("settings.title")}
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm font-medium text-slate-500 truncate">
              {t("settings.subtitle")}
            </p>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Dropdown Menu (Replaces horizontal tabs for clean mobile fit) */}
      <div className="mt-4 lg:hidden">
        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
          Select Settings Section
        </label>
        <div className="relative">
          <select
            value={currentHref}
            onChange={(e) => router.push(e.target.value)}
            className="w-full rounded-xl border-2 border-crop/40 bg-white px-3.5 py-3 text-sm font-bold text-slate-900 shadow-sm focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20 cursor-pointer appearance-none pr-10"
          >
            {sections.map((sec, idx) => (
              <optgroup key={idx} label={sec.group}>
                {sec.items.map((item) => (
                  <option key={item.href} value={item.href}>
                    {item.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-crop">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* Desktop Main Grid */}
      <div className="mt-4 lg:mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block space-y-6">
          {sections.map((sec, idx) => (
            <div key={idx}>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {sec.group}
              </p>
              <div className="mt-1.5 space-y-1">
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
        </aside>

        {/* Child Settings Page Container */}
        <main className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
