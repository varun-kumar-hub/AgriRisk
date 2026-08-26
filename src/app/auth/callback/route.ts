import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    let response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          }
        }
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    const userAgent = request.headers.get("user-agent") || "";
    const isAndroid = /Android/i.test(userAgent);

    if (isAndroid) {
      // Clean HTTP 302 Redirect directly to Android Deep Link Scheme
      return NextResponse.redirect(`com.agririsk.app://auth/callback?code=${code}`);
    }

    if (!error) {
      return response;
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}
