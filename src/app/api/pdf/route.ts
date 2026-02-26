import { NextRequest, NextResponse } from "next/server";
import React from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { BpmPdfDocument } from "@/lib/pdf/generateBpmPdf";
import type { BpmInput, BpmResultaat } from "@/lib/bpm/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, resultaat } = body as { input: BpmInput; resultaat: BpmResultaat };

    if (!input || !resultaat) {
      return NextResponse.json({ error: "input en resultaat zijn verplicht" }, { status: 400 });
    }

    // Deserialize dates
    const parsedInput: BpmInput = {
      ...input,
      datumEersteToelating: new Date(input.datumEersteToelating),
      datumRegistratieNL: input.datumRegistratieNL
        ? new Date(input.datumRegistratieNL)
        : undefined,
    };

    const element = React.createElement(BpmPdfDocument, {
      input: parsedInput,
      resultaat,
      datum: new Date(),
    });

    const buffer = await renderToBuffer(
      element as React.ReactElement<DocumentProps>
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="bpm-berekening-${Date.now()}.pdf"`,
      },
    });
  } catch (err) {
    console.error("[pdf/api] Error:", err);
    return NextResponse.json({ error: "PDF genereren mislukt" }, { status: 500 });
  }
}
