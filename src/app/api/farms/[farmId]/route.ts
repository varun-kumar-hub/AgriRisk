import { NextResponse } from "next/server";
import { demoFarm } from "@/lib/mock/data";

export function GET() {
  return NextResponse.json({ farm: demoFarm });
}

export function PATCH() {
  return NextResponse.json({ farm: demoFarm, mode: "mock-updated" });
}

export function DELETE() {
  return NextResponse.json({ deleted: true });
}
