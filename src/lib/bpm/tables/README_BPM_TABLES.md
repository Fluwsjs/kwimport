# BPM Tarieftabellen – Bijwerken & Onderhouden

## Overzicht

De tarieftabellen staan in `src/lib/bpm/tables/` als JSON-bestanden.

| Bestand | Inhoud |
|---|---|
| `passengerCars_YYYY.json` | Tariefschijven voor personenauto's (benzine, diesel, elektrisch, PHEV) per jaar |
| `depreciation_forfaitaire.json` | Forfaitaire afschrijvingstabel (maanden → percentage), geldt voor alle jaren |

## Jaarlijkse update (nieuw belastingjaar)

### Stap 1: Officiële bron raadplegen

Ga naar: **https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/zakelijk/auto_en_vervoer/bpm/tarieven/**

Of zoek in de Staatscourant naar "Wet BPM" / "Bpm-tarieven [jaar]".

### Stap 2: Nieuw JSON-bestand aanmaken

Kopieer het bestand van het vorige jaar:

```bash
cp src/lib/bpm/tables/passengerCars_2025.json src/lib/bpm/tables/passengerCars_2026.json
```

### Stap 3: Velden bijwerken

Pas aan in het nieuwe bestand:

- `_year`: nieuw jaar (bijv. `2026`)
- `_validFrom` / `_validUntil`: nieuwe data
- Elke `brackets`-array: `vastBedrag` en `variabelPer` per schijf
- `dieselSurcharge.bedragPerGram`: nieuw dieseltoeslagbedrag per g/km
- Elektrisch: check of vrijstelling nog geldt of tarief gewijzigd is
- PHEV: check of aparte bracket-tabel of `gelijkAanBrandstof` blijft

### Stap 4: TableRegistry bijwerken

Open `src/lib/bpm/tableRegistry.ts` en voeg het nieuwe jaar toe aan `AVAILABLE_TABLES`:

```typescript
import tables2026 from "./tables/passengerCars_2026.json";

export const AVAILABLE_TABLES: Record<number, PassengerCarTable> = {
  // ...bestaande jaren
  2026: tables2026 as PassengerCarTable,
};
```

### Stap 5: Testen

Run unit tests om te controleren dat berekeningen kloppen:

```bash
npm run test
```

Vergelijk uitkomsten handmatig met de Belastingdienst rekentool.

---

## Forfaitaire afschrijvingstabel

De tabel `depreciation_forfaitaire.json` verandert zelden. Controleer jaarlijks of de Belastingdienst aanpassingen heeft gepubliceerd (o.b.v. art. 10 lid 7 Wet BPM 1992).

---

## Disclaimer

De tabellen zijn zo nauwkeurig mogelijk bijgehouden, maar controleer altijd de officiële Belastingdienst-bronnen. BPM-berekeningen zijn **indicatief** — de definitieve BPM volgt uit de officiële aangifte.
