"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  CalendarSync,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  FlaskConical,
  Home,
  Lightbulb,
  LineChart,
  Map,
  Sprout,
  Tractor,
  TrendingUp,
  X,
  LogIn,
  ChevronUp
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { ProfilePopover } from "@/components/app-shell/profile-popover";
import { SignOutModal } from "@/components/modals/signout-modal";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const auth = useAuth();
  const user = auth?.user ?? null;
  const signOut = auth?.signOut ?? (async () => ({ error: null }));
  const pathname = usePathname();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);

  const groups = [
    {
      label: null,
      items: [{ href: "/dashboard", label: t("navigation.dashboard"), icon: Home }]
    },
    {
      label: t("navigation.cropSelection"),
      items: [
        { href: "/crop-advisor", label: t("navigation.cropAdvisor"), icon: Sprout },
        { href: "/crop-advisor/compare", label: t("navigation.cropComparison"), icon: BarChart3 }
      ]
    },
    {
      label: t("navigation.cropManagement"),
      items: [
        { href: "/farms", label: t("navigation.myFarms"), icon: Tractor },
        { href: "/crop-health", label: t("navigation.cropHealth"), icon: Activity },
        { href: "/crop-lifecycle", label: t("navigation.cropLifecycle"), icon: CalendarSync },
        { href: "/alerts", label: t("navigation.alerts"), icon: Bell }
      ]
    },
    {
      label: t("navigation.agriIntelligence"),
      items: [
        { href: "/recommendations", label: t("navigation.recommendations"), icon: Lightbulb },
        { href: "/risk", label: t("navigation.riskIntelligence"), icon: LineChart },
        { href: "/simulator", label: t("navigation.farmSimulator"), icon: FlaskConical },
        { href: "/risk-map", label: t("navigation.regionalRiskMap"), icon: Map },
        { href: "/intelligence/market", label: t("navigation.marketIntelligence"), icon: TrendingUp },
        { href: "/intelligence/climate", label: t("navigation.climateIntelligence"), icon: CloudSun }
      ]
    },
    {
      label: t("navigation.aiAssistant"),
      items: [
        { href: "/copilot", label: t("navigation.aiCopilot"), icon: Bot }
      ]
    }
  ];

  const handleNavClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const handleConfirmSignOut = async () => {
    setSignOutModalOpen(false);
    await signOut();
  };

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Main Collapsible Sidebar (Permanent Shell, Inner Nav Scrollable) */}
      <aside
        className={`h-full shrink-0 flex flex-col justify-between overflow-hidden border-r border-slate-200 bg-white py-4 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20 px-2" : "w-64 px-4"
        } ${
          mobileOpen
            ? "fixed inset-y-0 left-0 z-50 w-72 translate-x-0 shadow-2xl"
            : "hidden lg:flex"
        }`}
      >
        {/* Fixed Header Section */}
        <div className="shrink-0 flex items-center justify-between px-1 pb-3 border-b border-slate-100">
          <Link href="/dashboard" onClick={handleNavClick} className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-crop text-white shadow-md">
              <Sprout size={22} />
            </span>
            {(!isCollapsed || mobileOpen) && (
              <span className="animate-in fade-in duration-200">
                <span className="block text-lg font-bold text-slate-950">AgriRisk</span>
                <span className="text-xs text-slate-500 font-medium">{t("common.tagline")}</span>
              </span>
            )}
          </Link>

          {/* Desktop Collapse Toggle / Mobile Close Drawer Button */}
          {mobileOpen ? (
            <button
              onClick={onCloseMobile}
              className="grid size-8 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 cursor-pointer lg:hidden"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:grid size-8 place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-950 active:scale-95 cursor-pointer transition-all"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          )}
        </div>

        {/* Scrollable Navigation Body */}
        <nav className="flex-1 overflow-y-auto space-y-4 my-3 pr-0.5 scrollbar-none">
          {groups.map((group, idx) => (
            <div key={idx}>
              {group.label && (!isCollapsed || mobileOpen) && (
                <p className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {group.label}
                </p>
              )}
              {group.label && isCollapsed && !mobileOpen && (
                <div className="my-2 border-t border-slate-100" />
              )}
              <div className="mt-1 space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      title={isCollapsed && !mobileOpen ? item.label : undefined}
                      className={`flex items-center rounded-xl py-2.5 text-sm font-semibold transition-all duration-75 active:scale-95 cursor-pointer ${
                        isCollapsed && !mobileOpen ? "justify-center px-0" : "justify-between px-3"
                      } ${
                        isActive
                          ? "bg-crop/15 text-crop font-bold shadow-sm"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={19} className={isActive ? "text-crop shrink-0" : "text-slate-400 shrink-0"} />
                        {(!isCollapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Fixed Bottom Footer Area (Profile Card & Popover) */}
        <div className="relative shrink-0 border-t border-slate-200 pt-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setPopoverOpen(!popoverOpen)}
                className={`flex w-full items-center gap-3 rounded-2xl p-2 transition-all hover:bg-slate-100 active:scale-95 cursor-pointer text-left ${
                  isCollapsed && !mobileOpen ? "justify-center" : "justify-between"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-xl bg-crop text-white font-bold grid place-items-center text-sm shadow-sm uppercase shrink-0">
                    {user.email?.[0] || "U"}
                  </div>
                  {(!isCollapsed || mobileOpen) && (
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user.email?.split("@")[0] || "Farmer"}
                      </p>
                      <p className="text-xs text-slate-500 font-medium truncate">Farmer</p>
                    </div>
                  )}
                </div>
                {(!isCollapsed || mobileOpen) && <ChevronUp size={16} className="text-slate-400 shrink-0" />}
              </button>

              <ProfilePopover
                isOpen={popoverOpen}
                onClose={() => setPopoverOpen(false)}
                onSignOut={() => setSignOutModalOpen(true)}
                userEmail={user.email}
              />
            </div>
          ) : (
            <Link
              href="/auth/login"
              onClick={handleNavClick}
              className="flex items-center justify-center gap-2 rounded-xl bg-crop text-white font-bold text-xs py-2.5 px-3 shadow-md hover:bg-crop/90 active:scale-95 transition-all cursor-pointer w-full"
            >
              <LogIn size={15} />
              {(!isCollapsed || mobileOpen) && <span>{t("common.signIn")}</span>}
            </Link>
          )}
        </div>
      </aside>

      <SignOutModal
        isOpen={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={handleConfirmSignOut}
      />
    </>
  );
}
