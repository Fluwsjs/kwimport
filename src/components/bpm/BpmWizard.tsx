"use client";

import { useState } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StepA } from "./StepA";
import { StepB } from "./StepB";
import { StepC } from "./StepC";
import { StepD } from "./StepD";
import { Icon } from "@/components/ui/Icon";
import type { BpmInput, BpmResultaat } from "@/lib/bpm/types";

export type WizardData = Partial<Omit<BpmInput, "datumEersteToelating" | "datumRegistratieNL">> & {
  datumEersteToelating?: string;
  datumRegistratieNL?: string;
  email?: string;
  co2Nedc?: number;
  meetmethode?: "wltp" | "nedc";
  kilometerstand?: number;
};

const STEPS = [
  { label: "Voertuigtype", sublabel: "Personenauto, motor etc." },
  { label: "Voertuiggegevens", sublabel: "CO₂, brandstof, datum" },
  { label: "Afschrijving", sublabel: "Methode & tarief" },
  { label: "Resultaat", sublabel: "BPM bedrag & rapport" },
];

interface BpmWizardProps {
  initialData?: WizardData;
}

export function BpmWizard({ initialData = {} }: BpmWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [resultaat, setResultaat] = useState<BpmResultaat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateData(update: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...update }));
  }

  async function handleSubmit(finalData: WizardData) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bpm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...finalData,
          voertuigType: finalData.voertuigType ?? "personenauto",
          co2Wltp: Number(finalData.co2Wltp),
          co2Nedc: finalData.co2Nedc ? Number(finalData.co2Nedc) : undefined,
          meetmethode: finalData.meetmethode ?? "wltp",
          kilometerstand: finalData.kilometerstand ? Number(finalData.kilometerstand) : undefined,
          catalogusprijs: Number(finalData.catalogusprijs ?? 0),
          consumentenprijs: finalData.consumentenprijs ? Number(finalData.consumentenprijs) : undefined,
          inkoopwaarde: finalData.inkoopwaarde ? Number(finalData.inkoopwaarde) : undefined,
          taxatiewaarde: finalData.taxatiewaarde ? Number(finalData.taxatiewaarde) : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Berekening mislukt");

      setResultaat(json.resultaat);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is iets misgegaan");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep(1);
    setData({});
    setResultaat(null);
    setError(null);
  }

  const isDone = step === 4 && resultaat;

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-6">

      {/* ── Sidebar ── */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 bg-white border-2 border-gray-100 rounded-xl overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-100 px-5 py-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stappen</p>
          </div>
          <ul className="p-3">
            {STEPS.map((s, i) => {
              const stepNr = i + 1;
              const done = stepNr < step;
              const active = stepNr === step;

              return (
                <li key={s.label}>
                  <div className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg mb-0.5
                    ${active ? "bg-primary/10" : ""}
                  `}>
                    <div className={`
                      w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border-2 transition-all
                      ${done ? "bg-primary border-primary text-white"
                        : active ? "border-primary text-primary bg-white"
                        : "border-gray-200 text-gray-400 bg-white"}
                    `}>
                      {done ? <Icon name="check" size={12} className="text-white" /> : stepNr}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${active ? "text-primary" : done ? "text-navy" : "text-gray-400"}`}>
                        {s.label}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{s.sublabel}</div>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-px h-3 mx-5 ml-[22px] ${done ? "bg-primary" : "bg-gray-200"}`} />
                  )}
                </li>
              );
            })}
          </ul>

          {!isDone && (
            <div className="border-t border-gray-100 p-4">
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Alle berekeningen zijn indicatief. Definitieve BPM via aangifte Belastingdienst.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <div>
        {/* Mobile progress bar */}
        <div className="lg:hidden mb-5">
          <ProgressBar
            currentStep={step}
            totalSteps={4}
            labels={STEPS.map((s) => s.label)}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 bg-red-50 border-l-4 border-red-400 rounded-r-xl p-4 flex gap-3 text-sm text-red-700">
            <Icon name="alert-triangle" size={16} className="text-red-400 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Steps */}
        {step === 1 && (
          <StepA
            data={data}
            onNext={(update) => { updateData(update); setStep(2); }}
          />
        )}
        {step === 2 && (
          <StepB
            data={data}
            onNext={(update) => { updateData(update); setStep(3); }}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepC
            data={data}
            onNext={(update) => {
              const finalData = { ...data, ...update };
              updateData(update);
              handleSubmit(finalData);
            }}
            onBack={() => setStep(2)}
            loading={loading}
          />
        )}
        {step === 4 && resultaat && (
          <StepD input={data} resultaat={resultaat} onReset={reset} />
        )}
      </div>
    </div>
  );
}
