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
        {/* Background photo */}
        <div className="relative min-h-[480px] md:min-h-[560px]">
          <Image
            src="/bg.png"
            alt="Auto import achtergrond"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Lichte overlay zodat foto goed zichtbaar blijft */}
          <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/35 to-navy/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/60 via-navy/20 to-transparent" />

          {/* Tekst — linksboven */}
          <div className="relative z-10 container-main pt-16 md:pt-24 pb-36 md:pb-44">
            <div className="max-w-lg">
              <p className="text-white/80 text-sm md:text-base mb-4 font-medium drop-shadow">
                Dé specialist in auto-import vanuit Europa. Veilig, snel en vertrouwd.
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-7 drop-shadow-lg">
                Auto importbegeleiding<br />en BPM aangifte
              </h1>
              <div className="flex flex-wrap gap-3">
                <Link href="/bpm-calculator" className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg transition-colors text-sm shadow-lg">
                  Bereken uw BPM
                  <Icon name="arrow-right" size={16} />
                </Link>
                <Link href="/import-stappenplan" className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/40 text-white hover:border-white/70 hover:bg-white/10 font-semibold rounded-lg transition-all text-sm backdrop-blur-sm">
                  Stappenplan bekijken
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tab-card — overlapt onderkant van de foto */}
        <div className="relative z-10 -mt-28 md:-mt-32 pb-0">
          <div className="container-main">
            <HeroTabCard />
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="container-main py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 rounded-xl overflow-hidden">
            {[
              { value: "100%", label: "Gratis BPM Calculator", icon: "zap" as const },
              { value: "2025", label: "Actuele tarieven", icon: "trending-up" as const },
              { value: "3", label: "Afschrijvingsmethoden", icon: "calculator" as const },
              { value: "< 1 min", label: "Berekening klaar", icon: "clock" as const },
            ].map((stat) => (
              <div key={stat.label} className="bg-white px-6 py-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Icon name={stat.icon} size={18} className="text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-black text-navy tracking-tight">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Diensten ── */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="max-w-2xl mb-12">
            <div className="accent-line mb-4" />
            <h2 className="section-title mb-3">Alles voor uw auto-import</h2>
            <p className="section-subtitle">
              Van snelle BPM-berekening tot volledige importbegeleiding. Kies wat bij u past.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "calculator" as const,
                title: "BPM Calculator",
                desc: "Bereken nauwkeurig de verschuldigde BPM. Ondersteuning voor forfaitaire tabel, koerslijst en taxatierapport methode.",
                href: "/bpm-calculator",
                cta: "Bereken nu",
                highlight: true,
              },
              {
                icon: "clipboard" as const,
                title: "Import Stappenplan",
                desc: "Stap voor stap door het importproces. Van aankoop in het buitenland tot het ontvangen van uw Nederlandse kenteken.",
                href: "/import-stappenplan",
                cta: "Bekijk stappenplan",
                highlight: false,
              },
              {
                icon: "briefcase" as const,
                title: "Hulp inschakelen",
                desc: "Liever de import uitbesteden? Onze specialisten regelen alles van BPM-aangifte tot RDW-keuring.",
                href: "/hulp-inschakelen",
                cta: "Bekijk pakketten",
                highlight: false,
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`group block rounded-xl p-7 border-2 transition-all duration-200 ${
                  item.highlight
                    ? "border-primary bg-primary text-white hover:bg-primary-dark"
                    : "border-gray-100 bg-white hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-5 ${
                  item.highlight ? "bg-white/20" : "bg-primary/10"
                }`}>
                  <Icon
                    name={item.icon}
                    size={20}
                    className={item.highlight ? "text-white" : "text-primary"}
                  />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${item.highlight ? "text-white" : "text-navy"}`}>
                  {item.title}
                </h3>
                <p className={`text-sm leading-relaxed mb-5 ${item.highlight ? "text-white/80" : "text-gray-500"}`}>
                  {item.desc}
                </p>
                <div className={`flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all ${
                  item.highlight ? "text-white" : "text-primary"
                }`}>
                  {item.cta}
                  <Icon name="arrow-right" size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hoe werkt het ── */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="accent-line mx-auto mb-4" />
            <h2 className="section-title mb-3">In vier stappen naar uw importauto</h2>
            <p className="section-subtitle mx-auto">
              Het importproces hoeft niet ingewikkeld te zijn. Wij leggen het helder uit.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-gray-200 z-0" />

            {[
              { nr: "01", icon: "search" as const, title: "Auto zoeken", desc: "Vind uw auto op mobile.de, AutoScout24 of andere Europese marktplaatsen." },
              { nr: "02", icon: "car" as const, title: "Auto importeren", desc: "Koop de auto en vervoer of rij deze naar Nederland met alle benodigde documenten." },
              { nr: "03", icon: "calculator" as const, title: "BPM berekenen", desc: "Bereken de BPM met onze calculator en dien de aangifte in bij de Belastingdienst." },
              { nr: "04", icon: "file-text" as const, title: "Kenteken aanvragen", desc: "Na goedkeuring van de BPM-aangifte vraagt u uw Nederlandse kenteken aan via de RDW." },
            ].map((step, i) => (
              <div key={step.nr} className="relative z-10 text-center">
                <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center mx-auto mb-5 relative">
                  <Icon name={step.icon} size={22} className="text-navy" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full text-white text-[10px] font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-navy mb-2 text-sm">{step.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
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

      {/* ── Waarom KW ── */}
      <section className="section-padding bg-navy">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="accent-line mb-5" />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5 tracking-tight leading-tight">
                Waarom kiezen voor<br />KW Automotive Import?
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Wij combineren technische kennis van de Nederlandse BPM-wetgeving
                met praktische ervaring in auto-import. Transparant, betrouwbaar
                en persoonlijk.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "check-circle" as const, title: "Officiële tarieven", desc: "Berekeningen gebaseerd op gepubliceerde Belastingdienst-tabellen" },
                  { icon: "check-circle" as const, title: "Drie afschrijvingsmethoden", desc: "Forfaitair, koerslijst of taxatierapport — altijd de meest voordelige optie" },
                  { icon: "check-circle" as const, title: "Transparante aannames", desc: "Elke berekening toont exact welke aannames zijn gehanteerd" },
                  { icon: "check-circle" as const, title: "PDF rapport downloaden", desc: "Professionele samenvatting voor uw administratie of aangiftebureau" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <Icon name={item.icon} size={18} className="text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white font-semibold text-sm">{item.title}</div>
                      <div className="text-white/50 text-xs mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-4">
              <div className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-5">
                Wat klanten zeggen
              </div>
              {[
                {
                  name: "Thomas V.",
                  text: "Via de BPM calculator direct een goede schatting kunnen maken voor mijn import vanuit Duitsland. Duidelijke uitleg over de verschillende methoden.",
                  rating: 5,
                },
                {
                  name: "Sandra M.",
                  text: "Het stappenplan heeft mij enorm geholpen. Voor het eerst een auto geïmporteerd en alles verliep soepel. De calculator klopte op een paar euro na.",
                  rating: 5,
                },
                {
                  name: "Bas K.",
                  text: "Hulp ingeschakeld voor de BPM-aangifte. Snel geregeld, eerlijk geprijsd. Aanrader voor iedereen die zelf een auto wil importeren.",
                  rating: 5,
                },
              ].map((review) => (
                <div key={review.name} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">"{review.text}"</p>
                  <div className="text-white/40 text-xs font-semibold">{review.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BPM via link promo ── */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid lg:grid-cols-5 gap-8 items-center bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100">
            <div className="lg:col-span-3">
              <span className="badge-primary mb-4 inline-flex">
                <Icon name="zap" size={12} />
                Beta functie
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-navy mb-3 tracking-tight">
                BPM berekenen via advertentielink
              </h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Plak een link van mobile.de of AutoScout24. Wij extraheren
                automatisch de voertuiggegevens en starten de BPM-berekening.
                Geen handmatig overtypen meer.
              </p>
              <Link href="/bpm-via-link" className="btn-primary">
                Probeer gratis
                <Icon name="arrow-right" size={16} />
              </Link>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-3">
              {[
                { label: "mobile.de", flag: "🇩🇪", status: "Ondersteund" },
                { label: "AutoScout24", flag: "🌍", status: "Ondersteund" },
                { label: "AutoTrader UK", flag: "🇬🇧", status: "Binnenkort" },
                { label: "Overige URL", flag: "🔗", status: "Handmatig invullen" },
              ].map((site) => (
                <div
                  key={site.label}
                  className={`p-4 rounded-xl border text-center ${
                    site.status === "Ondersteund"
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 bg-white opacity-60"
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

      {/* ── CTA bottom ── */}
      <section className="bg-primary py-16">
        <div className="container-main text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">
            Klaar om uw BPM te berekenen?
          </h2>
          <p className="text-white/80 mb-7 max-w-lg mx-auto">
            Gratis, direct en nauwkeurig. Geen registratie vereist.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/bpm-calculator"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-lg font-bold text-base hover:bg-gray-50 transition-colors"
            >
              Start BPM berekening
              <Icon name="arrow-right" size={18} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white rounded-lg font-bold text-base hover:border-white/80 transition-colors"
            >
              Offerte aanvragen
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
