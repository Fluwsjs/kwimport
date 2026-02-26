"use client";

import { Icon } from "@/components/ui/Icon";
import type { WizardData } from "./BpmWizard";
import { cn } from "@/lib/utils";

type VoertuigType = "personenauto" | "bestelauto" | "motor" | "camper";

const TYPES: {
  id: VoertuigType;
  label: string;
  icon: React.ReactNode;
  desc: string;
  available: boolean;
}[] = [
  {
    id: "personenauto",
    label: "Personenauto",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M5 17H3a2 2 0 0 1-2-2V9l3-5h12l3 5v6a2 2 0 0 1-2 2h-2" />
        <circle cx="7.5" cy="17.5" r="2.5" />
        <circle cx="16.5" cy="17.5" r="2.5" />
      </svg>
    ),
    desc: "Alle personenauto's incl. SUV en stationwagon",
    available: true,
  },
  {
    id: "bestelauto",
    label: "Bestelauto",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="M16 8h4l3 5v4h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    desc: "Lichte bedrijfswagens (N1 categorie)",
    available: false,
  },
  {
    id: "motor",
    label: "Motor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 6h2l2 5H5l2-5h2" /><path d="M9 6V4h6v2" />
        <path d="M9 11h6" />
      </svg>
    ),
    desc: "Motorfietsen en scooters",
    available: false,
  },
  {
    id: "camper",
    label: "Camper / overig",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="1" y="6" width="22" height="12" rx="1" />
        <path d="M16 6V4H8v2" /><circle cx="5.5" cy="18.5" r="2" /><circle cx="18.5" cy="18.5" r="2" />
        <line x1="12" x2="12" y1="6" y2="18" /><line x1="12" x2="22" y1="12" y2="12" />
      </svg>
    ),
    desc: "Campers en overige voertuigen",
    available: false,
  },
];

interface StepAProps {
  data: WizardData;
  onNext: (update: Partial<WizardData>) => void;
}

export function StepA({ data, onNext }: StepAProps) {
  const selected = data.voertuigType as VoertuigType | undefined;

  return (
    <div className="card-lg">
      <h2 className="text-xl font-bold text-navy mb-1.5">Stap 1 — Voertuigtype</h2>
      <p className="text-sm text-gray-500 mb-7">
        Selecteer het type voertuig dat u wilt importeren.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            disabled={!type.available}
            onClick={() => type.available && onNext({ voertuigType: type.id })}
            className={cn(
              "relative text-left p-5 rounded-xl border-2 transition-all duration-200",
              type.available
                ? selected === type.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-100 bg-white hover:border-primary/40 hover:shadow-sm cursor-pointer"
                : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "mb-4",
              selected === type.id ? "text-primary" : "text-gray-400"
            )}>
              {type.icon}
            </div>
            <div className="font-bold text-navy text-sm">{type.label}</div>
            <div className="text-xs text-gray-500 mt-1">{type.desc}</div>

            {!type.available && (
              <span className="absolute top-3 right-3 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                Binnenkort
              </span>
            )}
            {type.available && selected === type.id && (
              <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Icon name="check" size={11} className="text-white" strokeWidth={3} />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-sm text-blue-700">
        <Icon name="info" size={16} className="shrink-0 mt-0.5 text-blue-500" />
        <span>
          <strong>MVP:</strong> Personenauto's worden nu volledig ondersteund.
          Andere voertuigtypes zijn in ontwikkeling.
        </span>
      </div>
    </div>
  );
}
