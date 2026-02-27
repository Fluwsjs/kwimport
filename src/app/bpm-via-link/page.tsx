import type { Metadata } from "next";
import { BpmViaLinkForm } from "./BpmViaLinkForm";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "BPM Berekenen via Advertentielink – Beta",
  description:
    "Plak een advertentielink van mobile.de of AutoScout24 en bereken automatisch de BPM voor uw importauto.",
};

export default function BpmViaLinkPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHero
        title="BPM via Advertentielink"
        description="Plak een advertentielink van mobile.de of AutoScout24. Wij extraheren automatisch de voertuiggegevens en berekenen de BPM."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "BPM via link" }]}
        badge="Beta"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="disclaimer-box mb-8">
          <strong>Beta functie:</strong> Automatisch parsen van advertenties is niet altijd 100% nauwkeurig.
          Controleer altijd de ingevulde gegevens voordat u de berekening uitvoert.
          Bij twijfel: gebruik de{" "}
          <a href="/bpm-calculator" className="text-primary underline">
            handmatige BPM Calculator
          </a>.
        </div>

        <BpmViaLinkForm />

        {/* Ondersteunde sites */}
        <div className="mt-10 card">
          <h3 className="font-semibold text-navy mb-4">Ondersteunde websites</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "mobile.de", status: "supported", icon: "🇩🇪" },
              { name: "AutoScout24", status: "supported", icon: "🌍" },
              { name: "AutoTrader UK", status: "soon", icon: "🇬🇧" },
              { name: "Overig", status: "manual", icon: "🔗" },
            ].map((site) => (
              <div
                key={site.name}
                className={`p-3 rounded-xl border text-center text-sm ${
                  site.status === "supported"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : site.status === "soon"
                    ? "border-muted/20 bg-background text-muted"
                    : "border-muted/20 bg-background text-navy/50"
                }`}
              >
                <div className="text-xl mb-1">{site.icon}</div>
                <div className="font-medium">{site.name}</div>
                <div className="text-xs mt-0.5">
                  {site.status === "supported" ? "✓ Ondersteund" : site.status === "soon" ? "Binnenkort" : "Handmatig"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
