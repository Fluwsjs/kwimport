import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { sendLeadNotification } from "@/lib/email/mailer";

const LeadSchema = z.object({
  naam: z.string().min(2).max(100),
  email: z.string().email(),
  telefoon: z.string().max(30).optional(),
  bericht: z.string().max(2000).optional(),
  bron: z.enum(["CONTACT", "HULP_INSCHAKELEN", "BPM_CALCULATOR", "BPM_VIA_LINK"]).default("CONTACT"),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = LeadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ongeldige invoer", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { metadata, ...leadData } = parsed.data;

    const lead = await prisma.lead.create({
      data: {
        ...leadData,
        metadata: metadata ? (metadata as Parameters<typeof prisma.lead.create>[0]["data"]["metadata"]) : undefined,
      },
    });

    // Email notificatie (non-blocking)
    sendLeadNotification({
      naam: leadData.naam,
      email: leadData.email,
      telefoon: leadData.telefoon,
      bericht: leadData.bericht,
      bron: leadData.bron,
    }).catch((err) => {
      console.error("[leads/api] Email failed:", err);
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (err) {
    console.error("[leads/api] Error:", err);
    return NextResponse.json({ error: "Interne serverfout" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Admin only – check via session
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const pageSize = 20;

  try {
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.lead.count(),
    ]);

    return NextResponse.json({ leads, total, page, pageSize });
  } catch (err) {
    console.error("[leads/api] GET Error:", err);
    return NextResponse.json({ error: "Interne serverfout" }, { status: 500 });
  }
}
