import { NextResponse } from "next/server";
import { demoFarm } from "@/lib/mock/data";

export function GET() {
  return NextResponse.json({ farms: [demoFarm] });
}

export async function POST() {
  return NextResponse.json({ farm: demoFarm, mode: "mock-created" }, { status: 201 });
}
