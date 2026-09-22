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
    reward_identifier TEXT NOT NULL DEFAULT '',
    reward_pcode TEXT NOT NULL DEFAULT '',
    reward_c TEXT NOT NULL DEFAULT '',
    final_url TEXT NOT NULL DEFAULT '',
    redemption_url TEXT NOT NULL DEFAULT '',
    image_source TEXT NOT NULL DEFAULT '',
    expiry_reason TEXT NOT NULL DEFAULT '',
    expired_at TEXT,
    discovery_method TEXT NOT NULL DEFAULT 'automatic',
    publication_status TEXT NOT NULL DEFAULT 'pending',
    FOREIGN KEY (game_id) REFERENCES games(id)
  );
  CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    parser_type TEXT NOT NULL DEFAULT 'html_links',
    source_kind TEXT NOT NULL DEFAULT 'external_discovery',
    priority INTEGER NOT NULL DEFAULT 50,
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
    accepted_count INTEGER NOT NULL DEFAULT 0,
    unconfirmed_count INTEGER NOT NULL DEFAULT 0,
    expired_count INTEGER NOT NULL DEFAULT 0,
    rejected_count INTEGER NOT NULL DEFAULT 0,
    rejection_reason TEXT NOT NULL DEFAULT '',
    error TEXT,
    FOREIGN KEY (source_id) REFERENCES sources(id)
  );
  CREATE TABLE IF NOT EXISTS collection_diagnostics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER,
    game_id INTEGER,
    checked_at TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'link',
    discovered_url TEXT NOT NULL DEFAULT '',
    final_url TEXT NOT NULL DEFAULT '',
    reward_code TEXT NOT NULL DEFAULT '',
    reward_key TEXT NOT NULL DEFAULT '',
    reward_type TEXT NOT NULL DEFAULT '',
    reward_amount TEXT NOT NULL DEFAULT '',
    outcome TEXT NOT NULL DEFAULT 'rejected',
    classification TEXT NOT NULL DEFAULT 'UNCONFIRMED',
    reason TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (source_id) REFERENCES sources(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
  );
  CREATE INDEX IF NOT EXISTS rewards_game_date ON rewards (game_id, date_key);
  CREATE INDEX IF NOT EXISTS rewards_status ON rewards (status);
  CREATE INDEX IF NOT EXISTS rewards_normalized_url ON rewards (normalized_url);
  CREATE INDEX IF NOT EXISTS sources_game ON sources (game_id, active);
  CREATE INDEX IF NOT EXISTS collection_logs_source ON collection_logs (source_id, started_at);
  CREATE INDEX IF NOT EXISTS collection_diagnostics_source ON collection_diagnostics (source_id, checked_at);
  CREATE TABLE IF NOT EXISTS event_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    source_kind TEXT NOT NULL DEFAULT 'official',
    parser_type TEXT NOT NULL DEFAULT 'html_event',
    priority INTEGER NOT NULL DEFAULT 100,
    last_checked_at TEXT,
    last_success_at TEXT,
    last_error TEXT,
    user_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (game_id, url),
    FOREIGN KEY (game_id) REFERENCES games(id)
  );
  CREATE TABLE IF NOT EXISTS events (
    event_id TEXT PRIMARY KEY,
    game_id INTEGER NOT NULL,
    game_name TEXT NOT NULL DEFAULT '',
    game_slug TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL DEFAULT '',
    slug TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    event_type TEXT NOT NULL DEFAULT '',
    start_date TEXT,
    end_date TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming',
    official_source TEXT NOT NULL DEFAULT '',
    source_name TEXT NOT NULL DEFAULT '',
    source_url TEXT NOT NULL DEFAULT '',
    source_kind TEXT NOT NULL DEFAULT 'official',
    detected_at TEXT NOT NULL,
    validated_at TEXT,
    updated_at TEXT NOT NULL,
    source_event_id TEXT NOT NULL DEFAULT '',
    how_to_participate TEXT NOT NULL DEFAULT '',
    rewards_text TEXT NOT NULL DEFAULT '',
    publication_status TEXT NOT NULL DEFAULT 'published',
    last_seen_at TEXT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id)
  );
  CREATE TABLE IF NOT EXISTS event_collection_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER,
    started_at TEXT NOT NULL,
    finished_at TEXT NOT NULL,
    http_status INTEGER,
    candidates_found INTEGER NOT NULL DEFAULT 0,
    published_count INTEGER NOT NULL DEFAULT 0,
    updated_count INTEGER NOT NULL DEFAULT 0,
    duplicates_ignored INTEGER NOT NULL DEFAULT 0,
    discarded_count INTEGER NOT NULL DEFAULT 0,
    discard_reason TEXT NOT NULL DEFAULT '',
    error TEXT,
    FOREIGN KEY (source_id) REFERENCES event_sources(id)
  );
  CREATE TABLE IF NOT EXISTS event_collection_diagnostics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER,
    game_id INTEGER,
    checked_at TEXT NOT NULL,
    candidate_title TEXT NOT NULL DEFAULT '',
    candidate_url TEXT NOT NULL DEFAULT '',
    outcome TEXT NOT NULL DEFAULT 'discarded',
    reason TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (source_id) REFERENCES event_sources(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
  );
  CREATE INDEX IF NOT EXISTS event_sources_game ON event_sources (game_id, active, priority);
  CREATE INDEX IF NOT EXISTS events_status_dates ON events (status, start_date, end_date);
  CREATE INDEX IF NOT EXISTS events_game_dates ON events (game_id, status, start_date);
  CREATE INDEX IF NOT EXISTS event_collection_logs_source ON event_collection_logs (source_id, started_at);
  CREATE INDEX IF NOT EXISTS event_collection_diagnostics_source ON event_collection_diagnostics (source_id, checked_at);
  CREATE TABLE IF NOT EXISTS news_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    source_kind TEXT NOT NULL DEFAULT 'official_news',
    priority INTEGER NOT NULL DEFAULT 100,
    last_checked_at TEXT,
    last_success_at TEXT,
    last_error TEXT,
    user_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (game_id, url),
    FOREIGN KEY (game_id) REFERENCES games(id)
  );
  CREATE TABLE IF NOT EXISTS news_items (
    news_id TEXT PRIMARY KEY,
    game_id INTEGER NOT NULL,
    game_name TEXT NOT NULL DEFAULT '',
    game_slug TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL DEFAULT '',
    slug TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'update',
    published_at TEXT,
    official_source TEXT NOT NULL DEFAULT '',
    source_name TEXT NOT NULL DEFAULT '',
    source_url TEXT NOT NULL DEFAULT '',
    source_kind TEXT NOT NULL DEFAULT 'official_news',
    detected_at TEXT NOT NULL,
    validated_at TEXT,
    updated_at TEXT NOT NULL,
    source_item_id TEXT NOT NULL DEFAULT '',
    publication_status TEXT NOT NULL DEFAULT 'published',
    last_seen_at TEXT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id)
  );
  CREATE TABLE IF NOT EXISTS news_collection_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER,
    started_at TEXT NOT NULL,
    finished_at TEXT NOT NULL,
    http_status INTEGER,
    candidates_found INTEGER NOT NULL DEFAULT 0,
    published_count INTEGER NOT NULL DEFAULT 0,
    updated_count INTEGER NOT NULL DEFAULT 0,
    discarded_count INTEGER NOT NULL DEFAULT 0,
    discard_reason TEXT NOT NULL DEFAULT '',
    error TEXT,
    FOREIGN KEY (source_id) REFERENCES news_sources(id)
  );
  CREATE INDEX IF NOT EXISTS news_sources_game ON news_sources (game_id, active, priority);
  CREATE INDEX IF NOT EXISTS news_items_game_date ON news_items (game_id, published_at);
  CREATE INDEX IF NOT EXISTS news_collection_logs_source ON news_collection_logs (source_id, started_at);
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
  CREATE TABLE IF NOT EXISTS notice_preferences (
    user_id TEXT PRIMARY KEY,
    games_json TEXT NOT NULL DEFAULT '[]',
    channels_json TEXT NOT NULL DEFAULT '{"gifts":true,"links":true,"codes":true,"news":true}',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS notice_deliveries (
    user_id TEXT NOT NULL,
    reward_id INTEGER NOT NULL,
    delivered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, reward_id),
    FOREIGN KEY (reward_id) REFERENCES rewards(id)
  );
  CREATE TABLE IF NOT EXISTS player_profiles (
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL DEFAULT '',
    avatar_url TEXT NOT NULL DEFAULT '',
    points INTEGER NOT NULL DEFAULT 0,
    quizzes_completed INTEGER NOT NULL DEFAULT 0,
    quiz_best_score INTEGER NOT NULL DEFAULT 0,
    visit_streak INTEGER NOT NULL DEFAULT 0,
    last_visit_date TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS quiz_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL DEFAULT '',
    avatar_url TEXT NOT NULL DEFAULT '',
    score INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 10,
    completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS quiz_scores_user ON quiz_scores (user_id);
  INSERT OR IGNORE INTO games (name, slug, description, active) VALUES
    ('Match Masters', 'match-masters', 'Competição rápida, desafios e recompensas para colecionar.', 1),
    ('Dice Dreams', 'dice-dreams', 'Giros, construções e presentes para a sua próxima aventura.', 1),
    ('Coin Master', 'coin-master', 'Gire, construa e encontre novos links para sua vila.', 1);
`;

const catalogSources = [
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

// Match Masters is intentionally kept in its own prioritized registry. Official
// pages establish the strongest evidence; every other page is discovery and
// cross-check only and can never confirm a reward by itself.
const MATCH_MASTERS_SOURCES = [
  { name: 'Match Masters · site oficial', url: 'https://matchmasters.com/', parser_type: 'html_links', source_kind: 'official', priority: 100 },
  { name: 'Match Masters · Masters Market oficial', url: 'https://matchmasters.com/portal/masters-market', parser_type: 'html_links', source_kind: 'official', priority: 100 },
  { name: 'Candivore · suporte oficial / presentes', url: 'https://candivore.zendesk.com/hc/en-us/articles/360019862199-Get-Free-Prizes', parser_type: 'html_links', source_kind: 'official', priority: 100 },
  { name: 'Candivore · Reward Keys oficial', url: 'https://candivore.zendesk.com/hc/en-us/articles/9627784625946-Reward-Keys', parser_type: 'html_links', source_kind: 'official', priority: 100 },
  { name: 'Candivore · página oficial do jogo', url: 'https://www.candivore.com/games/match-masters', parser_type: 'html_links', source_kind: 'official', priority: 95 },
  { name: 'Destructoid · descoberta', url: 'https://www.destructoid.com/match-masters-free-gifts-boosters-and-coins-links/', parser_type: 'html_links', source_kind: 'external_discovery', priority: 70 },
  { name: 'Rezor Tricks · descoberta', url: 'https://rezortricks.com/match-masters-free-daily-gifts/', parser_type: 'html_links', source_kind: 'external_discovery', priority: 70 },
  { name: 'GamersDunia · descoberta', url: 'https://gamersdunia.com/match-masters-free-gifts/', parser_type: 'html_links', source_kind: 'external_discovery', priority: 70 },
  { name: 'Pocket Tactics · descoberta', url: 'https://www.pockettactics.com/match-masters/free', parser_type: 'html_links', source_kind: 'external_discovery', priority: 70 },
  { name: 'TalkAndroid · descoberta', url: 'https://www.talkandroid.com/451270-match-masters-free-gifts-coins/', parser_type: 'html_links', source_kind: 'external_discovery', priority: 70 },
  { name: 'NG+ · descoberta', url: 'https://ngplus.com.br/bonus/match-masters/', parser_type: 'html_links', source_kind: 'external_discovery', priority: 70 },
  { name: 'Alucare · descoberta', url: 'https://www.alucare.fr/en/match-masters-cadeaux-quotidiens-gratuits/', parser_type: 'html_links', source_kind: 'external_discovery', priority: 70 },
  { name: 'Telegram Match Masters Gifts · descoberta', url: 'https://t.me/s/matchmastersfreegiftsdaily', parser_type: 'html_links', source_kind: 'external_discovery', priority: 65 },
];

// Additive discovery registry. These rows supplement the original catalog;
// they never replace an existing source. A source may fail or return no
// candidates without preventing the other sources from being consulted.
const MONITORED_REWARD_SLUGS = ['match-masters', 'coin-master', 'dice-dreams', 'monopoly-go', 'travel-town', 'crazy-fox', 'coin-tales', 'piggy-go', 'bingo-blitz', 'board-kings', 'free-fire', 'roblox'];
const expandSource = (name, url, slugs, parser_type = 'html_links', source_kind = 'external_discovery', priority = 35) => slugs.map((slug) => ({ name: `${name} · descoberta`, url, slug, parser_type, source_kind, priority }));
const EXPANSION_SOURCES = [
  ...expandSource('PurGames', 'https://purgames.com/', MONITORED_REWARD_SLUGS),
  ...expandSource('RewardAtlas', 'https://getrewardatlas.com/pt-br/games', ['match-masters', 'coin-master', 'dice-dreams', 'monopoly-go', 'travel-town', 'crazy-fox', 'coin-tales', 'piggy-go', 'bingo-blitz', 'board-kings']),
  ...expandSource('RewardAtlas', 'https://getrewardatlas.com/pt-br/games/match-masters', ['match-masters']),
  ...expandSource('RewardAtlas', 'https://getrewardatlas.com/pt-br/games/piggy-go', ['piggy-go']),
  ...expandSource('Rezor Tricks', 'https://rezortricks.com/', ['match-masters', 'coin-master', 'dice-dreams', 'crazy-fox', 'coin-tales', 'piggy-go']),
  ...expandSource('Rezor Tricks', 'https://rezortricks.com/piggy-go-free-dice/', ['piggy-go']),
  ...expandSource('Destructoid', 'https://www.destructoid.com/match-masters-free-gifts-boosters-and-coins-links/', ['match-masters']),
  ...expandSource('Pocket Tactics', 'https://www.pockettactics.com/match-masters/free', ['match-masters']),
  ...expandSource('Pocket Tactics', 'https://www.pockettactics.com/coin-master/free-spins', ['coin-master']),
  ...expandSource('Pocket Gamer', 'https://www.pocketgamer.com/coin-master/free-spins/', ['coin-master']),
  ...expandSource('Pocket Gamer', 'https://www.pocketgamer.com/dice-dreams/free-spins/', ['dice-dreams']),
  ...expandSource('Pocket Gamer', 'https://www.pocketgamer.com/monopoly-go/free-dice/', ['monopoly-go']),
  ...expandSource('Mobile Game Central', 'https://mobilegamecentral.com/freebies/free-dice-dreams-rolls-links-updated-daily/', ['dice-dreams']),
  ...expandSource('Mobile Game Central', 'https://mobilegamecentral.com/freebies/free-coin-master-spins-links-updated-daily/', ['coin-master']),
  ...expandSource('Mobile Game Central', 'https://mobilegamecentral.com/freebies/free-monopoly-go-dice/', ['monopoly-go']),
  ...expandSource('Mobile Game Central', 'https://mobilegamecentral.com/freebies/free-travel-town-energy-links-updated-daily/', ['travel-town']),
  ...expandSource('Mobile Game Central', 'https://mobilegamecentral.com/freebies/free-crazy-fox-spins-and-coins-links-updated-daily/', ['crazy-fox']),
  ...expandSource('Mobile Game Central', 'https://mobilegamecentral.com/freebies/coin-tales-free-spins-updated-daily/', ['coin-tales']),
  ...expandSource('Mobile Game Central', 'https://mobilegamecentral.com/freebies/free-piggy-go-dice-and-coins-updated-daily/', ['piggy-go']),
  ...expandSource('Daily Spin Links', 'https://dailyspinlinks.com/', MONITORED_REWARD_SLUGS),
  ...expandSource('DiceDreamsRolls', 'https://dicedreamsrolls.com/', ['dice-dreams']),
  ...expandSource('DiceDreamsFreeRolls', 'https://dicedreamsfreerolls.com/', ['dice-dreams']),
  ...expandSource('MatchMastersCoin', 'https://matchmasterscoin.com/', ['match-masters']),
  ...expandSource('Match Masters Hub', 'https://candivore.zendesk.com/hc/en-us/articles/9584613708058-The-Match-Masters-Hub', ['match-masters'], 'html_links', 'official', 95),
  ...expandSource('Simple Game Guide', 'https://simplegameguide.com/', ['match-masters', 'coin-master', 'dice-dreams', 'monopoly-go', 'travel-town', 'crazy-fox', 'coin-tales']),
  ...expandSource('MyMasterSpins', 'https://mymasterspins.com/', ['coin-master']),
  ...expandSource('CoinMasterSpins.org', 'https://coinmasterspins.org/', ['coin-master']),
  ...expandSource('Games Rewards', 'https://game.nextoolshub.com/', MONITORED_REWARD_SLUGS),
  ...expandSource('GamesRadar+', 'https://www.gamesradar.com/roblox/', ['roblox'], 'html_codes'),
  ...expandSource('GamesRadar+', 'https://www.gamesradar.com/free-fire/', ['free-fire'], 'html_codes'),
  ...expandSource('Rewavio', 'https://rewavio.com/blog/bingo-blitz', ['bingo-blitz']),
  ...expandSource('Rewavio', 'https://rewavio.com/blog/match-masters', ['match-masters']),
  ...expandSource('Quesites', 'https://quesites.com/', ['match-masters', 'coin-master', 'dice-dreams', 'monopoly-go', 'piggy-go', 'bingo-blitz', 'board-kings']),
  ...expandSource('BingoBlitzFreeCredit', 'https://t.me/bingoblitzfreecredit', ['bingo-blitz']),
  ...expandSource('PCGamesN', 'https://www.pcgamesn.com/roblox/codes', ['roblox'], 'html_codes'),
  ...expandSource('PCGamesN', 'https://www.pcgamesn.com/free-fire/codes', ['free-fire'], 'html_codes'),
  ...expandSource('SpinDiceWorld', 'https://spindiceworld.com/coin-master/free-spins', ['coin-master']),
  ...expandSource('SpinDiceWorld', 'https://spindiceworld.com/dice-dreams/free-rolls', ['dice-dreams']),
  ...expandSource('SpinDiceWorld', 'https://spindiceworld.com/monopoly-go/dice-links', ['monopoly-go']),
  ...expandSource('SpinDiceWorld', 'https://spindiceworld.com/crazy-fox/free-spins-coins', ['crazy-fox']),
  ...expandSource('SpinDiceWorld', 'https://spindiceworld.com/bingo-blitz/free-credits', ['bingo-blitz']),
  ...expandSource('SpinDiceWorld', 'https://spindiceworld.com/travel-town/free-energy', ['travel-town']),
  ...expandSource('SpinDiceWorld', 'https://spindiceworld.com/board-kings/free-rolls', ['board-kings']),
  ...expandSource('SpinDiceWorld', 'https://spindiceworld.com/match-masters/free-gifts', ['match-masters']),
  ...expandSource('GameTipsPro', 'https://www.gametipspro.com/p/daily-free-rewards.html?m=1', MONITORED_REWARD_SLUGS),
  // Official endpoints/channels are evidence sources, never proof by HTTP 200 alone.
  ...expandSource('Coin Master · canal oficial', 'https://coinmaster.com/', ['coin-master'], 'html_links', 'official', 95),
  ...expandSource('Dice Dreams · portal oficial', 'https://rewards.dicedreams.com/', ['dice-dreams'], 'html_links', 'official', 95),
  ...expandSource('Monopoly GO · site oficial', 'https://www.monopolygo.com/', ['monopoly-go'], 'html_links', 'official', 95),
  ...expandSource('Travel Town · suporte oficial', 'https://support.traveltowngame.com/', ['travel-town'], 'html_links', 'official', 95),
  ...expandSource('Bingo Blitz · site oficial', 'https://www.bingoblitz.com/', ['bingo-blitz'], 'html_links', 'official', 95),
  ...expandSource('Board Kings · loja oficial', 'https://store.boardkings.com/', ['board-kings'], 'html_links', 'official', 95),
  ...expandSource('Crazy Fox · destino oficial', 'https://rwys.xyz/', ['crazy-fox'], 'html_links', 'official', 95),
  ...expandSource('Piggy GO · destino oficial', 'https://piggygo-jy.forevernine.com/', ['piggy-go'], 'html_links', 'official', 95),
  ...expandSource('Free Fire · resgate oficial', 'https://reward.ff.garena.com/', ['free-fire'], 'html_codes', 'official', 100),
  ...expandSource('Roblox · resgate oficial', 'https://www.roblox.com/redeem?nl=true', ['roblox'], 'html_codes', 'official', 100),
];

const MATCH_MASTERS_REWARD_KEY_PROOF = 'GG_MANUAL:confirmed-reward-key — Teste manual: o Reward Key Treasure foi coletado com sucesso no Match Masters.';
const MATCH_MASTERS_EXPIRED_SPIN_URL = 'https://launch.matchmasters.com/l/p/-9Wty1EuYyM';
// These are the four links tested manually by the owner. They are kept as
// explicit records, while every other Match Masters link remains a candidate
// until the publication rules below classify it.
const MATCH_MASTERS_MANUAL_TESTS = Object.freeze([
  { url: 'https://matchmasters.onelink.me/hCkF/a4a53b83?af_dp=matchmasters%253A%252F%252F&af_force_deeplink=true&c=qu4AKvHyzYc&pcode=m1r1tqstcl414jj1hbao', outcome: 'invalid-1', description: 'GG_MANUAL:invalid-1 — Teste manual: link inválido.', linkStatus: 'problem', rewardStatus: 'unknown', amount: '' },
  { url: 'https://matchmasters.onelink.me/hCkF/a4a53b83?af_dp=matchmasters%253A%252F%252F&af_force_deeplink=true&c=D7yaIVSNdLQ&pcode=gh1q91vm454rgkfx1ilg', outcome: 'invalid-2', description: 'GG_MANUAL:invalid-2 — Teste manual: link inválido.', linkStatus: 'problem', rewardStatus: 'unknown', amount: '' },
  { url: 'https://matchmasters.onelink.me/hCkF/a4a53b83?af_dp=matchmasters%253A%252F%252F&af_force_deeplink=true&c=Dy0kKAm4tWc&pcode=t21qtxizjgbsxfx3pol2', outcome: 'confirmed-30', description: 'GG_MANUAL:confirmed-30 — Teste manual: quantidade confirmada 30.', linkStatus: 'active', rewardStatus: 'confirmed', amount: '30' },
  { url: 'https://matchmasters.onelink.me/hCkF/a4a53b83?af_dp=matchmasters%253A%252F%252F&af_force_deeplink=true&c=yD1dkVWEaPQ&pcode=pqu1uim4v2sfl66xsob0', outcome: 'confirmed-x2', description: 'GG_MANUAL:confirmed-x2 — Teste manual: quantidade confirmada x2.', linkStatus: 'active', rewardStatus: 'confirmed', amount: 'x2' },
]);
const MATCH_MASTERS_OWNER_ADDED_REWARD = Object.freeze({
  url: 'https://matchmasters.onelink.me/hCkF/a4a53b83?af_dp=matchmasters%253A%252F%252F&af_force_deeplink=true&c=oOmGgpIlrzI&pcode=697864ewdx7426h94gh8',
  dateKey: '2026-09-22',
  amount: 'x7',
  rewardType: 'perks',
  image: '/uploads/file_00000000c6a0820ea3521b9d62dc9248.png',
  pcode: '697864ewdx7426h94gh8',
  rewardC: 'oOmGgpIlrzI',
  description: 'GG_MANUAL:owner-confirmed — Prêmio confirmado no jogo pelo proprietário: x7 Perks.',
});
// Reported by the owner after opening the link in Coin Master. The web page
// only redirects to the app, so the in-game expiry screen is not observable
// from a server-side HTTP check.
const COIN_MASTER_USER_REPORTED_EXPIRED_URL = 'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_HELPwOQqrt_20260914';
// The first current Coin Master card was reported by the owner as not opening.
// Keep this denylist durable so a later source refresh cannot republish it.
const COIN_MASTER_USER_REPORTED_BROKEN_URL = 'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_FCBBLHhYl_20260921';
const COIN_MASTER_USER_REPORTED_BROKEN_REASON = 'Link do Coin Master reportado pelo proprietário como não abrindo; mantido fora da publicação até novo teste manual válido.';
// The owner manually opened these exact four current Coin Master records and
// confirmed that each delivered 25 spins. The URL is only a match key here;
// it is never replaced or copied to another reward record.
const COIN_MASTER_MANUAL_TESTS = Object.freeze([
  { url: 'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_INSSWZrtv_20260921', amount: '25' },
  { url: 'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_FCBkqawaJ_20260921', amount: '25' },
  { url: 'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_TWImsPjfF_20260921', amount: '25' },
  { url: 'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_CHATBXfPVWr_20260921', amount: '25' },
]);
// These seven links were manually confirmed by the owner on 2026-09-22.
// They are kept as exact URLs and are inserted idempotently below.
const COIN_MASTER_OWNER_CONFIRMED_REWARDS = Object.freeze([
  'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_FCBxqWEqt_20260922',
  'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_FCBYkmrFO_20260922',
  'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_INSMGcgJb_20260922',
  'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_CHATBAkSooT_20260922',
  'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_INSyjzxsP_20260922',
  'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_WATScETASr_20260922',
  'https://rewards.coinmaster.com/rewards/rewards.html?c=pe_HELPlszhZc_20260922',
].map((url) => Object.freeze({ url, amount: '+25', quantity: '25', dateKey: '2026-09-22' })));
const COIN_MASTER_OWNER_CONFIRMED_IMAGE = '/uploads/file_00000000d7488207b34dcbe156152596.png';
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
  ['Piggy GO', 'piggy-go', 'Dados, moedas e bônus de viagem para suas próximas partidas.', 'links', ''],
  ['Coin Tales', 'coin-tales', 'Giros, moedas e presentes públicos para sua aventura.', 'links', ''],
];
const targetSlugs = targetCatalog.map(([, slug]) => slug);
const catalogOrder = targetSlugs.map((slug, index) => `WHEN '${slug}' THEN ${index + 1}`).join(" ");

// Event sources are deliberately separate from the reward source registry.
// Only official pages are seeded here. A third-party page may be added later
// as a discovery source, but it never becomes event confirmation by itself.
// The registry is keyed by slug, so any future game can join the same system
// through the admin event-source route without changing the collector.
const EVENT_SOURCE_REGISTRY = [
  { slug: "match-masters", name: "Match Masters · site oficial", url: "https://matchmasters.com/", source_kind: "official", priority: 100 },
  { slug: "match-masters", name: "Candivore · Match Masters", url: "https://www.candivore.com/games/match-masters", source_kind: "official", priority: 95 },
  { slug: "monopoly-go", name: "Monopoly GO · site oficial", url: "https://www.monopolygo.com/", source_kind: "official", priority: 100 },
  { slug: "dice-dreams", name: "Dice Dreams · portal oficial", url: "https://rewards.dicedreams.com/", source_kind: "official", priority: 100 },
  { slug: "dice-dreams", name: "SuperPlay · Dice Dreams", url: "https://www.superplay.co/games/dice-dreams/", source_kind: "official", priority: 95 },
  { slug: "coin-master", name: "Coin Master · site oficial", url: "https://coinmaster.com/", source_kind: "official", priority: 100 },
  { slug: "coin-master", name: "Coin Master · suporte oficial", url: "https://support.coinmastergame.com/hc/en-us/", source_kind: "official", priority: 95 },
  { slug: "travel-town", name: "Travel Town · suporte oficial", url: "https://support.traveltowngame.com/hc/en-us/", source_kind: "official", priority: 100 },
  { slug: "bingo-blitz", name: "Bingo Blitz · site oficial", url: "https://www.bingoblitz.com/", source_kind: "official", priority: 100 },
  { slug: "roblox", name: "Roblox · notícias oficiais", url: "https://blog.roblox.com/", source_kind: "official", priority: 100 },
  { slug: "free-fire", name: "Free Fire · site oficial", url: "https://ff.garena.com/en/", source_kind: "official", priority: 100 },
  { slug: "stumble-guys", name: "Stumble Guys · site oficial", url: "https://www.stumbleguys.com/", source_kind: "official", priority: 100 },
  { slug: "lords-mobile", name: "Lords Mobile · site oficial", url: "https://lordsmobile.igg.com/", source_kind: "official", priority: 100 },
  { slug: "clash-of-clans", name: "Clash of Clans · Supercell", url: "https://supercell.com/en/games/clashofclans/", source_kind: "official", priority: 100 },
  { slug: "piggy-go", name: "Piggy GO · portal oficial", url: "https://piggygo-jy.forevernine.com/", source_kind: "official", priority: 100 },
];

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
// A candidate is never public just because it was found or because an HTTP
// request returned 200. Only this publication state feeds the public API,
// counters, "Acabou de chegar" and notifications.
const isApprovedPublication = (row) => ['approved', 'published'].includes(String(row?.publication_status || '').trim().toLowerCase());
const canonicalRewardIdentity = (row, gameSlug = '') => {
  const slug = String(gameSlug || row?.game_slug || '').trim().toLowerCase();
  const identifier = String(row?.reward_identifier || row?.reward_c || row?.reward_pcode || '').trim().toLowerCase();
  if (identifier) return `${slug}:${identifier}`;
  const code = String(row?.reward_code || '').trim().toUpperCase();
  if (code) return `${slug}:code:${code}`;
  const key = String(row?.reward_key || '').trim().toLowerCase();
  const type = String(row?.reward_type || row?.type || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const amount = String(row?.reward_amount || row?.quantity || '').trim().toLowerCase().replace(/\s+/g, ' ');
  const date = String(row?.date_key || '').trim();
  const destination = normalizeUrl(row?.final_url || row?.normalized_url || row?.original_url || row?.url || '');
  return `${slug}:${key || destination || 'unknown'}:${type || 'unknown'}:${amount || 'unknown'}:${date || 'unknown'}`;
};
const monitorClassification = (row) => {
  if (publicStatus(row) === "expired_invalid" || String(row?.link_status || "").toLowerCase() === "expired") return "EXPIRED";
  if (String(row?.link_status || "").toLowerCase() === "active" && (row?.reward_status === "confirmed" || row?.status === "confirmed")) return "ACTIVE";
  return "UNCONFIRMED";
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
const rewardUrlIdentifiers = (value) => {
  try {
    const parsed = new URL(String(value || ""));
    const get = (name) => String(parsed.searchParams.get(name) || "").trim();
    const c = get("c");
    const pcode = get("pcode");
    const rewardCode = get("reward_code");
    const token = get("token") || get("incentive");
    return { c, pcode, identifier: c || pcode || rewardCode || token };
  } catch {
    return { c: "", pcode: "", identifier: "" };
  }
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
    date_key: row.date_key || "",
    time_label: row.time_label || "",
    found_at: foundAt,
    last_checked_at: row.last_checked_at || row.verified_at || "",
    verified_at: row.last_checked_at || row.verified_at || "",
    link_status: row.link_status || "active",
    reward_status: rewardStatus,
    monitor_status: monitorClassification(row),
    status: rewardStatus === "confirmed" ? "confirmed" : rewardStatus === "expired_invalid" ? "expired_invalid" : "unconfirmed",
    reward_code: row.reward_code || "",
    reward_key: row.reward_key || "",
    reward_identifier: row.reward_identifier || "",
    reward_pcode: row.reward_pcode || "",
    reward_c: row.reward_c || "",
    final_url: row.final_url || originalUrl,
    redemption_url: row.redemption_url || (row.reward_code ? originalUrl : ""),
    image_source: row.image_source || (row.image ? "source" : ""),
    expiry_reason: row.expiry_reason || "",
    publication_status: row.publication_status || "pending",
    reward_identity: canonicalRewardIdentity(row),
    reward_type: row.reward_type || (row.type && !/^(link|reward|recompensa|presente)\b/i.test(row.type) ? row.type : ""),
    reward_amount: row.reward_amount || row.quantity || "",
    reward_description: row.reward_description || row.source_excerpt || "",
  };
};
const publicRewardFields = (row) => {
  const value = rewardFields(row);
  // Discovery sources stay available in /api/admin/data and diagnostics only.
  // They are evidence for the collector, not public attribution or proof.
  value.source = "";
  value.source_name = "";
  value.source_excerpt = "";
  value.source_id = null;
  value.reward_description = String(value.reward_description || "").replace(/\s*(?:[·|-]\s*)?(?:fonte|source)\s*:\s*[^.]+\.?/gi, "").trim();
  return value;
};
const gameFields = (row) => ({ ...row, active: Boolean(row.active), reward_mode: ["links", "codes", "none"].includes(row.reward_mode) ? row.reward_mode : "links" });
// Public-only recovery data. If the database/API cannot be initialized, return
// the game catalog with no rewards rather than inventing a placeholder link.
const fallbackPublicData = () => {
  const games = targetCatalog.map(([name, slug, description, reward_mode, image], index) => ({ id: -(index + 1), name, slug, description, reward_mode, image, banner: "", active: true }));
  return { games, rewards: [] };
};
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
  // Event storage is intentionally initialized independently. It never
  // changes rewards, reward keys, link state, opened state or notifications.
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS event_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    source_kind TEXT NOT NULL DEFAULT 'official',
    parser_type TEXT NOT NULL DEFAULT 'html_event',
    priority INTEGER NOT NULL DEFAULT 100,
    last_checked_at TEXT,
    last_success_at TEXT,
    last_error TEXT,
    user_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (game_id, url),
    FOREIGN KEY (game_id) REFERENCES games(id)
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS events (
    event_id TEXT PRIMARY KEY,
    game_id INTEGER NOT NULL,
    game_name TEXT NOT NULL DEFAULT '',
    game_slug TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL DEFAULT '',
    slug TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    image TEXT NOT NULL DEFAULT '',
    event_type TEXT NOT NULL DEFAULT '',
    start_date TEXT,
    end_date TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming',
    official_source TEXT NOT NULL DEFAULT '',
    source_name TEXT NOT NULL DEFAULT '',
    source_url TEXT NOT NULL DEFAULT '',
    source_kind TEXT NOT NULL DEFAULT 'official',
    detected_at TEXT NOT NULL,
    validated_at TEXT,
    updated_at TEXT NOT NULL,
    source_event_id TEXT NOT NULL DEFAULT '',
    how_to_participate TEXT NOT NULL DEFAULT '',
    rewards_text TEXT NOT NULL DEFAULT '',
    publication_status TEXT NOT NULL DEFAULT 'published',
    last_seen_at TEXT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id)
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS event_collection_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER,
    started_at TEXT NOT NULL,
    finished_at TEXT NOT NULL,
    http_status INTEGER,
    candidates_found INTEGER NOT NULL DEFAULT 0,
    published_count INTEGER NOT NULL DEFAULT 0,
    updated_count INTEGER NOT NULL DEFAULT 0,
    duplicates_ignored INTEGER NOT NULL DEFAULT 0,
    discarded_count INTEGER NOT NULL DEFAULT 0,
    discard_reason TEXT NOT NULL DEFAULT '',
    error TEXT,
    FOREIGN KEY (source_id) REFERENCES event_sources(id)
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS event_collection_diagnostics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER,
    game_id INTEGER,
    checked_at TEXT NOT NULL,
    candidate_title TEXT NOT NULL DEFAULT '',
    candidate_url TEXT NOT NULL DEFAULT '',
    outcome TEXT NOT NULL DEFAULT 'discarded',
    reason TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (source_id) REFERENCES event_sources(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
    )`),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS event_sources_game ON event_sources (game_id, active, priority)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS events_status_dates ON events (status, start_date, end_date)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS events_game_dates ON events (game_id, status, start_date)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS event_collection_logs_source ON event_collection_logs (source_id, started_at)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS event_collection_diagnostics_source ON event_collection_diagnostics (source_id, checked_at)"),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS news_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT, game_id INTEGER NOT NULL, name TEXT NOT NULL, url TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1, source_kind TEXT NOT NULL DEFAULT 'official_news', priority INTEGER NOT NULL DEFAULT 100,
    last_checked_at TEXT, last_success_at TEXT, last_error TEXT, user_id TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (game_id, url), FOREIGN KEY (game_id) REFERENCES games(id)
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS news_items (
    news_id TEXT PRIMARY KEY, game_id INTEGER NOT NULL, game_name TEXT NOT NULL DEFAULT '', game_slug TEXT NOT NULL DEFAULT '',
    title TEXT NOT NULL DEFAULT '', slug TEXT NOT NULL DEFAULT '', summary TEXT NOT NULL DEFAULT '', image TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'update', published_at TEXT, official_source TEXT NOT NULL DEFAULT '', source_name TEXT NOT NULL DEFAULT '',
    source_url TEXT NOT NULL DEFAULT '', source_kind TEXT NOT NULL DEFAULT 'official_news', detected_at TEXT NOT NULL, validated_at TEXT,
    updated_at TEXT NOT NULL, source_item_id TEXT NOT NULL DEFAULT '', publication_status TEXT NOT NULL DEFAULT 'published', last_seen_at TEXT NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id)
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS news_collection_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT, source_id INTEGER, started_at TEXT NOT NULL, finished_at TEXT NOT NULL,
    http_status INTEGER, candidates_found INTEGER NOT NULL DEFAULT 0, published_count INTEGER NOT NULL DEFAULT 0,
    updated_count INTEGER NOT NULL DEFAULT 0, discarded_count INTEGER NOT NULL DEFAULT 0, discard_reason TEXT NOT NULL DEFAULT '', error TEXT,
    FOREIGN KEY (source_id) REFERENCES news_sources(id)
    )`),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS news_sources_game ON news_sources (game_id, active, priority)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS news_items_game_date ON news_items (game_id, published_at)"),
    env.DB.prepare("CREATE INDEX IF NOT EXISTS news_collection_logs_source ON news_collection_logs (source_id, started_at)")
  ]);
  // Older projects already had a small news_items table. Extend it in place so
  // existing headlines remain readable while the isolated collector can use
  // stable ids and the same audit fields as new records.
  const newsItemColumns = new Set((await env.DB.prepare("PRAGMA table_info(news_items)").all()).results.map((column) => column.name));
  const newsItemMigrations = [
    ["news_id", "TEXT"],
    ["game_name", "TEXT NOT NULL DEFAULT ''"],
    ["game_slug", "TEXT NOT NULL DEFAULT ''"],
    ["slug", "TEXT NOT NULL DEFAULT ''"],
    ["official_source", "TEXT NOT NULL DEFAULT ''"],
    ["source_name", "TEXT NOT NULL DEFAULT ''"],
    ["source_kind", "TEXT NOT NULL DEFAULT 'official_news'"],
    ["detected_at", "TEXT"],
    ["validated_at", "TEXT"],
    ["updated_at", "TEXT"],
    ["source_item_id", "TEXT NOT NULL DEFAULT ''"],
    ["publication_status", "TEXT NOT NULL DEFAULT 'published'"],
    ["last_seen_at", "TEXT"]
  ].filter(([column]) => !newsItemColumns.has(column));
  if (newsItemMigrations.length) {
    await env.DB.batch(newsItemMigrations.map(([column, definition]) => env.DB.prepare(`ALTER TABLE news_items ADD COLUMN ${column} ${definition}`)));
  }
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS player_profiles (
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL DEFAULT '',
    avatar_url TEXT NOT NULL DEFAULT '',
    points INTEGER NOT NULL DEFAULT 0,
    quizzes_completed INTEGER NOT NULL DEFAULT 0,
    quiz_best_score INTEGER NOT NULL DEFAULT 0,
    visit_streak INTEGER NOT NULL DEFAULT 0,
    last_visit_date TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS quiz_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    attempt_id TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL DEFAULT '',
    avatar_url TEXT NOT NULL DEFAULT '',
    score INTEGER NOT NULL DEFAULT 0,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 10,
    completed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS quiz_scores_user ON quiz_scores (user_id)").run();
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
  const existingSourceColumns = new Set((await env.DB.prepare("PRAGMA table_info(sources)").all()).results.map((column) => column.name));
  const existingCollectionLogColumns = new Set((await env.DB.prepare("PRAGMA table_info(collection_logs)").all()).results.map((column) => column.name));
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS notice_preferences (
    user_id TEXT PRIMARY KEY,
    games_json TEXT NOT NULL DEFAULT '[]',
    channels_json TEXT NOT NULL DEFAULT '{"gifts":true,"links":true,"codes":true,"news":true}',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`).run();
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS notice_deliveries (
    user_id TEXT NOT NULL,
    reward_id INTEGER NOT NULL,
    delivered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, reward_id),
    FOREIGN KEY (reward_id) REFERENCES rewards(id)
  )`).run();
  const existingNoticeColumns = new Set((await env.DB.prepare("PRAGMA table_info(notice_preferences)").all()).results.map((column) => column.name));
  if (!existingNoticeColumns.has("channels_json")) {
    await env.DB.prepare("ALTER TABLE notice_preferences ADD COLUMN channels_json TEXT NOT NULL DEFAULT '{\"gifts\":true,\"links\":true,\"codes\":true,\"news\":true}'").run();
  }
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
    ["reward_identifier", "TEXT NOT NULL DEFAULT ''"],
    ["reward_pcode", "TEXT NOT NULL DEFAULT ''"],
    ["reward_c", "TEXT NOT NULL DEFAULT ''"],
    ["final_url", "TEXT NOT NULL DEFAULT ''"],
    ["redemption_url", "TEXT NOT NULL DEFAULT ''"],
    ["image_source", "TEXT NOT NULL DEFAULT ''"],
    ["expiry_reason", "TEXT NOT NULL DEFAULT ''"],
    ["expired_at", "TEXT"],
    ["discovery_method", "TEXT NOT NULL DEFAULT 'automatic'"],
    ["publication_status", "TEXT NOT NULL DEFAULT 'pending'"],
  ];
  for (const [column, definition] of migrations) {
    if (existingRewardColumns.has(column)) continue;
    try { await env.DB.prepare(`ALTER TABLE rewards ADD COLUMN ${column} ${definition}`).run(); }
    catch (error) { console.error(`Migration rewards.${column} failed`, error); throw new Error(`A migração do banco não conseguiu criar rewards.${column}.`); }
  }
  const sourceMigrations = [
    ["source_kind", "TEXT NOT NULL DEFAULT 'external_discovery'"],
    ["priority", "INTEGER NOT NULL DEFAULT 50"],
  ];
  for (const [column, definition] of sourceMigrations) {
    if (existingSourceColumns.has(column)) continue;
    await env.DB.prepare(`ALTER TABLE sources ADD COLUMN ${column} ${definition}`).run();
  }
  const collectionLogMigrations = [
    ["accepted_count", "INTEGER NOT NULL DEFAULT 0"],
    ["unconfirmed_count", "INTEGER NOT NULL DEFAULT 0"],
    ["expired_count", "INTEGER NOT NULL DEFAULT 0"],
    ["rejected_count", "INTEGER NOT NULL DEFAULT 0"],
    ["rejection_reason", "TEXT NOT NULL DEFAULT ''"],
  ];
  for (const [column, definition] of collectionLogMigrations) {
    if (existingCollectionLogColumns.has(column)) continue;
    await env.DB.prepare(`ALTER TABLE collection_logs ADD COLUMN ${column} ${definition}`).run();
  }
  await env.DB.prepare(`CREATE TABLE IF NOT EXISTS collection_diagnostics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER,
    game_id INTEGER,
    checked_at TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'link',
    discovered_url TEXT NOT NULL DEFAULT '',
    final_url TEXT NOT NULL DEFAULT '',
    reward_code TEXT NOT NULL DEFAULT '',
    reward_key TEXT NOT NULL DEFAULT '',
    reward_type TEXT NOT NULL DEFAULT '',
    reward_amount TEXT NOT NULL DEFAULT '',
    outcome TEXT NOT NULL DEFAULT 'rejected',
    classification TEXT NOT NULL DEFAULT 'UNCONFIRMED',
    reason TEXT NOT NULL DEFAULT '',
    FOREIGN KEY (source_id) REFERENCES sources(id),
    FOREIGN KEY (game_id) REFERENCES games(id)
  )`).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS collection_diagnostics_source ON collection_diagnostics (source_id, checked_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS rewards_reward_key ON rewards (reward_key)").run();
  if (!existingGameColumns.has("reward_mode")) {
    try { await env.DB.prepare("ALTER TABLE games ADD COLUMN reward_mode TEXT NOT NULL DEFAULT 'links'").run(); }
    catch (error) { console.error("Migration games.reward_mode failed", error); throw new Error("A migração do banco não conseguiu criar games.reward_mode."); }
  }
  const rows = await env.DB.prepare("SELECT id, game_id, url, original_url, normalized_url, status, reward_status, reward_code, reward_key, final_url, redemption_url, link_status, created_at, verified_at, found_at, last_checked_at, name, type, quantity, reward_type, reward_amount, reward_description, source_excerpt, source, discovery_method FROM rewards").all();
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
    const urlIdentifiers = rewardUrlIdentifiers(originalUrl);
    migrationStatements.push(env.DB.prepare("UPDATE rewards SET original_url = ?, normalized_url = ?, final_url = ?, redemption_url = ?, reward_key = ?, found_at = ?, last_checked_at = ?, link_status = ?, reward_status = ?, status = ?, reward_type = ?, reward_amount = ?, reward_description = ?, discovery_method = COALESCE(NULLIF(discovery_method, ''), 'automatic'), date_key = COALESCE(NULLIF(date_key, ''), ?), time_label = COALESCE(NULLIF(time_label, ''), ?) WHERE id = ?")
      .bind(originalUrl, normalized, finalUrl, row.redemption_url || (row.reward_code ? originalUrl : ""), rewardKey, foundAt, checkedAt, row.link_status || "active", rewardStatus, rewardStatus === "confirmed" ? "confirmed" : rewardStatus === "expired_invalid" ? "expired_invalid" : "unconfirmed", rewardType, rewardAmount, rewardDescription, parts.date, parts.time, row.id));
    migrationStatements.push(env.DB.prepare("UPDATE rewards SET reward_identifier = COALESCE(NULLIF(reward_identifier, ''), ?), reward_pcode = COALESCE(NULLIF(reward_pcode, ''), ?), reward_c = COALESCE(NULLIF(reward_c, ''), ?) WHERE id = ?")
      .bind(urlIdentifiers.identifier, urlIdentifiers.pcode, urlIdentifiers.c, row.id));
  }
  migrationStatements.push(env.DB.prepare("UPDATE rewards SET name = '', type = '', quantity = '' WHERE lower(name) IN ('link de recompensa', 'reward link') AND (source_excerpt LIKE 'A URL foi encontrada%' OR source_excerpt LIKE 'A URL was found%')"));
  const catalogStatements = targetCatalog.map(([name, slug, description, mode, image]) => env.DB.prepare("INSERT OR IGNORE INTO games (name, slug, description, reward_mode, image, active) VALUES (?, ?, ?, ?, ?, 1)").bind(name, slug, description, mode, image));
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
  const reportedCoinMasterBrokenUrl = normalizeUrl(COIN_MASTER_USER_REPORTED_BROKEN_URL);
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET link_status = 'problem', reward_status = 'unknown', status = 'unconfirmed', publication_status = 'rejected', expiry_reason = ?, expired_at = NULL WHERE game_id IN (SELECT id FROM games WHERE slug = 'coin-master') AND (normalized_url = ? OR original_url = ? OR url = ? OR final_url = ?)")
    .bind(COIN_MASTER_USER_REPORTED_BROKEN_REASON, reportedCoinMasterBrokenUrl, COIN_MASTER_USER_REPORTED_BROKEN_URL, COIN_MASTER_USER_REPORTED_BROKEN_URL, COIN_MASTER_USER_REPORTED_BROKEN_URL));
  COIN_MASTER_MANUAL_TESTS.forEach((test) => {
    const normalized = normalizeUrl(test.url);
    catalogStatements.push(env.DB.prepare("UPDATE rewards SET status = 'confirmed', reward_status = 'confirmed', link_status = 'active', publication_status = 'approved', reward_type = CASE WHEN reward_type = '' THEN 'rolls' ELSE reward_type END, reward_amount = ?, quantity = ?, expiry_reason = '', expired_at = NULL, last_checked_at = COALESCE(last_checked_at, ?) WHERE game_id IN (SELECT id FROM games WHERE slug = 'coin-master') AND (normalized_url = ? OR original_url = ? OR url = ? OR final_url = ?)")
      .bind(test.amount, test.amount, nowIso(), normalized, test.url, test.url, test.url));
  });
  // Catalog synchronization is additive. Existing games and source rows are
  // deliberately left untouched; a new registry entry may add or reactivate
  // a source, but this pass must never deactivate a source that already works.
  catalogSources.forEach(([gameName, sourceUrl, parserType = "html_links"]) => {
    catalogStatements.push(env.DB.prepare("INSERT INTO sources (game_id, name, url, active, parser_type) SELECT id, ?, ?, 1, ? FROM games WHERE name = ? AND NOT EXISTS (SELECT 1 FROM sources WHERE game_id = games.id AND url = ?)").bind(`${gameName} · ${parserType === "html_codes" ? "códigos oficiais" : parserType === "travel_town_card" ? "Travel Town Card" : "links públicos"}`, sourceUrl, parserType, gameName, sourceUrl));
    catalogStatements.push(env.DB.prepare("UPDATE sources SET name = ? WHERE url = ? AND game_id IN (SELECT id FROM games WHERE name = ?)").bind(`${gameName} · ${parserType === "html_codes" ? "códigos oficiais" : parserType === "travel_town_card" ? "Travel Town Card" : "links públicos"}`, sourceUrl, gameName));
    catalogStatements.push(env.DB.prepare("UPDATE sources SET active = 1, last_error = NULL WHERE url = ? AND game_id IN (SELECT id FROM games WHERE name = ?)").bind(sourceUrl, gameName));
  });
  EVENT_SOURCE_REGISTRY.forEach((source) => {
    catalogStatements.push(env.DB.prepare("INSERT OR IGNORE INTO event_sources (game_id, name, url, active, source_kind, parser_type, priority) SELECT id, ?, ?, 1, ?, 'html_event', ? FROM games WHERE slug = ?").bind(source.name, source.url, source.source_kind, source.priority, source.slug));
    catalogStatements.push(env.DB.prepare("UPDATE event_sources SET name = ?, source_kind = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE url = ? AND game_id IN (SELECT id FROM games WHERE slug = ?)").bind(source.name, source.source_kind, source.priority, source.url, source.slug));
    if (["official", "official_help", "official_news", "official_social", "official_store"].includes(source.source_kind)) {
      catalogStatements.push(env.DB.prepare("INSERT OR IGNORE INTO news_sources (game_id, name, url, active, source_kind, priority) SELECT id, ?, ?, 1, 'official_news', ? FROM games WHERE slug = ?").bind(`${source.name} · novidades`, source.url, source.priority, source.slug));
      catalogStatements.push(env.DB.prepare("UPDATE news_sources SET name = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE url = ? AND game_id IN (SELECT id FROM games WHERE slug = ?)").bind(`${source.name} · novidades`, source.priority, source.url, source.slug));
    }
  });
  MATCH_MASTERS_SOURCES.forEach((source) => {
    catalogStatements.push(env.DB.prepare("INSERT INTO sources (game_id, name, url, active, parser_type, source_kind, priority) SELECT id, ?, ?, 1, ?, ?, ? FROM games WHERE slug = 'match-masters' AND NOT EXISTS (SELECT 1 FROM sources WHERE game_id = games.id AND url = ?)")
      .bind(source.name, source.url, source.parser_type, source.source_kind, source.priority, source.url));
    catalogStatements.push(env.DB.prepare("UPDATE sources SET name = ?, active = 1, parser_type = ?, source_kind = ?, priority = ?, last_error = NULL WHERE url = ? AND game_id IN (SELECT id FROM games WHERE slug = 'match-masters')")
      .bind(source.name, source.parser_type, source.source_kind, source.priority, source.url));
  });
  EXPANSION_SOURCES.forEach((source) => {
    catalogStatements.push(env.DB.prepare("INSERT INTO sources (game_id, name, url, active, parser_type, source_kind, priority) SELECT id, ?, ?, 1, ?, ?, ? FROM games WHERE slug = ? AND NOT EXISTS (SELECT 1 FROM sources WHERE game_id = games.id AND url = ?)")
      .bind(source.name, source.url, source.parser_type, source.source_kind, source.priority, source.slug, source.url));
    catalogStatements.push(env.DB.prepare("UPDATE sources SET name = ?, active = 1, parser_type = ?, source_kind = ?, priority = ?, last_error = NULL WHERE url = ? AND game_id IN (SELECT id FROM games WHERE slug = ?)")
      .bind(source.name, source.parser_type, source.source_kind, source.priority, source.url, source.slug));
  });
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET quantity = '', reward_amount = '', reward_description = CASE WHEN reward_description = '' OR instr(lower(reward_description), '30 free energy') > 0 OR instr(lower(source_excerpt), '30 free energy') > 0 THEN 'Energia grátis encontrada em uma fonte anterior.' ELSE reward_description END WHERE game_id IN (SELECT id FROM games WHERE slug = 'travel-town') AND instr(lower(source), 'mobilegamecentral.com') > 0 AND instr(lower(source), 'traveltowncard.com') = 0"));
  // Existing confirmed records remain available for the other games. New
  // candidates must pass the same publication gate below before they can be
  // inserted into the public list.
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET publication_status = 'approved' WHERE game_id NOT IN (SELECT id FROM games WHERE slug = 'coin-master') AND status = 'confirmed' AND link_status = 'active' AND publication_status IN ('pending', '')"));
  // Match Masters candidates are not public merely because the collector saw
  // them. Codes stay in their own section; automatic links need publication
  // evidence, while the four owner-tested links are preserved explicitly.
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET publication_status = CASE WHEN reward_code <> '' THEN 'published' ELSE 'pending' END WHERE game_id IN (SELECT id FROM games WHERE slug = 'match-masters')"));
  MATCH_MASTERS_MANUAL_TESTS.forEach((test) => {
    const normalized = normalizeUrl(test.url);
    catalogStatements.push(env.DB.prepare("UPDATE rewards SET publication_status = 'published', status = ?, reward_status = ?, link_status = ?, reward_amount = ?, quantity = ?, reward_type = '', type = '', name = '', reward_description = ?, expiry_reason = CASE WHEN ? = 'problem' THEN ? ELSE '' END, expired_at = NULL, last_checked_at = COALESCE(last_checked_at, ?) WHERE game_id IN (SELECT id FROM games WHERE slug = 'match-masters') AND discovery_method = 'manual' AND (normalized_url = ? OR original_url = ? OR url = ? OR final_url = ?)")
      .bind(test.rewardStatus === 'confirmed' ? 'confirmed' : 'unconfirmed', test.rewardStatus, test.linkStatus, test.amount, test.amount, test.description, test.linkStatus, test.description, nowIso(), normalized, test.url, test.url, test.url));
  });
  // Keep historical rewards and their votes/notice history. Legacy records
  // may be reclassified below, but catalog initialization never deletes them.
  const legacySpinUrl = normalizeUrl(MATCH_MASTERS_EXPIRED_SPIN_URL);
  const expiredMatchMastersSpinUrl = normalizeUrl(MATCH_MASTERS_EXPIRED_SPIN_URL);
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET link_status = 'expired', reward_status = 'expired_invalid', status = 'expired_invalid', expiry_reason = ?, expired_at = COALESCE(expired_at, CURRENT_TIMESTAMP), date_key = '', time_label = '' WHERE game_id IN (SELECT id FROM games WHERE slug = 'match-masters') AND (normalized_url = ? OR original_url = ? OR url = ? OR final_url = ? OR reward_key = ?)")
    .bind("Link de Spin informado como expirado.", expiredMatchMastersSpinUrl, MATCH_MASTERS_EXPIRED_SPIN_URL, MATCH_MASTERS_EXPIRED_SPIN_URL, MATCH_MASTERS_EXPIRED_SPIN_URL, `url:${expiredMatchMastersSpinUrl}`));
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET name = CASE WHEN name = '' THEN 'Reward Key: Treasure' ELSE name END, type = CASE WHEN type = '' THEN 'Reward Key' ELSE type END, reward_type = CASE WHEN reward_type = '' THEN 'Reward Key' ELSE reward_type END, reward_description = ?, image = '', image_source = '', reward_status = 'confirmed', status = 'confirmed', link_status = 'active', last_checked_at = COALESCE(last_checked_at, ?) WHERE game_id IN (SELECT id FROM games WHERE slug = 'match-masters') AND reward_code = ?")
    .bind(MATCH_MASTERS_REWARD_KEY_PROOF, nowIso(), 'Treasure'));
  const alternativeUrl = normalizeUrl(MONOPOLY_GO_ALTERNATIVE_URL);
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET reward_key = COALESCE(NULLIF(reward_key, ''), ?), final_url = COALESCE(NULLIF(final_url, ''), ?), reward_type = '', reward_amount = '', quantity = '' WHERE game_id IN (SELECT id FROM games WHERE slug = 'monopoly-go') AND normalized_url = ?")
    .bind(`url:${alternativeUrl}`, MONOPOLY_GO_ALTERNATIVE_URL, alternativeUrl));
  const problemUrl = normalizeUrl(MONOPOLY_GO_PROBLEM_URL);
  catalogStatements.push(env.DB.prepare("UPDATE rewards SET link_status = 'problem', reward_status = 'unknown', status = 'unconfirmed', reward_key = COALESCE(NULLIF(reward_key, ''), ?), final_url = COALESCE(NULLIF(final_url, ''), ?), expiry_reason = ?, expired_at = NULL, last_checked_at = ? WHERE game_id IN (SELECT id FROM games WHERE slug = 'monopoly-go') AND (normalized_url = ? OR original_url = ? OR url = ? OR final_url = ? OR reward_key = ?)")
    .bind(`url:${problemUrl}`, MONOPOLY_GO_PROBLEM_URL, MONOPOLY_GO_PROBLEM_REASON, nowIso(), problemUrl, MONOPOLY_GO_PROBLEM_URL, MONOPOLY_GO_PROBLEM_URL, MONOPOLY_GO_PROBLEM_URL, `url:${problemUrl}`));
  if (migrationStatements.length) await env.DB.batch(migrationStatements);
  if (catalogStatements.length) await env.DB.batch(catalogStatements);
  await repairMatchMastersPublication(env);
  const ownerRewardAdded = await ensureOwnerAddedMatchMastersReward(env);
  if (ownerRewardAdded) await notifyNewRewards(env, [`${MATCH_MASTERS_OWNER_ADDED_REWARD.dateKey}T00:00:00.000Z`]);
  await repairCoinMasterUrlDates(env);
  await auditCoinMasterPublication(env);
  schemaReady = true;
}
const readBody = async (request) => { try { return await request.json(); } catch { return null; } };

// ---------------------------------------------------------------------------
// EVENT COLLECTOR (isolated from rewards)
// ---------------------------------------------------------------------------
// This pipeline has its own sources, tables, logs and scheduler rotation.
// It never reads or writes rewards, reward_key, opened state, favourites or
// existing notification delivery rows.
const EVENT_COLLECTION_INTERVAL_MS = 6 * 60 * 60 * 1000;
let eventCollectionInFlight = null;
const eventDecode = (value) => String(value || "")
  .replace(/&amp;/gi, "&").replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
const eventCleanText = (value, max = 700) => eventDecode(String(value || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim().slice(0, max);
const eventSlugify = (value) => eventCleanText(value, 180).toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || "evento";
const eventStableHash = (value) => {
  let hash = 2166136261;
  for (const char of String(value || "")) { hash ^= char.codePointAt(0); hash = Math.imul(hash, 16777619); }
  return (hash >>> 0).toString(36);
};
const eventValidDateTime = (value) => {
  const text = String(value || "").trim();
  if (!text) return null;
  const date = new Date(text.length === 10 ? `${text}T00:00:00Z` : text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};
const eventDateOnly = (value) => { const date = eventValidDateTime(value); return date ? date.slice(0, 10) : ""; };
const eventStatus = (startDate, endDate, now = Date.now()) => {
  const start = eventValidDateTime(startDate)?.valueOf() ?? null;
  const end = eventValidDateTime(endDate)?.valueOf() ?? null;
  // A date-only end is inclusive through the end of that UTC day.
  const endInclusive = endDate && String(endDate).length === 10 && end !== null ? end + 86400000 - 1 : end;
  if (endInclusive !== null && endInclusive < now) return "ended";
  if (start !== null && start > now) return "upcoming";
  if (start !== null && start <= now && (endInclusive === null || endInclusive >= now)) return "active";
  return "upcoming";
};
const eventStatusLabel = (status) => ({ active: "ACONTECENDO AGORA", upcoming: "COMEÇA EM BREVE", ended: "ENCERRADO" }[status] || "COMEÇA EM BREVE");
const eventOfficialKind = (kind) => ["official", "official_help", "official_news", "official_social", "official_store"].includes(String(kind || "").toLowerCase());
const eventIsCandidateTitle = (value) => /\b(event|events|evento|eventos|season|temporada|tournament|torneio|challenge|desafio|competition|competição|campaign|campanha|anniversary|anivers[aá]rio|festival|battle pass|championship|campeonato|cup|special)\b/i.test(String(value || ""));
const eventTypeFrom = (value) => {
  const text = String(value || "");
  if (/season|temporada/i.test(text)) return "season";
  if (/tournament|torneio|championship|campeonato|cup/i.test(text)) return "tournament";
  if (/challenge|desafio|competition|competição/i.test(text)) return "challenge";
  if (/campaign|campanha|anniversary|anivers[aá]rio/i.test(text)) return "campaign";
  if (/festival/i.test(text)) return "festival";
  return "event";
};
const eventExtractDates = (value) => {
  const text = eventCleanText(value, 10000);
  const iso = [...text.matchAll(/\b20\d{2}-\d{2}-\d{2}(?:T[^\s<]+)?\b/g)].map((match) => eventValidDateTime(match[0])).filter(Boolean);
  const named = [...text.matchAll(/\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,\s*|\s+)20\d{2}\b/gi)].map((match) => eventValidDateTime(match[0])).filter(Boolean);
  const values = [...new Set([...iso, ...named])].sort();
  return { start_date: values[0] || "", end_date: values[1] || "" };
};
const eventMeta = (html, propertyOrName) => {
  const escaped = String(propertyOrName).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = String(html || "").match(new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"))
    || String(html || "").match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"));
  return eventCleanText(match?.[1] || "", 1000);
};
const eventAbsoluteUrl = (value, sourceUrl) => { try { return new URL(String(value || ""), sourceUrl).toString(); } catch { return ""; } };
const eventJsonLdCandidates = (html, sourceUrl) => {
  const candidates = [];
  const scripts = String(html || "").matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) return value.forEach(visit);
    if (Array.isArray(value["@graph"])) value["@graph"].forEach(visit);
    const type = Array.isArray(value["@type"]) ? value["@type"].join(" ") : String(value["@type"] || "");
    if (!/\bEvent\b/i.test(type)) return;
    candidates.push({
      title: eventCleanText(value.name, 180),
      description: eventCleanText(value.description, 700),
      image: eventAbsoluteUrl(Array.isArray(value.image) ? value.image[0] : value.image, sourceUrl),
      event_type: eventTypeFrom(`${value.name || ""} ${type}`),
      start_date: eventValidDateTime(value.startDate) || "",
      end_date: eventValidDateTime(value.endDate) || "",
      source_event_id: eventCleanText(value.identifier || value["@id"] || value.url || "", 240),
      candidate_url: eventAbsoluteUrl(value.url || "", sourceUrl),
      how_to_participate: "",
      rewards_text: "",
    });
  };
  for (const match of scripts) {
    try { visit(JSON.parse(match[1])); } catch { /* invalid JSON-LD is a discarded candidate */ }
  }
  return candidates;
};
const eventExtractCandidates = (html, sourceUrl) => {
  const raw = String(html || "");
  const candidates = eventJsonLdCandidates(raw, sourceUrl);
  const title = eventMeta(raw, "og:title") || eventMeta(raw, "twitter:title") || eventCleanText(raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "", 180);
  const description = eventMeta(raw, "og:description") || eventMeta(raw, "description") || eventCleanText(raw.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || "", 700);
  const dates = eventExtractDates(raw);
  // Generic pages are not events. The fallback is accepted only if the
  // official page itself names an event-like subject; it never invents dates
  // or rewards and never treats a third-party page as confirmation.
  if (!candidates.length && eventIsCandidateTitle(title) && title.length >= 5) {
    candidates.push({ title, description, image: eventAbsoluteUrl(eventMeta(raw, "og:image"), sourceUrl), event_type: eventTypeFrom(title), ...dates, source_event_id: "", candidate_url: sourceUrl, how_to_participate: "", rewards_text: "" });
  }
  return candidates.slice(0, 20);
};
const eventNormalizeTitle = (value) => eventCleanText(value, 180).toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const eventTitleSimilarity = (a, b) => {
  const left = new Set(eventNormalizeTitle(a).split(" ").filter((word) => word.length > 2));
  const right = new Set(eventNormalizeTitle(b).split(" ").filter((word) => word.length > 2));
  if (!left.size || !right.size) return 0;
  const common = [...left].filter((word) => right.has(word)).length;
  return common / Math.max(left.size, right.size);
};
const eventPublicFields = (row) => ({
  event_id: row.event_id,
  game_id: Number(row.game_id),
  game_name: row.game_name || "",
  game_slug: row.game_slug || "",
  title: row.title || "",
  name: row.title || "",
  slug: row.slug || eventSlugify(row.title),
  description: row.description || "",
  image: row.image || "",
  event_type: row.event_type || "event",
  start_date: row.start_date || "",
  end_date: row.end_date || "",
  status: row.status || eventStatus(row.start_date, row.end_date),
  status_label: eventStatusLabel(row.status || eventStatus(row.start_date, row.end_date)),
  official_source: row.official_source || row.source_name || "",
  source_name: row.source_name || row.official_source || "",
  source_url: row.source_url || "",
  detected_at: row.detected_at || "",
  validated_at: row.validated_at || "",
  updated_at: row.updated_at || "",
  how_to_participate: row.how_to_participate || "",
  rewards_text: row.rewards_text || "",
});
const refreshEventStatuses = async (env) => {
  const rows = (await env.DB.prepare("SELECT event_id, start_date, end_date, status FROM events WHERE publication_status = 'published'").all()).results;
  const changed = rows.filter((row) => eventStatus(row.start_date, row.end_date) !== row.status);
  if (changed.length) await env.DB.batch(changed.map((row) => env.DB.prepare("UPDATE events SET status = ?, updated_at = ? WHERE event_id = ?").bind(eventStatus(row.start_date, row.end_date), nowIso(), row.event_id)));
  return changed.length;
};
const collectOneEventSource = async (env, source, options = {}) => {
  const startedAt = nowIso();
  const diagnostics = [];
  let httpStatus = null;
  let candidates = [];
  let publishedCount = 0;
  let updatedCount = 0;
  let duplicatesIgnored = 0;
  let discardedCount = 0;
  let discardReason = "";
  try {
    const response = await fetch(source.url, { headers: { accept: "text/html,application/xhtml+xml,application/ld+json", "user-agent": "GameGiftsEventsBot/1.0 (+public event index)" }, redirect: "follow" });
    httpStatus = response.status;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    candidates = eventExtractCandidates(html, source.url);
    const game = await env.DB.prepare("SELECT id, name, slug FROM games WHERE id = ? AND active = 1 LIMIT 1").bind(source.game_id).first();
    if (!game) throw new Error("Jogo da fonte não está ativo.");
    for (const candidate of candidates) {
      const title = eventCleanText(candidate.title, 180);
      if (!title || !eventIsCandidateTitle(title)) {
        discardedCount++;
        discardReason = "Título sem sinal claro de evento.";
        diagnostics.push({ candidate, outcome: "discarded", reason: discardReason });
        continue;
      }
      if (!eventOfficialKind(source.source_kind)) {
        discardedCount++;
        discardReason = "Fonte de terceiros usada apenas para descoberta; não confirma evento.";
        diagnostics.push({ candidate, outcome: "discarded", reason: discardReason });
        continue;
      }
      const startDate = eventValidDateTime(candidate.start_date) || "";
      const endDate = eventValidDateTime(candidate.end_date) || "";
      const officialKey = eventCleanText(candidate.source_event_id, 240);
      const eventKey = officialKey ? `${game.slug}|official:${officialKey}` : `${game.slug}|title:${eventNormalizeTitle(title)}|start:${startDate.slice(0, 10)}|end:${endDate.slice(0, 10)}`;
      let existing = officialKey ? await env.DB.prepare("SELECT * FROM events WHERE game_id = ? AND source_event_id = ? LIMIT 1").bind(game.id, officialKey).first() : null;
      if (!existing) {
        const rows = (await env.DB.prepare("SELECT * FROM events WHERE game_id = ? AND publication_status = 'published' ORDER BY updated_at DESC LIMIT 100").bind(game.id).all()).results;
        existing = rows.find((row) => (row.source_url === source.url && eventTitleSimilarity(row.title, title) >= 0.55 && (!startDate || !row.start_date || row.start_date.slice(0, 10) === startDate.slice(0, 10))) || (eventTitleSimilarity(row.title, title) >= 0.82 && (startDate === row.start_date || endDate === row.end_date))) || null;
      }
      const now = nowIso();
      const eventId = existing?.event_id || `evt_${eventStableHash(eventKey)}`;
      const slug = existing?.slug || eventSlugify(title);
      const status = eventStatus(startDate, endDate);
      const values = [eventId, game.id, game.name, game.slug, title, slug, eventCleanText(candidate.description, 700), eventAbsoluteUrl(candidate.image, source.url), candidate.event_type || eventTypeFrom(title), startDate, endDate, status, source.name, source.name, source.url, source.source_kind, existing?.detected_at || now, now, now, officialKey, eventCleanText(candidate.how_to_participate, 700), eventCleanText(candidate.rewards_text, 700), now];
      if (existing) {
        await env.DB.prepare("UPDATE events SET game_name = ?, game_slug = ?, title = ?, slug = ?, description = ?, image = ?, event_type = ?, start_date = ?, end_date = ?, status = ?, official_source = ?, source_name = ?, source_url = ?, source_kind = ?, validated_at = ?, updated_at = ?, source_event_id = ?, how_to_participate = ?, rewards_text = ?, last_seen_at = ? WHERE event_id = ?")
          .bind(values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9] || existing.start_date || "", values[10] || existing.end_date || "", values[11], values[12], values[13], values[14], values[15], values[17], values[18], values[19], values[20], values[21], values[22], eventId).run();
        updatedCount++;
      } else if (!options.save) {
        publishedCount++;
      } else {
        await env.DB.prepare("INSERT INTO events (event_id, game_id, game_name, game_slug, title, slug, description, image, event_type, start_date, end_date, status, official_source, source_name, source_url, source_kind, detected_at, validated_at, updated_at, source_event_id, how_to_participate, rewards_text, publication_status, last_seen_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)")
          .bind(...values).run();
        publishedCount++;
      }
      diagnostics.push({ candidate, outcome: existing ? "updated" : "published", reason: "Confirmado em fonte oficial." });
    }
    const finishedAt = nowIso();
    if (options.save !== false) await env.DB.prepare("UPDATE event_sources SET last_checked_at = ?, last_success_at = ?, last_error = NULL, updated_at = ? WHERE id = ?").bind(finishedAt, finishedAt, finishedAt, source.id).run();
    await env.DB.prepare("INSERT INTO event_collection_logs (source_id, started_at, finished_at, http_status, candidates_found, published_count, updated_count, duplicates_ignored, discarded_count, discard_reason, error) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)").bind(source.id, startedAt, finishedAt, httpStatus, candidates.length, publishedCount, updatedCount, duplicatesIgnored, discardedCount, discardReason).run();
    if (diagnostics.length && options.save !== false) await env.DB.batch(diagnostics.map((item) => env.DB.prepare("INSERT INTO event_collection_diagnostics (source_id, game_id, checked_at, candidate_title, candidate_url, outcome, reason) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(source.id, source.game_id, finishedAt, eventCleanText(item.candidate?.title, 180), eventAbsoluteUrl(item.candidate?.candidate_url, source.url), item.outcome, item.reason)));
    return { source_id: source.id, name: source.name, url: source.url, http_status: httpStatus, candidates_found: candidates.length, published_count: publishedCount, updated_count: updatedCount, duplicates_ignored: duplicatesIgnored, discarded_count: discardedCount, diagnostics, started_at: startedAt, finished_at: finishedAt };
  } catch (error) {
    const finishedAt = nowIso();
    const message = String(error?.message || error || "Falha ao consultar fonte de eventos.").slice(0, 500);
    if (options.save !== false) {
      await env.DB.prepare("UPDATE event_sources SET last_checked_at = ?, last_error = ?, updated_at = ? WHERE id = ?").bind(finishedAt, message, finishedAt, source.id).run();
      await env.DB.prepare("INSERT INTO event_collection_logs (source_id, started_at, finished_at, http_status, candidates_found, discarded_count, discard_reason, error) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(source.id, startedAt, finishedAt, httpStatus, candidates.length, discardedCount, discardReason, message).run();
    }
    return { source_id: source.id, name: source.name, url: source.url, http_status: httpStatus, candidates_found: candidates.length, published_count: 0, updated_count: 0, duplicates_ignored: 0, discarded_count: discardedCount, error: message, diagnostics, started_at: startedAt, finished_at: finishedAt };
  }
};
const collectDueEventSources = async (env, sourceId = null) => {
  if (eventCollectionInFlight) return eventCollectionInFlight;
  const cutoff = new Date(Date.now() - EVENT_COLLECTION_INTERVAL_MS).toISOString();
  const source = sourceId
    ? await env.DB.prepare("SELECT es.*, g.name AS game_name, g.slug AS game_slug FROM event_sources es JOIN games g ON g.id = es.game_id WHERE es.id = ? AND es.active = 1 AND g.active = 1").bind(sourceId).first()
    : await env.DB.prepare("SELECT es.*, g.name AS game_name, g.slug AS game_slug FROM event_sources es JOIN games g ON g.id = es.game_id WHERE es.active = 1 AND g.active = 1 AND (es.last_checked_at IS NULL OR es.last_checked_at < ?) ORDER BY COALESCE(es.last_checked_at, '1970-01-01T00:00:00.000Z') ASC, es.priority DESC, es.id ASC LIMIT 1").bind(cutoff).first();
  if (!source) return null;
  eventCollectionInFlight = collectOneEventSource(env, source).finally(() => { eventCollectionInFlight = null; });
  return eventCollectionInFlight;
};
// News has its own tables and rotation. It deliberately rejects event-like
// headlines so an event is never duplicated as a generic news item.
const NEWS_COLLECTION_INTERVAL_MS = 12 * 60 * 60 * 1000;
let newsCollectionInFlight = null;
const newsType = (value) => /maintenance|maintenan[çc]a/i.test(value) ? "maintenance" : /version|update|atualiza|feature|recurso|season|temporada/i.test(value) ? "update" : "announcement";
const newsExtractCandidates = (html, sourceUrl) => {
  const output = [];
  const scripts = String(html || "").matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) return value.forEach(visit);
    if (Array.isArray(value["@graph"])) value["@graph"].forEach(visit);
    const type = Array.isArray(value["@type"]) ? value["@type"].join(" ") : String(value["@type"] || "");
    if (!/NewsArticle|Article|BlogPosting/i.test(type) || eventIsCandidateTitle(value.headline || value.name)) return;
    output.push({ title: eventCleanText(value.headline || value.name, 180), summary: eventCleanText(value.description, 700), image: eventAbsoluteUrl(Array.isArray(value.image) ? value.image[0] : value.image, sourceUrl), published_at: eventValidDateTime(value.datePublished || value.dateModified) || "", source_item_id: eventCleanText(value.identifier || value["@id"] || value.url || "", 240), candidate_url: eventAbsoluteUrl(value.url || "", sourceUrl) });
  };
  for (const match of scripts) { try { visit(JSON.parse(match[1])); } catch {} }
  if (!output.length) {
    const title = eventMeta(html, "og:title") || eventCleanText(String(html || "").match(/<article[^>]*>\s*(?:<h1|<h2)[^>]*>([\s\S]*?)<\/(?:h1|h2)>/i)?.[1] || "", 180);
    const published = eventMeta(html, "article:published_time") || eventMeta(html, "datePublished");
    const summary = eventMeta(html, "og:description") || eventMeta(html, "description");
    if (title && published && !eventIsCandidateTitle(title)) output.push({ title, summary, image: eventAbsoluteUrl(eventMeta(html, "og:image"), sourceUrl), published_at: eventValidDateTime(published) || "", source_item_id: "", candidate_url: sourceUrl });
  }
  return output.filter((item) => item.title && item.published_at).slice(0, 20);
};
const newsPublicFields = (row) => ({ news_id: row.news_id || (row.id ? `legacy_news_${row.id}` : ""), id: row.news_id || (row.id ? `legacy_news_${row.id}` : ""), game_id: Number(row.game_id), game_name: row.game_name || "", game_slug: row.game_slug || "", title: row.title || "", slug: row.slug || eventSlugify(row.title), summary: row.summary || "", image: row.image || "", category: row.category || "update", published_at: row.published_at || "", official_source: row.official_source || row.source_name || row.source || "", source_name: row.source_name || row.official_source || row.source || "", source_url: row.source_url || row.original_url || "", detected_at: row.detected_at || row.created_at || "", validated_at: row.validated_at || "", updated_at: row.updated_at || row.last_checked_at || row.created_at || "" });
const collectOneNewsSource = async (env, source) => {
  const startedAt = nowIso(); let httpStatus = null; let candidates = []; let publishedCount = 0; let updatedCount = 0; let discardedCount = 0; let discardReason = "";
  try {
    const response = await fetch(source.url, { headers: { accept: "text/html,application/xhtml+xml,application/ld+json", "user-agent": "GameGiftsNewsBot/1.0 (+public news index)" }, redirect: "follow" });
    httpStatus = response.status; if (!response.ok) throw new Error(`HTTP ${response.status}`);
    candidates = newsExtractCandidates(await response.text(), source.url);
    const game = await env.DB.prepare("SELECT id, name, slug FROM games WHERE id = ? AND active = 1 LIMIT 1").bind(source.game_id).first();
    if (!game) throw new Error("Jogo da fonte não está ativo.");
    for (const candidate of candidates) {
      if (!eventOfficialKind(source.source_kind) || eventIsCandidateTitle(candidate.title)) { discardedCount++; discardReason = "Fonte não oficial ou título classificado como evento."; continue; }
      const key = candidate.source_item_id || `${game.slug}|${eventNormalizeTitle(candidate.title)}|${candidate.published_at.slice(0, 10)}`;
      const existing = await env.DB.prepare("SELECT * FROM news_items WHERE game_id = ? AND (source_item_id = ? OR (source_url = ? AND slug = ?)) LIMIT 1").bind(game.id, candidate.source_item_id || "", source.url, eventSlugify(candidate.title)).first();
      const now = nowIso(); const newsId = existing?.news_id || `news_${eventStableHash(key)}`; const values = [newsId, game.id, game.name, game.slug, eventCleanText(candidate.title, 180), existing?.slug || eventSlugify(candidate.title), eventCleanText(candidate.summary, 700), eventAbsoluteUrl(candidate.image, source.url), newsType(`${candidate.title} ${candidate.summary}`), candidate.published_at, source.name, source.name, source.url, source.source_kind, existing?.detected_at || now, now, now, candidate.source_item_id || "", now];
      if (existing) { await env.DB.prepare("UPDATE news_items SET game_name = ?, game_slug = ?, title = ?, slug = ?, summary = ?, image = ?, category = ?, published_at = ?, official_source = ?, source_name = ?, source_url = ?, source_kind = ?, validated_at = ?, updated_at = ?, source_item_id = ?, last_seen_at = ? WHERE news_id = ?").bind(values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9], values[10], values[11], values[12], values[13], values[15], values[16], values[17], values[18], newsId).run(); updatedCount++; }
      else { await env.DB.prepare("INSERT INTO news_items (news_id, game_id, game_name, game_slug, title, slug, summary, image, category, published_at, official_source, source_name, source_url, source_kind, detected_at, validated_at, updated_at, source_item_id, publication_status, last_seen_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)").bind(...values).run(); publishedCount++; }
    }
    const finishedAt = nowIso(); await env.DB.prepare("UPDATE news_sources SET last_checked_at = ?, last_success_at = ?, last_error = NULL, updated_at = ? WHERE id = ?").bind(finishedAt, finishedAt, finishedAt, source.id).run();
    await env.DB.prepare("INSERT INTO news_collection_logs (source_id, started_at, finished_at, http_status, candidates_found, published_count, updated_count, discarded_count, discard_reason, error) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)").bind(source.id, startedAt, finishedAt, httpStatus, candidates.length, publishedCount, updatedCount, discardedCount, discardReason).run();
    return { source_id: source.id, name: source.name, url: source.url, http_status: httpStatus, candidates_found: candidates.length, published_count: publishedCount, updated_count: updatedCount, discarded_count: discardedCount };
  } catch (error) {
    const finishedAt = nowIso(); const message = String(error?.message || error || "Falha ao consultar fonte de novidades.").slice(0, 500);
    await env.DB.prepare("UPDATE news_sources SET last_checked_at = ?, last_error = ?, updated_at = ? WHERE id = ?").bind(finishedAt, message, finishedAt, source.id).run();
    await env.DB.prepare("INSERT INTO news_collection_logs (source_id, started_at, finished_at, http_status, candidates_found, discarded_count, discard_reason, error) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(source.id, startedAt, finishedAt, httpStatus, candidates.length, discardedCount, discardReason, message).run();
    return { source_id: source.id, name: source.name, url: source.url, http_status: httpStatus, candidates_found: candidates.length, published_count: 0, updated_count: 0, discarded_count: discardedCount, error: message };
  }
};
const collectDueNewsSources = async (env, sourceId = null) => {
  if (newsCollectionInFlight) return newsCollectionInFlight;
  const cutoff = new Date(Date.now() - NEWS_COLLECTION_INTERVAL_MS).toISOString();
  const source = sourceId ? await env.DB.prepare("SELECT ns.*, g.name AS game_name, g.slug AS game_slug FROM news_sources ns JOIN games g ON g.id = ns.game_id WHERE ns.id = ? AND ns.active = 1 AND g.active = 1").bind(sourceId).first() : await env.DB.prepare("SELECT ns.*, g.name AS game_name, g.slug AS game_slug FROM news_sources ns JOIN games g ON g.id = ns.game_id WHERE ns.active = 1 AND g.active = 1 AND (ns.last_checked_at IS NULL OR ns.last_checked_at < ?) ORDER BY COALESCE(ns.last_checked_at, '1970-01-01T00:00:00.000Z') ASC, ns.priority DESC, ns.id ASC LIMIT 1").bind(cutoff).first();
  if (!source) return null;
  newsCollectionInFlight = collectOneNewsSource(env, source).finally(() => { newsCollectionInFlight = null; });
  return newsCollectionInFlight;
};
// The scheduled handler is the primary path. The due check also keeps
// Keep the automatic sweep frequent enough to catch newly published links
// while the source rotation still bounds outbound work per invocation.
// 🔒 Coleta automática: cada fonte vencida pode ser revisitada a cada 15 min.
const COLLECTION_INTERVAL_MS = 15 * 60 * 1000;
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
    if (hostname === "launch.matchmasters.com" && /^\/l\/(?:send|p)\//i.test(parsed.pathname)) return parsed.toString();
    if (["matchmasters.onelink.me", "matchmaster.oneliuk.me"].includes(hostname)) {
      let code = parsed.searchParams.get("c") || parsed.searchParams.get("pcode") || parsed.searchParams.get("reward_code") || parsed.pathname.match(/[?&](?:c|pcode|reward_code)=([^&]+)/i)?.[1] || "";
      for (let attempt = 0; attempt < 2; attempt++) {
        try { code = decodeURIComponent(code); } catch { break; }
      }
      code = String(code).trim();
      if (/^[A-Za-z0-9_-]{6,64}$/.test(code)) return `https://launch.matchmasters.com/l/p/${encodeURIComponent(code)}`;
      if (parsed.searchParams.get("pcode")) return parsed.toString();
    }
    if (hostname === "matchmasters.com") {
      const code = String(parsed.searchParams.get("c") || parsed.searchParams.get("pcode") || parsed.searchParams.get("reward_code") || "").trim();
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
    "match-masters": /(?:launch\.matchmasters\.com\/l\/(?:p|send)\/|matchmasters\.onelink\.me\/|matchmaster\.oneliuk\.me\/)/i,
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
const isTrustedRewardDestination = (game, value) => {
  try {
    const parsed = new URL(String(value || ""));
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const trusted = {
      "match-masters": /^(?:launch\.matchmasters\.com|matchmasters\.onelink\.me|matchmaster\.oneliuk\.me|matchmasters\.com)$/i,
      "coin-master": /^(?:rewards\.coinmaster\.com|static\.moonactive\.net|coinmaster\.com)$/i,
      "dice-dreams": /^(?:rewards(?:-v2)?\.dicedreams\.com|dicedreams\.com)$/i,
      "monopoly-go": /^(?:mply\.io|monopolygo\.com)$/i,
      "travel-town": /^(?:api\.traveltowngame\.net|traveltown\.onelink\.me|traveltowngame\.net)$/i,
      "crazy-fox": /^rwys\.xyz$/i,
      "piggy-go": /^(?:piggygo-jy\.forevernine\.com|forevernine\.com)$/i,
      "bingo-blitz": /^(?:bingo-app-dsa\.playtika\.com|bingoblitz\.com)$/i,
      "board-kings": /^(?:boardkings\.onelink\.me|store\.boardkings\.com|boardkings\.com|d10xl?\.com)$/i,
      "free-fire": /^(?:reward\.ff\.garena\.com|ff\.garena\.com)$/i,
      roblox: /^(?:roblox\.com|en\.help\.roblox\.com)$/i,
    };
    return Boolean(trusted[game?.slug]?.test(host));
  } catch { return false; }
};
const isMatchMastersRewardUrl = (value) => {
  try {
    const parsed = new URL(String(value || ""));
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (hostname === "launch.matchmasters.com") return /^\/l\/(?:p|send)\/[A-Za-z0-9_-]+/i.test(parsed.pathname);
    if (["matchmasters.onelink.me", "matchmaster.oneliuk.me"].includes(hostname)) return Boolean(parsed.searchParams.get("c") || parsed.searchParams.get("pcode") || parsed.searchParams.get("reward_code"));
    if (hostname === "matchmasters.com") return Boolean(parsed.searchParams.get("c") || parsed.searchParams.get("pcode") || parsed.searchParams.get("reward_code"));
  } catch {}
  return false;
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
  const possibleAmount = quantityMatch?.[1] || "";
  const amount = /^(?:19|20)\\d{2}$/.test(possibleAmount) ? "" : possibleAmount;
  return { name: "", type, quantity: amount, amount, description: text, excerpt: text };
};
const rewardKeyForCandidate = (game, candidate, foundAt, finalUrl = "") => {
  if (candidate?.reward_key) return String(candidate.reward_key).trim();
  if (candidate?.code) return codeKey(game, candidate.code);
  const info = extractExplicitReward(candidate?.label || "");
  const type = normalizeRewardType(candidate?.reward_type || info.type || "");
  const amount = String(candidate?.quantity || candidate?.reward_amount || info.amount || "").trim();
  // Match Masters links are identified by the complete discovered URL (or its
  // exact reward code), never by a URL base. The public label is evidence,
  // not a replacement for the link identity; two links can share a base path
  // while their c=/pcode= values point to different gifts.
  if (game.slug === "match-masters") {
    const discovered = candidate?.discovered_url || candidate?.url || finalUrl || "";
    // Keep every meaningful query parameter in the identity. A c= or pcode=
    // difference is allowed to represent a different reward even when the
    // host/path is identical.
    return `url:${normalizeUrl(discovered) || "unknown"}`;
  }
  if (game.slug === "coin-master") {
    const discovered = candidate?.discovered_url || candidate?.url || finalUrl || "";
    const identifiers = rewardUrlIdentifiers(discovered);
    const identifier = String(candidate?.reward_identifier || candidate?.token || identifiers.identifier || "").trim().toLowerCase();
    if (identifier) return `coin_master:${identifier}`;
  }
  const discovered = candidate?.discovered_url || candidate?.url || finalUrl || "";
  const identifiers = rewardUrlIdentifiers(discovered);
  const identifier = String(candidate?.reward_identifier || candidate?.token || identifiers.identifier || "").trim();
  const dateKey = validDate(candidate?.date_key) ? candidate.date_key : dateParts(foundAt).date;
  const destinationKey = normalizeUrl(finalUrl || candidate?.url || discovered) || "no-destination";
  // A URL alone is not a reliable reward identity: the same destination can
  // carry different campaigns, codes, prizes, or publication dates.
  return `reward:${game.id || game.slug}:${identifier || "url"}:${type || "unknown"}:${amount || "unknown"}:${dateKey || "unknown"}:${encodeURIComponent(destinationKey)}`;
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
let lastCoinMasterAudit = null;
const coinMasterRewardUrlLooksValid = (value) => {
  try {
    const parsed = new URL(String(value || ''));
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const pathOk = (host === 'rewards.coinmaster.com' && parsed.pathname === '/rewards/rewards.html')
      || (host === 'static.moonactive.net' && parsed.pathname === '/static/coinmaster/reward/reward2.html');
    const identifier = parsed.searchParams.get('c') || parsed.searchParams.get('reward_code') || '';
    return parsed.protocol === 'https:' && pathOk && /^pe_[A-Za-z0-9]+_20\d{6}$/i.test(identifier);
  } catch { return false; }
};
const extractCoinMasterCandidates = (body, source, game) => {
  const html = String(body || "");
  const found = [];
  const seen = new Set();
  const pending = [];
  let currentDateKey = "";
  let currentLiStart = -1;
  const add = (value, label = "", image = "", dateKey = "") => {
    const url = decodeHtml(value).trim();
    // Coin Master publishers often keep an old reward link under a fresh
    // page heading. When the link carries its own YYYYMMDD marker, that
    // identifier is the authoritative publication date; the heading is only
    // a fallback for links without an embedded date.
    const embeddedDateKey = coinMasterUrlDateKey(url);
    const effectiveDateKey = validDate(embeddedDateKey) ? embeddedDateKey : (validDate(dateKey) ? dateKey : "");
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
  return found;
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
    const key = rewardKeyForCandidate({ slug: "match-masters" }, { url: finalUrl || discoveredUrl, discovered_url: discoveredUrl, label: cleanText(label), date_key: dateKey }, nowIso(), finalUrl || discoveredUrl);
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
const clearlyInvalidHttp = (status) => Number(status) === 404 || Number(status) === 410;
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
      if (clearlyInvalidHttp(response.status)) return { status: "expired", checkedAt, finalUrl, reason: `HTTP ${response.status}; o destino não existe mais.` };
      if (!response.ok && !(response.status >= 300 && response.status < 400)) return { status: "unverified", checkedAt, finalUrl, reason: `HTTP ${response.status}; a resposta HTTP não confirma expiração da recompensa.` };
      if (destinationErrorSignal.test(body)) return { status: "expired", checkedAt, finalUrl, reason: "Página indica link expirado ou indisponível." };
      if (matchMastersMessengerExclusiveSignal.test(classificationText)) return { status: "unverified", classification: "messenger_exclusive", checkedAt, finalUrl, reason: "O destino informa que o código só pode ser coletado pelo Facebook Messenger." };
      const explicitAvailability = /(?:claim\s+now|collect\s+now|daily\s+reward|reward\s+keys|free\s+(?:gift|prize)|get\s+your\s+reward|resgatar|recompensa\s+di[aá]ria)/i.test(classificationText);
      return explicitAvailability
        ? { status: "active", checkedAt, finalUrl, reason: "O destino oficial apresentou sinais explícitos de recompensa disponível; HTTP 200 isolado não foi usado." }
        : { status: "unverified", checkedAt, finalUrl, reason: "O destino respondeu, mas não apresentou evidência explícita suficiente de disponibilidade." };
    }
    if (game?.slug === "travel-town") {
      const response = await fetch(url, { redirect: "manual", signal: controller.signal, headers: { accept: "text/html,application/json;q=0.9,text/plain;q=0.8", "user-agent": "GameGiftsVerifier/1.0" } });
      const location = response.headers.get("location") || "";
      if (clearlyInvalidHttp(response.status)) return { status: "expired", checkedAt, finalUrl: url, reason: `HTTP ${response.status}; o destino não existe mais.` };
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
      if (clearlyInvalidHttp(response.status)) return { status: "expired", checkedAt, finalUrl, reason: `HTTP ${response.status}; a oferta não existe mais.` };
      if (!response.ok) return { status: "unverified", checkedAt, finalUrl, reason: `HTTP ${response.status}; a resposta não confirma expiração da oferta.` };
      if (!coinMasterRewardUrlLooksValid(finalUrl)) return { status: "unverified", checkedAt, finalUrl, reason: "O destino não terminou em uma URL oficial de recompensa Coin Master com identificador válido." };
      if (coinMasterExpiredOfferSignal.test(body)) return { status: "expired", checkedAt, finalUrl, reason: "A página do Coin Master informa explicitamente que esta oferta acabou ou expirou." };
      return { status: "active", checkedAt, finalUrl };
    }
    if (clearlyInvalidHttp(response.status)) return { status: "expired", checkedAt, finalUrl, reason: `HTTP ${response.status}; o destino não existe mais.` };
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
  if (derivedUrl && (isMatchMastersRewardUrl(discoveredUrl) || ["matchmasters.onelink.me", "matchmaster.oneliuk.me", "matchmasters.com"].includes(discoveredHost))) {
    return { ...candidate, url: discoveredUrl, redemption_url: discoveredUrl, canonical_url: derivedUrl, discovered_url: discoveredUrl, resolution_status: "resolved", resolution_reason: discoveredHost === "launch.matchmasters.com" ? "URL oficial direta da recompensa; URL completa preservada." : "OneLink convertido para uma identidade canônica; URL completa preservada." };
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
  const reason = result?.resolution_reason || checkedDestination?.reason || (result?.duplicate ? "reward_key já existente; candidato não duplicado somente pela URL." : result?.saved ? "URL passou pela validação e foi salva." : "Candidato já processado pelo coletor.");
  console.log(`[GAME GIFTS][Match Masters] ${source.name} (${source.url}) → URL encontrada: ${matchMastersLogUrl(candidate.discovered_url || candidate.url)} → URL final: ${matchMastersLogUrl(result?.final_url || result?.destination?.finalUrl || result?.url || (result?.resolution_status === "rejected" ? "" : candidate.url))} → ${result?.duplicate ? "duplicada" : result?.saved ? "nova" : "não salva"} → ${validation} → motivo: ${reason}`);
};

const findMatchMastersExistingReward = (rows, rewardKey, candidate = {}, foundAt = "") => {
  const candidateUrl = String(candidate.discovered_url || candidate.url || "");
  const identifiers = rewardUrlIdentifiers(candidateUrl);
  const candidateDate = validDate(candidate.date_key) ? candidate.date_key : dateParts(foundAt).date;
  const normalizedCandidateUrl = normalizeUrl(candidateUrl);
  return rows.find((row) => {
    if (String(row.reward_key || "") === String(rewardKey || "")) return true;
    if (String(row.date_key || "") !== String(candidateDate || "")) return false;
    const rowIdentifiers = rewardUrlIdentifiers(row.original_url || row.url || row.final_url || "");
    const samePcode = identifiers.pcode && (String(row.reward_pcode || "") === identifiers.pcode || rowIdentifiers.pcode === identifiers.pcode);
    const sameC = identifiers.c && (String(row.reward_c || "") === identifiers.c || rowIdentifiers.c === identifiers.c);
    const sameUrl = normalizedCandidateUrl && (normalizeUrl(row.normalized_url || row.original_url || row.url || "") === normalizedCandidateUrl || normalizeUrl(row.final_url || "") === normalizedCandidateUrl);
    return Boolean(samePcode || sameC || sameUrl);
  }) || null;
};
const automaticPublicationStatus = (game, candidate, destination, rewardKey, rewardDate) => {
  if (destination?.status !== 'active') return 'pending';
  const url = candidate?.discovered_url || candidate?.url || destination?.finalUrl || '';
  const identifiers = rewardUrlIdentifiers(url);
  const hasPermanentIdentity = Boolean(candidate?.reward_identifier || candidate?.code || candidate?.token || identifiers.identifier || (rewardKey && !String(rewardKey).startsWith('url:')));
  if (!hasPermanentIdentity) return 'pending';
  if (game?.slug === 'coin-master') return validDate(candidate?.date_key) && isRecentCoinMasterDate(candidate.date_key) && coinMasterRewardUrlLooksValid(destination.finalUrl || url) ? 'approved' : 'pending';
  return 'approved';
};

async function saveDiscoveredReward(env, source, game, candidate, foundAt, options = {}) {
  const isCode = Boolean(candidate.code);
  const discoveredUrl = candidate.discovered_url || candidate.url || source.url;
  // Keep the exact URL the source published. In particular, c=, pcode= and
  // any other query identifiers are part of the reward and must remain usable
  // in the public card. canonical_url is stored separately as an identity aid.
  const originalUrl = game.slug === "match-masters" ? (isCode ? "" : discoveredUrl) : (candidate.url || source.url);
  const normalizedUrl = normalizeUrl(originalUrl);
  const isKnownCoinMasterBroken = game.slug === 'coin-master' && normalizedUrl === normalizeUrl(COIN_MASTER_USER_REPORTED_BROKEN_URL);
  const parts = dateParts(foundAt);
  // A collector timestamp is evidence of observation, never the source's
  // publication date. Unknown source dates stay empty and cannot become a
  // "new today" reward.
  const rewardDate = validDate(candidate.date_key) ? candidate.date_key : "";
  const rewardTime = validDate(candidate.date_key) ? String(candidate.time_label || "").slice(0, 5) : "";
  const urlIdentifiers = rewardUrlIdentifiers(discoveredUrl);
  const rewardIdentifier = String(candidate.reward_identifier || candidate.code || candidate.token || urlIdentifiers.identifier || "").trim();
  const rewardPcode = String(candidate.reward_pcode || urlIdentifiers.pcode || "").trim();
  const rewardC = String(candidate.reward_c || urlIdentifiers.c || "").trim();
  const info = extractExplicitReward(candidate.label);
  const travelTownLegacySource = game.slug === "travel-town" && /mobilegamecentral\.com/i.test(String(source.url || ""));
  if (travelTownLegacySource) { info.type = "energy"; info.quantity = ""; info.amount = ""; info.description = "Energia grátis encontrada em uma fonte anterior."; info.excerpt = candidate.label || info.description; }
  const sourceLabel = `${source.name} · ${source.url}`;
  const destination = options.existingHint
    ? { status: publicStatus(options.existingHint) === "expired_invalid" ? "expired" : "active", checkedAt: options.existingHint.last_checked_at || nowIso(), finalUrl: options.existingHint.final_url || originalUrl, reason: "URL/reward_key já existente; validação de destino já registrada." }
    : await verifyRewardDestination(candidate.redemption_url || originalUrl, game);
  const messengerExclusive = game.slug === "match-masters" && destination.classification === "messenger_exclusive";
  const officialEvidence = destination.status === "active" && isTrustedRewardDestination(game, destination.finalUrl || originalUrl);
  const rewardDescription = messengerExclusive ? `${MATCH_MASTERS_MESSENGER_NOTE}${info.description ? ` · ${info.description}` : ""}` : info.description;
  const isKnownMonopolyProblem = game.slug === "monopoly-go" && normalizeUrl(originalUrl) === normalizeUrl(MONOPOLY_GO_PROBLEM_URL);
  const isKnownMatchMastersExpiredSpin = game.slug === "match-masters" && normalizeUrl(originalUrl) === normalizeUrl(MATCH_MASTERS_EXPIRED_SPIN_URL);
  const finalUrl = game.slug === "match-masters"
    ? (isCode ? "" : (candidate.canonical_url || matchMastersCanonicalUrl(destination.finalUrl || candidate.redemption_url || originalUrl) || destination.finalUrl || candidate.redemption_url || originalUrl))
    : (destination.finalUrl || candidate.redemption_url || originalUrl);
  const normalizedFinalUrl = normalizeUrl(finalUrl);
  const rewardKey = isCode ? codeKey(game, candidate.code) : game.slug === "travel-town" ? "travel_town:" + (normalizedFinalUrl || normalizedUrl) : rewardKeyForCandidate(game, { ...candidate, discovered_url: discoveredUrl }, foundAt, normalizedFinalUrl || normalizedUrl);
  const publicationStatus = game.slug === "match-masters"
    ? (isCode || officialEvidence || options.existingHint?.discovery_method === "manual" ? "published" : "pending")
    : automaticPublicationStatus(game, candidate, destination, rewardKey, rewardDate);
  const identityStatementFor = (id) => env.DB.prepare("UPDATE rewards SET reward_identifier = CASE WHEN reward_identifier = '' THEN ? ELSE reward_identifier END, reward_pcode = CASE WHEN reward_pcode = '' THEN ? ELSE reward_pcode END, reward_c = CASE WHEN reward_c = '' THEN ? ELSE reward_c END WHERE id = ?").bind(rewardIdentifier, rewardPcode, rewardC, id);
  let existing = options.existingHint || (options.existingHintChecked ? null : (game.slug === "match-masters" && isCode
    ? await env.DB.prepare("SELECT * FROM rewards WHERE game_id = ? AND (reward_key = ? OR (reward_code = ? AND reward_code <> '')) LIMIT 1")
      .bind(game.id, rewardKey, candidate.code || "").first()
    : game.slug === "match-masters" && !isCode
    ? await env.DB.prepare(`SELECT * FROM rewards
        WHERE game_id = ? AND reward_code = ''
          AND (
            reward_key = ?
            OR (reward_pcode = ? AND ? <> '' AND date_key = ?)
            OR (reward_c = ? AND ? <> '' AND date_key = ?)
            OR (normalized_url = ? AND ? <> '' AND date_key = ?)
            OR (final_url = ? AND ? <> '' AND date_key = ?)
          )
        ORDER BY id ASC LIMIT 1`)
      .bind(game.id, rewardKey, rewardPcode, rewardPcode, rewardDate, rewardC, rewardC, rewardDate, normalizedUrl, normalizedUrl, rewardDate, normalizedFinalUrl, normalizedFinalUrl, rewardDate).first()
    : game.slug === "travel-town" && !isCode
    ? await env.DB.prepare("SELECT * FROM rewards WHERE game_id = ? AND (reward_key = ? OR (reward_key LIKE 'url:%' AND (normalized_url = ? OR final_url = ?))) LIMIT 1")
      .bind(game.id, rewardKey, normalizedUrl, normalizedFinalUrl).first()
    : game.slug === "coin-master" && !isCode
    ? await env.DB.prepare("SELECT * FROM rewards WHERE game_id = ? AND (reward_key = ? OR (reward_key LIKE 'url:%' AND (normalized_url = ? OR final_url = ?)) OR (lower(reward_identifier) = lower(?) AND ? <> '')) LIMIT 1")
      .bind(game.id, rewardKey, normalizedUrl, normalizedFinalUrl, rewardIdentifier, rewardIdentifier).first()
    : ["dice-dreams", "monopoly-go"].includes(game.slug) && !isCode
      ? await env.DB.prepare("SELECT * FROM rewards WHERE game_id = ? AND (reward_key = ? OR (reward_key LIKE 'url:%' AND (normalized_url = ? OR final_url = ?))) LIMIT 1")
        .bind(game.id, rewardKey, normalizedUrl, normalizedFinalUrl).first()
      : await env.DB.prepare("SELECT * FROM rewards WHERE game_id = ? AND (reward_key = ? OR (reward_key LIKE 'url:%' AND (normalized_url = ? OR final_url = ?)) OR (reward_code = ? AND ? <> '')) LIMIT 1")
        .bind(game.id, rewardKey, normalizedUrl, normalizedFinalUrl, candidate.code || "", candidate.code || "").first()));
  if (existing) {
    if (Number(existing.game_id) !== Number(game.id)) return { saved: false, duplicate: true, status: publicStatus(existing), cross_game: true, final_url: finalUrl, reward_key: rewardKey, destination };
    const existingStatus = publicStatus(existing);
    const candidateIndicatesExpired = game.slug === "coin-master" ? coinMasterExpiredOfferSignal.test(candidate.label || "") : /(?:expired|expir(?:ou|ed)|invalid|unavailable|no longer available)/i.test(candidate.label || "");
    const expired = isKnownMatchMastersExpiredSpin || destination.status === "expired" || candidateIndicatesExpired;
    const nextStatus = isKnownMatchMastersExpiredSpin || isKnownMonopolyProblem || isKnownCoinMasterBroken ? (isKnownMatchMastersExpiredSpin ? "expired_invalid" : "unknown") : messengerExclusive ? "unknown" : existingStatus === "expired_invalid" || expired ? "expired_invalid" : officialEvidence ? "confirmed" : existingStatus;
    const nextPublicationStatus = expired || isKnownCoinMasterBroken || destination.status !== "active" ? "rejected" : game.slug === "match-masters" ? (publicationStatus === "published" ? "published" : existing.publication_status || "pending") : (automaticPublicationStatus(game, candidate, destination, rewardKey, rewardDate) === "approved" ? "approved" : existing.publication_status || "pending");
    const preserveExistingMatchMastersDate = game.slug === "match-masters";
    const preserveExistingCoinMasterDate = game.slug === "coin-master" && !validDate(candidate.date_key);
    const preserveExistingRewardDate = preserveExistingMatchMastersDate || preserveExistingCoinMasterDate;
    const updateRewardDate = preserveExistingRewardDate ? "" : rewardDate;
    const updateRewardTime = preserveExistingRewardDate ? "" : rewardTime;
    const classificationStatement = messengerExclusive
      ? env.DB.prepare("UPDATE rewards SET reward_description = CASE WHEN instr(lower(reward_description), 'gg_classification:messenger-exclusive') > 0 THEN reward_description WHEN reward_description = '' THEN ? ELSE reward_description || ' · ' || ? END, reward_status = 'unknown', status = 'unconfirmed', link_status = CASE WHEN link_status = 'expired' THEN link_status ELSE 'unverified' END WHERE id = ?").bind(MATCH_MASTERS_MESSENGER_NOTE, MATCH_MASTERS_MESSENGER_NOTE, existing.id)
      : null;
    const updateStatement = env.DB.prepare("UPDATE rewards SET url = CASE WHEN ? <> '' THEN ? ELSE url END, original_url = CASE WHEN ? <> '' THEN ? ELSE original_url END, normalized_url = CASE WHEN ? <> '' THEN ? ELSE normalized_url END, source = ?, source_id = COALESCE(source_id, ?), source_excerpt = COALESCE(NULLIF(source_excerpt, ''), ?), discovery_method = 'automatic', type = CASE WHEN type = '' THEN ? ELSE type END, quantity = CASE WHEN quantity = '' THEN ? ELSE quantity END, reward_type = CASE WHEN reward_type = '' THEN ? ELSE reward_type END, reward_amount = CASE WHEN reward_amount = '' THEN ? ELSE reward_amount END, reward_description = CASE WHEN reward_description = '' THEN ? ELSE reward_description END, reward_code = CASE WHEN reward_code = '' THEN ? ELSE reward_code END, reward_key = CASE WHEN reward_key = '' THEN ? ELSE reward_key END, final_url = CASE WHEN final_url = '' THEN ? ELSE final_url END, redemption_url = CASE WHEN redemption_url = '' THEN ? ELSE redemption_url END, image = CASE WHEN image = '' THEN ? ELSE image END, image_source = CASE WHEN image_source = '' AND ? <> '' THEN 'source' ELSE image_source END, last_checked_at = ?, link_status = ?, reward_status = ?, status = ?, expiry_reason = CASE WHEN ? THEN ? ELSE expiry_reason END, expired_at = CASE WHEN ? THEN COALESCE(expired_at, ?) ELSE expired_at END, date_key = CASE WHEN ? <> '' THEN ? ELSE date_key END, time_label = CASE WHEN ? <> '' THEN ? ELSE time_label END WHERE id = ?")
      .bind(originalUrl, originalUrl, originalUrl, originalUrl, normalizedUrl, normalizedUrl, mergeSources(existing.source, sourceLabel), source.id, info.excerpt, info.type, info.quantity, info.type, info.amount, rewardDescription, candidate.code || "", rewardKey, finalUrl, candidate.redemption_url || "", candidate.image || "", candidate.image || "", destination.checkedAt, expired ? "expired" : destination.status === "active" ? "active" : "unverified", nextStatus, nextStatus === "confirmed" ? "confirmed" : nextStatus === "expired_invalid" ? "expired_invalid" : "unconfirmed", expired, isKnownMatchMastersExpiredSpin ? "Link de Spin informado como expirado." : destination.reason || "Fonte indica recompensa expirada.", expired, destination.checkedAt, updateRewardDate, updateRewardDate, updateRewardTime, updateRewardTime, existing.id);
    const identityStatement = identityStatementFor(existing.id);
    const publicationStatement = env.DB.prepare("UPDATE rewards SET publication_status = ? WHERE id = ?").bind(nextPublicationStatus, existing.id);
    if (options.deferWrite) return { saved: false, duplicate: true, status: nextStatus, final_url: finalUrl, reward_key: rewardKey, destination, statement: updateStatement, classification_statement: classificationStatement, identity_statement: identityStatement, publication_statement: publicationStatement };
    await updateStatement.run();
    if (classificationStatement) await classificationStatement.run();
    await identityStatement.run();
    await publicationStatement.run();
    if (isKnownMonopolyProblem || isKnownCoinMasterBroken) await env.DB.prepare("UPDATE rewards SET link_status = 'problem', reward_status = 'unknown', status = 'unconfirmed', publication_status = 'rejected', expiry_reason = ?, expired_at = NULL WHERE id = ?").bind(isKnownMonopolyProblem ? MONOPOLY_GO_PROBLEM_REASON : COIN_MASTER_USER_REPORTED_BROKEN_REASON, existing.id).run();
    return { saved: false, duplicate: true, status: nextStatus, final_url: finalUrl, reward_key: rewardKey, destination };
  }
  const candidateIndicatesExpired = game.slug === "coin-master" ? coinMasterExpiredOfferSignal.test(candidate.label || "") : /(?:expired|expir(?:ou|ed)|invalid|unavailable|no longer available)/i.test(candidate.label || "");
  const expired = isKnownMatchMastersExpiredSpin || destination.status === "expired" || candidateIndicatesExpired;
  const linkStatus = isKnownMonopolyProblem || isKnownCoinMasterBroken ? "problem" : expired ? "expired" : destination.status === "active" ? "active" : "unverified";
  const rewardStatus = isKnownMonopolyProblem || isKnownCoinMasterBroken ? "unknown" : expired ? "expired_invalid" : officialEvidence ? "confirmed" : "unknown";
  const insertedPublicationStatus = expired || isKnownMonopolyProblem || isKnownCoinMasterBroken || destination.status !== "active" ? "rejected" : publicationStatus;
  const insertStatement = env.DB.prepare("INSERT INTO rewards (game_id, name, type, quantity, reward_type, reward_amount, reward_description, image, url, source, date_key, time_label, status, user_id, verified_at, original_url, normalized_url, source_id, source_excerpt, found_at, last_checked_at, link_status, reward_status, reward_code, reward_key, reward_identifier, reward_pcode, reward_c, final_url, redemption_url, image_source, expiry_reason, expired_at, discovery_method, publication_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(game.id, info.name, info.type, info.quantity, info.type, info.amount, rewardDescription, candidate.image || "", originalUrl, sourceLabel, rewardDate, rewardTime, rewardStatus === "confirmed" ? "confirmed" : rewardStatus === "expired_invalid" ? "expired_invalid" : "unconfirmed", originalUrl, normalizedUrl, source.id, info.excerpt, foundAt, destination.checkedAt, linkStatus, rewardStatus, candidate.code || "", rewardKey, rewardIdentifier, rewardPcode, rewardC, finalUrl, candidate.redemption_url || "", candidate.image ? "source" : "", isKnownMonopolyProblem ? MONOPOLY_GO_PROBLEM_REASON : isKnownCoinMasterBroken ? COIN_MASTER_USER_REPORTED_BROKEN_REASON : isKnownMatchMastersExpiredSpin ? "Link de Spin informado como expirado." : expired ? (destination.reason || "Fonte indica recompensa expirada.") : "", isKnownMonopolyProblem || isKnownCoinMasterBroken || expired ? destination.checkedAt : null, "automatic", insertedPublicationStatus);
  if (options.deferWrite) return { saved: true, duplicate: false, destination: destination.status, validation_status: expired ? "expired" : destination.status, final_url: finalUrl, reward_key: rewardKey, destination_result: destination, statement: insertStatement };
  const result = await insertStatement.run();
  return result.meta?.changes ? { saved: true, duplicate: false, destination: destination.status, validation_status: expired ? "expired" : destination.status, final_url: finalUrl, reward_key: rewardKey, destination_result: destination } : { saved: false, duplicate: true, final_url: finalUrl, reward_key: rewardKey, destination };
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
  let acceptedCount = 0;
  let unconfirmedCount = 0;
  let expiredCount = 0;
  let rejectedCount = 0;
  const rejectionReasons = new Set();
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
    if (options.save === false && game.slug === "match-masters") {
      for (const candidate of candidates) {
        const resolvedCandidate = candidate.code ? { ...candidate, resolution_status: "resolved", resolution_reason: "Reward Key detectado; destino oficial de resgate mantido." } : await resolveMatchMastersCandidate(candidate);
        const info = extractExplicitReward(candidate.label);
        if (resolvedCandidate.resolution_status === "rejected") {
          rejectedCount++;
          rejectionReasons.add(resolvedCandidate.resolution_reason || "Destino intermediário não revelou uma recompensa válida.");
          diagnostics.push({ source: source.name, kind: candidate.code ? "code" : "link", reward_type: info.type, quantity: candidate.quantity || info.amount || "", discovered_url: candidate.discovered_url || candidate.url || "", final_url: "", reward_key: candidate.code ? codeKey(game, candidate.code) : rewardKeyForCandidate(game, candidate, foundAt, ""), outcome: "rejected", validation: "unverified", reason: resolvedCandidate.resolution_reason });
          continue;
        }
        const destination = candidate.code ? { status: "unverified", reason: "Código encontrado; o resgate depende da tela oficial do jogo." } : await verifyRewardDestination(resolvedCandidate.redemption_url || resolvedCandidate.url, game);
        diagnostics.push({ source: source.name, kind: candidate.code ? "code" : "link", reward_type: info.type, quantity: candidate.quantity || info.amount || "", discovered_url: candidate.discovered_url || candidate.url || "", final_url: resolvedCandidate.url || "", reward_key: candidate.code ? codeKey(game, candidate.code) : rewardKeyForCandidate(game, resolvedCandidate, foundAt, normalizeUrl(resolvedCandidate.url)), outcome: "tested", validation: destination.status, reason: destination.reason || "Candidato encontrado e verificado sem salvar alterações." });
      }
    }
    if (options.save !== false) {
      for (const candidate of candidatesToVerify) {
        const resolvedCandidate = game.slug === "match-masters" ? (candidate.code ? { ...candidate, resolution_status: "resolved", resolution_reason: "Reward Key sem URL de presente; destino oficial separado para resgate." } : await resolveMatchMastersCandidate(candidate)) : game.slug === "travel-town" ? await resolveTravelTownCandidate(candidate) : candidate;
        if (resolvedCandidate.resolution_status === "rejected") {
          if (game.slug === "match-masters") {
            matchMastersDiscarded++;
            matchMastersDiscardReasons.push({ kind: resolvedCandidate.code ? "code" : "link", discovered_url: candidate.discovered_url || candidate.url || "", reward_key: resolvedCandidate.code ? codeKey(game, resolvedCandidate.code) : "", reason: resolvedCandidate.resolution_reason });
          }
          rejectedCount++;
          rejectionReasons.add(resolvedCandidate.resolution_reason || "Destino intermediário não revelou uma recompensa válida.");
          const result = { saved: false, duplicate: false, resolution_status: "rejected", resolution_reason: resolvedCandidate.resolution_reason };
          const rejectedInfo = extractExplicitReward(candidate.label);
          diagnostics.push({ source: source.name, kind: candidate.code ? "code" : "link", reward_type: rejectedInfo.type, quantity: candidate.quantity || rejectedInfo.amount || "", source_date: candidate.date_key || "", original_url: candidate.discovered_url || candidate.url, discovered_url: candidate.discovered_url || candidate.url, final_url: "", reward_key: candidate.code ? codeKey(game, candidate.code) : rewardKeyForCandidate(game, candidate, foundAt, ""), outcome: "rejected", reason: resolvedCandidate.resolution_reason });
          if (game.slug === "match-masters") logMatchMastersCandidate(source, candidate, result);
          continue;
        }
        const existingHint = matchMastersRewardSnapshot && !resolvedCandidate.code
          ? findMatchMastersExistingReward(matchMastersRewardSnapshot, rewardKeyForCandidate(game, resolvedCandidate, foundAt, normalizeUrl(resolvedCandidate.url)), resolvedCandidate, foundAt)
          : null;
        const result = await saveDiscoveredReward(env, source, game, resolvedCandidate, foundAt, { existingHint, existingHintChecked: Boolean(matchMastersRewardSnapshot), deferWrite: game.slug === "match-masters" });
        if (result.statement) deferredStatements.push(result.statement);
        if (result.classification_statement) deferredStatements.push(result.classification_statement);
        if (result.identity_statement) deferredStatements.push(result.identity_statement);
        if (result.publication_statement) deferredStatements.push(result.publication_statement);
        if (result.saved) newLinksSaved++;
        acceptedCount++;
        if (game.slug === "match-masters" && result.saved) matchMastersPublished++;
        if (result.duplicate) duplicatesIgnored++;
        if (game.slug === "match-masters" && result.duplicate) {
          matchMastersDiscarded++;
          matchMastersDiscardReasons.push({ kind: resolvedCandidate.code ? "code" : "link", discovered_url: candidate.discovered_url || candidate.url || "", final_url: result.final_url || "", reward_key: resolvedCandidate.code ? codeKey(game, resolvedCandidate.code) : `url:${normalizeUrl(result.final_url || resolvedCandidate.url)}`, reason: "Duplicata por reward_key/URL final normalizada." });
        }
        const validationStatus = result.validation_status || result.destination_result?.status || result.destination?.status || "unverified";
        const monitorStatus = validationStatus === "expired" ? "EXPIRED" : (source.source_kind === "official" && validationStatus === "active") || result.status === "confirmed" ? "ACTIVE" : "UNCONFIRMED";
        if (monitorStatus === "EXPIRED") expiredCount++;
        else if (monitorStatus === "UNCONFIRMED") unconfirmedCount++;
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
          const acceptedInfo = extractExplicitReward(candidate.label);
          diagnostics.push({ source: source.name, kind: candidate.code ? "code" : "link", reward_type: acceptedInfo.type, quantity: candidate.quantity || acceptedInfo.amount || "", discovered_url: candidate.discovered_url || candidate.url, final_url: result.final_url || "", reward_key: result.reward_key || (candidate.code ? codeKey(game, candidate.code) : rewardKeyForCandidate(game, resolvedCandidate, foundAt, normalizeUrl(result.final_url || resolvedCandidate.url))), outcome: result.duplicate ? "duplicate" : result.saved ? "new" : "not_saved", validation: result.destination_result?.status || result.destination?.status || "unknown", monitor_status: monitorStatus, reason: result.destination_result?.reason || result.destination?.reason || (result.duplicate ? "reward_key já existente; candidato não duplicado somente pela URL." : "URL/código processado pelo coletor.") });
          logMatchMastersCandidate(source, candidate, result);
        }
      }
    }
    if (deferredStatements.length) await env.DB.batch(deferredStatements);
    if (diagnostics.length) {
      const diagnosticStatements = diagnostics.map((item) => {
        const validation = String(item.validation || "").toLowerCase();
        const classification = item.monitor_status || (validation === "expired" || /expirad|expired/i.test(String(item.reason || "")) ? "EXPIRED" : "UNCONFIRMED");
        return env.DB.prepare("INSERT INTO collection_diagnostics (source_id, game_id, checked_at, kind, discovered_url, final_url, reward_code, reward_key, reward_type, reward_amount, outcome, classification, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
          .bind(source.id, game.id, nowIso(), item.kind || "link", item.discovered_url || item.original_url || "", item.final_url || "", item.reward_code || "", item.reward_key || "", item.reward_type || "", item.quantity || "", item.outcome || "rejected", classification, item.reason || "");
      });
      await env.DB.batch(diagnosticStatements);
    }
    if (game.slug === "travel-town") {
      await env.DB.prepare("UPDATE rewards SET quantity = '', reward_amount = '', reward_description = CASE WHEN reward_description = '' OR instr(lower(reward_description), '30 free energy') > 0 OR instr(lower(source_excerpt), '30 free energy') > 0 THEN 'Energia grátis encontrada em uma fonte anterior.' ELSE reward_description END WHERE game_id = ? AND instr(lower(source), 'mobilegamecentral.com') > 0 AND instr(lower(source), 'traveltowncard.com') = 0").bind(game.id).run();
    }
  } catch (caught) { error = String(caught?.message || caught || "Erro desconhecido").slice(0, 500); }
  const finishedAt = nowIso();
  await env.DB.prepare("UPDATE sources SET last_checked_at = ?, last_success_at = CASE WHEN ? = '' THEN ? ELSE last_success_at END, last_error = ? WHERE id = ?")
    .bind(finishedAt, error, error ? "" : finishedAt, error || null, source.id).run();
  await env.DB.prepare("INSERT INTO collection_logs (started_at, finished_at, source_id, http_status, links_found, new_links_saved, duplicates_ignored, accepted_count, unconfirmed_count, expired_count, rejected_count, rejection_reason, error) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(startedAt, finishedAt, source.id, httpStatus, linksFound, newLinksSaved, duplicatesIgnored, acceptedCount, unconfirmedCount, expiredCount, rejectedCount, [...rejectionReasons].join(" | ").slice(0, 1000), error || null).run();
  return { source_id: source.id, name: source.name, url: source.url, source_kind: source.source_kind || "external_discovery", priority: Number(source.priority || 50), http_status: httpStatus, links_found: linksFound, reward_keys_found: rewardKeysFound, match_masters_links_found: matchMastersLinksFound, match_masters_codes_found: rewardKeysFound, match_masters_discarded: matchMastersDiscarded, match_masters_discard_reasons: matchMastersDiscardReasons, match_masters_published: matchMastersPublished, new_links_saved: newLinksSaved, new_links_unconfirmed: newLinksUnconfirmed, new_links_expired: newLinksExpired, duplicates_ignored: duplicatesIgnored, accepted_count: acceptedCount, unconfirmed_count: unconfirmedCount, expired_count: expiredCount, rejected_count: rejectedCount, rejection_reason: [...rejectionReasons].join(" | ").slice(0, 1000), expiration_diagnostics: expirationDiagnostics, error: error || null, diagnostics, started_at: startedAt, finished_at: finishedAt };
}
const noticeUserId = (request) => String(request.headers.get("x-websim-user-id") || "").trim();
const defaultNoticeChannels = () => ({ gifts: true, links: true, codes: true, news: true });
const QUIZ_BANK = Object.freeze([
  ["Qual é a mecânica principal do Match Masters?", ["Combinar peças", "Construir cidades", "Correr em pistas", "Cuidar de fazendas"], 0],
  ["Que recurso é associado ao Coin Master?", ["Cartas de corrida", "Spins", "Bolas de futebol", "Peças de xadrez"], 1],
  ["O que você usa para jogar uma rodada no Monopoly GO!?", ["Dados", "Cartas de memória", "Chaves", "Combustível"], 0],
  ["Qual ação define a progressão do Travel Town?", ["Fundir itens", "Pescar palavras", "Montar robôs", "Pintar mapas"], 0],
  ["O Roblox reúne principalmente o quê?", ["Experiências criadas por usuários", "Somente filmes", "Apenas partidas de cartas", "Um catálogo de músicas"], 0],
  ["Qual formato descreve o Free Fire?", ["Batalha real", "Jogo de tabuleiro offline", "Quiz de matemática", "Simulador de culinária"], 0],
  ["O Bingo Blitz tem como base qual jogo?", ["Bingo", "Sinuca", "Xadrez", "Tênis"], 0],
  ["No Dice Dreams, o elemento central são…", ["Lançamentos de dados", "Corridas de kart", "Cartas de tarô", "Palavras cruzadas"], 0],
  ["Board Kings combina tabuleiro com…", ["Dados e construção", "Música e dança", "Fotografia", "Pesca submarina"], 0],
  ["O que o Game Gifts organiza?", ["Presentes, códigos e novidades públicas", "Contas de pagamento", "Itens vendidos pelo site", "Apostas entre jogadores"], 0],
]);
const publicQuizQuestions = () => QUIZ_BANK.map(([question, options]) => ({ question, options }));
const profileFields = (row) => row ? { user_id: row.user_id, username: row.username || "Jogador", avatar_url: row.avatar_url || "", points: Number(row.points || 0), quizzes_completed: Number(row.quizzes_completed || 0), quiz_best_score: Number(row.quiz_best_score || 0), visit_streak: Number(row.visit_streak || 0), last_visit_date: row.last_visit_date || "", ranking_position: row.ranking_position == null ? null : Number(row.ranking_position) } : null;
const playerIdentity = (request) => {
  const userId = noticeUserId(request);
  if (!userId) return null;
  const username = String(request.headers.get("x-websim-username") || "Jogador").trim().slice(0, 120) || "Jogador";
  const avatar = String(request.headers.get("x-websim-avatar-url") || (username !== "Jogador" ? `https://images.websim.com/avatar/${encodeURIComponent(username)}` : "")).trim().slice(0, 500);
  return { userId, username, avatar };
};
const parseNoticeGames = (value) => {
  try {
    const parsed = JSON.parse(String(value || "[]"));
    return Array.isArray(parsed) ? parsed.map((item) => String(item || "").trim()).filter(Boolean) : [];
  } catch { return []; }
};
const parseNoticeChannels = (value) => {
  try {
    const parsed = JSON.parse(String(value || "{}"));
    return { ...defaultNoticeChannels(), ...(parsed && typeof parsed === "object" ? parsed : {}) };
  } catch { return defaultNoticeChannels(); }
};
const notifyNewRewards = async (env, sinceValues = []) => {
  if (!env.NOTIFICATIONS) return { sent: 0, skipped: "notifications_unavailable" };
  const since = [...new Set(sinceValues.map((value) => String(value || "")).filter(Boolean))];
  if (!since.length) return { sent: 0, skipped: "no_new_collection" };
  const placeholders = since.map(() => "?").join(",");
  const rewards = (await env.DB.prepare(`SELECT r.id, r.game_id, r.name, r.reward_code, r.url, r.reward_description, g.name AS game_name, g.slug AS game_slug FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.active = 1 AND (r.discovery_method = 'automatic' OR instr(lower(r.reward_description), 'gg_manual:owner-confirmed') > 0) AND r.reward_status = 'confirmed' AND r.publication_status IN ('approved', 'published') AND r.found_at IN (${placeholders}) AND r.link_status NOT IN ('expired', 'problem', 'unverified') AND (r.url <> '' OR r.reward_code <> '') ORDER BY r.id`).bind(...since).all()).results;
  if (!rewards.length) return { sent: 0, skipped: "no_new_public_rewards" };
  const preferences = (await env.DB.prepare("SELECT user_id, games_json, channels_json FROM notice_preferences").all()).results;
  let sent = 0;
  for (const preference of preferences) {
    const games = new Set(parseNoticeGames(preference.games_json));
    const channels = parseNoticeChannels(preference.channels_json);
    const userRewards = rewards.filter((reward) => games.has(String(reward.game_slug)));
    for (const reward of userRewards) {
      const isCode = Boolean(String(reward.reward_code || "").trim());
      const isLink = Boolean(String(reward.url || "").trim()) && !isCode;
      const channelEnabled = isLink ? channels.links === true : isCode ? channels.codes === true : channels.gifts === true;
      if (!channelEnabled) continue;
      const alreadyDelivered = await env.DB.prepare("SELECT 1 FROM notice_deliveries WHERE user_id = ? AND reward_id = ? LIMIT 1").bind(preference.user_id, reward.id).first();
      if (alreadyDelivered) continue;
      const delivery = await env.DB.prepare("INSERT OR IGNORE INTO notice_deliveries (user_id, reward_id) VALUES (?, ?)").bind(preference.user_id, reward.id).run();
      if (Number(delivery?.meta?.changes || 0) === 0) continue;
      const rewardLabel = String(reward.reward_code || reward.name || reward.reward_description || "link novo").trim().slice(0, 120);
      const idempotencyKey = `game-gifts:notice:${preference.user_id}:${reward.id}`;
      try {
        await env.NOTIFICATIONS.send({
          recipients: [String(preference.user_id)],
          title: `${isCode ? "Novo código" : "Novo link"}: ${reward.game_name}`,
          body: `${rewardLabel}. Toque para abrir ${isCode ? "o código" : "o link"}.`,
          path: `/?gg-alert-reward=${encodeURIComponent(reward.id)}`,
          idempotencyKey,
        });
        sent++;
      } catch (error) {
        await env.DB.prepare("DELETE FROM notice_deliveries WHERE user_id = ? AND reward_id = ?").bind(preference.user_id, reward.id).run();
        console.error("[GAME GIFTS] falha ao enviar aviso", { user_id: preference.user_id, reward_id: reward.id, error: String(error?.message || error || "") });
      }
    }
  }
  return { sent, rewards: rewards.length };
};
async function revalidateCoinMasterRewards(env, options = {}) {
  const cutoff = new Date(Date.now() - COLLECTION_INTERVAL_MS).toISOString();
  const force = options.force === true;
  const limit = Math.max(1, Math.min(20, Number(options.limit) || COIN_MASTER_MAX_REVALIDATIONS));
  const offset = Math.max(0, Number(options.offset) || 0);
  const rows = (force
    ? await env.DB.prepare(`SELECT r.*, g.slug FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.slug = 'coin-master' AND r.url <> '' ORDER BY r.id ASC LIMIT ${limit} OFFSET ${offset}`).all()
    : await env.DB.prepare(`SELECT r.*, g.slug FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.slug = 'coin-master' AND r.link_status <> 'expired' AND r.url <> '' AND (r.last_checked_at IS NULL OR r.last_checked_at < ?) ORDER BY r.date_key DESC, r.created_at DESC LIMIT ${limit}`).bind(cutoff).all()
  ).results;
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
      await env.DB.prepare("UPDATE rewards SET last_checked_at = ?, link_status = 'active', reward_status = 'confirmed', status = 'confirmed', expiry_reason = '', expired_at = NULL, final_url = COALESCE(NULLIF(?, ''), final_url) WHERE id = ?")
        .bind(checked.checkedAt, checked.finalUrl || "", reward.id).run();
    } else {
      metrics.unconfirmed++;
      await env.DB.prepare("UPDATE rewards SET last_checked_at = ?, link_status = 'unverified', reward_status = 'unknown', status = 'unconfirmed' WHERE id = ?")
        .bind(checked.checkedAt, reward.id).run();
    }
  }
  return metrics;
}
async function repairCoinMasterAgeExpirations(env) {
  const result = await env.DB.prepare("UPDATE rewards SET link_status = 'unverified', reward_status = 'unknown', status = 'unconfirmed', expiry_reason = '', expired_at = NULL WHERE game_id IN (SELECT id FROM games WHERE slug = 'coin-master') AND link_status = 'expired' AND (lower(expiry_reason) LIKE '%mais de 3 dias%' OR lower(expiry_reason) LIKE '%mudança de dia%' OR lower(expiry_reason) LIKE '%mudanca de dia%')").run();
  return Number(result?.meta?.changes || 0);
}
async function repairCoinMasterUrlDates(env) {
  const rows = (await env.DB.prepare("SELECT r.id, r.url, r.date_key FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.slug = 'coin-master' AND r.url <> ''").all()).results;
  let repaired = 0;
  for (const row of rows) {
    const embeddedDateKey = coinMasterUrlDateKey(row.url);
    if (!embeddedDateKey || embeddedDateKey === String(row.date_key || "")) continue;
    const result = await env.DB.prepare("UPDATE rewards SET date_key = ? WHERE id = ?").bind(embeddedDateKey, row.id).run();
    repaired += Number(result?.meta?.changes || 0);
  }
  return repaired;
}
async function auditCoinMasterPublication(env) {
  const rows = (await env.DB.prepare("SELECT r.*, g.slug AS game_slug FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.slug = 'coin-master' ORDER BY r.id ASC").all()).results;
  const groups = new Map();
  const metrics = {
    candidates_analyzed: rows.length,
    duplicates: 0,
    old: 0,
    broken: 0,
    valid: 0,
    really_new: 0,
    approved_ids: [],
  };
  const rejectedReasons = new Map();
  const markReason = (reason) => rejectedReasons.set(reason, Number(rejectedReasons.get(reason) || 0) + 1);
  for (const row of rows) {
    const url = String(row.original_url || row.url || row.final_url || '').trim();
    const identity = canonicalRewardIdentity(row, 'coin-master');
    const dateKey = coinMasterUrlDateKey(url) || String(row.date_key || '').trim();
    const old = !isRecentCoinMasterDate(dateKey);
    const broken = !coinMasterRewardUrlLooksValid(url)
      || ['expired', 'problem', 'unverified'].includes(String(row.link_status || '').toLowerCase())
      || ['expired_invalid', 'unknown'].includes(String(row.reward_status || '').toLowerCase()) && String(row.link_status || '').toLowerCase() !== 'active';
    if (!groups.has(identity)) groups.set(identity, []);
    groups.get(identity).push({ ...row, __url: url, __identity: identity, __dateKey: dateKey, __old: old, __broken: broken });
  }
  const updates = [];
  for (const members of groups.values()) {
    const eligible = members.filter((row) => !row.__old && !row.__broken && publicStatus(row) === 'confirmed');
    const knownAmounts = [...new Set(members.map((row) => String(row.reward_amount || row.quantity || '').trim().toLowerCase()).filter(Boolean))];
    eligible.sort((a, b) => {
      const richA = Number(Boolean(a.reward_amount || a.quantity || a.reward_type || a.type));
      const richB = Number(Boolean(b.reward_amount || b.quantity || b.reward_type || b.type));
      if (richA !== richB) return richB - richA;
      return String(b.last_checked_at || b.found_at || b.created_at || '').localeCompare(String(a.last_checked_at || a.found_at || a.created_at || ''));
    });
    const winner = eligible[0] || null;
    if (winner) {
      metrics.valid++;
      metrics.really_new++;
      metrics.approved_ids.push(Number(winner.id));
      metrics.duplicates += Math.max(0, members.length - 1);
    } else {
      const representative = [...members].sort((a, b) => String(b.last_checked_at || b.found_at || b.created_at || '').localeCompare(String(a.last_checked_at || a.found_at || a.created_at || '')))[0];
      metrics.duplicates += Math.max(0, members.length - 1);
      if (representative?.__broken) { metrics.broken++; markReason('broken_or_unverified'); }
      else if (representative?.__old) { metrics.old++; markReason('old_or_missing_source_date'); }
    }
    for (const row of members) {
      const approved = Boolean(winner && Number(row.id) === Number(winner.id));
      const publication = approved ? 'approved' : 'rejected';
      const reason = approved ? '' : row.__old ? 'Recompensa antiga ou sem data real da fonte.' : row.__broken ? 'Link inválido, quebrado ou não verificado.' : 'Mesma recompensa já representada por outro registro.';
      if (!approved && !row.__old && !row.__broken) markReason('duplicate_identity');
      if (approved && knownAmounts.length > 1) {
        // Different publishers reported different quantities for the same
        // identifier. Keep the reward, but never publish an invented amount.
        updates.push(env.DB.prepare("UPDATE rewards SET publication_status = ?, reward_key = ?, reward_identifier = ?, reward_type = CASE WHEN ? THEN COALESCE(NULLIF(reward_type, ''), 'rolls') ELSE reward_type END, type = CASE WHEN ? THEN '' ELSE type END, quantity = CASE WHEN ? THEN '' ELSE quantity END, reward_amount = CASE WHEN ? THEN '' ELSE reward_amount END, reward_description = CASE WHEN ? THEN 'Link oficial validado; quantidade não confirmada entre as fontes.' ELSE reward_description END WHERE id = ?")
          .bind(publication, row.__identity, row.reward_identifier || row.reward_c || '', true, true, true, true, true, row.id));
      } else if (approved) {
        updates.push(env.DB.prepare("UPDATE rewards SET publication_status = ?, reward_key = ?, reward_identifier = ? WHERE id = ?")
          .bind(publication, row.__identity, row.reward_identifier || row.reward_c || '', row.id));
      } else {
        updates.push(env.DB.prepare("UPDATE rewards SET publication_status = ?, expiry_reason = CASE WHEN ? <> '' THEN ? ELSE expiry_reason END WHERE id = ?")
          .bind(publication, reason, reason, row.id));
      }
    }
  }
  if (updates.length) await env.DB.batch(updates);
  lastCoinMasterAudit = { ...metrics, rejected_reasons: Object.fromEntries(rejectedReasons) };
  return lastCoinMasterAudit;
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
async function repairMatchMastersPublication(env) {
  const base = await env.DB.prepare("UPDATE rewards SET publication_status = CASE WHEN reward_code <> '' OR (discovery_method = 'manual' AND instr(lower(reward_description), 'gg_manual:owner-confirmed') > 0) THEN 'published' WHEN status = 'confirmed' AND (lower(source) LIKE '%oficial%' OR lower(source) LIKE '%official%') THEN 'published' ELSE 'pending' END WHERE game_id IN (SELECT id FROM games WHERE slug = 'match-masters')").run();
  let repaired = Number(base?.meta?.changes || 0);
  for (const test of MATCH_MASTERS_MANUAL_TESTS) {
    const normalized = normalizeUrl(test.url);
    const result = await env.DB.prepare("UPDATE rewards SET publication_status = 'published', discovery_method = 'manual', status = ?, reward_status = ?, link_status = ?, reward_amount = ?, quantity = ?, reward_type = '', type = '', name = '', reward_description = ?, expiry_reason = CASE WHEN ? = 'problem' THEN ? ELSE '' END, expired_at = NULL, last_checked_at = COALESCE(last_checked_at, ?) WHERE game_id IN (SELECT id FROM games WHERE slug = 'match-masters') AND (normalized_url = ? OR original_url = ? OR url = ? OR final_url = ?)")
      .bind(test.rewardStatus === 'confirmed' ? 'confirmed' : 'unconfirmed', test.rewardStatus, test.linkStatus, test.amount, test.amount, test.description, test.linkStatus, test.description, nowIso(), normalized, test.url, test.url, test.url)
      .run();
    repaired += Number(result?.meta?.changes || 0);
  }
  return repaired;
}
async function ensureOwnerAddedMatchMastersReward(env) {
  const item = MATCH_MASTERS_OWNER_ADDED_REWARD;
  const game = await env.DB.prepare("SELECT id FROM games WHERE slug = 'match-masters' LIMIT 1").first();
  if (!game) return false;
  const normalized = normalizeUrl(item.url);
  const existing = await env.DB.prepare("SELECT id FROM rewards WHERE game_id = ? AND (normalized_url = ? OR original_url = ? OR url = ?) LIMIT 1").bind(game.id, normalized, item.url, item.url).first();
  if (existing) {
    await env.DB.prepare("UPDATE rewards SET image = ?, image_source = 'owner_upload' WHERE id = ?").bind(item.image, existing.id).run();
    return false;
  }
  const checkedAt = nowIso();
  const foundAt = `${item.dateKey}T00:00:00.000Z`;
  await env.DB.prepare("INSERT INTO rewards (game_id, name, type, quantity, reward_type, reward_amount, reward_description, image, url, source, date_key, time_label, status, user_id, verified_at, original_url, normalized_url, source_id, source_excerpt, found_at, last_checked_at, link_status, reward_status, reward_code, reward_key, reward_identifier, reward_pcode, reward_c, final_url, redemption_url, image_source, expiry_reason, expired_at, discovery_method, publication_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(game.id, '', 'perks', item.amount, item.rewardType, item.amount, item.description, item.image, item.url, 'Manual · proprietário', item.dateKey, '00:00', 'confirmed', item.url, normalized, null, item.description, foundAt, checkedAt, 'active', 'confirmed', '', `url:${normalized}`, item.rewardC, item.pcode, item.rewardC, item.url, '', 'owner_upload', '', null, 'manual', 'published')
    .run();
  return true;
}
async function ensureOwnerConfirmedCoinMasterRewards(env) {
  if (!COIN_MASTER_OWNER_CONFIRMED_REWARDS.length) return { inserted: 0, updated: 0 };
  const game = await env.DB.prepare("SELECT id FROM games WHERE slug = 'coin-master' LIMIT 1").first();
  if (!game) return { inserted: 0, updated: 0 };
  const rows = (await env.DB.prepare("SELECT * FROM rewards WHERE game_id = ? AND (original_url LIKE 'https://rewards.coinmaster.com/%' OR url LIKE 'https://rewards.coinmaster.com/%' OR final_url LIKE 'https://rewards.coinmaster.com/%')").bind(game.id).all()).results;
  const byUrl = new Map();
  rows.forEach((row) => [row.original_url, row.url, row.final_url, row.normalized_url].forEach((value) => { const key = normalizeUrl(value); if (key) byUrl.set(key, row); }));
  const now = nowIso(); const statements = []; let inserted = 0; let updated = 0;
  for (const item of COIN_MASTER_OWNER_CONFIRMED_REWARDS) {
    const normalized = normalizeUrl(item.url); const identifiers = rewardUrlIdentifiers(item.url); const existing = byUrl.get(normalized);
    const description = 'GG_MANUAL:owner-confirmed — Prêmio confirmado pelo proprietário: +25 Energia.';
    if (existing) {
      statements.push(env.DB.prepare("UPDATE rewards SET quantity = ?, reward_type = 'energy', reward_amount = ?, reward_description = ?, image = ?, image_source = 'owner_upload', source = ?, source_excerpt = ?, status = 'confirmed', reward_status = 'confirmed', link_status = 'active', publication_status = 'approved', discovery_method = 'manual', reward_identifier = CASE WHEN reward_identifier = '' THEN ? ELSE reward_identifier END, reward_pcode = CASE WHEN reward_pcode = '' THEN ? ELSE reward_pcode END, reward_c = CASE WHEN reward_c = '' THEN ? ELSE reward_c END, final_url = CASE WHEN final_url = '' THEN ? ELSE final_url END, found_at = ?, last_checked_at = ?, expiry_reason = '', expired_at = NULL WHERE id = ?").bind(item.quantity, item.amount, description, COIN_MASTER_OWNER_CONFIRMED_IMAGE, 'Manual · proprietário', description, identifiers.identifier, identifiers.pcode, identifiers.c, item.url, now, now, existing.id));
      updated++;
      continue;
    }
    const foundAt = now;
    statements.push(env.DB.prepare("INSERT INTO rewards (game_id, name, type, quantity, reward_type, reward_amount, reward_description, image, url, source, date_key, time_label, status, user_id, verified_at, original_url, normalized_url, source_id, source_excerpt, found_at, last_checked_at, link_status, reward_status, reward_code, reward_key, reward_identifier, reward_pcode, reward_c, final_url, redemption_url, image_source, expiry_reason, expired_at, discovery_method, publication_status) VALUES (?, '', '', ?, 'energy', ?, ?, ?, ?, 'Manual · proprietário', ?, '00:00', 'confirmed', NULL, NULL, ?, ?, NULL, ?, ?, ?, 'active', 'confirmed', '', ?, ?, ?, ?, ?, ?, 'owner_upload', '', NULL, 'manual', 'approved')").bind(game.id, item.quantity, item.amount, description, COIN_MASTER_OWNER_CONFIRMED_IMAGE, item.url, item.dateKey, item.url, normalized, description, foundAt, now, `coin_master:${String(identifiers.identifier || normalized).toLowerCase()}`, identifiers.identifier, identifiers.pcode, identifiers.c, item.url, item.url));
    inserted++;
  }
  if (statements.length) await env.DB.batch(statements);
  return { inserted, updated };
}
async function revalidateMatchMastersRewards(env) {
  const cutoff = new Date(Date.now() - COLLECTION_INTERVAL_MS).toISOString();
  const rows = (await env.DB.prepare(`SELECT r.* FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.slug = 'match-masters' AND r.discovery_method <> 'manual' AND r.link_status <> 'expired' AND r.url <> '' AND (r.last_checked_at IS NULL OR r.last_checked_at < ?) ORDER BY r.date_key DESC, r.created_at DESC LIMIT ${MATCH_MASTERS_MAX_REVALIDATIONS}`).bind(cutoff).all()).results;
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
  const coinMasterUrlDatesRepaired = await repairCoinMasterUrlDates(env);
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
  await repairMatchMastersPublication(env);
  await notifyNewRewards(env, results.map((result) => result.started_at));
  let coinMasterRevalidation = sourceId ? { skipped: true, reason: "A coleta de uma fonte já verifica seus próprios candidatos; a revalidação global fica para a rotação automática." } : null;
  if (!sourceId) {
    try {
      coinMasterRevalidation = await revalidateCoinMasterRewards(env);
      coinMasterRevalidation.audit = await auditCoinMasterPublication(env);
    } catch (error) {
      coinMasterRevalidation = { checked: 0, expired: 0, unconfirmed: 0, active: 0, expirations: [], error: String(error?.message || error || "Falha na revalidação do Coin Master.").slice(0, 500) };
    }
  }
  let matchMastersRevalidation = sourceId ? { skipped: true, reason: "A coleta de uma fonte já verifica seus próprios candidatos; a revalidação global fica para a rotação automática." } : null;
  if (!sourceId) {
    try {
      matchMastersRevalidation = await revalidateMatchMastersRewards(env);
    } catch (error) {
      matchMastersRevalidation = { checked: 0, active: 0, unconfirmed: 0, messenger_exclusive: 0, expired: 0, expirations: [], error: String(error?.message || error || "Falha na revalidação do Match Masters.").slice(0, 500) };
    }
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
    match_masters_accepted: results.reduce((sum, item) => sum + (item.accepted_count || 0), 0),
    match_masters_unconfirmed: results.reduce((sum, item) => sum + (item.unconfirmed_count || 0), 0),
    match_masters_expired: results.reduce((sum, item) => sum + (item.expired_count || 0), 0),
    match_masters_rejected: results.reduce((sum, item) => sum + (item.rejected_count || 0), 0),
    match_masters_rejection_reasons: results.map((item) => ({ source: item.name, reason: item.rejection_reason || "" })).filter((item) => item.reason),
    new_links_saved: results.reduce((sum, item) => sum + item.new_links_saved, 0),
    new_links_unconfirmed: results.reduce((sum, item) => sum + item.new_links_unconfirmed, 0),
    new_links_expired: results.reduce((sum, item) => sum + item.new_links_expired, 0),
    duplicates_ignored: results.reduce((sum, item) => sum + item.duplicates_ignored, 0),
    expiration_diagnostics: results.flatMap((item) => item.expiration_diagnostics || []),
    coin_master_age_expirations_repaired: coinMasterAgeExpirationsRepaired,
    coin_master_url_dates_repaired: coinMasterUrlDatesRepaired,
    match_masters_date_drift_repaired: matchMastersDateDriftRepaired,
    match_masters_messenger_rewards_repaired: matchMastersMessengerRewardsRepaired,
    coin_master_revalidation: coinMasterRevalidation,
    match_masters_revalidation: matchMastersRevalidation,
    results,
  };
}
async function collectDueSources(env) {
  if (collectionInFlight) return collectionInFlight;
  const due = await env.DB.prepare("SELECT s.* FROM sources s WHERE s.active = 1 AND (s.last_checked_at IS NULL OR s.last_checked_at < ?) ORDER BY COALESCE(s.last_checked_at, '1970-01-01T00:00:00.000Z') ASC, s.id ASC LIMIT 1")
    .bind(new Date(Date.now() - COLLECTION_INTERVAL_MS).toISOString()).first();
  if (!due) return null;
  // One source per invocation keeps the Worker subrequest budget bounded;
  // the 15-minute due window and oldest-due ordering rotate through every
  // registered source without dropping candidates from a source page.
  collectionInFlight = repairCoinMasterUrlDates(env).then(() => collectOneSource(env, due)).then(async (result) => {
    await repairMatchMastersPublication(env);
    await notifyNewRewards(env, [result.started_at]);
    return result;
  }).finally(() => { collectionInFlight = null; });
  return collectionInFlight;
}
async function collectTravelTownBootstrap(env) {
  const source = await env.DB.prepare("SELECT s.* FROM sources s JOIN games g ON g.id = s.game_id WHERE s.active = 1 AND g.slug = 'travel-town' ORDER BY s.id LIMIT 1").first();
  if (!source) return null;
  const recent = await env.DB.prepare("SELECT COUNT(*) AS count FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.slug = 'travel-town' AND r.link_status <> 'expired' AND r.date_key >= ?").bind(new Date(Date.now() - TRAVEL_TOWN_RECENT_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)).first("count");
  if (Number(recent || 0) >= 2) return null;
  if (collectionInFlight) return collectionInFlight;
  collectionInFlight = collectOneSource(env, source).then(async (result) => {
    await notifyNewRewards(env, [result.started_at]);
    return result;
  }).finally(() => { collectionInFlight = null; });
  return collectionInFlight;
}

export default {
  async scheduled(_controller, env) {
    await ensureDataSchema(env);
    try {
      const coinMasterResult = await ensureOwnerConfirmedCoinMasterRewards(env);
      if (coinMasterResult.inserted || coinMasterResult.updated) console.log(`[GAME GIFTS][manual-coin-master] ${coinMasterResult.inserted} novos, ${coinMasterResult.updated} atualizados.`);
    } catch (error) {
      console.error("[GAME GIFTS][manual-coin-master] falha ao registrar links confirmados", error);
    }
    try {
      const result = await collectDueSources(env);
      if (result) {
        console.log(`[GAME GIFTS][scheduler] fonte ${result.name} concluída: ${result.links_found} candidatos, ${result.new_links_saved} novos links, ${result.new_links_expired} expirados.`);
      } else {
      console.log("[GAME GIFTS][scheduler] coleta diária ignorada: fontes ainda dentro da janela de 24 horas.");
      }
    } catch (error) {
      console.error("[GAME GIFTS][scheduler] falha na coleta diária", error);
    }
    try {
      const eventResult = await collectDueEventSources(env);
      if (eventResult) {
        console.log(`[GAME GIFTS][event-scheduler] fonte ${eventResult.name} concluída: ${eventResult.candidates_found} candidatos, ${eventResult.published_count} publicados, ${eventResult.updated_count} atualizados.`);
      } else {
        console.log("[GAME GIFTS][event-scheduler] nenhuma fonte de eventos vencida.");
      }
      await refreshEventStatuses(env);
    } catch (error) {
      console.error("[GAME GIFTS][event-scheduler] falha na coleta de eventos", error);
    }
    try {
      const newsResult = await collectDueNewsSources(env);
      if (newsResult) console.log(`[GAME GIFTS][news-scheduler] fonte ${newsResult.name} concluída: ${newsResult.candidates_found} candidatos, ${newsResult.published_count} publicados, ${newsResult.updated_count} atualizados.`);
      else console.log("[GAME GIFTS][news-scheduler] nenhuma fonte de novidades vencida.");
    } catch (error) {
      console.error("[GAME GIFTS][news-scheduler] falha na coleta de novidades", error);
    }
  },
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      try {
        await ensureDataSchema(env);
      } catch (error) {
        console.error("[GAME GIFTS] banco indisponível; usando fallback público real", error);
        if (request.method === "GET" && ["/api/data", "/api/rewards.json", "/api/data/rewards.json"].includes(url.pathname)) {
          const fallback = fallbackPublicData();
          return url.pathname === "/api/data" ? json(fallback) : json({ updated_at: nowIso(), rewards: fallback.rewards.map(rewardFields) });
        }
        throw error;
      }
      if (request.method === "GET" && ["/api/data", "/api/rewards.json", "/api/data/rewards.json"].includes(url.pathname)) {
        await ensureOwnerAddedMatchMastersReward(env);
        await ensureOwnerConfirmedCoinMasterRewards(env).catch((error) => console.error("[GAME GIFTS] presentes Coin Master confirmados não registrados", error));
        await notifyNewRewards(env, [`${MATCH_MASTERS_OWNER_ADDED_REWARD.dateKey}T00:00:00.000Z`]).catch((error) => console.error("[GAME GIFTS] aviso manual não enviado", error));
      }
      if (request.method === "GET" && url.pathname === "/api/quiz/questions") return json({ questions: publicQuizQuestions() });
      if (request.method === "GET" && url.pathname === "/api/profile") {
        const identity = playerIdentity(request);
        if (!identity) return json({ error: "É necessário entrar na conta para acessar o perfil." }, { status: 401 });
        await env.DB.prepare("INSERT OR IGNORE INTO player_profiles (user_id, username, avatar_url) VALUES (?, ?, ?)").bind(identity.userId, identity.username, identity.avatar).run();
        const current = await env.DB.prepare("SELECT * FROM player_profiles WHERE user_id = ? LIMIT 1").bind(identity.userId).first();
        const today = nowIso().slice(0, 10);
        const previous = String(current?.last_visit_date || "");
        const yesterday = new Date(`${today}T00:00:00Z`); yesterday.setUTCDate(yesterday.getUTCDate() - 1);
        const yesterdayKey = yesterday.toISOString().slice(0, 10);
        const streak = previous === today ? Number(current?.visit_streak || 0) : previous === yesterdayKey ? Number(current?.visit_streak || 0) + 1 : 1;
        await env.DB.prepare("UPDATE player_profiles SET username = ?, avatar_url = ?, visit_streak = ?, last_visit_date = ?, updated_at = ? WHERE user_id = ?").bind(identity.username, identity.avatar, streak, today, nowIso(), identity.userId).run();
        const row = await env.DB.prepare("SELECT * FROM player_profiles WHERE user_id = ? LIMIT 1").bind(identity.userId).first();
        const position = await env.DB.prepare("SELECT COUNT(*) + 1 AS ranking_position FROM (SELECT user_id, SUM(score) AS points FROM quiz_scores GROUP BY user_id) WHERE points > COALESCE((SELECT points FROM player_profiles WHERE user_id = ?), 0)").bind(identity.userId).first();
        return json({ profile: profileFields({ ...row, ranking_position: Number(row?.points || 0) > 0 ? Number(position?.ranking_position || 1) : null }) });
      }
      if (request.method === "GET" && url.pathname === "/api/ranking") {
        const period = ["daily", "weekly", "all"].includes(url.searchParams.get("period")) ? url.searchParams.get("period") : "daily";
        const filter = period === "daily" ? "WHERE completed_at >= datetime('now', '-1 day')" : period === "weekly" ? "WHERE completed_at >= datetime('now', '-7 days')" : "";
        const rows = await env.DB.prepare(`SELECT user_id, MAX(username) AS username, MAX(avatar_url) AS avatar_url, SUM(score) AS points, MAX(completed_at) AS latest_at FROM quiz_scores ${filter} GROUP BY user_id ORDER BY points DESC, latest_at ASC LIMIT 50`).all();
        return json({ period, players: rows.results.map((row) => ({ user_id: row.user_id, username: row.username || "Jogador", avatar_url: row.avatar_url || "", points: Number(row.points || 0) })) });
      }
      if (request.method === "POST" && url.pathname === "/api/quiz/submit") {
        const identity = playerIdentity(request);
        if (!identity) return json({ error: "Entre na conta para registrar a pontuação." }, { status: 401 });
        const body = await readBody(request);
        const answers = Array.isArray(body?.answers) ? body.answers.slice(0, QUIZ_BANK.length).map((answer) => Number.isInteger(Number(answer)) ? Number(answer) : -1) : [];
        if (answers.length !== QUIZ_BANK.length || answers.some((answer) => answer < 0 || answer > 3)) return json({ error: "O Quiz precisa ser concluído com 10 respostas válidas." }, { status: 400 });
        const attemptId = String(body?.attempt_id || crypto.randomUUID()).slice(0, 100);
        const existing = await env.DB.prepare("SELECT score, correct_answers FROM quiz_scores WHERE attempt_id = ? AND user_id = ? LIMIT 1").bind(attemptId, identity.userId).first();
        if (existing) return json({ saved: true, duplicate: true, score: Number(existing.score || 0), correct_answers: Number(existing.correct_answers || 0), profile: profileFields(await env.DB.prepare("SELECT * FROM player_profiles WHERE user_id = ? LIMIT 1").bind(identity.userId).first()) });
        const correct = answers.reduce((total, answer, index) => total + (answer === QUIZ_BANK[index][2] ? 1 : 0), 0);
        const score = correct * 10;
        await env.DB.prepare("INSERT INTO quiz_scores (attempt_id, user_id, username, avatar_url, score, correct_answers, total_questions, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(attemptId, identity.userId, identity.username, identity.avatar, score, correct, QUIZ_BANK.length, nowIso()).run();
        await env.DB.prepare(`INSERT INTO player_profiles (user_id, username, avatar_url, points, quizzes_completed, quiz_best_score, updated_at) VALUES (?, ?, ?, ?, 1, ?, ?) ON CONFLICT (user_id) DO UPDATE SET username = excluded.username, avatar_url = excluded.avatar_url, points = player_profiles.points + excluded.points, quizzes_completed = player_profiles.quizzes_completed + 1, quiz_best_score = MAX(player_profiles.quiz_best_score, excluded.quiz_best_score), updated_at = excluded.updated_at`).bind(identity.userId, identity.username, identity.avatar, score, score, nowIso()).run();
        return json({ saved: true, score, correct_answers: correct, profile: profileFields(await env.DB.prepare("SELECT * FROM player_profiles WHERE user_id = ? LIMIT 1").bind(identity.userId).first()) });
      }
      if (request.method === "GET" && ["/api/rewards.json", "/api/data/rewards.json"].includes(url.pathname)) {
        const rewards = await env.DB.prepare("SELECT r.*, g.name AS game_name, g.slug AS game_slug FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.active = 1 AND r.publication_status IN ('approved', 'published') ORDER BY r.date_key DESC, r.found_at DESC, r.created_at DESC").all();
        return json({ updated_at: nowIso(), rewards: rewards.results.map(publicRewardFields) });
      }
      if (request.method === "GET" && url.pathname === "/api/news-feed") {
        const gameSlug = String(url.searchParams.get("game") || "").trim();
        const binds = []; const clauses = ["g.active = 1", "n.publication_status = 'published'"];
        if (gameSlug) { clauses.push("g.slug = ?"); binds.push(gameSlug); }
        const rows = await env.DB.prepare(`SELECT n.* FROM news_items n JOIN games g ON g.id = n.game_id WHERE ${clauses.join(" AND ")} ORDER BY COALESCE(n.published_at, n.updated_at) DESC LIMIT 300`).bind(...binds).all();
        return json({ updated_at: nowIso(), news: rows.results.map(newsPublicFields) });
      }
      if (request.method === "GET" && url.pathname === "/api/events") {
        await refreshEventStatuses(env);
        const gameSlug = String(url.searchParams.get("game") || "").trim();
        const requestedStatus = String(url.searchParams.get("status") || "").trim().toLowerCase();
        const history = url.searchParams.get("history") === "1";
        const clauses = ["g.active = 1", "e.publication_status = 'published'"];
        const binds = [];
        if (gameSlug) { clauses.push("g.slug = ?"); binds.push(gameSlug); }
        if (["active", "upcoming", "ended"].includes(requestedStatus)) { clauses.push("e.status = ?"); binds.push(requestedStatus); }
        else if (!history) clauses.push("e.status <> 'ended'");
        const rows = await env.DB.prepare(`SELECT e.* FROM events e JOIN games g ON g.id = e.game_id WHERE ${clauses.join(" AND ")} ORDER BY CASE e.status WHEN 'active' THEN 1 WHEN 'upcoming' THEN 2 ELSE 3 END, COALESCE(e.start_date, '9999-12-31') ASC, e.updated_at DESC LIMIT 300`).bind(...binds).all();
        return json({ updated_at: nowIso(), events: rows.results.map(eventPublicFields) });
      }
      if (request.method === "GET" && url.pathname.match(/^\/api\/events\/[^/]+\/[^/]+$/)) {
        await refreshEventStatuses(env);
        const pathParts = url.pathname.split("/");
        const gameSlug = pathParts[3];
        const eventSlug = pathParts[4];
        const row = await env.DB.prepare("SELECT e.* FROM events e JOIN games g ON g.id = e.game_id WHERE g.active = 1 AND e.publication_status = 'published' AND g.slug = ? AND (e.slug = ? OR e.event_id = ?) ORDER BY e.updated_at DESC LIMIT 1").bind(gameSlug, eventSlug, eventSlug).first();
        return row ? json({ event: eventPublicFields(row) }) : json({ error: "Evento não encontrado." }, { status: 404 });
      }
      if (request.method === "GET" && url.pathname === "/api/data") {
        collectDueSources(env).catch((error) => console.error("Automatic collection failed", error));
        await collectTravelTownBootstrap(env).catch((error) => console.error("Travel Town collection failed", error));
        await refreshEventStatuses(env);
        const identity = voterIdentity(request);
        const voteMaps = await allVoteSummaries(env, identity.userId);
        const games = await env.DB.prepare(`SELECT id, name, slug, image, banner, description, reward_mode, active, created_at FROM games WHERE active = 1 ORDER BY CASE slug ${catalogOrder} ELSE 99 END`).all();
        const rewards = await env.DB.prepare("SELECT r.*, g.name AS game_name, g.slug AS game_slug FROM rewards r JOIN games g ON g.id = r.game_id WHERE g.active = 1 AND r.publication_status IN ('approved', 'published') ORDER BY r.date_key DESC, r.created_at DESC").all();
        const events = await env.DB.prepare("SELECT e.* FROM events e JOIN games g ON g.id = e.game_id WHERE g.active = 1 AND e.publication_status = 'published' ORDER BY CASE e.status WHEN 'active' THEN 1 WHEN 'upcoming' THEN 2 ELSE 3 END, COALESCE(e.start_date, '9999-12-31') ASC, e.updated_at DESC LIMIT 300").all();
        const news = await env.DB.prepare("SELECT n.* FROM news_items n JOIN games g ON g.id = n.game_id WHERE g.active = 1 AND n.publication_status = 'published' ORDER BY COALESCE(n.published_at, n.updated_at) DESC LIMIT 300").all();
        return jsonForVoter({ games: games.results.map(gameFields), rewards: rewards.results.map((reward) => ({ ...publicRewardFields(reward), confirmation: voteMaps.byReward.get(Number(reward.id)) || { worked: 0, failed: 0, recent_failed: 0, status: "unconfirmed", my_vote: null, game_my_vote: voteMaps.byGame.get(Number(reward.game_id)) || null } })), events: events.results.map(eventPublicFields), news: news.results.map(newsPublicFields), events_updated_at: nowIso(), news_updated_at: nowIso() }, identity);
      }
      if (request.method === "GET" && url.pathname === "/api/notices/preferences") {
        const userId = noticeUserId(request);
        if (!userId) return json({ games: [], persisted: false, reason: "signin_required" });
        const row = await env.DB.prepare("SELECT games_json, channels_json, updated_at FROM notice_preferences WHERE user_id = ? LIMIT 1").bind(userId).first();
        return json({ games: parseNoticeGames(row?.games_json), channels: parseNoticeChannels(row?.channels_json), persisted: true, updated_at: row?.updated_at || null });
      }
      if (request.method === "POST" && url.pathname === "/api/notices/test") {
        const userId = noticeUserId(request);
        if (!userId) return json({ delivered: 0, skipped: "signin_required" }, { status: 401 });
        if (!env.NOTIFICATIONS) return json({ delivered: 0, skipped: "notifications_unavailable" }, { status: 503 });
        const testId = `${Date.now()}-${crypto.randomUUID()}`;
        try {
          const delivery = await env.NOTIFICATIONS.send({
            recipients: [userId],
            title: "Teste de notificações",
            body: "O Game Gifts enviou este aviso de teste porque você solicitou.",
            path: "/?settings-test=1",
            idempotencyKey: `game-gifts:test:${userId}:${testId}`,
          });
          return json({ delivered: Number(delivery?.delivered || 0), skipped: delivery?.skipped || {} });
        } catch (error) {
          console.error("[GAME GIFTS] falha no aviso de teste", String(error?.message || error || ""));
          return json({ error: "A plataforma não permitiu enviar a notificação de teste.", delivered: 0, skipped: "send_failed" }, { status: 503 });
        }
      }
      if (request.method === "PUT" && url.pathname === "/api/notices/preferences") {
        const userId = noticeUserId(request);
        if (!userId) return json({ games: [], persisted: false, reason: "signin_required" });
        const body = await readBody(request);
        const requested = Array.isArray(body?.games) ? body.games.map((item) => String(item || "").trim()) : [];
        const channels = parseNoticeChannels(JSON.stringify(body?.channels || {}));
        const activeGames = (await env.DB.prepare("SELECT slug FROM games WHERE active = 1").all()).results.map((game) => String(game.slug));
        const allowed = new Set(activeGames);
        const games = [...new Set(requested.filter((slug) => allowed.has(slug)))];
        await env.DB.prepare("INSERT INTO notice_preferences (user_id, games_json, channels_json, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT (user_id) DO UPDATE SET games_json = excluded.games_json, channels_json = excluded.channels_json, updated_at = excluded.updated_at")
          .bind(userId, JSON.stringify(games), JSON.stringify(channels), nowIso()).run();
        return json({ games, channels, persisted: true });
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
        const diagnostics = await env.DB.prepare("SELECT d.*, s.name AS source_name, g.name AS game_name FROM collection_diagnostics d LEFT JOIN sources s ON d.source_id = s.id LEFT JOIN games g ON d.game_id = g.id ORDER BY d.checked_at DESC LIMIT 500").all();
        await refreshEventStatuses(env);
        const eventSources = await env.DB.prepare("SELECT es.*, g.name AS game_name, g.slug AS game_slug FROM event_sources es JOIN games g ON g.id = es.game_id ORDER BY g.name COLLATE NOCASE, es.priority DESC, es.name COLLATE NOCASE").all();
        const events = await env.DB.prepare("SELECT e.* FROM events e JOIN games g ON g.id = e.game_id ORDER BY CASE e.status WHEN 'active' THEN 1 WHEN 'upcoming' THEN 2 ELSE 3 END, e.updated_at DESC LIMIT 300").all();
        const eventLogs = await env.DB.prepare("SELECT l.*, es.name AS source_name, g.name AS game_name FROM event_collection_logs l LEFT JOIN event_sources es ON es.id = l.source_id LEFT JOIN games g ON g.id = es.game_id ORDER BY l.started_at DESC LIMIT 100").all();
        const eventDiagnostics = await env.DB.prepare("SELECT d.*, es.name AS source_name, g.name AS game_name FROM event_collection_diagnostics d LEFT JOIN event_sources es ON es.id = d.source_id LEFT JOIN games g ON g.id = d.game_id ORDER BY d.checked_at DESC LIMIT 500").all();
        const newsSources = await env.DB.prepare("SELECT ns.*, g.name AS game_name, g.slug AS game_slug FROM news_sources ns JOIN games g ON g.id = ns.game_id ORDER BY g.name COLLATE NOCASE, ns.priority DESC, ns.name COLLATE NOCASE").all();
        const newsLogs = await env.DB.prepare("SELECT l.*, ns.name AS source_name, g.name AS game_name FROM news_collection_logs l LEFT JOIN news_sources ns ON ns.id = l.source_id LEFT JOIN games g ON g.id = ns.game_id ORDER BY l.started_at DESC LIMIT 100").all();
        return json({ games: games.results.map(gameFields), rewards: rewards.results.map(rewardFields), sources: sources.results.map((source) => ({ ...source, active: Boolean(source.active) })), logs: logs.results, diagnostics: diagnostics.results, event_sources: eventSources.results.map((source) => ({ ...source, active: Boolean(source.active) })), events: events.results.map(eventPublicFields), event_logs: eventLogs.results, event_diagnostics: eventDiagnostics.results, news_sources: newsSources.results.map((source) => ({ ...source, active: Boolean(source.active) })), news_logs: newsLogs.results, scheduler_supported: true, event_scheduler_supported: true, news_scheduler_supported: true, event_scheduler_configured: false, news_scheduler_configured: false, event_collection_interval_hours: EVENT_COLLECTION_INTERVAL_MS / 3600000, news_collection_interval_hours: NEWS_COLLECTION_INTERVAL_MS / 3600000 });
      }
      if (request.method === "POST" && url.pathname === "/api/admin/events/collect") {
        const denied = ownerRequired(request); if (denied) return denied;
        const body = await readBody(request);
        const sourceId = body?.source_id ? asId(body.source_id) : null;
        const result = await collectDueEventSources(env, sourceId);
        await refreshEventStatuses(env);
        return json(result || { message: "Nenhuma fonte de eventos vencida.", candidates_found: 0, published_count: 0, updated_count: 0 });
      }
      if (request.method === "POST" && url.pathname === "/api/admin/event-sources") {
        const denied = ownerRequired(request); if (denied) return denied;
        const body = await readBody(request); const gameId = asId(body?.game_id); const name = String(body?.name ?? "").trim(); const sourceUrl = String(body?.url ?? "").trim(); const sourceKind = ["official", "official_help", "official_news", "official_social", "official_store", "discovery"].includes(body?.source_kind) ? body.source_kind : "official";
        if (!gameId || !name || !validUrl(sourceUrl)) return json({ error: "Jogo, nome e URL pública da fonte são obrigatórios." }, { status: 400 });
        if (!await env.DB.prepare("SELECT id FROM games WHERE id = ? AND active = 1").bind(gameId).first()) return json({ error: "Jogo ativo não encontrado." }, { status: 404 });
        await env.DB.prepare("INSERT INTO event_sources (game_id, name, url, active, source_kind, parser_type, priority, user_id) VALUES (?, ?, ?, ?, ?, 'html_event', ?, ?)").bind(gameId, name, sourceUrl, body.active === false ? 0 : 1, sourceKind, Math.max(1, Math.min(100, Number(body.priority || 100))), request.headers.get("x-websim-user-id")).run();
        return json({ source: await env.DB.prepare("SELECT es.*, g.name AS game_name, g.slug AS game_slug FROM event_sources es JOIN games g ON g.id = es.game_id WHERE es.id = last_insert_rowid()").first() }, { status: 201 });
      }
      if (request.method === "PATCH" && url.pathname.match(/^\/api\/admin\/event-sources\/\d+$/)) {
        const denied = ownerRequired(request); if (denied) return denied;
        const id = asId(url.pathname.split("/").pop()); const body = await readBody(request); const current = id ? await env.DB.prepare("SELECT * FROM event_sources WHERE id = ?").bind(id).first() : null;
        if (!current || !body) return json({ error: "Fonte de eventos não encontrada." }, { status: 404 });
        const gameId = asId(body.game_id ?? current.game_id); const name = String(body.name ?? current.name).trim(); const sourceUrl = String(body.url ?? current.url).trim(); const sourceKind = ["official", "official_help", "official_news", "official_social", "official_store", "discovery"].includes(body.source_kind) ? body.source_kind : current.source_kind;
        if (!gameId || !name || !validUrl(sourceUrl)) return json({ error: "Dados da fonte de eventos inválidos." }, { status: 400 });
        await env.DB.prepare("UPDATE event_sources SET game_id = ?, name = ?, url = ?, active = ?, source_kind = ?, priority = ?, last_error = NULL, updated_at = ? WHERE id = ?").bind(gameId, name, sourceUrl, body.active === false ? 0 : 1, sourceKind, Math.max(1, Math.min(100, Number(body.priority ?? current.priority ?? 100))), nowIso(), id).run();
        return json({ source: await env.DB.prepare("SELECT es.*, g.name AS game_name, g.slug AS game_slug FROM event_sources es JOIN games g ON g.id = es.game_id WHERE es.id = ?").bind(id).first() });
      }
      if (request.method === "DELETE" && url.pathname.match(/^\/api\/admin\/event-sources\/\d+$/)) {
        const denied = ownerRequired(request); if (denied) return denied;
        const id = asId(url.pathname.split("/").pop()); if (!id) return json({ error: "Identificador inválido." }, { status: 400 });
        await env.DB.prepare("UPDATE event_collection_logs SET source_id = NULL WHERE source_id = ?").bind(id).run();
        await env.DB.prepare("UPDATE event_collection_diagnostics SET source_id = NULL WHERE source_id = ?").bind(id).run();
        await env.DB.prepare("DELETE FROM event_sources WHERE id = ?").bind(id).run();
        return json({ ok: true });
      }
      if (request.method === "POST" && url.pathname === "/api/admin/news-sources") {
        const denied = ownerRequired(request); if (denied) return denied;
        const body = await readBody(request); const gameId = asId(body?.game_id); const name = String(body?.name ?? "").trim(); const sourceUrl = String(body?.url ?? "").trim();
        const sourceKind = ["official_news", "official", "official_help", "official_social", "official_store", "discovery"].includes(body?.source_kind) ? body.source_kind : "official_news";
        if (!gameId || !name || !validUrl(sourceUrl)) return json({ error: "Jogo, nome e URL pública da fonte são obrigatórios." }, { status: 400 });
        if (!await env.DB.prepare("SELECT id FROM games WHERE id = ? AND active = 1").bind(gameId).first()) return json({ error: "Jogo ativo não encontrado." }, { status: 404 });
        await env.DB.prepare("INSERT INTO news_sources (game_id, name, url, active, source_kind, priority, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(gameId, name, sourceUrl, body.active === false ? 0 : 1, sourceKind, Math.max(1, Math.min(100, Number(body.priority || 100))), request.headers.get("x-websim-user-id")).run();
        return json({ source: await env.DB.prepare("SELECT ns.*, g.name AS game_name, g.slug AS game_slug FROM news_sources ns JOIN games g ON g.id = ns.game_id WHERE ns.id = last_insert_rowid()").first() }, { status: 201 });
      }
      if (request.method === "POST" && url.pathname === "/api/admin/news/collect") {
        const denied = ownerRequired(request); if (denied) return denied;
        const body = await readBody(request); const sourceId = body?.source_id ? asId(body.source_id) : null;
        return json(await collectDueNewsSources(env, sourceId) || { message: "Nenhuma fonte de novidades vencida.", candidates_found: 0, published_count: 0, updated_count: 0 });
      }
      if (request.method === "POST" && url.pathname === "/api/admin/coin-master/revalidate") {
        const denied = ownerRequired(request); if (denied) return denied;
        const offset = Math.max(0, Number(url.searchParams.get("offset") || 0));
        const limit = Math.max(1, Math.min(20, Number(url.searchParams.get("limit") || 20)));
        const validation = await revalidateCoinMasterRewards(env, { force: true, offset, limit });
        const audit = await auditCoinMasterPublication(env);
        return json({ ...validation, audit, offset, limit });
      }
      if (request.method === "POST" && url.pathname === "/api/admin/coin-master/audit") {
        const denied = ownerRequired(request); if (denied) return denied;
        return json(await auditCoinMasterPublication(env));
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
          const duplicatePublication = String(duplicate.link_status || '').toLowerCase() === 'active' && String(duplicate.reward_status || duplicate.status || '').toLowerCase() === 'confirmed' ? 'approved' : duplicate.publication_status || 'pending';
          await env.DB.prepare("UPDATE rewards SET source = ?, source_excerpt = ?, type = ?, quantity = ?, reward_type = COALESCE(NULLIF(?, ''), reward_type), reward_amount = COALESCE(NULLIF(?, ''), reward_amount), reward_description = COALESCE(NULLIF(?, ''), reward_description), image = ?, reward_code = COALESCE(NULLIF(?, ''), reward_code), discovery_method = 'manual', publication_status = ?, last_checked_at = ? WHERE id = ?").bind(mergeSources(duplicate.source, body.source), String(body.source_excerpt ?? duplicate.source_excerpt ?? "").trim(), String(body.type ?? duplicate.type ?? "").trim(), String(body.quantity ?? duplicate.quantity ?? "").trim(), String(body.reward_type ?? "").trim(), String(body.reward_amount ?? "").trim(), String(body.reward_description ?? "").trim(), String(body.image ?? duplicate.image ?? "").trim(), rewardCode, duplicatePublication, checkedAt, duplicate.id).run();
          return json({ reward: rewardFields(await env.DB.prepare("SELECT r.*, g.name AS game_name FROM rewards r JOIN games g ON g.id = r.game_id WHERE r.id = ?").bind(duplicate.id).first()), duplicate: true });
        }
        const foundAt = String(body.found_at ?? `${dateKey}T${String(body.time_label || "00:00")}:00.000Z`); const parts = dateParts(foundAt);
        const destination = rewardUrl ? await verifyRewardDestination(rewardUrl, selectedGame) : { status: "unverified", checkedAt };
        const linkStatus = destination.status === "active" ? "active" : destination.status === "expired" ? "expired" : "unverified";
        const safeStatus = destination.status === "expired" ? "expired_invalid" : status;
        const finalUrl = destination.finalUrl || rewardUrl; const finalNormalized = normalizeUrl(finalUrl); const expiryReason = safeStatus === "expired_invalid" ? (destination.reason || "Fonte indica recompensa expirada.") : "";
        const manualPublication = safeStatus === 'confirmed' && (destination.status === 'active' || (selectedGame.reward_mode === 'codes' && rewardCode)) ? 'approved' : 'pending';
        await env.DB.prepare("INSERT INTO rewards (game_id, name, type, quantity, reward_type, reward_amount, reward_description, image, url, source, date_key, time_label, status, user_id, verified_at, original_url, normalized_url, source_id, source_excerpt, found_at, last_checked_at, link_status, reward_status, reward_code, reward_key, final_url, redemption_url, image_source, expiry_reason, expired_at, discovery_method, publication_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
          .bind(gameId, String(body.name ?? "").trim(), String(body.type ?? "").trim(), String(body.quantity ?? "").trim(), String(body.reward_type ?? body.type ?? "").trim(), String(body.reward_amount ?? body.quantity ?? "").trim(), String(body.reward_description ?? body.source_excerpt ?? "").trim(), String(body.image ?? "").trim(), rewardUrl, String(body.source ?? "").trim(), parts.date || dateKey, parts.time || String(body.time_label ?? ""), safeStatus === "confirmed" ? "confirmed" : safeStatus === "expired_invalid" ? "expired_invalid" : "unconfirmed", rewardUrl, normalized, asId(body.source_id), String(body.source_excerpt ?? "").trim(), foundAt, destination.checkedAt, linkStatus, safeStatus, rewardCode, rewardKey, finalUrl, rewardCode ? rewardUrl : "", body.image ? "source" : "", expiryReason, safeStatus === "expired_invalid" ? destination.checkedAt : null, 'manual', manualPublication).run();
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
