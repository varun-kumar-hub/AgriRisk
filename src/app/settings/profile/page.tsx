"use client";

import { useEffect, useState } from "react";
import { User, Mail, MapPin, Briefcase, Camera, Check } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/i18n-context";

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const { t } = useTranslation();

  const [name, setName] = useState("Varun Kumar");
  const [email, setEmail] = useState(user?.email || "varun.kumar@agririsk.io");
  const [role, setRole] = useState("Farmer");
  const [location, setLocation] = useState("Durg, Chhattisgarh");
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      setName(user.user_metadata?.full_name || user.email.split("@")[0]);
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name, role, location })
      });
      setSavedSuccess(true);
      toast.success("Profile Updated", "Your profile details have been saved.");
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      toast.error("Update Failed", "Could not save profile changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-slate-200 bg-white p-6 shadow-sm">
      <CardTitle className="text-xl font-bold">{t("settings.tabProfile")}</CardTitle>
      <p className="mt-1 text-xs font-medium text-slate-500">
        Manage your public identity, user role, and primary agricultural region.
      </p>

      {/* Avatar Header */}
      <div className="mt-6 flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="relative">
          <div className="grid size-20 place-items-center rounded-2xl bg-crop text-white text-3xl font-extrabold shadow-md uppercase">
            {email[0]}
          </div>
          <button className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-lg bg-slate-900 text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all cursor-pointer">
            <Camera size={14} />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{name}</h2>
          <p className="text-sm text-slate-500 font-medium">{email}</p>
          <span className="mt-1 inline-block rounded-full bg-crop/15 px-3 py-0.5 text-xs font-extrabold text-crop">
            {role}
          </span>
        </div>
      </div>

      {/* Form Fields */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Full Name
          </label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-2.5 text-slate-400">
              <User size={18} />
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Email Address (Authenticated)
          </label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-2.5 text-slate-400">
              <Mail size={18} />
            </span>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Agricultural Role
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Briefcase size={18} />
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
              >
                <option value="Farmer">Farmer</option>
                <option value="Agronomist">Agronomist</option>
                <option value="Researcher">Researcher</option>
                <option value="Agribusiness">Agribusiness</option>
                <option value="Lender/Insurance">Lender / Insurance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Location
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <MapPin size={18} />
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 text-sm font-semibold focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Button onClick={handleSave} loading={loading}>
          {savedSuccess ? <Check size={16} /> : null}
          {savedSuccess ? "Saved!" : t("settings.saveChanges")}
        </Button>
      </div>
    </Card>
  );
}
