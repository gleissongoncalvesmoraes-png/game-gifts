#!/usr/bin/env node

// Real-source snapshot runner for Match Masters. The server-side collector in
// server.js uses the same source registry and identity rules. This script is
// also useful for producing the checked-in static feed used by GitHub Pages.
import { mkdir, writeFile } from "node:fs/promises";

const SOURCES = [
  { name: "Match Masters · site oficial", url: "https://matchmasters.com/", kind: "official", priority: 100 },
  { name: "Match Masters · Masters Market oficial", url: "https://matchmasters.com/portal/masters-market", kind: "official", priority: 100 },
  { name: "Candivore · suporte oficial / presentes", url: "https://candivore.zendesk.com/hc/en-us/articles/360019862199-Get-Free-Prizes", kind: "official", priority: 100 },
  { name: "Candivore · Reward Keys oficial", url: "https://candivore.zendesk.com/hc/en-us/articles/9627784625946-Reward-Keys", kind: "official", priority: 100 },
  { name: "Candivore · página oficial do jogo", url: "https://www.candivore.com/games/match-masters", kind: "official", priority: 95 },
  { name: "Destructoid · descoberta", url: "https://www.destructoid.com/match-masters-free-gifts-boosters-and-coins-links/", kind: "external_discovery", priority: 70 },
  { name: "Rezor Tricks · descoberta", url: "https://rezortricks.com/match-masters-free-daily-gifts/", kind: "external_discovery", priority: 70 },
  { name: "GamersDunia · descoberta", url: "https://gamersdunia.com/match-masters-free-gifts/", kind: "external_discovery", priority: 70 },
  { name: "Pocket Tactics · descoberta", url: "https://www.pockettactics.com/match-masters/free", kind: "external_discovery", priority: 70 },
  { name: "TalkAndroid · descoberta", url: "https://www.talkandroid.com/451270-match-masters-free-gifts-coins/", kind: "external_discovery", priority: 70 },
  { name: "NG+ · descoberta", url: "https://ngplus.com.br/bonus/match-masters/", kind: "external_discovery", priority: 70 },
  { name: "Alucare · descoberta", url: "https://www.alucare.fr/en/match-masters-cadeaux-quotidiens-gratuits/", kind: "external_discovery", priority: 70 },
  { name: "Telegram Match Masters Gifts · descoberta", url: "https://t.me/s/matchmastersfreegiftsdaily", kind: "external_discovery", priority: 65 },
];

const now = () => new Date().toISOString();
const clean = (value) => String(value || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/\s+/g, " ").trim();
const validUrl = (value) => { try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch { return false; } };
const normalize = (value) => {
  try {
    const url = new URL(String(value).trim());
    url.hash = "";
    url.hostname = url.hostname.toLowerCase();
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, "");
    url.searchParams.sort();
    return url.toString();
  } catch { return ""; }
};
const canonical = (value) => {
  try {
    const url = new URL(String(value || ""));
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "launch.matchmasters.com" && /^\/l\/p\//i.test(url.pathname)) {
      const code = decodeURIComponent(url.pathname.split("/")[3] || "");
      return /^[A-Za-z0-9_-]{6,64}$/.test(code) ? `https://launch.matchmasters.com/l/p/${encodeURIComponent(code)}` : "";
    }
    if (host === "launch.matchmasters.com" && /^\/l\/send\//i.test(url.pathname)) return url.toString();
    if (["matchmasters.onelink.me", "matchmaster.oneliuk.me", "matchmasters.com"].includes(host)) {
      const code = url.searchParams.get("c") || url.searchParams.get("pcode") || url.searchParams.get("reward_code") || "";
      if (/^[A-Za-z0-9_-]{6,64}$/.test(code)) return `https://launch.matchmasters.com/l/p/${encodeURIComponent(code)}`;
      if (url.searchParams.get("pcode")) return url.toString();
    }
  } catch {}
  return "";
};
const isRewardUrl = (value) => {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "launch.matchmasters.com") return /^\/l\/(?:p|send)\/[A-Za-z0-9_-]+/i.test(url.pathname);
    return ["matchmasters.onelink.me", "matchmaster.oneliuk.me", "matchmasters.com"].includes(host) && Boolean(url.searchParams.get("c") || url.searchParams.get("pcode") || url.searchParams.get("reward_code"));
  } catch { return false; }
};
const dateKey = (value) => {
  const text = clean(value).replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, "$1");
  const iso = text.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  if (iso) return iso[1];
  const match = text.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\s+\d{1,2}(?:,?\s+20\d{2})?\b/i);
  if (!match) return "";
  const parsed = new Date(`${match[0]}, ${new Date().getUTCFullYear()}`);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
};
const isRecent = (value) => {
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(String(value || ""))) return true;
  const age = Date.now() - Date.parse(`${value}T12:00:00Z`);
  return age >= -24 * 60 * 60 * 1000 && age <= 7 * 24 * 60 * 60 * 1000;
};
const rewardInfo = (value) => {
  const text = clean(value);
  const kinds = "tokens?|fichas?|boosters?|sticker[s]?|adesivos?|perks?|coins?|moedas?|spin[s]?|giros?|emote[s]?|gift[s]?|presentes?|recompensa[s]?";
  const amount = text.match(new RegExp(`\\b(\\d[\\d,.]*)\\s*(?:free\\s+|gr[aá]tis\\s+)?(${kinds})\\b`, "i"));
  const kind = amount?.[2] || text.match(new RegExp(`\\b(${kinds})\\b`, "i"))?.[1] || "";
  const lower = kind.toLowerCase();
  // Generic “gift/reward/present” is not an identified prize type.
  const type = /token|ficha/.test(lower) ? "tokens" : /booster/.test(lower) ? "boosters" : /sticker|adesivo/.test(lower) ? "stickers" : /perk/.test(lower) ? "perks" : /coin|moeda/.test(lower) ? "coins" : /spin|giro/.test(lower) ? "spins" : /emote/.test(lower) ? "emotes" : "";
  const possibleAmount = amount?.[1] || "";
  return { type, amount: /^(?:19|20)\d{2}$/.test(possibleAmount) ? "" : possibleAmount };
};
const sourceContext = (html, index, anchorText) => {
  const before = html.slice(0, index);
  const starts = [before.lastIndexOf("<li"), before.lastIndexOf("<article"), before.lastIndexOf("<p"), before.lastIndexOf("<div")].filter((item) => item >= 0);
  const start = Math.max(-1, ...starts);
  const end = html.indexOf("</li>", index) >= 0 ? html.indexOf("</li>", index) + 5 : Math.min(html.length, index + 1200);
  const headingMatches = [...before.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)];
  const heading = headingMatches.at(-1)?.[1] || "";
  return clean(`${heading} ${start >= 0 ? html.slice(start, end) : html.slice(Math.max(0, index - 900), end)} ${anchorText}`);
};
const extract = (html, source) => {
  const found = new Map();
  const add = (href, label, index, image = "") => {
    let url = "";
    try { url = /^https?:\/\//i.test(href) ? href : new URL(href, source.url).toString(); } catch { return; }
    if (!isRewardUrl(url) || normalize(url) === normalize(source.url)) return;
    const context = sourceContext(html, index, label);
    const info = rewardInfo(context);
    const sourceDate = dateKey(context);
    if (!isRecent(sourceDate)) return;
    const identity = normalize(url);
    if (!identity || found.has(identity)) return;
    found.set(identity, { url, final_url: canonical(url) || url, reward_key: `url:${identity}`, reward_type: info.type, amount: info.amount, image, source_excerpt: context.slice(0, 1200), source_date: sourceDate });
  };
  const anchors = /<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchors.exec(html))) {
    const image = match[3].match(/<img\b[^>]*src\s*=\s*(["'])(.*?)\1/i)?.[2] || "";
    let absoluteImage = "";
    try { absoluteImage = image ? new URL(image, source.url).toString() : ""; } catch {}
    add(match[2].replace(/&amp;/gi, "&"), match[3], match.index, absoluteImage);
  }
  const rawUrls = html.replace(/\\\//g, "/").replace(/\\u0026/gi, "&").match(/https?:\/\/[^\s"'<>\\]+/gi) || [];
  for (const value of rawUrls) {
    const url = value.replace(/[),.;]+$/, "");
    add(url, html.slice(Math.max(0, html.indexOf(value) - 700), html.indexOf(value) + value.length + 500), Math.max(0, html.indexOf(value)));
  }
  return [...found.values()];
};
const fetchText = async (url) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(url, { redirect: "follow", signal: controller.signal, headers: { accept: "text/html,application/xhtml+xml,text/plain;q=0.9", "user-agent": "GameGiftsMatchMastersMonitor/2.0" } });
    const body = await response.text();
    return { ok: response.ok, status: response.status, body, final_url: response.url || url };
  } finally { clearTimeout(timer); }
};
const verify = async (candidate, source) => {
  try {
    const response = await fetch(candidate.url, { redirect: "manual", signal: AbortSignal.timeout(12000), headers: { accept: "text/html,application/xhtml+xml,text/plain;q=0.9", "user-agent": "GameGiftsMatchMastersMonitor/2.0" } });
    const body = response.headers.get("content-type")?.includes("text") ? (await response.text()).slice(0, 120000) : "";
    if (/\b(?:expired|invalid|no longer available|not found|unavailable|link expired|page not found)\b/i.test(body)) return { status: "EXPIRED", reason: "O destino indicou explicitamente que a recompensa expirou ou está indisponível." };
    const explicit = /(?:claim\s+now|collect\s+now|daily\s+reward|reward\s+keys|free\s+(?:gift|prize)|get\s+your\s+reward|resgatar|recompensa\s+di[aá]ria)/i.test(body);
    if (source.kind === "official" && explicit) return { status: "ACTIVE", reason: "Destino oficial apresentou evidência explícita de recompensa disponível." };
    return { status: "UNCONFIRMED", reason: response.ok ? "Resposta recebida, mas HTTP 200/redirecionamento não prova que o prêmio funciona." : `HTTP ${response.status}; não prova expiração por si só.` };
  } catch (error) {
    return { status: "UNCONFIRMED", reason: `Destino não respondeu: ${String(error?.message || error).slice(0, 180)}` };
  }
};

const run = async () => {
  const startedAt = now();
  const sourceRuns = [];
  const all = new Map();
  for (const source of SOURCES) {
    const run = { source: source.name, url: source.url, kind: source.kind, checked_at: now(), candidates: 0, accepted: 0, published: 0, pending: 0, unconfirmed: 0, expired: 0, rejected: 0, error: "", links: [] };
    try {
      const fetched = await fetchText(source.url);
      run.http_status = fetched.status;
      if (!fetched.ok) throw new Error(`HTTP ${fetched.status}`);
      const candidates = extract(fetched.body, source);
      run.candidates = candidates.length;
      // Source fetches stay isolated and sequential; candidate checks within
      // one source are independent and can run together without losing any.
      const verifiedCandidates = await Promise.all(candidates.map(async (candidate) => ({ candidate, verified: await verify(candidate, source) })));
      for (const { candidate, verified } of verifiedCandidates) {
        const key = candidate.reward_key;
        const existing = all.get(key);
        if (!existing) {
          const record = {
            game: "match-masters",
            reward_type: candidate.reward_type || "",
            amount: candidate.amount || "",
            image: candidate.image || "",
            url: candidate.url,
            original_url: candidate.url,
            final_url: candidate.final_url,
            code: "",
            found_at: startedAt,
            verified_at: now(),
            sources: [source.name],
            source_urls: [source.url],
            source_kind: source.kind,
            reward_key: key,
            status: verified.status,
            publication_status: verified.status === "ACTIVE" && source.kind === "official" ? "published" : "pending",
            source_excerpt: candidate.source_excerpt,
            source_date: candidate.source_date,
            quantity_confirmed: Boolean(candidate.amount && verified.status === "ACTIVE"),
            verification_reason: verified.reason,
          };
          all.set(key, record);
        } else {
          if (!existing.sources.includes(source.name)) existing.sources.push(source.name);
          if (!existing.source_urls.includes(source.url)) existing.source_urls.push(source.url);
          if (!existing.reward_type && candidate.reward_type) existing.reward_type = candidate.reward_type;
          if (!existing.amount && candidate.amount && existing.reward_type === candidate.reward_type) existing.amount = candidate.amount;
          if (!existing.image && candidate.image) existing.image = candidate.image;
          if (verified.status === "EXPIRED") existing.status = "EXPIRED";
          else if (verified.status === "ACTIVE" && source.kind === "official") {
            existing.status = "ACTIVE";
            existing.publication_status = "published";
          }
        }
        const finalStatus = all.get(key).status;
        run.accepted++;
        if (finalStatus === "EXPIRED") run.expired++;
        else if (finalStatus === "UNCONFIRMED") { run.unconfirmed++; run.pending++; }
        else if (all.get(key).publication_status === "published") run.published++;
        run.links.push({ url: candidate.url, reward_key: key, status: verified.status, reason: verified.reason });
      }
    } catch (error) {
      run.error = String(error?.message || error).slice(0, 500);
    }
    sourceRuns.push(run);
  }
  const rewards = [...all.values()].sort((a, b) => new Date(b.found_at) - new Date(a.found_at));
  const publishedRewards = rewards.filter((reward) => reward.publication_status === "published");
  const summary = {
    started_at: startedAt,
    finished_at: now(),
    sources_consulted: SOURCES.length,
    sources_responded: sourceRuns.filter((source) => !source.error).length,
    candidate_links: sourceRuns.reduce((sum, source) => sum + source.candidates, 0),
    unique_links: rewards.length,
    active: publishedRewards.length,
    published: publishedRewards.length,
    pending: rewards.filter((reward) => reward.publication_status !== "published" && reward.status === "UNCONFIRMED").length,
    unconfirmed: rewards.filter((reward) => reward.status === "UNCONFIRMED").length,
    expired: rewards.filter((reward) => reward.status === "EXPIRED").length,
    rejected: sourceRuns.reduce((sum, source) => sum + source.rejected, 0),
    sources: sourceRuns,
  };
  await mkdir("data", { recursive: true });
  await writeFile("data/rewards.json", JSON.stringify({ updated_at: summary.finished_at, rewards: publishedRewards }, null, 2) + "\n");
  await writeFile("data/match-masters-candidates.json", JSON.stringify({ updated_at: summary.finished_at, candidates: rewards }, null, 2) + "\n");
  const rewardReport = rewards.map((reward) => {
    const prize = reward.amount ? `${reward.amount} ${reward.reward_type}` : reward.reward_type || "Recompensa não identificada";
    return `${prize} | ${reward.url} | ${reward.sources.join(", ")} | ${reward.status}`;
  });
  await writeFile("data/match-masters-rewards-report.txt", [
    "PRÊMIO | URL COMPLETA | FONTE(S) | STATUS",
    ...rewardReport,
    "",
  ].join("\n"));
  const lines = [
    `EXECUÇÃO: ${summary.started_at} → ${summary.finished_at}`,
    `FONTES CONSULTADAS: ${summary.sources_consulted}`,
    `FONTES QUE RESPONDERAM: ${summary.sources_responded}`,
    `TOTAL DE LINKS CANDIDATOS: ${summary.candidate_links}`,
    `LINKS ÚNICOS: ${summary.unique_links}`,
    `PUBLICADOS: ${summary.published}`,
    `PENDENTES / NÃO CONFIRMADOS: ${summary.pending}`,
    `UNCONFIRMED: ${summary.unconfirmed}`,
    `EXPIRED: ${summary.expired}`,
    `REJEITADOS: ${summary.rejected}`,
    "",
    ...sourceRuns.flatMap((source) => [
      `FONTE: ${source.source}`,
      `HORÁRIO: ${source.checked_at}`,
      `CANDIDATOS ENCONTRADOS: ${source.candidates}`,
      `ACEITOS: ${source.accepted}`,
      `PUBLICADOS: ${source.published}`,
      `PENDENTES: ${source.pending}`,
      `UNCONFIRMED: ${source.unconfirmed}`,
      `EXPIRADOS: ${source.expired}`,
      `REJEITADOS: ${source.rejected}`,
      `MOTIVO: ${source.error || "Nenhum erro de fonte."}`,
      "",
    ]),
  ];
  await writeFile("data/match-masters-monitor.log", lines.join("\n"));
  console.log(JSON.stringify({ ...summary, rewards }, null, 2));
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
