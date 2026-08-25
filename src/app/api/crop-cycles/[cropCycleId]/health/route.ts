import { NextResponse } from "next/server";
import { cropHealth } from "@/lib/mock/data";

export function GET() {
  return NextResponse.json({ health: cropHealth });
}
