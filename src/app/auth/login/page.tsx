"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Shield, Sprout, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setLoading(true);
    toast.info("Connecting to Google Auth...", "Redirecting to Google login.");
    const { error } = await signInWithGoogle();
    if (error) {
      setLoading(false);
      toast.error("Google Auth Failed", error.message);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Validation Error", "Please provide email and password.");
      return;
    }

    setLoading(true);

    if (mode === "signin") {
      const { error } = await signInWithEmail(email, password);
      setLoading(false);
      if (error) {
        toast.error("Sign In Failed", error.message);
      } else {
        toast.success("Welcome back!", "Signed in successfully.");
        router.push("/dashboard");
      }
    } else {
      const { error } = await signUpWithEmail(email, password);
      setLoading(false);
      if (error) {
        toast.error("Sign Up Failed", error.message);
      } else {
        toast.success("Account Created", "Check your email for confirmation or proceed to login.");
      }
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md border-2 border-crop/30 bg-white p-8 shadow-2xl rounded-2xl">
        {/* Header */}
        <div className="text-center">
          <span className="inline-grid size-14 place-items-center rounded-2xl bg-crop text-white shadow-lg">
            <Sprout size={32} />
          </span>
          <h1 className="mt-3 text-2xl font-extrabold text-slate-950">AgriRisk Platform</h1>
          <p className="mt-1 text-xs text-slate-500">AI-Powered Agricultural Risk & Decision Intelligence</p>
        </div>

        {/* If user is already logged in */}
        {user ? (
          <div className="mt-6 rounded-xl bg-slate-50 p-4 border border-slate-200 text-center space-y-3">
            <p className="text-xs text-slate-500 font-medium">Currently signed in as:</p>
            <p className="text-sm font-bold text-slate-900">{user.email}</p>
            <div className="flex gap-2">
              <Button onClick={() => router.push("/dashboard")} className="flex-1">
                Go to Dashboard <ArrowRight size={16} />
              </Button>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="mt-6 flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === "signin" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  mode === "signup" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white py-2.5 px-4 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-5 flex items-center justify-center">
              <span className="w-full border-t border-slate-200" />
              <span className="absolute bg-white px-3 text-[11px] font-bold uppercase text-slate-400">or with email</span>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700">Email Address</label>
                <div className="relative mt-1">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@agririsk.com"
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700">Password</label>
                <div className="relative mt-1">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-crop focus:outline-none focus:ring-2 focus:ring-crop/20"
                  />
                </div>
              </div>

              <Button type="submit" loading={loading} className="w-full mt-2">
                {mode === "signin" ? "Sign In to AgriRisk" : "Create AgriRisk Account"}
              </Button>
            </form>
          </>
        )}

        <div className="mt-6 border-t pt-4 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Shield size={14} className="text-crop" />
          <span>Secured by Supabase OAuth & End-to-End Encryption</span>
        </div>
      </Card>
    </div>
  );
}
