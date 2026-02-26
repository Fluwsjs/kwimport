"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

const navLinks = [
  { href: "/bpm-calculator", label: "BPM Calculator" },
  { href: "/bpm-via-link", label: "BPM via link" },
  { href: "/import-stappenplan", label: "Stappenplan" },
  { href: "/hulp-inschakelen", label: "Hulp inschakelen" },
  { href: "/contact", label: "Contact" },
];

export function Topbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-navy shadow-lg shadow-navy/20"
          : "bg-navy"
      )}
    >
      {/* Top info bar */}
      <div className="hidden md:block border-b border-white/10">
        <div className="container-main flex items-center justify-between py-1.5 text-xs text-white/50">
          <span>Specialist in auto-import vanuit Europa</span>
          <div className="flex items-center gap-5">
            <a href="tel:+31600000000" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Icon name="phone" size={12} />
              +31 (0)6 XX XX XX XX
            </a>
            <a href="mailto:info@kwautomotive.nl" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Icon name="mail" size={12} />
              info@kwautomotive.nl
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center font-black text-white text-sm tracking-tight group-hover:bg-primary-dark transition-colors">
              KW
            </div>
            <div className="leading-none">
              <div className="text-white font-bold text-sm tracking-tight">KW Automotive</div>
              <div className="text-white/40 text-[10px] font-medium tracking-wider uppercase mt-0.5">Import &amp; BPM</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm text-white/70 hover:text-white hover:bg-white/8 rounded-lg transition-all font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + hamburger */}
          <div className="flex items-center gap-3">
            <Link href="/bpm-calculator" className="hidden sm:inline-flex btn-primary text-sm py-2.5 px-5">
              BPM berekenen
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Menu"
            >
              <Icon name={open ? "x" : "menu"} size={22} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            open ? "max-h-[400px] opacity-100 pb-4" : "max-h-0 opacity-0"
          )}
        >
          <nav className="flex flex-col gap-0.5 pt-2 border-t border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-sm text-white/70 hover:text-white hover:bg-white/8 rounded-lg transition-all font-medium flex items-center justify-between"
              >
                {link.label}
                <Icon name="chevron-right" size={16} className="text-white/30" />
              </Link>
            ))}
            <div className="pt-3 mt-1 border-t border-white/10">
              <Link href="/bpm-calculator" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                BPM berekenen
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
