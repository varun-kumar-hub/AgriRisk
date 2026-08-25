import Link from "next/link";
import { BarChart3, Bell, Bot, CloudSun, Home, LineChart, Map, Sprout, Tractor } from "lucide-react";

const groups = [
  { label: "Overview", items: [{ href: "/dashboard", label: "Dashboard", icon: Home }] },
  {
    label: "Before Planting",
    items: [
      { href: "/crop-advisor", label: "Crop Advisor", icon: Sprout },
      { href: "/crop-advisor/compare", label: "Crop Comparison", icon: BarChart3 }
    ]
  },
  {
    label: "After Planting",
    items: [
      { href: "/farms", label: "My Farms", icon: Tractor },
      { href: "/risk", label: "Risk Intelligence", icon: LineChart },
      { href: "/alerts", label: "Alerts", icon: Bell }
    ]
  },
  {
    label: "AI",
    items: [
      { href: "/copilot", label: "AI Copilot", icon: Bot },
      { href: "/recommendations", label: "Recommendations", icon: Sprout },
      { href: "/simulator", label: "Farm Simulator", icon: CloudSun }
    ]
  },
  { label: "Intelligence", items: [{ href: "/risk-map", label: "Regional Map", icon: Map }] }
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <Link href="/dashboard" className="flex items-center gap-3 px-2">
        <span className="grid size-10 place-items-center rounded-lg bg-crop text-white">
          <Sprout size={22} />
        </span>
        <span>
          <span className="block text-lg font-bold text-slate-950">AgriRisk</span>
          <span className="text-xs text-slate-500">Decision intelligence</span>
        </span>
      </Link>
      <nav className="mt-8 space-y-7">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{group.label}</p>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                >
                  <item.icon size={17} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
