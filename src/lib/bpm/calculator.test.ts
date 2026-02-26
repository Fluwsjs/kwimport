import { describe, it, expect } from "vitest";
import { berekenBpm, getForfaitairPercentage, berekenLeeftijdMaanden } from "./calculator";
import type { BpmInput } from "./types";

describe("berekenLeeftijdMaanden", () => {
  it("berekent correcte maanden", () => {
    const van = new Date("2022-01-01");
    const tot = new Date("2024-01-01");
    expect(berekenLeeftijdMaanden(van, tot)).toBe(24);
  });

  it("geeft 0 terug als data gelijk zijn", () => {
    const d = new Date("2023-06-01");
    expect(berekenLeeftijdMaanden(d, d)).toBe(0);
  });
});

describe("getForfaitairPercentage", () => {
  it("0 maanden → 0%", () => expect(getForfaitairPercentage(0)).toBe(0));
  it("6 maanden → 16%", () => expect(getForfaitairPercentage(6)).toBe(16));
  it("24 maanden → 44%", () => expect(getForfaitairPercentage(24)).toBe(44));
  it("60 maanden → 70%", () => expect(getForfaitairPercentage(60)).toBe(70));
  it("216+ maanden → 95%", () => expect(getForfaitairPercentage(220)).toBe(95));
});

describe("berekenBpm – nieuw voertuig 2025", () => {
  const baseInput: BpmInput = {
    voertuigType: "personenauto",
    brandstof: "benzine",
    co2Wltp: 120,
    datumEersteToelating: new Date("2025-01-01"),
    datumRegistratieNL: new Date("2025-03-01"),
    catalogusprijs: 35000,
    status: "nieuw",
    tariefjaar: 2025,
  };

  it("berekent bruto BPM voor 120 g/km benzine 2025", () => {
    const result = berekenBpm(baseInput);
    // schijf: 106-155: vastBedrag 5265 + (120-106)*432 = 5265 + 14*432 = 5265 + 6048 = 11313
    expect(result.brutoBpm).toBe(11313);
    expect(result.restBpm).toBe(11313);
    expect(result.afschrijvingsPercentage).toBe(0);
    expect(result.tariefjaar).toBe(2025);
  });

  it("geeft 0 BPM voor elektrisch voertuig < 2025", () => {
    const elResult = berekenBpm({
      ...baseInput,
      brandstof: "elektrisch",
      co2Wltp: 0,
      tariefjaar: 2024,
    });
    expect(elResult.brutoBpm).toBe(0);
    expect(elResult.restBpm).toBe(0);
  });
});

describe("berekenBpm – gebruikt voertuig forfaitair", () => {
  it("berekent rest-BPM na afschrijving 60 maanden", () => {
    const input: BpmInput = {
      voertuigType: "personenauto",
      brandstof: "benzine",
      co2Wltp: 130,
      datumEersteToelating: new Date("2019-01-01"),
      datumRegistratieNL: new Date("2024-01-01"),
      catalogusprijs: 30000,
      status: "gebruikt",
      afschrijvingsMethode: "forfaitair",
      tariefjaar: 2024,
    };
    const result = berekenBpm(input);
    expect(result.afschrijvingsPercentage).toBe(70); // 60 maanden = 70%
    expect(result.brutoBpm).toBeGreaterThan(0);
    expect(result.restBpm).toBe(Math.round(result.brutoBpm * 0.3));
  });
});

describe("berekenBpm – diesel met toeslag 2025", () => {
  it("includeert dieseltoeslag in brutoBpm", () => {
    const input: BpmInput = {
      voertuigType: "personenauto",
      brandstof: "diesel",
      co2Wltp: 110,
      datumEersteToelating: new Date("2025-01-01"),
      datumRegistratieNL: new Date("2025-06-01"),
      catalogusprijs: 40000,
      status: "nieuw",
      tariefjaar: 2025,
    };
    const result = berekenBpm(input);
    expect(result.dieselToeslag).toBeDefined();
    expect(result.dieselToeslag!).toBeGreaterThan(0);
    expect(result.brutoBpm).toBeGreaterThan(result.brutoBpm - result.dieselToeslag!);
  });
});

describe("berekenBpm – koerslijst methode", () => {
  it("berekent afschrijving via koerslijst", () => {
    const input: BpmInput = {
      voertuigType: "personenauto",
      brandstof: "benzine",
      co2Wltp: 100,
      datumEersteToelating: new Date("2020-01-01"),
      datumRegistratieNL: new Date("2024-01-01"),
      catalogusprijs: 30000,
      status: "gebruikt",
      afschrijvingsMethode: "koerslijst",
      consumentenprijs: 30000,
      inkoopwaarde: 15000,
      tariefjaar: 2024,
    };
    const result = berekenBpm(input);
    expect(result.afschrijvingsPercentage).toBeCloseTo(50, 1);
  });
});

describe("berekenBpm – PHEV 2025 waarschuwing", () => {
  it("geeft waarschuwing voor PHEV >= 2025", () => {
    const input: BpmInput = {
      voertuigType: "personenauto",
      brandstof: "phev",
      co2Wltp: 25,
      datumEersteToelating: new Date("2025-01-01"),
      datumRegistratieNL: new Date("2025-06-01"),
      catalogusprijs: 45000,
      status: "nieuw",
      tariefjaar: 2025,
    };
    const result = berekenBpm(input);
    expect(
      result.waarschuwingen.some((w) => w.includes("PHEV"))
    ).toBe(true);
  });
});
