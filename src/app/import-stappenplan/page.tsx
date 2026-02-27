import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Import Stappenplan – Auto Importeren naar Nederland",
  description:
    "Stap-voor-stap gids voor het importeren van een auto naar Nederland. BPM-aangifte, RDW-keuring, kentekenaanvraag en meer.",
};

const STAPPEN = [
  {
    nr: "01",
    icon: "search" as const,
    title: "Auto zoeken & selecteren",
    items: [
      "Zoek op internationale platforms: mobile.de, AutoScout24, AutoTrader",
      "Let op voertuighistorie (HPI check of Carfax-equivalent)",
      "Controleer of het voertuig geschikt is voor NL-registratie (geen salvage title)",
      "Vraag om alle documenten: Fahrzeugbrief / Zulassungsbescheinigung Teil II, servicehistorie",
      "Vergelijk de handelsprijs met de koerslijst voor een eerlijke inkoopprijs",
    ],
    callout: {
      type: "tip" as const,
      text: "Gebruik onze BPM Calculator alvast om de totale importkosten te schatten vóór uw aankoop.",
    },
  },
  {
    nr: "02",
    icon: "file-text" as const,
    title: "Aankoop & export",
    items: [
      "Onderteken koopovereenkomst – laat notarieel vastleggen bij grote bedragen",
      "Vraag exportkenteken of tijdelijk rijbewijs aan in het land van herkomst, of laat de auto transporteren",
      "Zorg voor internationaal handelskenteken of betaal verzekering voor transport",
      "Controleer of de BTW-situatie correct is (margeregeling, BTW-vrijstelling export)",
      "Bewaar alle aankoopfacturen en exportdocumenten zorgvuldig",
    ],
  },
  {
    nr: "03",
    icon: "calculator" as const,
    title: "BPM-aangifte bij Belastingdienst",
    items: [
      "BPM-aangifte is verplicht bij import van personenauto's, motorfietsen en lichte bedrijfsauto's",
      "Dien de aangifte in via Mijn Belastingdienst (Zakelijk) of door een erkend aangiftekantoor",
      "Kies de meest voordelige afschrijvingsmethode: forfaitair, koerslijst of taxatierapport",
      "Voeg benodigde documenten toe: aankoopfactuur, kentekencard buitenland, foto's voertuig",
      "Betaal de berekende BPM vóór of bij RDW-registratie",
    ],
    callout: {
      type: "important" as const,
      text: "BPM-aangifte moet worden ingediend vóór het gebruik van de weg in Nederland. Bij een taxatierapport heeft u een erkend taxateur nodig.",
    },
  },
  {
    nr: "04",
    icon: "shield" as const,
    title: "RDW-keuring & APK",
    items: [
      "Voertuig moet voldoen aan Nederlandse / Europese veiligheidseisen",
      "Laat een individuele goedkeuring (IVT) aanvragen bij de RDW voor niet-EU-goedgekeurde voertuigen",
      "Europese voertuigen met COC (Certificate of Conformity) kunnen eenvoudiger worden goedgekeurd",
      "Plan een APK-keuring bij een erkend keuringsstation",
      "Zorg dat al het verplichte veiligheidsmateriaal aanwezig is (gevarendriehoek, hesje, EHBO)",
    ],
    callout: {
      type: "tip" as const,
      text: "Vraag de verkoper om het COC-document. Dit versnelt de RDW-procedure aanzienlijk.",
    },
  },
  {
    nr: "05",
    icon: "award" as const,
    title: "Kentekeninschrijving",
    items: [
      "Na goedkeuring BPM-aangifte en APK kunt u een kenteken aanvragen via de RDW of een erkend bedrijf",
      "Neem mee: geldig legitimatiebewijs, voertuigdocumenten (deel I, II, III), APK-bewijs, BPM-betalingsbewijs",
      "Het voertuig wordt ingeschreven in het Nederlandse kentekenregister",
      "Ontvang de kentekencard (deel 1A en 1B) en het voertuig krijgt een NL-kenteken",
      "Sluit een WA-verzekering af voor het nieuwe kenteken",
    ],
  },
];

export default function ImportStappenplanPage() {
  return (
    <div className="min-h-screen bg-white">
      <PageHero
        title="Import Stappenplan"
        description="Alles wat u moet weten over het importeren van een auto naar Nederland. Van zoeken tot kenteken."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Import Stappenplan" }]}
      />

      <div className="container-main section-padding">
        {/* Quick nav */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 mb-10">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Navigeer naar stap</div>
          <div className="flex flex-wrap gap-2">
            {STAPPEN.map((s) => (
              <a
                key={s.nr}
                href={`#stap-${s.nr}`}
                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-primary/5 border border-gray-100 hover:border-primary/20 rounded-lg text-sm transition-all group"
              >
                <span className="w-5 h-5 bg-navy text-white text-[10px] font-black rounded flex items-center justify-center group-hover:bg-primary transition-colors">
                  {s.nr.replace("0", "")}
                </span>
                <span className="text-navy/70 group-hover:text-navy font-medium text-xs">{s.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Stappen */}
        <div className="space-y-6">
          {STAPPEN.map((stap) => (
            <div
              key={stap.nr}
              id={`stap-${stap.nr}`}
              className="scroll-mt-24 bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-colors"
            >
              {/* Step header */}
              <div className="flex items-center gap-5 p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm">
                    {stap.nr}
                  </div>
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Icon name={stap.icon} size={18} className="text-gray-400" />
                  </div>
                </div>
                <h2 className="text-lg font-black text-navy tracking-tight">{stap.title}</h2>
              </div>

              <div className="p-6">
                <ul className="space-y-3 mb-4">
                  {stap.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600">
                      <Icon name="check" size={14} className="text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                {stap.callout && (
                  <div className={`rounded-lg p-4 text-sm flex gap-3 ${
                    stap.callout.type === "important"
                      ? "bg-amber-50 border border-amber-200 text-amber-800"
                      : "bg-blue-50 border border-blue-100 text-blue-800"
                  }`}>
                    <Icon
                      name={stap.callout.type === "important" ? "alert-triangle" : "info"}
                      size={16}
                      className={`shrink-0 mt-0.5 ${stap.callout.type === "important" ? "text-amber-500" : "text-blue-500"}`}
                    />
                    {stap.callout.text}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 bg-primary rounded-2xl p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-xl font-black text-white mb-2 tracking-tight">
                Klaar om de BPM te berekenen?
              </h2>
              <p className="text-white/75 text-sm">
                Gebruik onze gratis BPM Calculator voor een nauwkeurige schatting
                vóór uw aankoop.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/bpm-calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
              >
                <Icon name="calculator" size={16} />
                BPM Calculator
              </Link>
              <Link
                href="/hulp-inschakelen"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/40 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Import laten uitvoeren
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400 text-center">
          Dit stappenplan is informatief. Regelgeving kan wijzigen. Raadpleeg altijd de Belastingdienst/RDW voor de meest actuele informatie.
        </p>
      </div>
    </div>
  );
}
