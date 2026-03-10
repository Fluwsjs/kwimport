import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const NAV_LINKS = [
  { href: "/",                    label: "Home" },
  { href: "/import-stappenplan",  label: "Auto importeren" },
  { href: "/bpm-calculator",      label: "BPM berekening" },
  { href: "/bpm-via-link",        label: "BPM via link" },
  { href: "/hulp-inschakelen",    label: "Diensten" },
  { href: "/contact",             label: "Contact" },
];

const TOOL_LINKS = [
  { href: "/bpm-calculator",      label: "BPM Calculator" },
  { href: "/bpm-via-link",        label: "BPM via advertentielink" },
  { href: "/import-stappenplan",  label: "Import stappenplan" },
];

const DIENST_LINKS = [
  { href: "/hulp-inschakelen",            label: "Hulp inschakelen" },
  { href: "/hulp-inschakelen#pakketten",  label: "Importpakketten" },
  { href: "/contact",                     label: "Offerte aanvragen" },
];

const JURIDISCH_LINKS = [
  { href: "/algemene-voorwaarden", label: "Algemene voorwaarden" },
  { href: "/privacy-policy",       label: "Privacy Policy" },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">

      {/* ── Blauwe accent-lijn ── */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* ── Hoofd footer ── */}
      <div className="container-main pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10">

          {/* Kolom 1+2: Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-5">
              <Image
                src="/logo.png"
                alt="KW Automotive logo"
                width={160}
                height={48}
                className="h-9 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-white/45 text-sm leading-relaxed mb-7 max-w-xs">
              Specialist in auto-import vanuit Europa. Gratis BPM calculator,
              import stappenplan en professionele begeleiding bij elke stap.
            </p>
            <div className="space-y-2.5">
              <a href="tel:+31243030400" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm group">
                <span className="w-7 h-7 rounded-lg bg-primary/15 group-hover:bg-primary/25 flex items-center justify-center shrink-0 transition-colors">
                  <Icon name="phone" size={13} className="text-primary" />
                </span>
                +31 24 303 0400
              </a>
              <a href="mailto:info@kwautomotive.nl" className="flex items-center gap-3 text-white/50 hover:text-white transition-colors text-sm group">
                <span className="w-7 h-7 rounded-lg bg-primary/15 group-hover:bg-primary/25 flex items-center justify-center shrink-0 transition-colors">
                  <Icon name="mail" size={13} className="text-primary" />
                </span>
                info@kwautomotive.nl
              </a>
              <div className="flex items-center gap-3 text-white/50 text-sm">
                <span className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon name="clock" size={13} className="text-primary" />
                </span>
                Ma–Vr: 9:00–17:00
              </div>
            </div>
          </div>

          {/* Kolom 3: Navigatie */}
          <div>
            <FooterHeading>Navigatie</FooterHeading>
            <FooterLinkList links={NAV_LINKS} />
          </div>

          {/* Kolom 4: Tools */}
          <div>
            <FooterHeading>Tools</FooterHeading>
            <FooterLinkList links={TOOL_LINKS} />
          </div>

          {/* Kolom 5: Diensten */}
          <div>
            <FooterHeading>Diensten</FooterHeading>
            <FooterLinkList links={DIENST_LINKS} />
          </div>

          {/* Kolom 6: Bedrijfsgegevens */}
          <div>
            <FooterHeading>Bedrijfsgegevens</FooterHeading>
            <div className="space-y-2 text-sm text-white/45 leading-relaxed">
              <p className="font-semibold text-white/70">KW Automotive</p>
              <p>Christiaan Huygensstraat 26A<br />6603 BC Wijchen<br />Nederland</p>
              <p className="pt-1">
                <span className="text-white/35 text-xs">KVK nr:</span> 80585655
              </p>
              <p>
                <span className="text-white/35 text-xs">BTW nr:</span> NL861725475B01
              </p>
            </div>
            <div className="mt-5">
              <FooterHeading>Juridisch</FooterHeading>
              <FooterLinkList links={JURIDISCH_LINKS} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Onderste balk ── */}
      <div className="border-t border-white/8">
        <div className="container-main py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Logo links */}
            <Link href="/" className="shrink-0">
              <Image
                src="/logo.png"
                alt="KW Automotive"
                width={120}
                height={36}
                className="h-7 w-auto object-contain brightness-0 invert opacity-50 hover:opacity-80 transition-opacity"
              />
            </Link>

            {/* Copyright midden */}
            <p className="text-white/30 text-xs text-center">
              © {new Date().getFullYear()} KW Automotive · Alle rechten voorbehouden ·{" "}
              <span className="text-white/20">BPM-berekeningen zijn indicatief</span>
            </p>

            {/* Social rechts */}
            <div className="flex items-center gap-2 shrink-0">
              {[
                { href: "https://facebook.com",  icon: "facebook",  label: "Facebook" },
                { href: "https://instagram.com", icon: "instagram", label: "Instagram" },
                { href: "https://linkedin.com",  icon: "linkedin",  label: "LinkedIn" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-white/8 hover:bg-primary/30 flex items-center justify-center transition-colors"
                >
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}

/* ── Sub-components ── */

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
      <span className="w-3 h-[2px] bg-primary rounded-full" />
      {children}
    </h3>
  );
}

function FooterLinkList({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-white/45 hover:text-primary transition-colors text-sm flex items-center gap-1.5 group"
          >
            <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors shrink-0" />
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SocialIcon({ name }: { name: string }) {
  if (name === "facebook") return (
    <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
  if (name === "instagram") return (
    <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
  if (name === "linkedin") return (
    <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
  return null;
}
