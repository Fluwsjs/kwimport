"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

const navLinks = [
  { href: "/import-stappenplan", label: "Auto Importeren" },
  { href: "/bpm-calculator",     label: "BPM Berekening" },
  { href: "/bpm-via-link",       label: "BPM via link" },
  { href: "/hulp-inschakelen",   label: "Diensten" },
  { href: "/contact",            label: "Contact" },
];

const USP_ITEMS = [
  "Particulieren en bedrijven",
  "RDW keuring binnen 2 werkdagen",
  "Meer dan 10 jaar ervaring",
];

export function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">

      {/* ── USP balk ── */}
      <div className="bg-primary hidden md:block">
        <div className="container-main">
          <div className="flex items-center justify-between py-2">
            {/* USP items links */}
            <div className="flex items-center gap-6">
              {USP_ITEMS.map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-white/90 text-xs">
                  <svg className="w-3 h-3 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
            {/* Telefoon + tijden rechts */}
            <div className="flex items-center gap-5 text-white/90 text-xs">
              <span className="flex items-center gap-1.5">
                <Icon name="clock" size={12} className="text-white/70 shrink-0" />
                Ma–Vr: 9:00–17:00
              </span>
              <a href="tel:+31243030400" className="flex items-center gap-1.5 hover:text-white transition-colors font-semibold">
                <Icon name="phone" size={12} className="text-white/70 shrink-0" />
                +31 24 303 0400
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Witte navigatiebalk ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container-main">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/logo.png"
                alt="KW Automotive logo"
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-navy hover:bg-gray-50 rounded-lg transition-all font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Telefoon-knop + hamburger */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+31243030400"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Icon name="phone" size={14} className="text-white" />
                <span className="hidden md:inline">Bel ons</span>
              </a>
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2 text-navy hover:bg-gray-100 rounded-lg transition-all"
                aria-label="Menu"
              >
                <Icon name={open ? "x" : "menu"} size={22} />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            open ? "max-h-[400px] opacity-100 pb-4" : "max-h-0 opacity-0"
          )}>
            <nav className="flex flex-col gap-0.5 pt-2 border-t border-gray-100">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 text-sm text-gray-600 hover:text-navy hover:bg-gray-50 rounded-lg transition-all font-medium flex items-center justify-between"
                >
                  {link.label}
                  <Icon name="chevron-right" size={16} className="text-gray-300" />
                </Link>
              ))}
              <div className="pt-3 mt-1 border-t border-gray-100">
                <a href="tel:+31243030400" className="btn-primary w-full justify-center">
                  <Icon name="phone" size={16} />
                  Bel ons
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
