import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Diensten & Pakketten – KW Automotive",
  description:
    "Bekijk onze importpakketten van €499 tot €3500. Volledig ontzorgd: RDW keuring, BPM aangifte, transport, inspectie en meer.",
};

const PAKKETTEN = [
  {
    id: "rdw",
    naam: "Pakket RDW",
    prijs: "€499",
    prijsLabel: "incl. BTW",
    beschrijving: "De essentials voor uw import: RDW keuring, BPM aangifte en kentekenleges.",
    featured: false,
    kleur: "gray",
    diensten: [
      "RDW keuring binnen 2 werkdagen (VIA)",
      "VIN controle op aanwezige opties",
      "Kentekenleges en tenaamstelling",
      "Verwijderingsbijdrage",
      "Controle papierwerk Duitse dealer",
      "Wassen en schoonmaken voertuig",
      "Computer in NL taal instellen",
      "BPM aangifte (koerslijst of afschrijvingstabel)",
      "Stalling op bewaakte parkeerplek",
      "Aflevercheck",
      "Kentekenplaten en blanco kentekenplaathouders",
    ],
  },
  {
    id: "zilver",
    naam: "Pakket Zilver",
    prijs: "Vanaf €1.799",
    prijsLabel: "incl. BTW*",
    beschrijving: "Alles uit Pakket RDW, aangevuld met transport, inspectie en aflevering in NL.",
    featured: true,
    kleur: "primary",
    diensten: [
      "Alles uit Pakket RDW",
      "Aanvullend verzekerd transport per vrachtwagen",
      "MwSt omzetting naar BTW (indien van toepassing)",
      "Versnelde individuele RDW keuring",
      "Onderhandeling met dealer",
      "Overdekte of beveiligde stalling",
      "Technische inspectie incl. vloeistof- en bandenspanning controle",
      "Wassen en stofzuigen",
      "Luxe kentekenplaten",
      "Aflevering in Wateringen of elders in NL",
    ],
    voetnoot: "* Transportprijs op aanvraag. Elektrische en hybride voertuigen hebben een gewichtstoeslag.",
  },
  {
    id: "brons",
    naam: "Pakket Brons",
    prijs: "Vanaf €2.299",
    prijsLabel: "incl. BTW*",
    beschrijving: "Volledige A-Z begeleiding inclusief persoonlijke aankoopinspectie op locatie.",
    featured: false,
    kleur: "gray",
    diensten: [
      "Alles uit Pakket Zilver",
      "Volledige A-Z afhandeling aankoop tot aflevering",
      "Persoonlijke aankoopinspectie op locatie",
      "Fotoverslag / videochat",
      "Schade- en diefstalverledencheck",
      "Kilometerstand controle",
      "Lakdiktemeting",
      "OBD uitlezen op verborgen gebreken",
      "Proefrit op locatie",
      "Volledige reiniging met carnaubawax coating",
      "Aflevering in nieuwstaat (NL of EU shipping tegen meerprijs)",
    ],
    voetnoot: "* Transportprijs afhankelijk van land/regio en voertuigtype.",
  },
  {
    id: "gold",
    naam: "Pakket Gold",
    prijs: "Vanaf €3.500",
    prijsLabel: "incl. BTW",
    beschrijving: "Het meest complete pakket met financiering, zoekopdracht en volledige aftersales.",
    featured: false,
    kleur: "gold",
    diensten: [
      "Alles uit Pakket Brons",
      "Zoekopdracht service",
      "Voorfinanciering aankoop",
      "Supersnelle douane-afhandeling",
      "Voertuig rijklaar op NL kenteken",
      "Inclusief BPM en 21% BTW factuur",
      "Financial lease of particuliere financiering",
      "Garantie-opties mogelijk",
      "Persoonlijke aftersales support",
      "Aflevering thuis of op kantoor in NL",
    ],
  },
];

const EXTRA_DIENSTEN = [
  "BPM-berekening op maat",
  "Zakelijk leasen van geïmporteerde voertuigen",
  "Technische aankoopinspecties",
  "Export- en EU shipping services",
];

export default function HulpInschakelenPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="Diensten & Pakketten"
        description="Van eenvoudige BPM-aangifte tot volledige A-Z importbegeleiding. Kies het pakket dat bij uw situatie past."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Diensten" }]}
        badge="Auto Import Service"
      />

      {/* ── Intro ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-main py-14">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Over ons</p>
              <h2 className="text-2xl md:text-3xl font-black text-navy tracking-tight mb-4">
                Auto Import Service
              </h2>
              <p className="text-gray-500 leading-relaxed mb-0">
                KW Automotive helpt klanten bij het volledig importeren van voertuigen uit Duitsland
                en andere Europese landen. U vindt zelf uw gewenste voertuig, wij verzorgen de
                volledige controle, transparantie en afhandeling tegen een vaste fee.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Waarom KW Automotive?</p>
              <ul className="space-y-3">
                {[
                  "Professionele inspectie op locatie (geheel Europa)",
                  "Persoonlijke service en begeleiding van A tot Z",
                  "Duidelijke communicatie en vaste prijsafspraken",
                  "Technische expertise en ervaring in Europese import",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name="check" size={11} className="text-primary" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pakketten ── */}
      <section className="container-main py-16" id="pakketten">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Transparante prijzen</p>
          <h2 className="text-2xl md:text-3xl font-black text-navy tracking-tight">Kies uw pakket</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {PAKKETTEN.map((pakket) => (
            <div
              key={pakket.id}
              className={`relative flex flex-col rounded-2xl overflow-hidden transition-all ${
                pakket.featured
                  ? "bg-navy shadow-2xl shadow-navy/25 ring-2 ring-primary"
                  : pakket.kleur === "gold"
                  ? "bg-white border-2 border-amber-200 hover:shadow-lg"
                  : "bg-white border-2 border-gray-100 hover:border-primary/30 hover:shadow-lg"
              }`}
            >
              {pakket.featured && (
                <div className="bg-primary text-white text-center text-[11px] font-bold py-2 tracking-widest uppercase">
                  Meest gekozen
                </div>
              )}
              {pakket.kleur === "gold" && (
                <div className="bg-amber-400 text-amber-900 text-center text-[11px] font-bold py-2 tracking-widest uppercase">
                  Premium
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="mb-5">
                  <h3 className={`text-lg font-black tracking-tight mb-1 ${pakket.featured ? "text-white" : "text-navy"}`}>
                    {pakket.naam}
                  </h3>
                  <div className={`font-black tracking-tight text-2xl mb-0.5 ${
                    pakket.featured ? "text-primary" : pakket.kleur === "gold" ? "text-amber-500" : "text-primary"
                  }`}>
                    {pakket.prijs}
                  </div>
                  <div className={`text-xs font-semibold mb-3 ${pakket.featured ? "text-white/40" : "text-gray-400"}`}>
                    {pakket.prijsLabel}
                  </div>
                  <p className={`text-xs leading-relaxed ${pakket.featured ? "text-white/55" : "text-gray-400"}`}>
                    {pakket.beschrijving}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {pakket.diensten.map((dienst, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs">
                      <Icon
                        name="check"
                        size={12}
                        className={`shrink-0 mt-0.5 ${
                          pakket.featured ? "text-primary" : pakket.kleur === "gold" ? "text-amber-500" : "text-primary"
                        }`}
                      />
                      <span className={pakket.featured ? "text-white/75" : "text-gray-600"}>{dienst}</span>
                    </li>
                  ))}
                </ul>

                {/* Voetnoot */}
                {"voetnoot" in pakket && pakket.voetnoot && (
                  <p className={`text-[10px] leading-relaxed mb-4 ${pakket.featured ? "text-white/30" : "text-gray-300"}`}>
                    {pakket.voetnoot}
                  </p>
                )}

                {/* CTA */}
                <Link
                  href={`/contact?pakket=${pakket.id}`}
                  className={`mt-auto flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                    pakket.featured
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : pakket.kleur === "gold"
                      ? "bg-amber-400 text-amber-900 hover:bg-amber-500"
                      : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  Offerte aanvragen
                  <Icon name="arrow-right" size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Aanvullende diensten ── */}
      <section className="bg-white border-y border-gray-100">
        <div className="container-main py-14">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Meer mogelijkheden</p>
              <h2 className="text-2xl font-black text-navy tracking-tight mb-4">Aanvullende Diensten</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                KW Automotive staat voor transparantie, kwaliteit en zorgeloze auto-import.
                Naast onze pakketten bieden wij ook losse diensten aan.
              </p>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {EXTRA_DIENSTEN.map((dienst) => (
                <li key={dienst} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm text-navy font-medium">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon name="check" size={12} className="text-primary" />
                  </span>
                  {dienst}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Extra info secties ── */}
      <section className="container-main py-16">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Onderhoud & Service */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <Icon name="zap" size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-black text-navy tracking-tight mb-3">
              Onderhoud & Service
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Bij KW Automotive stopt onze service niet bij import en aflevering. Indien gewenst
              voeren wij ook <strong className="text-navy">onderhoud en technische werkzaamheden</strong> uit
              tegen gunstige tarieven.
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Volgens fabrieks- en dealer voorschriften",
                "Met kwalitatieve onderdelen",
                "Met correcte onderhoudsregistratie",
                "Transparant in prijsopgave vooraf",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                  <Icon name="check" size={11} className="text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 leading-relaxed mb-1">
              Of het nu gaat om een grote onderhoudsbeurt, vloeistofservice, bandenservice of
              afleverinspectie — wij zorgen dat uw voertuig technisch in topconditie wordt gebracht
              vóór aflevering.
            </p>
            <p className="text-xs font-bold text-navy mt-3">Kwaliteit zonder dealerprijzen.</p>
          </div>

          {/* Elektrische Auto Import */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <Icon name="zap" size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-black text-navy tracking-tight mb-1">
              Elektrische Import
            </h3>
            <p className="text-xs font-semibold text-primary mb-3">Accu Controle & SOH Rapport</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              KW Automotive is gespecialiseerd in de import van <strong className="text-navy">elektrische
              en hybride voertuigen</strong>. Bij elektrische auto&apos;s is de staat van de accu essentieel.
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Wij verzorgen:</p>
            <ul className="space-y-2 mb-4">
              {[
                "Accu diagnose en SOH (State of Health) rapport",
                "Controle laadcapaciteit en batterijconditie",
                "Controle op terugroepacties",
                "Controle op software-updates",
                "Volledige technische inspectie",
                "Controle schade- en onderhoudshistorie",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                  <Icon name="check" size={11} className="text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-gray-400 leading-relaxed border-t border-gray-100 pt-3">
              Let op: fabrieksgarantie is niet in alle gevallen overdraagbaar en verschilt per merk en bouwjaar.
            </p>
          </div>

          {/* Persoonlijke Inspectie */}
          <div className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <Icon name="shield" size={20} className="text-primary" />
            </div>
            <h3 className="text-lg font-black text-navy tracking-tight mb-3">
              Persoonlijke Inspectie
            </h3>
            <p className="text-sm font-semibold text-navy mb-3 leading-snug">
              Elke auto die wij aankopen of voor u gaan bekijken, wordt persoonlijk door ons geïnspecteerd.
            </p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Wij beoordelen:</p>
            <ul className="space-y-2 mb-4">
              {[
                "Carrosserie en lak",
                "Technische staat",
                "Onderhoudshistorie",
                "Kilometerstand",
                "Verborgen gebreken (waar mogelijk)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                  <Icon name="check" size={11} className="text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
              <p className="text-[11px] text-amber-800 leading-relaxed">
                <strong>Let op:</strong> Indien wij aangeven dat een voertuig tegenvalt en u besluit
                desondanks tot aankoop over te gaan, kunnen wij niet garant staan voor eventuele
                gebreken die wij vooraf hebben gemeld.
              </p>
            </div>
            <p className="text-xs font-bold text-navy">Wij werken transparant en zonder verborgen kosten.</p>
          </div>

        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-navy">
        <div className="container-main py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
            Vragen of direct een offerte?
          </h2>
          <p className="text-white/55 text-sm mb-8 max-w-md mx-auto">
            Neem vrijblijvend contact op. Wij geven u binnen 1 werkdag persoonlijk advies.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="px-7 py-3.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-lg transition-colors shadow-lg shadow-primary/20"
            >
              Neem contact op
            </Link>
            <a
              href="tel:+31243030400"
              className="px-7 py-3.5 border border-white/20 text-white hover:bg-white/10 font-semibold text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              <Icon name="phone" size={14} />
              +31 24 303 0400
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
