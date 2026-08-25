import type { ReactNode } from "react";
import { Card, CardTitle } from "@/components/ui/card";

export function MetricCard({
  title,
  value,
  detail,
  children
}: {
  title: string;
  value: ReactNode;
  detail?: string;
  children?: ReactNode;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <CardTitle className="truncate">{title}</CardTitle>
      <div className="mt-2 text-xl sm:text-3xl font-extrabold text-slate-950 truncate leading-tight">
        {value}
      </div>
      {detail ? <p className="mt-1.5 text-xs sm:text-sm text-slate-500 font-medium truncate">{detail}</p> : null}
      {children}
    </Card>
  );
}
