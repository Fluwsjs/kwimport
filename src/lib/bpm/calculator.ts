import { differenceInMonths } from "date-fns";
import type {
  BpmInput,
  BpmResultaat,
  BpmScenario,
  TariefSchijf,
  BrandstofTarief,
  TariefVergelijkingRegel,
  Meetmethode,
} from "./types";
import {
  getTableForYear,
  FORFAITAIRE_TABEL,
  getAvailableYears,
  AVAILABLE_TABLES,
} from "./tableRegistry";

/** Voertuigtypes waarvoor een personenauto-berekening beschikbaar is. */
const ONDERSTEUNDE_TYPES = ["personenauto"] as const;

/** Grens waarop NEDC→WLTP overgang plaatsvond (1 juli 2020). */
const NEDC_GRENS = new Date("2020-07-01");

/** Kilometerstand onder deze grens → voertuig geldt als nieuw. */
const KM_NIEUW_GRENS = 3000;

/** Bereken bruto BPM op basis van CO2 en tariefschijven. Pure function. */
function calcBrutoBpm(
  co2: number,
  brandstofTarief: BrandstofTarief
): { bedrag: number; schijfBerekening: string } {
  if (brandstofTarief.vrijstelling) {
    return { bedrag: 0, schijfBerekening: "Vrijstelling (€0)" };
  }

  if (
    typeof brandstofTarief.vastBedrag === "number" &&
    brandstofTarief.brackets.length === 0
  ) {
    return {
      bedrag: brandstofTarief.vastBedrag,
      schijfBerekening: `Vast tarief: €${brandstofTarief.vastBedrag}`,
    };
  }

  const brackets = brandstofTarief.brackets;
  if (!brackets || brackets.length === 0) {
    return { bedrag: 0, schijfBerekening: "Geen tarief (€0)" };
  }

  const schijf = brackets.find(
    (b: TariefSchijf) => co2 >= b.co2Van && co2 < b.co2Tot
  );

  if (!schijf) {
    return { bedrag: 0, schijfBerekening: "Geen passende tariefschijf gevonden" };
  }

  const overdrempel = co2 - schijf.co2Van;
  const bedrag = schijf.vastBedrag + overdrempel * schijf.variabelPer;
  const schijfBerekening = `€${schijf.vastBedrag} + (${co2} − ${schijf.co2Van}) × €${schijf.variabelPer} = €${Math.round(bedrag)}`;

  return { bedrag: Math.round(bedrag), schijfBerekening };
}

/** Bepaal brandstof-tarief uit de tabel. */
function getBrandstofTarief(
  brandstof: string,
  table: ReturnType<typeof getTableForYear>,
  jaar: number,
  waarschuwingen: string[]
): BrandstofTarief {
  switch (brandstof) {
    case "benzine":
      return table.benzine;
    case "diesel":
      return table.diesel;
    case "elektrisch":
      return table.elektrisch;
    case "phev":
      if (jaar >= 2025 && table.phev.gelijkAanBrandstof === "benzine") {
        return table.benzine;
      }
      return table.phev;
    case "waterstof":
      waarschuwingen.push(
        "Waterstof: vrijstelling aangenomen (gelijk aan elektrisch). Controleer actuele regelgeving."
      );
      return table.elektrisch;
    default:
      waarschuwingen.push(
        `Onbekende brandstof '${brandstof}'. Benzine tarief als fallback.`
      );
      return table.benzine;
  }
}

/** Forfaitair afschrijvingspercentage op basis van leeftijd in maanden. */
export function getForfaitairPercentage(maanden: number): number {
  const rij = FORFAITAIRE_TABEL.table.find(
    (r) => maanden >= r.maandenVanaf && maanden < r.maandenTot
  );
  return rij ? rij.percentage : 95;
}

/** Leeftijd in volledige maanden tussen twee datums. */
export function berekenLeeftijdMaanden(
  datumEersteToelating: Date,
  referentieDatum: Date
): number {
  return Math.max(0, differenceInMonths(referentieDatum, datumEersteToelating));
}

/**
 * Bereken bruto BPM + dieseltoeslag voor één specifiek tariefjaartabel.
 * Gebruikt intern voor tariefvergelijking.
 */
function calcBrutoBpmVoorJaar(
  co2: number,
  brandstof: string,
  jaar: number
): { brutoBpm: number; dieselToeslag: number | undefined } {
  const table = getTableForYear(jaar);
  const brandstofTarief = getBrandstofTarief(brandstof, table, jaar, []);
  const { bedrag: base } = calcBrutoBpm(co2, brandstofTarief);

  let dieselToeslag: number | undefined;
  if (brandstof === "diesel" && brandstofTarief.dieselSurcharge?.enabled) {
    const s = brandstofTarief.dieselSurcharge;
    const co2OverDrempel = Math.max(0, co2 - s.drempel);
    dieselToeslag = Math.round(co2OverDrempel * s.bedragPerGram);
  }

  return { brutoBpm: base + (dieselToeslag ?? 0), dieselToeslag };
}

/** Volledige BPM berekening voor personenauto. Returns BpmResultaat. */
export function berekenBpm(input: BpmInput): BpmResultaat {
  // ── 0. VoertuigType gating ──
  if (!(ONDERSTEUNDE_TYPES as readonly string[]).includes(input.voertuigType)) {
    throw new Error(
      `VoertuigType '${input.voertuigType}' wordt nog niet ondersteund door de BPM-engine. ` +
      `Ondersteunde types: ${ONDERSTEUNDE_TYPES.join(", ")}. ` +
      `Bestelauto, motor en camper zijn in ontwikkeling.`
    );
  }

  const aannames: string[] = [];
  const waarschuwingen: string[] = [];

  // ── 1. Kilometerstand → nieuw/gebruikt override ──
  let effectiefStatus = input.status;
  let statusOverridden = false;

  if (
    typeof input.kilometerstand === "number" &&
    input.kilometerstand > 0 &&
    input.kilometerstand < KM_NIEUW_GRENS &&
    input.status === "gebruikt"
  ) {
    effectiefStatus = "nieuw";
    statusOverridden = true;
    waarschuwingen.push(
      `Kilometerstand ${input.kilometerstand.toLocaleString("nl-NL")} km is onder ${KM_NIEUW_GRENS.toLocaleString("nl-NL")} km. ` +
      `Voertuig wordt conform Belastingdienst als nieuw beschouwd.`
    );
  }

  // ── 2. CO₂-meetmethode bepalen ──
  const isPreNedc = input.datumEersteToelating < NEDC_GRENS;
  const meetmethode: Meetmethode = input.meetmethode ?? (isPreNedc ? "nedc" : "wltp");

  // Kies de juiste CO₂-waarde
  let co2: number;
  if (meetmethode === "nedc" && typeof input.co2Nedc === "number") {
    co2 = input.co2Nedc;
    aannames.push(
      `NEDC-meetmethode gebruikt: CO₂ = ${co2} g/km. ` +
      `Auto heeft datum eerste toelating vóór 1 juli 2020.`
    );
  } else {
    co2 = input.co2Wltp;
    if (meetmethode === "nedc") {
      // NEDC gewenst maar geen NEDC-waarde opgegeven → gebruik WLTP met waarschuwing
      waarschuwingen.push(
        "Auto is van vóór 1 juli 2020. Geadviseerd wordt de NEDC-CO₂-waarde te gebruiken " +
        "voor de meest nauwkeurige berekening. Nu is de WLTP-waarde gebruikt."
      );
    }
  }

  // NEDC-informatiemelding voor pre-2020 auto's
  if (isPreNedc) {
    waarschuwingen.push(
      "Let op: voor auto's met datum eerste toelating vóór 1 juli 2020 mag u kiezen tussen " +
      "het huidige tarief (WLTP) of het historische tarief dat gold 2 maanden vóór de eerste toelating (NEDC). " +
      "Controleer welke methode gunstiger is via de Belastingdienst."
    );
  }

  // ── 3. Tariefberekening ──
  const referentieDatum = input.datumRegistratieNL ?? new Date();
  const tariefjaar = input.tariefjaar ?? referentieDatum.getFullYear();
  const table = getTableForYear(tariefjaar);

  const availableYears = getAvailableYears();
  if (!availableYears.includes(tariefjaar)) {
    waarschuwingen.push(
      `Geen exacte tarieftabel voor ${tariefjaar}. Dichtstbijzijnde beschikbare jaar gebruikt.`
    );
  }

  const brandstofTarief = getBrandstofTarief(input.brandstof, table, tariefjaar, waarschuwingen);
  const { bedrag: brutoBpmBase, schijfBerekening } = calcBrutoBpm(co2, brandstofTarief);

  // Dieseltoeslag
  let dieselToeslag: number | undefined;
  if (input.brandstof === "diesel" && brandstofTarief.dieselSurcharge?.enabled) {
    const surcharge = brandstofTarief.dieselSurcharge;
    const co2OverDrempel = Math.max(0, co2 - surcharge.drempel);
    dieselToeslag = Math.round(co2OverDrempel * surcharge.bedragPerGram);
    aannames.push(
      `Dieseltoeslag ${tariefjaar}: (${co2} − ${surcharge.drempel}) × €${surcharge.bedragPerGram}/g = €${dieselToeslag}`
    );
  }

  const brutoBpm = brutoBpmBase + (dieselToeslag ?? 0);

  // ── 4. Afschrijving ──
  let afschrijvingsPercentage = 0;
  const maanden = effectiefStatus === "gebruikt"
    ? berekenLeeftijdMaanden(input.datumEersteToelating, referentieDatum)
    : 0;

  if (effectiefStatus === "nieuw") {
    aannames.push("Nieuw voertuig: geen afschrijving (0%).");
  } else {
    const methode = input.afschrijvingsMethode ?? "forfaitair";

    if (methode === "forfaitair") {
      afschrijvingsPercentage = getForfaitairPercentage(maanden);
      aannames.push(
        `Forfaitaire methode: voertuig is ${maanden} maanden oud → ${afschrijvingsPercentage}% afschrijving.`
      );
    } else if (methode === "koerslijst") {
      if (typeof input.consumentenprijs === "number" && typeof input.inkoopwaarde === "number" && input.consumentenprijs > 0) {
        const diff = input.consumentenprijs - input.inkoopwaarde;
        afschrijvingsPercentage = (diff / input.consumentenprijs) * 100;
        aannames.push(
          `Koerslijst: (€${input.consumentenprijs} − €${input.inkoopwaarde}) / €${input.consumentenprijs} × 100 = ${afschrijvingsPercentage.toFixed(1)}%`
        );
      } else {
        waarschuwingen.push("Koerslijst: gegevens ontbreken. Forfaitaire methode als fallback.");
        afschrijvingsPercentage = getForfaitairPercentage(maanden);
      }
    } else if (methode === "taxatierapport") {
      if (typeof input.taxatiewaarde === "number" && typeof input.consumentenprijs === "number" && input.consumentenprijs > 0) {
        const diff = input.consumentenprijs - input.taxatiewaarde;
        afschrijvingsPercentage = (diff / input.consumentenprijs) * 100;
        aannames.push(
          `Taxatierapport: (€${input.consumentenprijs} − €${input.taxatiewaarde}) / €${input.consumentenprijs} × 100 = ${afschrijvingsPercentage.toFixed(1)}%`
        );
      } else {
        waarschuwingen.push("Taxatierapport: gegevens ontbreken. Forfaitaire methode als fallback.");
        afschrijvingsPercentage = getForfaitairPercentage(maanden);
      }
    }

    afschrijvingsPercentage = Math.min(95, Math.max(0, afschrijvingsPercentage));
  }

  const restBpm = Math.round(brutoBpm * (1 - afschrijvingsPercentage / 100));

  // ── 5. Tariefvergelijking voor gebruikte auto's ──
  let tariefVergelijking: TariefVergelijkingRegel[] | undefined;

  if (effectiefStatus === "gebruikt" && !input.tariefjaar) {
    const vergelijking: TariefVergelijkingRegel[] = Object.keys(AVAILABLE_TABLES)
      .map(Number)
      .sort()
      .map((jaar) => {
        const { brutoBpm: bBpm } = calcBrutoBpmVoorJaar(co2, input.brandstof, jaar);
        const totaal = Math.round(bBpm * (1 - afschrijvingsPercentage / 100));
        return { jaar, brutoBpm: bBpm, totaalBpm: totaal, gebruikt: jaar === tariefjaar };
      });

    tariefVergelijking = vergelijking;

    // Check of een ander jaar gunstiger is
    const huidig = vergelijking.find((v) => v.jaar === tariefjaar);
    const laagste = vergelijking.reduce((min, v) => v.totaalBpm < min.totaalBpm ? v : min);

    if (huidig && laagste.jaar !== tariefjaar && laagste.totaalBpm < restBpm) {
      waarschuwingen.push(
        `Tarief ${laagste.jaar} (€${laagste.totaalBpm.toLocaleString("nl-NL")}) is gunstiger dan ` +
        `het huidige tarief ${tariefjaar} (€${restBpm.toLocaleString("nl-NL")}). ` +
        `Overweeg een eerder tariefjaar te kiezen via de geavanceerde opties.`
      );
    }
  }

  // ── 6. Extra waarschuwingen ──
  if (input.brandstof === "phev" && tariefjaar >= 2025) {
    waarschuwingen.push(
      "PHEV heeft vanaf 1 januari 2025 geen apart BPM-tarief meer. Het benzine-tarief wordt gehanteerd."
    );
  }
  if (input.brandstof === "elektrisch" && tariefjaar >= 2025) {
    waarschuwingen.push(
      "Elektrische voertuigen zijn vanaf 2025 niet meer volledig BPM-vrij. Er geldt een beperkt vast tarief."
    );
  }

  aannames.push(
    "Indicatieve berekening. De definitieve BPM volgt uit de officiële aangifte bij de Belastingdienst."
  );

  return {
    brutoBpm,
    afschrijvingsPercentage: Math.round(afschrijvingsPercentage * 10) / 10,
    restBpm,
    dieselToeslag,
    totaalBpm: restBpm,
    methode: effectiefStatus === "nieuw" ? "nieuw" : (input.afschrijvingsMethode ?? "forfaitair"),
    tariefjaar,
    tariefVergelijking,
    aannames,
    waarschuwingen,
    details: {
      co2,
      co2Methode: meetmethode,
      brandstof: input.brandstof,
      leeftijdMaanden: effectiefStatus === "gebruikt" ? maanden : undefined,
      schijfBerekening,
      kilometerstand: input.kilometerstand,
      statusOverridden,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Scenario optimizer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bereken BPM voor één specifieke combinatie van tariefjaar + CO₂-methode.
 * Interne helper voor de optimizer — gooit geen errors maar retourneert null
 * als de combinatie ongeldig is.
 */
function evalScenario(
  input: BpmInput,
  tariefjaar: number,
  meetmethode: Meetmethode,
  afschrijvingsPercentage: number
): BpmScenario | null {
  // CO₂-waarde kiezen op basis van meetmethode
  let co2Waarde: number;
  if (meetmethode === "nedc") {
    if (typeof input.co2Nedc !== "number") return null; // NEDC-waarde ontbreekt
    co2Waarde = input.co2Nedc;
  } else {
    co2Waarde = input.co2Wltp;
  }

  const { brutoBpm, dieselToeslag } = calcBrutoBpmVoorJaar(co2Waarde, input.brandstof, tariefjaar);
  const restBpm = Math.round(brutoBpm * (1 - afschrijvingsPercentage / 100));

  const reden =
    meetmethode === "nedc"
      ? `NEDC CO₂=${co2Waarde} g/km, tarief ${tariefjaar}`
      : `WLTP CO₂=${co2Waarde} g/km, tarief ${tariefjaar}`;

  return {
    tariefjaar,
    co2Methode: meetmethode,
    co2Waarde,
    brutoBpm,
    dieselToeslag: dieselToeslag ?? undefined,
    restBpm,
    geselecteerd: false,
    reden,
  };
}

/**
 * Berekent BPM optimaal door alle geldige scenario's door te rekenen en het
 * scenario met de laagste rest-BPM te selecteren.
 *
 * Geldige scenario's per type auto:
 * - Nieuw voertuig: alleen het tariefjaar van de registratiedatum (geen keuze).
 * - Gebruikt voertuig zonder expliciet tariefjaar:
 *     • Elk beschikbaar tariefjaartabel dat ≤ registratiejaar is.
 *     • WLTP altijd beschikbaar.
 *     • NEDC beschikbaar als DET < 1 juli 2020 én co2Nedc is opgegeven.
 *
 * Het resultaat is identiek aan berekenBpm() maar bevat tevens `scenarios` voor
 * volledige transparantie over de gemaakte keuze.
 *
 * @throws Error als voertuigtype niet ondersteund wordt (zelfde als berekenBpm).
 */
export function berekenBpmOptimaal(input: BpmInput): BpmResultaat {
  // ── 0. VoertuigType gating (delegeer naar berekenBpm voor de eigenlijke berekening) ──
  if (!(ONDERSTEUNDE_TYPES as readonly string[]).includes(input.voertuigType)) {
    throw new Error(
      `VoertuigType '${input.voertuigType}' wordt nog niet ondersteund door de BPM-engine. ` +
      `Ondersteunde types: ${ONDERSTEUNDE_TYPES.join(", ")}.`
    );
  }

  const referentieDatum = input.datumRegistratieNL ?? new Date();
  const registratieJaar = referentieDatum.getFullYear();

  // Nieuw voertuig of handmatig tariefjaar → geen optimalisatie nodig
  const effectiefStatus =
    typeof input.kilometerstand === "number" &&
    input.kilometerstand > 0 &&
    input.kilometerstand < KM_NIEUW_GRENS &&
    input.status === "gebruikt"
      ? "nieuw"
      : input.status;

  if (effectiefStatus === "nieuw" || input.tariefjaar) {
    // Geen scenario-optimalisatie mogelijk; gewone berekening
    return berekenBpm(input);
  }

  // ── Bereken afschrijvingspercentage eenmalig (onafhankelijk van tariefjaar) ──
  const maanden = berekenLeeftijdMaanden(input.datumEersteToelating, referentieDatum);
  let afschrijvingsPercentage = 0;
  const methode = input.afschrijvingsMethode ?? "forfaitair";

  if (methode === "forfaitair") {
    afschrijvingsPercentage = getForfaitairPercentage(maanden);
  } else if (
    methode === "koerslijst" &&
    typeof input.consumentenprijs === "number" &&
    typeof input.inkoopwaarde === "number" &&
    input.consumentenprijs > 0
  ) {
    afschrijvingsPercentage = ((input.consumentenprijs - input.inkoopwaarde) / input.consumentenprijs) * 100;
  } else if (
    methode === "taxatierapport" &&
    typeof input.taxatiewaarde === "number" &&
    typeof input.consumentenprijs === "number" &&
    input.consumentenprijs > 0
  ) {
    afschrijvingsPercentage = ((input.consumentenprijs - input.taxatiewaarde) / input.consumentenprijs) * 100;
  } else {
    // Fallback naar forfaitair
    afschrijvingsPercentage = getForfaitairPercentage(maanden);
  }
  afschrijvingsPercentage = Math.min(95, Math.max(0, afschrijvingsPercentage));

  // ── Bouw alle geldige scenario's ──
  const isPreNedc = input.datumEersteToelating < NEDC_GRENS;
  const geldigeJaren = getAvailableYears().filter((j) => j <= registratieJaar);

  const scenarios: BpmScenario[] = [];

  for (const jaar of geldigeJaren) {
    // WLTP-scenario altijd proberen
    const wltpScenario = evalScenario(input, jaar, "wltp", afschrijvingsPercentage);
    if (wltpScenario) scenarios.push(wltpScenario);

    // NEDC-scenario alleen voor pre-1-juli-2020 auto's met NEDC-waarde
    if (isPreNedc && typeof input.co2Nedc === "number") {
      const nedcScenario = evalScenario(input, jaar, "nedc", afschrijvingsPercentage);
      if (nedcScenario) scenarios.push(nedcScenario);
    }
  }

  if (scenarios.length === 0) {
    // Geen scenario's gebouwd (geen tabellen ≤ registratiejaar); val terug op gewone berekening
    return berekenBpm(input);
  }

  // ── Selecteer laagste rest-BPM ──
  const beste = scenarios.reduce((min, s) => (s.restBpm < min.restBpm ? s : min));
  beste.geselecteerd = true;

  // ── Voer de definitieve berekening uit met het geselecteerde scenario ──
  const optimaalInput: BpmInput = {
    ...input,
    tariefjaar: beste.tariefjaar,
    meetmethode: beste.co2Methode,
  };
  const resultaat = berekenBpm(optimaalInput);

  // Voeg scenario-toelichting toe
  const andereScenarios = scenarios.filter((s) => !s.geselecteerd);
  const hoeveel = andereScenarios.length;
  resultaat.aannames.unshift(
    `Optimaal scenario automatisch gekozen: tarief ${beste.tariefjaar}, ` +
    `${beste.co2Methode.toUpperCase()} CO₂=${beste.co2Waarde} g/km → ` +
    `rest-BPM €${beste.restBpm.toLocaleString("nl-NL")}. ` +
    `(${hoeveel} alternatief${hoeveel !== 1 ? "en" : ""} geëvalueerd)`
  );

  return { ...resultaat, scenarios };
}
