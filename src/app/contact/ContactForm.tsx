"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField, SelectField } from "@/components/ui/FormField";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const schema = z.object({
  naam: z.string().min(2, "Naam moet minimaal 2 tekens zijn"),
  email: z.string().email("Voer een geldig e-mailadres in"),
  telefoon: z.string().max(20).optional(),
  onderwerp: z.string().min(1, "Kies een onderwerp"),
  bericht: z.string().min(10, "Bericht moet minimaal 10 tekens zijn").max(2000),
});

type FormData = z.infer<typeof schema>;

const ONDERWERP_OPTIONS = [
  { value: "BPM aangifte", label: "BPM aangifte" },
  { value: "Import compleet", label: "Volledige import begeleiding" },
  { value: "Aankoop advies", label: "Aankoop advies" },
  { value: "Vraag calculator", label: "Vraag over de calculator" },
  { value: "Overig", label: "Overig" },
];

function ContactFormInner() {
  const searchParams = useSearchParams();
  const pakket = searchParams.get("pakket");
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const defaultOnderwerp = pakket === "compleet"
    ? "Import compleet"
    : pakket === "basis"
    ? "BPM aangifte"
    : pakket === "advies"
    ? "Aankoop advies"
    : "";

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { onderwerp: defaultOnderwerp },
  });

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          naam: data.naam,
          email: data.email,
          telefoon: data.telefoon,
          bericht: `Onderwerp: ${data.onderwerp}\n\n${data.bericht}`,
          bron: "CONTACT",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Verzenden mislukt");

      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Er is iets misgegaan");
    }
  }

  if (submitted) {
    return (
      <div className="card-lg text-center py-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-navy mb-2">Bericht verzonden!</h2>
        <p className="text-navy/60 text-sm">
          Bedankt voor uw bericht. Wij nemen zo snel mogelijk contact met u op,
          doorgaans binnen één werkdag.
        </p>
      </div>
    );
  }

  return (
    <div className="card-lg">
      <h2 className="text-lg font-semibold text-navy mb-5">Stuur ons een bericht</h2>

      {serverError && (
        <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Naam" required error={errors.naam?.message}>
            <input
              type="text"
              placeholder="Uw volledige naam"
              className={`input-field ${errors.naam ? "input-error" : ""}`}
              {...register("naam")}
            />
          </FormField>

          <FormField label="E-mail" required error={errors.email?.message}>
            <input
              type="email"
              placeholder="uw@email.nl"
              className={`input-field ${errors.email ? "input-error" : ""}`}
              {...register("email")}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Telefoonnummer" error={errors.telefoon?.message} hint="Optioneel – voor sneller contact">
            <input
              type="tel"
              placeholder="+31 6 ..."
              className="input-field"
              {...register("telefoon")}
            />
          </FormField>

          <FormField label="Onderwerp" required error={errors.onderwerp?.message}>
            <SelectField
              options={ONDERWERP_OPTIONS}
              placeholder="Kies een onderwerp"
              error={!!errors.onderwerp}
              {...register("onderwerp")}
            />
          </FormField>
        </div>

        <FormField label="Bericht" required error={errors.bericht?.message}>
          <textarea
            rows={5}
            placeholder="Beschrijf uw situatie zo concreet mogelijk. Bijv.: 'Ik wil een 2021 BMW 3-serie importeren vanuit Duitsland...'"
            className={`input-field resize-none ${errors.bericht ? "input-error" : ""}`}
            {...register("bericht")}
          />
        </FormField>

        <div className="text-xs text-navy/40">
          Door dit formulier te versturen gaat u akkoord met de verwerking van uw gegevens
          voor het beantwoorden van uw vraag.
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full justify-center"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verzenden...
            </span>
          ) : (
            "Verstuur bericht →"
          )}
        </button>
      </form>
    </div>
  );
}

export function ContactForm() {
  return (
    <Suspense fallback={<div className="card-lg animate-pulse h-64" />}>
      <ContactFormInner />
    </Suspense>
  );
}
