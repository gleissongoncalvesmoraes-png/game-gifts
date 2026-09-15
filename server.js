export const schema = `
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image TEXT NOT NULL DEFAULT '',
    banner TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    reward_mode TEXT NOT NULL DEFAULT 'links',
    active INTEGER NOT NULL DEFAULT 1,
    user_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT '',
    quantity TEXT NOT NULL DEFAULT '',
    reward_type TEXT NOT NULL DEFAULT '',
    reward_amount TEXT NOT NULL DEFAULT '',
    reward_description TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT '',
    date_key TEXT NOT NULL,
    time_label TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'unconfirmed',
    user_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TEXT,
    original_url TEXT NOT NULL DEFAULT '',
    normalized_url TEXT NOT NULL DEFAULT '',
    source_id INTEGER,
    source_excerpt TEXT NOT NULL DEFAULT '',
    found_at TEXT,
    last_checked_at TEXT,
    link_status TEXT NOT NULL DEFAULT 'active',
    reward_status TEXT NOT NULL DEFAULT 'unknown',
    reward_code TEXT NOT NULL DEFAULT '',
    reward_key TEXT NOT NULL DEFAULT '',
    final_url TEXT NOT NULL DEFAULT '',
    redemption_url TEXT NOT NULL DEFAULT '',
    image_source TEXT NOT NULL DEFAULT '',
    expiry_reason TEXT NOT NULL DEFAULT '',
    expired_at TEXT,
    FOREIGN KEY (game_id) REFERENCES games(id)
  );
  CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    parser_type TEXT NOT NULL DEFAULT 'html_links',
    last_checked_at TEXT,
    last_success_at TEXT,
    last_error TEXT,
    user_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id)
  );
  CREATE TABLE IF NOT EXISTS collection_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TEXT NOT NULL,
    finished_at TEXT NOT NULL,
    source_id INTEGER,
    http_status INTEGER,
    links_found INTEGER NOT NULL DEFAULT 0,
    new_links_saved INTEGER NOT NULL DEFAULT 0,
    duplicates_ignored INTEGER NOT NULL DEFAULT 0,
    error TEXT,
    FOREIGN KEY (source_id) REFERENCES sources(id)
  );
  CREATE INDEX IF NOT EXISTS rewards_game_date ON rewards (game_id, date_key);
  CREATE INDEX IF NOT EXISTS rewards_status ON rewards (status);
  CREATE INDEX IF NOT EXISTS rewards_normalized_url ON rewards (normalized_url);
  CREATE INDEX IF NOT EXISTS sources_game ON sources (game_id, active);
  CREATE INDEX IF NOT EXISTS collection_logs_source ON collection_logs (source_id, started_at);
  CREATE TABLE IF NOT EXISTS reward_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reward_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    vote TEXT NOT NULL CHECK (vote IN ('worked', 'failed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (reward_id, user_id),
    UNIQUE (game_id, user_id)
  );
  CREATE INDEX IF NOT EXISTS reward_votes_reward ON reward_votes (reward_id);
  INSERT OR IGNORE INTO games (name, slug, description, active) VALUES
    ('Match Masters', 'match-masters', 'Competição rápida, desafios e recompensas para colecionar.', 1),
    ('Dice Dreams', 'dice-dreams', 'Giros, construções e presentes para a sua próxima aventura.', 1),
    ('Coin Master', 'coin-master', 'Gire, construa e encontre novos links para sua vila.', 1);
`;

const catalogSources = [
  ['Match Masters', 'https://mosttechs.com/match-masters-free-boosters/'],
  ['Match Masters', 'https://mobilegamecentral.com/freebies/match-masters-freebies-links-updated-daily/'],
  ['Match Masters', 'https://rezortricks.com/match-masters-free-daily-gifts/'],
  ['Match Masters', 'https://rewavio.com/blog/match-masters'],
  ['Match Masters', 'https://gamexlite.com/match-masters-free-coins-boosters-gifts-links/'],
  ['Match Masters', 'https://www.pockettactics.com/match-masters/free'],
  ['Match Masters', 'https://matchmasterscoin.com/'],
  ['Match Masters', 'https://giveaway48.de/match-masters-reward-links/'],
  ['Dice Dreams', 'https://mobilegamecentral.com/freebies/free-dice-dreams-rolls-links-updated-daily/'],
  ['Coin Master', 'https://mobilegamecentral.com/freebies/free-coin-master-spins-links-updated-daily/'],
  ['Coin Master', 'https://www.pockettactics.com/coin-master/free-spins'],
  ['Monopoly GO!', 'https://mobilegamecentral.com/freebies/free-monopoly-go-dice/'],
  ['Animals & Coins', 'https://mobilegamecentral.com/freebies/free-animals-coins-energy-updated-daily/'],
  ['Family Island', 'https://mobilegamecentral.com/freebies/free-family-island-energy-links-updated-daily/'],
  ['Bingo Blitz', 'https://rewavio.com/blog/bingo-blitz'],
  ['Solitaire Grand Harvest', 'https://mobilegamecentral.com/freebies/free-solitaire-grand-harvest-coins-links-updated-daily/'],
  ['Board Kings', 'https://mobilegamecentral.com/freebies/free-board-kings-rolls-links-updated-daily/'],
  ['Gossip Harbor', 'https://mobilegamecentral.com/freebies/free-gossip-harbor-energy-links-updated-daily/'],
  ['Seaside Escape', 'https://mobilegamecentral.com/freebies/free-seaside-escape-energy-links-updated-daily/'],
  ['Travel Town', 'https://mobilegamecentral.com/freebies/free-travel-town-energy-links-updated-daily/'],
  ['Travel Town', 'https://traveltowncard.com/pt/blog/how-to-get-travel-town-free-energy', 'travel_town_card'],
  ['Travel Town', 'https://traveltowncard.com/blog/how-to-get-travel-town-free-energy', 'travel_town_card'],
];

const catalogLinks = [
  ['Match Masters', 'https://launch.matchmasters.com/l/p/-9Wty1EuYyM', 'Super Lucky Spin', '', '', '/uploads/Screenshot_20260914-234505.png', 'Roleta Super Lucky Spin exibida no jogo; o prêmio final depende do resultado.'],
  ['Dice Dreams', 'https://rewards-v2.dicedreams.com/?handler=reward&link=Community271025', 'Link de recompensa', '', '', '', ''],
  ['Coin Master', 'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_CHATBCLrLbw_20260827', 'Link de recompensa', '', '', '', ''],
];
const MATCH_MASTERS_REWARD_KEY_PROOF_IMAGE = '/uploads/Screenshot_20260914-234146.png';
const MATCH_MASTERS_REWARD_KEY_PROOF = 'GG_MANUAL:confirmed-reward-key — Teste manual: o Reward Key Treasure foi coletado com sucesso no Match Masters.';
// Reported by the owner after opening the link in Coin Master. The web page
// only redirects to the app, so the in-game expiry screen is not observable
// from a server-side HTTP check.
const COIN_MASTER_USER_REPORTED_EXPIRED_URL = 'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_HELPwOQqrt_20260914';
const MONOPOLY_GO_PROBLEM_URL = 'https://mply.io/9Mp_nQMDAOw';
const MONOPOLY_GO_ALTERNATIVE_URL = 'https://mply.io/U0qK7as-Fjw';
const MONOPOLY_GO_PROBLEM_REASON = 'O LINK DE 60 DADOS DO MONOPOLY GO FOI TESTADO E FALHOU. Ao clicar em “ABRIR NO JOGO”, o endereço mply.io abriu uma tela preta no navegador e não abriu o jogo nem entregou recompensa. LINK COM PROBLEMA / NÃO CONFIRMADO.';

const recoveredGameImages = {
  'match-masters': '/uploads/file_00000000f940820ea01aaadff3c7df3f.png',
  'monopoly-go': '/uploads/file_00000000ef9c820e8fb9420f35ff24fe.png',
  'coin-master': '/uploads/file_0000000037b4820e8c10b3944507b647.png',
  'dice-dreams': '/uploads/file_000000003ac0820eadfbf26969ac6696.png',
  'animals-and-coins': '/uploads/file_000000004e54820e93eb148e318275d9.png',
  'bingo-blitz': '/uploads/file_000000003720820e9ce4d36eb34a5f9f-2.png',
  'travel-town': '/uploads/file_000000003230820eb2ec324ed61264ac.png',
  'family-island': '/uploads/file_000000006c3c820e8473c8451f119bd6.png',
  'gossip-harbor': '/uploads/file_0000000006dc820ea058c6bef13ceba9.png',
  'seaside-escape': '/uploads/file_00000000c0f0820e8d1fe6ea7271e5cd.png',
  'stumble-guys': '/assets/logos/stumble-guys.svg',
  'lords-mobile': '/assets/logos/lords-mobile.svg',
  'clash-of-clans': '/assets/logos/clash-of-clans.svg',
  'crazy-fox': '/assets/logos/crazy-fox.svg',
  'roblox': '/assets/logos/roblox.svg',
  'free-fire': '/assets/logos/free-fire.svg',
};
const targetCatalog = [
  ['Match Masters', 'match-masters', 'Competição rápida, desafios e recompensas para colecionar.', 'links', recoveredGameImages['match-masters']],
  ['Monopoly GO!', 'monopoly-go', 'Dados grátis e links públicos de recompensa para sua próxima partida.', 'links', recoveredGameImages['monopoly-go']],
  ['Dice Dreams', 'dice-dreams', 'Giros, construções e presentes para a sua próxima aventura.', 'links', recoveredGameImages['dice-dreams']],
  ['Animals & Coins', 'animals-and-coins', 'Energia grátis e recompensas públicas para sua ilha.', 'links', recoveredGameImages['animals-and-coins']],
  ['Family Island', 'family-island', 'Energia e rubis em links públicos de recompensa.', 'links', recoveredGameImages['family-island']],
  ['Travel Town', 'travel-town', 'Energia grátis e links públicos de recompensa atualizados.', 'links', recoveredGameImages['travel-town']],
  ['Gossip Harbor', 'gossip-harbor', 'Energia grátis e links públicos para continuar sua história.', 'links', recoveredGameImages['gossip-harbor']],
  ['Bingo Blitz', 'bingo-blitz', 'Créditos e moedas em links públicos de recompensa.', 'links', recoveredGameImages['bingo-blitz']],
  ['Crazy Fox', 'crazy-fox', 'Recompensas públicas para suas próximas partidas.', 'links', recoveredGameImages['crazy-fox']],
  ['Coin Master', 'coin-master', 'Gire, construa e encontre novos links para sua vila.', 'links', recoveredGameImages['coin-master']],
  ['Roblox', 'roblox', 'Experiências, novidades e presentes públicos para jogar mais.', 'links', recoveredGameImages['roblox']],
  ['Free Fire', 'free-fire', 'Eventos e recompensas públicas para suas partidas.', 'links', recoveredGameImages['free-fire']],
  ['Stumble Guys', 'stumble-guys', 'Eventos e recompensas públicas para suas próximas partidas.', 'links', recoveredGameImages['stumble-guys']],
  ['Lords Mobile', 'lords-mobile', 'Presentes e recompensas públicas para seu reino.', 'links', recoveredGameImages['lords-mobile']],
  ['Clash of Clans', 'clash-of-clans', 'Recompensas e novidades públicas para sua aldeia.', 'links', recoveredGameImages['clash-of-clans']],
  ['Solitaire Grand Harvest', 'solitaire-grand-harvest', 'Moedas grátis e links públicos para sua coleção.', 'links', '/assets/logos/solitaire-grand-harvest.svg'],
  ['Board Kings', 'board-kings', 'Rolls grátis e recompensas públicas para o seu tabuleiro.', 'links', '/assets/logos/board-kings.svg'],
  ['Seaside Escape', 'seaside-escape', 'Energia grátis e recompensas públicas para sua aventura.', 'links', recoveredGameImages['seaside-escape']],
  ['Carnival Tycoon', 'carnival-tycoon', 'Eventos e recompensas públicas para sua próxima partida.', 'links', '/assets/logos/carnival-tycoon.svg'],
];
const targetSlugs = targetCatalog.map(([, slug]) => slug);
const catalogOrder = targetSlugs.map((slug, index) => `WHEN '${slug}' THEN ${index + 1}`).join(" ");

const json = (body, init) => Response.json(body, init);
const isOwner = (request) => {
  const userId = request.headers.get("x-websim-user-id");
  const ownerId = request.headers.get("x-websim-project-owner-id");
  return Boolean(userId && ownerId && userId === ownerId);
};
const ownerRequired = (request) => isOwner(request) ? null : json({ error: "Acesso restrito ao administrador do projeto." }, { status: 403 });
const asId = (value) => { const id = Number(value); return Number.isInteger(id) && id > 0 ? id : null; };
const validDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""));
const validUrl = (value) => { try { const parsed = new URL(String(value ?? "")); return parsed.protocol === "http:" || parsed.protocol === "https:"; } catch { return false; } };
const isCatalogFallbackCover = (game) => {
  const image = String(game?.image || '').trim();
  const slug = String(game?.slug || '').trim();
  return !image || image === `/assets/logos/${slug}.svg`;
};
const isCoverLocked = (game) => !isCatalogFallbackCover(game);
const canonicalStatus = (value) => {
  const status = String(value ?? "").trim().toLowerCase();
  if (status === "confirmed") return "confirmed";
  if (["expired", "invalid", "expired_invalid"].includes(status)) return "expired_invalid";
  return "unknown";
};
const publicStatus = (row) => {
  if (String(row?.link_status || '').toLowerCase() === 'expired') return 'expired_invalid';
  return canonicalStatus(row.reward_status || row.status);
};
const normalizeUrl = (value) => {
  try {
    const parsed = new URL(String(value ?? "").trim());
    parsed.hash = "";
    parsed.hostname = parsed.hostname.toLowerCase();
    if (parsed.pathname.length > 1) parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    const tracking = /^(utm_[^=]+|fbclid|gclid|dclid|msclkid|referrer|tracking|campaign|source)$/i;
    [...parsed.searchParams.keys()].forEach((key) => { if (tracking.test(key)) parsed.searchParams.delete(key); });
    parsed.searchParams.sort();
    return parsed.toString();
  } catch { return ""; }
};
const mergeSources = (current, incoming) => [...new Set(`${current || ""}\n${incoming || ""}`.split(/[\n,|]+/).map((item) => item.trim()).filter(Boolean))].join(" · ");
const nowIso = () => new Date().toISOString();
const dateParts = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return { date: "", time: "" };
  return { date: date.toISOString().slice(0, 10), time: date.toISOString().slice(11, 16) };
};
const rewardFields = (row) => {
  const originalUrl = row.original_url || row.url || "";
  const rewardStatus = publicStatus(row);
  const foundAt = row.found_at || row.created_at || "";
  const parts = dateParts(foundAt);
  return {
    ...row,
    url: originalUrl,
    original_url: originalUrl,
    normalized_url: row.normalized_url || normalizeUrl(originalUrl),
    date_key: row.date_key || parts.date,
    time_label: row.time_label || parts.time,
    found_at: foundAt,
    last_checked_at: row.last_checked_at || row.verified_at || "",
    verified_at: row.last_checked_at || row.verified_at || "",
    link_status: row.link_status || "active",
    reward_status: rewardStatus,
    status: rewardStatus === "confirmed" ? "confirmed" : rewardStatus === "expired_invalid" ? "expired_invalid" : "unconfirmed",
    reward_code: row.reward_code || "",
    reward_key: row.reward_key || "",
    final_url: row.final_url || originalUrl,
    redemption_url: row.redemption_url || (row.reward_code ? originalUrl : ""),
    image_source: row.image_source || (row.image ? "source" : ""),
    expiry_reason: row.expiry_reason || "",
    reward_type: row.reward_type || (row.type && !/^(link|reward|recompensa|presente)\b/i.test(row.type) ? row.type : ""),
    reward_amount: row.reward_amount || row.quantity || "",
    reward_description: row.reward_description || row.source_excerpt || "",
  };
};
const gameFields = (row) => ({ ...row, active: Boolean(row.active), reward_mode: ["links", "codes", "none"].includes(row.reward_mode) ? row.reward_mode : "links" });
const VOTE_COOKIE_NAME = "gg_voter_id";
const readCookie = (request, name) => {
  const cookies = String(request.headers.get("cookie") || "").split(";");
  const match = cookies.map((item) => item.trim().split("=")).find(([key]) => key === name);
  if (!match) return "";
  try { return decodeURIComponent(match.slice(1).join("=")); } catch { return ""; }
};
const voterIdentity = (request) => {
  const userId = String(request.headers.get("x-websim-user-id") || "").trim();
  if (userId) return { userId: `user:${userId}`, setCookie: "" };
  const clientVoterId = String(request.headers.get("x-game-gifts-voter-id") || "").trim();
  if (/^[a-z0-9:_-]{8,160}$/i.test(clientVoterId)) return { userId: `anon:${clientVoterId}`, setCookie: "" };
  const existing = readCookie(request, VOTE_COOKIE_NAME);
  if (/^[0-9a-f-]{20,80}$/i.test(existing)) return { userId: `anon:${existing}`, setCookie: "" };
  const token = crypto.randomUUID();
  return {
    userId: `anon:${token}`,
    setCookie: `${VOTE_COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=31536000; Path=/; SameSite=Lax; HttpOnly`,
  };
};
const jsonForVoter = (body, identity, status = 200) => {
  const init = { status };
  if (identity?.setCookie) init.headers = { "Set-Cookie": identity.setCookie };
  return json(body, init);
};
const voteStatus = (worked, failed, recentFailed) => {
  if (recentFailed >= 3 && recentFailed > worked) return "may_expired";
  if (worked >= 3 && worked > failed) return "confirmed";
  return "unconfirmed";
};
const voteSummary = async (env, rewardId, userId) => {
  const reward = await env.DB.prepare("SELECT game_id FROM rewards WHERE id = ? LIMIT 1").bind(rewardId).first();
  const [counts, mine, gameMine] = await Promise.all([
    env.DB.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN vote = 'worked' THEN 1 ELSE 0 END), 0) AS worked,
      COALESCE(SUM(CASE WHEN vote = 'failed' THEN 1 ELSE 0 END), 0) AS failed,
      COALESCE(SUM(CASE WHEN vote = 'failed' AND created_at >= datetime('now', '-30 days') THEN 1 ELSE 0 END), 0) AS recent_failed
    FROM reward_votes WHERE reward_id = ?
    `).bind(rewardId).first(),
    env.DB.prepare("SELECT vote FROM reward_votes WHERE reward_id = ? AND user_id = ? LIMIT 1").bind(rewardId, userId).first(),
    reward?.game_id ? env.DB.prepare("SELECT vote FROM reward_votes WHERE game_id = ? AND user_id = ? LIMIT 1").bind(reward.game_id, userId).first() : Promise.resolve(null),
  ]);
  const worked = Number(counts?.worked || 0);
  const failed = Number(counts?.failed || 0);
  const recentFailed = Number(counts?.recent_failed || 0);
  return { worked, failed, recent_failed: recentFailed, status: voteStatus(worked, failed, recentFailed), my_vote: mine?.vote || null, game_my_vote: gameMine?.vote || null };
};
const allVoteSummaries = async (env, userId) => {
  const [counts, mine] = await Promise.all([
    env.DB.prepare(`
      SELECT reward_id, MAX(game_id) AS game_id,
        COALESCE(SUM(CASE WHEN vote = 'worked' THEN 1 ELSE 0 END), 0) AS worked,
        COALESCE(SUM(CASE WHEN vote = 'failed' THEN 1 ELSE 0 END), 0) AS failed,
        COALESCE(SUM(CASE WHEN vote = 'failed' AND created_at >= datetime('now', '-30 days') THEN 1 ELSE 0 END), 0) AS recent_failed
      FROM reward_votes GROUP BY reward_id
    `).all(),
    env.DB.prepare("SELECT reward_id, game_id, vote FROM reward_votes WHERE user_id = ?").bind(userId).all(),
  ]);
  const mineByReward = new Map(mine.results.map((row) => [Number(row.reward_id), row.vote]));
  const mineByGame = new Map(mine.results.map((row) => [Number(row.game_id), row.vote]));
  const byReward = new Map(counts.results.map((row) => {
    const worked = Number(row.worked || 0);
    const failed = Number(row.failed || 0);
    const recentFailed = Number(row.recent_failed || 0);
    return [Number(row.reward_id), { worked, failed, recent_failed: recentFailed, status: voteStatus(worked, failed, recentFailed), my_vote: mineByReward.get(Number(row.reward_id)) || null, game_my_vote: mineByGame.get(Number(row.game_id)) || null }];
  }));
  return { byReward, byGame: mineByGame };
};

let schemaReady = false;
async function ensureDataSchema(env) {
  if (schemaReady) return;
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS reward_votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reward_id INTEGER NOT NULL,
    game_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    vote TEXT NOT NULL CHECK (vote IN ('worked', 'failed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (reward_id, user_id),
    UNIQUE (game_id, user_id)
  )`).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS reward_votes_reward ON reward_votes (reward_id)").run();
  const existingVoteColumns = new Set((await env.DB.prepare("PRAGMA table_info(reward_votes)").all()).results.map((column) => column.name));
  if (!existingVoteColumns.has("game_id")) {
    await env.DB.prepare("ALTER TABLE reward_votes ADD COLUMN game_id INTEGER").run();
  }
  await env.DB.prepare("UPDATE reward_votes SET game_id = (SELECT game_id FROM rewards WHERE rewards.id = reward_votes.reward_id) WHERE game_id IS NULL").run();
  await env.DB.prepare("DELETE FROM reward_votes WHERE game_id IS NOT NULL AND id NOT IN (SELECT MIN(id) FROM reward_votes WHERE game_id IS NOT NULL GROUP BY game_id, user_id)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS reward_votes_game ON reward_votes (game_id)").run();
  await env.DB.prepare("CREATE UNIQUE INDEX IF NOT EXISTS reward_votes_game_user ON reward_votes (game_id, user_id)").run();
  const existingRewardColumns = new Set((await env.DB.prepare("PRAGMA table_info(rewards)").all()).results.map((column) => column.name));
  const existingGameColumns = new Set((await env.DB.prepare("PRAGMA table_info(games)").all()).results.map((column) => column.name));
  const migrations = [
    ["original_url", "TEXT NOT NULL DEFAULT ''"],
    ["normalized_url", "TEXT NOT NULL DEFAULT ''"],
    ["source_id", "INTEGER"],
    ["source_excerpt", "TEXT NOT NULL DEFAULT ''"],
    ["found_at", "TEXT"],
    ["last_checked_at", "TEXT"],
    ["link_status", "TEXT NOT NULL DEFAULT 'active'"],
    ["reward_status", "TEXT NOT NULL DEFAULT 'unknown'"],
    ["reward_code", "TEXT NOT NULL DEFAULT ''"],
    ["reward_type", "TEXT NOT NULL DEFAULT ''"],
    ["reward_amount", "TEXT NOT NULL DEFAULT ''"],
    ["reward_description", "TEXT NOT NULL DEFAULT ''"],
    ["reward_key", "TEXT NOT NULL DEFAULT ''"],
    ["final_url", "TEXT NOT NULL DEFAULT ''"],
    ["redemption_url", "TEXT NOT NULL DEFAULT ''"],
    ["image_source", "TEXT NOT NULL DEFAULT ''"],
    ["expiry_reason", "TEXT NOT NULL DEFAULT ''"],
    ["expired_at", "TEXT"],
  ];
  for (const [column, definition] of migrations) {
    if (existingRewardColumns.has(column)) continue;
    try { await env.DB.prepare(`ALTER TABLE rewards ADD COLUMN ${column} ${definition}`).run(); }
    catch (error) { console.error(`Migration rewards.${column} failed`, error); throw new Error(`A migração do banco não conseguiu criar rewards.${column}.`); }
  }
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS rewards_reward_key ON rewards (reward_key)").run();
  if (!existingGameColumns.has("reward_mode")) {
    try { await env.DB.prepare("ALTER TABLE games ADD COLUMN reward_mode TEXT NOT NULL DEFAULT 'links'").run(); }
    catch (error) { console.error("Migration games.reward_mode failed", error); throw new Error("A migração do banco não conseguiu criar games.reward_mode."); }
  }
  const rows = await env.DB.prepare("SELECT id, game_id, url, original_url, normalized_url, status, reward_status, reward_code, reward_key, final_url, redemption_url, link_status, created_at, verified_at, found_at, last_checked_at, name, type, quantity, reward_type, reward_amount, reward_description, source_excerpt, source FROM rewards").all();
  const migrationStatements = [];
  for (const row of rows.results) {
    const originalUrl = row.original_url || row.url || "";
    const normalized = row.normalized_url || normalizeUrl(originalUrl);
    const rewardStatus = canonicalStatus(row.reward_status === "unknown" ? row.status : row.reward_status);
    const foundAt = row.found_at || row.created_at || nowIso();
    const checkedAt = row.last_checked_at || row.verified_at || row.created_at || foundAt;
    const parts = dateParts(foundAt);
    const finalUrl = row.final_url || originalUrl;
    const rewardKey = row.reward_key || (row.reward_code ? `code:${row.game_id}:${String(row.reward_code).trim().toUpperCase()}` : `url:${normalizeUrl(finalUrl) || normalized}`);
    const signal = [row.reward_description, row.source_excerpt, row.name, row.type, row.quantity].filter(Boolean).join(" – ");
    const info = extractExplicitReward(signal);
    const rewardType = row.reward_type || info.type || (/^(link|reward|recompensa|presente)\b/i.test(row.type || "") ? "" : row.type || "");
    const travelTownCardBacked = /traveltowncard\.com/i.test(String(row.source || ""));
    const rewardAmount = travelTownCardBacked ? (row.quantity || "") : (row.reward_amount || info.amount || row.quantity || "");
    const rewardDescription = row.reward_description || info.description || row.source_excerpt || "";
    migrationStatements.push(env.DB.prepare("UPDATE rewards SET original_url = ?, normalized_url = ?, final_url = ?, redemption_url = ?, reward_key = ?, found_at = ?, last_checked_at = ?, link_status = ?, reward_status = ?, status = ?, reward_type = ?, reward_amount = ?, reward_description = ?, date_key = COALESCE(NULLIF(date_key, ''), ?), time_label = COALESCE(NULLIF(time_label, ''), ?) WHERE id = ?")
      .bind(originalUrl, normalized, finalUrl, row.redemption_url || (row.reward_code ? originalUrl : ""), rewardKey, foundAt, checkedAt, row.link_status || "active", rewardStatus, rewardStatus === "confirmed" ? "confirmed" : rewardStatus === "expired_invalid" ? "expired_invalid" : "unconfirmed", rewardType, rewardAmount, rewardDescription, parts.date, parts.time, row.id));
  }
  migrationStatements.push(env.DB.prepare("UPDATE rewards SET name = '', type = '', quantity = '' WHERE lower(name) IN ('link de recompensa', 'reward link') AND (source_excerpt LIKE 'A URL foi encontrada%' OR source_excerpt LIKE 'A URL was found%')"));
  const catalogStatements = targetCatalog.map(([name, slug, description, mode, image]) => env.DB.prepare("INSERT OR IGNORE INTO games (name, slug, description, reward_mode, image, active) VALUES (?, ?, ?, ?, ?, 1)").bind(name, slug, description, mode, image));
  const targetPlaceholders = targetSlugs.map(() => "?").join(",");
  targetCatalog.forEach(([name, slug, description, mode, image]) => {
    const legacyCatalogImage = `/assets/logos/${slug}.svg`;
    catalogStatements.push(env.DB.prepare("UPDATE games SET name = ?, description = ?, reward_mode = ?, image = CASE WHEN image IS NULL OR image = '' OR image = ? THEN ? ELSE image END, active = 1, updated_at = CURRENT_TIMESTAMP WHERE slug = ?")
      .bind(name, description, mode, legacyCatalogImage, image, slug));
  });
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET link_status = 'expired', reward_status = 'expired_invalid', status = 'expired_invalid', expiry_reason = CASE WHEN expiry_reason = '' THEN ? ELSE expiry_reason END, expired_at = COALESCE(expired_at, CURRENT_TIMESTAMP) WHERE game_id IN (SELECT id FROM games WHERE slug = 'dice-dreams') AND (original_url LIKE '%rewards-v2.dicedreams.com%' OR url LIKE '%rewards-v2.dicedreams.com%') AND (status <> 'expired_invalid' OR link_status <> 'expired')")
    .bind("Link antigo do Dice Dreams marcado como expirado pela fonte atual."));
  const reportedCoinMasterUrl = normalizeUrl(COIN_MASTER_USER_REPORTED_EXPIRED_URL);
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET link_status = 'expired', reward_status = 'expired_invalid', status = 'expired_invalid', expiry_reason = ?, expired_at = COALESCE(expired_at, CURRENT_TIMESTAMP), last_checked_at = COALESCE(last_checked_at, CURRENT_TIMESTAMP) WHERE game_id IN (SELECT id FROM games WHERE slug = 'coin-master') AND (normalized_url = ? OR original_url = ? OR url = ? OR final_url = ?)")
    .bind("Oferta do Coin Master reportada como encerrada pelo proprietário ao abrir o link no jogo.", reportedCoinMasterUrl, COIN_MASTER_USER_REPORTED_EXPIRED_URL, COIN_MASTER_USER_REPORTED_EXPIRED_URL, COIN_MASTER_USER_REPORTED_EXPIRED_URL));
  catalogStatements.push(env.DB.prepare(`UPDATE sources SET active = 0 WHERE game_id IN (SELECT id FROM games WHERE slug NOT IN (${targetPlaceholders}))`).bind(...targetSlugs));
  catalogStatements.push(env.DB.prepare(`UPDATE sources SET active = 0 WHERE game_id IN (SELECT id FROM games WHERE slug IN (${targetSlugs.map(() => "?").join(",")}) )`).bind(...targetSlugs));
  catalogSources.forEach(([gameName, sourceUrl, parserType = "html_links"]) => {
    catalogStatements.push(env.DB.prepare("INSERT INTO sources (game_id, name, url, active, parser_type) SELECT id, ?, ?, 1, ? FROM games WHERE name = ? AND NOT EXISTS (SELECT 1 FROM sources WHERE game_id = games.id AND url = ?)").bind(`${gameName} · ${parserType === "html_codes" ? "códigos oficiais" : parserType === "travel_town_card" ? "Travel Town Card" : "links públicos"}`, sourceUrl, parserType, gameName, sourceUrl));
    catalogStatements.push(env.DB.prepare("UPDATE sources SET name = ? WHERE url = ? AND game_id IN (SELECT id FROM games WHERE name = ?)").bind(`${gameName} · ${parserType === "html_codes" ? "códigos oficiais" : parserType === "travel_town_card" ? "Travel Town Card" : "links públicos"}`, sourceUrl, gameName));
    catalogStatements.push(env.DB.prepare("UPDATE sources SET active = 1, last_error = NULL WHERE url = ? AND game_id IN (SELECT id FROM games WHERE name = ?)").bind(sourceUrl, gameName));
  });
  catalogStatements.push(env.DB.prepare("UPDATE sources SET active = 0 WHERE game_id IN (SELECT id FROM games WHERE slug = 'travel-town') AND instr(url, 'mobilegamecentral.com') > 0"));
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET quantity = '', reward_amount = '', reward_description = CASE WHEN reward_description = '' OR instr(lower(reward_description), '30 free energy') > 0 OR instr(lower(source_excerpt), '30 free energy') > 0 THEN 'Energia grátis encontrada em uma fonte anterior.' ELSE reward_description END WHERE game_id IN (SELECT id FROM games WHERE slug = 'travel-town') AND instr(lower(source), 'mobilegamecentral.com') > 0 AND instr(lower(source), 'traveltowncard.com') = 0"));
  const seedFoundAt = nowIso();
  const seedParts = dateParts(seedFoundAt);
  catalogLinks.forEach(([gameName, rewardUrl, rewardName, rewardType, rewardQuantity, rewardImage, rewardDescription]) => {
    const normalized = normalizeUrl(rewardUrl);
    if (!normalized) return;
    const source = catalogSources.find(([name]) => name === gameName);
    const sourceUrl = source?.[1] || "";
    catalogStatements.push(env.DB.prepare("INSERT INTO rewards (game_id, name, type, quantity, image, url, source, date_key, time_label, status, user_id, verified_at, original_url, normalized_url, source_id, source_excerpt, found_at, last_checked_at, link_status, reward_status, reward_code, reward_description) SELECT g.id, ?, ?, ?, ?, ?, ?, ?, ?, 'unconfirmed', NULL, NULL, ?, ?, s.id, ?, ?, ?, 'active', 'unknown', '', ? FROM games g LEFT JOIN sources s ON s.game_id = g.id AND s.url = ? WHERE g.name = ? AND NOT EXISTS (SELECT 1 FROM rewards WHERE normalized_url = ? AND normalized_url <> '')")
      .bind(rewardName, rewardType, rewardQuantity, rewardImage, rewardUrl, `${gameName} · links públicos · ${sourceUrl}`, seedParts.date, seedParts.time, rewardUrl, normalized, rewardDescription || 'A URL foi encontrada em uma fonte pública. O recebimento da recompensa ainda não foi confirmado.', seedFoundAt, seedFoundAt, rewardDescription || 'A URL foi encontrada em uma fonte pública. O recebimento da recompensa ainda não foi confirmado.', sourceUrl, gameName, normalized));
  });
  const firstMatchRewardUrl = normalizeUrl(catalogLinks[0][1]);
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET name = CASE WHEN name = '' OR lower(name) = 'link de recompensa' THEN ? ELSE name END, image = CASE WHEN image = '' THEN ? ELSE image END, reward_description = CASE WHEN reward_description = '' OR reward_description LIKE 'A URL foi encontrada%' THEN ? ELSE reward_description END WHERE game_id IN (SELECT id FROM games WHERE slug = 'match-masters') AND normalized_url = ?")
    .bind(catalogLinks[0][2], catalogLinks[0][5], catalogLinks[0][6], firstMatchRewardUrl));
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET name = CASE WHEN name = '' THEN 'Reward Key: Treasure' ELSE name END, type = CASE WHEN type = '' THEN 'Reward Key' ELSE type END, reward_type = CASE WHEN reward_type = '' THEN 'Reward Key' ELSE reward_type END, reward_description = ?, image = CASE WHEN image = '' THEN ? ELSE image END, image_source = CASE WHEN image_source = '' THEN 'source' ELSE image_source END, reward_status = 'confirmed', status = 'confirmed', link_status = 'active', last_checked_at = COALESCE(last_checked_at, ?) WHERE game_id IN (SELECT id FROM games WHERE slug = 'match-masters') AND reward_code = ?")
    .bind(MATCH_MASTERS_REWARD_KEY_PROOF, MATCH_MASTERS_REWARD_KEY_PROOF_IMAGE, nowIso(), 'Treasure'));
  const alternativeUrl = normalizeUrl(MONOPOLY_GO_ALTERNATIVE_URL);
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET reward_key = COALESCE(NULLIF(reward_key, ''), ?), final_url = COALESCE(NULLIF(final_url, ''), ?), reward_type = CASE WHEN reward_type = '' THEN 'dados' ELSE reward_type END, reward_amount = CASE WHEN reward_amount = '' THEN '25' ELSE reward_amount END WHERE game_id IN (SELECT id FROM games WHERE slug = 'monopoly-go') AND normalized_url = ?")
    .bind(`url:${alternativeUrl}`, MONOPOLY_GO_ALTERNATIVE_URL, alternativeUrl));
  const problemUrl = normalizeUrl(MONOPOLY_GO_PROBLEM_URL);
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET link_status = 'problem', reward_status = 'unknown', status = 'unconfirmed', reward_key = COALESCE(NULLIF(reward_key, ''), ?), final_url = COALESCE(NULLIF(final_url, ''), ?), expiry_reason = ?, expired_at = NULL, last_checked_at = ? WHERE game_id IN (SELECT id FROM games WHERE slug = 'monopoly-go') AND (normalized_url = ? OR original_url = ? OR url = ? OR final_url = ? OR reward_key = ?)")
    .bind(`url:${problemUrl}`, MONOPOLY_GO_PROBLEM_URL, MONOPOLY_GO_PROBLEM_REASON, nowIso(), problemUrl, MONOPOLY_GO_PROBLEM_URL, MONOPOLY_GO_PROBLEM_URL, MONOPOLY_GO_PROBLEM_URL, `url:${problemUrl}`));
  if (migrationStatements.length) await env.DB.batch(migrationStatements);
  if (catalogStatements.length) await env.DB.batch(catalogStatements);
  schemaReady = true;
}
const readBody = async (request) => { try { return await request.json(); } catch { return null; } };
// The scheduled handler is the primary path. The daily due check also keeps
// the request fallback from collecting more often than intended.
// 🔒 Coleta automática fixa: uma vez a cada 24 horas, mesmo sem navegador aberto.
const COLLECTION_INTERVAL_MS = 24 * 60 * 60 * 1000;
let collectionInFlight = null;

const decodeHtml = (value) => String(value || "").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
const cleanText = (value) => decodeHtml(String(value || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim().slice(0, 400);
const sourceDateKey = (value) => {
  const text = cleanText(value);
  const match = text.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}\b/i) || text.match(/\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i);
  const shortMatch = text.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\b/i) || text.match(/\b\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/i);
  if (!match && !shortMatch) return "";
  const date = new Date(match ? match[0] : `${shortMatch[0]}, ${new Date().getUTCFullYear()}`);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};
const COIN_MASTER_RECENT_DAYS = 3;
const coinMasterUrlDateKey = (value) => {
  const match = String(value || "").match(/(?:^|[^0-9])(20\d{2})(\d{2})(\d{2})(?:[^0-9]|$)/);
  const dateKey = match ? `${match[1]}-${match[2]}-${match[3]}` : "";
  return validDate(dateKey) ? dateKey : "";
};
const isRecentCoinMasterDate = (dateKey) => {
  if (!validDate(dateKey)) return false;
  const timestamp = Date.parse(`${dateKey}T12:00:00Z`);
  if (Number.isNaN(timestamp)) return false;
  const age = Date.now() - timestamp;
  return age >= -24 * 60 * 60 * 1000 && age <= COIN_MASTER_RECENT_DAYS * 24 * 60 * 60 * 1000;
};
const MATCH_MASTERS_RECENT_DAYS = 7;
const MATCH_MASTERS_CLAIM_SIGNAL = /\b(?:claim|collect|open|redeem|tap|resgat(?:ar|e)|colet(?:ar|e))\b/i;
const MATCH_MASTERS_REWARD_KEYS_URL = "https://matchmasters.com/portal/masters-market?scrollTo=rewardKeys";
const matchMastersCodePattern = /(?:reward\s*key|reward\s*code|gift\s*code|promo(?:tional)?\s*code|redeem(?:ption)?\s*code)\s*[:#=-]?\s*([A-Za-z0-9][A-Za-z0-9_-]{2,63})|(?:^|[\s(])code\s*[:#=-]\s*([A-Za-z0-9][A-Za-z0-9_-]{2,63})/gi;
const matchMastersCodeLooksReal = (value) => {
  const code = String(value || "").trim();
  return code.length >= 3 && code.length <= 64 && /^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(code) && !/^(REDEEM|PROMO|CODE|CODES|REWARD|REWARDS|BONUS|GIFT|FREE|UNLOCK|UNLOCKS|AVAILABLE|HERE|BELOW|THE|FOR|AND|ARE|THIS)$/i.test(code);
};
const matchMastersCanonicalUrl = (value) => {
  const text = decodeHtml(String(value || "")).trim();
  try {
    const parsed = new URL(text);
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (hostname === "launch.matchmasters.com" && /^\/l\/p\//i.test(parsed.pathname)) {
      const code = decodeURIComponent(parsed.pathname.slice("/l/p/".length).split("/")[0] || "").trim();
      if (/^[A-Za-z0-9_-]{6,64}$/.test(code)) return `https://launch.matchmasters.com/l/p/${encodeURIComponent(code)}`;
    }
    if (["matchmasters.onelink.me", "matchmaster.oneliuk.me"].includes(hostname)) {
      let code = parsed.searchParams.get("c") || parsed.pathname.match(/[?&]c=([^&]+)/i)?.[1] || "";
      for (let attempt = 0; attempt < 2; attempt++) {
        try { code = decodeURIComponent(code); } catch { break; }
      }
      code = String(code).trim();
      if (/^[A-Za-z0-9_-]{6,64}$/.test(code)) return `https://launch.matchmasters.com/l/p/${encodeURIComponent(code)}`;
    }
    if (hostname === "matchmasters.com") {
      const code = String(parsed.searchParams.get("c") || "").trim();
      if (/^[A-Za-z0-9_-]{6,64}$/.test(code)) return `https://launch.matchmasters.com/l/p/${encodeURIComponent(code)}`;
    }
  } catch {}
  return "";
};
const matchMastersDateKey = (value) => {
  const text = decodeHtml(String(value || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, "$1");
  const iso = text.match(/\b(20\d{2}-\d{2}-\d{2})(?:[T ]|\b)/);
  if (iso && validDate(iso[1])) return iso[1];
  const months = "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec";
  const full = text.match(new RegExp(`\\b(?:${months})\\s+\\d{1,2},?\\s+\\d{4}\\b`, "i")) || text.match(new RegExp(`\\b\\d{1,2}\\.?\\s+(?:${months})\\s+\\d{4}\\b`, "i"));
  if (full) {
    const date = new Date(full[0]);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
  }
  const short = text.match(new RegExp(`\\b(?:${months})\\s+\\d{1,2}(?:st|nd|rd|th)?\\b`, "i"));
  if (!short) return "";
  const date = new Date(`${short[0].replace(/(st|nd|rd|th)\\b/gi, "")}, ${new Date().getUTCFullYear()}`);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};
const isRecentMatchMastersDate = (dateKey) => {
  if (!validDate(dateKey)) return false;
  const timestamp = Date.parse(`${dateKey}T12:00:00Z`);
  if (Number.isNaN(timestamp)) return false;
  const age = Date.now() - timestamp;
  return age >= -24 * 60 * 60 * 1000 && age <= MATCH_MASTERS_RECENT_DAYS * 24 * 60 * 60 * 1000;
};
const sourceContext = (html, href) => {
  const escaped = String(href).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`<a\\b[^>]*href\\s*=\\s*["']${escaped}["'][^>]*>([\\s\\S]*?)<\\/a>`, "i").exec(html);
  return cleanText(match?.[1] || "");
};
const gameRewardPattern = (gameSlug, candidate) => {
  const patterns = {
    "match-masters": /launch\.matchmasters\.com\/l\/p\//i,
    "dice-dreams": /rewards(?:-v2)?\.dicedreams\.com/i,
    "coin-master": /(?:rewards\.coinmaster\.com\/rewards\/|static\.moonactive\.net\/static\/coinmaster\/reward\/|coinmaster\.com\/(?!$))/i,
    "monopoly-go": /mply\.io\//i,
    "animals-and-coins": /(d10xl?\.com\/Animals_Coins|coinraid\.sng\.link)/i,
    "travel-town": /api\.traveltowngame\.net\/public\/rewardLinks/i,
    "family-island": /familyisland\.onelink\.me/i,
    "domino-dreams": /join\.domino-dreams\.com/i,
    "bingo-blitz": /bingo-app-dsa\.playtika\.com\/bingo2-v2-bingoblitz/i,
    "solitaire-grand-harvest": /grandharvest\.onelink\.me/i,
    "board-kings": /(boardkings\.onelink\.me|d10xl?\.com\/BoardKings)/i,
    "gossip-harbor": /gossip-harbor\.onelink\.me/i,
    "seaside-escape": /seaside-escape\.onelink\.me/i,
    "carnival-tycoon": /(carnivaltycoon\.me|game\.centurygame\.com)/i,
    "crazy-fox": /rwys\.xyz/i,
    "piggy-go": /piggygo-jy\.forevernine\.com/i,
    "coin-tales": /bit\.ly\//i,
    "top-tycoon": /tycoon-deep-link\.behefun\.com/i,
    "tasty-travels": /(app\.adjust\.com|game\.centurygame\.com)/i,
    "klondike-adventures": /l\.vizor-games\.com/i,
    "island-king": /islandking-static-jy\.forevernine\.com/i,
  };
  return patterns[gameSlug]?.test(String(candidate)) || false;
};
const candidateSignal = (url, label) => /(reward|gift|bonus|free|promo|code|claim|collect|coupon|daily|coin|coins|roll|rolls|spin|spins|dice|link|present|recompensa|regalo)/i.test(`${url} ${label}`);
const isCandidate = (candidate, label, source, game) => {
  if (!validUrl(candidate)) return false;
  const normalized = normalizeUrl(candidate);
  if (!normalized || normalized === normalizeUrl(source.url)) return false;
  const parsed = new URL(candidate);
  if (/\.(css|js|json|png|jpe?g|gif|webp|svg|ico|woff2?)(\?|$)/i.test(parsed.pathname)) return false;
  if (/^(facebook\.com|instagram\.com|youtube\.com|youtu\.be|tiktok\.com|twitter\.com|x\.com|discord\.com|t\.me)$/i.test(parsed.hostname.replace(/^www\./, ""))) return false;
  return gameRewardPattern(game.slug, candidate) && candidateSignal(candidate, label);
};
const normalizeRewardType = (value) => {
  const text = String(value || "").toLowerCase();
  if (/token|ficha/.test(text)) return "tokens";
  if (/ticket|bilhete/.test(text)) return "tickets";
  if (/booster|reforço/.test(text)) return "boosters";
  if (/sticker|adesivo/.test(text)) return "stickers";
  if (/diamond|diamante|gem|gema/.test(text)) return "gems";
  if (/ruby|rubi/.test(text)) return "rubies";
  if (/energy|energia/.test(text)) return "energy";
  if (/coin|moeda/.test(text)) return "coins";
  if (/credit|crédito/.test(text)) return "credits";
  if (/roll|giro|spin|tirada/.test(text)) return "rolls";
  if (/dice|dado/.test(text)) return "dice";
  if (/pack|pacote/.test(text)) return "packs";
  return "";
};
const extractExplicitReward = (label) => {
  const text = cleanText(label);
  const kinds = "tokens?|fichas?|tickets?|bilhetes?|boosters?|reforços?|stickers?|adesivos?|diamonds?|diamantes?|gems?|gemas?|energy|energia|coins?|moedas?|rolls?|giros?|spins?|tiradas?|dice|dados?|credits?|créditos?|rubies?|rubis?|packs?|pacotes?";
  const quantityPattern = new RegExp(`\\b(\\d[\\d,.]*)\\s*(?:free\\s+|grátis\\s+)?(${kinds})\\b`, "i");
  const quantityMatch = text.match(quantityPattern);
  const kindPattern = new RegExp(`\\b(${kinds})\\b`, "i");
  const kindMatch = text.match(kindPattern);
  const type = normalizeRewardType(quantityMatch?.[2] || kindMatch?.[1] || "");
  return { name: "", type, quantity: quantityMatch?.[1] || "", amount: quantityMatch?.[1] || "", description: text, excerpt: text };
};
const codeKey = (game, code) => `code:${game.slug}:${String(code || "").trim().toUpperCase()}`;
const codeLooksReal = (value) => {
  const code = String(value || "").trim().toUpperCase();
  return code.length >= 5 && code.length <= 32 && /^[A-Z0-9][A-Z0-9_-]*$/.test(code) && !/^(REDEEM|PROMO|CODE|CODES|ROBLOX|REWARD|REWARDS|BONUS|GIFT|FREE)$/.test(code);
};
const codeSourceText = (body) => String(body || "").replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 2_000_000);
const labeledCodePattern = new RegExp("(?:promo(?:tional)?\\s*code|redeem(?:ption)?\\s*code|reward\\s*code|coupon\\s*code|código(?:\\s+de\\s+resgate)?|code)\\s*[:#=-]?\\s*([A-Z0-9][A-Z0-9_-]{4,31})", "gi");
const jsonCodePattern = new RegExp("[\\\"'](?:code|promoCode|promo_code|rewardCode|reward_code)[\\\"']\\s*:\\s*[\\\"']([A-Z0-9][A-Z0-9_-]{4,31})[\\\"']", "gi");
const extractCodeCandidates = (body, source) => {
  const found = [];
  const add = (code, label = "", image = "") => {
    const normalizedCode = String(code || "").trim().toUpperCase();
    if (!codeLooksReal(normalizedCode) || found.some((item) => item.code === normalizedCode)) return;
    found.push({ code: normalizedCode, url: source.url, redemption_url: source.url, label: cleanText(label), image });
  };
  const text = codeSourceText(body);
  const labeled = labeledCodePattern;
  let match;
  while ((match = labeled.exec(text))) add(match[1], text.slice(Math.max(0, match.index - 80), Math.min(text.length, match.index + match[0].length + 120)));
  const jsonCode = jsonCodePattern;
  while ((match = jsonCode.exec(String(body || "")))) add(match[1], String(body || "").slice(Math.max(0, match.index - 180), match.index + 260));
  return found;
};
const COIN_MASTER_MAX_REVALIDATIONS = 20;
const extractCoinMasterCandidates = (body, source, game) => {
  const html = String(body || "");
  const found = [];
  const seen = new Set();
  const pending = [];
  let currentDateKey = "";
  let currentLiStart = -1;
  const add = (value, label = "", image = "", dateKey = "") => {
    const url = decodeHtml(value).trim();
    const effectiveDateKey = validDate(dateKey) ? dateKey : coinMasterUrlDateKey(url);
    if (!effectiveDateKey || !isRecentCoinMasterDate(effectiveDateKey)) return;
    if (!isCandidate(url, label, source, game)) return;
    const normalized = normalizeUrl(url);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    found.push({ url, label: cleanText(label), image, date_key: effectiveDateKey });
  };
  const flushPending = (context = "") => {
    while (pending.length) {
      const item = pending.shift();
      add(item.url, [item.label, context].filter(Boolean).join(" "), item.image, item.date_key);
    }
  };
  const tokens = /<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>|<p\b[^>]*>[\s\S]*?<\/p\s*>|<li\b[^>]*>|<\/li\s*>|<a\b[^>]*href\s*=\s*(["'])(.*?)\2[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = tokens.exec(html))) {
    const token = match[0];
    if (/^<h/i.test(token) || /^<p/i.test(token)) {
      const parsedDate = sourceDateKey(cleanText(token));
      if (parsedDate) currentDateKey = parsedDate;
      continue;
    }
    if (/^<li/i.test(token)) {
      if (currentLiStart >= 0) flushPending(cleanText(html.slice(currentLiStart, match.index)));
      currentLiStart = match.index;
      continue;
    }
    if (/^<\/li/i.test(token)) {
      if (currentLiStart >= 0) {
        flushPending(cleanText(html.slice(currentLiStart, match.index + token.length)));
        currentLiStart = -1;
      }
      continue;
    }
    const href = decodeHtml(match[3]).trim();
    const label = cleanText(match[4] || "");
    let image = "";
    try {
      const imageUrl = match[4]?.match(/<img\b[^>]*src\s*=\s*(["'])(.*?)\1/i)?.[2] || "";
      image = imageUrl ? new URL(decodeHtml(imageUrl), source.url).toString() : "";
    } catch {}
    let absoluteUrl = "";
    try { absoluteUrl = /^https?:\/\//i.test(href) ? href : new URL(href, source.url).toString(); } catch { continue; }
    const item = { url: absoluteUrl, label, image, date_key: currentDateKey || coinMasterUrlDateKey(absoluteUrl) };
    if (currentLiStart >= 0) pending.push(item);
    else add(item.url, item.label, item.image, item.date_key);
  }
  if (currentLiStart >= 0) flushPending(cleanText(html.slice(currentLiStart)));
  return found;
};
const TRAVEL_TOWN_RECENT_DAYS = 3;
const isRecentTravelTownDate = (dateKey) => {
  if (!validDate(dateKey)) return false;
  const timestamp = Date.parse(`${dateKey}T12:00:00Z`);
  if (Number.isNaN(timestamp)) return false;
  const age = Date.now() - timestamp;
  return age >= -24 * 60 * 60 * 1000 && age <= TRAVEL_TOWN_RECENT_DAYS * 24 * 60 * 60 * 1000;
};
const isTravelTownRewardUrl = (value) => {
  try {
    const parsed = new URL(String(value || ""));
    return parsed.protocol === "https:" && parsed.hostname.toLowerCase() === "api.traveltowngame.net" && /^\/public\/rewardLinks\/getLink\/[A-Za-z0-9_-]+$/i.test(parsed.pathname);
  } catch { return false; }
};
const travelTownQuantity = (value) => {
  const text = cleanText(value);
  return text.match(/\bX\s*(\d{1,3})\b/i)?.[1] || text.match(/\b(\d{1,3})\s+(?:(?:free|gr[aá]tis|gratis)\s+)?(?:energia|energy)\b/i)?.[1] || "";
};
const travelTownPageDate = (html) => {
  const title = String(html || "").match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "";
  const direct = `${title} ${String(html || "").slice(0, 24000)}`.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+20\d{2}\b/i);
  if (!direct) return "";
  const date = new Date(direct[0]);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};
const extractTravelTownCardCandidates = (body, source, game) => {
  const html = String(body || "");
  const pageDate = travelTownPageDate(html);
  const found = [];
  const seen = new Set();
  const collectCards = (sectionHtml, dateKey) => {
    const cards = sectionHtml.matchAll(/<li\b[^>]*class=["'][^"']*energyCardListItem[^"']*isPc[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi);
    for (const card of cards) {
      const cardHtml = card[1];
      const href = (cardHtml.match(/<a\b[^>]*href\s*=\s*(["'])(.*?)\1/i)?.[2] || "").replace(/\\+$/, "");
      let url = "";
      try { url = /^https?:\/\//i.test(href) ? decodeHtml(href).trim() : new URL(decodeHtml(href).trim(), source.url).toString(); } catch { continue; }
      const title = cleanText(cardHtml.match(/class=["'][^"']*textTitle[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] || cardHtml);
      const cardText = cleanText(cardHtml);
      const quantity = travelTownQuantity(title);
      if (!dateKey || !isRecentTravelTownDate(dateKey) || !isTravelTownRewardUrl(url) || !isCandidate(url, `${title} ${cardText}`, source, game)) continue;
      const normalized = normalizeUrl(url);
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      found.push({ url, discovered_url: url, label: `${quantity ? `${quantity} ` : ""}free energy${/\b(?:expired|expirado)\b/i.test(cardText) ? " expired" : ""}`, quantity, date_key: dateKey });
    }
  };
  const todayHeading = html.search(/<h[1-6]\b[^>]*id=["']today["'][^>]*>/i);
  const previousHeading = html.search(/<h[1-6]\b[^>]*id=["']previous["'][^>]*>/i);
  if (todayHeading >= 0) collectCards(html.slice(todayHeading, previousHeading > todayHeading ? previousHeading : undefined), pageDate);
  const previousHtml = previousHeading >= 0 ? html.slice(previousHeading) : "";
  for (const section of previousHtml.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>([\s\S]*?)(?=<h[1-6]\b|$)/gi)) {
    collectCards(section[2], sourceDateKey(section[1]));
  }
  return found;
};
const extractTravelTownCandidates = (body, source, game) => {
  if (/traveltowncard\.com$/i.test(String(new URL(source.url).hostname).replace(/^www\./, ""))) return extractTravelTownCardCandidates(body, source, game);
  const html = String(body || "");
  const found = [];
  const seen = new Set();
  const sections = html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>([\s\S]*?)(?=<h[1-6]\b|$)/gi);
  for (const section of sections) {
    const dateKey = sourceDateKey(section[1]);
    if (!isRecentTravelTownDate(dateKey)) continue;
    const sectionHtml = section[2];
    const anchors = sectionHtml.matchAll(/<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi);
    for (const anchor of anchors) {
      let url = "";
      try { url = /^https?:\/\//i.test(anchor[2]) ? decodeHtml(anchor[2]).trim() : new URL(decodeHtml(anchor[2]).trim(), source.url).toString(); } catch { continue; }
      const itemStart = sectionHtml.lastIndexOf("<li", anchor.index);
      const itemEnd = sectionHtml.indexOf("</li>", anchor.index);
      const item = itemStart >= 0 && itemEnd > itemStart ? sectionHtml.slice(itemStart, itemEnd + 5) : `${anchor[3]} ${sectionHtml.slice(anchor.index, anchor.index + 300)}`;
      const label = cleanText(item);
      if (!isTravelTownRewardUrl(url) || !isCandidate(url, label, source, game)) continue;
      const normalized = normalizeUrl(url);
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      found.push({ url, discovered_url: url, label, image: "", date_key: dateKey });
    }
  }
  return found.slice(0, 12);
};

const extractCandidates = (body, source, game) => {
  const parser = String(source.parser_type || "html_links").toLowerCase();
  if (parser === "html_codes" || parser === "direct_code") return extractCodeCandidates(body, source);
  if (game.slug === "dice-dreams" && parser === "html_links") return extractRecentDiceDreamsCandidates(body, source, game);
  if (game.slug === "coin-master" && parser === "html_links") return extractCoinMasterCandidates(body, source, game);
  if (game.slug === "match-masters" && parser === "html_links") return extractMatchMastersCandidates(body, source);
  if (game.slug === "travel-town" && (parser === "html_links" || parser === "travel_town_card")) return extractTravelTownCandidates(body, source, game);
  if (parser === "json_codes") {
    try {
      const found = [];
      const visit = (value, context = "") => {
        if (Array.isArray(value)) return value.forEach((item) => visit(item, context));
        if (!value || typeof value !== "object") return;
        const codeValue = value.code || value.promoCode || value.promo_code || value.rewardCode || value.reward_code;
        if (typeof codeValue === "string") found.push({ code: codeValue, url: source.url, redemption_url: source.url, label: value.name || value.reward || value.description || context, image: value.image || value.image_url || "" });
        Object.entries(value).forEach(([key, item]) => visit(item, `${context} ${key}`));
      };
      visit(JSON.parse(body));
      return found.filter((item, index, all) => codeLooksReal(item.code) && all.findIndex((other) => String(other.code).trim().toUpperCase() === String(item.code).trim().toUpperCase()) === index).map((item) => ({ ...item, code: String(item.code).trim().toUpperCase() }));
    } catch { return []; }
  }
  if (parser === "direct_url") return isCandidate(source.url, "", { ...source, url: "" }, game) || validUrl(source.url) ? [{ url: source.url, label: "" }] : [];
  if (parser === "json_links") {
    try {
      const urls = [];
      const visit = (value) => { if (typeof value === "string" && validUrl(value)) urls.push({ url: value, label: "" }); else if (Array.isArray(value)) value.forEach(visit); else if (value && typeof value === "object") Object.values(value).forEach(visit); };
      visit(JSON.parse(body));
      return urls.filter((item) => isCandidate(item.url, item.label, source, game));
    } catch { return []; }
  }
  const found = [];
  const add = (value, label = "", image = "", dateKey = "") => { const url = decodeHtml(value).trim(); if (isCandidate(url, label, source, game) && !found.some((item) => normalizeUrl(item.url) === normalizeUrl(url))) found.push({ url, label, image, date_key: dateKey }); };
  const anchors = /<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchors.exec(body))) {
    const href = decodeHtml(match[2]).trim();
    try {
      const image = match[3].match(/<img\b[^>]*src\s*=\s*(["'])(.*?)\1/i)?.[2] || "";
      const itemStart = body.lastIndexOf("<li", match.index);
      const itemEnd = body.indexOf("</li>", match.index);
      const itemText = itemStart >= 0 && itemEnd > itemStart ? body.slice(itemStart, itemEnd + 5) : match[3];
      const beforeItem = body.slice(0, itemStart >= 0 ? itemStart : match.index);
      const headings = [...beforeItem.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)];
      const dateKey = sourceDateKey(headings.at(-1)?.[1] || "");
      add(/^https?:\/\//i.test(href) ? href : new URL(href, source.url).toString(), cleanText(itemText), image ? new URL(decodeHtml(image), source.url).toString() : "", dateKey);
    } catch {}
  }
  const rawUrls = body.match(/https?:\/\/[^\s"'<>]+/gi) || [];
  rawUrls.forEach((url) => { add(url.replace(/[),.;]+$/, ""), sourceContext(body, url)); });
  return found;
};

const DICE_DREAMS_RECENT_DAYS = 7;
const diceSourceDateKey = (value) => {
  const text = cleanText(value);
  const months = "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec";
  const match = text.match(new RegExp(`\\b(?:${months})\\s+\\d{1,2},\\s+\\d{4}\\b`, "i"));
  if (!match) return "";
  const date = new Date(match[0]);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};
const isRecentDiceDreamsDate = (dateKey) => {
  if (!validDate(dateKey)) return false;
  const timestamp = Date.parse(`${dateKey}T12:00:00Z`);
  if (Number.isNaN(timestamp)) return false;
  const age = Date.now() - timestamp;
  return age >= -24 * 60 * 60 * 1000 && age <= DICE_DREAMS_RECENT_DAYS * 24 * 60 * 60 * 1000;
};
const extractRecentDiceDreamsCandidates = (body, source, game) => {
  const found = [];
  const seen = new Set();
  const sections = body.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>([\s\S]*?)(?=<h[1-6]\b|$)/gi);
  for (const section of sections) {
    const dateKey = diceSourceDateKey(section[1]);
    if (!isRecentDiceDreamsDate(dateKey)) continue;
    const anchors = section[2].matchAll(/<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi);
    for (const anchor of anchors) {
      const url = decodeHtml(anchor[2]).trim();
      const label = cleanText(anchor[3]);
      if (!isCandidate(url, label, source, game)) continue;
      const normalized = normalizeUrl(url);
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      found.push({ url, label, image: "", date_key: dateKey });
    }
  }
  return found;
};

const extractMatchMastersCandidates = (body, source) => {
  const html = String(body || "");
  const found = [];
  const seen = new Set();
  const add = (value, label = "", image = "", dateKey = "") => {
    const discoveredUrl = decodeHtml(value).trim();
    if (!validUrl(discoveredUrl) || normalizeUrl(discoveredUrl) === normalizeUrl(source.url)) return;
    const parsed = new URL(discoveredUrl);
    if (/\.(css|js|json|png|jpe?g|gif|webp|svg|ico|woff2?)(\?|$)/i.test(parsed.pathname)) return;
    if (/^(facebook\.com|instagram\.com|youtube\.com|youtu\.be|tiktok\.com|twitter\.com|x\.com|discord\.com|t\.me)$/i.test(parsed.hostname.replace(/^www\./, ""))) return;
    const finalUrl = matchMastersCanonicalUrl(discoveredUrl);
    let sourceHostname = "";
    try { sourceHostname = new URL(source.url).hostname.toLowerCase().replace(/^www\./, ""); } catch {}
    const isGiveaway48Link = sourceHostname === "giveaway48.de" && parsed.hostname.toLowerCase().replace(/^www\./, "") === sourceHostname && parsed.pathname === "/link/" && parsed.searchParams.has("link");
    const intermediatePathSignal = /^\/(?:link|claim|collect|redirect|go|out)(?:\/|$)/i.test(parsed.pathname);
    const isIntermediate = !finalUrl && parsed.hostname.toLowerCase().replace(/^www\./, "") === sourceHostname && (isGiveaway48Link || (intermediatePathSignal && MATCH_MASTERS_CLAIM_SIGNAL.test(label)));
    if (!finalUrl && !isIntermediate) return;
    const key = normalizeUrl(finalUrl || discoveredUrl);
    if (!key || seen.has(key)) return;
    seen.add(key);
    found.push({ url: finalUrl || discoveredUrl, discovered_url: discoveredUrl, label: cleanText(label), image, date_key: dateKey, is_intermediate: isIntermediate });
  };
  const addCode = (code, label = "", dateKey = "", redemptionUrl = MATCH_MASTERS_REWARD_KEYS_URL) => {
    const exactCode = String(code || "").trim();
    if (!matchMastersCodeLooksReal(exactCode)) return;
    const key = `code:${exactCode.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    found.push({ code: exactCode, url: "", redemption_url: redemptionUrl || MATCH_MASTERS_REWARD_KEYS_URL, label: cleanText(label), date_key: dateKey });
  };
  const contextFor = (index, inner = "") => {
    const before = html.slice(0, index);
    const heading = [...before.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/gi)].at(-1)?.[1] || "";
    const itemStart = Math.max(before.lastIndexOf("<li"), before.lastIndexOf('<div class="claimcard"'), before.lastIndexOf("<div class='claimcard'"), before.lastIndexOf("<article"));
    const itemContext = itemStart >= 0 ? html.slice(itemStart, Math.min(html.length, index + 700)) : `${html.slice(Math.max(0, index - 700), index + 500)} ${inner}`;
    const context = cleanText(itemContext);
    const nearby = html.slice(Math.max(0, index - 1600), Math.min(html.length, index + 700));
    return { context, dateKey: matchMastersDateKey(context) || matchMastersDateKey(nearby) || matchMastersDateKey(heading) };
  };
  const anchors = /<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchors.exec(html))) {
    const href = decodeHtml(match[2]).trim();
    let absoluteUrl = "";
    try { absoluteUrl = /^https?:\/\//i.test(href) ? href : new URL(href, source.url).toString(); } catch { continue; }
    const context = contextFor(match.index, match[3]);
    let image = "";
    try {
      const imageUrl = match[3].match(/<img\b[^>]*src\s*=\s*(["'])(.*?)\1/i)?.[2] || "";
      image = imageUrl ? new URL(decodeHtml(imageUrl), source.url).toString() : "";
    } catch {}
    add(absoluteUrl, `${cleanText(match[3])} ${context.context}`, image, context.dateKey);
  }
  const searchableHtml = html.replace(/\\\//g, "/").replace(/\\u0026/gi, "&");
  const rawUrls = searchableHtml.match(/https?:\/\/[^\s"'<>\\]+/gi) || [];
  rawUrls.forEach((url) => {
    const cleanUrl = url.replace(/[),.;]+$/, "");
    const index = searchableHtml.indexOf(url);
    const context = cleanText(searchableHtml.slice(Math.max(0, index - 500), index + url.length + 300));
    add(cleanUrl, context, "", matchMastersDateKey(context));
  });
  let currentDateKey = "";
  const blocks = html.match(/<p\b[^>]*>[\s\S]*?<\/p\s*>|<li\b[^>]*>[\s\S]*?<\/li\s*>|<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]\s*>/gi) || [];
  for (const block of blocks) {
    const text = cleanText(block);
    const blockDateKey = matchMastersDateKey(text);
    if (blockDateKey) currentDateKey = blockDateKey;
    const codeMatches = text.matchAll(matchMastersCodePattern);
    for (const codeMatch of codeMatches) {
      const code = codeMatch[1] || codeMatch[2] || "";
      const officialLink = [...block.matchAll(/<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>/gi)]
        .map((link) => decodeHtml(link[2]).trim())
        .map((link) => { try { return new URL(link, source.url).toString(); } catch { return ""; } })
        .find((link) => /^https:\/\/matchmasters\.com\/portal\/masters-market(?:[/?#]|$)/i.test(link));
      addCode(code, text, blockDateKey || currentDateKey, officialLink || MATCH_MASTERS_REWARD_KEYS_URL);
    }
  }
  return found;
};

const destinationErrorSignal = /\b(expired|invalid|not delivered|unavailable|not found|does not exist|no longer available|link not found|link expired|page not found|404)\b/i;
const alreadyClaimedSignal = /\b(?:already\s+(?:been\s+)?(?:claimed|redeemed|collected)|já\s+(?:foi\s+)?(?:resgatad[oa]|coletad[oa]))\b/i;
const matchMastersMessengerExclusiveSignal = /(?:you\s+can\s+only\s+(?:collect|claim|redeem|use)[\s\S]{0,140}(?:facebook\s+)?messenger|(?:collect|claim|redeem|use)[\s\S]{0,100}(?:only|exclusively|required)[\s\S]{0,100}(?:facebook\s+)?messenger|(?:s[oó]\s+pode|apenas\s+pode|exclusivament[ea])\s+(?:coletar|resgatar|reivindicar|usar)[\s\S]{0,140}(?:facebook\s+)?messenger|(?:facebook\s+)?messenger[\s\S]{0,100}(?:only|required|exclusive|necess[aá]ri[oa]))/i;
const MATCH_MASTERS_MESSENGER_NOTE = "GG_CLASSIFICATION:messenger-exclusive — Exclusivo do Facebook Messenger; exige resgate dentro do Messenger.";
const coinMasterExpiredOfferSignal = /\b(?:this\s+(?:offer|reward|link)\s+(?:has\s+)?(?:ended|expired|is\s+over|is\s+no\s+longer\s+available)|(?:offer|reward|link)\s+(?:has\s+)?expired|this\s+offer\s+is\s+no\s+longer\s+available|esta\s+oferta\s+(?:acabou|terminou|expirou)|oferta\s+(?:expirada|terminada)|enlace\s+(?:expirado|caducado))\b/i;
const MATCH_MASTERS_MAX_REVALIDATIONS = 4;
const isTravelTownOneLink = (value) => {
  try {
    const parsed = new URL(String(value || ""));
    return parsed.protocol === "https:" && parsed.hostname.toLowerCase() === "traveltown.onelink.me" && parsed.pathname.length > 1 && Boolean(parsed.searchParams.get("c") || parsed.searchParams.get("af_sub1"));
  } catch { return false; }
};
async function resolveTravelTownCandidate(candidate) {
  const discoveredUrl = candidate.discovered_url || candidate.url || "";
  if (isTravelTownOneLink(discoveredUrl)) return { ...candidate, url: discoveredUrl, redemption_url: discoveredUrl, resolution_status: "resolved", resolution_reason: "Deep link oficial do Travel Town." };
  if (!isTravelTownRewardUrl(discoveredUrl)) return { ...candidate, url: "", resolution_status: "rejected", resolution_reason: "A URL encontrada não pertence ao endpoint oficial de recompensas do Travel Town." };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(discoveredUrl, { redirect: "manual", signal: controller.signal, headers: { accept: "text/html,application/json;q=0.9,text/plain;q=0.8", "user-agent": "GameGiftsCollector/1.0" } });
    const location = response.headers.get("location") || "";
    if (response.status >= 300 && response.status < 400 && isTravelTownOneLink(location)) {
      return { ...candidate, url: location, redemption_url: location, discovered_url: discoveredUrl, resolution_status: "resolved", resolution_reason: "Endpoint oficial convertido para o deep link traveltown.onelink.me." };
    }
    return { ...candidate, url: "", discovered_url: discoveredUrl, resolution_status: "rejected", resolution_reason: `O endpoint oficial não revelou um deep link traveltown.onelink.me (HTTP ${response.status}).` };
  } catch {
    return { ...candidate, url: "", discovered_url: discoveredUrl, resolution_status: "rejected", resolution_reason: "O endpoint oficial do Travel Town não respondeu no servidor." };
  } finally { clearTimeout(timeout); }
}
async function repairTravelTownLegacyRewards(env, game) {
  await env.DB.prepare("UPDATE rewards SET quantity = '', reward_amount = '', reward_description = CASE WHEN reward_description = '' OR instr(lower(reward_description), '30 free energy') > 0 THEN 'Energia grátis encontrada em uma fonte anterior.' ELSE reward_description END WHERE game_id = ? AND instr(lower(source), 'mobilegamecentral.com') > 0 AND instr(lower(source), 'traveltowncard.com') = 0").bind(game.id).run();
  const rows = (await env.DB.prepare("SELECT * FROM rewards WHERE game_id = ? AND (instr(original_url, 'https://api.traveltowngame.net/public/rewardLinks/getLink/') = 1 OR instr(url, 'https://api.traveltowngame.net/public/rewardLinks/getLink/') = 1)").bind(game.id).all()).results;
  for (const row of rows) {
    const legacyUrl = row.original_url || row.url;
    const resolved = await resolveTravelTownCandidate({ url: legacyUrl, discovered_url: legacyUrl });
    if (resolved.resolution_status !== "resolved" || !isTravelTownOneLink(resolved.url)) continue;
    const normalized = normalizeUrl(resolved.url);
    await env.DB.prepare("UPDATE rewards SET url = ?, original_url = ?, normalized_url = ?, final_url = ?, redemption_url = ?, reward_key = ?, last_checked_at = ?, link_status = 'active', reward_status = 'unknown', status = 'unconfirmed' WHERE id = ?")
      .bind(resolved.url, resolved.url, normalized, resolved.url, resolved.url, `travel_town:${normalized}`, nowIso(), row.id).run();
  }
}
async function verifyRewardDestination(url, game = null) {
  const checkedAt = nowIso();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    if (game?.slug === "match-masters") {
      const response = await fetch(url, { redirect: "manual", signal: controller.signal, headers: { accept: "text/html,application/json;q=0.9,text/plain;q=0.8", "user-agent": "GameGiftsVerifier/1.0" } });
      const location = response.headers.get("location") || "";
      const contentType = response.headers.get("content-type") || "";
      const body = /(?:text\/html|text\/plain|application\/json)/i.test(contentType) ? (await response.text()).slice(0, 120000) : "";
      const bodyFinalUrl = (body.replace(/\\\//g, "/").replace(/\\u0026/gi, "&").match(/https?:\/\/[^\s"'<>\\]+/gi) || [])
        .map((candidate) => matchMastersCanonicalUrl(candidate.replace(/[),.;'"\\]+$/, ""))).find(Boolean) || "";
      const finalUrl = matchMastersCanonicalUrl(location) || bodyFinalUrl || matchMastersCanonicalUrl(url) || url;
      const classificationText = `${location} ${finalUrl} ${body}`;
      if (response.status >= 300 && response.status < 400 && !matchMastersCanonicalUrl(location)) return { status: "unverified", checkedAt, finalUrl: url, reason: "O destino redirecionou para um endereço não reconhecido como recompensa Match Masters." };
      if (!response.ok && !(response.status >= 300 && response.status < 400)) return { status: "unverified", checkedAt, finalUrl, reason: `HTTP ${response.status}; a resposta HTTP não confirma expiração da recompensa.` };
      if (destinationErrorSignal.test(body)) return { status: "expired", checkedAt, finalUrl, reason: "Página indica link expirado ou indisponível." };
      if (matchMastersMessengerExclusiveSignal.test(classificationText)) return { status: "unverified", classification: "messenger_exclusive", checkedAt, finalUrl, reason: "O destino informa que o código só pode ser coletado pelo Facebook Messenger." };
      return { status: "active", checkedAt, finalUrl };
    }
    if (game?.slug === "travel-town") {
      const response = await fetch(url, { redirect: "manual", signal: controller.signal, headers: { accept: "text/html,application/json;q=0.9,text/plain;q=0.8", "user-agent": "GameGiftsVerifier/1.0" } });
      const location = response.headers.get("location") || "";
      if (isTravelTownOneLink(url)) {
        if (response.status >= 300 && response.status < 400 && location && !/^https:\/\/(?:images\.)?traveltowngame\.net\//i.test(location)) return { status: "unverified", checkedAt, finalUrl: url, reason: "O deep link redirecionou para um destino não reconhecido como resgate do Travel Town." };
        if (response.status >= 200 && response.status < 400) return { status: "active", checkedAt, finalUrl: url };
      }
      if (response.status >= 300 && response.status < 400 && isTravelTownOneLink(location)) return { status: "active", checkedAt, finalUrl: location };
      return { status: "unverified", checkedAt, finalUrl: url, reason: `O destino não confirmou um deep link oficial do Travel Town (HTTP ${response.status}).` };
    }
    if (game?.slug === "monopoly-go") {
      const probe = await fetch(url, { redirect: "manual", signal: controller.signal, headers: { accept: "text/html,application/json;q=0.9,text/plain;q=0.8", "user-agent": "GameGiftsVerifier/1.0" } });
      const location = probe.headers.get("location") || "";
      if (probe.status >= 300 && probe.status < 400 && /^monopolygo:\/\/reward-link\//i.test(location)) return { status: "active", checkedAt, finalUrl: url };
    }
    const response = await fetch(url, { redirect: "follow", signal: controller.signal, headers: { accept: "text/html,application/json;q=0.9,text/plain;q=0.8", "user-agent": "GameGiftsVerifier/1.0" } });
    const finalUrl = response.url || url;
    const isStoreFallback = /(^|\.)((play\.google\.com)|(apps\.apple\.com)|(appgallery\.huawei\.com))$/i.test(new URL(finalUrl).hostname);
    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("text/html") ? (await response.text()).slice(0, 120000) : "";
    if (game?.slug === "dice-dreams" && alreadyClaimedSignal.test(body)) return { status: "active", checkedAt, finalUrl, claimedForVisitor: true };
    if (game?.slug === "coin-master") {
      if (!response.ok) return { status: "unverified", checkedAt, finalUrl, reason: `HTTP ${response.status}; a resposta não confirma expiração da oferta.` };
      if (coinMasterExpiredOfferSignal.test(body)) return { status: "expired", checkedAt, finalUrl, reason: "A página do Coin Master informa explicitamente que esta oferta acabou ou expirou." };
      return { status: "active", checkedAt, finalUrl };
    }
    if (!response.ok) return { status: "unverified", checkedAt, reason: `HTTP ${response.status}; a resposta HTTP não confirma expiração da recompensa.` };
    if (!isStoreFallback && destinationErrorSignal.test(body)) return { status: "expired", checkedAt, reason: "Página indica link expirado ou indisponível." };
    return { status: "active", checkedAt, finalUrl };
  } catch (error) {
    return { status: "unverified", checkedAt, reason: "Destino não respondeu para verificação automática." };
  } finally { clearTimeout(timeout); }
}

async function resolveMatchMastersCandidate(candidate) {
  const discoveredUrl = candidate.discovered_url || candidate.url || "";
  const derivedUrl = matchMastersCanonicalUrl(discoveredUrl);
  let discoveredHost = "";
  try { discoveredHost = new URL(discoveredUrl).hostname.toLowerCase().replace(/^www\./, ""); } catch {}
  if (derivedUrl && (/^https?:\/\/launch\.matchmasters\.com\/l\/p\//i.test(discoveredUrl) || ["matchmasters.onelink.me", "matchmaster.oneliuk.me", "matchmasters.com"].includes(discoveredHost))) {
    return { ...candidate, url: derivedUrl, redemption_url: derivedUrl, discovered_url: discoveredUrl, resolution_status: "resolved", resolution_reason: discoveredHost === "launch.matchmasters.com" ? "URL oficial direta da recompensa." : "OneLink convertido para a URL real pelo código c." };
  }
  const checkedAt = nowIso();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(discoveredUrl, { redirect: "follow", signal: controller.signal, headers: { accept: "text/html,application/json;q=0.9,text/plain;q=0.8", "user-agent": "GameGiftsCollector/1.0" } });
    const responseUrl = matchMastersCanonicalUrl(response.url || "");
    let body = "";
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html") || contentType.includes("text/plain")) body = (await response.text()).slice(0, 120000);
    const nestedUrl = responseUrl || (body.replace(/\\\//g, "/").replace(/\\u0026/gi, "&").match(/https?:\/\/[^\s"'<>\\]+/gi) || []).map((url) => matchMastersCanonicalUrl(url)).find(Boolean) || derivedUrl;
    if (nestedUrl) return { ...candidate, url: nestedUrl, redemption_url: nestedUrl, discovered_url: discoveredUrl, resolution_status: "resolved", resolution_reason: `Redirecionamento HTTP ${response.status}; URL real extraída.` };
    return { ...candidate, url: "", discovered_url: discoveredUrl, resolution_status: "rejected", resolution_reason: `O botão intermediário não revelou uma URL launch.matchmasters.com (HTTP ${response.status}).`, resolution_checked_at: checkedAt };
  } catch {
    return { ...candidate, url: "", discovered_url: discoveredUrl, resolution_status: "rejected", resolution_reason: "O redirecionamento intermediário não respondeu no servidor.", resolution_checked_at: checkedAt };
  } finally { clearTimeout(timeout); }
}

const matchMastersLogUrl = (value) => String(value || "").trim() || "—";
const logMatchMastersCandidate = (source, candidate, result, destination) => {
  const checkedDestination = destination || result?.destination_result || (result?.destination && typeof result.destination === "object" ? result.destination : null);
  const validation = result?.resolution_status === "rejected" || checkedDestination?.status === "expired" ? "rejeitada" : checkedDestination?.status === "active" ? "validada" : "não confirmada";
  const reason = result?.resolution_reason || checkedDestination?.reason || (result?.duplicate ? "URL/reward_key já existente." : result?.saved ? "URL passou pela validação e foi salva." : "URL já processada pelo coletor.");
  console.log(`[GAME GIFTS][Match Masters] ${source.name} (${source.url}) → URL encontrada: ${matchMastersLogUrl(candidate.discovered_url || candidate.url)} → URL final: ${matchMastersLogUrl(result?.final_url || result?.destination?.finalUrl || result?.url || (result?.resolution_status === "rejected" ? "" : candidate.url))} → ${result?.duplicate ? "duplicada" : result?.saved ? "nova" : "não salva"} → ${validation} → motivo: ${reason}`);
};

const findMatchMastersExistingReward = (rows, rewardKey, normalizedUrl, normalizedFinalUrl, finalUrl) => rows.find((row) => {
  if (row.reward_key === rewardKey || row.normalized_url === normalizedUrl || row.final_url === normalizedFinalUrl || row.normalized_url === normalizedFinalUrl) return true;
  const canonicalFinal = matchMastersCanonicalUrl(finalUrl);
  return Boolean(canonicalFinal && [row.original_url, row.url, row.normalized_url, row.final_url, row.redemption_url]
    .some((value) => matchMastersCanonicalUrl(value) === canonicalFinal));
}) || null;

async function saveDiscoveredReward(env, source, game, candidate, foundAt, options = {}) {
  const isCode = Boolean(candidate.code);
  const originalUrl = game.slug === "match-masters" ? (isCode ? "" : (matchMastersCanonicalUrl(candidate.url) || candidate.url || source.url)) : (candidate.url || source.url);
  const normalizedUrl = normalizeUrl(originalUrl);
  const parts = dateParts(foundAt);
  const rewardDate = validDate(candidate.date_key) ? candidate.date_key : parts.date;
  const info = extractExplicitReward(candidate.label);
  const travelTownLegacySource = game.slug === "travel-town" && /mobilegamecentral\.com/i.test(String(source.url || ""));
  if (travelTownLegacySource) { info.type = "energy"; info.quantity = ""; info.amount = ""; info.description = "Energia grátis encontrada em uma fonte anterior."; info.excerpt = candidate.label || info.description; }
  const sourceLabel = `${source.name} · ${source.url}`;
  const destination = options.existingHint
    ? { status: publicStatus(options.existingHint) === "expired_invalid" ? "expired" : "active", checkedAt: options.existingHint.last_checked_at || nowIso(), finalUrl: options.existingHint.final_url || originalUrl, reason: "URL/reward_key já existente; validação de destino já registrada." }
    : await verifyRewardDestination(candidate.redemption_url || originalUrl, game);
  const messengerExclusive = game.slug === "match-masters" && destination.classification === "messenger_exclusive";
  const rewardDescription = messengerExclusive ? `${MATCH_MASTERS_MESSENGER_NOTE}${info.description ? ` · ${info.description}` : ""}` : info.description;
  const isKnownMonopolyProblem = game.slug === "monopoly-go" && normalizeUrl(originalUrl) === normalizeUrl(MONOPOLY_GO_PROBLEM_URL);
  const finalUrl = game.slug === "match-masters"
    ? (isCode ? "" : (matchMastersCanonicalUrl(destination.finalUrl || candidate.redemption_url || originalUrl) || destination.finalUrl || candidate.redemption_url || originalUrl))
    : (destination.finalUrl || candidate.redemption_url || originalUrl);
  const normalizedFinalUrl = normalizeUrl(finalUrl);
  const rewardKey = isCode ? codeKey(game, candidate.code) : game.slug === "travel-town" ? "travel_town:" + (normalizedFinalUrl || normalizedUrl) : "url:" + (normalizedFinalUrl || normalizedUrl);
  let existing = options.existingHint || (options.existingHintChecked ? null : (game.slug === "match-masters" && isCode
    ? await env.DB.prepare("SELECT * FROM rewards WHERE game_id = ? AND (reward_key = ? OR (reward_code = ? AND reward_code <> '')) LIMIT 1")
      .bind(game.id, rewardKey, candidate.code || "").first()
    : game.slug === "travel-town" && !isCode
    ? await env.DB.prepare("SELECT * FROM rewards WHERE game_id = ? AND (reward_key = ? OR normalized_url = ? OR final_url = ?) LIMIT 1")
      .bind(game.id, rewardKey, normalizedUrl, normalizedFinalUrl).first()
    : game.slug === "coin-master" && !isCode
    ? await env.DB.prepare("SELECT * FROM rewards WHERE game_id = ? AND (reward_key = ? OR normalized_url = ? OR final_url = ?) LIMIT 1")
      .bind(game.id, rewardKey, normalizedUrl, normalizedFinalUrl).first()
    : ["dice-dreams", "monopoly-go"].includes(game.slug) && !isCode
      ? await env.DB.prepare("SELECT * FROM rewards WHERE reward_key = ? OR normalized_url = ? OR final_url = ? OR normalized_url = ? LIMIT 1")
        .bind(rewardKey, normalizedUrl, normalizedFinalUrl, normalizedFinalUrl).first()
      : await env.DB.prepare("SELECT * FROM rewards WHERE reward_key = ? OR normalized_url = ? OR final_url = ? OR normalized_url = ? OR (reward_code = ? AND game_id = ?) LIMIT 1")
        .bind(rewardKey, normalizedUrl, normalizedFinalUrl, normalizedFinalUrl, candidate.code || "", game.id).first()));
  if (!existing && !options.existingHintChecked && game.slug === "match-masters" && !isCode) {
    const legacyRows = (await env.DB.prepare("SELECT * FROM rewards WHERE game_id = ?").bind(game.id).all()).results;
    existing = legacyRows.find((row) => [row.original_url, row.url, row.normalized_url, row.final_url, row.redemption_url]
      .some((value) => matchMastersCanonicalUrl(value) === matchMastersCanonicalUrl(finalUrl))) || null;
  }
  if (existing) {
    if (Number(existing.game_id) !== Number(game.id)) return { saved: false, duplicate: true, status: publicStatus(existing), cross_game: true, final_url: finalUrl, destination };
    const existingStatus = publicStatus(existing);
    const candidateIndicatesExpired = game.slug === "coin-master" ? coinMasterExpiredOfferSignal.test(candidate.label || "") : /(?:expired|expir(?:ou|ed)|invalid|unavailable|no longer available)/i.test(candidate.label || "");
    const expired = destination.status === "expired" || candidateIndicatesExpired;
    const nextStatus = isKnownMonopolyProblem ? "unknown" : messengerExclusive ? "unknown" : existingStatus === "expired_invalid" || expired ? "expired_invalid" : existingStatus;
    const preserveExistingMatchMastersDate = game.slug === "match-masters";
    const preserveExistingCoinMasterDate = game.slug === "coin-master" && !validDate(candidate.date_key);
    const preserveExistingRewardDate = preserveExistingMatchMastersDate || preserveExistingCoinMasterDate;
    const updateRewardDate = preserveExistingRewardDate ? "" : rewardDate;
    const updateRewardTime = preserveExistingRewardDate ? "" : parts.time;
    const classificationStatement = messengerExclusive
      ? env.DB.prepare("UPDATE rewards SET reward_description = CASE WHEN instr(lower(reward_description), 'gg_classification:messenger-exclusive') > 0 THEN reward_description WHEN reward_description = '' THEN ? ELSE reward_description || ' · ' || ? END, reward_status = 'unknown', status = 'unconfirmed', link_status = CASE WHEN link_status = 'expired' THEN link_status ELSE 'unverified' END WHERE id = ?").bind(MATCH_MASTERS_MESSENGER_NOTE, MATCH_MASTERS_MESSENGER_NOTE, existing.id)
      : null;
    const updateStatement = env.DB.prepare("UPDATE rewards SET source = ?, source_id = COALESCE(source_id, ?), source_excerpt = COALESCE(NULLIF(source_excerpt, ''), ?), type = CASE WHEN type = '' THEN ? ELSE type END, quantity = CASE WHEN quantity = '' THEN ? ELSE quantity END, reward_type = CASE WHEN reward_type = '' THEN ? ELSE reward_type END, reward_amount = CASE WHEN reward_amount = '' THEN ? ELSE reward_amount END, reward_description = CASE WHEN reward_description = '' THEN ? ELSE reward_description END, reward_code = CASE WHEN reward_code = '' THEN ? ELSE reward_code END, reward_key = CASE WHEN reward_key = '' THEN ? ELSE reward_key END, final_url = CASE WHEN final_url = '' THEN ? ELSE final_url END, redemption_url = CASE WHEN redemption_url = '' THEN ? ELSE redemption_url END, image = CASE WHEN image = '' THEN ? ELSE image END, image_source = CASE WHEN image_source = '' AND ? <> '' THEN 'source' ELSE image_source END, last_checked_at = ?, link_status = ?, reward_status = ?, status = ?, expiry_reason = CASE WHEN ? THEN ? ELSE expiry_reason END, expired_at = CASE WHEN ? THEN COALESCE(expired_at, ?) ELSE expired_at END, date_key = CASE WHEN ? <> '' THEN ? ELSE date_key END, time_label = CASE WHEN ? <> '' THEN ? ELSE time_label END WHERE id = ?")
      .bind(mergeSources(existing.source, sourceLabel), source.id, info.excerpt, info.type, info.quantity, info.type, info.amount, rewardDescription, candidate.code || "", rewardKey, finalUrl, candidate.redemption_url || "", candidate.image || "", candidate.image || "", destination.checkedAt, expired ? "expired" : destination.status === "active" ? "active" : "unverified", nextStatus, nextStatus === "confirmed" ? "confirmed" : nextStatus === "expired_invalid" ? "expired_invalid" : "unconfirmed", expired, destination.reason || "Fonte indica recompensa expirada.", expired, destination.checkedAt, updateRewardDate, updateRewardDate, updateRewardTime, updateRewardTime, existing.id);
    if (options.deferWrite) return { saved: false, duplicate: true, status: nextStatus, final_url: finalUrl, destination, statement: updateStatement, classification_statement: classificationStatement };
    await updateStatement.run();
    if (classificationStatement) await classificationStatement.run();
    if (isKnownMonopolyProblem) await env.DB.prepare("UPDATE rewards SET link_status = 'problem', reward_status = 'unknown', status = 'unconfirmed', expiry_reason = ?, expired_at = NULL WHERE id = ?").bind(MONOPOLY_GO_PROBLEM_REASON, existing.id).run();
    return { saved: false, duplicate: true, status: nextStatus, final_url: finalUrl, destination };
  }
  const candidateIndicatesExpired = game.slug === "coin-master" ? coinMasterExpiredOfferSignal.test(candidate.label || "") : /(?:expired|expir(?:ou|ed)|invalid|unavailable|no longer available)/i.test(candidate.label || "");
  const expired = destination.status === "expired" || candidateIndicatesExpired;
  const linkStatus = isKnownMonopolyProblem ? "problem" : expired ? "expired" : destination.status === "active" ? "active" : "unverified";
  const rewardStatus = isKnownMonopolyProblem ? "unknown" : expired ? "expired_invalid" : "unknown";
  const insertStatement = env.DB.prepare("INSERT INTO rewards (game_id, name, type, quantity, reward_type, reward_amount, reward_description, image, url, source, date_key, time_label, status, user_id, verified_at, original_url, normalized_url, source_id, source_excerpt, found_at, last_checked_at, link_status, reward_status, reward_code, reward_key, final_url, redemption_url, image_source, expiry_reason, expired_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(game.id, info.name, info.type, info.quantity, info.type, info.amount, rewardDescription, candidate.image || "", originalUrl, sourceLabel, rewardDate, parts.time, rewardStatus === "expired_invalid" ? "expired_invalid" : "unconfirmed", originalUrl, normalizedUrl, source.id, info.excerpt, foundAt, destination.checkedAt, linkStatus, rewardStatus, candidate.code || "", rewardKey, finalUrl, candidate.redemption_url || "", candidate.image ? "source" : "", isKnownMonopolyProblem ? MONOPOLY_GO_PROBLEM_REASON : expired ? (destination.reason || "Fonte indica recompensa expirada.") : "", isKnownMonopolyProblem || expired ? destination.checkedAt : null);
  if (options.deferWrite) return { saved: true, duplicate: false, destination: destination.status, validation_status: expired ? "expired" : destination.status, final_url: finalUrl, destination_result: destination, statement: insertStatement };
  const result = await insertStatement.run();
  return result.meta?.changes ? { saved: true, duplicate: false, destination: destination.status, validation_status: expired ? "expired" : destination.status, final_url: finalUrl, destination_result: destination } : { saved: false, duplicate: true, final_url: finalUrl, destination };
}
async function fetchSource(source) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(source.url, { redirect: "follow", signal: controller.signal, headers: { accept: "text/html,application/json;q=0.9,text/plain;q=0.8", "user-agent": "GameGiftsCollector/1.0" } });
    const body = await response.text();
    if (body.length > 2_000_000) throw new Error("Resposta maior que o limite de 2 MB.");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { status: response.status, body };
  } finally { clearTimeout(timeout); }
}
async function collectOneSource(env, source, options = {}) {
  const startedAt = nowIso();
  const foundAt = startedAt;
  let httpStatus = null;
  let linksFound = 0;
  let rewardKeysFound = 0;
  let matchMastersLinksFound = 0;
  let matchMastersDiscarded = 0;
  let matchMastersPublished = 0;
  let newLinksSaved = 0;
  let newLinksUnconfirmed = 0;
  let newLinksExpired = 0;
  let duplicatesIgnored = 0;
  let error = "";
  const diagnostics = [];
  const matchMastersDiscardReasons = [];
  const expirationDiagnostics = [];
  const deferredStatements = [];
  try {
    const game = await env.DB.prepare("SELECT id, slug, name, reward_mode FROM games WHERE id = ? AND active = 1").bind(source.game_id).first();
    if (!game) throw new Error("Jogo da fonte não encontrado ou inativo.");
    if (game.slug === "travel-town") await repairTravelTownLegacyRewards(env, game);
    const fetched = await fetchSource(source);
    httpStatus = fetched.status;
    const extractedCandidates = extractCandidates(fetched.body, source, game);
    const candidates = game.slug === "dice-dreams"
      ? extractedCandidates.filter((candidate) => isRecentDiceDreamsDate(candidate.date_key))
      : game.slug === "match-masters"
        ? extractedCandidates.filter((candidate) => !candidate.date_key || isRecentMatchMastersDate(candidate.date_key))
        : extractedCandidates;
    const candidatesToVerify = candidates;
    if (game.slug === "match-masters") {
      rewardKeysFound = candidates.filter((candidate) => Boolean(candidate.code)).length;
      matchMastersLinksFound = candidates.length - rewardKeysFound;
    }
    const matchMastersRewardSnapshot = game.slug === "match-masters" && options.save !== false
      ? (await env.DB.prepare("SELECT * FROM rewards").all()).results
      : null;
    linksFound = candidates.length;
    if (options.save !== false) {
      for (const candidate of candidatesToVerify) {
        const resolvedCandidate = game.slug === "match-masters" ? (candidate.code ? { ...candidate, resolution_status: "resolved", resolution_reason: "Reward Key sem URL de presente; destino oficial separado para resgate." } : await resolveMatchMastersCandidate(candidate)) : game.slug === "travel-town" ? await resolveTravelTownCandidate(candidate) : candidate;
        if (resolvedCandidate.resolution_status === "rejected") {
          if (game.slug === "match-masters") {
            matchMastersDiscarded++;
            matchMastersDiscardReasons.push({ kind: resolvedCandidate.code ? "code" : "link", discovered_url: candidate.discovered_url || candidate.url || "", reward_key: resolvedCandidate.code ? codeKey(game, resolvedCandidate.code) : "", reason: resolvedCandidate.resolution_reason });
          }
          const result = { saved: false, duplicate: false, resolution_status: "rejected", resolution_reason: resolvedCandidate.resolution_reason };
          diagnostics.push({ source: source.name, kind: candidate.code ? "code" : "link", quantity: candidate.quantity || extractExplicitReward(candidate.label).amount || "", source_date: candidate.date_key || "", original_url: candidate.discovered_url || candidate.url, discovered_url: candidate.discovered_url || candidate.url, final_url: "", reward_key: candidate.code ? codeKey(game, candidate.code) : "", outcome: "rejected", reason: resolvedCandidate.resolution_reason });
          if (game.slug === "match-masters") logMatchMastersCandidate(source, candidate, result);
          continue;
        }
        const existingHint = matchMastersRewardSnapshot && !resolvedCandidate.code
          ? findMatchMastersExistingReward(matchMastersRewardSnapshot, `url:${normalizeUrl(resolvedCandidate.url)}`, normalizeUrl(resolvedCandidate.url), normalizeUrl(resolvedCandidate.url), resolvedCandidate.url)
          : null;
        const result = await saveDiscoveredReward(env, source, game, resolvedCandidate, foundAt, { existingHint, existingHintChecked: Boolean(matchMastersRewardSnapshot), deferWrite: game.slug === "match-masters" });
        if (result.statement) deferredStatements.push(result.statement);
        if (result.classification_statement) deferredStatements.push(result.classification_statement);
        if (result.saved) newLinksSaved++;
        if (game.slug === "match-masters" && result.saved) matchMastersPublished++;
        if (result.duplicate) duplicatesIgnored++;
        if (game.slug === "match-masters" && result.duplicate) {
          matchMastersDiscarded++;
          matchMastersDiscardReasons.push({ kind: resolvedCandidate.code ? "code" : "link", discovered_url: candidate.discovered_url || candidate.url || "", final_url: result.final_url || "", reward_key: resolvedCandidate.code ? codeKey(game, resolvedCandidate.code) : `url:${normalizeUrl(result.final_url || resolvedCandidate.url)}`, reason: "Duplicata por reward_key/URL final normalizada." });
        }
        const validationStatus = result.validation_status || result.destination_result?.status || result.destination?.status || "unverified";
        if (result.saved && validationStatus === "expired") {
          newLinksExpired++;
          expirationDiagnostics.push({ url: candidate.url, reason: result.destination_result?.reason || "A oferta foi marcada como expirada por evidência explícita." });
        } else if (result.saved && validationStatus !== "active") {
          newLinksUnconfirmed++;
        }
        if (game.slug === "travel-town") {
          const parsedInfo = extractExplicitReward(candidate.label);
          diagnostics.push({ source: source.name, quantity: candidate.quantity || parsedInfo.amount || "", source_date: candidate.date_key || "", original_url: candidate.discovered_url || candidate.url, final_url: result.final_url || "", reward_key: `travel_town:${normalizeUrl(result.final_url || resolvedCandidate.url)}`, outcome: result.duplicate ? "duplicate" : result.saved ? "new" : "not_saved" });
        }
        if (game.slug === "match-masters") {
          diagnostics.push({ source: source.name, kind: candidate.code ? "code" : "link", discovered_url: candidate.discovered_url || candidate.url, final_url: result.final_url || "", reward_key: candidate.code ? codeKey(game, candidate.code) : `url:${normalizeUrl(result.final_url || resolvedCandidate.url)}`, outcome: result.duplicate ? "duplicate" : result.saved ? "new" : "not_saved", validation: result.destination_result?.status || result.destination?.status || "unknown", reason: result.destination_result?.reason || result.destination?.reason || (result.duplicate ? "URL/reward_key já existente." : "URL processada pelo coletor.") });
          logMatchMastersCandidate(source, candidate, result);
        }
      }
    }
    if (deferredStatements.length) await env.DB.batch(deferredStatements);
    if (game.slug === "travel-town") {
      await env.DB.prepare("UPDATE rewards SET quantity = '', reward_amount = '', reward_description = CASE WHEN reward_description = '' OR instr(lower(reward_description), '30 free energy') > 0 OR instr(lower(source_excerpt), '30 free energy') > 0 THEN 'Energia grátis encontrada em uma fonte anterior.' ELSE reward_description END WHERE game_id = ? AND instr(lower(source), 'mobilegamecentral.com') > 0 AND instr(lower(source), 'traveltowncard.com') = 0").bind(game.id).run();
    }
  } catch (caught) { error = String(caught?.message || caught || "Erro desconhecido").slice(0, 500); }
  const finishedAt = nowIso();
  await env.DB.prepare("UPDATE sources SET last_checked_at = ?, last_success_at = CASE WHEN ? = '' THEN ? ELSE last_success_at END, last_error = ? WHERE id = ?")
    .bind(finishedAt, error, error ? "" : finishedAt, error || null, source.id).run();
  await env.DB.prepare("INSERT INTO collection_logs (started_at, finished_at, source_id, http_status, links_found, new_links_saved, duplicates_ignored, error) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(startedAt, finishedAt, source.id, httpStatus, linksFound, newLinksSaved, duplicatesIgnored, error || null).run();
  return { source_id: source.id, name: source.name, url: source.url, http_status: httpStatus, links_found: linksFound, reward_keys_found: rewardKeysFound, match_masters_links_found: matchMastersLinksFound, match_masters_codes_found: rewardKeysFound, match_masters_discarded: matchMastersDiscarded, match_masters_discard_reasons: matchMastersDiscardReasons, match_masters_published: matchMastersPublished, new_links_saved: newLinksSaved, new_links_unconfirmed: newLinksUnconfirmed, new_links_expired: newLinksExpired, duplicates_ignored: duplicatesIgnored, expiration_diagnostics: expirationDiagnostics, error: error || null, diagnostics, started_at: startedAt, finished_at: finishedAt };
}
async function revalidateCoinMasterRewards(env) {
  const cutoff = new Date(Date.now() - COLLECTION_INTERVAL_MS).toISOString();
  const rows = (await env.DB.prepare(`SELECT r.*, g.slug FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.slug = 'coin-master' AND r.link_status <> 'expired' AND r.url <> '' AND (r.last_checked_at IS NULL OR r.last_checked_at < ?) ORDER BY r.date_key DESC, r.created_at DESC LIMIT ${COIN_MASTER_MAX_REVALIDATIONS}`).bind(cutoff).all()).results;
  const metrics = { checked: 0, expired: 0, unconfirmed: 0, active: 0, expirations: [] };
  for (const reward of rows) {
    const checked = await verifyRewardDestination(reward.url, { slug: "coin-master" });
    metrics.checked++;
    if (checked.status === "expired") {
      metrics.expired++;
      metrics.expirations.push({ reward_id: reward.id, url: reward.url, reason: checked.reason || "Evidência explícita de expiração na página de destino." });
      await env.DB.prepare("UPDATE rewards SET last_checked_at = ?, link_status = 'expired', reward_status = 'expired_invalid', status = 'expired_invalid', expiry_reason = ?, expired_at = COALESCE(expired_at, ?) WHERE id = ?")
        .bind(checked.checkedAt, checked.reason || "Evidência explícita de expiração na página de destino.", checked.checkedAt, reward.id).run();
    } else if (checked.status === "active") {
      metrics.active++;
      await env.DB.prepare("UPDATE rewards SET last_checked_at = ?, link_status = 'active', final_url = COALESCE(NULLIF(?, ''), final_url) WHERE id = ?")
        .bind(checked.checkedAt, checked.finalUrl || "", reward.id).run();
    } else {
      metrics.unconfirmed++;
      await env.DB.prepare("UPDATE rewards SET last_checked_at = ?, link_status = 'unverified', reward_status = CASE WHEN reward_status = 'confirmed' THEN reward_status ELSE 'unknown' END, status = CASE WHEN reward_status = 'confirmed' THEN 'confirmed' ELSE 'unconfirmed' END WHERE id = ?")
        .bind(checked.checkedAt, reward.id).run();
    }
  }
  return metrics;
}
async function repairCoinMasterAgeExpirations(env) {
  const result = await env.DB.prepare("UPDATE rewards SET link_status = 'unverified', reward_status = 'unknown', status = 'unconfirmed', expiry_reason = '', expired_at = NULL WHERE game_id IN (SELECT id FROM games WHERE slug = 'coin-master') AND link_status = 'expired' AND (lower(expiry_reason) LIKE '%mais de 3 dias%' OR lower(expiry_reason) LIKE '%mudança de dia%' OR lower(expiry_reason) LIKE '%mudanca de dia%')").run();
  return Number(result?.meta?.changes || 0);
}
async function repairMatchMastersDateDrift(env) {
  const result = await env.DB.prepare("UPDATE rewards SET date_key = substr(created_at, 1, 10), time_label = substr(created_at, 12, 5) WHERE game_id IN (SELECT id FROM games WHERE slug = 'match-masters') AND reward_key LIKE 'url:https://launch.matchmasters.com/l/p/%' AND date_key > substr(created_at, 1, 10)").run();
  return Number(result?.meta?.changes || 0);
}
async function repairKnownMatchMastersMessengerRewards(env) {
  const rows = (await env.DB.prepare("SELECT id, reward_description, link_status FROM rewards WHERE game_id IN (SELECT id FROM games WHERE slug = 'match-masters') AND (lower(reward_description) LIKE '%gg_manual:requires-facebook%' OR lower(reward_description) LIKE '%pediu conexão com facebook%') AND lower(reward_description) NOT LIKE '%gg_classification:messenger-exclusive%'").all()).results;
  let repaired = 0;
  for (const row of rows) {
    const hasClassification = /gg_classification:messenger-exclusive/i.test(String(row.reward_description || ""));
    const description = hasClassification ? row.reward_description : `${row.reward_description || ""} · ${MATCH_MASTERS_MESSENGER_NOTE}`.replace(/^ · /, "");
    const result = await env.DB.prepare("UPDATE rewards SET reward_description = ?, reward_status = CASE WHEN link_status = 'expired' THEN reward_status ELSE 'unknown' END, status = CASE WHEN link_status = 'expired' THEN status ELSE 'unconfirmed' END, link_status = CASE WHEN link_status = 'expired' THEN link_status ELSE 'unverified' END WHERE id = ?").bind(description, row.id).run();
    repaired += Number(result?.meta?.changes || 0);
  }
  return repaired;
}
async function revalidateMatchMastersRewards(env) {
  const cutoff = new Date(Date.now() - COLLECTION_INTERVAL_MS).toISOString();
  const rows = (await env.DB.prepare(`SELECT r.* FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.slug = 'match-masters' AND r.link_status <> 'expired' AND r.url <> '' AND (r.last_checked_at IS NULL OR r.last_checked_at < ?) ORDER BY r.date_key DESC, r.created_at DESC LIMIT ${MATCH_MASTERS_MAX_REVALIDATIONS}`).bind(cutoff).all()).results;
  const metrics = { checked: 0, active: 0, unconfirmed: 0, messenger_exclusive: 0, expired: 0, expirations: [] };
  for (const reward of rows) {
    const checked = await verifyRewardDestination(reward.url, { slug: "match-masters" });
    metrics.checked++;
    if (checked.status === "expired") {
      metrics.expired++;
      metrics.expirations.push({ reward_id: reward.id, url: reward.url, reason: checked.reason || "O destino informou que a recompensa expirou." });
      await env.DB.prepare("UPDATE rewards SET last_checked_at = ?, link_status = 'expired', reward_status = 'expired_invalid', status = 'expired_invalid', expiry_reason = ?, expired_at = COALESCE(expired_at, ?) WHERE id = ?").bind(checked.checkedAt, checked.reason || "O destino informou que a recompensa expirou.", checked.checkedAt, reward.id).run();
    } else if (checked.classification === "messenger_exclusive") {
      metrics.messenger_exclusive++;
      await env.DB.prepare("UPDATE rewards SET last_checked_at = ?, reward_description = CASE WHEN instr(lower(reward_description), 'gg_classification:messenger-exclusive') > 0 THEN reward_description WHEN reward_description = '' THEN ? ELSE reward_description || ' · ' || ? END, link_status = 'unverified', reward_status = 'unknown', status = 'unconfirmed' WHERE id = ?").bind(checked.checkedAt, MATCH_MASTERS_MESSENGER_NOTE, MATCH_MASTERS_MESSENGER_NOTE, reward.id).run();
    } else if (checked.status === "active") {
      metrics.active++;
      await env.DB.prepare("UPDATE rewards SET last_checked_at = ?, final_url = COALESCE(NULLIF(?, ''), final_url) WHERE id = ?").bind(checked.checkedAt, checked.finalUrl || "", reward.id).run();
    } else {
      metrics.unconfirmed++;
      await env.DB.prepare("UPDATE rewards SET last_checked_at = ?, link_status = 'unverified', reward_status = CASE WHEN reward_status = 'confirmed' THEN reward_status ELSE 'unknown' END, status = CASE WHEN reward_status = 'confirmed' THEN 'confirmed' ELSE 'unconfirmed' END WHERE id = ?").bind(checked.checkedAt, reward.id).run();
    }
  }
  return metrics;
}
async function checkSources(env, sourceId = null) {
  const startedAt = nowIso();
  const coinMasterAgeExpirationsRepaired = await repairCoinMasterAgeExpirations(env);
  const matchMastersDateDriftRepaired = await repairMatchMastersDateDrift(env);
  const matchMastersMessengerRewardsRepaired = await repairKnownMatchMastersMessengerRewards(env);
  const query = sourceId ? env.DB.prepare("SELECT * FROM sources WHERE id = ? AND active = 1").bind(sourceId) : env.DB.prepare("SELECT * FROM sources WHERE active = 1 ORDER BY id");
  const sources = (await query.all()).results;
  const results = [];
  for (const source of sources) {
    try {
      results.push(await collectOneSource(env, source));
    } catch (error) {
      results.push({ source_id: source.id, name: source.name, url: source.url, http_status: null, links_found: 0, new_links_saved: 0, new_links_unconfirmed: 0, new_links_expired: 0, duplicates_ignored: 0, expiration_diagnostics: [], error: String(error?.message || error || "Falha ao consultar a fonte.").slice(0, 500), diagnostics: [], started_at: startedAt, finished_at: nowIso() });
    }
  }
  let coinMasterRevalidation;
  try {
    coinMasterRevalidation = await revalidateCoinMasterRewards(env);
  } catch (error) {
    coinMasterRevalidation = { checked: 0, expired: 0, unconfirmed: 0, active: 0, expirations: [], error: String(error?.message || error || "Falha na revalidação do Coin Master.").slice(0, 500) };
  }
  let matchMastersRevalidation;
  try {
    matchMastersRevalidation = await revalidateMatchMastersRewards(env);
  } catch (error) {
    matchMastersRevalidation = { checked: 0, active: 0, unconfirmed: 0, messenger_exclusive: 0, expired: 0, expirations: [], error: String(error?.message || error || "Falha na revalidação do Match Masters.").slice(0, 500) };
  }
  const finishedAt = nowIso();
  if (!sources.length) {
    await env.DB.prepare("INSERT INTO collection_logs (started_at, finished_at, source_id, http_status, links_found, new_links_saved, duplicates_ignored, error) VALUES (?, ?, NULL, NULL, 0, 0, 0, ?)")
      .bind(startedAt, finishedAt, sourceId ? "Fonte não encontrada ou inativa." : "Nenhuma fonte ativa cadastrada.").run();
  }
  return {
    started_at: startedAt,
    finished_at: finishedAt,
    scheduler_supported: true,
    sources_consulted: results.length,
    sources_succeeded: results.filter((item) => !item.error).length,
    sources_failed: results.filter((item) => Boolean(item.error)).length,
    candidate_links: results.reduce((sum, item) => sum + item.links_found, 0),
    match_masters_links_found: results.reduce((sum, item) => sum + (item.match_masters_links_found || 0), 0),
    match_masters_codes_found: results.reduce((sum, item) => sum + (item.match_masters_codes_found || 0), 0),
    match_masters_candidates_discarded: results.reduce((sum, item) => sum + (item.match_masters_discarded || 0), 0),
    match_masters_discard_reasons: results.flatMap((item) => item.match_masters_discard_reasons || []),
    match_masters_published: results.reduce((sum, item) => sum + (item.match_masters_published || 0), 0),
    new_links_saved: results.reduce((sum, item) => sum + item.new_links_saved, 0),
    new_links_unconfirmed: results.reduce((sum, item) => sum + item.new_links_unconfirmed, 0),
    new_links_expired: results.reduce((sum, item) => sum + item.new_links_expired, 0),
    duplicates_ignored: results.reduce((sum, item) => sum + item.duplicates_ignored, 0),
    expiration_diagnostics: results.flatMap((item) => item.expiration_diagnostics || []),
    coin_master_age_expirations_repaired: coinMasterAgeExpirationsRepaired,
    match_masters_date_drift_repaired: matchMastersDateDriftRepaired,
    match_masters_messenger_rewards_repaired: matchMastersMessengerRewardsRepaired,
    coin_master_revalidation: coinMasterRevalidation,
    match_masters_revalidation: matchMastersRevalidation,
    results,
  };
}
async function collectDueSources(env) {
  if (collectionInFlight) return collectionInFlight;
  const due = await env.DB.prepare("SELECT id FROM sources WHERE active = 1 AND (last_checked_at IS NULL OR last_checked_at < ?) LIMIT 1")
    .bind(new Date(Date.now() - COLLECTION_INTERVAL_MS).toISOString()).first();
  if (!due) return null;
  collectionInFlight = checkSources(env).finally(() => { collectionInFlight = null; });
  return collectionInFlight;
}
async function collectTravelTownBootstrap(env) {
  const source = await env.DB.prepare("SELECT s.* FROM sources s JOIN games g ON g.id = s.game_id WHERE s.active = 1 AND g.slug = 'travel-town' ORDER BY s.id LIMIT 1").first();
  if (!source) return null;
  const recent = await env.DB.prepare("SELECT COUNT(*) AS count FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.slug = 'travel-town' AND r.link_status <> 'expired' AND r.date_key >= ?").bind(new Date(Date.now() - TRAVEL_TOWN_RECENT_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)).first("count");
  if (Number(recent || 0) >= 2) return null;
  if (collectionInFlight) return collectionInFlight;
  collectionInFlight = collectOneSource(env, source).finally(() => { collectionInFlight = null; });
  return collectionInFlight;
}

export default {
  async scheduled(_controller, env) {
    await ensureDataSchema(env);
    try {
      const result = await collectDueSources(env);
      if (result) {
        console.log(`[GAME GIFTS][scheduler] coleta diária concluída: ${result.sources_succeeded}/${result.sources_consulted} fontes, ${result.new_links_saved} novos links, ${result.new_links_expired} expirados.`);
      } else {
        console.log("[GAME GIFTS][scheduler] coleta diária ignorada: fontes ainda dentro da janela de 24 horas.");
      }
    } catch (error) {
      console.error("[GAME GIFTS][scheduler] falha na coleta diária", error);
    }
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      await ensureDataSchema(env);
      if (request.method === "GET" && url.pathname === "/api/data") {
        collectDueSources(env).catch((error) => console.error("Automatic collection failed", error));
        await collectTravelTownBootstrap(env).catch((error) => console.error("Travel Town collection failed", error));
        const identity = voterIdentity(request);
        const voteMaps = await allVoteSummaries(env, identity.userId);
        const games = await env.DB.prepare(`SELECT id, name, slug, image, banner, description, reward_mode, active, created_at FROM games WHERE active = 1 ORDER BY CASE slug ${catalogOrder} ELSE 99 END`).all();
        const rewards = await env.DB.prepare("SELECT r.*, g.name AS game_name, g.slug AS game_slug FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.active = 1 ORDER BY r.date_key DESC, r.time_label DESC, r.created_at DESC").all();
        return jsonForVoter({ games: games.results.map(gameFields), rewards: rewards.results.map((reward) => ({ ...rewardFields(reward), confirmation: voteMaps.byReward.get(Number(reward.id)) || { worked: 0, failed: 0, recent_failed: 0, status: "unconfirmed", my_vote: null, game_my_vote: voteMaps.byGame.get(Number(reward.game_id)) || null } })) }, identity);
      }
      if (request.method === "POST" && url.pathname.match(/^\/api\/rewards\/\d+\/vote$/)) {
        const identity = voterIdentity(request);
        const rewardId = asId(url.pathname.split("/").at(-2));
        const body = await readBody(request);
        const vote = String(body?.vote || "").trim().toLowerCase();
        if (!rewardId || !["worked", "failed"].includes(vote)) return jsonForVoter({ error: "Voto inválido." }, identity, 400);
        const reward = await env.DB.prepare("SELECT r.id, r.game_id FROM rewards r JOIN games g ON g.id = r.game_id WHERE r.id = ? AND g.active = 1 LIMIT 1").bind(rewardId).first();
        if (!reward) return jsonForVoter({ error: "Recompensa não encontrada." }, identity, 404);
        const result = await env.DB.prepare("INSERT INTO reward_votes (reward_id, game_id, user_id, vote) VALUES (?, ?, ?, ?) ON CONFLICT (game_id, user_id) DO NOTHING").bind(rewardId, reward.game_id, identity.userId, vote).run();
        const summary = await voteSummary(env, rewardId, identity.userId);
        if (Number(result?.meta?.changes || 0) === 0) return jsonForVoter({ error: "Você já votou neste jogo.", code: "already_voted_game", confirmation: summary }, identity, 409);
        return jsonForVoter({ ok: true, saved: Number(result?.meta?.changes || 0) > 0, confirmation: summary }, identity, 200);
      }
      if (request.method === "GET" && url.pathname === "/api/admin/session") return json({ isOwner: isOwner(request), username: request.headers.get("x-websim-username") || null });
      if (request.method === "GET" && url.pathname === "/api/admin/data") {
        const denied = ownerRequired(request); if (denied) return denied;
        const games = await env.DB.prepare("SELECT * FROM games ORDER BY name COLLATE NOCASE").all();
        const rewards = await env.DB.prepare("SELECT r.*, g.name AS game_name FROM rewards r JOIN games g ON g.id = r.game_id ORDER BY r.date_key DESC, r.created_at DESC").all();
        const sources = await env.DB.prepare("SELECT s.*, g.name AS game_name FROM sources s JOIN games g ON g.id = s.game_id ORDER BY g.name COLLATE NOCASE, s.name COLLATE NOCASE").all();
        const logs = await env.DB.prepare("SELECT l.*, s.name AS source_name FROM collection_logs l LEFT JOIN sources s ON s.id = l.source_id ORDER BY l.started_at DESC LIMIT 50").all();
        return json({ games: games.results.map(gameFields), rewards: rewards.results.map(rewardFields), sources: sources.results.map((source) => ({ ...source, active: Boolean(source.active) })), logs: logs.results, scheduler_supported: true });
      }
      if (request.method === "POST" && url.pathname === "/api/admin/collect") {
        const denied = ownerRequired(request); if (denied) return denied;
        const body = await readBody(request);
        const sourceId = body?.source_id ? asId(body.source_id) : null;
        return json(await checkSources(env, sourceId));
      }
      if (request.method === "POST" && url.pathname === "/api/admin/games") {
        const denied = ownerRequired(request); if (denied) return denied;
        const body = await readBody(request); const name = String(body?.name ?? "").trim(); const slug = String(body?.slug ?? "").trim().toLowerCase(); const rewardMode = ["links", "codes", "none"].includes(body?.reward_mode) ? body.reward_mode : "links";
        if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return json({ error: "Informe um nome e um slug válido." }, { status: 400 });
        await env.DB.prepare("INSERT INTO games (name, slug, image, banner, description, reward_mode, active, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(name, slug, String(body.image ?? "").trim(), String(body.banner ?? "").trim(), String(body.description ?? "").trim(), rewardMode, body.active === false ? 0 : 1, request.headers.get("x-websim-user-id")).run();
        return json({ game: gameFields(await env.DB.prepare("SELECT * FROM games WHERE slug = ?").bind(slug).first()) }, { status: 201 });
      }
      if (request.method === "PATCH" && url.pathname.startsWith("/api/admin/games/")) {
        const denied = ownerRequired(request); if (denied) return denied;
        const id = asId(url.pathname.split("/").pop()); const body = await readBody(request); if (!id || !body) return json({ error: "Dados inválidos." }, { status: 400 });
        const current = await env.DB.prepare("SELECT * FROM games WHERE id = ?").bind(id).first(); if (!current) return json({ error: "Jogo não encontrado." }, { status: 404 });
        const name = String(body.name ?? current.name).trim(); const slug = String(body.slug ?? current.slug).trim().toLowerCase(); const rewardMode = ["links", "codes", "none"].includes(body.reward_mode) ? body.reward_mode : current.reward_mode || "links"; if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return json({ error: "Nome ou slug inválido." }, { status: 400 });
        const currentCover = String(current.image || '').trim();
        const image = isCoverLocked(current) ? currentCover : String(body.image ?? currentCover).trim();
        await env.DB.prepare("UPDATE games SET name = ?, slug = ?, image = ?, banner = ?, description = ?, reward_mode = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(name, slug, image, String(body.banner ?? current.banner).trim(), String(body.description ?? current.description).trim(), rewardMode, body.active === false ? 0 : 1, id).run();
        return json({ game: gameFields(await env.DB.prepare("SELECT * FROM games WHERE id = ?").bind(id).first()) });
      }
      if (request.method === "POST" && url.pathname === "/api/admin/sources") {
        const denied = ownerRequired(request); if (denied) return denied;
        const body = await readBody(request); const gameId = asId(body?.game_id); const name = String(body?.name ?? "").trim(); const sourceUrl = String(body?.url ?? "").trim(); const parserType = ["html_links", "json_links", "direct_url", "html_codes", "json_codes", "direct_code"].includes(body?.parser_type) ? body.parser_type : "html_links";
        if (!gameId || !name || !validUrl(sourceUrl)) return json({ error: "Jogo, nome e URL pública da fonte são obrigatórios." }, { status: 400 });
        if (!await env.DB.prepare("SELECT id FROM games WHERE id = ?").bind(gameId).first()) return json({ error: "Jogo não encontrado." }, { status: 404 });
        await env.DB.prepare("INSERT INTO sources (game_id, name, url, active, parser_type, user_id) VALUES (?, ?, ?, ?, ?, ?)").bind(gameId, name, sourceUrl, body.active === false ? 0 : 1, parserType, request.headers.get("x-websim-user-id")).run();
        return json({ source: await env.DB.prepare("SELECT s.*, g.name AS game_name FROM sources s JOIN games g ON g.id = s.game_id WHERE s.rowid = last_insert_rowid()").first() }, { status: 201 });
      }
      if (request.method === "POST" && url.pathname.match(/^\/api\/admin\/sources\/\d+\/test$/)) {
        const denied = ownerRequired(request); if (denied) return denied;
        const id = asId(url.pathname.split("/").at(-2)); const source = id ? await env.DB.prepare("SELECT * FROM sources WHERE id = ?").bind(id).first() : null; if (!source) return json({ error: "Fonte não encontrada." }, { status: 404 });
        return json(await collectOneSource(env, source, { save: false }));
      }
      if (request.method === "PATCH" && url.pathname.match(/^\/api\/admin\/sources\/\d+$/)) {
        const denied = ownerRequired(request); if (denied) return denied;
        const id = asId(url.pathname.split("/").pop()); const body = await readBody(request); const current = id ? await env.DB.prepare("SELECT * FROM sources WHERE id = ?").bind(id).first() : null; if (!current || !body) return json({ error: "Fonte não encontrada." }, { status: 404 });
        const gameId = asId(body.game_id ?? current.game_id); const name = String(body.name ?? current.name).trim(); const sourceUrl = String(body.url ?? current.url).trim(); const parserType = ["html_links", "json_links", "direct_url", "html_codes", "json_codes", "direct_code"].includes(body.parser_type) ? body.parser_type : current.parser_type;
        if (!gameId || !name || !validUrl(sourceUrl)) return json({ error: "Dados da fonte inválidos." }, { status: 400 });
        await env.DB.prepare("UPDATE sources SET game_id = ?, name = ?, url = ?, active = ?, parser_type = ?, last_error = NULL WHERE id = ?").bind(gameId, name, sourceUrl, body.active === false ? 0 : 1, parserType, id).run();
        return json({ source: await env.DB.prepare("SELECT s.*, g.name AS game_name FROM sources s JOIN games g ON g.id = s.game_id WHERE s.id = ?").bind(id).first() });
      }
      if (request.method === "DELETE" && url.pathname.match(/^\/api\/admin\/sources\/\d+$/)) {
        const denied = ownerRequired(request); if (denied) return denied;
        const id = asId(url.pathname.split("/").pop()); if (!id) return json({ error: "Identificador inválido." }, { status: 400 });
        await env.DB.prepare("UPDATE collection_logs SET source_id = NULL WHERE source_id = ?").bind(id).run();
        await env.DB.prepare("DELETE FROM sources WHERE id = ?").bind(id).run(); return json({ ok: true });
      }
      if (request.method === "POST" && url.pathname === "/api/admin/rewards") {
        const denied = ownerRequired(request); if (denied) return denied;
        const body = await readBody(request); const gameId = asId(body?.game_id); const rewardUrl = String(body?.url ?? "").trim(); const rewardCode = String(body?.reward_code ?? "").trim(); const dateKey = String(body?.date_key ?? ""); const status = canonicalStatus(body?.status); if (!gameId || (!rewardUrl && !rewardCode) || (rewardUrl && !validUrl(rewardUrl)) || !validDate(dateKey)) return json({ error: "Informe um destino oficial válido ou o código exato, além da data." }, { status: 400 });
        const selectedGame = await env.DB.prepare("SELECT id, slug, reward_mode FROM games WHERE id = ?").bind(gameId).first();
        if (!selectedGame) return json({ error: "Jogo não encontrado." }, { status: 404 });
        if (selectedGame.reward_mode === "codes" && !rewardCode) return json({ error: "Códigos precisam ter o código exato informado pela fonte oficial." }, { status: 400 });
        if (selectedGame.reward_mode !== "codes" && rewardCode) return json({ error: "Código só pode ser cadastrado em jogos do tipo CÓDIGOS." }, { status: 400 });
        const normalized = normalizeUrl(rewardUrl); const rewardKey = rewardCode ? codeKey({ slug: selectedGame.slug || String(gameId) }, rewardCode) : "url:" + normalized; const duplicate = ["dice-dreams", "monopoly-go"].includes(selectedGame.slug) && !rewardCode
          ? await env.DB.prepare("SELECT * FROM rewards WHERE reward_key = ? OR normalized_url = ? OR final_url = ? OR normalized_url = ? LIMIT 1").bind(rewardKey, normalized, normalized, normalized).first()
          : await env.DB.prepare("SELECT * FROM rewards WHERE reward_key = ? OR normalized_url = ? OR final_url = ? OR (reward_code = ? AND game_id = ? AND ? <> '') LIMIT 1").bind(rewardKey, normalized, normalized, rewardCode, gameId, rewardCode).first(); const checkedAt = nowIso();
        if (duplicate) {
          if (Number(duplicate.game_id) !== Number(gameId)) return json({ error: "Esta URL já está cadastrada em outro jogo; não foi misturada ao catálogo." }, { status: 409 });
          await env.DB.prepare("UPDATE rewards SET source = ?, source_excerpt = ?, type = ?, quantity = ?, reward_type = COALESCE(NULLIF(?, ''), reward_type), reward_amount = COALESCE(NULLIF(?, ''), reward_amount), reward_description = COALESCE(NULLIF(?, ''), reward_description), image = ?, reward_code = COALESCE(NULLIF(?, ''), reward_code), last_checked_at = ? WHERE id = ?").bind(mergeSources(duplicate.source, body.source), String(body.source_excerpt ?? duplicate.source_excerpt ?? "").trim(), String(body.type ?? duplicate.type ?? "").trim(), String(body.quantity ?? duplicate.quantity ?? "").trim(), String(body.reward_type ?? "").trim(), String(body.reward_amount ?? "").trim(), String(body.reward_description ?? "").trim(), String(body.image ?? duplicate.image ?? "").trim(), rewardCode, checkedAt, duplicate.id).run();
          return json({ reward: rewardFields(await env.DB.prepare("SELECT r.*, g.name AS game_name FROM rewards r JOIN games g ON g.id = r.game_id WHERE r.id = ?").bind(duplicate.id).first()), duplicate: true });
        }
        const foundAt = String(body.found_at ?? `${dateKey}T${String(body.time_label || "00:00")}:00.000Z`); const parts = dateParts(foundAt);
        const destination = rewardUrl ? await verifyRewardDestination(rewardUrl, selectedGame) : { status: "unverified", checkedAt };
        const linkStatus = destination.status === "active" ? "active" : destination.status === "expired" ? "expired" : "unverified";
        const safeStatus = destination.status === "expired" ? "expired_invalid" : status;
        const finalUrl = destination.finalUrl || rewardUrl; const finalNormalized = normalizeUrl(finalUrl); const expiryReason = safeStatus === "expired_invalid" ? (destination.reason || "Fonte indica recompensa expirada.") : "";
        await env.DB.prepare("INSERT INTO rewards (game_id, name, type, quantity, reward_type, reward_amount, reward_description, image, url, source, date_key, time_label, status, user_id, verified_at, original_url, normalized_url, source_id, source_excerpt, found_at, last_checked_at, link_status, reward_status, reward_code, reward_key, final_url, redemption_url, image_source, expiry_reason, expired_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
          .bind(gameId, String(body.name ?? "").trim(), String(body.type ?? "").trim(), String(body.quantity ?? "").trim(), String(body.reward_type ?? body.type ?? "").trim(), String(body.reward_amount ?? body.quantity ?? "").trim(), String(body.reward_description ?? body.source_excerpt ?? "").trim(), String(body.image ?? "").trim(), rewardUrl, String(body.source ?? "").trim(), parts.date || dateKey, parts.time || String(body.time_label ?? ""), safeStatus === "confirmed" ? "confirmed" : safeStatus === "expired_invalid" ? "expired_invalid" : "unconfirmed", rewardUrl, normalized, asId(body.source_id), String(body.source_excerpt ?? "").trim(), foundAt, destination.checkedAt, linkStatus, safeStatus, rewardCode, rewardKey, finalUrl, rewardCode ? rewardUrl : "", body.image ? "source" : "", expiryReason, safeStatus === "expired_invalid" ? destination.checkedAt : null).run();
        return json({ reward: rewardFields(await env.DB.prepare("SELECT r.*, g.name AS game_name FROM rewards r JOIN games g ON g.id = r.game_id WHERE r.rowid = last_insert_rowid()").first()) }, { status: 201 });
      }
      if (request.method === "PATCH" && url.pathname.match(/^\/api\/admin\/rewards\/\d+$/)) {
        const denied = ownerRequired(request); if (denied) return denied;
        const id = asId(url.pathname.split("/").pop()); const body = await readBody(request); const current = id ? await env.DB.prepare("SELECT * FROM rewards WHERE id = ?").bind(id).first() : null; if (!current || !body) return json({ error: "Presente não encontrado." }, { status: 404 });
        const rewardUrl = String(body.url ?? current.original_url ?? current.url).trim(); const problem = body.status === "problem_unconfirmed" && normalizeUrl(rewardUrl) === normalizeUrl(MONOPOLY_GO_PROBLEM_URL); const status = problem ? "unknown" : canonicalStatus(body.status ?? current.reward_status ?? current.status); if (!validUrl(rewardUrl)) return json({ error: "URL inválida." }, { status: 400 });
        await env.DB.prepare("UPDATE rewards SET name = ?, type = ?, quantity = ?, reward_type = ?, reward_amount = ?, reward_description = ?, image = ?, url = ?, original_url = ?, normalized_url = ?, source = ?, status = ?, reward_status = ?, reward_code = ?, link_status = ?, expiry_reason = ?, expired_at = NULL, last_checked_at = ? WHERE id = ?").bind(String(body.name ?? current.name).trim(), String(body.type ?? current.type).trim(), String(body.quantity ?? current.quantity).trim(), String(body.reward_type ?? current.reward_type ?? body.type ?? current.type ?? "").trim(), String(body.reward_amount ?? current.reward_amount ?? body.quantity ?? current.quantity ?? "").trim(), String(body.reward_description ?? current.reward_description ?? current.source_excerpt ?? "").trim(), String(body.image ?? current.image).trim(), rewardUrl, rewardUrl, normalizeUrl(rewardUrl), String(body.source ?? current.source).trim(), status === "confirmed" ? "confirmed" : status === "expired_invalid" ? "expired_invalid" : "unconfirmed", status, String(body.reward_code ?? current.reward_code ?? "").trim(), problem ? "problem" : status === "expired_invalid" ? "expired" : "active", problem ? MONOPOLY_GO_PROBLEM_REASON : current.expiry_reason || "", nowIso(), id).run();
        return json({ reward: rewardFields(await env.DB.prepare("SELECT r.*, g.name AS game_name FROM rewards r JOIN games g ON g.id = r.game_id WHERE r.id = ?").bind(id).first()) });
      }
      if (request.method === "DELETE" && url.pathname.match(/^\/api\/admin\/rewards\/\d+$/)) {
        const denied = ownerRequired(request); if (denied) return denied; const id = asId(url.pathname.split("/").pop()); if (!id) return json({ error: "Identificador inválido." }, { status: 400 }); await env.DB.prepare("DELETE FROM rewards WHERE id = ?").bind(id).run(); return json({ ok: true });
      }
    } catch (error) { console.error(error); return json({ error: "Não foi possível concluir essa operação agora." }, { status: 500 }); }
    return new Response("Not found", { status: 404 });
  },
};
