/**
 * Generates sitemap.xml dynamically from stations.json and blogPosts.js.
 * Run before build: node scripts/generate-sitemap.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BASE_URL = "https://lofimusicradio.com";
const TODAY = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// Locale mapping for hreflang
const LOCALES = [
  { lang: "en", hreflang: "en-US", label: "English" },
  { lang: "es", hreflang: "es-ES", label: "Español" },
  { lang: "de", hreflang: "de-DE", label: "Deutsch" },
  { lang: "fr", hreflang: "fr-FR", label: "Français" },
  { lang: "it", hreflang: "it-IT", label: "Italiano" },
  { lang: "ru", hreflang: "ru-RU", label: "Русский" },
  { lang: "zh", hreflang: "zh-CN", label: "中文" },
];

const DEFAULT_LOCALE = "en";

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function hreflangLinks(path) {
  const links = LOCALES.map(
    ({ lang, hreflang }) =>
      `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${BASE_URL}${path}?lang=${lang}" />`
  );
  // x-default points to English version
  links.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${path}?lang=${DEFAULT_LOCALE}" />`
  );
  return links.join("\n");
}

function urlEntry(path, { priority = "0.7", changefreq = "monthly", lastmod = TODAY } = {}) {
  return `  <url>
    <loc>${escapeXml(BASE_URL + path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflangLinks(path)}
  </url>`;
}

// Load station categories
let categories = [];
try {
  const stationsRaw = readFileSync(join(ROOT, "public", "stations.json"), "utf-8");
  const stations = JSON.parse(stationsRaw);
  categories = stations.categories || [];
} catch (err) {
  console.error("❌ Failed to read stations.json:", err.message);
  process.exit(1);
}

// Build sitemap
const urls = [];

// Homepage
urls.push(
  urlEntry("/", { priority: "1.0", changefreq: "weekly" })
);

// Station category pages
// Map category names to URL slugs (must match CATEGORY_META keys in CategoryPage.jsx)
function categoryToSlug(name) {
  const map = {
    "Lofi": "lofi",
    "Jazz": "jazz",
    "Rap/Hip Hop": "rap-hip-hop",
    "Nature": "nature",
    "Synthwave": "synthwave",
    "House": "house",
    "Meditation": "meditation",
    "Drum & Bass": "drum-bass",
    "Techno": "techno",
    "Reggaeton": "reggaeton",
  };
  return map[name] || name.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-").replace(/&/g, "");
}

const categorySlugs = categories.map((cat) => categoryToSlug(cat.name));

for (const slug of categorySlugs) {
  const catPriority = slug === "lofi" ? "0.8" : slug === "jazz" ? "0.7" : "0.6";
  urls.push(
    urlEntry(`/stations/${slug}`, {
      priority: catPriority,
      changefreq: "monthly",
    })
  );
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

writeFileSync(join(ROOT, "public", "sitemap.xml"), sitemap, "utf-8");

console.log(`✅ Sitemap generated: ${urls.length} URLs`);
console.log(`   Home: 1, Categories: ${categorySlugs.length}`);
for (const slug of categorySlugs) {
  console.log(`   /stations/${slug}`);
}
