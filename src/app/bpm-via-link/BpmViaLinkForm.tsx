"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ParsedCarData } from "@/lib/adapters/types";

export function BpmViaLinkForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedCarData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleParse(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setParsed(null);

    try {
      const res = await fetch("/api/parse-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Parsen mislukt");

      setParsed(json.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is iets misgegaan");
    } finally {
      setLoading(false);
    }
  }

  function handleGoToCalculator() {
    if (!parsed) return;
    const params = new URLSearchParams();
    if (parsed.datumEersteToelating) params.set("datumEersteToelating", parsed.datumEersteToelating);
    if (parsed.co2Wltp) params.set("co2Wltp", String(parsed.co2Wltp));
    if (parsed.brandstof) params.set("brandstof", parsed.brandstof);
    if (parsed.catalogusprijs) params.set("catalogusprijs", String(parsed.catalogusprijs));
    router.push(`/bpm-calculator?${params.toString()}`);
  }

  const confidenceColor = {
    high: "text-green-700 bg-green-50 border-green-200",
    medium: "text-amber-700 bg-amber-50 border-amber-200",
    low: "text-red-700 bg-red-50 border-red-200",
  };

  const confidenceLabel = {
    high: "✓ Hoge betrouwbaarheid",
    medium: "⚠ Gemiddelde betrouwbaarheid",
    low: "✗ Lage betrouwbaarheid – controleer handmatig",
  };

  return (
    <div className="space-y-6">
      <div className="card-lg">
        <form onSubmit={handleParse} className="space-y-4">
          <div>
            <label className="label">Advertentielink</label>
            <div className="flex gap-3">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.mobile.de/auto/..."
                className="input-field flex-1"
                required
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="btn-primary shrink-0"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Ophalen...
                  </span>
                ) : (
                  "Ophalen →"
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>

      {parsed && (
        <div className="card-lg space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-navy">Gevonden voertuiggegevens</h3>
            <span className={`text-xs border px-2.5 py-1 rounded-full font-medium ${confidenceColor[parsed.parseConfidence]}`}>
              {confidenceLabel[parsed.parseConfidence]}
            </span>
          </div>

          {parsed.title && (
            <div className="text-sm font-medium text-navy bg-background rounded-lg p-3">
              {parsed.title}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Merk", value: parsed.merk },
              { label: "Model", value: parsed.model },
              { label: "Brandstof", value: parsed.brandstof },
              { label: "CO₂ (WLTP)", value: parsed.co2Wltp ? `${parsed.co2Wltp} g/km` : undefined },
              { label: "Eerste toelating", value: parsed.datumEersteToelating },
              { label: "Prijs", value: parsed.catalogusprijs ? `€${parsed.catalogusprijs.toLocaleString("nl-NL")}` : undefined },
            ].map((field) => (
              <div key={field.label} className="bg-background rounded-xl p-3">
                <div className="text-xs text-navy/40 mb-0.5">{field.label}</div>
                <div className={`text-sm font-medium ${field.value ? "text-navy" : "text-muted/60 italic"}`}>
                  {field.value ?? "Niet gevonden"}
                </div>
              </div>
            ))}
          </div>

          {parsed.parseErrors.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-sm font-medium text-amber-800 mb-2">Ontbrekende gegevens</h4>
              <ul className="space-y-1">
                {parsed.parseErrors.map((err, i) => (
                  <li key={i} className="text-sm text-amber-700">• {err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleGoToCalculator}
              className="btn-primary flex-1"
            >
              🧮 Ga naar BPM Calculator met deze gegevens
            </button>
          </div>
          <p className="text-xs text-navy/40 text-center">
            Controleer de gegevens in de calculator voordat u de berekening uitvoert.
          </p>
        </div>
      )}
    </div>
  );
}
