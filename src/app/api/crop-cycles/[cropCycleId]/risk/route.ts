import { NextResponse } from "next/server";
import { cropRisk } from "@/lib/mock/data";

export function GET() {
  return NextResponse.json({ risk: cropRisk });
}
