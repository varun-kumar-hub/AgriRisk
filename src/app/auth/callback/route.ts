import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            // Set cookies on response
          }
        }
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    const userAgent = request.headers.get("user-agent") || "";
    const isAndroid = /Android/i.test(userAgent);

    if (isAndroid) {
      const html = `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Returning to AgriRisk...</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background-color: #f8fafc; color: #0f172a; text-align: center; padding: 20px; }
      .card { background: #ffffff; padding: 28px 24px; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); max-width: 360px; width: 100%; }
      .icon { width: 48px; height: 48px; background: #22c55e; color: white; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 12px; }
      h2 { font-size: 20px; font-weight: 800; margin: 0 0 8px 0; color: #0f172a; }
      p { font-size: 14px; color: #64748b; margin: 0 0 20px 0; line-height: 1.5; }
      .btn { display: block; width: 100%; background: #16a34a; color: #ffffff; padding: 14px 0; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(22,163,74,0.3); }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="icon">🌱</div>
      <h2>Sign In Successful!</h2>
      <p>Redirecting you back to the AgriRisk Android App...</p>
      <a href="com.agririsk.app://auth/callback?code=${code}" class="btn">Open AgriRisk App</a>
    </div>
    <script>
      setTimeout(function() {
        window.location.href = "com.agririsk.app://auth/callback?code=${code}";
      }, 400);
    </script>
  </body>
</html>`;
      return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}
