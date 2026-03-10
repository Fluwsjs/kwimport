import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { berekenBpmOptimaal } from "@/lib/bpm/calculator";
import { prisma } from "@/lib/db/prisma";

const BpmRequestSchema = z.object({
  voertuigType: z.enum(["personenauto", "bestelauto", "motor", "camper"]),
  brandstof: z.enum(["benzine", "diesel", "elektrisch", "phev", "waterstof"]),
  co2Wltp: z.number().min(0).max(500),
  /** NEDC CO₂-waarde (optioneel, alleen voor auto's met DET vóór 1 juli 2020). */
  co2Nedc: z.number().min(0).max(500).optional(),
  datumEersteToelating: z.string(),
  datumRegistratieNL: z.string().optional(),
  catalogusprijs: z.number().min(0),
  status: z.enum(["nieuw", "gebruikt"]),
  afschrijvingsMethode: z.enum(["forfaitair", "koerslijst", "taxatierapport"]).optional(),
  consumentenprijs: z.number().optional(),
  inkoopwaarde: z.number().optional(),
  taxatiewaarde: z.number().optional(),
  tariefjaar: z.number().optional(),
  email: z.string().email().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BpmRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ongeldige invoer", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const input = {
      ...data,
      datumEersteToelating: new Date(data.datumEersteToelating),
      datumRegistratieNL: data.datumRegistratieNL
        ? new Date(data.datumRegistratieNL)
        : undefined,
    };

    let resultaat;
    try {
      resultaat = berekenBpmOptimaal(input);
    } catch (calcErr) {
      // Gestructureerde fout vanuit de calculator (bijv. niet-ondersteund voertuigtype)
      const message = calcErr instanceof Error ? calcErr.message : "Berekening mislukt";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // Opslaan in database
    try {
      await prisma.calculation.create({
        data: {
          email: data.email,
          vehicleType: data.voertuigType,
          method: resultaat.methode,
          input: input as object,
          result: resultaat as object,
        },
      });
    } catch (dbErr) {
      console.error("[bpm/api] Database save failed:", dbErr);
    }

    return NextResponse.json({ resultaat });
  } catch (err) {
    console.error("[bpm/api] Error:", err);
    return NextResponse.json(
      { error: "Interne serverfout" },
      { status: 500 }
    );
  }
}
