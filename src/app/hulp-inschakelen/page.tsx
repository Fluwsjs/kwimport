import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Hulp Inschakelen bij Auto-Import – KW Automotive",
  description:
    "Professionele hulp bij uw auto-import. Van BPM-aangifte tot volledige importbegeleiding. Vraag vrijblijvend een offerte aan.",
};

const PAKKETTEN = [
  {
    id: "basis",
    naam: "BPM Aangifte",
    prijs: "vanaf €299",
    beschrijving: "Wij verzorgen de volledige BPM-aangifte voor uw importvoertuig.",
    featured: false,
    diensten: [
      "Intake en documentcontrole",
      "BPM-berekening (meest voordelige methode)",
      "Taxatierapport coördineren (indien gewenst)",
      "Indienen aangifte bij Belastingdienst",
      "Begeleidende communicatie",
    ],
  },
  {
    id: "compleet",
    naam: "Import Compleet",
    prijs: "vanaf €699",
    beschrijving: "Complete ontzorging van aankoop tot rijklaar in Nederland.",
    featured: true,
    diensten: [
      "Alles uit het BPM Aangifte pakket",
      "RDW-registratie & kentekenaanvraag",
      "APK-keuring regelen",
      "Tijdelijk exportkenteken (indien nodig)",
      "Transport coördineren (optioneel)",
      "Prioriteitsbehandeling",
    ],
  },
  {
    id: "advies",
    naam: "Aankoop Advies",
    prijs: "€149",
    beschrijving: "Professioneel advies bij het selecteren en beoordelen van een importauto.",
    featured: false,
    diensten: [
      "Beoordeling van advertentie/voertuig",
      "Kostenberekening (BPM, transport, keuring)",
      "Risico-inschatting en documentcontrole",
      "Adviesgesprek (telefonisch of video)",
      "Schriftelijke samenvatting",
    ],
  },
];

export default function HulpInschakelenPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-main py-10">
          <div className="accent-line mb-4" />
          <h1 className="text-3xl md:text-4xl font-black text-navy mb-3 tracking-tight">
            Hulp Inschakelen
          </h1>
          <p className="text-gray-500 max-w-xl">
            Kies het pakket dat bij uw situatie past. Wij regelen de details zodat u kunt genieten van uw nieuwe auto.
          </p>
        </div>
      </div>

      <div className="container-main section-padding">
        {/* Pakketten */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PAKKETTEN.map((pakket) => (
            <div
              key={pakket.id}
              className={`relative rounded-xl overflow-hidden transition-all ${
                pakket.featured
                  ? "bg-navy shadow-2xl shadow-navy/30 ring-2 ring-primary"
                  : "bg-white border-2 border-gray-100 hover:border-primary/30 hover:shadow-md"
              }`}
            >
              {pakket.featured && (
                <div className="bg-primary text-white text-center text-xs font-bold py-2 tracking-wider uppercase">
                  Meest gekozen
                </div>
              )}

              <div className="p-7">
                <div className="mb-6">
                  <h3 className={`text-xl font-black mb-1 tracking-tight ${pakket.featured ? "text-white" : "text-navy"}`}>
                    {pakket.naam}
                  </h3>
                  <div className={`text-3xl font-black mb-3 tracking-tight ${pakket.featured ? "text-primary" : "text-primary"}`}>
                    {pakket.prijs}
                  </div>
                  <p className={`text-sm leading-relaxed ${pakket.featured ? "text-white/60" : "text-gray-500"}`}>
                    {pakket.beschrijving}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {pakket.diensten.map((dienst, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <Icon
                        name="check"
                        size={14}
                        className={`shrink-0 mt-0.5 ${pakket.featured ? "text-primary" : "text-primary"}`}
                      />
                      <span className={pakket.featured ? "text-white/80" : "text-gray-600"}>{dienst}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/contact?pakket=${pakket.id}`}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-sm transition-all ${
                    pakket.featured
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  Offerte aanvragen
                  <Icon name="arrow-right" size={15} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* USPs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: "zap" as const, title: "Snelle afhandeling", desc: "Doorgaans binnen 5 werkdagen" },
            { icon: "shield" as const, title: "Gecertificeerd", desc: "Erkend aangiftekantoor" },
            { icon: "user" as const, title: "Persoonlijk contact", desc: "Direct met een specialist" },
            { icon: "check-circle" as const, title: "Transparant", desc: "Geen verborgen kosten" },
          ].map((item) => (
            <div key={item.title} className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Icon name={item.icon} size={18} className="text-primary" />
              </div>
              <div className="font-bold text-navy text-sm mb-1">{item.title}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl">
          <h2 className="text-xl font-black text-navy mb-6 tracking-tight">Veelgestelde vragen</h2>
          <div className="space-y-5">
            {[
              {
                q: "Hoe lang duurt het importproces?",
                a: "Gemiddeld 2–4 weken, afhankelijk van de BPM-afhandeling door de Belastingdienst en de RDW-procedure. Wij houden u op de hoogte.",
              },
              {
                q: "Kan ik ook een auto importeren van buiten Europa?",
                a: "Ja, maar de procedure is complexer (IVT-aanvraag, aanpassen aan EU-normen). Neem contact op voor een specifieke offerte.",
              },
              {
                q: "Is een taxatierapport altijd nodig?",
                a: "Nee. Voor de meeste importauto's volstaat de forfaitaire methode. Een taxatierapport kan voordeliger uitpakken bij oudere of bijzondere voertuigen.",
              },
            ].map((faq, i) => (
              <div key={i} className="pb-5 border-b border-gray-100 last:border-0">
                <h3 className="font-bold text-navy text-sm mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
