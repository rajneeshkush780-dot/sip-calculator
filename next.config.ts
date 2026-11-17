import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Publish generated HTML directly; the calculator needs no server runtime.
  output: "export",
  trailingSlash: true,
  // Next.js blocks its dev scripts for any host other than localhost. Without this,
  // opening the site via the "Network" address (e.g. http://10.185.175.1:3000, or from a
  // phone on the same Wi-Fi) shows the page but none of the calculator works.
  // Only affects `pnpm dev`; production builds are unaffected.
  allowedDevOrigins: ["10.185.175.1", "192.168.*.*", "10.*.*.*"],
};

export default nextConfig;
