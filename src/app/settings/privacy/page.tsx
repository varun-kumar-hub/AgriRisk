"use client";

import { useState } from "react";
import { ShieldCheck, LogOut, Trash2, AlertTriangle, Check, X } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Card, CardTitle } from "@/components/ui/card";
import { SignOutModal } from "@/components/modals/signout-modal";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function PrivacySettingsPage() {
  const { user, signOut } = useAuth();
  const toast = useToast();
  const { t } = useTranslation();

  const [personalization, setPersonalization] = useState(true);
  const [signOutModalOpen, setSignOutModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Invalid Confirmation", "Please type DELETE in all uppercase to confirm.");
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmText: "DELETE" })
      });
      if (res.ok) {
        toast.success("Account Deleted", "Your account and data have been permanently removed.");
        window.location.href = "/auth/login";
      } else {
        toast.error("Deletion Error", "Could not delete account.");
      }
    } catch (e) {
      toast.error("Deletion Error", "Could not process account deletion.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 bg-white p-6 shadow-sm">
        <CardTitle className="text-xl font-bold">{t("settings.tabPrivacy")}</CardTitle>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Manage your authentication sessions, AI data personalization, and account privacy options.
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-sm font-bold text-slate-900">AI Data Personalization</p>
              <p className="text-xs text-slate-500 font-medium">Allows AgriRisk Copilot to use your farm and crop parameters for relevant recommendations</p>
            </div>
            <button
              onClick={() => setPersonalization(!personalization)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                personalization ? "bg-crop" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  personalization ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Authentication Session</p>
            <div className="mt-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">{user?.email || "Current User"}</p>
                <p className="text-xs text-slate-500">Active now · Chrome on Windows</p>
              </div>
              <button
                onClick={() => setSignOutModalOpen(true)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {t("settings.signOut")}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border border-red-200 bg-red-50/40 p-6 shadow-sm">
        <CardTitle className="text-lg font-bold text-red-900">{t("settings.dangerZone")}</CardTitle>
        <p className="mt-1 text-xs font-medium text-red-700">
          Destructive actions. Deleting your account will permanently remove all associated farm records, simulations, and AI chat history.
        </p>

        <div className="mt-5 flex justify-end">
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:bg-red-700 active:scale-95 transition-all cursor-pointer"
          >
            <Trash2 size={16} />
            {t("settings.deleteAccount")}
          </button>
        </div>
      </Card>

      <SignOutModal
        isOpen={signOutModalOpen}
        onClose={() => setSignOutModalOpen(false)}
        onConfirm={async () => {
          setSignOutModalOpen(false);
          await signOut();
        }}
      />

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-red-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-100 text-red-600 shadow-sm">
                <AlertTriangle size={24} />
              </span>
              <h2 className="mt-4 text-xl font-extrabold text-red-900">
                Delete your account?
              </h2>
              <p className="mt-2 text-xs font-medium text-slate-600">
                This action cannot be undone. Your profile, farms, crop cycles, recommendations, and AI Copilot history will be permanently deleted.
              </p>
            </div>

            <div className="mt-5">
              <label className="block text-xs font-bold text-slate-700">
                {t("settings.typeDelete")}
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="mt-1.5 w-full rounded-xl border border-slate-300 p-2.5 text-sm font-bold focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
              >
                {t("settings.cancel")}
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteConfirmText !== "DELETE" || deleting}
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white shadow-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer"
              >
                {deleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
