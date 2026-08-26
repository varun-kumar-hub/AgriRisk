"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithEmail: (email: string, pass: string) => Promise<{ error: any }>;
  signUpWithEmail: (email: string, pass: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Deep Link & OAuth Listener for Android Native App
    let appUrlListener: any = null;
    if (Capacitor.isNativePlatform()) {
      appUrlListener = App.addListener("appUrlOpen", async (event) => {
        const url = event.url;
        if (url && (url.includes("auth/callback") || url.includes("access_token=") || url.includes("code="))) {
          try {
            await Browser.close();
          } catch (e) {}

          if (url.includes("code=")) {
            try {
              const parsedUrl = new URL(url);
              const code = parsedUrl.searchParams.get("code");
              if (code) {
                await supabase.auth.exchangeCodeForSession(code);
              }
            } catch (err) {
              console.error("Failed to parse auth code from deep link:", err);
            }
          } else if (url.includes("#access_token=")) {
            try {
              const hashParams = new URLSearchParams(url.split("#")[1]);
              const accessToken = hashParams.get("access_token");
              const refreshToken = hashParams.get("refresh_token");
              if (accessToken && refreshToken) {
                await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken
                });
              }
            } catch (err) {
              console.error("Failed to parse tokens from deep link:", err);
            }
          }
        }
      });
    }

    return () => {
      subscription.unsubscribe();
      if (appUrlListener) {
        appUrlListener.remove();
      }
    };
  }, [supabase]);

  const signInWithGoogle = async () => {
    const isNative = Capacitor.isNativePlatform();
    const redirectTo = "https://agri-risk1.vercel.app/auth/callback";

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: isNative
      }
    });

    if (isNative && data?.url) {
      await Browser.open({ url: data.url });
    }

    return { error };
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });
    return { error };
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    const isNative = Capacitor.isNativePlatform();
    const emailRedirectTo = isNative
      ? "com.agririsk.app://auth/callback"
      : typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback`
      : "https://agri-risk1.vercel.app/auth/callback";

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        emailRedirectTo
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
