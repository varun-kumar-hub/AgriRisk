import { NextResponse } from "next/server";
import { simulationResult } from "@/lib/mock/data";

export function POST() {
  return NextResponse.json({ simulation: simulationResult });
}
