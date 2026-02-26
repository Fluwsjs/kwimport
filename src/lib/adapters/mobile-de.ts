import type { SiteAdapter, ParsedCarData } from "./types";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "de-DE,de;q=0.9,nl;q=0.8,en;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

/** Haal listing-ID op uit diverse mobile.de URL-vormen */
function extractListingId(url: string): string | null {
  try {
    const u = new URL(url);
    // ?id=12345678
    if (u.searchParams.get("id")) return u.searchParams.get("id");
    // /auto/bmw-3er-...-12345678.html  (laatste getal in pad)
    const pathMatch = u.pathname.match(/[_-](\d{7,10})(?:\.html)?$/);
    if (pathMatch) return pathMatch[1];
    // /fahrzeuge/details.html?id=...  (al gedekt hierboven)
    const genericMatch = url.match(/(?:id=|-)(\d{7,10})/);
    if (genericMatch) return genericMatch[1];
  } catch {
    /* ignore */
  }
  return null;
}

/** Probeer de mobile.de interne expose-API — geen CORS-blokkade server-side */
async function tryExposeApi(
  listingId: string
): Promise<ParsedCarData | null> {
  try {
    const apiUrl = `https://api.mobile.de/search-service/expose/${listingId}`;
    const res = await fetch(apiUrl, {
      headers: {
        ...BROWSER_HEADERS,
        Accept: "application/json, text/plain, */*",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const json = await res.json();
    const attrs = json?.attributes ?? json?.vehicleDetails ?? json;

    const data: Partial<ParsedCarData> = {};

    // Merk/model
    data.merk  = attrs?.make?.displayValue ?? attrs?.make ?? undefined;
    data.model = attrs?.model?.displayValue ?? attrs?.model ?? undefined;
    data.title = [data.merk, data.model].filter(Boolean).join(" ") || undefined;

    // CO2
    const co2Raw =
      attrs?.emissionSticker?.co2Emission ??
      attrs?.co2EmissionValue ??
      attrs?.co2;
    if (co2Raw !== undefined) data.co2Wltp = parseInt(String(co2Raw), 10);

    // Brandstof
    const ftRaw = (
      attrs?.fuel?.displayValue ??
      attrs?.fuelType ??
      ""
    ).toLowerCase();
    if (ftRaw.includes("benzin") || ftRaw.includes("petrol"))
      data.brandstof = "benzine";
    else if (ftRaw.includes("diesel")) data.brandstof = "diesel";
    else if (ftRaw.includes("elektr") || ftRaw.includes("electric"))
      data.brandstof = "elektrisch";
    else if (ftRaw.includes("hybrid") || ftRaw.includes("plug"))
      data.brandstof = "phev";

    // Datum eerste toelating
    const regMonth = attrs?.firstRegistration?.month ?? attrs?.registrationMonth;
    const regYear  = attrs?.firstRegistration?.year  ?? attrs?.registrationYear;
    if (regYear)
      data.datumEersteToelating = `${regYear}-${String(regMonth ?? "01").padStart(2, "0")}-01`;

    // Prijs
    const price = attrs?.price?.amount ?? attrs?.price;
    if (price) data.catalogusprijs = parseInt(String(price).replace(/\D/g, ""), 10) || undefined;

    // Kilometerstand
    const km = attrs?.mileage?.value ?? attrs?.mileage;
    if (km) data.kilometerstand = parseInt(String(km).replace(/\D/g, ""), 10) || undefined;

    if (!data.merk && !data.co2Wltp) return null; // API gaf niets bruikbaars
    return data as ParsedCarData;
  } catch {
    return null;
  }
}

/** Parse de HTML-body als fallback */
function parseHtml(html: string): Partial<ParsedCarData> {
  const data: Partial<ParsedCarData> = {};

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    data.title = titleMatch[1].replace(/\s*[-|].*$/, "").replace("| mobile.de", "").trim();
    const parts = data.title.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      data.merk  = parts[0];
      data.model = parts.slice(1, 3).join(" ");
    }
  }

  // JSON-LD structured data (beste bron als beschikbaar)
  const jsonLdBlocks = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi) ?? [];
  for (const block of jsonLdBlocks) {
    try {
      const jsonStr = block.replace(/<\/?script[^>]*>/gi, "");
      const obj = JSON.parse(jsonStr);
      const v = Array.isArray(obj)
        ? obj.find((o) => o["@type"] === "Vehicle" || o["@type"] === "Car")
        : obj;
      if (!v) continue;

      if (v.brand?.name)  data.merk  = v.brand.name;
      if (v.model)        data.model = v.model;
      if (v.name && !data.title) data.title = v.name;

      const ft = (v.fuelType ?? "").toLowerCase();
      if (ft.includes("gasoline") || ft.includes("benzin")) data.brandstof = "benzine";
      else if (ft.includes("diesel"))                       data.brandstof = "diesel";
      else if (ft.includes("electric"))                     data.brandstof = "elektrisch";
      else if (ft.includes("hybrid"))                       data.brandstof = "phev";

      if (v.vehicleModelDate || v.dateVehicleFirstRegistered)
        data.datumEersteToelating = v.vehicleModelDate ?? v.dateVehicleFirstRegistered;
      if (v.offers?.price)
        data.catalogusprijs = parseInt(String(v.offers.price).replace(/\D/g, ""), 10) || undefined;
      if (v.mileageFromOdometer?.value)
        data.kilometerstand = parseInt(v.mileageFromOdometer.value, 10) || undefined;
      break;
    } catch { /* skip */ }
  }

  // CO2 regex fallback
  if (!data.co2Wltp) {
    const co2Match = html.match(/(\d{2,3})\s*g\/km/i);
    if (co2Match) data.co2Wltp = parseInt(co2Match[1], 10);
  }

  // Brandstof regex fallback
  if (!data.brandstof) {
    const bf = html.match(/(Benzin|Diesel|Elektro|Plug-in Hybrid|Hybrid)/i)?.[1]?.toLowerCase();
    if (bf) {
      if (bf.includes("benzin"))   data.brandstof = "benzine";
      else if (bf.includes("diesel"))  data.brandstof = "diesel";
      else if (bf.includes("elektro")) data.brandstof = "elektrisch";
      else if (bf.includes("hybrid") || bf.includes("plug")) data.brandstof = "phev";
    }
  }

  // Datum regex fallback  (Erstzulassung MM/YYYY or MM.YYYY)
  if (!data.datumEersteToelating) {
    const reg = html.match(/Erstzulassung[^<>]*?(\d{2})[\/.](\d{4})/i);
    if (reg) data.datumEersteToelating = `${reg[2]}-${reg[1]}-01`;
  }

  // Prijs regex fallback
  if (!data.catalogusprijs) {
    const p = html.match(/(\d[\d.]+)\s*€/)?.[1];
    if (p) data.catalogusprijs = parseInt(p.replace(/\./g, ""), 10) || undefined;
  }

  return data;
}

/* ──────────────────────────────────────────────────────────── */

export const mobileDe: SiteAdapter = {
  name: "mobile.de",
  domains: ["mobile.de"],

  async parse(url: string): Promise<ParsedCarData> {
    const errors: string[] = [];

    const base: ParsedCarData = {
      sourceUrl: url,
      sourceSite: "mobile.de",
      parseConfidence: "low",
      parseErrors: errors,
    };

    const listingId = extractListingId(url);

    /* ── 1. Probeer de interne expose-API ── */
    if (listingId) {
      const apiData = await tryExposeApi(listingId);
      if (apiData) {
        const merged: ParsedCarData = { ...base, ...apiData, parseErrors: errors };
        if (!merged.co2Wltp)              errors.push("CO₂-uitstoot niet gevonden. Vul handmatig in.");
        if (!merged.brandstof)            errors.push("Brandstoftype niet herkend. Selecteer handmatig.");
        if (!merged.datumEersteToelating) errors.push("Datum eerste toelating niet gevonden.");
        merged.parseConfidence = errors.length === 0 ? "high" : merged.co2Wltp ? "medium" : "low";
        return merged;
      }
    }

    /* ── 2. Probeer HTML ophalen (volledige browser-headers) ── */
    const urlsToTry: string[] = [url];
    if (listingId) {
      // Probeer ook de directe detail-URL als de originele een suchen.mobile.de zoekopdracht was
      urlsToTry.push(`https://www.mobile.de/auto/-/${listingId}.html`);
    }

    let html: string | null = null;
    for (const tryUrl of urlsToTry) {
      try {
        const res = await fetch(tryUrl, {
          headers: BROWSER_HEADERS,
          redirect: "follow",
          signal: AbortSignal.timeout(10000),
        });
        if (res.ok) {
          html = await res.text();
          break;
        }
      } catch { /* try next */ }
    }

    if (html) {
      const parsed = parseHtml(html);
      const merged: ParsedCarData = { ...base, ...parsed, parseErrors: errors };
      if (!merged.co2Wltp)              errors.push("CO₂-uitstoot niet gevonden. Vul handmatig in.");
      if (!merged.brandstof)            errors.push("Brandstoftype niet herkend. Selecteer handmatig.");
      if (!merged.datumEersteToelating) errors.push("Datum eerste toelating niet gevonden.");
      merged.parseConfidence = errors.length === 0 ? "high" : merged.co2Wltp ? "medium" : "low";
      return merged;
    }

    /* ── 3. Alles mislukt: stuur terug met duidelijke instructie ── */
    errors.push(
      "mobile.de blokkeert automatisch ophalen. Voer de gegevens hieronder handmatig in — ze zijn zichtbaar op de advertentiepagina."
    );
    return { ...base, parseErrors: errors, parseConfidence: "low" };
  },
};
