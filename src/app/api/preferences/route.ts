import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        preferences: {
          units: "Metric",
          temperatureUnit: "°C",
          currency: "INR ₹",
          aiResponseStyle: "Farmer Friendly",
          aiUseFarmContext: true,
          showAiExplanations: true
        }
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("units, temperature_unit, currency, default_farm_id, default_crop_id, default_season, ai_response_style, ai_response_language, ai_use_farm_context, show_ai_explanations, show_confidence_scores, show_risk_factors, show_supporting_data")
      .eq("id", user.id)
      .single();

    return NextResponse.json({ preferences: profile || {} });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json().catch(() => ({}));

    if (!user) {
      return NextResponse.json({ preferences: body });
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        units: body.units,
        temperature_unit: body.temperature_unit || body.temperatureUnit,
        currency: body.currency,
        ai_response_style: body.ai_response_style || body.aiResponseStyle,
        ai_use_farm_context: body.ai_use_farm_context ?? body.aiUseFarmContext,
        show_ai_explanations: body.show_ai_explanations ?? body.showAiExplanations,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ preferences: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
