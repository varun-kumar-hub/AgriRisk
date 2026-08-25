import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const defaultPrefs = {
      crop_risk: true,
      weather: true,
      pest_disease: true,
      market: true,
      irrigation: true,
      ai_recommendations: true,
      crop_health: true,
      regional_risk: true,
      critical: true,
      high: true,
      moderate: false,
      low: false,
      in_app: true,
      email: true,
      push: false,
      quiet_hours_enabled: false,
      quiet_hours_start: "22:00",
      quiet_hours_end: "06:00"
    };

    if (!user) {
      return NextResponse.json({ notifications: defaultPrefs });
    }

    const { data } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single();

    return NextResponse.json({ notifications: data || defaultPrefs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notification preferences" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json().catch(() => ({}));

    if (!user) {
      return NextResponse.json({ notifications: body });
    }

    const { data, error } = await supabase
      .from("notification_preferences")
      .upsert({
        user_id: user.id,
        ...body,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ notifications: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notification preferences" }, { status: 500 });
  }
}
