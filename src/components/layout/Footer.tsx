import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const footerLinks = [
  {
    title: "Tools",
    links: [
      { href: "/bpm-calculator",    label: "BPM Calculator" },
      { href: "/bpm-via-link",      label: "BPM via advertentielink" },
      { href: "/import-stappenplan",label: "Import stappenplan" },
    ],
  },
  {
    title: "Diensten",
    links: [
      { href: "/hulp-inschakelen",           label: "Hulp inschakelen" },
      { href: "/hulp-inschakelen#pakketten", label: "Importpakketten" },
      { href: "/contact",                    label: "Offerte aanvragen" },
    ],
  },
  {
    title: "Informatie",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/admin",   label: "Admin" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy">

      {/* ── Hoofd footer ── */}
      <div className="container-main pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand kolom */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center font-black text-white text-sm group-hover:bg-primary-dark transition-colors shrink-0">
                KW
              </div>
              <div>
                <div className="text-white font-bold text-base tracking-tight">KW Automotive</div>
                <div className="text-white/40 text-xs font-medium tracking-wider uppercase mt-0.5">Import &amp; BPM</div>
              </div>
            </Link>

            <p className="text-white/55 text-sm leading-relaxed max-w-xs mb-7">
              Specialist in auto-import vanuit Europa. Gratis BPM calculator,
              import stappenplan en professionele begeleiding.
            </p>

            <div className="space-y-3">
              <a href="tel:+31243030400" className="flex items-center gap-3 text-white/55 hover:text-white transition-colors text-sm">
                <Icon name="phone" size={15} className="text-primary shrink-0" />
                +31 24 303 0400
              </a>
              <a href="mailto:info@kwautomotive.nl" className="flex items-center gap-3 text-white/55 hover:text-white transition-colors text-sm">
                <Icon name="mail" size={15} className="text-primary shrink-0" />
                info@kwautomotive.nl
              </a>
              <div className="flex items-center gap-3 text-white/55 text-sm">
                <Icon name="clock" size={15} className="text-primary shrink-0" />
                Ma–Vr: 9:00–17:00
              </div>
            </div>
          </div>

          {/* Link kolommen */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-5">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Onderste balk ── */}
      <div className="border-t border-white/8">
        <div className="container-main py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} KW Automotive. Alle rechten voorbehouden.
          </p>
          <p className="text-white/25 text-xs text-center md:text-right leading-relaxed max-w-sm">
            Disclaimer: Alle BPM-berekeningen zijn indicatief. De definitieve BPM
            volgt uit de officiële aangifte bij de Belastingdienst.
          </p>
        </div>
      </div>

    </footer>
  );
}
