import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseCarUrl } from "@/lib/adapters/registry";

const Schema = z.object({
  url: z.string().url(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = Schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Ongeldige URL" }, { status: 400 });
    }

    console.log(`[parse-url] Parsing: ${parsed.data.url}`);

    const result = await parseCarUrl(parsed.data.url);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("[parse-url] Error:", err);
    return NextResponse.json({ error: "Parsen mislukt" }, { status: 500 });
  }
}
