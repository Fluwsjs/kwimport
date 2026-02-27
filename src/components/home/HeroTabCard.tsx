"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { berekenBpm } from "@/lib/bpm/calculator";
import { formatEuro } from "@/lib/utils";
import type { ParsedCarData } from "@/lib/adapters/types";

/* ── helpers ── */
function calcBpm(co2: number, brandstof: string, datumStr: string, prijs: number) {
  try {
    const datum = new Date(datumStr);
    return berekenBpm({
      voertuigType: "personenauto",
      brandstof: brandstof as "benzine" | "diesel" | "elektrisch" | "phev",
      co2Wltp: co2,
      datumEersteToelating: datum,
      datumRegistratieNL: new Date(),
      catalogusprijs: prijs,
      status: datum < new Date(new Date().getFullYear() - 0.5, 0, 1) ? "gebruikt" : "nieuw",
      afschrijvingsMethode: "forfaitair",
    });
  } catch { return null; }
}

/** Detecteer de site van een URL en geef bruikbare info terug */
function detectSite(url: string): { site: "mobile.de" | "autoscout24" | "other"; canAutoFetch: boolean } {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host.includes("mobile.de"))    return { site: "mobile.de",   canAutoFetch: false };
    if (host.includes("autoscout24"))  return { site: "autoscout24", canAutoFetch: true };
  } catch { /* ignore */ }
  return { site: "other", canAutoFetch: false };
}

/* ═══════════════════════════════════════════════════════════════ */

export function HeroTabCard() {
  const [tab, setTab] = useState<"berekenen" | "link">("berekenen");

  /* ── Tab 1 ── */
  const [co2, setCo2]         = useState("");
  const [brandstof, setBrand] = useState("benzine");
  const [datum, setDatum]     = useState("");
  const [vraagprijs, setVraag] = useState("");
  const [calcResult, setCalcResult] = useState<ReturnType<typeof calcBpm>>(null);
  const [calcLoading, setCalcLoading] = useState(false);

  /* ── Tab 2 ── */
  const [url, setUrl]           = useState("");
  const [siteInfo, setSiteInfo] = useState<ReturnType<typeof detectSite> | null>(null);
  const [parseLoading, setParseLoading] = useState(false);
  const [parsed, setParsed]     = useState<ParsedCarData | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);

  const [editCo2,   setEditCo2]   = useState("");
  const [editBrand, setEditBrand] = useState("benzine");
  const [editDatum, setEditDatum] = useState("");
  const [editPrijs, setEditPrijs] = useState("");
  const [linkResult, setLinkResult] = useState<ReturnType<typeof calcBpm>>(null);

  /* Live detectie zodra URL verandert */
  useEffect(() => {
    if (!url.trim()) { setSiteInfo(null); setShowManual(false); return; }
    try { new URL(url); setSiteInfo(detectSite(url)); } catch { setSiteInfo(null); }
  }, [url]);

  /* ── handlers ── */
  function bereken() {
    if (!datum) return;
    setCalcLoading(true);
    setTimeout(() => {
      setCalcResult(calcBpm(Number(co2) || 0, brandstof, datum, Number(vraagprijs) || 0));
      setCalcLoading(false);
    }, 300);
  }

  function applyParsed(p: ParsedCarData) {
    setEditCo2(p.co2Wltp ? String(p.co2Wltp) : "");
    setEditBrand(p.brandstof ?? "benzine");
    setEditDatum(p.datumEersteToelating ?? "");
    setEditPrijs(p.catalogusprijs ? String(p.catalogusprijs) : "");
    setShowManual(true);
    if (p.co2Wltp && p.datumEersteToelating && p.brandstof) {
      setLinkResult(calcBpm(p.co2Wltp, p.brandstof, p.datumEersteToelating, p.catalogusprijs ?? 0));
    }
  }

  async function handleParseUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    const info = detectSite(url);

    /* Mobile.de: sla de fetch over, toon direct het handmatige formulier */
    if (!info.canAutoFetch) {
      setParsed({ sourceUrl: url, sourceSite: info.site, parseConfidence: "low", parseErrors: [] });
      setShowManual(true);
      return;
    }

    /* AutoScout24 en overige: probeer automatisch ophalen */
    setParseLoading(true);
    setParseError(null);
    setParsed(null);
    setShowManual(false);

    try {
      const res = await fetch("/api/parse-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Parsen mislukt");
      setParsed(json.result);
      applyParsed(json.result);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Er is iets misgegaan");
      setShowManual(true);
    } finally {
      setParseLoading(false);
    }
  }

  function berekenViaLink() {
    setLinkResult(calcBpm(Number(editCo2) || 0, editBrand, editDatum, Number(editPrijs) || 0));
  }

  function buildCalculatorUrl() {
    const p = new URLSearchParams();
    if (editDatum) p.set("datumEersteToelating", editDatum);
    if (editCo2)   p.set("co2Wltp", editCo2);
    if (editBrand) p.set("brandstof", editBrand);
    if (editPrijs) p.set("catalogusprijs", editPrijs);
    return `/bpm-calculator?${p.toString()}`;
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">

      {/* ── Tabs ── */}
      <div className="flex">
        {(["berekenen", "link"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-4 py-4 text-[11px] font-bold uppercase tracking-wider transition-colors border-b-2 ${
              tab === t
                ? "bg-navy text-white border-navy"
                : "bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 border-gray-100"
            }`}
          >
            {t === "berekenen" ? "BPM Snel Zelf Berekenen" : "BPM via Advertentielink"}
          </button>
        ))}
      </div>

      {/* ══════════════════════════ Tab 1 ═════════════════════ */}
      {tab === "berekenen" && (
        <div className="p-6">
          <SectionLabel>Handmatig berekenen</SectionLabel>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="CO₂ uitstoot (g/km)" hint="WLTP-waarde op kentekenbewijs">
              <input type="number" min={0} max={500} value={co2} onChange={(e) => { setCo2(e.target.value); setCalcResult(null); }} placeholder="bijv. 120" className={inputCls} />
            </Field>
            <Field label="Brandstof">
              <BrandstofToggle value={brandstof} onChange={(v) => { setBrand(v); setCalcResult(null); }} />
            </Field>
            <Field label="Datum eerste toelating">
              <input type="date" value={datum} onChange={(e) => { setDatum(e.target.value); setCalcResult(null); }} className={inputCls} />
            </Field>
            <Field label="Vraagprijs (incl. BTW)">
              <EuroInput value={vraagprijs} onChange={(v) => { setVraag(v); setCalcResult(null); }} placeholder="bijv. 25000" />
            </Field>
          </div>
          <button onClick={bereken} disabled={!datum || calcLoading} className="mt-5 w-full py-4 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-bold text-sm uppercase tracking-widest rounded-lg transition-colors shadow-md shadow-primary/30">
            {calcLoading ? "Berekenen..." : "Bereken BPM"}
          </button>
          {calcResult && (
            <BpmResultBlock result={calcResult} calculatorHref={`/bpm-calculator?co2Wltp=${co2}&brandstof=${brandstof}&datumEersteToelating=${datum}`} />
          )}
          <p className="mt-4 text-[10px] text-gray-400 text-center">Indicatieve berekening · Definitieve BPM via Belastingdienst</p>
        </div>
      )}

      {/* ══════════════════════════ Tab 2 ═════════════════════ */}
      {tab === "link" && (
        <div className="p-6">
          <SectionLabel>BPM via advertentielink</SectionLabel>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { label: "AutoScout24", ok: true,  note: "Automatisch" },
              { label: "mobile.de",   ok: true,  note: "Handmatig aanvullen" },
              { label: "Overige URL", ok: false, note: "Handmatig invullen" },
            ].map((s) => (
              <span key={s.label} className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${s.ok ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
                {s.ok ? "✓" : "○"} {s.label}
                <span className="font-normal opacity-70"> — {s.note}</span>
              </span>
            ))}
          </div>

          {/* URL input */}
          <form onSubmit={handleParseUrl} className="flex gap-2 mb-0">
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setParsed(null); setShowManual(false); setLinkResult(null); setParseError(null); }}
              placeholder="https://www.mobile.de/auto/... of autoscout24.com/..."
              required
              className={`${inputCls} flex-1 min-w-0`}
            />
            <button
              type="submit"
              disabled={parseLoading}
              className="shrink-0 px-5 py-2.5 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-bold text-sm rounded-lg transition-colors flex items-center gap-2"
            >
              {parseLoading ? (
                <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Ophalen...</>
              ) : "Ophalen →"}
            </button>
          </form>

          {/* Live indicator: mobile.de geplakt → toon direct melding */}
          {siteInfo?.site === "mobile.de" && !parsed && (
            <div className="mt-3 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="text-xs font-bold text-amber-800">mobile.de blokkeert automatisch uitlezen</p>
                <p className="text-[11px] text-amber-700 mt-0.5">Klik op &ldquo;Ophalen →&rdquo; om het formulier te openen. Kopieer de 3 waarden van de advertentie en bereken direct uw BPM.</p>
              </div>
            </div>
          )}

          {/* Fout */}
          {parseError && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{parseError}</div>
          )}

          {/* ── Handmatig aanvullen formulier ── */}
          {showManual && (
            <div className="mt-4 space-y-4">

              {/* Link terug naar advertentie */}
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 bg-navy/5 border border-navy/15 rounded-lg hover:bg-navy/10 transition-colors group"
                >
                  <div>
                    <div className="text-xs font-bold text-navy">Open advertentie</div>
                    <div className="text-[11px] text-gray-400">Kopieer CO₂, brandstof en datum van de advertentie</div>
                  </div>
                  <svg className="w-4 h-4 text-navy/40 group-hover:text-navy transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}

              {/* Auto-parsed data weergave (alleen als AutoScout24 iets vond) */}
              {parsed && parsed.parseConfidence !== "low" && parsed.title && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                  <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <span className="text-xs font-bold text-green-800">{parsed.title}</span>
                </div>
              )}

              {/* Instructie-kaartjes voor mobile.de */}
              {siteInfo?.site === "mobile.de" && (
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { field: "CO₂ (g/km)", where: "Tab Technische gegevens → Emissie" },
                    { field: "Brandstof",  where: "Boven in de advertentie" },
                    { field: "Datum td",   where: "Kentekenbewijs of advertentie" },
                  ].map((hint) => (
                    <div key={hint.field} className="bg-gray-50 rounded-lg px-2 py-2.5 border border-gray-100">
                      <div className="text-[10px] font-black text-navy">{hint.field}</div>
                      <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">{hint.where}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Invoervelden */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="CO₂ (g/km) — WLTP">
                  <input type="number" min={0} max={500} value={editCo2} onChange={(e) => { setEditCo2(e.target.value); setLinkResult(null); }} placeholder="bijv. 120" className={inputCls} />
                </Field>
                <Field label="Brandstof">
                  <BrandstofToggle value={editBrand} onChange={(v) => { setEditBrand(v); setLinkResult(null); }} />
                </Field>
                <Field label="Datum eerste toelating">
                  <input type="date" value={editDatum} onChange={(e) => { setEditDatum(e.target.value); setLinkResult(null); }} className={inputCls} />
                </Field>
                <Field label="Vraagprijs (incl. BTW)">
                  <EuroInput value={editPrijs} onChange={(v) => { setEditPrijs(v); setLinkResult(null); }} placeholder="bijv. 45000" />
                </Field>
              </div>

              <button
                onClick={berekenViaLink}
                disabled={!editDatum}
                className="w-full py-4 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white font-bold text-sm uppercase tracking-widest rounded-lg transition-colors shadow-md shadow-primary/30"
              >
                Bereken BPM
              </button>

              {linkResult && (
                <BpmResultBlock result={linkResult} calculatorHref={buildCalculatorUrl()} />
              )}

              <p className="text-[10px] text-gray-400 text-center">Indicatieve berekening · Definitieve BPM via Belastingdienst</p>
            </div>
          )}

          {/* Lege staat */}
          {!showManual && !parseError && !parseLoading && !siteInfo && (
            <p className="text-xs text-gray-400 text-center py-6">
              Plak een link van mobile.de of AutoScout24 om te beginnen.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════ Sub-components ════════════════════════════ */

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-navy placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-4 border-l-4 border-primary pl-3">
      {children}
    </p>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function BrandstofToggle({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-1.5">
      {[{ val: "benzine", label: "Benzine" }, { val: "phev", label: "PHEV" }, { val: "diesel", label: "Diesel" }].map(({ val, label }) => (
        <button key={val} type="button" onClick={() => onChange(val)}
          className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold border transition-all ${value === val ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
          {label}
        </button>
      ))}
    </div>
  );
}

function EuroInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
      <input type="number" min={0} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls} pl-8`} />
    </div>
  );
}

function BpmResultBlock({ result, calculatorHref }: { result: NonNullable<ReturnType<typeof calcBpm>>; calculatorHref: string }) {
  return (
    <div className="mt-5 pt-5 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Verschuldigde BPM</span>
        <span className="text-[10px] text-gray-300">indicatie</span>
      </div>
      <div className="text-3xl font-black text-navy tracking-tight mb-4">{formatEuro(result.totaalBpm)}</div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Bruto BPM</div>
          <div className="text-base font-black text-navy">{formatEuro(result.brutoBpm)}</div>
        </div>
        <div className="bg-gray-50 rounded-lg px-4 py-3">
          <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Afschrijving</div>
          <div className="text-base font-black text-navy">{result.afschrijvingsPercentage}%</div>
        </div>
      </div>
      <Link href={calculatorHref} className="block w-full text-center py-3 bg-navy hover:bg-primary text-white font-bold text-sm rounded-lg transition-colors">
        Volledige berekening + PDF rapport →
      </Link>
    </div>
  );
}
