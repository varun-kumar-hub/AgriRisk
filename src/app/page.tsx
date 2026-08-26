"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Sprout, 
  ShieldCheck, 
  Bot, 
  TrendingUp, 
  CloudSun, 
  Globe2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  BarChart3,
  Layers
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-crop selection:text-white">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-crop text-white shadow-lg shadow-crop/30">
            <Sprout size={22} />
          </span>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white block leading-none">AgriRisk</span>
            <span className="text-[11px] text-emerald-400 font-semibold tracking-wide block">AI Agricultural Intelligence</span>
          </div>
        </div>

        <div>
          {user ? (
            <Button onClick={() => router.push("/dashboard")} className="bg-crop hover:bg-crop-dark text-white font-bold rounded-xl px-4 py-2 text-sm shadow-md">
              Go to Dashboard <ArrowRight size={16} className="ml-1" />
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button className="bg-crop hover:bg-crop-dark text-white font-extrabold rounded-xl px-5 py-2 text-sm shadow-lg shadow-crop/20">
                Sign In <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center gap-12">
        {/* Hero Section */}
        <div className="text-center space-y-5 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-bold animate-pulse">
            <Sparkles size={16} className="text-emerald-400 shrink-0" />
            <span>AI-Driven Risk & Crop Decision Platform for Indian Farmers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Smart Crop Planning & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Real-Time Risk Intelligence
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Empowering agricultural decisions with soil pH & nutrient matching, district climate trends, market forecast, and instant AI advice powered by Gemini 2.5.
          </p>

          {/* Primary Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Button 
                onClick={() => router.push("/dashboard")} 
                className="w-full sm:w-auto bg-crop hover:bg-crop-dark text-white font-extrabold text-base py-3.5 px-8 rounded-xl shadow-xl shadow-crop/30 cursor-pointer"
              >
                Open AgriRisk Dashboard <ArrowRight size={18} className="ml-2" />
              </Button>
            ) : (
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button 
                  className="w-full sm:w-auto bg-crop hover:bg-crop-dark text-white font-extrabold text-base py-3.5 px-8 rounded-xl shadow-xl shadow-crop/30 cursor-pointer"
                >
                  Sign In / Get Started <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          {/* Card 1 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 hover:border-crop/50 transition-all group">
            <div className="grid size-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold mb-4 group-hover:scale-110 transition-transform">
              <Sprout size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">Smart Crop Advisor</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Personalized crop suitabilities matched against your soil pH, N-P-K levels, water supply, and seasonal weather.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 hover:border-crop/50 transition-all group">
            <div className="grid size-12 place-items-center rounded-xl bg-amber-500/10 text-amber-400 font-bold mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">Risk Intelligence</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Multi-factor risk analysis tracking weather stress, disease outbreaks, pest alerts, and market price fluctuations.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 hover:border-crop/50 transition-all group">
            <div className="grid size-12 place-items-center rounded-xl bg-sky-500/10 text-sky-400 font-bold mb-4 group-hover:scale-110 transition-transform">
              <Bot size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1.5">Multilingual AI Copilot</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ask any farming question in English, Telugu (తెలుగు), Tamil (தமிழ்), Hindi (हिन्दी), or Kannada (ಕನ್ನಡ) for instant expert advice.
            </p>
          </div>
        </div>

        {/* Multilingual Support Banner */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-800 border border-slate-700/70 rounded-2xl p-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Globe2 size={16} />
            <span>Built for All Farmers Across India</span>
          </div>
          <h4 className="text-base sm:text-lg font-extrabold text-white">Full App Support in 5 Languages</h4>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-xs font-bold text-slate-200">🇬🇧 English</span>
            <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-xs font-bold text-emerald-300">🇮🇳 తెలుగు (Telugu)</span>
            <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-xs font-bold text-amber-300">🇮🇳 தமிழ் (Tamil)</span>
            <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-xs font-bold text-sky-300">🇮🇳 हिन्दी (Hindi)</span>
            <span className="px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700 text-xs font-bold text-purple-300">🇮🇳 ಕನ್ನಡ (Kannada)</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-4 py-4 text-center text-xs text-slate-400 font-medium">
        <p>© 2026 AgriRisk Platform · AI-Driven Agricultural Decision Support</p>
      </footer>
    </div>
  );
}
