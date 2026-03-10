/**
 * BPM Calculator — uitgebreide unit tests
 *
 * Bevat:
 * 1. Bestaande basis-tests (behouden voor regressie)
 * 2. Schijfgrens exact-op-grenswaarde tests
 * 3. Dieseltoeslag randgevallen (drempel=0 vs drempel=69)
 * 4. Golden fixtures (8 referentiecases)
 * 5. berekenBpmOptimaal scenario-selectie
 * 6. VoertuigType gating
 *
 * Draaien:  npx vitest run src/lib/bpm/calculator.test.ts
 * Watch:    npx vitest src/lib/bpm/calculator.test.ts
 */
import { describe, it, expect } from "vitest";
import {
  berekenBpm,
  berekenBpmOptimaal,
  getForfaitairPercentage,
  berekenLeeftijdMaanden,
} from "./calculator";
import type { BpmInput } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Bouw een minimaal geldig BpmInput object (personenauto benzine nieuw 2025). */
function makeInput(overrides: Partial<BpmInput> = {}): BpmInput {
  return {
    voertuigType: "personenauto",
    brandstof: "benzine",
    co2Wltp: 120,
    datumEersteToelating: new Date("2025-01-01"),
    datumRegistratieNL: new Date("2025-06-01"),
    catalogusprijs: 35000,
    status: "nieuw",
    tariefjaar: 2025,
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Hulpfuncties
// ─────────────────────────────────────────────────────────────────────────────

describe("berekenLeeftijdMaanden", () => {
  it("berekent correcte maanden", () => {
    expect(berekenLeeftijdMaanden(new Date("2022-01-01"), new Date("2024-01-01"))).toBe(24);
  });
  it("geeft 0 terug als datums gelijk zijn", () => {
    const d = new Date("2023-06-01");
    expect(berekenLeeftijdMaanden(d, d)).toBe(0);
  });
  it("knipt negatieve waarden af op 0", () => {
    expect(berekenLeeftijdMaanden(new Date("2025-01-01"), new Date("2024-01-01"))).toBe(0);
  });
});

describe("getForfaitairPercentage", () => {
  it("0 maanden → 0%", () => expect(getForfaitairPercentage(0)).toBe(0));
  it("1 maand → 3%", () => expect(getForfaitairPercentage(1)).toBe(3));
  it("6 maanden → 16%", () => expect(getForfaitairPercentage(6)).toBe(16));
  it("11 maanden → 26%", () => expect(getForfaitairPercentage(11)).toBe(26));
  it("12 maanden → 28%", () => expect(getForfaitairPercentage(12)).toBe(28));
  it("24 maanden → 44%", () => expect(getForfaitairPercentage(24)).toBe(44));
  it("60 maanden → 70%", () => expect(getForfaitairPercentage(60)).toBe(70));
  it("216+ maanden → 95%", () => expect(getForfaitairPercentage(220)).toBe(95));
  it("exact 216 maanden → 95%", () => expect(getForfaitairPercentage(216)).toBe(95));
  it("215 maanden → 94%", () => expect(getForfaitairPercentage(215)).toBe(94));
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Schijfgrens exact-op-grenswaarden (benzine 2025)
// Schijven: [0-79 @ €0/g], [79-106 @ €195/g], [106-155 @ €5265 + €432/g], [155-9999 @ €26433 + €811/g]
// ─────────────────────────────────────────────────────────────────────────────

describe("schijfgrenzen benzine 2025", () => {
  it("CO₂=0 → €0 (onder drempel)", () => {
    expect(berekenBpm(makeInput({ co2Wltp: 0 })).brutoBpm).toBe(0);
  });
  it("CO₂=78 → €0 (nog in schijf 1)", () => {
    expect(berekenBpm(makeInput({ co2Wltp: 78 })).brutoBpm).toBe(0);
  });
  it("CO₂=79 → €0 (eerste gram schijf 2, geen overdrempel)", () => {
    // 79 valt in schijf [79-106]: (79-79)*195 = 0
    expect(berekenBpm(makeInput({ co2Wltp: 79 })).brutoBpm).toBe(0);
  });
  it("CO₂=80 → €195 (één gram in schijf 2)", () => {
    expect(berekenBpm(makeInput({ co2Wltp: 80 })).brutoBpm).toBe(195);
  });
  it("CO₂=105 → €5070 (laatste gram schijf 2)", () => {
    // (105-79)*195 = 26*195 = 5070
    expect(berekenBpm(makeInput({ co2Wltp: 105 })).brutoBpm).toBe(5070);
  });
  it("CO₂=106 → €5265 (eerste gram schijf 3, naadloos overgang)", () => {
    // schijf 3: 5265 + (106-106)*432 = 5265
    expect(berekenBpm(makeInput({ co2Wltp: 106 })).brutoBpm).toBe(5265);
  });
  it("CO₂=154 → €26001 (laatste gram schijf 3)", () => {
    // 5265 + (154-106)*432 = 5265 + 48*432 = 5265 + 20736 = 26001
    expect(berekenBpm(makeInput({ co2Wltp: 154 })).brutoBpm).toBe(26001);
  });
  it("CO₂=155 → €26433 (eerste gram schijf 4, naadloos overgang)", () => {
    // schijf 4: 26433 + (155-155)*811 = 26433
    expect(berekenBpm(makeInput({ co2Wltp: 155 })).brutoBpm).toBe(26433);
  });
  it("CO₂=156 → €27244 (twee gram in schijf 4)", () => {
    // 26433 + 1*811 = 27244
    expect(berekenBpm(makeInput({ co2Wltp: 156 })).brutoBpm).toBe(27244);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Dieseltoeslag randgevallen
// ─────────────────────────────────────────────────────────────────────────────

describe("dieseltoeslag 2025 (drempel=0)", () => {
  const base = makeInput({ brandstof: "diesel", tariefjaar: 2025 });

  it("CO₂=1 → dieseltoeslag = 1 * €100,57 = €101", () => {
    const r = berekenBpm({ ...base, co2Wltp: 1 });
    expect(r.dieselToeslag).toBe(Math.round(1 * 100.57)); // 101
  });

  it("CO₂=110 → bruto = schijf + toeslag", () => {
    const r = berekenBpm({ ...base, co2Wltp: 110 });
    // Diesel schijven 2025: 100-145: 6240 + (110-100)*432 = 6240+4320 = 10560
    // Toeslag: 110 * 100.57 = 11062.7 → 11063
    expect(r.dieselToeslag).toBe(Math.round(110 * 100.57));
    expect(r.brutoBpm).toBe(10560 + Math.round(110 * 100.57));
  });
});

describe("dieseltoeslag 2026 (drempel=69 g/km)", () => {
  const base = makeInput({ brandstof: "diesel", tariefjaar: 2026 });

  it("CO₂=68 → geen dieseltoeslag (onder drempel)", () => {
    const r = berekenBpm({ ...base, co2Wltp: 68 });
    expect(r.dieselToeslag).toBe(0);
  });
  it("CO₂=69 → dieseltoeslag = 0 (exact op drempel, 0 gram over)", () => {
    const r = berekenBpm({ ...base, co2Wltp: 69 });
    expect(r.dieselToeslag).toBe(0); // (69-69)*114.83 = 0
  });
  it("CO₂=70 → dieseltoeslag = €115 (1 gram boven drempel)", () => {
    const r = berekenBpm({ ...base, co2Wltp: 70 });
    expect(r.dieselToeslag).toBe(Math.round(1 * 114.83)); // 115
  });
  it("CO₂=120 → dieseltoeslag = (120-69)*114,83", () => {
    const r = berekenBpm({ ...base, co2Wltp: 120 });
    expect(r.dieselToeslag).toBe(Math.round((120 - 69) * 114.83)); // 51*114.83 = 5856
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Golden fixtures — 8 referentiecases
// Elke case bevat exact berekende verwachte waarden inclusief tussenresultaten.
// ─────────────────────────────────────────────────────────────────────────────

describe("golden fixtures", () => {
  /**
   * Fixture 1: Personenauto benzine nieuw 2025, 120 g/km
   * Schijf [106-155]: 5265 + (120-106)*432 = 5265 + 6048 = 11313
   */
  it("GF-01: benzine nieuw 2025, 120 g/km → bruto €11.313", () => {
    const r = berekenBpm(makeInput({ co2Wltp: 120 }));
    expect(r.brutoBpm).toBe(11313);
    expect(r.restBpm).toBe(11313);
    expect(r.afschrijvingsPercentage).toBe(0);
    expect(r.dieselToeslag).toBeUndefined();
    expect(r.tariefjaar).toBe(2025);
  });

  /**
   * Fixture 2: Personenauto diesel nieuw 2025, 110 g/km
   * Diesel-schijf [100-145]: 6240 + (110-100)*432 = 6240 + 4320 = 10560
   * Dieseltoeslag: 110 * €100,57 = €11.063
   * Bruto = 10560 + 11063 = 21623
   */
  it("GF-02: diesel nieuw 2025, 110 g/km → bruto €21.623", () => {
    const r = berekenBpm(makeInput({ brandstof: "diesel", co2Wltp: 110, tariefjaar: 2025 }));
    const toeslag = Math.round(110 * 100.57);
    expect(r.dieselToeslag).toBe(toeslag);
    expect(r.brutoBpm).toBe(10560 + toeslag);
    expect(r.restBpm).toBe(10560 + toeslag); // nieuw, geen afschrijving
  });

  /**
   * Fixture 3: Benzine gebruikt 60 maanden (2019-01 → 2024-01), 130 g/km, tarief 2024
   * Benzine schijf 2024 [106-155]: 4779 + (130-106)*393 = 4779 + 9432 = 14211
   * Forfaitair 60 mnd = 70% → rest = 14211 * 0.30 = 4263
   */
  it("GF-03: benzine gebruikt 60 mnd forfaitair 2024, 130 g/km → rest €4.263", () => {
    const r = berekenBpm(makeInput({
      brandstof: "benzine",
      co2Wltp: 130,
      datumEersteToelating: new Date("2019-01-01"),
      datumRegistratieNL: new Date("2024-01-01"),
      status: "gebruikt",
      afschrijvingsMethode: "forfaitair",
      tariefjaar: 2024,
    }));
    expect(r.brutoBpm).toBe(14211);
    expect(r.afschrijvingsPercentage).toBe(70);
    expect(r.restBpm).toBe(Math.round(14211 * 0.30)); // 4263
  });

  /**
   * Fixture 4: Elektrisch 2024 → vrijstelling (€0)
   */
  it("GF-04: elektrisch 2024 → €0 (vrijstelling)", () => {
    const r = berekenBpm(makeInput({ brandstof: "elektrisch", co2Wltp: 0, tariefjaar: 2024 }));
    expect(r.brutoBpm).toBe(0);
    expect(r.restBpm).toBe(0);
  });

  /**
   * Fixture 5: Elektrisch 2025 → vast tarief €636
   */
  it("GF-05: elektrisch 2025 → vast tarief €636", () => {
    const r = berekenBpm(makeInput({ brandstof: "elektrisch", co2Wltp: 0, tariefjaar: 2025 }));
    expect(r.brutoBpm).toBe(636);
    expect(r.restBpm).toBe(636);
    // "Elektrische voertuigen zijn vanaf 2025 niet meer volledig BPM-vrij."
    expect(r.waarschuwingen.some((w) => w.toLowerCase().includes("elektrisch"))).toBe(true);
  });

  /**
   * Fixture 6: PHEV 2025, 25 g/km
   * Benzine-schijf [0-79]: 0 + (25-0)*0 = 0 (variabelPer=0 in schijf 1)
   * Bruto = 0, PHEV-waarschuwing aanwezig
   */
  it("GF-06: PHEV 2025, 25 g/km → €0 + waarschuwing", () => {
    const r = berekenBpm(makeInput({ brandstof: "phev", co2Wltp: 25, tariefjaar: 2025 }));
    expect(r.brutoBpm).toBe(0);
    expect(r.waarschuwingen.some((w) => w.includes("PHEV"))).toBe(true);
  });

  /**
   * Fixture 7: Diesel nieuw 2026, 120 g/km
   * Diesel-schijf 2026 [100-139]: 2727 + (120-100)*181 = 2727 + 3620 = 6347
   * Dieseltoeslag 2026 (drempel=69): (120-69)*114,83 = 51*114,83 = €5.856
   * Bruto = 6347 + 5856 = 12203
   */
  it("GF-07: diesel nieuw 2026, 120 g/km → bruto €12.203", () => {
    const r = berekenBpm(makeInput({ brandstof: "diesel", co2Wltp: 120, tariefjaar: 2026 }));
    const toeslag = Math.round((120 - 69) * 114.83);
    expect(r.dieselToeslag).toBe(toeslag); // 5856
    expect(r.brutoBpm).toBe(6347 + toeslag); // 12203
  });

  /**
   * Fixture 8: Benzine gebruikt koerslijst 50%, 2024, 100 g/km
   * Schijf [79-106]: (100-79)*177 = 21*177 = 3717
   * Koerslijst: (30000-15000)/30000 = 50% → rest = 3717*0.50 = 1858.5 → 1859
   */
  it("GF-08: benzine koerslijst 50% afschrijving 2024, 100 g/km → rest €1.859", () => {
    const r = berekenBpm(makeInput({
      brandstof: "benzine",
      co2Wltp: 100,
      datumEersteToelating: new Date("2020-01-01"),
      datumRegistratieNL: new Date("2024-01-01"),
      status: "gebruikt",
      afschrijvingsMethode: "koerslijst",
      consumentenprijs: 30000,
      inkoopwaarde: 15000,
      tariefjaar: 2024,
    }));
    expect(r.brutoBpm).toBe(3717);
    expect(r.afschrijvingsPercentage).toBeCloseTo(50, 1);
    expect(r.restBpm).toBe(Math.round(3717 * 0.5)); // 1859
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Bestaande tests (regressie)
// ─────────────────────────────────────────────────────────────────────────────

describe("berekenBpm – nieuw voertuig 2025 (regressie)", () => {
  it("120 g/km benzine → bruto €11.313", () => {
    const r = berekenBpm(makeInput());
    expect(r.brutoBpm).toBe(11313);
    expect(r.restBpm).toBe(11313);
    expect(r.afschrijvingsPercentage).toBe(0);
  });
  it("elektrisch 2024 → €0", () => {
    const r = berekenBpm(makeInput({ brandstof: "elektrisch", co2Wltp: 0, tariefjaar: 2024 }));
    expect(r.brutoBpm).toBe(0);
    expect(r.restBpm).toBe(0);
  });
});

describe("berekenBpm – gebruikt voertuig forfaitair (regressie)", () => {
  it("60 maanden → 70% afschrijving", () => {
    const r = berekenBpm(makeInput({
      co2Wltp: 130,
      datumEersteToelating: new Date("2019-01-01"),
      datumRegistratieNL: new Date("2024-01-01"),
      status: "gebruikt",
      afschrijvingsMethode: "forfaitair",
      tariefjaar: 2024,
    }));
    expect(r.afschrijvingsPercentage).toBe(70);
    expect(r.restBpm).toBe(Math.round(r.brutoBpm * 0.3));
  });
});

describe("berekenBpm – diesel met toeslag 2025 (regressie)", () => {
  it("dieseltoeslag aanwezig en > 0", () => {
    const r = berekenBpm(makeInput({ brandstof: "diesel", co2Wltp: 110, tariefjaar: 2025 }));
    expect(r.dieselToeslag).toBeDefined();
    expect(r.dieselToeslag!).toBeGreaterThan(0);
  });
});

describe("berekenBpm – koerslijst methode (regressie)", () => {
  it("50% afschrijving via koerslijst", () => {
    const r = berekenBpm(makeInput({
      co2Wltp: 100,
      datumEersteToelating: new Date("2020-01-01"),
      datumRegistratieNL: new Date("2024-01-01"),
      status: "gebruikt",
      afschrijvingsMethode: "koerslijst",
      consumentenprijs: 30000,
      inkoopwaarde: 15000,
      tariefjaar: 2024,
    }));
    expect(r.afschrijvingsPercentage).toBeCloseTo(50, 1);
  });
});

describe("berekenBpm – PHEV 2025 waarschuwing (regressie)", () => {
  it("PHEV >= 2025 geeft waarschuwing", () => {
    const r = berekenBpm(makeInput({ brandstof: "phev", co2Wltp: 25, tariefjaar: 2025 }));
    expect(r.waarschuwingen.some((w) => w.includes("PHEV"))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. berekenBpmOptimaal — scenario-selectie
// ─────────────────────────────────────────────────────────────────────────────

describe("berekenBpmOptimaal", () => {
  /**
   * BELANGRIJK: makeInput() zet standaard tariefjaar: 2025. Voor de optimizer
   * moet tariefjaar: undefined zijn zodat de optimizer-logica actief wordt.
   */
  const optimaalBase = (overrides: Partial<BpmInput> = {}): BpmInput =>
    makeInput({ tariefjaar: undefined, ...overrides });

  it("retourneert scenarios array voor gebruikte auto", () => {
    const r = berekenBpmOptimaal(optimaalBase({
      co2Wltp: 130,
      datumEersteToelating: new Date("2019-01-01"),
      datumRegistratieNL: new Date("2025-06-01"),
      status: "gebruikt",
      afschrijvingsMethode: "forfaitair",
    }));
    expect(r.scenarios).toBeDefined();
    expect(r.scenarios!.length).toBeGreaterThan(0);
  });

  it("precies één scenario heeft geselecteerd=true", () => {
    const r = berekenBpmOptimaal(optimaalBase({
      co2Wltp: 130,
      datumEersteToelating: new Date("2021-01-01"),
      datumRegistratieNL: new Date("2025-06-01"),
      status: "gebruikt",
      afschrijvingsMethode: "forfaitair",
    }));
    const geselecteerd = r.scenarios!.filter((s) => s.geselecteerd);
    expect(geselecteerd).toHaveLength(1);
  });

  it("geselecteerd scenario heeft de laagste restBpm", () => {
    const r = berekenBpmOptimaal(optimaalBase({
      co2Wltp: 130,
      datumEersteToelating: new Date("2021-01-01"),
      datumRegistratieNL: new Date("2025-06-01"),
      status: "gebruikt",
      afschrijvingsMethode: "forfaitair",
    }));
    const beste = r.scenarios!.find((s) => s.geselecteerd)!;
    const minRestBpm = Math.min(...r.scenarios!.map((s) => s.restBpm));
    expect(beste.restBpm).toBe(minRestBpm);
  });

  it("gekozen scenario komt overeen met r.restBpm", () => {
    const r = berekenBpmOptimaal(optimaalBase({
      co2Wltp: 130,
      datumEersteToelating: new Date("2021-01-01"),
      datumRegistratieNL: new Date("2025-06-01"),
      status: "gebruikt",
      afschrijvingsMethode: "forfaitair",
    }));
    const beste = r.scenarios!.find((s) => s.geselecteerd)!;
    expect(r.restBpm).toBe(beste.restBpm);
  });

  it("voor nieuw voertuig geen scenarios (geen optimalisatie nodig)", () => {
    const r = berekenBpmOptimaal(makeInput({ status: "nieuw" }));
    // Nieuw voertuig: optimizer slaat over (tariefjaar=2025 + status=nieuw), geen scenarios array
    expect(r.scenarios).toBeUndefined();
  });

  it("geeft toelichting in aannames over optimaal gekozen scenario", () => {
    const r = berekenBpmOptimaal(optimaalBase({
      co2Wltp: 130,
      datumEersteToelating: new Date("2021-01-01"),
      datumRegistratieNL: new Date("2025-06-01"),
      status: "gebruikt",
      afschrijvingsMethode: "forfaitair",
    }));
    expect(r.aannames[0]).toMatch(/Optimaal scenario/i);
  });

  it("NEDC-scenario wordt meegenomen als co2Nedc opgegeven en DET < juli 2020", () => {
    const r = berekenBpmOptimaal(optimaalBase({
      co2Wltp: 140,
      co2Nedc: 130,
      datumEersteToelating: new Date("2019-06-01"),
      datumRegistratieNL: new Date("2025-01-01"),
      status: "gebruikt",
      afschrijvingsMethode: "forfaitair",
    }));
    const nedcScenarios = r.scenarios?.filter((s) => s.co2Methode === "nedc");
    expect(nedcScenarios?.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. VoertuigType gating
// ─────────────────────────────────────────────────────────────────────────────

describe("voertuigType gating", () => {
  it("gooit error voor bestelauto", () => {
    expect(() => berekenBpm(makeInput({ voertuigType: "bestelauto" }))).toThrow(
      /bestelauto/i
    );
  });
  it("gooit error voor motor", () => {
    expect(() => berekenBpm(makeInput({ voertuigType: "motor" }))).toThrow(/motor/i);
  });
  it("gooit error voor camper", () => {
    expect(() => berekenBpm(makeInput({ voertuigType: "camper" }))).toThrow(/camper/i);
  });
  it("berekenBpmOptimaal gooit ook error voor bestelauto", () => {
    expect(() => berekenBpmOptimaal(makeInput({ voertuigType: "bestelauto" }))).toThrow(
      /bestelauto/i
    );
  });
  it("personenauto werkt zonder errors", () => {
    expect(() => berekenBpm(makeInput())).not.toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. Edge cases
// ─────────────────────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("kilometerstand < 3000 km bij gebruikt → behandeld als nieuw", () => {
    const r = berekenBpm(makeInput({
      status: "gebruikt",
      kilometerstand: 2000,
      datumEersteToelating: new Date("2024-01-01"),
    }));
    expect(r.afschrijvingsPercentage).toBe(0);
    expect(r.details.statusOverridden).toBe(true);
    expect(r.waarschuwingen.some((w) => w.includes("3.000"))).toBe(true);
  });

  it("afschrijving wordt gecapped op 95%", () => {
    // Auto van meer dan 18 jaar oud → 95%
    const r = berekenBpm(makeInput({
      co2Wltp: 120,
      datumEersteToelating: new Date("2000-01-01"),
      datumRegistratieNL: new Date("2025-01-01"),
      status: "gebruikt",
      afschrijvingsMethode: "forfaitair",
      tariefjaar: 2025,
    }));
    expect(r.afschrijvingsPercentage).toBe(95);
    expect(r.restBpm).toBe(Math.round(r.brutoBpm * 0.05));
  });

  it("koerslijst zonder consumentenprijs valt terug op forfaitair + waarschuwing", () => {
    const r = berekenBpm(makeInput({
      co2Wltp: 100,
      datumEersteToelating: new Date("2022-01-01"),
      datumRegistratieNL: new Date("2025-01-01"),
      status: "gebruikt",
      afschrijvingsMethode: "koerslijst",
      // consumentenprijs en inkoopwaarde bewust weggelaten
      tariefjaar: 2025,
    }));
    expect(r.waarschuwingen.some((w) => w.includes("Koerslijst"))).toBe(true);
    // Fallback forfaitair: 36 maanden → 55%
    expect(r.afschrijvingsPercentage).toBe(55);
  });

  it("onbekende brandstof geeft benzine als fallback + waarschuwing", () => {
    const r = berekenBpm(makeInput({ brandstof: "waterstof" as never }));
    expect(r.waarschuwingen.some((w) => w.includes("aterstof"))).toBe(true);
  });
});
