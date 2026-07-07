/**
 * Generates OG images for blog posts and station categories.
 * Uses raw SVG templates + @resvg/resvg-js (SVG → PNG).
 * No external font downloads needed — uses system fonts.
 *
 * Run: node scripts/generate-og-images.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OG_DIR = join(ROOT, "public", "og");

const BRAND = "Lofi Music Radio";
const W = 1200;
const H = 630;

function esc(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function ogSvg({ title, subtitle, tag }) {
  const safeTitle = esc(title);
  const safeSub = subtitle ? esc(subtitle) : "";
  const safeTag = tag ? esc(tag.toUpperCase()) : "";

  let titleLines = [safeTitle];
  if (safeTitle.length > 50) {
    const mid = Math.floor(safeTitle.length / 2);
    const sp = safeTitle.lastIndexOf(" ", mid);
    if (sp > 20) titleLines = [safeTitle.slice(0, sp), safeTitle.slice(sp + 1)];
  }

  const titleY = safeTag ? 210 : 220;
  const subY = safeTag ? 330 : 340;
  const titleSpans = titleLines
    .map((line, i) => `<tspan x="80" dy="${i === 0 ? 0 : 68}" font-size="52" font-weight="700" fill="#fff">${line}</tspan>`)
    .join("\n");

  const tagW = safeTag ? safeTag.length * 12 + 44 : 0;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="50%" stop-color="#16213e"/>
      <stop offset="100%" stop-color="#0f3460"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#646cff"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="1080" cy="-40" r="220" fill="#646cff" opacity="0.08"/>
  <circle cx="120" cy="680" r="180" fill="#646cff" opacity="0.06"/>
  ${safeTag ? `<rect x="80" y="80" rx="20" width="${tagW}" height="40" fill="#646cff" opacity="0.3"/>
  <text x="102" y="106" font-family="Arial,Helvetica,sans-serif" font-size="18" font-weight="600" fill="#c4c9ff" letter-spacing="2">${safeTag}</text>` : ""}
  <text font-family="Arial,Helvetica,sans-serif" y="${titleY}">${titleSpans}</text>
  ${safeSub ? `<text x="80" y="${subY}" font-family="Arial,Helvetica,sans-serif" font-size="24" fill="#aab4d9">${safeSub}</text>` : ""}
  <rect x="0" y="${H - 2}" width="${W}" height="2" fill="#646cff" opacity="0.2"/>
  <circle cx="80" cy="${H - 45}" r="16" fill="url(#accent)"/>
  <text x="124" y="${H - 38}" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="700" fill="#c4c9ff">♪ ${BRAND}</text>
  <text x="420" y="${H - 38}" font-family="Arial,Helvetica,sans-serif" font-size="18" fill="#6b7aaa">· Free · Ad-Free · 24/7</text>
  <text x="720" y="${H - 38}" font-family="Arial,Helvetica,sans-serif" font-size="16" fill="#4a5a8a">lofimusicradio.com</text>
</svg>`;
}

function generateOg(filename, title, subtitle, tag) {
  const svg = ogSvg({ title, subtitle, tag });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: W } });
  writeFileSync(join(OG_DIR, filename), resvg.render().asPng());
  console.log(`  ✅ ${filename}`);
}

function main() {
  if (!existsSync(OG_DIR)) mkdirSync(OG_DIR, { recursive: true });
  console.log("🎨 Generating OG images (SVG → PNG)...\n");

  // Homepage
  generateOg("home.png", "Free Lofi Music — 24/7 Radio", "Ad-free lofi hip hop, jazz, ambient & more. No interruptions, just music.", "Radio");

  // Categories
  let categories = [];
  try {
    categories = JSON.parse(readFileSync(join(ROOT, "public", "stations.json"), "utf-8")).categories || [];
  } catch (e) { console.error("❌ stations:", e.message); return; }

  const slugs = {
    Lofi: "lofi", Jazz: "jazz", "Rap/Hip Hop": "rap-hip-hop", Nature: "nature",
    Synthwave: "synthwave", House: "house", Meditation: "meditation",
    "Drum & Bass": "drum-bass", Techno: "techno", Reggaeton: "reggaeton",
  };
  const descs = {
    lofi: "Chill lofi hip hop beats for studying, focus, and relaxation.",
    jazz: "Smooth jazz and instrumental music for a cozy atmosphere.",
    "rap-hip-hop": "The best hip hop and rap stations streaming 24/7.",
    nature: "Relaxing nature sounds — rain, forest, ocean, and more.",
    synthwave: "Retro synthwave and electronic vibes from the 80s.",
    house: "Deep house, chill house, and electronic beats.",
    meditation: "Calm meditation music and sounds for mindfulness.",
    "drum-bass": "High-energy drum and bass stations for motivation.",
    techno: "Pumping techno beats for late-night sessions.",
    reggaeton: "Latin rhythms and reggaeton hits for the party mood.",
  };

  for (const cat of categories) {
    const slug = slugs[cat.name] || cat.name.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-").replace(/&/g, "");
    const desc = descs[slug] || `Listen to ${cat.name} music 24/7, ad-free.`;
    generateOg(`stations-${slug}.png`, `${cat.name} Radio — 24/7 Free Online`, desc, `${cat.stations.length} stations · ${cat.name}`);
  }

  console.log(`\n🎉 Done! ${1 + categories.length} OG images → public/og/`);
}

main();
