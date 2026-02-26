export interface ParsedCarData {
  merk?: string;
  model?: string;
  datumEersteToelating?: string;
  co2Wltp?: number;
  brandstof?: string;
  catalogusprijs?: number;
  kilometerstand?: number;
  vermogenKw?: number;
  bouwjaar?: number;
  title?: string;
  sourceUrl: string;
  sourceSite: string;
  parseConfidence: "high" | "medium" | "low";
  parseErrors: string[];
}

export interface SiteAdapter {
  name: string;
  domains: string[];
  parse(url: string): Promise<ParsedCarData>;
}
