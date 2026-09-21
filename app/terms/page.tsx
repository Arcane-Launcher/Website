import type { Metadata } from "next";
import { TERMS } from "../lib/legal-content";
import { LegalPage } from "../sections/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions — Arcane Launcher",
  description: TERMS.description,
};

export default function TermsPage() {
  return <LegalPage doc={TERMS} />;
}
