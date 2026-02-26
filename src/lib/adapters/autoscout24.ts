import type { SiteAdapter, ParsedCarData } from "./types";

/**
 * Adapter voor AutoScout24 advertentiepagina's.
 */
export const autoscout24: SiteAdapter = {
  name: "AutoScout24",
  domains: ["autoscout24.com", "autoscout24.be", "autoscout24.de"],

  async parse(url: string): Promise<ParsedCarData> {
    const errors: string[] = [];

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; KWImportBot/1.0; +https://kwautomotive.nl)",
        "Accept-Language": "nl-NL,nl;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} bij ophalen AutoScout24 pagina`);
    }

    const html = await res.text();

    const data: ParsedCarData = {
      sourceUrl: url,
      sourceSite: "AutoScout24",
      parseConfidence: "medium",
      parseErrors: errors,
    };

    // Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      data.title = titleMatch[1].replace(/\s*[-|].*$/, "").trim();
    }

    // JSON-LD structured data (autoscout24 bevat vaak schema.org Vehicle data)
    const jsonLdMatch = html.match(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
    );
    if (jsonLdMatch) {
      for (const block of jsonLdMatch) {
        try {
          const jsonStr = block.replace(/<\/?script[^>]*>/gi, "");
          const obj = JSON.parse(jsonStr);
          const vehicle = Array.isArray(obj) ? obj.find((o) => o["@type"] === "Vehicle" || o["@type"] === "Car") : obj;
          if (vehicle) {
            if (vehicle.brand?.name) data.merk = vehicle.brand.name;
            if (vehicle.model) data.model = vehicle.model;
            if (vehicle.fuelType) {
              const ft = vehicle.fuelType.toLowerCase();
              if (ft.includes("gasoline") || ft.includes("petrol") || ft.includes("benzin")) data.brandstof = "benzine";
              else if (ft.includes("diesel")) data.brandstof = "diesel";
              else if (ft.includes("electric")) data.brandstof = "elektrisch";
              else if (ft.includes("hybrid")) data.brandstof = "phev";
            }
            if (vehicle.vehicleModelDate || vehicle.dateVehicleFirstRegistered) {
              data.datumEersteToelating = vehicle.vehicleModelDate || vehicle.dateVehicleFirstRegistered;
            }
            if (vehicle.offers?.price) {
              data.catalogusprijs = parseInt(String(vehicle.offers.price).replace(/\D/g, ""), 10);
            }
          }
        } catch {
          // Skip invalid JSON-LD
        }
      }
    }

    // CO2 fallback regex
    if (!data.co2Wltp) {
      const co2Match = html.match(/(\d+)\s*g\/km/i);
      if (co2Match) data.co2Wltp = parseInt(co2Match[1], 10);
      else errors.push("CO₂-uitstoot niet automatisch gevonden. Vul handmatig in.");
    }

    if (!data.brandstof) errors.push("Brandstoftype niet herkend. Selecteer handmatig.");
    if (!data.datumEersteToelating) errors.push("Datum eerste toelating niet gevonden.");

    data.parseConfidence =
      errors.length === 0 ? "high" : data.co2Wltp ? "medium" : "low";

    return data;
  },
};
