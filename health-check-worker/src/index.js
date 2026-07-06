/**
 * Health Check Worker for Lofi Radio
 * Runs every 12 hours via Cron trigger.
 * Checks all YouTube videoIds and sends Telegram alerts for dead streams.
 *
 * Setup:
 * 1. Create a Telegram bot via @BotFather → get BOT_TOKEN
 * 2. Message your bot, then visit: https://api.telegram.org/bot<TOKEN>/getUpdates → get CHAT_ID
 * 3. wrangler secret put TELEGRAM_BOT_TOKEN
 * 4. wrangler secret put TELEGRAM_CHAT_ID
 * 5. wrangler secret put SITE_URL  (e.g. https://lofi-radio.pages.dev)
 */

import stationsData from "./stations.json" with { type: "json" };

const YT_OEMBED = "https://www.youtube.com/oembed";

async function checkVideo(videoId) {
  const url = `${YT_OEMBED}?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendTelegramAlert(env, dead) {
  const list = dead
    .map((d) => `❌ ${d.category} → ${d.name}\n   https://www.youtube.com/watch?v=${d.videoId}`)
    .join("\n\n");

  const msg = `🔴 Lofi Radio Alert — ${dead.length} stream(s) caído(s):\n\n${list}`;

  const apiUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: msg,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}

async function checkAllStations(env) {
  // Try fetching fresh stations.json from the live site first
  let stations = stationsData; // embedded fallback
  if (env.SITE_URL) {
    try {
      const res = await fetch(`${env.SITE_URL}/stations.json`);
      if (res.ok) {
        stations = await res.json();
      }
    } catch {
      // Use embedded fallback
    }
  }

  let total = 0;
  const dead = [];

  for (const cat of stations.categories) {
    for (const s of cat.stations) {
      total++;
      const ok = await checkVideo(s.videoId);
      if (!ok) {
        dead.push({ category: cat.name, name: s.name, videoId: s.videoId });
      }
    }
  }

  return { total, alive: total - dead.length, dead };
}

export default {
  // Cron trigger: runs every 12 hours
  async scheduled(_event, env, _ctx) {
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID secrets");
      return;
    }

    const result = await checkAllStations(env);

    if (result.dead.length > 0) {
      await sendTelegramAlert(env, result.dead);
      console.log(`Alert sent: ${result.dead.length} dead streams`);
    } else {
      console.log(`All ${result.total} streams healthy`);
    }
  },

  // HTTP trigger for manual testing
  async fetch(request, env) {
    const result = await checkAllStations(env);
    return new Response(JSON.stringify(result, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
