import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  try {
    const res = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          }
        }
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ language: "en" });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("language")
      .eq("id", user.id)
      .single();

    if (error || !data?.language) {
      return NextResponse.json({ language: "en" });
    }

    return NextResponse.json({ language: data.language });
  } catch (error) {
    console.error("GET /api/profile/language error:", error);
    return NextResponse.json({ language: "en" });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const language = body.language;
    const validLangs = ["en", "ta", "te", "kn", "hi"];

    if (!language || !validLangs.includes(language)) {
      return NextResponse.json(
        { error: "Invalid language choice. Supported: en, ta, te, kn, hi" },
        { status: 400 }
      );
    }

    const res = NextResponse.next();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              res.cookies.set(name, value, options)
            );
          }
        }
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: true, language, persisted: false });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ language })
      .eq("id", user.id);

    if (error) {
      console.warn("Could not save profile language preference:", error);
    }

    return NextResponse.json({ success: true, language, persisted: !error });
  } catch (error) {
    console.error("PATCH /api/profile/language error:", error);
    return NextResponse.json(
      { error: "Internal server error saving language preference" },
      { status: 500 }
    );
  }
}
