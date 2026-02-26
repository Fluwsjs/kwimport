"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import type { WizardData } from "./BpmWizard";

const schema = z.object({
  afschrijvingsMethode: z.enum(["forfaitair", "koerslijst", "taxatierapport"]).default("forfaitair"),
  consumentenprijs: z.coerce.number().optional(),
  inkoopwaarde: z.coerce.number().optional(),
  taxatiewaarde: z.coerce.number().optional(),
  tariefjaar: z.coerce.number().optional(),
  email: z.string().email("Ongeldig e-mailadres").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const METHODES: {
  value: FormData["afschrijvingsMethode"];
  label: string;
  sublabel: string;
  icon: "bar-chart" | "trending-up" | "search";
  extra?: string;
}[] = [
  {
    value: "forfaitair",
    label: "Forfaitaire tabel",
    sublabel: "Standaard methode",
    icon: "bar-chart",
    extra: "Gebaseerd op leeftijd in maanden (wettelijke tabel art. 10 lid 7 Wet BPM)",
  },
  {
    value: "koerslijst",
    label: "Koerslijst",
    sublabel: "Marktwaarde methode",
    icon: "trending-up",
    extra: "Op basis van XRAY, Eurotaxglass o.i.d. — kan gunstiger zijn bij sterk afgeschreven auto's",
  },
  {
    value: "taxatierapport",
    label: "Taxatierapport",
    sublabel: "Professionele taxatie",
    icon: "search",
    extra: "Vereist een officieel rapport van een erkend taxateur — meest nauwkeurig",
  },
];

const TARIEFJAAR_OPTIONS = [
  { value: "", label: "Automatisch (aanbevolen)" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
];

interface StepCProps {
  data: WizardData;
  onNext: (update: Partial<WizardData>) => void;
  onBack: () => void;
  loading?: boolean;
}

export function StepC({ data, onNext, onBack, loading }: StepCProps) {
  const isGebruikt = data.status === "gebruikt";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      afschrijvingsMethode: (data.afschrijvingsMethode as FormData["afschrijvingsMethode"]) ?? "forfaitair",
      consumentenprijs: data.consumentenprijs,
      inkoopwaarde: data.inkoopwaarde,
      taxatiewaarde: data.taxatiewaarde,
      tariefjaar: data.tariefjaar,
      email: "",
    },
  });

  const methode = watch("afschrijvingsMethode");

  function onSubmit(values: FormData) {
    onNext({ ...values, email: values.email || undefined });
  }

  return (
    <div className="card-lg space-y-7">
      <div>
        <h2 className="text-xl font-black text-navy tracking-tight mb-1">Stap 3 — Afschrijving & tarief</h2>
        <p className="text-sm text-gray-500">
          {isGebruikt
            ? "Kies de methode waarmee de afschrijving wordt berekend."
            : "Nieuw voertuig — geen afschrijving. Controleer het tariefjaar."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

        {/* Methode keuze */}
        {isGebruikt && (
          <div>
            <label className="label mb-3">Afschrijvingsmethode</label>
            <div className="space-y-2.5">
              {METHODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setValue("afschrijvingsMethode", m.value)}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all",
                    methode === m.value
                      ? "border-primary bg-primary/5"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                    methode === m.value ? "bg-primary" : "bg-gray-100"
                  )}>
                    <Icon
                      name={m.icon}
                      size={16}
                      className={methode === m.value ? "text-white" : "text-gray-400"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn(
                        "font-bold text-sm",
                        methode === m.value ? "text-primary" : "text-navy"
                      )}>
                        {m.label}
                      </span>
                      <span className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        methode === m.value
                          ? "bg-primary/15 text-primary"
                          : "bg-gray-100 text-gray-500"
                      )}>
                        {m.sublabel}
                      </span>
                    </div>
                    {methode === m.value && m.extra && (
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{m.extra}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <input type="hidden" {...register("afschrijvingsMethode")} />
          </div>
        )}

        {/* Extra velden per methode */}
        {isGebruikt && methode === "koerslijst" && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Koerslijst gegevens</p>
              <p className="text-xs text-gray-400">
                Afschrijving = (consumentenprijs − inkoopwaarde) / consumentenprijs × 100%
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label text-xs">Consumentenprijs <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                  <input type="number" min={0} placeholder="bijv. 30000" className="input-field pl-8 text-sm" {...register("consumentenprijs")} />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Nieuwprijs</p>
              </div>
              <div>
                <label className="label text-xs">Inkoopwaarde <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                  <input type="number" min={0} placeholder="bijv. 15000" className="input-field pl-8 text-sm" {...register("inkoopwaarde")} />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Uit koerslijst</p>
              </div>
            </div>
          </div>
        )}

        {isGebruikt && methode === "taxatierapport" && (
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Taxatierapport gegevens</p>
              <p className="text-xs text-gray-400">
                Vereist een officieel rapport van een erkend taxateur.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label text-xs">Consumentenprijs <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                  <input type="number" min={0} placeholder="bijv. 30000" className="input-field pl-8 text-sm" {...register("consumentenprijs")} />
                </div>
              </div>
              <div>
                <label className="label text-xs">Taxatiewaarde <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€</span>
                  <input type="number" min={0} placeholder="bijv. 18000" className="input-field pl-8 text-sm" {...register("taxatiewaarde")} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tariefjaar */}
        <div>
          <label className="label">
            Tariefjaar
            <span className="text-gray-400 text-xs font-normal ml-2">optioneel</span>
          </label>
          <select className="input-field" {...register("tariefjaar")}>
            {TARIEFJAAR_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <p className="text-[11px] text-gray-400 mt-1.5">
            Standaard wordt het jaar van registratie in Nederland gebruikt.
          </p>
        </div>

        {/* E-mail */}
        <div>
          <label className="label">
            E-mailadres
            <span className="text-gray-400 text-xs font-normal ml-2">optioneel</span>
          </label>
          <input
            type="email"
            placeholder="uw@emailadres.nl"
            className={cn("input-field", errors.email && "input-error")}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          <p className="text-[11px] text-gray-400 mt-1.5">
            Ontvang een bevestiging van de berekening per e-mail.
          </p>
        </div>

        {/* Navigatie */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack} className="btn-outline flex-1 justify-center" disabled={loading}>
            <Icon name="chevron-right" size={16} className="rotate-180" />
            Terug
          </button>
          <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Berekenen...
              </>
            ) : (
              <>
                <Icon name="calculator" size={16} />
                Bereken BPM
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
