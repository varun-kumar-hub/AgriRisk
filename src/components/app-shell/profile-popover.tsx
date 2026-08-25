"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { User, Settings, HelpCircle, LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface ProfilePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  userEmail?: string | null;
  userName?: string;
  userRole?: string;
}

export function ProfilePopover({
  isOpen,
  onClose,
  onSignOut,
  userEmail,
  userName = "Farmer",
  userRole = "Farmer"
}: ProfilePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-16 left-2 z-50 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className="border-b border-slate-100 p-3">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-crop text-white font-bold text-sm shadow-sm uppercase shrink-0">
            {userEmail?.[0] || "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-slate-900 truncate">
              {userName || userEmail?.split("@")[0] || "Farmer"}
            </p>
            <p className="text-xs text-slate-500 font-medium truncate">{userRole}</p>
          </div>
        </div>
      </div>

      <div className="mt-1 space-y-1 py-1 text-sm font-semibold">
        <Link
          href="/settings/profile"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <User size={16} className="text-slate-400" />
          <span>{t("settings.tabProfile")}</span>
        </Link>

        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Settings size={16} className="text-slate-400" />
          <span>{t("navigation.settings")}</span>
        </Link>

        <Link
          href="/settings/help"
          onClick={onClose}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <HelpCircle size={16} className="text-slate-400" />
          <span>{t("settings.tabHelp")}</span>
        </Link>

        <div className="my-1 border-t border-slate-100" />

        <button
          onClick={() => {
            onClose();
            onSignOut();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>{t("settings.signOut")}</span>
        </button>
      </div>
    </div>
  );
}
