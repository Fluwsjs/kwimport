import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { BpmResultaat, BpmInput } from "@/lib/bpm/types";
import { formatEuro, formatPercent } from "@/lib/utils";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    padding: 40,
    backgroundColor: "#F6F8FB",
    color: "#0F172A",
  },
  header: {
    backgroundColor: "#0B1F33",
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  headerSub: {
    color: "#38BDF8",
    fontSize: 10,
  },
  section: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0B1F33",
    marginBottom: 10,
    borderBottom: "1pt solid #E5EAF0",
    paddingBottom: 6,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottom: "0.5pt solid #F6F8FB",
  },
  label: {
    width: "55%",
    color: "#64748B",
    fontSize: 10,
  },
  value: {
    width: "45%",
    color: "#0F172A",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  highlight: {
    backgroundColor: "#E0F7F7",
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  highlightLabel: {
    color: "#0B8C8B",
    fontSize: 10,
    marginBottom: 4,
  },
  highlightValue: {
    color: "#0EA5A4",
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
  },
  disclaimer: {
    backgroundColor: "#FFF9EC",
    borderLeft: "3pt solid #F59E0B",
    padding: 10,
    marginTop: 12,
    fontSize: 9,
    color: "#92400E",
  },
  listItem: {
    fontSize: 9,
    color: "#0F172A",
    marginBottom: 4,
    paddingLeft: 8,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#64748B",
    textAlign: "center",
    borderTop: "0.5pt solid #E5EAF0",
    paddingTop: 8,
  },
});

interface Props {
  input: BpmInput;
  resultaat: BpmResultaat;
  datum?: Date;
}

export function BpmPdfDocument({ input, resultaat, datum = new Date() }: Props) {
  const datumStr = datum.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document
      title="BPM Berekening – KW Automotive"
      author="KW Automotive Import"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BPM Berekening</Text>
          <Text style={styles.headerSub}>
            KW Automotive Import · Berekend op {datumStr}
          </Text>
        </View>

        {/* Invoer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voertuiggegevens</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Voertuigtype</Text>
            <Text style={styles.value}>{input.voertuigType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Brandstof</Text>
            <Text style={styles.value}>{input.brandstof}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>CO₂-uitstoot (WLTP)</Text>
            <Text style={styles.value}>{input.co2Wltp} g/km</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Datum eerste toelating</Text>
            <Text style={styles.value}>
              {input.datumEersteToelating.toLocaleDateString("nl-NL")}
            </Text>
          </View>
          {input.catalogusprijs && (
            <View style={styles.row}>
              <Text style={styles.label}>Catalogusprijs</Text>
              <Text style={styles.value}>{formatEuro(input.catalogusprijs)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>
              {input.status === "nieuw" ? "Nieuw" : "Gebruikt"}
            </Text>
          </View>
        </View>

        {/* Resultaat */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BPM Resultaat</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Tariefjaar</Text>
            <Text style={styles.value}>{resultaat.tariefjaar}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Schijfberekening</Text>
            <Text style={styles.value}>{resultaat.details.schijfBerekening}</Text>
          </View>
          {resultaat.dieselToeslag !== undefined && (
            <View style={styles.row}>
              <Text style={styles.label}>Dieseltoeslag</Text>
              <Text style={styles.value}>{formatEuro(resultaat.dieselToeslag)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Bruto BPM</Text>
            <Text style={styles.value}>{formatEuro(resultaat.brutoBpm)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Afschrijvingsmethode</Text>
            <Text style={styles.value}>{resultaat.methode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Afschrijving</Text>
            <Text style={styles.value}>
              {formatPercent(resultaat.afschrijvingsPercentage)}
            </Text>
          </View>

          <View style={styles.highlight}>
            <Text style={styles.highlightLabel}>Verschuldigde BPM (indicatie)</Text>
            <Text style={styles.highlightValue}>{formatEuro(resultaat.totaalBpm)}</Text>
          </View>
        </View>

        {/* Aannames */}
        {resultaat.aannames.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Aannames &amp; berekening</Text>
            {resultaat.aannames.map((a, i) => (
              <Text key={i} style={styles.listItem}>• {a}</Text>
            ))}
          </View>
        )}

        {/* Waarschuwingen */}
        {resultaat.waarschuwingen.length > 0 && (
          <View style={styles.disclaimer}>
            <Text style={{ fontFamily: "Helvetica-Bold", marginBottom: 4, fontSize: 9 }}>
              Waarschuwingen
            </Text>
            {resultaat.waarschuwingen.map((w, i) => (
              <Text key={i}>• {w}</Text>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text>
            ⚠️ Indicatieve berekening. De definitieve BPM volgt uit de officiële
            aangifte bij de Belastingdienst. KW Automotive is niet aansprakelijk
            voor afwijkingen tussen deze berekening en de werkelijk te betalen BPM.
          </Text>
        </View>

        <Text style={styles.footer}>
          KW Automotive Import · kwautomotive.nl · Berekend op {datumStr}
        </Text>
      </Page>
    </Document>
  );
}
