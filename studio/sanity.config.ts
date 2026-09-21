import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

// Read from studio/.env (see .env.example). These aren't secrets: the project id
// is visible in every request the Studio makes.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || "production";
const siteUrl = (process.env.SANITY_STUDIO_SITE_URL || "").replace(/\/+$/, "");

if (!projectId) {
  throw new Error("Set SANITY_STUDIO_PROJECT_ID in studio/.env (copy .env.example). You get the id from sanity.io/manage.");
}

export default defineConfig({
  name: "arcane-news",
  title: "Arcane Launcher News",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: { types: schemaTypes },
  document: {
    // Adds an "Open on site" link to published posts when the site's address is set.
    productionUrl: async (previous, { document }) => {
      const slug = (document.slug as { current?: string } | undefined)?.current;
      if (!siteUrl || document._type !== "post" || !slug) return previous;
      return `${siteUrl}/news/${slug}`;
    },
  },
});
