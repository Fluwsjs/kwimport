import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const footerLinks = [
  {
    title: "Tools",
    links: [
      { href: "/bpm-calculator", label: "BPM Calculator" },
      { href: "/bpm-via-link", label: "BPM via advertentielink" },
      { href: "/import-stappenplan", label: "Import stappenplan" },
    ],
  },
  {
    title: "Diensten",
    links: [
      { href: "/hulp-inschakelen", label: "Hulp inschakelen" },
      { href: "/hulp-inschakelen#pakketten", label: "Importpakketten" },
      { href: "/contact", label: "Offerte aanvragen" },
    ],
  },
  {
    title: "Informatie",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/admin", label: "Admin" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy">
      <div className="container-main pt-14 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center font-black text-white text-sm group-hover:bg-primary-dark transition-colors">
                KW
              </div>
              <div>
                <div className="text-white font-bold text-sm">KW Automotive</div>
                <div className="text-white/40 text-[10px] font-medium tracking-wider uppercase">Import &amp; BPM</div>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-5">
              Specialist in auto-import vanuit Europa. Gratis BPM calculator,
              import stappenplan en professionele begeleiding.
            </p>
            <div className="space-y-2">
              <a href="tel:+31600000000" className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors text-sm group">
                <Icon name="phone" size={14} className="text-primary" />
                +31 (0)6 XX XX XX XX
              </a>
              <a href="mailto:info@kwautomotive.nl" className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors text-sm">
                <Icon name="mail" size={14} className="text-primary" />
                info@kwautomotive.nl
              </a>
              <div className="flex items-center gap-2.5 text-white/50 text-sm">
                <Icon name="clock" size={14} className="text-primary" />
                Ma–Vr: 9:00–17:00
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-white transition-colors text-sm flex items-center gap-1.5 group"
                    >
                      <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200">
                        <Icon name="chevron-right" size={10} className="text-primary shrink-0" />
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} KW Automotive. Alle rechten voorbehouden.
          </p>
          <p className="text-white/25 text-xs max-w-md text-right leading-relaxed">
            Disclaimer: Alle BPM-berekeningen zijn indicatief. De definitieve BPM volgt
            uit de officiële aangifte bij de Belastingdienst.
          </p>
        </div>
      </div>
    </footer>
  );
}
