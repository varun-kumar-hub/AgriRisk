import { Card, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <Card className="w-full max-w-md">
        <CardTitle>AgriRisk Login</CardTitle>
        <h1 className="mt-3 text-2xl font-bold">Continue to your farm intelligence</h1>
        <div className="mt-6 space-y-3">
          <button className="w-full rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white">Continue with Google</button>
          <button className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold">Continue with Email</button>
        </div>
        <p className="mt-5 text-sm text-slate-500">Supabase Auth hooks are prepared for real keys in `.env.local`.</p>
      </Card>
    </div>
  );
}
