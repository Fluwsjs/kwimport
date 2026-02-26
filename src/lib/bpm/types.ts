export type VoertuigType = "personenauto" | "bestelauto" | "motor" | "camper";
export type Brandstof = "benzine" | "diesel" | "elektrisch" | "phev" | "waterstof";
export type AfschrijvingsMethode = "forfaitair" | "koerslijst" | "taxatierapport";
export type VoertuigStatus = "nieuw" | "gebruikt";
export type Meetmethode = "wltp" | "nedc";

export interface BpmInput {
  voertuigType: VoertuigType;
  brandstof: Brandstof;

  /** CO₂-uitstoot in g/km (WLTP). Verplicht veld. */
  co2Wltp: number;

  /** CO₂-uitstoot in g/km (NEDC). Optioneel, alleen voor pre-1 juli 2020 auto's. */
  co2Nedc?: number;

  /** Welke meetmethode is gebruikt. Default: "wltp". */
  meetmethode?: Meetmethode;

  datumEersteToelating: Date;
  datumRegistratieNL?: Date;
  catalogusprijs: number;
  status: VoertuigStatus;

  /** Kilometerstand. Onder 3.000 km → auto wordt als nieuw beschouwd. */
  kilometerstand?: number;

  // Afschrijving (alleen bij gebruikt)
  afschrijvingsMethode?: AfschrijvingsMethode;

  // Koerslijst methode
  consumentenprijs?: number;
  inkoopwaarde?: number;

  // Taxatierapport methode
  taxatiewaarde?: number;

  // Optioneel: handmatig tariefjaar kiezen (anders automatisch bepaald)
  tariefjaar?: number;
}

export interface TariefVergelijkingRegel {
  jaar: number;
  brutoBpm: number;
  totaalBpm: number;
  gebruikt: boolean;
}

export interface BpmResultaat {
  brutoBpm: number;
  afschrijvingsPercentage: number;
  restBpm: number;
  dieselToeslag?: number;
  totaalBpm: number;
  methode: AfschrijvingsMethode | "nieuw";
  tariefjaar: number;

  /** Vergelijking van alle beschikbare tariefjaartabellen (gebruikt auto). */
  tariefVergelijking?: TariefVergelijkingRegel[];

  aannames: string[];
  waarschuwingen: string[];
  details: {
    co2: number;
    co2Methode: Meetmethode;
    brandstof: Brandstof;
    leeftijdMaanden?: number;
    schijfBerekening?: string;
    kilometerstand?: number;
    statusOverridden?: boolean;
  };
}

export interface TariefSchijf {
  co2Van: number;
  co2Tot: number;
  vastBedrag: number;
  variabelPer: number;
}

export interface DieselSurcharge {
  enabled: boolean;
  bedragPerGram: number;
  drempel: number;
}

export interface BrandstofTarief {
  brackets: TariefSchijf[];
  dieselSurcharge?: DieselSurcharge;
  vrijstelling?: boolean;
  vastBedrag?: number;
  gelijkAanBrandstof?: string;
}

export interface PassengerCarTable {
  _year: number;
  _validFrom: string;
  _validUntil: string;
  benzine: BrandstofTarief;
  diesel: BrandstofTarief;
  elektrisch: BrandstofTarief;
  phev: BrandstofTarief;
}

export interface ForfaitaireRij {
  maandenVanaf: number;
  maandenTot: number;
  percentage: number;
}

export interface ForfaitaireTabel {
  table: ForfaitaireRij[];
}
