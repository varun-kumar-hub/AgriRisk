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
    // Initial session restoration on startup (Cold Start / App Launch)
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

    // Android Native Deep Link & OAuth Callback Handler
    let appUrlListener: any = null;
    if (Capacitor.isNativePlatform()) {
      appUrlListener = App.addListener("appUrlOpen", async (event) => {
        const url = event.url;
        if (!url) return;

        // Check if URL matches AgriRisk Auth Callback (Scheme or Web URL)
        if (
          url.includes("auth/callback") ||
          url.includes("access_token=") ||
          url.includes("code=") ||
          url.startsWith("com.agririsk.app://")
        ) {
          // Close Chrome / Custom Tab if open
          try {
            await Browser.close();
          } catch (e) {}

          // Handle Implicit Flow (#access_token=... & refresh_token=...)
          if (url.includes("access_token=")) {
            try {
              const hashPart = url.includes("#") ? url.split("#")[1] : url.split("?")[1];
              const params = new URLSearchParams(hashPart);
              const accessToken = params.get("access_token");
              const refreshToken = params.get("refresh_token");

              if (accessToken && refreshToken) {
                const { data, error } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken
                });
                if (!error && data?.session) {
                  setSession(data.session);
                  setUser(data.session.user);
                }
              }
            } catch (err) {
              console.error("Android Deep Link: Error parsing access_token:", err);
            }
          }
          // Handle PKCE Flow (?code=...)
          else if (url.includes("code=")) {
            try {
              const queryPart = url.includes("?") ? url.split("?")[1] : "";
              const params = new URLSearchParams(queryPart);
              const code = params.get("code");
              if (code) {
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);
                if (!error && data?.session) {
                  setSession(data.session);
                  setUser(data.session.user);
                }
              }
            } catch (err) {
              console.error("Android Deep Link: Error exchanging code for session:", err);
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
    
    // Always use production Vercel URL for OAuth callback so physical Android devices avoid localhost:3000 errors
    const redirectTo = "https://agri-risk1.vercel.app/auth/callback";

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: isNative
      }
    });

    if (isNative && data?.url) {
      // Open external Chrome Custom Tab for Google authentication
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
