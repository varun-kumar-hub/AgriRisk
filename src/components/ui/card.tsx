import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm max-w-full overflow-hidden", className)}>
      {children}
    </section>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500", className)}>
      {children}
    </h2>
  );
}
