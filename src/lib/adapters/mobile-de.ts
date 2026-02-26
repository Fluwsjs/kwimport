import type { SiteAdapter, ParsedCarData } from "./types";

/**
 * Adapter voor mobile.de advertentiepagina's.
 * Parseert HTML om voertuigdata te extraheren.
 */
export const mobileDe: SiteAdapter = {
  name: "mobile.de",
  domains: ["mobile.de"],

  async parse(url: string): Promise<ParsedCarData> {
    const errors: string[] = [];

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; KWImportBot/1.0; +https://kwautomotive.nl)",
        "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} bij ophalen mobile.de pagina`);
    }

    const html = await res.text();

    const data: ParsedCarData = {
      sourceUrl: url,
      sourceSite: "mobile.de",
      parseConfidence: "medium",
      parseErrors: errors,
    };

    // Title / merk+model uit <title>
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      data.title = titleMatch[1].replace(" | mobile.de", "").trim();
      const parts = data.title.split(" ");
      if (parts.length >= 2) {
        data.merk = parts[0];
        data.model = parts.slice(1, 3).join(" ");
      }
    }

    // CO2 uitstoot (g/km)
    const co2Match = html.match(/(\d+)\s*g\/km/i);
    if (co2Match) {
      data.co2Wltp = parseInt(co2Match[1], 10);
    } else {
      errors.push("CO₂-uitstoot niet gevonden. Vul handmatig in.");
    }

    // Brandstof
    const brandstofMatch = html.match(
      /(benzin|diesel|elektro|hybrid|plug-in)/i
    );
    if (brandstofMatch) {
      const raw = brandstofMatch[1].toLowerCase();
      if (raw.includes("benzin")) data.brandstof = "benzine";
      else if (raw.includes("diesel")) data.brandstof = "diesel";
      else if (raw.includes("elektro")) data.brandstof = "elektrisch";
      else if (raw.includes("plug-in") || raw.includes("hybrid"))
        data.brandstof = "phev";
    }

    // Eerste registratie (datum)
    const regMatch = html.match(
      /Erstzulassung[^<>]*?(\d{2})\/(\d{4})|(\d{2})\.(\d{4})/i
    );
    if (regMatch) {
      const month = regMatch[1] || regMatch[3];
      const year = regMatch[2] || regMatch[4];
      if (month && year) {
        data.datumEersteToelating = `${year}-${month}-01`;
        data.bouwjaar = parseInt(year, 10);
      }
    }

    // Prijs
    const prijsMatch = html.match(/(\d[\d.]+)\s*€|\€\s*(\d[\d.]+)/);
    if (prijsMatch) {
      const raw = (prijsMatch[1] || prijsMatch[2]).replace(/\./g, "");
      data.catalogusprijs = parseInt(raw, 10);
    }

    if (errors.length > 0) {
      data.parseConfidence = "low";
    } else if (!data.co2Wltp || !data.brandstof) {
      data.parseConfidence = "medium";
    } else {
      data.parseConfidence = "high";
    }

    return data;
  },
};
