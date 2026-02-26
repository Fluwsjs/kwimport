import type { PassengerCarTable, ForfaitaireTabel } from "./types";

import tables2024 from "./tables/passengerCars_2024.json";
import tables2025 from "./tables/passengerCars_2025.json";
import tables2026 from "./tables/passengerCars_2026.json";
import forfaitaireData from "./tables/depreciation_forfaitaire.json";

export const AVAILABLE_TABLES: Record<number, PassengerCarTable> = {
  2024: tables2024 as PassengerCarTable,
  2025: tables2025 as PassengerCarTable,
  2026: tables2026 as PassengerCarTable,
};

export const FORFAITAIRE_TABEL: ForfaitaireTabel = forfaitaireData as ForfaitaireTabel;

export function getTariefJaar(datumRegistratie: Date): number {
  return datumRegistratie.getFullYear();
}

export function getTableForYear(year: number): PassengerCarTable {
  if (AVAILABLE_TABLES[year]) return AVAILABLE_TABLES[year];

  const years = Object.keys(AVAILABLE_TABLES).map(Number).sort();
  const latest = years[years.length - 1];
  const earliest = years[0];

  if (year > latest) return AVAILABLE_TABLES[latest];
  if (year < earliest) return AVAILABLE_TABLES[earliest];

  const closest = years.reduce((prev, curr) =>
    Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev
  );
  return AVAILABLE_TABLES[closest];
}

export function getAvailableYears(): number[] {
  return Object.keys(AVAILABLE_TABLES).map(Number).sort();
}
