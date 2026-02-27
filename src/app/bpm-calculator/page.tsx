import type { Metadata } from "next";
import { BpmWizard } from "@/components/bpm/BpmWizard";
import { Icon } from "@/components/ui/Icon";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "BPM Calculator 2025 – Bereken uw BPM bij auto-import",
  description:
    "Gratis BPM calculator voor auto-import naar Nederland. Forfaitaire tabel, koerslijst of taxatierapport methode. Actuele tarieven 2024 & 2025.",
};

export default function BpmCalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="BPM Calculator"
        description="Bereken de verschuldigde BPM voor uw importauto in vier stappen. Kies de meest voordelige afschrijvingsmethode."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "BPM Calculator" }]}
      />

      <div className="container-main py-10 max-w-4xl">
        {/* Disclaimer */}
        <div className="disclaimer-box mb-8 flex gap-3">
          <Icon name="alert-triangle" size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong>Indicatieve berekening:</strong> De resultaten zijn een indicatie.
            De definitieve BPM wordt vastgesteld door de Belastingdienst bij de officiële aangifte.
            Tarieven zijn gebaseerd op gepubliceerde Belastingdienst-data voor 2024 en 2025.
          </div>
        </div>

        <BpmWizard />

        {/* Methode uitleg */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "bar-chart" as const,
              title: "Forfaitaire methode",
              desc: "Wettelijke tabel op basis van leeftijd in maanden. Standaard bij de meeste importauto's. Eenvoudig en snel.",
            },
            {
              icon: "trending-up" as const,
              title: "Koerslijst methode",
              desc: "Op basis van marktwaarde uit erkende koerslijst (XRAY, Eurotaxglass). Kan gunstiger uitpakken bij sterk afgeschreven auto's.",
            },
            {
              icon: "search" as const,
              title: "Taxatierapport",
              desc: "Vereist een officieel taxatierapport van een erkend taxateur. Meest nauwkeurig voor bijzondere voertuigen.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Icon name={item.icon} size={16} className="text-primary" />
              </div>
              <h3 className="font-bold text-navy text-sm mb-2">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
