import { NextResponse } from "next/server";
import { recommendations } from "@/lib/mock/data";

export function POST() {
  return NextResponse.json({ recommendations, basis: "mock-risk-and-growth-stage" });
}
