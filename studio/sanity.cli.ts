import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // Lets `sanity deploy` reuse the same hosted address every time.
  studioHost: process.env.SANITY_STUDIO_HOST || undefined,
});
