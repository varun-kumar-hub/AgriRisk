import { NextResponse } from "next/server";
import { alerts } from "@/lib/mock/data";

export function GET() {
  return NextResponse.json({ alerts });
}
