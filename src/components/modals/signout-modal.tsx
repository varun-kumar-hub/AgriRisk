"use client";

import { LogOut } from "lucide-react";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SignOutModal({ isOpen, onClose, onConfirm }: SignOutModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-100 text-red-600 shadow-sm">
            <LogOut size={24} />
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            {t("settings.signOutConfirmTitle")}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            {t("settings.signOutConfirmDesc")}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            {t("settings.cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
          >
            {t("settings.signOut")}
          </button>
        </div>
      </div>
    </div>
  );
}
