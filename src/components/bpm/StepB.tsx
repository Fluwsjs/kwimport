"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { WizardData } from "./BpmWizard";

const NEDC_GRENS = new Date("2020-07-01");

const schema = z.object({
  brandstof: z.enum(["benzine", "diesel", "elektrisch", "phev", "waterstof"]),
  co2Wltp: z.coerce.number().min(0, "Vul een geldige CO₂-waarde in").max(500),
  co2Nedc: z.coerce.number().min(0).max(500).optional(),
  meetmethode: z.enum(["wltp", "nedc"]).default("wltp"),
  datumEersteToelating: z.string().min(1, "Datum eerste toelating is verplicht"),
  datumRegistratieNL: z.string().optional(),
  catalogusprijs: z.coerce.number().min(0).optional(),
  kilometerstand: z.coerce.number().min(0).optional(),
  status: z.enum(["nieuw", "gebruikt"]),
});

type FormData = z.infer<typeof schema>;

const BRANDSTOF_OPTIONS: { value: FormData["brandstof"]; label: string; sublabel: string }[] = [
  { value: "benzine",    label: "Benzine",     sublabel: "Incl. mild-hybrid" },
  { value: "diesel",     label: "Diesel",      sublabel: "+ dieseltoeslag" },
  { value: "elektrisch", label: "Elektrisch",  sublabel: "Volledig elektrisch" },
  { value: "phev",       label: "PHEV",        sublabel: "Plug-in hybride" },
  { value: "waterstof",  label: "Waterstof",   sublabel: "H₂-brandstof" },
];

interface StepBProps {
  data: WizardData;
  onNext: (update: Partial<WizardData>) => void;
  onBack: () => void;
}

export function StepB({ data, onNext, onBack }: StepBProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      brandstof: (data.brandstof as FormData["brandstof"]) ?? "benzine",
      co2Wltp: data.co2Wltp ?? undefined,
      co2Nedc: data.co2Nedc ?? undefined,
      meetmethode: (data.meetmethode as FormData["meetmethode"]) ?? "wltp",
      datumEersteToelating: data.datumEersteToelating ?? "",
      datumRegistratieNL: data.datumRegistratieNL ?? "",
      catalogusprijs: data.catalogusprijs ?? undefined,
      kilometerstand: data.kilometerstand ?? undefined,
      status: (data.status as FormData["status"]) ?? "gebruikt",
    },
  });

  const brandstof = watch("brandstof");
  const status = watch("status");
  const meetmethode = watch("meetmethode");
  const datumStr = watch("datumEersteToelating");
  const isElektrisch = brandstof === "elektrisch";
  const isPhev = brandstof === "phev";

  // Is de auto van vóór 1 juli 2020? Dan kan NEDC relevant zijn.
  const isPreNedc = datumStr ? new Date(datumStr) < NEDC_GRENS : false;

  return (
    <div className="card-lg space-y-7">
      <div>
        <h2 className="text-xl font-black text-navy tracking-tight mb-1">Stap 2 — Voertuiggegevens</h2>
        <p className="text-sm text-gray-500">
          Voer de specificaties in van uw voertuig. U vindt deze in de advertentie of voertuigdocumenten.
        </p>
      </div>

      <form onSubmit={handleSubmit(onNext)} className="space-y-7">

        {/* ── Brandstof ── */}
        <div>
          <label className="label mb-3">
            Brandstoftype <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {BRANDSTOF_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("brandstof", opt.value, { shouldValidate: true })}
                className={cn(
                  "relative p-3 rounded-xl border-2 text-center transition-all",
                  brandstof === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-100 bg-white hover:border-gray-200"
                )}
              >
                <div className="text-xs font-bold text-navy">{opt.label}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{opt.sublabel}</div>
                {brandstof === opt.value && (
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="check" size={9} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
          <input type="hidden" {...register("brandstof")} />
        </div>

        {/* ── Datum eerste toelating ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">
              Datum eerste toelating <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              className={cn("input-field", errors.datumEersteToelating && "input-error")}
              {...register("datumEersteToelating")}
            />
            <p className="text-[11px] text-gray-400 mt-1.5">
              Datum van eerste inschrijving in Europa
            </p>
            {errors.datumEersteToelating && (
              <p className="text-xs text-red-500 mt-1">{errors.datumEersteToelating.message}</p>
            )}
          </div>

          <div>
            <label className="label">
              Datum registratie NL
              <span className="text-gray-400 text-xs font-normal ml-1.5">optioneel</span>
            </label>
            <input
              type="date"
              className="input-field"
              {...register("datumRegistratieNL")}
            />
            <p className="text-[11px] text-gray-400 mt-1.5">
              Bepaalt het toepasselijke tariefjaar
            </p>
          </div>
        </div>

        {/* ── NEDC / WLTP selector voor pre-2020 auto's ── */}
        {isPreNedc && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-4">
            <div className="flex gap-3">
              <Icon name="info" size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  Auto van vóór 1 juli 2020 — kies uw CO₂-meetmethode
                </p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Voor auto's van vóór 1 juli 2020 mag u de BPM berekenen met de NEDC-waarde
                  (op het kentekenbewijs) of de WLTP-waarde. Kies de methode die voor u
                  het meest gunstig uitpakt.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["wltp", "nedc"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setValue("meetmethode", m)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-center transition-all",
                    meetmethode === m
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  )}
                >
                  <div className={cn("text-sm font-bold uppercase", meetmethode === m ? "text-blue-700" : "text-navy")}>
                    {m.toUpperCase()}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {m === "wltp" ? "Nieuwere meting" : "Oudere meting (pre-2020)"}
                  </div>
                </button>
              ))}
            </div>
            <input type="hidden" {...register("meetmethode")} />
          </div>
        )}

        {/* ── CO2 velden ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">
              {isPreNedc && meetmethode === "nedc" ? "CO₂ WLTP (backup)" : "CO₂-uitstoot WLTP"}
              <span className="text-gray-400 text-xs font-normal ml-1.5">g/km</span>
              {!isPreNedc || meetmethode === "wltp" ? <span className="text-red-400 ml-1">*</span> : null}
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={500}
                placeholder={isElektrisch ? "0" : "bijv. 120"}
                className={cn("input-field pr-16", errors.co2Wltp && "input-error")}
                {...register("co2Wltp")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                g/km
              </span>
            </div>
            {errors.co2Wltp && <p className="text-xs text-red-500 mt-1">{errors.co2Wltp.message}</p>}
            <p className="text-[11px] text-gray-400 mt-1.5">
              {isElektrisch ? "Vul 0 in voor volledig elektrisch" : "WLTP-waarde van kentekenbewijs deel 1B"}
            </p>
          </div>

          {/* NEDC-veld alleen tonen als auto pre-2020 is EN NEDC gekozen */}
          {isPreNedc && meetmethode === "nedc" && (
            <div>
              <label className="label">
                CO₂-uitstoot NEDC
                <span className="text-gray-400 text-xs font-normal ml-1.5">g/km</span>
                <span className="text-red-400 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={500}
                  placeholder="bijv. 105"
                  className={cn("input-field pr-16", errors.co2Nedc && "input-error")}
                  {...register("co2Nedc")}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                  g/km
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                NEDC-waarde van kentekenbewijs of CvO
              </p>
            </div>
          )}
        </div>

        {/* ── Catalogusprijs + Kilometerstand ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label">
              Catalogusprijs
              <span className="text-gray-400 text-xs font-normal ml-1.5">optioneel</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
              <input
                type="number"
                min={0}
                placeholder="bijv. 35000"
                className="input-field pl-8"
                {...register("catalogusprijs")}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">
              Netto-catalogusprijs excl. BPM, incl. BTW
            </p>
          </div>

          <div>
            <label className="label">
              Kilometerstand
              <span className="text-gray-400 text-xs font-normal ml-1.5">optioneel</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                placeholder="bijv. 45000"
                className="input-field pr-10"
                {...register("kilometerstand")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                km
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">
              Onder 3.000 km → geldt als nieuw voertuig
            </p>
          </div>
        </div>

        {/* ── Nieuw / Gebruikt ── */}
        <div>
          <label className="label mb-3">
            Voertuigstatus <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["nieuw", "gebruikt"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setValue("status", s, { shouldValidate: true })}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all",
                  status === s ? "border-primary bg-primary/5" : "border-gray-100 bg-white hover:border-gray-200"
                )}
              >
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                  status === s ? "bg-primary" : "bg-gray-100"
                )}>
                  <Icon
                    name={s === "nieuw" ? "zap" : "car"}
                    size={16}
                    className={status === s ? "text-white" : "text-gray-400"}
                  />
                </div>
                <div>
                  <div className={cn("text-sm font-bold", status === s ? "text-primary" : "text-navy")}>
                    {s === "nieuw" ? "Nieuw voertuig" : "Gebruikt voertuig"}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {s === "nieuw" ? "0% afschrijving" : "Afschrijving van toepassing"}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <input type="hidden" {...register("status")} />
        </div>

        {/* Contextmeldingen */}
        {isPhev && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-sm text-amber-800">
            <Icon name="alert-triangle" size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <span>
              <strong>PHEV:</strong> Vanaf 1 januari 2025 geldt het reguliere benzine-tarief voor PHEV.
              De calculator past dit automatisch toe.
            </span>
          </div>
        )}
        {isElektrisch && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-700">
            <Icon name="info" size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <span>
              <strong>Elektrisch:</strong> Tot en met 2024 volledig BPM-vrij.
              Vanaf 2025 geldt een beperkt vast tarief.
            </span>
          </div>
        )}

        {/* Navigatie */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack} className="btn-outline flex-1 justify-center">
            <Icon name="chevron-right" size={16} className="rotate-180" />
            Terug
          </button>
          <button type="submit" className="btn-primary flex-1 justify-center">
            Volgende
            <Icon name="chevron-right" size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
