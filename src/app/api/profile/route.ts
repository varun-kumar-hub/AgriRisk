import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        profile: {
          fullName: "Varun Kumar",
          email: "varun.kumar@agririsk.io",
          role: "Farmer",
          location: "Durg, Chhattisgarh",
          country: "India",
          state: "Chhattisgarh",
          district: "Durg"
        }
      });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      profile: profile || {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || "Varun Kumar",
        role: "Farmer",
        location: "Durg, Chhattisgarh"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json().catch(() => ({}));

    if (!user) {
      return NextResponse.json({ profile: body });
    }

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        full_name: body.full_name || body.fullName,
        role: body.role || "Farmer",
        state: body.state,
        district: body.district,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
