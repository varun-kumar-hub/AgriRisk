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
    <Card>
      <CardTitle>{title}</CardTitle>
      <div className="mt-3 text-3xl font-semibold text-slate-950">{value}</div>
      {detail ? <p className="mt-2 text-sm text-slate-500">{detail}</p> : null}
      {children}
    </Card>
  );
}
