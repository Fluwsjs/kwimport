"use client";

import { useState } from "react";
import Link from "next/link";
import { formatEuro, formatPercent } from "@/lib/utils";
import type { BpmResultaat } from "@/lib/bpm/types";
import type { WizardData } from "./BpmWizard";
import { Icon } from "@/components/ui/Icon";

interface StepDProps {
  input: WizardData;
  resultaat: BpmResultaat;
  onReset: () => void;
}

export function StepD({ input, resultaat, onReset }: StepDProps) {
  const [downloading, setDownloading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  async function downloadPdf() {
    setDownloading(true);
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, resultaat }),
      });
      if (!res.ok) throw new Error("PDF genereren mislukt");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bpm-berekening-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("PDF downloaden mislukt. Probeer het opnieuw.");
    } finally {
      setDownloading(false);
    }
  }

  const isGebruikt = input.status === "gebruikt";
  const afschrijvingWidth = Math.min(100, resultaat.afschrijvingsPercentage);
  const restWidth = 100 - afschrijvingWidth;

  const METHODE_LABEL: Record<string, string> = {
    forfaitair: "Forfaitaire tabel",
    koerslijst: "Koerslijst",
    taxatierapport: "Taxatierapport",
    nieuw: "Nieuw voertuig",
  };

  return (
    <div className="space-y-4">
      {/* ── Hoofd resultaat-kaart ── */}
      <div className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden">
        {/* Groene success header */}
        <div className="bg-gradient-to-r from-navy to-primary-dark px-7 py-5 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
              Berekeningsresultaat
            </p>
            <p className="text-white/80 text-sm">
              Tariefjaar {resultaat.tariefjaar} &middot; {METHODE_LABEL[resultaat.methode] ?? resultaat.methode}
            </p>
          </div>
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <Icon name="check-circle" size={22} className="text-white" />
          </div>
        </div>

        <div className="p-7">
          {/* Grote uitkomst */}
          <div className="flex items-end justify-between mb-7 pb-7 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-2">
                Verschuldigde BPM (indicatie)
              </p>
              <p className="text-5xl font-black text-navy tracking-tight">
                {formatEuro(resultaat.totaalBpm)}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Definitieve BPM via aangifte Belastingdienst
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-400 mb-1">CO₂</div>
              <div className="text-2xl font-black text-gray-300">
                {resultaat.details.co2}
                <span className="text-base font-medium"> g/km</span>
              </div>
            </div>
          </div>

          {/* Drie metrics */}
          <div className="grid grid-cols-3 gap-4 mb-7">
            <div className="text-center">
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">
                Bruto BPM
              </p>
              <p className="text-xl font-black text-navy">{formatEuro(resultaat.brutoBpm)}</p>
              {resultaat.dieselToeslag !== undefined && (
                <p className="text-[10px] text-orange-500 mt-0.5">
                  incl. diesel +{formatEuro(resultaat.dieselToeslag)}
                </p>
              )}
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">
                Afschrijving
              </p>
              <p className="text-xl font-black text-navy">
                {formatPercent(resultaat.afschrijvingsPercentage)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {isGebruikt ? `${resultaat.details.leeftijdMaanden} mnd oud` : "Nieuw"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">
                Te betalen
              </p>
              <p className="text-xl font-black text-primary">{formatEuro(resultaat.totaalBpm)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">rest-BPM</p>
            </div>
          </div>

          {/* Visuele afschrijvingsbalk */}
          {isGebruikt && (
            <div className="mb-7">
              <div className="flex justify-between text-[11px] text-gray-400 font-medium mb-2">
                <span>Afschrijving {formatPercent(resultaat.afschrijvingsPercentage)}</span>
                <span>Rest-BPM {formatPercent(restWidth)}</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="bg-gray-300 rounded-l-full transition-all duration-700"
                  style={{ width: `${afschrijvingWidth}%` }}
                />
                <div
                  className="bg-primary rounded-r-full transition-all duration-700"
                  style={{ width: `${restWidth}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                <span>Afschreven waarde</span>
                <span className="text-primary font-semibold">Te betalen BPM</span>
              </div>
            </div>
          )}

          {/* Acties */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={downloadPdf}
              disabled={downloading}
              className="btn-primary flex-1 justify-center"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  PDF genereren...
                </>
              ) : (
                <>
                  <Icon name="download" size={16} />
                  Download PDF rapport
                </>
              )}
            </button>
            <button onClick={onReset} className="btn-outline flex-1 justify-center">
              <Icon name="calculator" size={16} />
              Nieuwe berekening
            </button>
          </div>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 flex gap-3 text-sm text-amber-800">
        <Icon name="alert-triangle" size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <span>
          <strong>Indicatieve berekening.</strong> De definitieve BPM volgt uit de officiële aangifte
          bij de Belastingdienst. Afwijkingen zijn mogelijk door tariefwijzigingen of
          voertuigspecificaties.
        </span>
      </div>

      {/* ── Berekeningsdetails (inklapbaar) ── */}
      <div className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <Icon name="file-text" size={16} className="text-gray-400" />
            <span className="font-semibold text-navy text-sm">Berekeningsdetails & aannames</span>
          </div>
          <Icon
            name="chevron-right"
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${showDetails ? "rotate-90" : ""}`}
          />
        </button>

        {showDetails && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-5">
            {/* Voertuiggegevens */}
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-3">
                Voertuiggegevens
              </p>
              <div className="space-y-0">
                {[
                  { label: "Brandstof", value: resultaat.details.brandstof },
                  { label: "CO₂-uitstoot (WLTP)", value: `${resultaat.details.co2} g/km` },
                  { label: "Leeftijd", value: resultaat.details.leeftijdMaanden != null ? `${resultaat.details.leeftijdMaanden} maanden` : "Nieuw" },
                  { label: "Status", value: isGebruikt ? "Gebruikt" : "Nieuw" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{row.label}</span>
                    <span className="text-sm font-semibold text-navy capitalize">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tariefberekening */}
            <div>
              <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-3">
                Tariefberekening
              </p>
              <div className="bg-gray-50 rounded-lg p-3 font-mono text-xs text-gray-600">
                {resultaat.details.schijfBerekening}
              </div>
            </div>

            {/* Tariefvergelijking */}
            {resultaat.tariefVergelijking && resultaat.tariefVergelijking.length > 1 && (
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-3">
                  Tariefvergelijking (kies het gunstigste jaar)
                </p>
                <div className="space-y-1.5">
                  {resultaat.tariefVergelijking.map((r) => (
                    <div
                      key={r.jaar}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm ${
                        r.gebruikt
                          ? "bg-primary/8 border border-primary/20"
                          : "bg-gray-50"
                      }`}
                    >
                      <span className={r.gebruikt ? "font-bold text-primary" : "text-gray-500"}>
                        Tarief {r.jaar}
                        {r.gebruikt && <span className="ml-2 text-[10px] bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold">Huidig</span>}
                      </span>
                      <span className={r.gebruikt ? "font-black text-primary" : "font-semibold text-navy"}>
                        {formatEuro(r.totaalBpm)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 mt-2">
                  Bij een gebruikte auto mag u het gunstigste tariefjaar kiezen. Controleer via de Belastingdienst.
                </p>
              </div>
            )}

            {/* Aannames */}
            {resultaat.aannames.length > 0 && (
              <div>
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-3">
                  Aannames
                </p>
                <ul className="space-y-2">
                  {resultaat.aannames.map((a, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                      <Icon name="check" size={13} className="text-primary shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Waarschuwingen */}
            {resultaat.waarschuwingen.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">
                  Aandachtspunten
                </p>
                <ul className="space-y-1.5">
                  {resultaat.waarschuwingen.map((w, i) => (
                    <li key={i} className="text-sm text-amber-700 flex gap-2">
                      <Icon name="alert-triangle" size={13} className="text-amber-500 shrink-0 mt-0.5" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CTA hulp inschakelen ── */}
      <div className="bg-navy rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
        <div>
          <p className="text-white font-bold mb-1">Hulp nodig bij uw BPM-aangifte?</p>
          <p className="text-white/60 text-sm">
            Onze specialisten regelen de aangifte, RDW-keuring en kentekenaanvraag.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link href="/hulp-inschakelen" className="btn-primary whitespace-nowrap">
            Bekijk pakketten
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/25 text-white rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            Offerte
          </Link>
        </div>
      </div>
    </div>
  );
}
