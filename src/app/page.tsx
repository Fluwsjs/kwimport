import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { HeroTabCard } from "@/components/home/HeroTabCard";

export const metadata: Metadata = {
  title: "Import Zelf Regelen & BPM Berekenen | KW Automotive",
  description:
    "Regel uw auto-import zelf. Gratis BPM calculator, import stappenplan en professionele begeleiding bij elke stap van de importprocedure.",
};

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[600px] md:min-h-[700px]">
          <Image
            src="/bg.png"
            alt="Auto import achtergrond"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy/30" />

          <div className="relative z-10 container-main py-16 md:py-24 flex items-center min-h-[600px] md:min-h-[700px]">
            <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center w-full">

              {/* ── Links: tekst ── */}
              <div>
                <p className="text-white/70 text-sm md:text-base mb-4 font-medium">
                  Dé specialist in A-Z auto-import. Veilig, snel en vertrouwd.
                </p>
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-6">
                  Auto importbegeleiding<br />en BPM aangifte
                </h1>
                <div className="flex flex-wrap gap-3 mb-10">
                  <Link
                    href="/import-stappenplan"
                    className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-lg transition-colors shadow-lg shadow-primary/30"
                  >
                    Bekijk het stappenplan
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-3 border border-white/30 text-white hover:bg-white/10 font-semibold text-sm rounded-lg transition-colors"
                  >
                    Neem contact op
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    "RDW keuring binnen 2 werkdagen",
                    "Meer dan 10 jaar ervaring",
                    "Particulieren en bedrijven",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-white/70 text-sm">
                      <svg className="w-4 h-4 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Rechts: calculator ── */}
              <div className="w-full lg:max-w-md xl:max-w-lg mx-auto">
                <HeroTabCard />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Diensten ── wit */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-navy mb-3 tracking-tight">
              Alles voor uw auto-import
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Van snelle BPM-berekening tot volledige importbegeleiding — wij regelen het.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "calculator" as const,
                title: "BPM Berekening",
                desc: "Bereken nauwkeurig de verschuldigde BPM via onze gratis calculator. Forfaitair, koerslijst of taxatierapport methode.",
                href: "/bpm-calculator",
              },
              {
                icon: "clipboard" as const,
                title: "Auto Importeren",
                desc: "Stap voor stap door het volledige importproces. Van aankoop in het buitenland tot uw Nederlandse kenteken.",
                href: "/import-stappenplan",
              },
              {
                icon: "briefcase" as const,
                title: "BPM Begeleiding",
                desc: "Laat uw BPM-aangifte professioneel regelen. Onze specialisten zorgen voor de juiste aangifte en RDW-keuring.",
                href: "/hulp-inschakelen",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-8 border border-gray-100 rounded-2xl hover:border-primary/20 hover:shadow-md transition-all duration-200"
              >
                <div className="w-14 h-14 bg-primary/8 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Icon name={item.icon} size={26} className="text-primary" />
                </div>
                <h3 className="font-black text-navy text-lg mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-7">{item.desc}</p>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-lg transition-colors"
                >
                  Lees meer
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Google Reviews strip ── grijs */}
      <section className="bg-gray-50 py-14">
        <div className="container-main">
          <div className="flex flex-col lg:flex-row items-center gap-12">

            {/* Links: UITSTEKEND + rating */}
            <div className="lg:w-48 shrink-0 text-center lg:text-left">
              <div className="text-sm font-black text-navy uppercase tracking-widest mb-2">Uitstekend</div>
              <div className="flex gap-0.5 justify-center lg:justify-start mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-gray-400 mb-5">Gebaseerd op klantreviews</p>
              <svg viewBox="0 0 272 92" className="h-6 w-auto opacity-60" xmlns="http://www.w3.org/2000/svg">
                <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
                <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
                <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
                <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
                <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
                <path d="M35.29 41.41V32h31.86c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.46.36 15.03 16.32-.43 35.45-.43c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.64.01z" fill="#4285F4"/>
              </svg>
            </div>

            {/* Rechts: review cards */}
            <div className="flex-1 grid md:grid-cols-3 gap-4">
              {[
                { name: "Thomas V.", text: "Via de BPM calculator direct een goede schatting kunnen maken voor mijn import vanuit Duitsland. Duidelijke uitleg!", rating: 5 },
                { name: "Sandra M.", text: "Het stappenplan heeft mij enorm geholpen. Voor het eerst een auto geïmporteerd en alles verliep soepel.", rating: 5 },
                { name: "Bas K.",    text: "Hulp ingeschakeld voor de BPM-aangifte. Snel geregeld, eerlijk geprijsd. Absolute aanrader!", rating: 5 },
              ].map((review) => (
                <div key={review.name} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-bold text-navy text-sm">{review.name}</div>
                      <div className="text-gray-400 text-[10px]">Klant</div>
                    </div>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <svg key={i} className="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Hoe werkt het ── wit */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-navy mb-3 tracking-tight">In vier stappen naar uw importauto</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Het importproces hoeft niet ingewikkeld te zijn. Wij leggen het helder uit.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { nr: 1, icon: "search" as const,    title: "Auto zoeken",       desc: "Vind uw auto op mobile.de, AutoScout24 of andere Europese marktplaatsen." },
              { nr: 2, icon: "car" as const,        title: "Auto importeren",   desc: "Koop de auto en vervoer of rij deze naar Nederland met alle benodigde documenten." },
              { nr: 3, icon: "calculator" as const, title: "BPM berekenen",    desc: "Bereken de BPM met onze calculator en dien de aangifte in bij de Belastingdienst." },
              { nr: 4, icon: "file-text" as const,  title: "Kenteken aanvragen",desc: "Na goedkeuring vraagt u uw Nederlandse kenteken aan via de RDW." },
            ].map((step) => (
              <div key={step.nr} className="text-center">
                <div className="text-5xl font-black text-primary/15 leading-none mb-3">{step.nr}</div>
                <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon name={step.icon} size={20} className="text-primary" />
                </div>
                <h3 className="font-bold text-navy mb-2 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/import-stappenplan" className="btn-outline">
              Lees het volledige stappenplan
              <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Over ons ── grijs */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-navy mb-5 tracking-tight leading-tight">
                Auto-Import vanuit Europa<br />met KW Automotive
              </h2>
              <p className="text-gray-500 leading-relaxed mb-5">
                Wij zijn gespecialiseerd in het importeren van auto's uit Europa. Via onze eigen importdienst
                begeleiden wij u bij alle stappen — van aankoop tot kenteken.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8">
                Bij KW Automotive staat u als klant altijd centraal. Wij bieden deskundige hulp
                voor een optimale klantervaring en zorgen dat het gehele proces soepel verloopt.
              </p>
              <div className="space-y-3">
                {[
                  "Eigen erkend aangiftekantoor voor BPM",
                  "RDW keuring geregeld binnen 2 werkdagen",
                  "Geen verborgen kosten — altijd transparant",
                  "PDF rapport voor uw administratie",
                ].map((item) => (
                  <div key={item} className="flex gap-3 items-center">
                    <Icon name="check" size={15} className="text-primary shrink-0" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "zap" as const,          title: "Gratis BPM Calculator", desc: "Direct online berekenen, geen registratie vereist" },
                { icon: "shield" as const,        title: "Erkend Kantoor",        desc: "Officieel erkend voor BPM-aangiften in Nederland" },
                { icon: "clock" as const,         title: "Snelle Afhandeling",    desc: "Doorgaans binnen 5 werkdagen volledig geregeld" },
                { icon: "user" as const,          title: "Persoonlijk Contact",   desc: "Direct contact met een vaste specialist" },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-5 shadow-sm">
                  <div className="w-10 h-10 bg-primary/8 rounded-lg flex items-center justify-center mb-3">
                    <Icon name={item.icon} size={18} className="text-primary" />
                  </div>
                  <div className="font-bold text-navy text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-gray-400 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BPM via link promo ── wit */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-5">
                <Icon name="zap" size={11} />
                Beta functie
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-navy mb-4 tracking-tight">
                BPM berekenen via advertentielink
              </h2>
              <p className="text-gray-500 mb-7 leading-relaxed">
                Plak een link van mobile.de of AutoScout24. Wij extraheren automatisch
                de voertuiggegevens en starten de BPM-berekening. Geen handmatig overtypen meer.
              </p>
              <Link href="/bpm-via-link" className="btn-primary">
                Probeer gratis
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              {[
                { label: "mobile.de",    flag: "🇩🇪", status: "Ondersteund" },
                { label: "AutoScout24",  flag: "🌍",  status: "Ondersteund" },
                { label: "AutoTrader UK",flag: "🇬🇧", status: "Binnenkort" },
                { label: "Overige URL",  flag: "🔗",  status: "Handmatig" },
              ].map((site) => (
                <div
                  key={site.label}
                  className={`p-4 rounded-xl border text-center ${
                    site.status === "Ondersteund"
                      ? "border-green-200 bg-green-50"
                      : "border-gray-100 bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="text-2xl mb-1.5">{site.flag}</div>
                  <div className="text-xs font-bold text-navy mb-0.5">{site.label}</div>
                  <div className={`text-[10px] ${site.status === "Ondersteund" ? "text-green-600" : "text-gray-400"}`}>
                    {site.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats balk ── */}
      <section className="bg-navy-2 py-16">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
            {[
              { value: "500+",   label: "Tevreden klanten" },
              { value: "1000+",  label: "BPM berekeningen" },
              { value: "10+",    label: "Jaar ervaring" },
              { value: "3",      label: "Afschrijvingsmethoden" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-6">
                <div className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-white/40 text-sm font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA bottom ── */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20">
        <div className="container-main text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
            Klaar om uw BPM te berekenen?
          </h2>
          <p className="text-white/75 mb-10 max-w-md mx-auto leading-relaxed">
            Gratis, direct en nauwkeurig. Geen registratie vereist.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/bpm-calculator"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-primary rounded-lg font-bold text-base hover:bg-gray-50 transition-colors shadow-lg"
            >
              Start BPM berekening
              <Icon name="arrow-right" size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/15 hover:bg-white/25 text-white rounded-lg font-bold text-base transition-colors border border-white/20"
            >
              Offerte aanvragen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
