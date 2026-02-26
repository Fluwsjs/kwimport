"use client";

import { useState } from "react";
import Link from "next/link";
import { berekenBpm } from "@/lib/bpm/calculator";
import { formatEuro } from "@/lib/utils";

const BRANDSTOF_OPTIONS = [
  { value: "benzine", label: "Benzine" },
  { value: "diesel", label: "Diesel" },
  { value: "elektrisch", label: "Elektrisch" },
  { value: "phev", label: "PHEV" },
];

export function QuickBpmCalculator() {
  const [co2, setCo2] = useState("");
  const [brandstof, setBrandstof] = useState("benzine");
  const [datum, setDatum] = useState("");
  const [result, setResult] = useState<{
    brutoBpm: number;
    totaalBpm: number;
    afschrijvingsPercentage: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function bereken() {
    if (!co2 || !datum) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const datumObj = new Date(datum);
        const r = berekenBpm({
          voertuigType: "personenauto",
          brandstof: brandstof as "benzine" | "diesel" | "elektrisch" | "phev",
          co2Wltp: Number(co2),
          datumEersteToelating: datumObj,
          datumRegistratieNL: new Date(),
          catalogusprijs: 0,
          status:
            datumObj < new Date(new Date().getFullYear() - 0.5, 0, 1)
              ? "gebruikt"
              : "nieuw",
          afschrijvingsMethode: "forfaitair",
        });
        setResult({
          brutoBpm: r.brutoBpm,
          totaalBpm: r.totaalBpm,
          afschrijvingsPercentage: r.afschrijvingsPercentage,
        });
      } catch {
        // ignore
      }
      setLoading(false);
    }, 300);
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/30">

      {/* ── Header ── */}
      <div className="bg-[#0B1F33] px-7 py-5">
        <p className="text-[11px] font-bold text-primary/80 uppercase tracking-[0.15em] mb-1">
          BPM Calculator
        </p>
        <p className="text-white font-bold text-base leading-snug">
          Bereken uw BPM in seconden
        </p>
      </div>

      {/* ── Form ── */}
      <div className="px-7 py-6 space-y-5">

        {/* CO2 + brandstof */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              CO₂ uitstoot
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={500}
                value={co2}
                onChange={(e) => { setCo2(e.target.value); setResult(null); }}
                placeholder="120"
                className="w-full px-4 py-3 pr-14 rounded-lg border border-border bg-background text-text placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 font-medium pointer-events-none">
                g/km
              </span>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Brandstof
            </label>
            <select
              value={brandstof}
              onChange={(e) => { setBrandstof(e.target.value); setResult(null); }}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold appearance-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
            >
              {BRANDSTOF_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Datum */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Datum eerste toelating
          </label>
          <input
            type="date"
            value={datum}
            onChange={(e) => { setDatum(e.target.value); setResult(null); }}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-semibold"
          />
        </div>

        {/* Knop */}
        <button
          onClick={bereken}
          disabled={!co2 || !datum || loading}
          className="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-bold text-sm rounded-lg transition-colors"
        >
          {loading ? "Berekenen..." : "Bereken BPM"}
        </button>

        {/* Resultaat */}
        {result && (
          <div className="border-t border-border pt-5 space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Verschuldigde BPM
              </span>
              <span className="text-[10px] text-gray-300">indicatie</span>
            </div>

            <div className="text-4xl font-black text-navy tracking-tight">
              {formatEuro(result.totaalBpm)}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-background rounded-lg px-4 py-3">
                <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
                  Bruto BPM
                </div>
                <div className="text-base font-black text-navy">
                  {formatEuro(result.brutoBpm)}
                </div>
              </div>
              <div className="bg-background rounded-lg px-4 py-3">
                <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">
                  Afschrijving
                </div>
                <div className="text-base font-black text-navy">
                  {result.afschrijvingsPercentage}%
                </div>
              </div>
            </div>

            <Link
              href={`/bpm-calculator?co2Wltp=${co2}&brandstof=${brandstof}&datumEersteToelating=${datum}`}
              className="block w-full text-center py-3 border border-border rounded-lg text-sm font-semibold text-navy hover:border-primary hover:text-primary transition-colors"
            >
              Volledige berekening + PDF rapport
            </Link>
          </div>
        )}

        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          Indicatieve berekening · Definitieve BPM via Belastingdienst
        </p>
      </div>
    </div>
  );
}
