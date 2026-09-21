import type { Metadata } from "next";
import { PRIVACY } from "../lib/legal-content";
import { LegalPage } from "../sections/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — Arcane Launcher",
  description: PRIVACY.description,
};

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY} />;
}
