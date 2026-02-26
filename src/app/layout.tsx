import type { Metadata } from "next";
import "./globals.css";
import { Topbar } from "@/components/layout/Topbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Import Zelf Regelen & BPM Berekenen | KW Automotive",
    template: "%s | KW Automotive Import",
  },
  description:
    "Bereken zelf je BPM bij auto-import. Gratis BPM calculator voor personenauto's. Inclusief afschrijving, forfaitaire tabel en koerslijst methode.",
  keywords: ["BPM berekenen", "auto import", "BPM calculator", "BPM aangifte", "import auto Nederland"],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "KW Automotive Import",
    title: "Import Zelf Regelen & BPM Berekenen | KW Automotive",
    description:
      "Bereken zelf je BPM bij auto-import. Gratis BPM calculator voor personenauto's.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${process.env.NEXT_PUBLIC_APP_URL}/#organization`,
                  name: "KW Automotive",
                  url: process.env.NEXT_PUBLIC_APP_URL,
                  description:
                    "Specialist in auto-import en BPM-berekeningen voor Nederland.",
                },
                {
                  "@type": "WebSite",
                  "@id": `${process.env.NEXT_PUBLIC_APP_URL}/#website`,
                  url: process.env.NEXT_PUBLIC_APP_URL,
                  name: "KW Automotive Import",
                  publisher: {
                    "@id": `${process.env.NEXT_PUBLIC_APP_URL}/#organization`,
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <Topbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
