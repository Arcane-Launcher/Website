import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // This website lives inside the launcher's own project folder (which has
  // its own package-lock.json), so Turbopack needs telling explicitly that
  // *this* directory — not the parent — is its real workspace root.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Next.js 16 clamps every `quality` prop to this allowlist (default is
    // just [75]) — product screenshots need 100 or their text gets mushy.
    qualities: [75, 90, 100],
    // Images uploaded to news posts in the Sanity Studio are served from
    // Sanity's own CDN, and the product screenshots from this project's
    // Cloudinary account (see app/lib/cloudinary.ts). Nothing else.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/djxqfao4r/image/upload/**" },
    ],
  },
};

export default nextConfig;
