"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Sprout } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";

const PUBLIC_ROUTES = ["/auth/login", "/auth/callback"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.replace("/auth/login");
    }
  }, [user, loading, isPublicRoute, router, pathname]);

  if (loading && !isPublicRoute) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-crop text-white shadow-lg animate-bounce">
            <Sprout size={28} />
          </span>
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
            <Loader2 className="animate-spin text-crop" size={18} />
            <span>Authenticating user session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
}
