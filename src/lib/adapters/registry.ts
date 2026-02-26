import type { SiteAdapter, ParsedCarData } from "./types";
import { mobileDe } from "./mobile-de";
import { autoscout24 } from "./autoscout24";

const ADAPTERS: SiteAdapter[] = [mobileDe, autoscout24];

export function findAdapter(url: string): SiteAdapter | null {
  try {
    const { hostname } = new URL(url);
    return (
      ADAPTERS.find((a) =>
        a.domains.some((d) => hostname.includes(d))
      ) ?? null
    );
  } catch {
    return null;
  }
}

export async function parseCarUrl(url: string): Promise<ParsedCarData> {
  const adapter = findAdapter(url);

  if (!adapter) {
    return {
      sourceUrl: url,
      sourceSite: "onbekend",
      parseConfidence: "low",
      parseErrors: [
        "Geen adapter beschikbaar voor deze website. Vul de gegevens handmatig in.",
      ],
    };
  }

  try {
    return await adapter.parse(url);
  } catch (err) {
    return {
      sourceUrl: url,
      sourceSite: adapter.name,
      parseConfidence: "low",
      parseErrors: [
        `Fout bij het verwerken van ${adapter.name}: ${err instanceof Error ? err.message : "Onbekende fout"}`,
      ],
    };
  }
}

export { ADAPTERS };
