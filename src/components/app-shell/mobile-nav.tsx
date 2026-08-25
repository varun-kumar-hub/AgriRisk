import Link from "next/link";
import { Bell, Bot, Home, Sprout, Tractor } from "lucide-react";

const items = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/crop-advisor", label: "Advisor", icon: Sprout },
  { href: "/farms", label: "Farms", icon: Tractor },
  { href: "/copilot", label: "Copilot", icon: Bot },
  { href: "/alerts", label: "Alerts", icon: Bell }
];

export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-slate-200 bg-white lg:hidden">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 px-2 py-2 text-xs text-slate-600">
          <item.icon size={18} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
