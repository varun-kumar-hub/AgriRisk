import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json().catch(() => ({}));

    if (body.confirmText !== "DELETE") {
      return NextResponse.json({ error: "Confirmation text must be DELETE" }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ success: true, message: "Guest account reset" });
    }

    // Delete user profile data in Supabase
    await supabase.from("profiles").delete().eq("id", user.id);
    await supabase.from("notification_preferences").delete().eq("user_id", user.id);

    // Sign out user
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
