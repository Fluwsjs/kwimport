import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact & Offerte Aanvragen – KW Automotive Import",
  description:
    "Neem contact op of vraag een vrijblijvende offerte aan voor uw auto-import. Wij reageren binnen één werkdag.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-navy mb-2">
            Contact & Offerte
          </h1>
          <p className="text-navy/60">
            Stel uw vraag of vraag een vrijblijvende offerte aan. Wij reageren doorgaans binnen één werkdag.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card">
              <h3 className="font-semibold text-navy mb-3 text-sm">Contactgegevens</h3>
              <div className="space-y-3 text-sm text-navy/70">
                <div className="flex gap-2">
                  <span>📧</span>
                  <a href="mailto:info@kwautomotive.nl" className="text-primary hover:underline">
                    info@kwautomotive.nl
                  </a>
                </div>
                <div className="flex gap-2">
                  <span>📞</span>
                  <span>+31 (0)6 XX XX XX XX</span>
                </div>
                <div className="flex gap-2">
                  <span>🕒</span>
                  <span>Ma–Vr: 9:00–17:00</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-navy mb-3 text-sm">Verwachte reactietijd</h3>
              <div className="space-y-2 text-sm text-navy/60">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>Eenvoudige vragen: zelfde dag</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Offerteaanvragen: 1–2 werkdagen</span>
                </div>
              </div>
            </div>

            <div className="card bg-primary/5 border border-primary/20">
              <h3 className="font-semibold text-primary mb-2 text-sm">💡 Direct berekenen?</h3>
              <p className="text-xs text-navy/60 mb-3">
                Probeer eerst onze gratis BPM Calculator voor een snelle indicatie.
              </p>
              <a href="/bpm-calculator" className="btn-primary text-xs w-full justify-center">
                Naar BPM Calculator
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
