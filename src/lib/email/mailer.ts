import nodemailer from "nodemailer";

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

interface LeadEmailData {
  naam: string;
  email: string;
  telefoon?: string;
  bericht?: string;
  bron: string;
}

export async function sendLeadNotification(lead: LeadEmailData): Promise<void> {
  const to = process.env.NOTIFICATION_EMAIL;
  if (!to || !process.env.SMTP_HOST) {
    console.warn("[email] SMTP not configured, skipping lead notification");
    return;
  }

  const transporter = createTransporter();

  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #F6F8FB; padding: 24px; border-radius: 12px;">
      <div style="background: #0B1F33; padding: 20px 24px; border-radius: 8px; margin-bottom: 24px;">
        <h1 style="color: white; margin: 0; font-size: 18px;">Nieuwe lead – KW Import</h1>
        <p style="color: #38BDF8; margin: 4px 0 0; font-size: 14px;">Bron: ${lead.bron}</p>
      </div>

      <div style="background: white; padding: 20px 24px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #E5EAF0;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #64748B; font-size: 13px; width: 140px;">Naam</td>
            <td style="padding: 8px 0; color: #0F172A; font-size: 14px; font-weight: 600;">${lead.naam}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748B; font-size: 13px;">E-mail</td>
            <td style="padding: 8px 0; color: #0EA5A4; font-size: 14px;"><a href="mailto:${lead.email}" style="color: #0EA5A4;">${lead.email}</a></td>
          </tr>
          ${lead.telefoon ? `<tr>
            <td style="padding: 8px 0; color: #64748B; font-size: 13px;">Telefoon</td>
            <td style="padding: 8px 0; color: #0F172A; font-size: 14px;">${lead.telefoon}</td>
          </tr>` : ""}
          ${lead.bericht ? `<tr>
            <td style="padding: 8px 0; color: #64748B; font-size: 13px; vertical-align: top;">Bericht</td>
            <td style="padding: 8px 0; color: #0F172A; font-size: 14px;">${lead.bericht.replace(/\n/g, "<br>")}</td>
          </tr>` : ""}
        </table>
      </div>

      <p style="color: #64748B; font-size: 12px; text-align: center;">KW Automotive Import – Automatische notificatie</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "KW Automotive Import <noreply@kwautomotive.nl>",
    to,
    subject: `Nieuwe lead van ${lead.naam} via ${lead.bron}`,
    html,
  });
}
