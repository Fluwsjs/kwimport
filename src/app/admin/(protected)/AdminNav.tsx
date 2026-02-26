"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { href: "/admin/leads", label: "Leads", icon: "👤", exact: false },
  { href: "/admin/berekeningen", label: "Berekeningen", icon: "🧮", exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {LINKS.map((link) => {
        const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all",
                active
                  ? "bg-primary text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
