import { readFileSync } from "fs";

const STATIONS_PATH = "./lofi-radio/public/stations.json";

const stations = JSON.parse(readFileSync(STATIONS_PATH, "utf-8"));

async function checkVideo(videoId) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (res.ok) {
      const data = await res.json();
      return { status: "ok", title: data.title, author: data.author_name };
    }
    return { status: "dead", code: res.status };
  } catch (e) {
    return { status: "error", message: e.message };
  }
}

console.log("🔍 Revisando streams de YouTube...\n");

const results = [];
for (const cat of stations.categories) {
  console.log(`📻 ${cat.name}`);
  for (const s of cat.stations) {
    const r = await checkVideo(s.videoId);
    const icon = r.status === "ok" ? "✅" : "❌";
    const info = r.status === "ok" ? `  → "${r.title}" (${r.author})` : `  → ${r.code || r.message}`;
    console.log(`  ${icon} ${s.name.padEnd(22)} ${s.videoId}${info}`);
    results.push({ category: cat.name, name: s.name, videoId: s.videoId, ...r });
  }
  console.log();
}

const dead = results.filter((r) => r.status !== "ok");
const alive = results.filter((r) => r.status === "ok");

console.log(`\n📊 Resumen: ${alive.length} vivos / ${dead.length} caídos de ${results.length} total`);

if (dead.length > 0) {
  console.log("\n❌ CAÍDOS:");
  dead.forEach((d) => console.log(`   ${d.category} → ${d.name} (${d.videoId})`));
}
