"use client";

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
      <div className="bg-navy hidden md:block">
        <div className="container-main">
          <div className="flex items-center justify-center gap-8 py-2">
            {USP_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-white/70 text-xs">
                <svg className="w-3 h-3 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Witte navigatiebalk ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="container-main">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-9 h-9 bg-navy rounded-lg flex items-center justify-center font-black text-white text-sm tracking-tight group-hover:bg-primary transition-colors">
                KW
              </div>
              <div className="leading-none">
                <div className="text-navy font-bold text-sm tracking-tight">KW Automotive</div>
                <div className="text-gray-400 text-[10px] font-medium tracking-wider uppercase mt-0.5">Import &amp; BPM</div>
              </div>
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
                href="tel:+31600000000"
                className="hidden sm:flex w-10 h-10 bg-navy hover:bg-primary transition-colors rounded-full items-center justify-center"
                aria-label="Bel ons"
              >
                <Icon name="phone" size={16} className="text-white" />
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
                <a href="tel:+31600000000" className="btn-primary w-full justify-center">
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
