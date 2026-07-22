import React from "react";
import {
  Body, Button, Container, Head, Heading, Hr, Html, Link, Preview, Section, Text,
} from "@react-email/components";

interface Props {
  title?: string;
  country?: string;
  visaType?: string;
  status?: string;
  effectiveDate?: string;
  previousRule?: string;
  newRule?: string;
  sourceName?: string;
  sourceUrl?: string;
  detailUrl?: string;
}

const Email = ({
  title = "New immigration change",
  country = "",
  visaType = "",
  status = "info",
  effectiveDate = "",
  previousRule = "",
  newRule = "",
  sourceName = "Official source",
  sourceUrl = "#",
  detailUrl = "#",
}: Props) => (
  <Html lang="en">
    <Head />
    <Preview>{country} · {visaType} — {title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={eyebrow}>IMMIGRATION RADAR ALERT</Text>
        <Heading as="h1" style={h1}>{title}</Heading>
        <Text style={meta}>
          {country} · {visaType} · <span style={{ textTransform: "uppercase", color: "#0891b2" }}>{status}</span>
        </Text>
        {effectiveDate && <Text style={metaSub}>Effective {effectiveDate}</Text>}

        <Section style={ruleBox}>
          <Text style={ruleLabel}>PREVIOUS RULE</Text>
          <Text style={ruleText}>{previousRule}</Text>
        </Section>
        <Section style={newBox}>
          <Text style={newLabel}>NEW RULE</Text>
          <Text style={newText}>{newRule}</Text>
        </Section>

        <Section style={{ textAlign: "center", margin: "28px 0 12px" }}>
          <Button href={sourceUrl} style={cta}>Open official source</Button>
        </Section>
        <Text style={sourceLine}>
          Verified against <Link href={sourceUrl} style={link}>{sourceName}</Link>
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          You are receiving this because a change matches your Immigration Radar watchlist.{" "}
          <Link href={detailUrl} style={link}>View the full change on Immigration Radar →</Link>
        </Text>
        <Text style={footerSm}>Guidance only — not legal advice.</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: "New immigration change matching your watchlist",
  displayName: "Watchlist alert",
  previewData: {
    title: "Salary threshold raised to £30,000",
    country: "United Kingdom",
    visaType: "Skilled Worker Visa",
    status: "urgent",
    effectiveDate: "1 Sep 2026",
    previousRule: "Minimum salary £26,200 per year.",
    newRule: "Minimum salary £30,000 per year (or going rate).",
    sourceName: "Home Office",
    sourceUrl: "https://www.gov.uk/skilled-worker-visa",
    detailUrl: "https://example.com/updates/uk-sw-2026",
  },
};

const main = { backgroundColor: "#ffffff", fontFamily: "'Inter', Arial, sans-serif" };
const container = { padding: "32px 28px", maxWidth: "560px", margin: "0 auto" };
const eyebrow = { fontSize: "11px", letterSpacing: "0.14em", color: "#0891b2", fontWeight: 600 as const, margin: 0 };
const h1 = { fontSize: "24px", lineHeight: "1.25", color: "#0f172a", margin: "8px 0 12px", fontWeight: 700 as const };
const meta = { fontSize: "13px", color: "#475569", margin: "0 0 4px" };
const metaSub = { fontSize: "12px", color: "#64748b", margin: "0 0 20px" };
const ruleBox = { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 16px", margin: "0 0 8px" };
const ruleLabel = { fontSize: "10px", letterSpacing: "0.14em", color: "#94a3b8", margin: "0 0 6px", fontWeight: 600 as const };
const ruleText = { fontSize: "14px", color: "#475569", margin: 0, textDecoration: "line-through" };
const newBox = { background: "#ecfeff", border: "1px solid #a5f3fc", borderRadius: "10px", padding: "14px 16px" };
const newLabel = { fontSize: "10px", letterSpacing: "0.14em", color: "#0891b2", margin: "0 0 6px", fontWeight: 600 as const };
const newText = { fontSize: "15px", color: "#0f172a", margin: 0, fontWeight: 500 as const };
const cta = { background: "linear-gradient(135deg, #06b6d4, #6366f1)", color: "#ffffff", padding: "12px 22px", borderRadius: "10px", fontWeight: 600 as const, textDecoration: "none", fontSize: "14px" };
const sourceLine = { fontSize: "12px", color: "#64748b", textAlign: "center" as const, margin: "8px 0 0" };
const hr = { borderColor: "#e2e8f0", margin: "28px 0 16px" };
const footer = { fontSize: "12px", color: "#64748b", lineHeight: "1.6", margin: 0 };
const footerSm = { fontSize: "11px", color: "#94a3b8", marginTop: "8px" };
const link = { color: "#0891b2", textDecoration: "underline" };

export default Email;
