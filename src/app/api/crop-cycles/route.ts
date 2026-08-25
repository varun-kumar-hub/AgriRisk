import { NextResponse } from "next/server";
import { activeCropCycle } from "@/lib/mock/data";

export function GET() {
  return NextResponse.json({ cropCycles: [activeCropCycle] });
}

export function POST() {
  return NextResponse.json({ cropCycle: activeCropCycle, mode: "mock-created" }, { status: 201 });
}
