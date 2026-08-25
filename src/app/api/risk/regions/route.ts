import { NextResponse } from "next/server";
import { regionalRisks } from "@/lib/mock/data";

export function GET() {
  return NextResponse.json({ regions: regionalRisks });
}
