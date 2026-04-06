import { writeFileSync } from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT ?? "5173";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

/** Root path for deployed assets; use `/` on Vercel and most hosts. */
const basePath = process.env.BASE_PATH ?? "/";

const outDir = path.resolve(import.meta.dirname, "dist");

/** Absolute site URL for SEO (canonical, OG, sitemap). Set VITE_SITE_URL in Vercel for a custom domain; otherwise VERCEL_URL is used. */
function resolveSiteUrl(): string {
  const custom = process.env.VITE_SITE_URL;
  if (custom) return custom.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return `http://localhost:${port}`;
}

function seoPlugins(): Plugin[] {
  const base = resolveSiteUrl();
  return [
    {
      name: "html-seo-site-url",
      transformIndexHtml(html) {
        return html.replaceAll("%SITE_URL%", base);
      },
    },
    {
      name: "seo-robots-sitemap",
      writeBundle() {
        const robots = `User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`;
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1</priority>
  </url>
</urlset>
`;
        writeFileSync(path.join(outDir, "robots.txt"), robots);
        writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);
      },
    },
  ];
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...seoPlugins(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir,
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
