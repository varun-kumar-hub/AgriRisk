import { NextResponse } from "next/server";
import { cropRecommendations } from "@/lib/mock/data";

export function POST() {
  return NextResponse.json({ recommendations: cropRecommendations });
}
