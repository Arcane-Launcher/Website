/// The product screenshots are hosted on Cloudinary instead of living in the repo
/// (two of them were 12+ MB). To change one, upload the new image in the Cloudinary
/// Media Library and paste its URL below.
const HOSTED = {
  "hero-screenshot": "https://res.cloudinary.com/djxqfao4r/image/upload/v1789711760/Screenshot_2026-09-18_113822_q4t0sz.png",
  apperance: "https://res.cloudinary.com/djxqfao4r/image/upload/v1789966947/apperance_sbspio.png",
  skinuploader: "https://res.cloudinary.com/djxqfao4r/image/upload/v1789966950/skinuploader_hubawn.png",
  mods: "https://res.cloudinary.com/djxqfao4r/image/upload/v1789967143/mods_v4kyyw.png",
} as const;

/// Where a screenshot (a name from the list above, e.g. "hero-screenshot") is
/// served from. Next's image optimizer still resizes and converts it.
export function screenshotSrc(name: keyof typeof HOSTED): string {
  return HOSTED[name];
}
