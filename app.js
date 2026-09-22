import { identifyMatchMastersReward } from "./match-masters-identification.js";
import "./adsense.js";

const LANGS = ["pt", "en", "es", "de", "tr"];
const isGitHubPagesHost = () => location.hostname.endsWith("github.io");
const SITE_PATH = isGitHubPagesHost() ? "/game-gifts" : "";
const PUBLIC_BASE_URL = `${location.origin}${SITE_PATH}`;
const runtimeUsesSitePath = () => Boolean(SITE_PATH);
const sitePath = (path) => {
  const value = String(path || "");
  const normalized = value.startsWith("/") ? value : `/${value}`;
  if (normalized === SITE_PATH || normalized.startsWith(`${SITE_PATH}/`)) return normalized;
  return `${runtimeUsesSitePath() ? SITE_PATH : ""}${normalized}`;
};
const assetUrl = (path) => {
  const value = String(path || "");
  if (!value || /^(?:https?:|data:|blob:|#)/i.test(value)) return value;
  return sitePath(value);
};
const publicUrl = (path) => {
  const value = String(path || "/");
  const relative = value.startsWith(SITE_PATH) ? value.slice(SITE_PATH.length) || "/" : value;
  return `${PUBLIC_BASE_URL}${relative.startsWith("/") ? relative : `/${relative}`}`;
};
const SECTION_NAMES = {
  pt: { games: "jogos", news: "novidades", guides: "guias", codes: "codigos", events: "eventos", favorites: "favoritos", more: "mais", play: "jogar", profile: "perfil", ranking: "ranking", settings: "configuracoes", admin: "admin", howTo: "como-resgatar", problems: "problemas", related: "jogos-relacionados" },
  en: { games: "games", news: "news", guides: "guides", codes: "codes", events: "events", favorites: "favorites", more: "more", play: "play", profile: "profile", ranking: "ranking", settings: "settings", admin: "admin", howTo: "how-to-redeem", problems: "problems", related: "related-games" },
  es: { games: "juegos", news: "novedades", guides: "guias", codes: "codigos", events: "eventos", favorites: "favoritos", more: "mas", play: "jugar", profile: "perfil", ranking: "ranking", settings: "configuraciones", admin: "admin", howTo: "como-reclamar", problems: "problemas", related: "juegos-relacionados" },
  de: { games: "spiele", news: "neuigkeiten", guides: "guides", codes: "codes", events: "veranstaltungen", favorites: "favoriten", more: "mehr", play: "spielen", profile: "profil", ranking: "rangliste", settings: "einstellungen", admin: "admin", howTo: "einloesen", problems: "probleme", related: "verwandte-spiele" },
  tr: { games: "oyunlar", news: "yenilikler", guides: "rehberler", codes: "kodlar", events: "etkinlikler", favorites: "favoriler", more: "daha-fazla", play: "oyna", profile: "profil", ranking: "siralama", settings: "ayarlar", admin: "admin", howTo: "nasil-kullanilir", problems: "sorunlar", related: "ilgili-oyunlar" },
};
// Some help/related routes exist as public static documents only in PT.
// Keep generated internal links on routes that are actually published in
// each language instead of emitting deep links that GitHub Pages cannot serve.
const PUBLIC_ROUTE_FALLBACKS = Object.freeze({
  en: { howTo: "guides", problems: "guides", related: "games" },
  es: { howTo: "guias", problems: "guias", related: "juegos" },
  de: { howTo: "guides", problems: "guides", related: "spiele" },
  tr: { howTo: "rehberler", problems: "rehberler", related: "oyunlar" },
});
const GAME_SEO = Object.freeze({
  "match-masters": {
    path: "/en/games/match-masters/",
    pt: { title: "Presentes Grátis Match Masters Hoje | Game Gifts", h1: "Match Masters: presentes grátis de hoje", description: "Confira presentes públicos do Match Masters organizados por data, com status claro de confirmação, verificação, resgate e expiração.", intro: "Links públicos de presentes do Match Masters organizados pela data publicada na fonte, sem transformar uma URL reencontrada em um presente novo." },
    en: { title: "Match Masters Free Gifts Today | Game Gifts", h1: "Match Masters Free Gifts Today", description: "Find public Match Masters gifts organized by source date, with clear confirmed, in verification, claimed and expired statuses.", intro: "Public Match Masters gift links organized by the date published in the source, so a rediscovered URL is not presented as a new gift." },
    es: { title: "Regalos Gratis Match Masters Hoy | Game Gifts", h1: "Regalos gratis de Match Masters hoy", description: "Consulta regalos públicos de Match Masters por fecha de la fuente, con estados claros de confirmación, verificación, reclamación y caducidad.", intro: "Enlaces públicos de regalos de Match Masters ordenados por la fecha publicada en la fuente." },
    de: { title: "Match Masters Gratisgeschenke Heute | Game Gifts", h1: "Match Masters Gratisgeschenke heute", description: "Öffentliche Match-Masters-Geschenke nach dem Quelldatum, mit klaren Status für bestätigt, Prüfung, eingelöst und abgelaufen.", intro: "Öffentliche Match-Masters-Geschenklinks nach dem Veröffentlichungsdatum der Quelle." },
    tr: { title: "Match Masters Ücretsiz Hediyeler Bugün | Game Gifts", h1: "Match Masters bugün ücretsiz hediyeler", description: "Match Masters herkese açık hediyelerini kaynak tarihine göre görün; doğrulandı, incelemede, alındı ve süresi doldu durumları açıkça ayrılır.", intro: "Kaynakta yayınlanan tarihe göre düzenlenmiş herkese açık Match Masters hediye bağlantıları." },
  },
  "dice-dreams": {
    path: "/en/games/dice-dreams/",
    pt: { title: "Rolls Grátis Dice Dreams Hoje | Game Gifts", h1: "Dice Dreams: rolls grátis de hoje", description: "Veja rolls públicos do Dice Dreams organizados por data, com confirmação honesta e estado individual de já resgatado.", intro: "Rolls públicos do Dice Dreams organizados por data, mantendo links não confirmados acessíveis sem chamá-los de garantidos." },
    en: { title: "Dice Dreams Free Rolls Today | Game Gifts", h1: "Dice Dreams Free Rolls Today", description: "Find public Dice Dreams rolls organized by date, with honest confirmation and an individual already-claimed state.", intro: "Public Dice Dreams rolls organized by date, keeping unconfirmed links accessible without calling them guaranteed." },
    es: { title: "Tiradas Gratis Dice Dreams Hoy | Game Gifts", h1: "Tiradas gratis de Dice Dreams hoy", description: "Encuentra tiradas públicas de Dice Dreams por fecha, con confirmación honesta y estado individual de ya reclamado.", intro: "Tiradas públicas de Dice Dreams organizadas por fecha, sin presentar como garantizados los enlaces no confirmados." },
    de: { title: "Dice Dreams Freispiele Heute | Game Gifts", h1: "Dice Dreams Freispiele heute", description: "Finde öffentliche Dice-Dreams-Würfe nach Datum, mit ehrlicher Bestätigung und individuellem Status für eingelöst.", intro: "Öffentliche Dice-Dreams-Würfe nach Datum, ohne unbestätigte Links als garantiert auszugeben." },
    tr: { title: "Dice Dreams Ücretsiz Atışlar Bugün | Game Gifts", h1: "Dice Dreams bugün ücretsiz atışlar", description: "Dice Dreams herkese açık atışlarını tarihe göre görün; doğrulama ve kişisel alındı durumu açıkça ayrılır.", intro: "Tarihe göre düzenlenmiş herkese açık Dice Dreams atışları; doğrulanmamış bağlantılar garanti olarak sunulmaz." },
  },
  "coin-master": {
    path: "/en/games/coin-master/",
    pt: { title: "Spins Grátis Coin Master Hoje | Game Gifts", h1: "Coin Master: spins grátis de hoje", description: "Confira spins públicos do Coin Master por data, distinguindo recompensas confirmadas, em verificação, expiradas e já resgatadas.", intro: "Spins públicos do Coin Master organizados por data, com ofertas expiradas fora da lista disponível e novos links em verificação." },
    en: { title: "Coin Master Free Spins Today | Game Gifts", h1: "Coin Master Free Spins Today", description: "Find public Coin Master spins by date, distinguishing confirmed, in verification, expired and individually claimed rewards.", intro: "Public Coin Master spins organized by date, with expired offers removed from available gifts and new links kept in verification." },
    es: { title: "Giros Gratis Coin Master Hoy | Game Gifts", h1: "Giros gratis de Coin Master hoy", description: "Consulta giros públicos de Coin Master por fecha, diferenciando recompensas confirmadas, en verificación, caducadas y reclamadas.", intro: "Giros públicos de Coin Master ordenados por fecha, con ofertas caducadas fuera de los regalos disponibles." },
    de: { title: "Coin Master Freispiele Heute | Game Gifts", h1: "Coin Master Freispiele heute", description: "Finde öffentliche Coin-Master-Spins nach Datum, getrennt nach bestätigt, Prüfung, abgelaufen und individuell eingelöst.", intro: "Öffentliche Coin-Master-Spins nach Datum; abgelaufene Angebote erscheinen nicht als verfügbar." },
    tr: { title: "Coin Master Ücretsiz Çevirme Bugün | Game Gifts", h1: "Coin Master bugün ücretsiz çevirme", description: "Coin Master herkese açık çevirmelerini tarihe göre görün; doğrulanmış, incelemede, süresi dolmuş ve alınmış durumları ayrıdır.", intro: "Tarihe göre düzenlenmiş Coin Master çevirmeleri; süresi dolan teklifler kullanılabilir hediye olarak gösterilmez." },
  },
  "travel-town": {
    path: "/en/games/travel-town/",
    pt: { title: "Travel Town Free Energy Today – Links de Energia Grátis", h1: "Travel Town: energia grátis hoje", description: "Encontre links públicos de energia grátis do Travel Town, organizados por data, com deep links oficiais e status de confirmação honesto.", intro: "Links recentes de energia do Travel Town, convertidos para o deep link oficial quando o destino é reconhecido." },
    en: { title: "Travel Town Free Energy Today | Game Gifts", h1: "Travel Town Free Energy Today", description: "Find public Travel Town free energy links organized by date, with official deep links and honest confirmation status.", intro: "Recent Travel Town energy links, converted to the official deep link when the destination is recognized." },
    es: { title: "Energía Gratis Travel Town Hoy | Game Gifts", h1: "Energía gratis de Travel Town hoy", description: "Encuentra enlaces públicos de energía gratis de Travel Town organizados por fecha, con deep links oficiales y estado honesto.", intro: "Enlaces recientes de energía de Travel Town convertidos al deep link oficial cuando se reconoce el destino." },
    de: { title: "Travel Town Gratis-Energie Heute | Game Gifts", h1: "Travel Town Gratis-Energie heute", description: "Finde öffentliche Travel-Town-Energielinks nach Datum, mit offiziellen Deep Links und ehrlichem Bestätigungsstatus.", intro: "Aktuelle Travel-Town-Energielinks, zum offiziellen Deep Link umgewandelt, wenn das Ziel erkannt wird." },
    tr: { title: "Travel Town Ücretsiz Enerji Bugün | Game Gifts", h1: "Travel Town bugün ücretsiz enerji", description: "Travel Town ücretsiz enerji bağlantılarını tarihe göre bulun; resmi deep linkler ve dürüst doğrulama durumu gösterilir.", intro: "Hedef tanındığında resmi deep linke dönüştürülen güncel Travel Town enerji bağlantıları." },
  },
});
const GAME_SEO_PATHS = Object.freeze(Object.fromEntries(Object.entries(GAME_SEO).map(([slug, seo]) => [seo.path, slug])));
// This is the project's existing catalog, kept as a client-side recovery path
// for static/public deployments where /api/data is unavailable or incomplete.
// Every entry has a matching internal game page and an image already present
// in the project; it is not a second or invented game catalog.
const RECOVERED_GAME_CATALOG = Object.freeze([
  { name: "Match Masters", slug: "match-masters", description: "Competição rápida, desafios e recompensas para colecionar.", image: "/uploads/file_00000000f940820ea01aaadff3c7df3f.png" },
  { name: "Monopoly GO!", slug: "monopoly-go", description: "Dados grátis e links públicos de recompensa para sua próxima partida.", image: "/uploads/file_00000000ef9c820e8fb9420f35ff24fe.png" },
  { name: "Dice Dreams", slug: "dice-dreams", description: "Giros, construções e presentes para a sua próxima aventura.", image: "/uploads/file_000000003ac0820eadfbf26969ac6696.png" },
  { name: "Animals & Coins", slug: "animals-and-coins", description: "Energia grátis e recompensas públicas para sua ilha.", image: "/uploads/file_000000004e54820e93eb148e318275d9.png" },
  { name: "Family Island", slug: "family-island", description: "Energia e rubis em links públicos de recompensa.", image: "/uploads/file_000000006c3c820e8473c8451f119bd6.png" },
  { name: "Travel Town", slug: "travel-town", description: "Energia grátis e links públicos de recompensa atualizados.", image: "/uploads/file_000000003230820eb2ec324ed61264ac.png" },
  { name: "Gossip Harbor", slug: "gossip-harbor", description: "Energia grátis e links públicos para continuar sua história.", image: "/uploads/file_0000000006dc820ea058c6bef13ceba9.png" },
  { name: "Bingo Blitz", slug: "bingo-blitz", description: "Créditos e moedas em links públicos de recompensa.", image: "/uploads/file_000000003720820e9ce4d36eb34a5f9f-2.png" },
  { name: "Crazy Fox", slug: "crazy-fox", description: "Recompensas públicas para suas próximas partidas.", image: "/assets/logos/crazy-fox.svg" },
  { name: "Coin Master", slug: "coin-master", description: "Gire, construa e encontre novos links para sua vila.", image: "/uploads/file_0000000037b4820e8c10b3944507b647.png" },
  { name: "Roblox", slug: "roblox", description: "Experiências, novidades e presentes públicos para jogar mais.", image: "/assets/logos/roblox.svg" },
  { name: "Free Fire", slug: "free-fire", description: "Eventos e recompensas públicas para suas partidas.", image: "/assets/logos/free-fire.svg" },
  { name: "Stumble Guys", slug: "stumble-guys", description: "Eventos e recompensas públicas para suas próximas partidas.", image: "/assets/logos/stumble-guys.svg" },
  { name: "Lords Mobile", slug: "lords-mobile", description: "Presentes e recompensas públicas para seu reino.", image: "/assets/logos/lords-mobile.svg" },
  { name: "Clash of Clans", slug: "clash-of-clans", description: "Recompensas e novidades públicas para sua aldeia.", image: "/assets/logos/clash-of-clans.svg" },
  { name: "Solitaire Grand Harvest", slug: "solitaire-grand-harvest", description: "Moedas grátis e links públicos para sua coleção.", image: "/assets/logos/solitaire-grand-harvest.svg" },
  { name: "Board Kings", slug: "board-kings", description: "Rolls grátis e recompensas públicas para o seu tabuleiro.", image: "/assets/logos/board-kings.svg" },
  { name: "Seaside Escape", slug: "seaside-escape", description: "Energia grátis e recompensas públicas para sua aventura.", image: "/uploads/file_00000000c0f0820e8d1fe6ea7271e5cd.png" },
  { name: "Carnival Tycoon", slug: "carnival-tycoon", description: "Eventos e recompensas públicas para sua próxima partida.", image: "/assets/logos/carnival-tycoon.svg" },
]);
// Card-sized derivatives keep the existing artwork and the original files
// remain available for hero and detail-page artwork.
const OPTIMIZED_GAME_IMAGES = Object.freeze({
  "/uploads/file_00000000f940820ea01aaadff3c7df3f.png": "/uploads/optimized/match-masters.webp",
  "/uploads/file_00000000ef9c820e8fb9420f35ff24fe.png": "/uploads/optimized/monopoly-go.webp",
  "/uploads/file_000000003ac0820eadfbf26969ac6696.png": "/uploads/optimized/dice-dreams.webp",
  "/uploads/file_000000004e54820e93eb148e318275d9.png": "/uploads/optimized/animals-and-coins.webp",
  "/uploads/file_000000006c3c820e8473c8451f119bd6.png": "/uploads/optimized/family-island.webp",
  "/uploads/file_000000003230820eb2ec324ed61264ac.png": "/uploads/optimized/travel-town.webp",
  "/uploads/file_0000000006dc820ea058c6bef13ceba9.png": "/uploads/optimized/gossip-harbor.webp",
  "/uploads/file_000000003720820e9ce4d36eb34a5f9f-2.png": "/uploads/optimized/bingo-blitz.webp",
  "/uploads/file_0000000037b4820e8c10b3944507b647.png": "/uploads/optimized/coin-master.webp",
  "/uploads/file_00000000c0f0820e8d1fe6ea7271e5cd.png": "/uploads/optimized/seaside-escape.webp",
});
// Rewards never come from a hand-written client-side catalog. The fallback
// may use the maintained monitor snapshot below, but an unavailable snapshot
// must produce an empty list instead of inventing a gift.
const RECOVERED_REWARD_CATALOG = Object.freeze([]);
const GENERIC_GAME_SEO_COPY = Object.freeze({
  pt: {
    title: (name) => `${name} — Presentes e Recompensas | Game Gifts`,
    h1: (name) => `${name}: presentes e recompensas`,
    description: (name) => `Encontre links públicos de presentes e recompensas de ${name}, organizados por data no Game Gifts, com status de verificação claro.`,
    intro: (name) => `Links públicos de presentes e recompensas de ${name}, organizados por data e apresentados com o status informado para cada link.`,
  },
  en: {
    title: (name) => `${name} Gifts & Rewards | Game Gifts`,
    h1: (name) => `${name}: gifts and rewards`,
    description: (name) => `Find public ${name} gift and reward links organized by date on Game Gifts, with a clear verification status for each link.`,
    intro: (name) => `Public ${name} gift and reward links organized by date, with the reported status shown for each link.`,
  },
  es: {
    title: (name) => `${name} — Regalos y Recompensas | Game Gifts`,
    h1: (name) => `${name}: regalos y recompensas`,
    description: (name) => `Encuentra enlaces públicos de regalos y recompensas de ${name}, organizados por fecha en Game Gifts y con un estado de verificación claro.`,
    intro: (name) => `Enlaces públicos de regalos y recompensas de ${name}, organizados por fecha con el estado informado para cada enlace.`,
  },
  de: {
    title: (name) => `${name} — Geschenke und Belohnungen | Game Gifts`,
    h1: (name) => `${name}: Geschenke und Belohnungen`,
    description: (name) => `Finde öffentliche Geschenk- und Belohnungslinks für ${name}, nach Datum geordnet und mit klarem Prüfstatus auf Game Gifts.`,
    intro: (name) => `Öffentliche Geschenk- und Belohnungslinks für ${name}, nach Datum geordnet und mit dem gemeldeten Status jedes Links.`,
  },
  tr: {
    title: (name) => `${name} — Hediyeler ve Ödüller | Game Gifts`,
    h1: (name) => `${name}: hediyeler ve ödüller`,
    description: (name) => `${name} herkese açık hediye ve ödül bağlantılarını Game Gifts'te tarihe göre bulun; her bağlantının doğrulama durumu açıkça gösterilir.`,
    intro: (name) => `${name} herkese açık hediye ve ödül bağlantıları tarihe göre düzenlenir ve her bağlantının bildirilen durumu gösterilir.`,
  },
});
const HOME_SEO_DESCRIPTION = Object.freeze({
  pt: "Game Gifts reúne links públicos de presentes e recompensas para jogos mobile, com status claro de verificação.",
  en: "Game Gifts organizes public gift and reward links for mobile games, with a clear verification status.",
  es: "Game Gifts reúne enlaces públicos de regalos y recompensas para juegos móviles, con un estado de verificación claro.",
  de: "Game Gifts sammelt öffentliche Geschenk- und Belohnungslinks für Mobile Games mit klarem Prüfstatus.",
  tr: "Game Gifts, mobil oyunlar için herkese açık hediye ve ödül bağlantılarını doğrulama durumlarıyla düzenler.",
});
const PAGE_SEO = Object.freeze({
  pt: {
    home: { title: "Game Gifts | Presentes e Recompensas", description: HOME_SEO_DESCRIPTION.pt },
    games: { title: "Jogos com Presentes Grátis | Game Gifts", description: "Explore jogos mobile com links públicos de presentes e recompensas, organizados pelo Game Gifts." },
    news: { title: "Novidades de Recompensas | Game Gifts", description: "Veja os links públicos e as novidades recentes de recompensas para jogos mobile no Game Gifts." },
    more: { title: "Sobre o Game Gifts | Como Funciona", description: "Saiba como o Game Gifts organiza links públicos de presentes e recompensas para jogos mobile." },
    howTo: { title: "Como Resgatar Presentes | Game Gifts", description: "Aprenda a abrir links públicos, conferir o status e resgatar presentes de jogos no Game Gifts." },
    problems: { title: "Problemas com Presentes | Game Gifts", description: "Veja soluções para links expirados, jogos que não abrem e presentes que não aparecem no Game Gifts." },
    related: { title: "Jogos Relacionados | Game Gifts", description: "Explore outros jogos públicos acompanhados pelo Game Gifts e encontre presentes disponíveis." },
  },
  en: {
    home: { title: "Game Gifts | Free Rewards", description: HOME_SEO_DESCRIPTION.en },
    games: { title: "Mobile Games Gifts & Rewards | Game Gifts", description: "Explore mobile games with public gift and reward links organized by Game Gifts." },
    news: { title: "Reward Link Updates | Game Gifts", description: "See recent public reward links and updates for mobile games on Game Gifts." },
    more: { title: "About Game Gifts | How It Works", description: "Learn how Game Gifts organizes public gift and reward links for mobile games." },
    howTo: { title: "How to Redeem Gifts | Game Gifts", description: "Learn how to open public links, check status and redeem game gifts on Game Gifts." },
    problems: { title: "Gift Link Problems | Game Gifts", description: "Troubleshoot expired links, games that do not open and gifts that do not appear." },
    related: { title: "Related Games | Game Gifts", description: "Explore other public games followed by Game Gifts and find available gifts." },
  },
  es: {
    home: { title: "Game Gifts | Regalos y Recompensas", description: HOME_SEO_DESCRIPTION.es },
    games: { title: "Juegos con Regalos Gratis | Game Gifts", description: "Explora juegos móviles con enlaces públicos de regalos y recompensas organizados por Game Gifts." },
    news: { title: "Novedades de Recompensas | Game Gifts", description: "Consulta enlaces públicos y novedades recientes de recompensas para juegos móviles en Game Gifts." },
    more: { title: "Sobre Game Gifts | Cómo Funciona", description: "Descubre cómo Game Gifts organiza enlaces públicos de regalos y recompensas para juegos móviles." },
    howTo: { title: "Cómo reclamar regalos | Game Gifts", description: "Aprende a abrir enlaces públicos, comprobar su estado y reclamar regalos de juegos." },
    problems: { title: "Problemas con regalos | Game Gifts", description: "Soluciones para enlaces caducados, juegos que no abren y regalos que no aparecen." },
    related: { title: "Juegos relacionados | Game Gifts", description: "Explora otros juegos públicos acompañados por Game Gifts." },
  },
  de: {
    home: { title: "Game Gifts | Geschenke & Belohnungen", description: HOME_SEO_DESCRIPTION.de },
    games: { title: "Mobile Games mit Geschenken | Game Gifts", description: "Entdecke Mobile Games mit öffentlichen Geschenk- und Belohnungslinks, geordnet von Game Gifts." },
    news: { title: "Neuigkeiten zu Belohnungen | Game Gifts", description: "Sieh aktuelle öffentliche Belohnungslinks und Neuigkeiten für Mobile Games auf Game Gifts." },
    more: { title: "Über Game Gifts | So funktioniert es", description: "Erfahre, wie Game Gifts öffentliche Geschenk- und Belohnungslinks für Mobile Games organisiert." },
    howTo: { title: "Geschenke einlösen | Game Gifts", description: "Lerne, öffentliche Links zu öffnen, ihren Status zu prüfen und Spielgeschenke einzulösen." },
    problems: { title: "Probleme mit Geschenken | Game Gifts", description: "Lösungen für abgelaufene Links, nicht öffnende Spiele und fehlende Geschenke." },
    related: { title: "Verwandte Spiele | Game Gifts", description: "Entdecke weitere öffentliche Spiele im Game-Gifts-Katalog." },
  },
  tr: {
    home: { title: "Game Gifts | Hediyeler ve Ödüller", description: HOME_SEO_DESCRIPTION.tr },
    games: { title: "Ücretsiz Hediyeli Mobil Oyunlar | Game Gifts", description: "Game Gifts tarafından düzenlenen herkese açık hediye ve ödül bağlantılarına sahip mobil oyunları keşfedin." },
    news: { title: "Ödül Bağlantısı Yenilikleri | Game Gifts", description: "Game Gifts'te mobil oyunlar için güncel herkese açık ödül bağlantılarını ve yenilikleri görün." },
    more: { title: "Game Gifts Hakkında | Nasıl Çalışır", description: "Game Gifts'in mobil oyunlar için herkese açık hediye ve ödül bağlantılarını nasıl düzenlediğini öğrenin." },
    howTo: { title: "Hediyeler Nasıl Kullanılır | Game Gifts", description: "Herkese açık bağlantıları açmayı, durumu kontrol etmeyi ve oyun hediyelerini kullanmayı öğrenin." },
    problems: { title: "Hediye Bağlantısı Sorunları | Game Gifts", description: "Süresi dolan bağlantılar, açılmayan oyunlar ve görünmeyen hediyeler için çözümler." },
    related: { title: "İlgili Oyunlar | Game Gifts", description: "Game Gifts kataloğundaki diğer herkese açık oyunları keşfedin." },
  },
});
const COPY = {
  pt: { home: "Início", games: "Jogos", news: "Novidades", favorites: "Favoritos", more: "Mais", search: "Pesquisar jogos...", choose: "Escolha seu jogo", chooseCopy: "Encontre os links públicos verificados dos seus jogos mobile.", active: "links ativos", newToday: "novo hoje", noneToday: "Nenhum novo hoje", viewGames: "Ver jogos", today: "Presentes de hoje", recent: "Últimos dias", opened: "Já abertos", expired: "Expirados", confirmed: "CONFIRMADO", unconfirmed: "NÃO CONFIRMADO", expiredInvalid: "EXPIRADO / INVÁLIDO", unconfirmedReward: "Recompensa ainda não confirmada", unavailableReward: "Recompensa indisponível", verified: "Verificado", expiredStatus: "Expirado", pending: "Aguardando verificação", open: "ABRIR NO JOGO", openAgain: "ABRIR NOVAMENTE", copyLink: "Copiar link", alreadyOpened: "JÁ ABERTO", copied: "Link copiado", favorite: "Favoritar", unfavorite: "Remover dos favoritos", noRewards: "Nenhum presente verificado por aqui", noRewardsCopy: "Quando um link legítimo for cadastrado e verificado, ele aparecerá nesta área.", noGames: "Nenhum jogo encontrado", noGamesCopy: "Tente buscar por outro nome.", allNews: "Novidades", newsCopy: "Links verificados adicionados recentemente em todos os jogos.", noNews: "Nenhuma novidade ainda", noNewsCopy: "Os links novos aparecem aqui assim que forem cadastrados e verificados.", about: "Mais sobre o Game Gifts", aboutCopy: "Um portal independente que organiza links públicos de presentes e recompensas. O site não entrega recompensas e não pede login para abrir um link.", how: "Como funciona", howItems: ["Escolha um jogo", "Confira o presente verificado", "Toque em Abrir no jogo"], admin: "Admin central", adminCopy: "Área reservada ao proprietário do projeto para cadastrar jogos e links.", faq: "Sobre e FAQ", disclaimer: "Site independente de agregação de links. As marcas e jogos pertencem aos seus respectivos proprietários. Não somos afiliados aos desenvolvedores dos jogos.", allGames: "Todos os jogos", lastAdded: "Adicionado", dateLinks: "links", selectDate: "Escolha uma data para ver os presentes.", backHistory: "Voltar ao histórico", noOpened: "Você ainda não abriu presentes", noOpenedCopy: "Os links que você abrir neste dispositivo aparecerão aqui." },
  en: { home: "Home", games: "Games", news: "News", favorites: "Favorites", more: "More", search: "Search games...", choose: "Choose your game", chooseCopy: "Find verified public links for your favorite mobile games.", active: "active links", newToday: "new today", noneToday: "None new today", viewGames: "View games", today: "Today's gifts", recent: "Last days", opened: "Opened", expired: "Expired", confirmed: "CONFIRMED", unconfirmed: "NOT CONFIRMED", expiredInvalid: "EXPIRED / INVALID", unconfirmedReward: "Reward not confirmed", unavailableReward: "Reward unavailable", verified: "Verified", expiredStatus: "Expired", pending: "Awaiting verification", open: "OPEN IN GAME", openAgain: "OPEN AGAIN", copyLink: "Copy link", alreadyOpened: "ALREADY OPENED", copied: "Link copied", favorite: "Favorite", unfavorite: "Remove favorite", noRewards: "No verified gifts here", noRewardsCopy: "When a legitimate link is added and verified, it will appear here.", noGames: "No games found", noGamesCopy: "Try another search.", allNews: "News", newsCopy: "Recently added verified links across all games.", noNews: "No news yet", noNewsCopy: "New links appear here after they are added and verified.", about: "About Game Gifts", aboutCopy: "An independent portal that organizes public gift and reward links. The site does not deliver rewards and never requires a login to open a link.", how: "How it works", howItems: ["Choose a game", "Check the verified gift", "Tap Open in game"], admin: "Central admin", adminCopy: "Reserved for the project owner to manage games and links.", faq: "About & FAQ", disclaimer: "Independent link aggregation site. All brands and games belong to their respective owners. We are not affiliated with game developers.", allGames: "All games", lastAdded: "Added", dateLinks: "links", selectDate: "Choose a date to see its gifts.", backHistory: "Back to history", noOpened: "No gifts opened yet", noOpenedCopy: "Links you open on this device will appear here." },
  de: { home: "Start", games: "Spiele", news: "Neuigkeiten", favorites: "Favoriten", more: "Mehr", search: "Spiele suchen...", choose: "Spiel auswählen", chooseCopy: "Finde verifizierte öffentliche Links für deine Mobile Games.", active: "aktive Links", newToday: "neu heute", noneToday: "Heute nichts Neues", viewGames: "Spiele ansehen", today: "Geschenke heute", recent: "Letzte Tage", opened: "Geöffnet", expired: "Abgelaufen", confirmed: "BESTÄTIGT", unconfirmed: "NICHT BESTÄTIGT", expiredInvalid: "ABGELAUFEN / UNGÜLTIG", unconfirmedReward: "Belohnung nicht bestätigt", unavailableReward: "Belohnung nicht verfügbar", verified: "Verifiziert", expiredStatus: "Abgelaufen", pending: "Überprüfung ausstehend", open: "IM SPIEL ÖFFNEN", openAgain: "ERNEUT ÖFFNEN", copyLink: "Link kopieren", alreadyOpened: "BEREITS GEÖFFNET", copied: "Link kopiert", favorite: "Favorisieren", unfavorite: "Favorit entfernen", noRewards: "Keine verifizierten Geschenke", noRewardsCopy: "Verifizierte, legitime Links erscheinen hier nach ihrer Veröffentlichung.", noGames: "Keine Spiele gefunden", noGamesCopy: "Versuche einen anderen Namen.", allNews: "Neuigkeiten", newsCopy: "Kürzlich hinzugefügte verifizierte Links aus allen Spielen.", noNews: "Noch keine Neuigkeiten", noNewsCopy: "Neue Links erscheinen hier nach der Prüfung.", about: "Über Game Gifts", aboutCopy: "Ein unabhängiges Portal für öffentliche Geschenk- und Belohnungslinks. Die Seite liefert keine Belohnungen und benötigt zum Öffnen keinen Login.", how: "So funktioniert es", howItems: ["Spiel auswählen", "Verifiziertes Geschenk prüfen", "Im Spiel öffnen antippen"], admin: "Zentrale Verwaltung", adminCopy: "Für den Projektinhaber zum Verwalten von Spielen und Links.", faq: "Über & FAQ", disclaimer: "Unabhängiges Portal zur Sammlung von Links. Marken und Spiele gehören ihren jeweiligen Eigentümern. Keine Verbindung zu Spieleentwicklern.", allGames: "Alle Spiele", lastAdded: "Hinzugefügt", dateLinks: "Links", selectDate: "Wähle ein Datum, um die Geschenke zu sehen.", backHistory: "Zurück zum Verlauf", noOpened: "Noch keine Geschenke geöffnet", noOpenedCopy: "Auf diesem Gerät geöffnete Links erscheinen hier." },
  tr: { home: "Ana Sayfa", games: "Oyunlar", news: "Yenilikler", favorites: "Favoriler", more: "Daha fazla", search: "Oyun ara...", choose: "Oyununuzu seçin", chooseCopy: "Favori mobil oyunlarınız için doğrulanmış herkese açık bağlantılar.", active: "aktif bağlantı", newToday: "bugün yeni", noneToday: "Bugün yeni yok", viewGames: "Oyunları gör", today: "Bugünün hediyeleri", recent: "Son günler", opened: "Açılanlar", expired: "Süresi dolanlar", confirmed: "DOĞRULANDI", unconfirmed: "DOĞRULANMADI", expiredInvalid: "SÜRESİ DOLDU / GEÇERSİZ", unconfirmedReward: "Ödül doğrulanmadı", unavailableReward: "Ödül mevcut değil", verified: "Doğrulandı", expiredStatus: "Süresi doldu", pending: "Doğrulama bekliyor", open: "OYUNDA AÇ", openAgain: "TEKRAR AÇ", copyLink: "Bağlantıyı kopyala", alreadyOpened: "ZATEN AÇILDI", copied: "Bağlantı kopyalandı", favorite: "Favorile", unfavorite: "Favoriden çıkar", noRewards: "Doğrulanmış hediye yok", noRewardsCopy: "Meşru bir bağlantı eklenip doğrulandığında burada görünür.", noGames: "Oyun bulunamadı", noGamesCopy: "Başka bir ad deneyin.", allNews: "Yenilikler", newsCopy: "Tüm oyunlarda yakın zamanda eklenen doğrulanmış bağlantılar.", noNews: "Henüz yenilik yok", noNewsCopy: "Yeni bağlantılar eklendikten ve doğrulandıktan sonra burada görünür.", about: "Game Gifts hakkında", aboutCopy: "Herkese açık hediye ve ödül bağlantılarını düzenleyen bağımsız portal. Site ödül vermez ve bağlantıyı açmak için giriş istemez.", how: "Nasıl çalışır", howItems: ["Bir oyun seç", "Doğrulanmış hediyeyi kontrol et", "Oyunda aç'a dokun"], admin: "Merkezi yönetim", adminCopy: "Proje sahibi için oyunları ve bağlantıları yönetme alanı.", faq: "Hakkında & SSS", disclaimer: "Bağımsız bağlantı toplama sitesi. Markalar ve oyunlar ilgili sahiplerine aittir. Oyun geliştiricileriyle bağlantımız yoktur.", allGames: "Tüm oyunlar", lastAdded: "Eklenme", dateLinks: "bağlantı", selectDate: "Hediyeleri görmek için bir tarih seçin.", backHistory: "Geçmişe dön", noOpened: "Henüz hediye açılmadı", noOpenedCopy: "Bu cihazda açtığınız bağlantılar burada görünür." },
};
COPY.es = { ...COPY.en, home: "Inicio", games: "Juegos", news: "Novedades", favorites: "Favoritos", more: "Más", search: "Buscar juegos...", choose: "Elige tu juego", chooseCopy: "Encuentra enlaces públicos verificados para tus juegos móviles.", active: "enlaces activos", newToday: "nuevo hoy", noneToday: "Ninguno nuevo hoy", viewGames: "Ver juegos", today: "Regalos de hoy", recent: "Últimos días", opened: "Ya abiertos", expired: "Expirados", confirmed: "CONFIRMADO", unconfirmed: "NO CONFIRMADO", expiredInvalid: "EXPIRADO / INVÁLIDO", unconfirmedReward: "Recompensa no confirmada", unavailableReward: "Recompensa no disponible", open: "ABRIR EN EL JUEGO", openAgain: "ABRIR DE NUEVO", copyLink: "Copiar enlace", alreadyOpened: "YA ABIERTO", copied: "Enlace copiado", noRewards: "Ningún regalo confirmado", noRewardsCopy: "Los enlaces legítimos aparecen aquí después de su confirmación.", noGames: "No se encontraron juegos", noGamesCopy: "Prueba otra búsqueda.", allNews: "Novedades", newsCopy: "Enlaces confirmados añadidos recientemente en todos los juegos.", noNews: "Aún no hay novedades", noNewsCopy: "Los enlaces nuevos aparecen después de ser añadidos y confirmados.", about: "Sobre Game Gifts", aboutCopy: "Un portal independiente que organiza enlaces públicos de regalos y recompensas.", how: "Cómo funciona", howItems: ["Elige un juego", "Revisa el regalo confirmado", "Toca Abrir en el juego"], admin: "Administración central", adminCopy: "Área reservada al propietario para gestionar juegos y enlaces.", faq: "Sobre y preguntas frecuentes", disclaimer: "Sitio independiente de recopilación de enlaces. Las marcas y juegos pertenecen a sus propietarios.", allGames: "Todos los juegos", lastAdded: "Añadido", dateLinks: "enlaces", selectDate: "Elige una fecha para ver los regalos.", backHistory: "Volver al historial", noOpened: "Aún no has abierto regalos", noOpenedCopy: "Los enlaces que abras en este dispositivo aparecerán aquí." };
Object.assign(COPY.pt, { guides: "Guias", codes: "Códigos", events: "Eventos", search: "Buscar jogo, presente, código, guia..." });
Object.assign(COPY.en, { guides: "Guides", codes: "Codes", events: "Events", search: "Search game, gift, code, guide..." });
Object.assign(COPY.es, { guides: "Guías", codes: "Códigos", events: "Eventos", search: "Buscar juego, regalo, código, guía..." });
Object.assign(COPY.de, { guides: "Guides", codes: "Codes", events: "Events", search: "Spiel, Geschenk, Code, Guide suchen..." });
Object.assign(COPY.tr, { guides: "Rehberler", codes: "Kodlar", events: "Etkinlikler", search: "Oyun, hediye, kod, rehber ara..." });

Object.assign(COPY.pt, { yesterday: "Ontem", previous: "Anteriores", source: "Fonte pública monitorada", sourceLabel: "Fonte", cadence: "Atualização", rewardTypes: "Tipos de recompensa", note: "Abrir o app não confirma o recebimento.", linksMode: "LINKS", codesMode: "CÓDIGOS", noneMode: "SEM RECOMPENSA DISPONÍVEL", noRewardNow: "Nenhuma recompensa disponível no momento.", noCodeNow: "Nenhum código confirmado no momento.", officialRedeem: "Resgatar código", copyCode: "COPIAR CÓDIGO", copiedCode: "Código copiado", codeReward: "CÓDIGO DE RECOMPENSA", unknownSource: "Fonte original ainda não identificada", code: "Código" });
Object.assign(COPY.pt, { news: "Notícias", allNews: "Acabou de chegar", newsCopy: "Links, códigos e recompensas reais mais recentes." });
Object.assign(COPY.en, { yesterday: "Yesterday", previous: "Earlier", source: "Public source monitored", sourceLabel: "Source", cadence: "Updates", rewardTypes: "Reward types", note: "Opening the app does not confirm delivery.", linksMode: "LINKS", codesMode: "CODES", noneMode: "NO REWARD AVAILABLE", noRewardNow: "No reward available at the moment.", noCodeNow: "No confirmed code at the moment.", officialRedeem: "REDEEM CODE", copyCode: "COPY CODE", copiedCode: "Code copied", codeReward: "REWARD CODE", unknownSource: "Original source not identified yet", code: "Code" });
Object.assign(COPY.es, { yesterday: "Ayer", previous: "Anteriores", source: "Fuente pública monitorizada", cadence: "Actualización", rewardTypes: "Tipos de recompensa", note: "Abrir la app no confirma la recepción.", linksMode: "ENLACES", codesMode: "CÓDIGOS", noneMode: "SIN RECOMPENSA DISPONIBLE", noRewardNow: "Ninguna recompensa disponible por el momento.", noCodeNow: "Ningún código confirmado por el momento.", officialRedeem: "CANJEAR CÓDIGO", copyCode: "COPIAR CÓDIGO", codeReward: "CÓDIGO DE RECOMPENSA", unknownSource: "Fuente original aún no identificada", code: "Código" });
Object.assign(COPY.de, { yesterday: "Gestern", previous: "Früher", source: "Öffentliche Quelle überwacht", cadence: "Aktualisierung", rewardTypes: "Belohnungstypen", note: "Das Öffnen der App bestätigt den Erhalt nicht.", linksMode: "LINKS", codesMode: "CODES", noneMode: "KEINE BELOHNUNG VERFÜGBAR", noRewardNow: "Momentan keine Belohnung verfügbar.", noCodeNow: "Momentan kein bestätigter Code.", officialRedeem: "CODE EINLÖSEN", copyCode: "CODE KOPIEREN", codeReward: "BELOHNUNGSCODE", unknownSource: "Originalquelle noch nicht identifiziert", code: "Code" });
Object.assign(COPY.tr, { yesterday: "Dün", previous: "Öncekiler", source: "İzlenen herkese açık kaynak", cadence: "Güncelleme", rewardTypes: "Ödül türleri", note: "Uygulamayı açmak ödülün geldiğini doğrulamaz.", linksMode: "BAĞLANTILAR", codesMode: "KODLAR", noneMode: "ÖDÜL YOK", noRewardNow: "Şu anda ödül bulunmuyor.", noCodeNow: "Şu anda doğrulanmış kod yok.", officialRedeem: "KODU KULLAN", copyCode: "KODU KOPYALA", codeReward: "ÖDÜL KODU", unknownSource: "Orijinal kaynak henüz belirlenmedi", code: "Kod" });
Object.assign(COPY.pt, { matchMastersGift: "Presente do Match Masters", identifiedType: "Tipo identificado", matchMastersPolicy: "Links recém-coletados ficam como NÃO CONFIRMADO. Abrir o jogo não confirma a recompensa; “já usado” pode depender da conta.", messengerExclusive: "EXCLUSIVO DO FACEBOOK MESSENGER", messengerExclusiveNote: "Este link exige resgate dentro do Facebook Messenger; abrir o jogo sozinho não confirma o prêmio.", manualRequiresFacebook: "EXCLUSIVO DO FACEBOOK MESSENGER", manualRecognized: "LINK RECONHECIDO / VÁLIDO", manualUsedNote: "Prêmio desconhecido; “já usado” pode depender da conta de teste.", manualFacebookNote: "Este link exige resgate dentro do Facebook Messenger; o prêmio ainda não foi identificado.", manualSurprise: "RECOMPENSA SURPRESA" });
Object.assign(COPY.en, { matchMastersGift: "Match Masters gift", identifiedType: "Identified type", matchMastersPolicy: "Newly collected links stay NOT CONFIRMED. Opening the game does not confirm a reward; “already used” may depend on the account.", messengerExclusive: "FACEBOOK MESSENGER ONLY", messengerExclusiveNote: "This link requires redemption inside Facebook Messenger; opening the game alone does not confirm delivery.", manualRequiresFacebook: "FACEBOOK MESSENGER ONLY", manualRecognized: "LINK RECOGNIZED / VALID", manualUsedNote: "Prize unknown; “already used” may depend on the test account.", manualFacebookNote: "This link requires redemption inside Facebook Messenger; the prize is not identified yet.", manualSurprise: "SURPRISE REWARD" });
Object.assign(COPY.es, { matchMastersGift: "Regalo de Match Masters", identifiedType: "Tipo identificado", matchMastersPolicy: "Los enlaces recién recopilados quedan como NO CONFIRMADOS. Abrir el juego no confirma la recompensa; “ya usado” puede depender de la cuenta.", messengerExclusive: "EXCLUSIVO DE FACEBOOK MESSENGER", messengerExclusiveNote: "Este enlace requiere canjear dentro de Facebook Messenger; abrir el juego por sí solo no confirma el premio.", manualRequiresFacebook: "EXCLUSIVO DE FACEBOOK MESSENGER", manualRecognized: "ENLACE RECONOCIDO / VÁLIDO", manualUsedNote: "Premio desconocido; “ya usado” puede depender de la cuenta de prueba.", manualFacebookNote: "Este enlace requiere canjear dentro de Facebook Messenger; el premio aún no está identificado.", manualSurprise: "RECOMPENSA SORPRESA" });
Object.assign(COPY.de, { matchMastersGift: "Match-Masters-Geschenk", identifiedType: "Erkannter Typ", matchMastersPolicy: "Neu gesammelte Links bleiben NICHT BESTÄTIGT. Das Öffnen des Spiels bestätigt keine Belohnung; „bereits verwendet“ kann vom Konto abhängen.", messengerExclusive: "NUR ÜBER FACEBOOK MESSENGER", messengerExclusiveNote: "Dieser Link muss in Facebook Messenger eingelöst werden; das Öffnen des Spiels allein bestätigt keine Belohnung.", manualRequiresFacebook: "NUR ÜBER FACEBOOK MESSENGER", manualRecognized: "LINK ERKANNT / GÜLTIG", manualUsedNote: "Belohnung unbekannt; „bereits verwendet“ kann vom Testkonto abhängen.", manualFacebookNote: "Dieser Link erfordert Facebook Messenger; die Belohnung ist noch nicht identifiziert.", manualSurprise: "ÜBERRASCHUNGSBELOHNUNG" });
Object.assign(COPY.tr, { matchMastersGift: "Match Masters hediyesi", identifiedType: "Belirlenen tür", matchMastersPolicy: "Yeni toplanan bağlantılar DOĞRULANMADI olarak kalır. Oyunu açmak ödülü doğrulamaz; “zaten kullanıldı” hesapla ilgili olabilir.", messengerExclusive: "YALNIZCA FACEBOOK MESSENGER", messengerExclusiveNote: "Bu bağlantı Facebook Messenger içinde kullanılmalıdır; oyunu açmak tek başına ödülü doğrulamaz.", manualRequiresFacebook: "YALNIZCA FACEBOOK MESSENGER", manualRecognized: "BAĞLANTI TANINDI / GEÇERLİ", manualUsedNote: "Ödül bilinmiyor; “zaten kullanıldı” test hesabına bağlı olabilir.", manualFacebookNote: "Bu bağlantı Facebook Messenger gerektirir; ödül henüz belirlenmedi.", manualSurprise: "SÜRPRİZ ÖDÜL" });
Object.assign(COPY.pt, { manualInvalid: "LINK INVÁLIDO", manualConfirmed30: "QUANTIDADE CONFIRMADA: 30", manualConfirmedX2: "QUANTIDADE CONFIRMADA: x2" });
Object.assign(COPY.en, { manualInvalid: "INVALID LINK", manualConfirmed30: "CONFIRMED QUANTITY: 30", manualConfirmedX2: "CONFIRMED QUANTITY: x2" });
Object.assign(COPY.es, { manualInvalid: "ENLACE INVÁLIDO", manualConfirmed30: "CANTIDAD CONFIRMADA: 30", manualConfirmedX2: "CANTIDAD CONFIRMADA: x2" });
Object.assign(COPY.de, { manualInvalid: "UNGÜLTIGER LINK", manualConfirmed30: "BESTÄTIGTE MENGE: 30", manualConfirmedX2: "BESTÄTIGTE MENGE: x2" });
Object.assign(COPY.tr, { manualInvalid: "GEÇERSİZ BAĞLANTI", manualConfirmed30: "DOĞRULANAN MİKTAR: 30", manualConfirmedX2: "DOĞRULANAN MİKTAR: x2" });
Object.assign(COPY.pt, { yesterdayCtaCopy: "Você pode ter deixado algum para trás", yesterdayCtaAction: "VER TODOS" });
Object.assign(COPY.en, { yesterdayCtaCopy: "You may have missed one", yesterdayCtaAction: "VIEW ALL" });
Object.assign(COPY.es, { yesterdayCtaCopy: "Puede que te hayas dejado alguno", yesterdayCtaAction: "VER TODOS" });
Object.assign(COPY.de, { yesterdayCtaCopy: "Vielleicht hast du eines verpasst", yesterdayCtaAction: "ALLE ANSEHEN" });
Object.assign(COPY.tr, { yesterdayCtaCopy: "Bazılarını kaçırmış olabilirsiniz", yesterdayCtaAction: "TÜMÜNÜ GÖR" });
Object.assign(COPY.pt, { confirmed: "RECOMPENSA CONFIRMADA", expiredInvalid: "EXPIRADO", problemUnconfirmed: "LINK COM PROBLEMA / NÃO CONFIRMADO", problemAction: "Link com problema", confirmedRewards: "recompensas confirmadas", verificationLinks: "links recentes em verificação", confirmedShort: "confirmadas", verificationShort: "em verificação", newsCopy: "Eventos, temporadas e mudanças relevantes do jogo. Presentes ficam na aba Presentes." });
Object.assign(COPY.en, { confirmed: "REWARD CONFIRMED", expiredInvalid: "EXPIRED", problemUnconfirmed: "LINK WITH PROBLEM / NOT CONFIRMED", problemAction: "Problem link", confirmedRewards: "confirmed rewards", verificationLinks: "recent links in verification", confirmedShort: "confirmed", verificationShort: "in verification", newsCopy: "Events, seasons and meaningful game changes. Gifts stay in the Gifts tab." });
Object.assign(COPY.es, { confirmed: "RECOMPENSA CONFIRMADA", expiredInvalid: "EXPIRADO", problemUnconfirmed: "ENLACE CON PROBLEMA / NO CONFIRMADO", problemAction: "Enlace con problema", confirmedRewards: "recompensas confirmadas", verificationLinks: "enlaces recientes en verificación", confirmedShort: "confirmadas", verificationShort: "en verificación", newsCopy: "Eventos, temporadas y cambios relevantes del juego. Los regalos quedan en Regalos." });
Object.assign(COPY.de, { confirmed: "BELOHNUNG BESTÄTIGT", expiredInvalid: "ABGELAUFEN", problemUnconfirmed: "PROBLEMLINK / NICHT BESTÄTIGT", problemAction: "Problemlink", confirmedRewards: "bestätigte Belohnungen", verificationLinks: "kürzliche Links in Prüfung", confirmedShort: "bestätigt", verificationShort: "in Prüfung", newsCopy: "Events, Saisons und wichtige Spieländerungen. Geschenke bleiben unter Geschenke." });
Object.assign(COPY.tr, { confirmed: "ÖDÜL DOĞRULANDI", expiredInvalid: "SÜRESİ DOLDU", problemUnconfirmed: "SORUNLU BAĞLANTI / DOĞRULANMADI", problemAction: "Sorunlu bağlantı", confirmedRewards: "doğrulanmış ödül", verificationLinks: "doğrulamadaki son bağlantılar", confirmedShort: "doğrulandı", verificationShort: "doğrulamada", newsCopy: "Etkinlikler, sezonlar ve önemli oyun değişiklikleri. Hediyeler Hediyeler sekmesinde kalır." });
Object.assign(COPY.pt, { noNews: "Nenhuma novidade real publicada", noNewsCopy: "Eventos e mudanças só aparecem aqui quando houver informação editorial confiável." });
Object.assign(COPY.en, { noNews: "No real news published", noNewsCopy: "Events and changes appear here only when reliable editorial information is available." });
Object.assign(COPY.es, { noNews: "No hay novedades reales publicadas", noNewsCopy: "Los eventos y cambios aparecen aquí solo con información editorial confiable." });
Object.assign(COPY.de, { noNews: "Noch keine echten News", noNewsCopy: "Events und Änderungen erscheinen hier nur mit verlässlichen redaktionellen Informationen." });
Object.assign(COPY.tr, { noNews: "Gerçek yenilik yayınlanmadı", noNewsCopy: "Etkinlikler ve değişiklikler yalnızca güvenilir editoryal bilgi olduğunda burada görünür." });
Object.assign(COPY.pt, { giftItem: "Presente" });
Object.assign(COPY.en, { giftItem: "Gift" });
Object.assign(COPY.es, { giftItem: "Regalo" });
Object.assign(COPY.de, { giftItem: "Geschenk" });
Object.assign(COPY.tr, { giftItem: "Hediye" });
Object.assign(COPY.pt, { availableGift: "presente disponível", availableGifts: "presentes disponíveis", verificationGifts: "links em verificação", noNewGift: "SEM PRESENTE NOVO", autoSearching: "Procurando novos links automaticamente", noNewGiftTitle: "🎁 Nenhum presente novo agora", noNewGiftCopy: "Estamos procurando novas recompensas automaticamente. Volte em breve." });
Object.assign(COPY.en, { availableGift: "gift available", availableGifts: "gifts available", verificationGifts: "links in verification", noNewGift: "NO NEW GIFT", autoSearching: "Searching for new links automatically", noNewGiftTitle: "🎁 No new gift right now", noNewGiftCopy: "We are automatically looking for new rewards. Check back soon." });
Object.assign(COPY.es, { availableGift: "regalo disponible", availableGifts: "regalos disponibles", verificationGifts: "enlaces en verificación", noNewGift: "SIN REGALO NUEVO", autoSearching: "Buscando nuevos enlaces automáticamente", noNewGiftTitle: "🎁 Ningún regalo nuevo ahora", noNewGiftCopy: "Estamos buscando nuevas recompensas automáticamente. Vuelve pronto." });
Object.assign(COPY.de, { availableGift: "verfügbares Geschenk", availableGifts: "verfügbare Geschenke", verificationGifts: "Links in Prüfung", noNewGift: "KEIN NEUES GESCHENK", autoSearching: "Neue Links werden automatisch gesucht", noNewGiftTitle: "🎁 Jetzt kein neues Geschenk", noNewGiftCopy: "Wir suchen automatisch nach neuen Belohnungen. Schau bald wieder vorbei." });
Object.assign(COPY.tr, { availableGift: "kullanılabilir hediye", availableGifts: "kullanılabilir hediyeler", verificationGifts: "incelemedeki bağlantılar", noNewGift: "YENİ HEDİYE YOK", autoSearching: "Yeni bağlantılar otomatik olarak aranıyor", noNewGiftTitle: "🎁 Şu anda yeni hediye yok", noNewGiftCopy: "Yeni ödülleri otomatik olarak arıyoruz. Yakında tekrar bakın." });
Object.assign(COPY.pt, { lastUpdate: "Última atualização", seoToday: "Hoje", seoYesterday: "Ontem", seoEarlier: "Anteriores" });
Object.assign(COPY.en, { lastUpdate: "Last updated", seoToday: "Today", seoYesterday: "Yesterday", seoEarlier: "Earlier" });
Object.assign(COPY.es, { lastUpdate: "Última actualización", seoToday: "Hoy", seoYesterday: "Ayer", seoEarlier: "Anteriores" });
Object.assign(COPY.de, { lastUpdate: "Zuletzt aktualisiert", seoToday: "Heute", seoYesterday: "Gestern", seoEarlier: "Früher" });
Object.assign(COPY.tr, { lastUpdate: "Son güncelleme", seoToday: "Bugün", seoYesterday: "Dün", seoEarlier: "Öncekiler" });
Object.assign(COPY.pt, { playerUnconfirmed: "RECOMPENSA NÃO CONFIRMADA", playerConfirmed: "CONFIRMADO POR JOGADORES", playerMayExpired: "PODE ESTAR EXPIRADO", playerWorked: "FUNCIONOU", playerFailed: "NÃO FUNCIONOU", playerAlreadyVoted: "Você já votou neste jogo.", playerWorkedCount: (count) => `${count} ${count === 1 ? "pessoa disse que funcionou" : "pessoas disseram que funcionou"}`, playerFailedCount: (count) => `${count} ${count === 1 ? "pessoa disse que não funcionou" : "pessoas disseram que não funcionou"}`, voteSaved: "Voto registrado." });
Object.assign(COPY.en, { playerUnconfirmed: "REWARD NOT CONFIRMED", playerConfirmed: "CONFIRMED BY PLAYERS", playerMayExpired: "MAY BE EXPIRED", playerWorked: "WORKED", playerFailed: "DIDN'T WORK", playerAlreadyVoted: "You already voted for this game.", playerWorkedCount: (count) => `${count} ${count === 1 ? "person said it worked" : "people said it worked"}`, playerFailedCount: (count) => `${count} ${count === 1 ? "person said it didn't work" : "people said it didn't work"}`, voteSaved: "Vote recorded." });
Object.assign(COPY.es, { playerUnconfirmed: "RECOMPENSA NO CONFIRMADA", playerConfirmed: "CONFIRMADO POR JUGADORES", playerMayExpired: "PUEDE ESTAR CADUCADO", playerWorked: "FUNCIONÓ", playerFailed: "NO FUNCIONÓ", playerAlreadyVoted: "Ya votaste en este juego.", playerWorkedCount: (count) => `${count} ${count === 1 ? "persona dijo que funcionó" : "personas dijeron que funcionó"}`, playerFailedCount: (count) => `${count} ${count === 1 ? "persona dijo que no funcionó" : "personas dijeron que no funcionó"}`, voteSaved: "Voto registrado." });
Object.assign(COPY.de, { playerUnconfirmed: "BELOHNUNG NICHT BESTÄTIGT", playerConfirmed: "VON SPIELERN BESTÄTIGT", playerMayExpired: "KÖNNTE ABGELAUFEN SEIN", playerWorked: "FUNKTIONIERTE", playerFailed: "FUNKTIONIERTE NICHT", playerAlreadyVoted: "Du hast für dieses Spiel bereits abgestimmt.", playerWorkedCount: (count) => `${count} ${count === 1 ? "Person sagt, es funktioniert" : "Personen sagen, es funktioniert"}`, playerFailedCount: (count) => `${count} ${count === 1 ? "Person sagt, es funktioniert nicht" : "Personen sagen, es funktioniert nicht"}`, voteSaved: "Stimme gespeichert." });
Object.assign(COPY.tr, { playerUnconfirmed: "ÖDÜL DOĞRULANMADI", playerConfirmed: "OYUNCULAR TARAFINDAN DOĞRULANDI", playerMayExpired: "SÜRESİ DOLMUŞ OLABİLİR", playerWorked: "ÇALIŞTI", playerFailed: "ÇALIŞMADI", playerAlreadyVoted: "Bu oyun için zaten oy verdiniz.", playerWorkedCount: (count) => `${count} ${count === 1 ? "kişi çalıştığını söyledi" : "kişi çalıştığını söyledi"}`, playerFailedCount: (count) => `${count} ${count === 1 ? "kişi çalışmadığını söyledi" : "kişi çalışmadığını söyledi"}`, voteSaved: "Oy kaydedildi." });

const CATALOG_PROFILE = {
  "match-masters": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/match-masters-freebies-links-updated-daily/", cadence: "diária / várias vezes por dia", types: "boosters · coins" },
  "dice-dreams": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/free-dice-dreams-rolls-links-updated-daily/", cadence: "diária / várias vezes por dia", types: "dice rolls" },
  "coin-master": { source: "Pocket Tactics", sourceUrl: "https://www.pockettactics.com/coin-master/free-spins", cadence: "diária / várias vezes por dia", types: "spins · coins" },
  "monopoly-go": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/free-monopoly-go-dice/", cadence: "diária", types: "dice" },
  "animals-and-coins": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/free-animals-coins-energy-updated-daily/", cadence: "diária", types: "energy" },
  "travel-town": { source: "Travel Town Card", sourceUrl: "https://traveltowncard.com/blog/how-to-get-travel-town-free-energy", cadence: "diária / várias vezes por dia", types: "energy" },
  "family-island": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/free-family-island-energy-links-updated-daily/", cadence: "diária", types: "energy · rubies" },
  "domino-dreams": { source: "The Game Reward", sourceUrl: "https://thegamereward.com/domino-dreams/", cadence: "recorrente", types: "coins" },
  "bingo-blitz": { source: "Rewavio", sourceUrl: "https://rewavio.com/blog/bingo-blitz", cadence: "diária", types: "credits · coins" },
  "solitaire-grand-harvest": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/free-solitaire-grand-harvest-coins-links-updated-daily/", cadence: "diária", types: "coins" },
  "board-kings": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/free-board-kings-rolls-links-updated-daily/", cadence: "diária", types: "rolls" },
  "gossip-harbor": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/free-gossip-harbor-energy-links-updated-daily/", cadence: "diária", types: "energy" },
  "seaside-escape": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/free-seaside-escape-energy-links-updated-daily/", cadence: "diária", types: "energy" },
  "crazy-fox": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/free-crazy-fox-spins-and-coins-links-updated-daily/", cadence: "recorrente", types: "spins · coins" },
  "roblox": { source: "Roblox Support", sourceUrl: "https://en.help.roblox.com/hc/en-us/articles/360029650831-How-Do-I-Redeem-a-Promo-Code", cadence: "quando publicado oficialmente", types: "itens promocionais" },
  "free-fire": { source: "Garena", sourceUrl: "https://reward.ff.garena.com/", cadence: "eventual", types: "códigos de resgate" },
  "ea-sports-fc-mobile": { source: "EA SPORTS", sourceUrl: "https://redeem.fcm.ea.com/", cadence: "eventual", types: "gems · coins · packs" },
  "block-blast": { source: "Sistema público não confirmado", sourceUrl: "", cadence: "não confirmado", types: "—" },
  "subway-surfers": { source: "Sistema público não confirmado", sourceUrl: "", cadence: "não confirmado", types: "—" },
  "ludo-king": { source: "Sistema público não confirmado", sourceUrl: "", cadence: "não confirmado", types: "—" },
  "mobile-legends-bang-bang": { source: "Sistema público não confirmado", sourceUrl: "", cadence: "não confirmado", types: "—" },
};
const CENTRAL_COPY = {
  pt: { title: "Central do jogo", copy: "Guias curtos, dicas honestas e informações úteis.", rewards: "🎁 PRESENTES", guides: "ⓘ INFORMAÇÕES", tips: "💡 DICAS", news: "📣 NOVIDADES", howTitle: "Como resgatar", tipsTitle: "Dicas rápidas", faqTitle: "Dúvidas comuns", noNews: "Ainda não há novidades publicadas para este jogo.", noNewsCopy: "Quando houver uma atualização ou informação relevante, ela aparecerá aqui.", viewRewards: "Ver presentes de hoje", moreSoon: "Conteúdo novo aparecerá aqui quando houver informação real.", follow: "Seguir jogo", following: "Seguindo jogo", didntDrop: "O presente não caiu?", didntDropCopy: "Abrir o jogo não confirma a entrega. Confira o status e tente um link recente.", freeNow: "Grátis no jogo agora", quickNews: "Novidade rápida", dailyTip: "Dica do dia", notify: "Avise-me quando houver novos presentes", alertOn: "Aviso preparado neste dispositivo", otherGames: "Outros jogos com presentes hoje", noOtherGames: "Nenhum outro jogo tem presente novo hoje." },
  en: { title: "Game hub", copy: "Short guides, honest tips and useful information.", rewards: "🎁 GIFTS", guides: "ⓘ INFO", tips: "💡 TIPS", news: "📣 NEWS", howTitle: "How to redeem", tipsTitle: "Quick tips", faqTitle: "Common questions", noNews: "There are no news posts for this game yet.", noNewsCopy: "Relevant updates will appear here when there is real information to share.", viewRewards: "View today's gifts", moreSoon: "New content will appear here when real information is available.", follow: "Follow game", following: "Following game", didntDrop: "The gift did not arrive?", didntDropCopy: "Opening the game does not confirm delivery. Check the status and try a recent link.", freeNow: "Free in the game now", quickNews: "Quick update", dailyTip: "Tip of the day", notify: "Notify me when new gifts appear", alertOn: "Alert prepared on this device", otherGames: "Other games with gifts today", noOtherGames: "No other game has a new gift today." },
  es: { title: "Central del juego", copy: "Guías breves, consejos honestos e información útil.", rewards: "🎁 REGALOS", guides: "ⓘ INFORMACIÓN", tips: "💡 CONSEJOS", news: "📣 NOVEDADES", howTitle: "Cómo canjear", tipsTitle: "Consejos rápidos", faqTitle: "Dudas comunes", noNews: "Todavía no hay novedades publicadas para este juego.", noNewsCopy: "Las actualizaciones relevantes aparecerán aquí cuando haya información real.", viewRewards: "Ver regalos de hoy", moreSoon: "El contenido nuevo aparecerá cuando haya información real.", follow: "Seguir juego", following: "Siguiendo juego", didntDrop: "¿No llegó el regalo?", didntDropCopy: "Abrir el juego no confirma la entrega. Revisa el estado y prueba un enlace reciente.", freeNow: "Gratis en el juego ahora", quickNews: "Novedad rápida", dailyTip: "Consejo del día", notify: "Avísame cuando haya nuevos regalos", alertOn: "Aviso preparado en este dispositivo", otherGames: "Otros juegos con regalos hoy", noOtherGames: "Ningún otro juego tiene un regalo nuevo hoy." },
  de: { title: "Spielzentrale", copy: "Kurze Anleitungen, ehrliche Tipps und nützliche Infos.", rewards: "🎁 GESCHENKE", guides: "ⓘ INFOS", tips: "💡 TIPPS", news: "📣 NEWS", howTitle: "So löst du ein", tipsTitle: "Schnelle Tipps", faqTitle: "Häufige Fragen", noNews: "Für dieses Spiel gibt es noch keine News.", noNewsCopy: "Relevante Updates erscheinen hier, sobald echte Informationen vorliegen.", viewRewards: "Geschenke heute ansehen", moreSoon: "Neue Inhalte erscheinen, sobald echte Informationen verfügbar sind.", follow: "Spiel folgen", following: "Spiel gefolgt", didntDrop: "Geschenk nicht angekommen?", didntDropCopy: "Das Öffnen des Spiels bestätigt keine Lieferung. Prüfe den Status und nutze einen aktuellen Link.", freeNow: "Jetzt im Spiel gratis", quickNews: "Schnelles Update", dailyTip: "Tipp des Tages", notify: "Bei neuen Geschenken benachrichtigen", alertOn: "Hinweis auf diesem Gerät vorbereitet", otherGames: "Andere Spiele mit Geschenken heute", noOtherGames: "Kein anderes Spiel hat heute ein neues Geschenk." },
  tr: { title: "Oyun merkezi", copy: "Kısa rehberler, dürüst ipuçları ve yararlı bilgiler.", rewards: "🎁 HEDİYELER", guides: "ⓘ BİLGİ", tips: "💡 İPUÇLARI", news: "📣 YENİLİKLER", howTitle: "Nasıl alınır", tipsTitle: "Hızlı ipuçları", faqTitle: "Sık sorulanlar", noNews: "Bu oyun için henüz haber yayınlanmadı.", noNewsCopy: "Gerçek ve önemli bilgiler olduğunda burada görünecek.", viewRewards: "Bugünün hediyelerini gör", moreSoon: "Gerçek bilgi olduğunda yeni içerik burada görünecek.", follow: "Oyunu takip et", following: "Takip ediliyor", didntDrop: "Hediye gelmedi mi?", didntDropCopy: "Oyunu açmak teslimatı doğrulamaz. Durumu kontrol edip güncel bir bağlantı deneyin.", freeNow: "Şimdi oyunda ücretsiz", quickNews: "Hızlı yenilik", dailyTip: "Günün ipucu", notify: "Yeni hediyeler geldiğinde haber ver", alertOn: "Bildirim bu cihazda hazırlandı", otherGames: "Bugün hediyeli diğer oyunlar", noOtherGames: "Bugün başka oyunda yeni hediye yok." },
};
const GAME_CENTER_CONTENT = {
  "coin-master": {
    pt: { guide: "Os links públicos recentes costumam abrir uma página oficial e depois o jogo.", steps: ["Abra um link recente na aba Presentes.", "Aguarde o redirecionamento e deixe o Coin Master carregar.", "Confira no jogo se os giros ou moedas entraram antes de fechar."], tips: ["Alguns links dependem da conta e da data em que foram abertos.", "Use giros em eventos quando isso fizer sentido para sua estratégia.", "Links antigos podem deixar de funcionar sem aviso."], faq: ["Se o jogo abriu mas nada apareceu, aguarde alguns segundos e confira a caixa de presente.", "Não encontrou recompensa? Volte aos links mais recentes; não tratamos link antigo como garantia."] },
    en: { guide: "Recent public links usually open an official page and then the game.", steps: ["Open a recent link from the Gifts tab.", "Wait for the redirect and let Coin Master load.", "Check in the game that spins or coins arrived before closing."], tips: ["Some links depend on the account and the date they were opened.", "Use spins during events when it fits your strategy.", "Older links can stop working without notice."], faq: ["If the game opened but nothing appeared, wait a few seconds and check the gift inbox.", "No reward? Try the most recent links; old links are never treated as guaranteed."] },
    es: { guide: "Los enlaces públicos recientes suelen abrir una página oficial y después el juego.", steps: ["Abre un enlace reciente en Regalos.", "Espera la redirección y deja que Coin Master cargue.", "Comprueba en el juego que llegaron los giros o monedas."], tips: ["Algunos enlaces dependen de la cuenta y de la fecha de apertura.", "Usa los giros durante eventos cuando encaje con tu estrategia.", "Los enlaces antiguos pueden dejar de funcionar sin aviso."], faq: ["Si el juego se abrió pero no apareció nada, espera unos segundos y revisa la bandeja de regalos.", "¿No llegó la recompensa? Prueba los enlaces más recientes; los antiguos no son garantía."] },
    de: { guide: "Aktuelle öffentliche Links öffnen meist eine offizielle Seite und danach das Spiel.", steps: ["Öffne einen aktuellen Link unter Geschenke.", "Warte auf die Weiterleitung und lass Coin Master laden.", "Prüfe im Spiel, ob Spins oder Münzen angekommen sind."], tips: ["Manche Links hängen vom Konto und vom Öffnungsdatum ab.", "Nutze Spins bei Events, wenn es zu deiner Strategie passt.", "Ältere Links können ohne Hinweis nicht mehr funktionieren."], faq: ["Wenn das Spiel geöffnet wurde, aber nichts erschien, warte kurz und prüfe das Geschenk-Postfach.", "Keine Belohnung? Nutze die neuesten Links; alte Links sind keine Garantie."] },
    tr: { guide: "Güncel herkese açık bağlantılar genellikle resmi bir sayfayı ve ardından oyunu açar.", steps: ["Hediyeler sekmesinden güncel bir bağlantı açın.", "Yönlendirmeyi bekleyin ve Coin Master'ın yüklenmesine izin verin.", "Kapatmadan önce çevirme veya paraların geldiğini oyunda kontrol edin."], tips: ["Bazı bağlantılar hesaba ve açıldığı tarihe bağlıdır.", "Stratejinize uygunsa çevirileri etkinliklerde kullanın.", "Eski bağlantılar uyarı vermeden çalışmayı bırakabilir."], faq: ["Oyun açıldı ama bir şey gelmediyse birkaç saniye bekleyip hediye kutusunu kontrol edin.", "Ödül yok mu? En güncel bağlantıları deneyin; eski bağlantılar garanti değildir."] },
  },
  "match-masters": {
    pt: { guide: "Um link público pode abrir o Match Masters diretamente. A entrega depende do estado da conta e da validade do link.", steps: ["Abra o link mais recente na aba Presentes.", "Se o jogo abrir, aguarde a tela carregar completamente.", "Veja se o presente aparece na área de recompensas do jogo."], tips: ["No Match Masters, abrir o jogo não é prova de que o prêmio foi entregue.", "Leia o status e as confirmações de jogadores antes de insistir num link.", "Não reutilize vários links antigos esperando a mesma recompensa."], faq: ["O link abriu o jogo, mas não entregou? Isso pode acontecer quando o link já foi usado, expirou ou depende da conta.", "O Game Gifts não altera a conta do jogo nem consegue garantir a entrega."] },
    en: { guide: "A public link can open Match Masters directly. Delivery depends on the account state and link validity.", steps: ["Open the newest link from the Gifts tab.", "If the game opens, wait for the screen to finish loading.", "Check the game's reward area for the gift."], tips: ["In Match Masters, opening the game is not proof that a prize was delivered.", "Read the status and player confirmations before retrying a link.", "Do not keep reusing old links for the same reward."], faq: ["The link opened the game but gave nothing. Why? It may already be used, expired or account-dependent.", "Game Gifts cannot change a game account or guarantee delivery."] },
    es: { guide: "Un enlace público puede abrir Match Masters directamente. La entrega depende de la cuenta y de la validez del enlace.", steps: ["Abre el enlace más reciente en Regalos.", "Si se abre el juego, espera a que termine de cargar.", "Busca el regalo en el área de recompensas."], tips: ["Abrir Match Masters no demuestra que el premio se haya entregado.", "Lee el estado y las confirmaciones de jugadores antes de repetir.", "No reutilices enlaces antiguos para la misma recompensa."], faq: ["¿Se abrió el juego pero no llegó nada? Puede estar usado, caducado o depender de la cuenta.", "Game Gifts no puede cambiar una cuenta ni garantizar la entrega."] },
    de: { guide: "Ein öffentlicher Link kann Match Masters direkt öffnen. Die Lieferung hängt vom Konto und der Linkgültigkeit ab.", steps: ["Öffne den neuesten Link unter Geschenke.", "Warte nach dem Öffnen, bis das Spiel vollständig geladen ist.", "Prüfe den Belohnungsbereich des Spiels."], tips: ["Das Öffnen von Match Masters beweist nicht, dass eine Belohnung geliefert wurde.", "Prüfe Status und Spielerbestätigungen, bevor du einen Link erneut öffnest.", "Verwende alte Links nicht immer wieder für dieselbe Belohnung."], faq: ["Das Spiel öffnete sich, aber nichts kam an. Warum? Der Link kann benutzt, abgelaufen oder kontoabhängig sein.", "Game Gifts kann kein Spielkonto ändern und keine Lieferung garantieren."] },
    tr: { guide: "Herkese açık bir bağlantı Match Masters'ı doğrudan açabilir. Teslimat hesap durumuna ve bağlantının geçerliliğine bağlıdır.", steps: ["Hediyeler sekmesindeki en yeni bağlantıyı açın.", "Oyun açılırsa ekranın tamamen yüklenmesini bekleyin.", "Hediyeyi oyunun ödül bölümünde kontrol edin."], tips: ["Match Masters'ın açılması ödülün geldiğini kanıtlamaz.", "Tekrar denemeden önce durumu ve oyuncu onaylarını okuyun.", "Aynı ödül için eski bağlantıları tekrar tekrar kullanmayın."], faq: ["Oyun açıldı ama ödül gelmedi. Neden? Bağlantı kullanılmış, süresi dolmuş veya hesaba bağlı olabilir.", "Game Gifts oyun hesabını değiştiremez ve teslimatı garanti edemez."] },
  },
  "dice-dreams": {
    pt: { guide: "Links públicos de Dice Dreams podem abrir uma página de recompensa e encaminhar você ao jogo.", steps: ["Escolha um link recente de rolls.", "Abra-o no mesmo dispositivo em que Dice Dreams está instalado.", "Confira os rolls recebidos no jogo antes de sair."], tips: ["Rolls promocionais podem expirar ou ser limitados por conta.", "Use os rolls quando puder acompanhar o jogo e confirmar a entrega.", "Prefira links recentes e confira os votos de outros jogadores."], faq: ["Se nada aparecer, reabra o jogo e verifique a caixa de presentes.", "Um link funcionar para outra pessoa não garante que funcionará para toda conta."] },
    en: { guide: "Public Dice Dreams links can open a reward page and send you to the game.", steps: ["Choose a recent rolls link.", "Open it on the device where Dice Dreams is installed.", "Check the rolls received in the game before leaving."], tips: ["Promotional rolls can expire or be account-limited.", "Use rolls when you can stay long enough to confirm delivery.", "Prefer recent links and check other players' votes."], faq: ["If nothing appears, reopen the game and check the gift inbox.", "A link working for someone else does not guarantee it will work for every account."] },
    es: { guide: "Los enlaces públicos de Dice Dreams pueden abrir una página de recompensa y llevarte al juego.", steps: ["Elige un enlace reciente de tiradas.", "Ábrelo en el dispositivo donde tienes Dice Dreams.", "Comprueba las tiradas recibidas antes de salir."], tips: ["Las tiradas promocionales pueden caducar o limitarse por cuenta.", "Úsalas cuando puedas confirmar la entrega en el juego.", "Prefiere enlaces recientes y revisa los votos."], faq: ["Si no aparece nada, vuelve a abrir el juego y revisa la bandeja de regalos.", "Que funcione para otra persona no garantiza que funcione para todas las cuentas."] },
    de: { guide: "Öffentliche Dice-Dreams-Links können eine Belohnungsseite öffnen und dich ins Spiel führen.", steps: ["Wähle einen aktuellen Rolls-Link.", "Öffne ihn auf dem Gerät mit installiertem Dice Dreams.", "Prüfe die erhaltenen Rolls im Spiel."], tips: ["Promotions-Rolls können ablaufen oder kontobeschränkt sein.", "Nutze sie, wenn du die Lieferung direkt prüfen kannst.", "Bevorzuge aktuelle Links und beachte Spieler-Stimmen."], faq: ["Wenn nichts erscheint, öffne das Spiel erneut und prüfe das Geschenk-Postfach.", "Dass ein Link bei jemandem funktioniert, ist keine Garantie für jedes Konto."] },
    tr: { guide: "Dice Dreams herkese açık bağlantıları bir ödül sayfası açıp sizi oyuna yönlendirebilir.", steps: ["Güncel bir atış bağlantısı seçin.", "Dice Dreams'in kurulu olduğu cihazda açın.", "Çıkmadan önce oyundaki atışları kontrol edin."], tips: ["Promosyon atışlarının süresi dolabilir veya hesapla sınırlı olabilir.", "Teslimatı doğrulayabileceğiniz zaman kullanın.", "Güncel bağlantıları tercih edin ve oyuncu oylarını inceleyin."], faq: ["Bir şey görünmezse oyunu yeniden açıp hediye kutusunu kontrol edin.", "Başkasında çalışması her hesapta çalışacağı anlamına gelmez."] },
  },
  "travel-town": {
    pt: { guide: "Os links de energia do Travel Town devem ser abertos no dispositivo com o jogo instalado.", steps: ["Abra um link recente de energia.", "Aceite o redirecionamento para o Travel Town.", "Confira o saldo de energia e continue suas combinações no jogo."], tips: ["Energia é usada para gerar itens e completar pedidos.", "Planeje as combinações para não gastar energia sem espaço no tabuleiro.", "Links antigos podem expirar; use a data e os votos como orientação."], faq: ["Se o app abriu sem energia, confirme que está na conta certa e atualize a tela.", "O Game Gifts apenas organiza links públicos; não adiciona energia diretamente."] },
    en: { guide: "Travel Town energy links should be opened on the device where the game is installed.", steps: ["Open a recent energy link.", "Accept the redirect to Travel Town.", "Check your energy balance and continue merging in the game."], tips: ["Energy is used to create items and complete orders.", "Plan merges so you do not spend energy without board space.", "Older links can expire; use the date and votes as guidance."], faq: ["If the app opened without energy, confirm the right account is active and refresh the screen.", "Game Gifts only organizes public links; it does not add energy directly."] },
    es: { guide: "Los enlaces de energía de Travel Town deben abrirse en el dispositivo donde está instalado el juego.", steps: ["Abre un enlace reciente de energía.", "Acepta la redirección a Travel Town.", "Revisa la energía y continúa combinando objetos."], tips: ["La energía se usa para crear objetos y completar pedidos.", "Planifica las combinaciones para conservar espacio en el tablero.", "Los enlaces antiguos pueden caducar; usa la fecha y los votos como guía."], faq: ["Si la app se abrió sin energía, confirma la cuenta correcta y actualiza la pantalla.", "Game Gifts solo organiza enlaces públicos; no añade energía directamente."] },
    de: { guide: "Travel-Town-Energielinks sollten auf dem Gerät mit installiertem Spiel geöffnet werden.", steps: ["Öffne einen aktuellen Energielink.", "Bestätige die Weiterleitung zu Travel Town.", "Prüfe deine Energie und fahre im Spiel mit dem Kombinieren fort."], tips: ["Energie wird für Gegenstände und Bestellungen verwendet.", "Plane Kombinationen und lasse Platz auf dem Spielfeld.", "Ältere Links können ablaufen; Datum und Stimmen helfen bei der Einschätzung."], faq: ["Wenn die App ohne Energie geöffnet wurde, prüfe das richtige Konto und aktualisiere den Bildschirm.", "Game Gifts sammelt nur öffentliche Links und fügt keine Energie direkt hinzu."] },
    tr: { guide: "Travel Town enerji bağlantıları oyunun kurulu olduğu cihazda açılmalıdır.", steps: ["Güncel bir enerji bağlantısı açın.", "Travel Town'a yönlendirmeyi kabul edin.", "Enerji bakiyenizi kontrol edip oyunda birleştirmeye devam edin."], tips: ["Enerji eşya üretmek ve siparişleri tamamlamak için kullanılır.", "Tahtada yer kalmadan enerji harcamamak için birleştirmeleri planlayın.", "Eski bağlantıların süresi dolabilir; tarih ve oyları rehber olarak kullanın."], faq: ["Uygulama enerji olmadan açıldıysa doğru hesabı kontrol edip ekranı yenileyin.", "Game Gifts yalnızca herkese açık bağlantıları düzenler; doğrudan enerji eklemez."] },
  },
};
const GENERIC_CENTER_CONTENT = {
  pt: { guide: "Abra um link recente na aba Presentes e confira a recompensa no próprio jogo.", steps: ["Escolha uma recompensa recente.", "Abra o link no dispositivo com o jogo instalado.", "Confirme no jogo se a recompensa foi entregue."], tips: ["Prefira links recentes e confira a data.", "Abrir o jogo não confirma a entrega.", "Use os votos de jogadores como uma orientação, não como garantia."], faq: ["Se nada aparecer, reabra o jogo e confira a área de presentes.", "Links públicos podem depender da conta e expirar."] },
  en: { guide: "Open a recent link from the Gifts tab and check the reward inside the game.", steps: ["Choose a recent reward.", "Open the link on the device with the game installed.", "Confirm delivery inside the game."], tips: ["Prefer recent links and check the date.", "Opening the game does not confirm delivery.", "Use player votes as guidance, never as a guarantee."], faq: ["If nothing appears, reopen the game and check its gift area.", "Public links can depend on the account and expire."] },
  es: { guide: "Abre un enlace reciente en Regalos y comprueba la recompensa dentro del juego.", steps: ["Elige una recompensa reciente.", "Abre el enlace en el dispositivo con el juego instalado.", "Confirma la entrega dentro del juego."], tips: ["Prefiere enlaces recientes y revisa la fecha.", "Abrir el juego no confirma la entrega.", "Usa los votos como orientación, no como garantía."], faq: ["Si no aparece nada, vuelve a abrir el juego y revisa su área de regalos.", "Los enlaces públicos pueden depender de la cuenta y caducar."] },
  de: { guide: "Öffne einen aktuellen Link unter Geschenke und prüfe die Belohnung im Spiel.", steps: ["Wähle eine aktuelle Belohnung.", "Öffne den Link auf dem Gerät mit installiertem Spiel.", "Bestätige die Lieferung im Spiel."], tips: ["Bevorzuge aktuelle Links und prüfe das Datum.", "Das Öffnen des Spiels bestätigt keine Lieferung.", "Spieler-Stimmen sind eine Orientierung, keine Garantie."], faq: ["Wenn nichts erscheint, öffne das Spiel erneut und prüfe den Geschenkbereich.", "Öffentliche Links können kontobedingt sein und ablaufen."] },
  tr: { guide: "Hediyeler sekmesinden güncel bir bağlantı açın ve ödülü oyunda kontrol edin.", steps: ["Güncel bir ödül seçin.", "Bağlantıyı oyunun kurulu olduğu cihazda açın.", "Teslimatı oyunun içinde doğrulayın."], tips: ["Güncel bağlantıları tercih edin ve tarihi kontrol edin.", "Oyunu açmak teslimatı doğrulamaz.", "Oyuncu oylarını garanti değil, rehber olarak kullanın."], faq: ["Bir şey görünmezse oyunu yeniden açıp hediye bölümünü kontrol edin.", "Herkese açık bağlantılar hesaba bağlı olabilir ve süresi dolabilir."] },
};

const GAME_INFO_LABELS = {
  pt: { details: "Dados do jogo", officialName: "Nome oficial", publisher: "Desenvolvedora / publicadora", platforms: "Plataformas", rewards: "Tipos de recompensas", howWorks: "Como o jogo funciona", giftLinks: "Como funcionam os links de presentes", redeem: "Como resgatar", important: "Importante para novos jogadores", officialLinks: "Links oficiais", officialSite: "Portal oficial", developerPage: "Página da desenvolvedora", support: "Suporte oficial", social: "Rede oficial" },
  en: { details: "Game details", officialName: "Official name", publisher: "Developer / publisher", platforms: "Platforms", rewards: "Reward types", howWorks: "How the game works", giftLinks: "How gift links work", redeem: "How to redeem", important: "Important for new players", officialLinks: "Official links", officialSite: "Official portal", developerPage: "Developer page", support: "Official support", social: "Official social" },
};
const GAME_INFO_CONTENT = {
  "match-masters": {
    pt: { officialName: "Match Masters", description: "Jogo competitivo de quebra-cabeça match-3 em que jogadores do mundo todo se enfrentam em partidas rápidas, usando estratégias, modos variados e power-ups.", publisher: "Candivore", platforms: "Android · iOS", rewards: ["Boosters", "moedas", "recompensas diárias", "Reward Keys"], howWorks: ["Você disputa partidas rápidas de match-3 contra outro jogador.", "Combine peças para avançar na partida e use boosters e estratégias para superar o adversário."], giftLinks: "O portal oficial do Match Masters apresenta recompensas diárias e Reward Keys. Os links publicados aqui são apenas links públicos; a disponibilidade depende do link e da conta.", redeem: ["Abra um link recente na aba Presentes.", "Aguarde o portal ou o jogo carregar no mesmo dispositivo.", "Confira a área de recompensas do Match Masters para confirmar o recebimento."], important: ["Abrir o jogo não confirma que a recompensa foi entregue.", "Um link pode já ter sido usado, expirado ou depender da conta."], links: [{ label: "Portal oficial", url: "https://matchmasters.com/", kind: "officialSite" }, { label: "Página da Candivore", url: "https://www.candivore.com/games/match-masters", kind: "developerPage" }, { label: "Suporte oficial", url: "https://candivore.zendesk.com/hc/en-us/", kind: "support" }] },
    en: { officialName: "Match Masters", description: "A competitive match-3 puzzle game where players from around the world face off in quick matches using strategies, varied modes and power-ups.", publisher: "Candivore", platforms: "Android · iOS", rewards: ["Boosters", "coins", "daily rewards", "Reward Keys"], howWorks: ["You play quick match-3 matches against another player.", "Match pieces to progress and use boosters and strategy to outplay your opponent."], giftLinks: "The official Match Masters portal features daily rewards and Reward Keys. Links listed here are public links only; availability depends on the link and the account.", redeem: ["Open a recent link from the Gifts tab.", "Wait for the portal or game to load on the same device.", "Check the Match Masters reward area to confirm delivery."], important: ["Opening the game does not confirm that a reward was delivered.", "A link may already be used, expired or account-dependent."], links: [{ label: "Official portal", url: "https://matchmasters.com/", kind: "officialSite" }, { label: "Candivore page", url: "https://www.candivore.com/games/match-masters", kind: "developerPage" }, { label: "Official support", url: "https://candivore.zendesk.com/hc/en-us/", kind: "support" }] },
  },
  "coin-master": {
    pt: { officialName: "Coin Master", description: "Jogo casual de construção e estratégia em que você gira a máquina, conquista moedas, ataca e invade vilas e avança por mundos temáticos.", publisher: "Moon Active", platforms: "Android · iOS", rewards: ["spins", "moedas", "cartas e baús", "prêmios de eventos"], howWorks: ["Use spins para jogar na máquina e obter moedas e outras ações para a sua vila.", "Construa e melhore vilas, ataque ou invada outras vilas e participe de eventos e torneios."], giftLinks: "A Central de recompensas oficial reúne presentes diários, incluindo spins e moedas. O Game Gifts apenas organiza links públicos e não entrega a recompensa diretamente.", redeem: ["Abra um link recente na aba Presentes.", "Siga o redirecionamento para a página oficial ou para o Coin Master.", "Confira o saldo de spins, moedas ou a caixa de presentes dentro do jogo."], important: ["Os eventos e recompensas podem variar de acordo com a conta.", "Links antigos podem deixar de funcionar; prefira os mais recentes e verifique a entrega no jogo."], links: [{ label: "Central oficial de recompensas", url: "https://rewards.coinmaster.com/rewards/rewards.html", kind: "officialSite" }, { label: "Suporte oficial", url: "https://support.coinmastergame.com/hc/en-us/", kind: "support" }] },
    en: { officialName: "Coin Master", description: "A casual building and strategy game where you spin, collect coins, attack and raid villages, and progress through themed worlds.", publisher: "Moon Active", platforms: "Android · iOS", rewards: ["spins", "coins", "cards and chests", "event prizes"], howWorks: ["Use spins to play the machine and earn coins and other actions for your village.", "Build and upgrade villages, attack or raid other villages, and join events and tournaments."], giftLinks: "The official Reward Center brings together daily gifts, including spins and coins. Game Gifts only organizes public links and does not deliver rewards directly.", redeem: ["Open a recent link from the Gifts tab.", "Follow the redirect to the official page or Coin Master.", "Check your spins, coins or gift inbox inside the game."], important: ["Events and rewards can vary by account.", "Older links can stop working; prefer recent links and verify delivery in the game."], links: [{ label: "Official Reward Center", url: "https://rewards.coinmaster.com/rewards/rewards.html", kind: "officialSite" }, { label: "Official support", url: "https://support.coinmastergame.com/hc/en-us/", kind: "support" }] },
  },
  "dice-dreams": {
    pt: { officialName: "Dice Dreams™", description: "Jogo casual de tabuleiro em que você rola dados, constrói um reino, ataca amigos, rouba moedas e busca vingança quando seu reino é atacado.", publisher: "SuperPlay", platforms: "Android · iOS", rewards: ["dice rolls", "moedas", "recompensas de eventos"], howWorks: ["Role os dados para avançar pelo tabuleiro e obter recursos para o seu reino.", "Use os recursos para construir, ataque e saqueie reinos de amigos e participe de atividades sociais e eventos."], giftLinks: "Os links públicos de Dice Dreams podem abrir uma página de recompensa e encaminhar para o jogo. A entrega depende da validade do link e da conta.", redeem: ["Escolha um link recente de rolls na aba Presentes.", "Abra-o no dispositivo em que Dice Dreams está instalado.", "Volte ao jogo e confirme os rolls ou moedas recebidos antes de sair."], important: ["Rolls promocionais podem expirar ou ser limitados por conta.", "Se nada aparecer, reabra o jogo e confira a caixa de presentes."], links: [{ label: "Página oficial do jogo", url: "https://www.superplay.co/games/dice-dreams/", kind: "officialSite" }, { label: "Suporte oficial", url: "https://superplay.helpshift.com/hc/en/7-superplay/section/33-dice-dreams/", kind: "support" }] },
    en: { officialName: "Dice Dreams™", description: "A casual board game where you roll dice, build a kingdom, attack friends, steal coins and get revenge when your kingdom is attacked.", publisher: "SuperPlay", platforms: "Android · iOS", rewards: ["dice rolls", "coins", "event rewards"], howWorks: ["Roll the dice to move around the board and collect resources for your kingdom.", "Use resources to build, attack and raid friends' kingdoms, and take part in social activities and events."], giftLinks: "Public Dice Dreams links can open a reward page and send you to the game. Delivery depends on link validity and the account.", redeem: ["Choose a recent rolls link from the Gifts tab.", "Open it on the device where Dice Dreams is installed.", "Return to the game and confirm the rolls or coins before leaving."], important: ["Promotional rolls can expire or be account-limited.", "If nothing appears, reopen the game and check the gift inbox."], links: [{ label: "Official game page", url: "https://www.superplay.co/games/dice-dreams/", kind: "officialSite" }, { label: "Official support", url: "https://superplay.helpshift.com/hc/en/7-superplay/section/33-dice-dreams/", kind: "support" }] },
  },
  "travel-town": {
    pt: { officialName: "Travel Town - Merge Adventure", description: "Aventura de puzzle em que você combina objetos para criar itens melhores, cumpre missões dos moradores e ajuda a reconstruir uma cidade litorânea atingida por uma tempestade.", publisher: "Moon Active (App Store) · Magmatic Games LTD (Google Play)", platforms: "Android · iOS / iPadOS", rewards: ["energia", "moedas", "itens de progressão", "recompensas de eventos"], howWorks: ["Combine dois objetos iguais para evoluí-los e descobrir novos itens.", "Cumpra missões, conheça os moradores e use moedas para restaurar e melhorar a cidade."], giftLinks: "Os links públicos de energia devem ser abertos no dispositivo com Travel Town instalado. Eles podem encaminhar para o app; a entrega deve ser conferida no saldo do jogo.", redeem: ["Abra um link recente de energia na aba Presentes.", "Aceite o redirecionamento para o Travel Town.", "Confira o saldo de energia dentro do jogo antes de continuar."], important: ["O jogo contém compras dentro do app, incluindo itens aleatórios.", "Links antigos podem expirar; a data e os votos servem apenas como orientação, não como garantia."], links: [{ label: "Página oficial na App Store", url: "https://apps.apple.com/us/app/travel-town-merge-adventure/id1521236603", kind: "officialSite" }, { label: "Suporte oficial", url: "https://support.traveltowngame.com/hc/en-us/", kind: "support" }], socials: [{ label: "Facebook oficial", url: "https://www.facebook.com/TravelTownGame/" }, { label: "Instagram oficial", url: "https://www.instagram.com/traveltowngame/" }] },
    en: { officialName: "Travel Town - Merge Adventure", description: "A puzzle adventure where you merge objects into better items, complete villagers' missions and help rebuild a seaside town damaged by a storm.", publisher: "Moon Active (App Store) · Magmatic Games LTD (Google Play)", platforms: "Android · iOS / iPadOS", rewards: ["energy", "coins", "progression items", "event rewards"], howWorks: ["Merge two matching objects to evolve them and discover new items.", "Complete missions, meet villagers, and use coins to restore and upgrade the town."], giftLinks: "Public energy links should be opened on the device where Travel Town is installed. They may forward to the app; check delivery in the game's energy balance.", redeem: ["Open a recent energy link from the Gifts tab.", "Accept the redirect to Travel Town.", "Check your energy balance in the game before continuing."], important: ["The game contains in-app purchases, including randomized items.", "Older links can expire; dates and votes are guidance only, not a guarantee."], links: [{ label: "Official App Store page", url: "https://apps.apple.com/us/app/travel-town-merge-adventure/id1521236603", kind: "officialSite" }, { label: "Official support", url: "https://support.traveltowngame.com/hc/en-us/", kind: "support" }], socials: [{ label: "Official Facebook", url: "https://www.facebook.com/TravelTownGame/" }, { label: "Official Instagram", url: "https://www.instagram.com/traveltowngame/" }] },
  },
};

const detectLanguage = () => {
  try {
    const saved = localStorage.getItem("game-gifts-language");
    if (LANGS.includes(saved)) return saved;
  } catch {}
  const browser = String(navigator.language || "").toLowerCase().split("-")[0];
  return LANGS.includes(browser) ? browser : "pt";
};
const state = { lang: detectLanguage(), data: { games: [], rewards: [], news: [] }, search: "", homeSort: "all", tab: "today", centralTab: "guides", gameSection: "rewards", selectedDate: "", admin: null, editGameId: null, editSourceId: null, collectionResult: null, viewerKey: "anonymous", websimUserId: "", websimUser: null, profile: null, profileLoading: false, ranking: [], rankingPeriod: "daily", rankingLoading: false, rankingLoaded: false, quiz: null, noticeHydrated: false, noticePermission: "unknown", noticeBaselineReady: false, settingsPermission: "unknown", settingsPermissionLoading: false, settingsMessage: "", settingsTestLoading: false, navigationStack: [], backRequested: false };
const app = document.querySelector("#app");
const recoverGameCatalog = (data) => {
  const source = data && typeof data === "object" ? data : {};
  const apiGames = Array.isArray(source.games) ? source.games.filter((game) => game && game.slug) : [];
  const apiRewards = Array.isArray(source.rewards) ? source.rewards.filter(Boolean) : [];
  const rewardIds = new Map();
  (Array.isArray(source.rewards) ? source.rewards : []).forEach((reward) => {
    const slug = String(reward?.game_slug || reward?.game || "").trim();
    if (slug && reward?.game_id && !rewardIds.has(slug)) rewardIds.set(slug, Number(reward.game_id));
  });
  const apiBySlug = new Map(apiGames.map((game) => [game.slug, game]));
  const recovered = RECOVERED_GAME_CATALOG.map((game, index) => {
    const existing = apiBySlug.get(game.slug);
    if (existing?.active === false) return existing;
    return {
      id: existing?.id ?? rewardIds.get(game.slug) ?? -(index + 1),
      ...game,
      ...existing,
      active: existing?.active !== false,
      image: existing?.image || game.image,
    };
  });
  const recoveredSlugs = new Set(RECOVERED_GAME_CATALOG.map((game) => game.slug));
  const extraApiGames = apiGames.filter((game) => !recoveredSlugs.has(game.slug) && game.active !== false);
  const idBySlug = new Map(recovered.map((game) => [game.slug, game.id]));
  const existingRewardKeys = new Set(apiRewards.map((reward) => String(reward?.reward_key || reward?.final_url || reward?.original_url || reward?.url || "").trim().toLowerCase()).filter(Boolean));
  const fallbackRewards = RECOVERED_REWARD_CATALOG
    .filter((reward) => !existingRewardKeys.has(String(reward.reward_key || reward.url).toLowerCase()) && !existingRewardKeys.has(String(reward.url).toLowerCase()))
    .map((reward) => ({ ...reward, game_id: idBySlug.get(reward.game_slug) ?? reward.game_id }));
  const normalizeReward = (reward, index) => {
    const gameSlug = String(reward?.game_slug || reward?.game || "").trim();
    const rawUrl = String(reward?.url || reward?.original_url || reward?.final_url || "").trim();
    const signature = rawUrl || `${gameSlug}-${index}`;
    const stableNumericId = 100000000 + Math.abs([...signature].reduce((n, char) => (n * 31 + char.charCodeAt(0)) % 800000000, 7));
    const stableId = reward?.id ?? -stableNumericId;
    return {
      ...reward,
      id: stableId,
      game_slug: gameSlug || reward?.game_slug,
      game_id: reward?.game_id ?? idBySlug.get(gameSlug),
      game_name: reward?.game_name || recovered.find((game) => game.slug === gameSlug)?.name,
      url: rawUrl || reward?.url,
      original_url: reward?.original_url || rawUrl,
      final_url: reward?.final_url || rawUrl,
      reward_type: reward?.reward_type || reward?.type || "",
      reward_amount: reward?.reward_amount ?? reward?.amount ?? reward?.quantity ?? "",
      date_key: reward?.date_key || reward?.source_date || "",
      // Discovery publishers are kept server-side for audit only; they are
      // not public attribution and must not look like proof of a reward.
      source: "",
      source_name: "",
      reward_description: String(reward?.reward_description || reward?.source_excerpt || "").replace(/\s*(?:[·|-]\s*)?(?:fonte|source)\s*:\s*[^.]+\.?/gi, "").trim(),
      discovery_method: reward?.discovery_method || "automatic",
      publication_status: reward?.publication_status || (/^confirmed$/i.test(String(reward?.status || "")) ? "approved" : "pending"),
      status: reward?.status || "UNCONFIRMED",
    };
  };
  return { ...source, games: [...recovered, ...extraApiGames], rewards: [...apiRewards, ...fallbackRewards].map(normalizeReward) };
};
// Load the maintained visual layer after the legacy stylesheet on every route.
if (!document.querySelector('link[data-game-gifts-polish]')) {
  const polishSheet = document.createElement("link");
  polishSheet.rel = "stylesheet";
  polishSheet.href = sitePath("/polish.css");
  polishSheet.dataset.gameGiftsPolish = "";
  document.head.appendChild(polishSheet);
}
if (!document.querySelector('link[data-game-gifts-portal]')) {
  const portalSheet = document.createElement("link");
  portalSheet.rel = "stylesheet";
  portalSheet.href = sitePath("/portal.css");
  portalSheet.dataset.gameGiftsPortal = "";
  document.head.appendChild(portalSheet);
}
if (!document.querySelector('link[rel="icon"]')) { const favicon = document.createElement("link"); favicon.rel = "icon"; favicon.href = assetUrl("/favicon.svg"); favicon.type = "image/svg+xml"; document.head.appendChild(favicon); }
const todayKey = () => { const date = new Date(); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; };
const offsetDateKey = (offset) => { const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() + offset); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; };
const yesterdayKey = () => offsetDateKey(-1);
const copy = () => COPY[state.lang];
const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
const trackEvent = (eventName, parameters = {}) => {
  if (typeof window.gtag === "function") window.gtag("event", eventName, parameters);
};
const slugInitials = (name) => String(name || "GG").split(/[\s&-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
const hash = (value) => [...String(value || "")].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) % 360, 0);
const artStyle = (value) => { const hue = hash(value); return `style="--art-a:hsl(${hue} 70% 45%);--art-b:hsl(${(hue + 55) % 360} 64% 24%)"`; };
const isToday = (date) => date === todayKey();
const dateLabel = (date, options = {}) => {
  if (!date) return "";
  if (isToday(date) && !options.full) return state.lang === "pt" ? "Hoje" : state.lang === "en" ? "Today" : state.lang === "es" ? "Hoy" : state.lang === "de" ? "Heute" : "Bugün";
  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat(state.lang === "pt" ? "pt-BR" : state.lang, { day: "2-digit", month: "short" }).format(parsed).replace(".", "");
};
const localDateKey = (source) => {
  const parsed = new Date(source);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}-${String(parsed.getDate()).padStart(2, "0")}`;
};
const rewardDateKey = (reward) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(reward?.date_key || ""))) return reward.date_key;
  return /^\d{4}-\d{2}-\d{2}$/.test(String(reward?.source_date || reward?.published_date || ""))
    ? String(reward.source_date || reward.published_date)
    : "";
};
// found_at is an observation timestamp, not the reward's publication date.
// It must never make a rediscovered old URL appear as a new gift.
const rewardDetectedDateKey = (reward) => rewardDateKey(reward);
const isRewardToday = (reward) => isToday(rewardDetectedDateKey(reward));
const timeAgo = (value) => {
  const then = new Date(value).getTime();
  if (!then) return copy().lastAdded;
  const minutes = Math.max(0, Math.floor((Date.now() - then) / 60000));
  if (minutes < 60) return state.lang === "pt" ? `há ${minutes || 1} min` : state.lang === "en" ? `${minutes || 1}m ago` : state.lang === "es" ? `hace ${minutes || 1} min` : state.lang === "de" ? `vor ${minutes || 1} Min.` : `${minutes || 1} dk önce`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return state.lang === "pt" ? `há ${hours} h` : state.lang === "en" ? `${hours}h ago` : state.lang === "es" ? `hace ${hours} h` : state.lang === "de" ? `vor ${hours} Std.` : `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  return state.lang === "pt" ? `há ${days} d` : state.lang === "en" ? `${days}d ago` : state.lang === "es" ? `hace ${days} d` : state.lang === "de" ? `vor ${days} T.` : `${days} gün önce`;
};
const formatRewardDate = (reward) => {
  return dateLabel(rewardDetectedDateKey(reward));
};
const api = async (path, options = {}) => {
  const request = { cache: "no-store", ...options };
  const headers = new Headers(request.headers || {});
  if (state.viewerKey && !headers.has("x-game-gifts-voter-id")) headers.set("x-game-gifts-voter-id", state.viewerKey);
  if (state.websimUserId && !headers.has("x-websim-user-id")) headers.set("x-websim-user-id", state.websimUserId);
  request.headers = headers;
  const response = await fetch(path, request);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || "Request failed");
    error.code = body.code || "";
    error.status = response.status;
    throw error;
  }
  return body;
};
const isGitHubPagesDeployment = () => isGitHubPagesHost() || Boolean(window.__GAME_GIFTS_STATIC_DEPLOYMENT__);
const readStaticPublicData = async () => {
  const response = await fetch(assetUrl("/data/rewards.json"), { cache: "no-store" });
  const feed = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(`Arquivo público de dados indisponível (HTTP ${response.status}).`);
    error.status = response.status;
    throw error;
  }
  if (!feed || !Array.isArray(feed.rewards)) throw new Error("Arquivo público de dados inválido.");
  return recoverGameCatalog({ ...state.data, rewards: feed.rewards });
};
const loadPublicData = (force = false) => {
  if (!force && publicDataCache && Date.now() - publicDataCachedAt < PUBLIC_DATA_CACHE_MS) return publicDataCache;
  publicDataCachedAt = Date.now();
  publicDataCache = (isGitHubPagesDeployment()
    ? readStaticPublicData()
    : api("/api/data").then(recoverGameCatalog).catch((error) => error.status === 404 ? readStaticPublicData() : Promise.reject(error)))
    .catch((error) => { publicDataCache = null; throw error; });
  return publicDataCache;
};
const localVoterId = () => {
  const key = "game-gifts-voter-id";
  try {
    const existing = localStorage.getItem(key);
    if (existing) return existing;
    const created = `browser-${crypto.randomUUID()}`;
    localStorage.setItem(key, created);
    return created;
  } catch {
    return `browser-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
};
const favorites = () => { try { return JSON.parse(localStorage.getItem("game-gifts-favorites") || '{"games":[],"rewards":[]}'); } catch { return { games: [], rewards: [] }; } };
const openedStorageKey = () => `game-gifts-opened:${state.viewerKey}`;
const opened = () => { try { return JSON.parse(localStorage.getItem(openedStorageKey()) || "{}"); } catch { return {}; } };
const claimedStorageKey = () => `game-gifts-claimed:${state.viewerKey}`;
const claimedRewards = () => { try { return JSON.parse(localStorage.getItem(claimedStorageKey()) || "{}"); } catch { return {}; } };
const saveFavorites = (value) => localStorage.setItem("game-gifts-favorites", JSON.stringify(value));
const saveOpened = (value) => localStorage.setItem(openedStorageKey(), JSON.stringify(value));
const saveClaimedRewards = (value) => localStorage.setItem(claimedStorageKey(), JSON.stringify(value));
const rewardOpenedIdentity = (reward) => {
  const identity = String(reward?.reward_identity || reward?.reward_key || "").trim().toLowerCase();
  if (identity) return identity;
  const identifier = String(reward?.reward_identifier || reward?.reward_c || reward?.reward_pcode || "").trim().toLowerCase();
  if (identifier) return `${String(reward?.game_slug || reward?.game || reward?.game_id || "").trim().toLowerCase()}:${identifier}`;
  return `${String(reward?.game_slug || reward?.game || reward?.game_id || "").trim().toLowerCase()}:id:${String(reward?.id || "").trim()}`;
};
const openedRecordFor = (reward) => {
  if (!reward) return null;
  const saved = opened();
  const identity = rewardOpenedIdentity(reward);
  const legacyId = String(reward.id ?? "");
  const raw = saved[identity] ?? saved[legacyId];
  if (!raw) return null;
  if (typeof raw === "string") {
    const migrated = {
      reward_id: legacyId,
      reward_key: String(reward.reward_key || reward.reward_identity || ""),
      reward_identity: identity,
      game: String(reward.game_slug || reward.game || ""),
      game_slug: String(reward.game_slug || reward.game || ""),
      url: rewardOpenUrl(reward),
      opened_at: raw,
      reward: String(reward.reward_type || reward.type || reward.name || reward.reward_description || "").trim(),
      quantity: String(reward.reward_amount || reward.quantity || "").trim(),
    };
    saved[identity] = migrated;
    if (legacyId && legacyId !== identity) delete saved[legacyId];
    saveOpened(saved);
    return migrated;
  }
  return raw;
};
const rewardIsOpened = (reward) => Boolean(openedRecordFor(reward));
const SCORE_STORAGE_KEY = "game-gifts-score";
const SCORE_PER_REWARD = 10;
const scoreData = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(SCORE_STORAGE_KEY) || "{}");
    return {
      score: Number.isFinite(Number(saved.score)) ? Math.max(0, Number(saved.score)) : 0,
      rewardedIds: Array.isArray(saved.rewardedIds) ? saved.rewardedIds.map(String) : [],
    };
  } catch {
    return { score: 0, rewardedIds: [] };
  }
};
const saveScoreData = (value) => {
  try { localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(value)); } catch {}
};
const scoreLabel = () => ({ pt: "Pontuação", en: "Score", es: "Puntuación", de: "Punktestand", tr: "Skor" }[state.lang] || "Pontuação");
const updateScoreDisplay = () => {
  const saved = scoreData();
  document.querySelectorAll("[data-score-value]").forEach((node) => { node.textContent = saved.score.toLocaleString(state.lang === "pt" ? "pt-BR" : state.lang); });
  document.querySelectorAll("[data-score-label]").forEach((node) => { node.textContent = scoreLabel(); });
};
const awardScore = (rewardId) => {
  const id = String(rewardId || "");
  if (!id) return false;
  const saved = scoreData();
  if (saved.rewardedIds.includes(id)) return false;
  saved.score += SCORE_PER_REWARD;
  saved.rewardedIds.push(id);
  saveScoreData(saved);
  updateScoreDisplay();
  return true;
};
const isFavorite = (type, id) => favorites()[`${type}s`]?.includes(Number(id));
const toggleFavorite = (type, id) => { const saved = favorites(); const key = `${type}s`; const numericId = Number(id); saved[key] = saved[key] || []; saved[key] = saved[key].includes(numericId) ? saved[key].filter((item) => item !== numericId) : [...saved[key], numericId]; saveFavorites(saved); renderPage(); };
const markOpened = (rewardOrId) => {
  const reward = typeof rewardOrId === "object" && rewardOrId
    ? rewardOrId
    : state.data.rewards.find((item) => String(item.id) === String(rewardOrId));
  const id = String(reward?.id ?? rewardOrId ?? "").trim();
  if (!id) return;
  const identity = rewardOpenedIdentity(reward || { id });
  const saved = opened();
  saved[identity] = {
    reward_id: id,
    reward_key: String(reward?.reward_key || reward?.reward_identity || "").trim(),
    reward_identity: identity,
    game: String(reward?.game_slug || reward?.game || "").trim(),
    game_slug: String(reward?.game_slug || reward?.game || "").trim(),
    url: rewardOpenUrl(reward),
    opened_at: new Date().toISOString(),
    reward: String(reward?.reward_type || reward?.type || reward?.name || reward?.reward_description || "").trim(),
    quantity: String(reward?.reward_amount || reward?.quantity || "").trim(),
  };
  if (id !== identity) delete saved[id];
  saveOpened(saved);
};
const markClaimed = (id) => { const saved = claimedRewards(); saved[id] = new Date().toISOString(); saveClaimedRewards(saved); };
const claimedLabel = () => state.lang === "pt" ? "JÁ RESGATEI" : state.lang === "en" ? "ALREADY CLAIMED" : state.lang === "es" ? "YA RECLAMADO" : state.lang === "de" ? "BEREITS EINGELÖST" : "ZATEN ALINDI";
const markClaimedLabel = () => state.lang === "pt" ? "Marcar como já resgatei" : state.lang === "en" ? "Mark as already claimed" : state.lang === "es" ? "Marcar como reclamado" : state.lang === "de" ? "Als eingelöst markieren" : "Zaten alındı olarak işaretle";
const rewardStatus = (reward) => String(reward?.status || "").toLowerCase();
const isConfirmed = (reward) => rewardStatus(reward) === "confirmed";
const isUnconfirmed = (reward) => rewardStatus(reward) === "unconfirmed";
const isProblem = (reward) => String(reward?.link_status || "").toLowerCase() === "problem";
// Match Masters codes are being kept only as historical records. They must
// always appear expired and must never be offered as usable codes.
const isMatchMastersCodeRecord = (reward) => /match[- ]masters/i.test(String(reward?.game_slug || reward?.game || reward?.game_name || "")) && Boolean(String(reward?.reward_code || "").trim());
const isExpired = (reward) => rewardStatus(reward) === "expired_invalid" || String(reward?.reward_status || "").toLowerCase() === "expired_invalid" || String(reward?.link_status || "").toLowerCase() === "expired" || isMatchMastersCodeRecord(reward);
const isConfirmedReward = (reward) => isConfirmed(reward) && !isExpired(reward) && !isProblem(reward);
const rewardOpenUrl = (reward) => String(reward?.url || reward?.redemption_url || reward?.final_url || reward?.original_url || "").trim();
// A code must open its registered redemption page. A generic discovery/deep
// link can lead to an app download or another in-game action, so it is never
// used as a code-entry destination.
const rewardCodeOpenUrl = (reward) => String(reward?.redemption_url || "").trim();
const isCoinMasterReward = (reward) => String(reward?.game_slug || "").toLowerCase() === "coin-master";
const isLinkActive = (reward) => {
  const coinMasterInvalid = isCoinMasterReward(reward) && ["expired", "problem", "unverified"].includes(String(reward?.link_status || "").toLowerCase());
  return !coinMasterInvalid && !isExpired(reward) && !isProblem(reward) && (rewardIsCode(reward) || Boolean(rewardOpenUrl(reward)));
};
const isAutomaticDiscoveredReward = (reward) => !["catalog_seed", "manual"].includes(String(reward?.discovery_method || "automatic").toLowerCase());
const rewardPublicationStatus = (reward) => String(reward?.publication_status || "").trim().toLowerCase();
const isApprovedReward = (reward) => ["approved", "published"].includes(rewardPublicationStatus(reward));
const isPublishedMatchMastersReward = (reward) => !isMatchMastersReward(reward) || rewardPublicationStatus(reward) === "published";
const isInVerification = (reward) => !isConfirmedReward(reward) && !isExpired(reward) && !isProblem(reward);
const isPublicVisibleGame = (game) => Boolean(game?.active);
const isPublicVisibleSlug = (slug) => Boolean(gameFor(slug)?.active);
const publicGames = () => state.data.games.filter(isPublicVisibleGame);
const publicRewards = () => publicGames().flatMap((game) => publicRewardsForGame(game));
const presentationRewardKey = (reward) => String(reward?.reward_key || reward?.url || reward?.original_url || reward?.final_url || reward?.id || "").trim().replace(/\/+$/, "").toLowerCase();
const publicTodayRewardsForGame = (game) => {
  if (game?.slug === "match-masters") return matchMastersTodayRewards(game);
  const unique = new Map();
  publicRewardsForGame(game).filter((reward) => isAutomaticDiscoveredReward(reward) && isLinkActive(reward) && !(game?.slug === "match-masters" && rewardIsCode(reward)) && isRewardToday(reward)).forEach((reward) => {
    const key = presentationRewardKey(reward);
    const current = unique.get(key);
    const candidateIsBetter = !current || (isConfirmedReward(reward) && !isConfirmedReward(current)) || (isConfirmedReward(reward) === isConfirmedReward(current) && String(reward?.found_at || reward?.created_at || "") > String(current?.found_at || current?.created_at || ""));
    if (candidateIsBetter) unique.set(key, reward);
  });
  return [...unique.values()];
};
const publicTodayRewards = () => publicGames().flatMap((game) => publicTodayRewardsForGame(game));
const publicTodayLabel = (game) => {
  const today = publicTodayRewardsForGame(game);
  const confirmed = today.filter(isConfirmedReward).length;
  const verification = today.filter(isInVerification).length;
  const labels = [];
  if (confirmed) labels.push(`${confirmed} ${confirmed === 1 ? copy().availableGift : copy().availableGifts}`);
  if (verification) labels.push(`${verification} ${copy().verificationGifts}`);
  return labels.join(" · ") || `${copy().noNewGift} · ${copy().autoSearching}`;
};
const publicTodayStatusMarkup = (game) => {
  const today = publicTodayRewardsForGame(game);
  const confirmed = today.filter(isConfirmedReward).length;
  const verification = today.filter(isInVerification).length;
  if (!confirmed && !verification) return `<strong class="no-new-gift-label">${esc(copy().noNewGift)}</strong><small>${esc(copy().autoSearching)}</small>`;
  return `<small>${esc(publicTodayLabel(game))}</small>`;
};
const newsItems = () => Array.isArray(state.data.news) ? state.data.news : [];
const publicNews = () => newsItems().filter((item) => {
  const game = gameFor(item.game_slug);
  if (!game || !isPublicVisibleGame(game)) return false;
  if (!item.ends_at) return true;
  const end = new Date(item.ends_at).getTime();
  return Number.isNaN(end) || end > Date.now();
});
const publicNewsForGame = (game) => publicNews().filter((item) => String(item.game_slug || item.game_id) === String(game?.slug || game?.id)).sort((a, b) => new Date(b.published_at || b.created_at || 0).getTime() - new Date(a.published_at || a.created_at || 0).getTime());
const newsCount = () => publicNews().length;
const rewardIsCode = (reward) => Boolean(String(reward?.reward_code || "").trim());
const rewardTypeKey = (reward) => String(reward?.reward_type || reward?.type || reward?.name || "").toLowerCase();
const usableRewardName = (reward) => {
  const name = String(reward?.name || "").trim();
  return name && !/^(link|reward|recompensa|presente)\s*(de|do|da)?\s*(recompensa|reward|gift)?$/i.test(name) ? name : "";
};
const rewardVisual = (reward) => {
  const value = rewardTypeKey(reward);
  if (/(token|ficha)/i.test(value)) return { key: "tokens", icon: "✦", label: "TOKENS" };
  if (/(ticket|bilhete)/i.test(value)) return { key: "tickets", icon: "▤", label: "TICKETS" };
  if (/(coin|moeda)/i.test(value)) return { key: "coins", icon: "◉", label: "MOEDAS" };
  if (/(credit|crédito)/i.test(value)) return { key: "credits", icon: "◉", label: "CRÉDITOS" };
  if (/(diamond|diamante|gem|gema)/i.test(value)) return { key: "gems", icon: "◆", label: "GEMAS" };
  if (/(rubi|ruby)/i.test(value)) return { key: "rubies", icon: "◆", label: "RUBIS" };
  if (/(booster|reforço)/i.test(value)) return { key: "boosters", icon: "✹", label: "BOOSTERS" };
  if (/(sticker|adesivo)/i.test(value)) return { key: "stickers", icon: "✹", label: "STICKER" };
  if (/(energy|energia)/i.test(value)) return { key: "energy", icon: "ϟ", label: "ENERGIA" };
  if (/(roll|giro|spin|tirada)/i.test(value)) return { key: "rolls", icon: "◌", label: "GIROS" };
  if (/(dice|dado)/i.test(value)) return { key: "dice", icon: "⚄", label: "DADOS" };
  if (/(pack|pacote)/i.test(value)) return { key: "packs", icon: "▣", label: "PACOTE" };
  return null;
};
const matchMastersTypeVisual = (reward) => {
  // The isolated identifier may add a type only when source evidence supports it.
  const explicitType = String(reward?.reward_type || reward?.type || "").trim();
  const identified = identifyMatchMastersReward(reward);
  const typeKey = identified.kind === "identified" ? identified.typeKey : explicitType;
  if (!typeKey || /^(link|reward|recompensa|presente|gift)$/i.test(typeKey)) return null;
  return rewardVisual({ ...reward, name: "", reward_type: typeKey, type: typeKey });
};
const matchMastersQuantity = (reward) => {
  const identified = identifyMatchMastersReward(reward);
  const quantity = String(reward?.reward_amount || reward?.quantity || identified.amount || "").trim();
  const confirmed = isConfirmedReward(reward) || identified.quantityEvidence || reward?.quantity_confirmed === true || Number(reward?.quantity_confirmed) === 1 || Boolean(String(reward?.quantity_source || "").trim());
  return quantity && confirmed ? quantity : "";
};
const isOwnerConfirmedMatchMastersReward = (reward) => String(reward?.reward_description || reward?.source_excerpt || "").includes("GG_MANUAL:owner-confirmed") || String(reward?.id) === "574";
const matchMastersManualOutcome = (reward) => String(reward?.reward_description || "").match(/\bGG_MANUAL:([a-z0-9-]+)/i)?.[1]?.toLowerCase() || "";
const matchMastersMessengerExclusive = (reward) => /GG_CLASSIFICATION:messenger-exclusive|GG_MANUAL:requires-facebook/i.test(String(reward?.reward_description || reward?.source_excerpt || ""));
const matchMastersManualLabel = (reward) => {
  const outcome = matchMastersManualOutcome(reward);
  if (/^invalid-/.test(outcome)) return copy().manualInvalid;
  if (outcome === "confirmed-30") return copy().manualConfirmed30;
  if (outcome === "confirmed-x2") return copy().manualConfirmedX2;
  const item = outcome.match(/^confirmed-item-(\d+)$/);
  if (item) return `Item x${item[1]}`;
  if (outcome === "confirmed-discord-surprise") return copy().manualSurprise;
  return "";
};
const matchMastersManualStatusText = (reward) => {
  if (matchMastersMessengerExclusive(reward)) return copy().messengerExclusive;
  const outcome = matchMastersManualOutcome(reward);
  if (/^invalid-/.test(outcome)) return copy().manualInvalid;
  if (outcome === "requires-facebook") return copy().manualRequiresFacebook;
  if (outcome === "recognized-used") return copy().manualRecognized;
  return "";
};
const matchMastersManualNote = (reward) => {
  if (matchMastersMessengerExclusive(reward)) return copy().messengerExclusiveNote;
  const outcome = matchMastersManualOutcome(reward);
  if (outcome === "requires-facebook") return copy().manualFacebookNote;
  if (outcome === "recognized-used") return copy().manualUsedNote;
  return "";
};
const rewardDisplayText = (reward) => {
  if (isMatchMastersReward(reward)) {
    const visual = matchMastersTypeVisual(reward);
    const manualLabel = matchMastersManualLabel(reward);
    if (!visual && isConfirmedReward(reward) && manualLabel) return `✅ ${copy().confirmed} 🎁 ${manualLabel}`;
    if (!visual) return matchMastersManualStatusText(reward) || unidentifiedRewardLabel();
    const amount = matchMastersQuantity(reward);
    if (isConfirmedReward(reward)) {
      const icon = visual.key === "tickets" ? "🎟️" : visual.key === "coins" ? "🪙" : visual.icon;
      return `✅ ${copy().confirmed} ${icon} ${amount ? `${amount} ` : ""}${visual.label}`;
    }
    return `${copy().identifiedType}: ${amount ? `${amount} ` : ""}${visual.label}`;
  }
  const visual = rewardVisual(reward);
  if (!visual) return "🎁 RECOMPENSA NÃO CONFIRMADA";
  const amount = String(reward?.reward_amount || reward?.quantity || "").trim();
  const description = String(reward?.reward_description || reward?.source_excerpt || "");
  const free = /\bfree\b|grátis|gratis/i.test(description);
  return `${amount ? `${amount} ` : ""}${visual.label}${free ? " GRÁTIS" : ""}`;
};
const sourceUrlFrom = (reward) => String(reward?.source || "").match(/https?:\/\/[^\s·]+/i)?.[0] || "";
const sourceNameFrom = (reward) => {
  const value = String(reward?.source || "").split("·").map((part) => part.trim()).filter(Boolean)[0];
  return value && !/^https?:\/\//i.test(value) && !/game\s*gifts/i.test(value) ? value : copy().unknownSource;
};
const sortRewards = (items) => [...items].sort((a, b) => {
  const dateA = new Date(`${rewardDateKey(a)}T${a.time_label || "00:00"}`).getTime() || new Date(a.created_at || 0).getTime();
  const dateB = new Date(`${rewardDateKey(b)}T${b.time_label || "00:00"}`).getTime() || new Date(b.created_at || 0).getTime();
  return dateB - dateA;
});
const sortCodes = (items) => sortRewards(items).sort((a, b) => Number(isExpired(a)) - Number(isExpired(b)) || Number(isProblem(a)) - Number(isProblem(b)));
const countLabel = (gameId) => publicTodayLabel(gameFor(gameId));
const availableLabel = (count) => count === 1 ? (state.lang === "pt" ? "link" : state.lang === "en" ? "link" : state.lang === "es" ? "enlace" : state.lang === "de" ? "Link" : "bağlantı") : (state.lang === "pt" ? "links" : state.lang === "en" ? "links" : state.lang === "es" ? "enlaces" : state.lang === "de" ? "Links" : "bağlantı");
const todayCountLabel = (count) => count ? `${count} ${state.lang === "pt" ? "HOJE" : state.lang === "en" ? "TODAY" : state.lang === "es" ? "HOY" : state.lang === "de" ? "HEUTE" : "BUGÜN"}` : copy().noneToday;
const lastCheckedLabel = () => state.lang === "pt" ? "Última verificação" : state.lang === "en" ? "Last check" : state.lang === "es" ? "Última comprobación" : state.lang === "de" ? "Letzte Prüfung" : "Son kontrol";
const adminStatusValue = (reward) => isProblem(reward) ? "problem_unconfirmed" : ["confirmed", "unconfirmed", "expired_invalid"].includes(rewardStatus(reward)) ? rewardStatus(reward) : "unconfirmed";
const confirmationData = (reward) => {
  const confirmation = reward?.confirmation || {};
  const worked = Math.max(0, Number(confirmation.worked || 0));
  const failed = Math.max(0, Number(confirmation.failed || 0));
  const recentFailed = Math.max(0, Number(confirmation.recent_failed ?? failed));
  const status = confirmation.status || (recentFailed >= 3 && recentFailed > worked ? "may_expired" : worked >= 3 && worked > failed ? "confirmed" : "unconfirmed");
  return { worked, failed, recentFailed, status, myVote: confirmation.my_vote || null, gameMyVote: confirmation.game_my_vote || null };
};
const playerConfirmationMarkup = (reward) => {
  const confirmation = confirmationData(reward);
  const ownerConfirmed = isOwnerConfirmedMatchMastersReward(reward) && isConfirmedReward(reward);
  const statusLabel = ownerConfirmed ? "✅ RECOMPENSA CONFIRMADA" : confirmation.status === "confirmed" ? copy().playerConfirmed : confirmation.status === "may_expired" ? copy().playerMayExpired : copy().playerUnconfirmed;
  const statusClass = ownerConfirmed || confirmation.status === "confirmed" ? "confirmed" : confirmation.status === "may_expired" ? "may-expired" : "unconfirmed";
  const voted = Boolean(confirmation.myVote || confirmation.gameMyVote);
  const ownerConfirmationNote = ownerConfirmed ? `<span class="player-vote-note owner-confirmation-note">Confirmado pelo proprietário no jogo</span>` : "";
  const voteLock = confirmation.gameMyVote && !confirmation.myVote ? `<span class="player-vote-note">🔒 ${esc(copy().playerAlreadyVoted)}</span>` : "";
  return `<div class="reward-confirmation" data-reward-confirmation="${esc(reward.id)}"><strong class="player-confirmation-status ${statusClass}">${esc(statusLabel)}</strong>${ownerConfirmationNote}<div class="player-confirmation-counts"><span>${esc(copy().playerWorkedCount(confirmation.worked))}</span><span>${esc(copy().playerFailedCount(confirmation.failed))}</span></div><div class="player-vote-actions" role="group" aria-label="${esc(state.lang === "pt" ? "Confirmar recompensa" : state.lang === "en" ? "Confirm reward" : state.lang === "es" ? "Confirmar recompensa" : state.lang === "de" ? "Belohnung bestätigen" : "Ödülü onayla")}"><button type="button" class="player-vote-button worked ${confirmation.myVote === "worked" ? "selected" : ""}" data-reward-vote="worked" data-reward-id="${esc(reward.id)}" ${voted ? "disabled" : ""}>👍 ${esc(copy().playerWorked)}</button><button type="button" class="player-vote-button failed ${confirmation.myVote === "failed" ? "selected" : ""}" data-reward-vote="failed" data-reward-id="${esc(reward.id)}" ${voted ? "disabled" : ""}>👎 ${esc(copy().playerFailed)}</button></div>${voteLock}</div>`;
};
const route = () => {
  const pathname = location.pathname.startsWith(SITE_PATH) ? location.pathname.slice(SITE_PATH.length) || "/" : location.pathname;
  const parts = pathname.split("/").filter(Boolean);
  const lang = LANGS.includes(parts[0]) ? parts[0] : state.lang;
  const translated = SECTION_NAMES[lang];
  const queryParams = new URLSearchParams(location.search);
  if (queryParams.get("settings") === "1") return { lang, page: "settings" };
  if (queryParams.get("recent") === "1" && !parts.length) return { lang, page: "news" };
  const permanentPath = `/${parts.join("/")}/`;
  if (GAME_SEO_PATHS[permanentPath]) return isPublicVisibleSlug(GAME_SEO_PATHS[permanentPath]) ? { lang, page: "game", slug: GAME_SEO_PATHS[permanentPath], permanent: true } : { lang, page: "home", noindex: true };
  const bareAliases = { noticias: "news", news: "news", guias: "guides", guides: "guides", codigos: "codes", codes: "codes", eventos: "events", events: "events", "como-resgatar": "howTo", "how-to-redeem": "howTo", problemas: "problems", problems: "problems", "jogos-relacionados": "related", "related-games": "related" };
  if (!LANGS.includes(parts[0])) {
    if (bareAliases[parts[0]] === "events" && parts[1] && parts[2]) return { lang, page: "event", gameSlug: parts[1], slug: parts[2], eventSlug: parts[2] };
    return bareAliases[parts[0]] ? { lang, page: bareAliases[parts[0]], slug: parts[1] || "" } : { lang, page: "home" };
  }
  if (!parts[1]) return { lang, page: "home" };
  if (parts[1] === translated.games) return parts[2] ? (isPublicVisibleSlug(parts[2]) ? { lang, page: "game", slug: parts[2] } : { lang, page: "home", noindex: true }) : { lang, page: "games" };
  if (parts[1] === translated.news) return { lang, page: "news", slug: parts[2] || queryParams.get("story") || "" };
  if (parts[1] === translated.guides) return { lang, page: "guides", slug: parts[2] || queryParams.get("game") || "" };
  if (parts[1] === translated.codes) return { lang, page: "codes", slug: parts[2] || "" };
  if (parts[1] === translated.events) {
    if (parts[2] && parts[3]) return { lang, page: "event", gameSlug: parts[2], slug: parts[3], eventSlug: parts[3] };
    return { lang, page: "events", slug: parts[2] || "" };
  }
  if (parts[1] === translated.favorites) return { lang, page: "favorites" };
  if (parts[1] === translated.more) return { lang, page: "more" };
  if (parts[1] === translated.play) return { lang, page: "play" };
  if (parts[1] === translated.profile) return { lang, page: "profile" };
  if (parts[1] === translated.ranking) return { lang, page: "ranking" };
    if (parts[1] === translated.settings) return { lang, page: "settings" };
    if (parts[1] === translated.admin) return { lang, page: "admin" };
  if (parts[1] === translated.howTo) return { lang, page: "howTo", slug: parts[2] || "" };
  if (parts[1] === translated.problems) return { lang, page: "problems", slug: parts[2] || "" };
  if (parts[1] === translated.related) return { lang, page: "related", slug: parts[2] || "" };
  return { lang, page: "home" };
};
const pathFor = (page, slug = "", lang = state.lang) => {
  if (page === "home") return sitePath(`/${lang}/`);
  if (page === "settings") return `${sitePath(`/${lang}/`)}?settings=1`;
  // Keep the permanent SEO route for English, while preserving each
  // localized route when the visitor changes language.
  if (page === "games" && slug && GAME_SEO[slug] && lang === "en") return sitePath(GAME_SEO[slug].path);
  const fallbackSection = PUBLIC_ROUTE_FALLBACKS[lang]?.[page];
  const section = fallbackSection || SECTION_NAMES[lang][page] || page;
  // Detail pages for editorial content share the public section document.
  // Query routes keep direct access working on static deployments where a
  // nested /section/slug/index.html does not exist.
  if (page === "news" && slug) return `${sitePath(`/${lang}/${section}/`)}?story=${encodeURIComponent(slug)}`;
  if (page === "guides" && slug) return `${sitePath(`/${lang}/${section}/`)}?game=${encodeURIComponent(slug)}`;
  if (page === "event" && slug) {
    const [gameSlug, eventSlug] = String(slug).split("/");
    return sitePath(`/${lang}/${SECTION_NAMES[lang].events}/${gameSlug || ""}/${eventSlug || ""}/`);
  }
  return sitePath(`/${lang}/${section}/${slug ? `${slug}/` : ""}`);
};
const legalPath = (page) => {
  const routes = { privacy: "politica-de-privacidade", terms: "termos-de-uso", contact: "contato" };
  return sitePath(`/pt/${routes[page] || routes.privacy}/`);
};
const go = (path) => { const currentPath = `${location.pathname}${location.search}`; if (currentPath !== path) { state.navigationStack.push(currentPath); if (state.navigationStack.length > 32) state.navigationStack.shift(); } history.pushState({}, "", path); state.tab = "today"; state.centralTab = "guides"; state.gameSection = "rewards"; state.selectedDate = ""; const current = route(); state.lang = current.lang; const languageSelect = document.querySelector("#language-select"); if (languageSelect) languageSelect.value = state.lang; closeDrawer(); renderPage(); window.scrollTo({ top: 0, behavior: "smooth" }); };
const goBack = (fallback) => {
  const currentPath = `${location.pathname}${location.search}`;
  const previousPath = state.navigationStack.pop();
  const destination = previousPath && previousPath !== currentPath ? previousPath : fallback;
  state.backRequested = false;
  history.replaceState({}, "", destination);
  state.tab = "today";
  state.centralTab = "guides";
  state.gameSection = "rewards";
  state.selectedDate = "";
  const current = route();
  state.lang = current.lang;
  closeDrawer();
  renderPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
};
const gameFor = (slug) => state.data.games.find((game) => game.slug === slug);
const rewardsFor = (gameId) => state.data.rewards.filter((reward) => Number(reward.game_id) === Number(gameId));
const publicEvents = () => (Array.isArray(state.data.events) ? state.data.events : []).filter((event) => event && event.publication_status !== "rejected");
const eventsForGame = (game) => publicEvents().filter((event) => String(event.game_slug || event.game_id) === String(game?.slug || game?.id));
const eventStatusKey = (event) => {
  const end = event?.end_date ? Date.parse(event.end_date) + (String(event.end_date).length === 10 ? 86400000 - 1 : 0) : NaN;
  const start = event?.start_date ? Date.parse(event.start_date) : NaN;
  const now = Date.now();
  if (Number.isFinite(end) && end < now) return "ended";
  if (Number.isFinite(start) && start > now) return "upcoming";
  return Number.isFinite(start) ? "active" : String(event?.status || "upcoming");
};
const eventStatusText = (status) => state.lang === "pt" ? ({ active: "ACONTECENDO AGORA", upcoming: "COMEÇA EM BREVE", ended: "ENCERRADO" }[status] || "STATUS NÃO INFORMADO") : state.lang === "en" ? ({ active: "HAPPENING NOW", upcoming: "STARTS SOON", ended: "ENDED" }[status] || "STATUS UNKNOWN") : ({ active: "ACONTECIENDO AHORA", upcoming: "COMIENZA PRONTO", ended: "FINALIZADO" }[status] || "ESTADO NO INFORMADO");
const eventDateText = (value, fallback = "Data não informada") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat(state.lang === "pt" ? "pt-BR" : state.lang, { dateStyle: "medium" }).format(date);
};
const eventPeriodText = (event) => {
  const start = eventDateText(event?.start_date, "Data de início não informada");
  const end = event?.end_date ? eventDateText(event.end_date, "Data final não informada") : "Data final não informada";
  return `${start} — ${end}`;
};
const eventCard = (event, compact = false) => {
  const game = gameFor(event.game_slug);
  const status = eventStatusKey(event);
  const href = game ? pathFor("event", `${game.slug}/${event.slug || event.event_id}`) : pathFor("events");
  const image = event.image ? `<img src="${esc(assetUrl(event.image))}" alt="" loading="lazy" />` : game ? gameArt(game, "portal-event-art") : "<span>🔥</span>";
  return `<article class="event-card ${compact ? "is-compact" : ""} event-status-${status}"><a class="event-card-link" href="${href}" data-route><div class="event-card-art">${image}<span class="event-card-status">${status === "active" ? "🔴" : status === "upcoming" ? "🟡" : "⚪"} ${esc(eventStatusText(status))}</span></div><div class="event-card-body"><span class="event-card-game">${esc(game?.name || event.game_name || "")}</span><h2>${esc(event.title || event.name || "Evento")}</h2>${event.description ? `<p>${esc(event.description)}</p>` : ""}<small>${esc(eventPeriodText(event))}</small><strong>VER EVENTO <b>→</b></strong></div></a></article>`;
};
const isMatchMastersReward = (reward) => String(reward?.game_slug || "") === "match-masters" || Number(reward?.game_id) === Number(gameFor("match-masters")?.id);
const matchMastersDetectedAt = (reward) => String(reward?.found_at || reward?.published_at || reward?.created_at || "").trim();
const matchMastersLegacyDetectedDateKey = (reward) => {
  const detectedAt = matchMastersDetectedAt(reward);
  return detectedAt ? localDateKey(detectedAt) : "";
};
const matchMastersDetectedDateKey = (reward) => {
  // date_key/source_date is the publication date. found_at is only a
  // collection timestamp and must not make an old link look new today.
  const publishedDate = String(reward?.date_key || reward?.source_date || reward?.published_date || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(publishedDate)) return publishedDate;
  const detectedAt = matchMastersDetectedAt(reward);
  return detectedAt ? localDateKey(detectedAt) : "";
};
const matchMastersDetectedTimeKey = (reward) => {
  const detectedAt = matchMastersDetectedAt(reward);
  if (detectedAt) {
    const parsed = new Date(detectedAt);
    if (!Number.isNaN(parsed.getTime())) return `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`;
  }
  return String(reward?.time_label || "").slice(0, 5);
};
const matchMastersPcode = (reward) => {
  const values = [reward?.reward_code, reward?.reward_key, reward?.original_url, reward?.url, reward?.final_url].map((value) => String(value || ""));
  for (const value of values) {
    try {
      const parsed = new URL(value.replace(/^url:/i, ""));
      const pcode = parsed.searchParams.get("pcode") || parsed.searchParams.get("reward_code") || parsed.searchParams.get("c");
      if (pcode) return decodeURIComponent(pcode).trim().toLowerCase();
      const pathCode = parsed.hostname.toLowerCase() === "launch.matchmasters.com" ? parsed.pathname.split("/").filter(Boolean).at(-1) : "";
      if (pathCode) return decodeURIComponent(pathCode).trim().toLowerCase();
    } catch {}
    const match = value.match(/(?:pcode|reward_code|[?&]c)=([^&]+)/i);
    if (match?.[1]) return decodeURIComponent(match[1]).trim().toLowerCase();
  }
  return "";
};
const matchMastersRewardDescriptor = (reward) => {
  const type = String(reward?.reward_type || reward?.type || "").trim().toLowerCase().replace(/\s+/g, " ");
  const amount = String(reward?.reward_amount || reward?.quantity || "").trim().toLowerCase();
  const name = usableRewardName(reward).toLowerCase().replace(/\s+/g, " ");
  return [type, amount, name].filter(Boolean).join("|") || "unknown";
};
const matchMastersRecordIdentity = (reward) => {
  const rewardKey = String(reward?.reward_key || "").trim().toLowerCase();
  const pcode = matchMastersPcode(reward);
  const base = pcode ? `pcode:${pcode}` : rewardKey || `url:${String(reward?.final_url || reward?.original_url || reward?.url || reward?.id || "").trim().toLowerCase()}`;
  // The collection time is not part of a reward's identity: the same link
  // can be found more than once during a scan. Keep date and reward details
  // so distinct Match Masters rewards sharing a destination remain separate.
  return [base, matchMastersDetectedDateKey(reward), matchMastersRewardDescriptor(reward)].join("|");
};
const matchMastersCodeRecordIdentity = (reward) => {
  const rewardKey = String(reward?.reward_key || "").trim().toLowerCase();
  const pcode = matchMastersPcode(reward);
  const base = pcode ? `pcode:${pcode}` : rewardKey || `url:${String(reward?.final_url || reward?.original_url || reward?.url || reward?.id || "").trim().toLowerCase()}`;
  return [base, matchMastersLegacyDetectedDateKey(reward), matchMastersDetectedTimeKey(reward), matchMastersRewardDescriptor(reward)].join("|");
};
const matchMastersOfferKey = (reward) => {
  // Match Masters can reuse the same destination for different prizes. Keep
  // the pcode/reward_key, detection date/time and reward descriptor together;
  // URL alone is never the identity.
  return rewardIsCode(reward) ? `code|${matchMastersCodeRecordIdentity(reward)}` : matchMastersRecordIdentity(reward);
};
const freshnessScore = (reward) => new Date(reward?.found_at || reward?.created_at || 0).getTime() || new Date(`${rewardDateKey(reward)}T${reward?.time_label || "00:00"}`).getTime() || 0;
const matchMastersPublicRewards = (gameId) => {
  const unique = new Map();
  rewardsFor(gameId).filter((reward) => String(reward?.discovery_method || "automatic").toLowerCase() !== "catalog_seed" && isPublishedMatchMastersReward(reward)).forEach((reward) => {
    const key = matchMastersOfferKey(reward);
    const current = unique.get(key);
    if (!current || freshnessScore(reward) > freshnessScore(current)) unique.set(key, reward);
  });
  return [...unique.values()];
};
const matchMastersTodayRewards = (game) => matchMastersPublicRewards(game.id)
  .filter((reward) => {
    if (rewardIsCode(reward) || matchMastersDetectedDateKey(reward) !== todayKey()) return false;
    const manualOutcome = matchMastersManualOutcome(reward);
    return isLinkActive(reward) || /^invalid-/.test(manualOutcome);
  });
const publicRewardsForGame = (game) => {
  const rewards = (game?.slug === "match-masters" ? matchMastersPublicRewards(game.id) : rewardsFor(game?.id).filter((reward) => String(reward?.discovery_method || "automatic").toLowerCase() !== "catalog_seed"))
    .filter(isApprovedReward)
    .filter((reward) => rewardIsCode(reward) || Boolean(rewardOpenUrl(reward)));
  if (game?.slug !== "coin-master") return rewards;
  const unique = new Map();
  rewards.forEach((reward) => {
    const key = String(reward?.reward_identifier || reward?.reward_key || reward?.url || reward?.id || "").trim().toLowerCase();
    const current = unique.get(key);
    const better = !current
      || (isConfirmedReward(reward) && !isConfirmedReward(current))
      || (isConfirmedReward(reward) === isConfirmedReward(current) && String(reward?.found_at || reward?.created_at || "") > String(current?.found_at || current?.created_at || ""));
    if (better) unique.set(key, reward);
  });
  return [...unique.values()];
};
const availableRewards = (gameId) => sortRewards(publicRewardsForGame(gameFor(gameId)).filter(isLinkActive));
const matchMastersArt = (className) => `<div class="${className} match-masters-art" aria-hidden="true"><span class="match-masters-spark spark-one">✦</span><span class="match-masters-spark spark-two">◆</span><span class="match-masters-wordmark">MATCH <b>MASTERS</b></span><span class="match-masters-gem gem-one">◆</span><span class="match-masters-gem gem-two">◆</span><span class="match-masters-gem gem-three">◆</span></div>`;
const gameArt = (game, className = "card-art") => {
  const image = game?.image || game?.banner;
  const isSmallArt = /(?:card-art|carousel|portal-|home-|recent-gifts|other-game|game-info)/i.test(className);
  const imageForUse = isSmallArt ? (OPTIMIZED_GAME_IMAGES[image] || image) : image;
  return image ? `<div class="${className}" ${artStyle(game?.slug)}><img src="${esc(assetUrl(imageForUse))}" alt="${esc(game?.name)}" loading="lazy" decoding="async" /></div>` : game?.slug === "match-masters" ? matchMastersArt(className) : `<div class="${className}" ${artStyle(game?.slug)}><span class="card-art-placeholder">✦</span><span class="logo-word">${esc(game?.name)}</span></div>`;
};
const rewardImageUrl = (reward) => {
  const image = String(reward?.image || "").trim();
  // Uploaded screenshots are not reward artwork and must never represent a new gift.
  return image && !/(?:^|\/)Screenshot_[^/]+/i.test(image) ? image : "";
};
const unidentifiedRewardLabel = () => ({ pt: "Recompensa não confirmada", en: "Reward not confirmed", es: "Recompensa no confirmada", de: "Belohnung nicht bestätigt", tr: "Ödül doğrulanmadı" }[state.lang] || "Reward not confirmed");
const codeRewardVisual = () => ({ key: "code", icon: "⌘", label: state.lang === "pt" ? "CÓDIGO" : state.lang === "en" ? "CODE" : state.lang === "es" ? "CÓDIGO" : state.lang === "de" ? "CODE" : "KOD" });
const rewardArt = (reward, game) => {
  const visual = rewardIsCode(reward) ? codeRewardVisual() : (isMatchMastersReward(reward) ? matchMastersTypeVisual(reward) : rewardVisual(reward));
  const image = rewardImageUrl(reward);
  const code = String(reward?.reward_code || "").trim();
  if (visual?.key === "code" && !image) {
    const label = code ? visual.label : (state.lang === "pt" ? "CÓDIGO INDISPONÍVEL" : state.lang === "en" ? "CODE UNAVAILABLE" : state.lang === "es" ? "CÓDIGO NO DISPONIBLE" : state.lang === "de" ? "CODE NICHT VERFÜGBAR" : "KOD MEVCUT DEĞİL");
    return code
      ? `<button type="button" class="reward-art reward-art-code reward-code-copy-card" data-copy-code="${esc(code)}" aria-label="${esc(state.lang === "pt" ? "Copiar código" : "Copy code")}"><span class="reward-icon">${visual.icon}</span><span class="reward-art-label">${esc(label)}</span></button>`
      : `<div class="reward-art reward-art-code reward-code-copy-card is-disabled" aria-disabled="true"><span class="reward-icon">${visual.icon}</span><span class="reward-art-label">${esc(label)}</span></div>`;
  }
  if (image) return '<div class="reward-art reward-art--official" ' + artStyle(reward?.name || reward?.type || "reward") + '><img src="' + esc(assetUrl(image)) + '" alt="' + esc(usableRewardName(reward) || visual?.label || "Recompensa oficial") + '" loading="lazy" decoding="async" /></div>';
  if (visual) return '<div class="reward-art reward-art-' + visual.key + '" aria-label="' + esc(visual.label) + '"><span class="reward-icon">' + visual.icon + '</span><span class="reward-art-label">' + esc(visual.label) + '</span></div>';
  return '<div class="reward-art reward-art-generic" ' + artStyle("reward") + ' aria-label="' + esc(unidentifiedRewardLabel()) + '"><span class="reward-icon">🎁</span><span class="reward-art-label">' + esc(unidentifiedRewardLabel()) + '</span></div>';
};
const emptyState = (title, message, icon = "✦") => `<div class="empty"><span class="empty-icon">${icon}</span><h3>${esc(title)}</h3><p>${esc(message)}</p></div>`;
const filteredGames = () => { const term = state.search.trim().toLocaleLowerCase(); const games = publicGames(); return term ? games.filter((game) => `${game.name || ""} ${game.slug || ""} ${publicRewardsForGame(game).map((reward) => `${reward.reward_type || ""} ${reward.reward_code || ""} ${reward.name || ""}`).join(" ")}`.toLocaleLowerCase().includes(term)) : games; };
const homeNewCountLabel = (count) => {
  if (state.lang === "pt") return `${count} ${count === 1 ? "novo presente" : "novos presentes"} hoje`;
  if (state.lang === "en") return `${count} new gift${count === 1 ? "" : "s"} today`;
  if (state.lang === "es") return `${count} regalo${count === 1 ? " nuevo" : "s nuevos"} hoy`;
  if (state.lang === "de") return `${count} neue${count === 1 ? "s Geschenk" : " Geschenke"} heute`;
  return `${count} yeni hediye bugün`;
};
const homeSearchingCopy = () => {
  if (state.lang === "en") return ["Looking for new gifts", "New links are checked automatically. Check again soon."];
  if (state.lang === "es") return ["Buscando nuevos regalos", "Los enlaces nuevos se verifican automáticamente. Vuelve a consultar pronto."];
  if (state.lang === "de") return ["Neue Geschenke werden gesucht", "Neue Links werden automatisch geprüft. Schau bald wieder vorbei."];
  if (state.lang === "tr") return ["Yeni hediyeler aranıyor", "Yeni bağlantılar otomatik olarak kontrol edilir. Yakında tekrar bakın."];
  return ["Buscando novos presentes", "Novos links são verificados automaticamente. Confira novamente em breve."];
};
const HOME_COPY = {
  pt: { subtitle: "Presentes grátis dos seus jogos favoritos", recentTitle: "ACABOU DE CHEGAR", recentCopy: "Presentes encontrados recentemente. Seja rápido!", seeAll: "Ver todos", gamesTitle: "JOGOS DISPONÍVEIS", gamesCopy: "Escolha um jogo e veja todos os presentes disponíveis.", redeem: "RESGATAR", newBadge: "NOVO", noRecent: "Nenhum presente novo no momento. Estamos verificando novos links.", hasToday: "🟢 Tem presente hoje", noToday: "⚪ Sem presentes hoje", unknownType: "Recompensa" },
  en: { subtitle: "Your game gifts in one place", recentTitle: "JUST IN", recentCopy: "Recently found gifts. Be quick!", seeAll: "View all", gamesTitle: "AVAILABLE GAMES", gamesCopy: "Choose a game and see all available gifts.", redeem: "REDEEM", newBadge: "NEW", noRecent: "No new gifts right now. We are checking for new links.", hasToday: "🟢 Gift available today", noToday: "⚪ No gifts today", unknownType: "Reward" },
  es: { subtitle: "Tus regalos de juegos en un solo lugar", recentTitle: "RECIÉN LLEGADOS", recentCopy: "Regalos encontrados recientemente. ¡Date prisa!", seeAll: "Ver todos", gamesTitle: "JUEGOS DISPONIBLES", gamesCopy: "Elige un juego y consulta todos los regalos disponibles.", redeem: "CANJEAR", newBadge: "NUEVO", noRecent: "No hay regalos nuevos ahora. Estamos buscando nuevos enlaces.", hasToday: "🟢 Hay regalo hoy", noToday: "⚪ Sin regalos hoy", unknownType: "Recompensa" },
  de: { subtitle: "Deine Spielgeschenke an einem Ort", recentTitle: "GERADE EINGETROFFEN", recentCopy: "Kürzlich gefundene Geschenke. Sei schnell!", seeAll: "Alle ansehen", gamesTitle: "VERFÜGBARE SPIELE", gamesCopy: "Wähle ein Spiel und sieh dir alle verfügbaren Geschenke an.", redeem: "EINLÖSEN", newBadge: "NEU", noRecent: "Momentan keine neuen Geschenke. Wir prüfen neue Links.", hasToday: "🟢 Heute Geschenk verfügbar", noToday: "⚪ Heute keine Geschenke", unknownType: "Belohnung" },
  tr: { subtitle: "Oyun hediyeleriniz tek bir yerde", recentTitle: "AZ ÖNCE GELDİ", recentCopy: "Yakın zamanda bulunan hediyeler. Çabuk olun!", seeAll: "Tümünü gör", gamesTitle: "MEVCUT OYUNLAR", gamesCopy: "Bir oyun seçin ve tüm mevcut hediyeleri görün.", redeem: "AL", newBadge: "YENİ", noRecent: "Şu anda yeni hediye yok. Yeni bağlantıları kontrol ediyoruz.", hasToday: "🟢 Bugün hediye var", noToday: "⚪ Bugün hediye yok", unknownType: "Ödül" },
};
Object.assign(HOME_COPY, {
  pt: { ...HOME_COPY.pt, recentCopy: "Links, códigos e recompensas reais mais recentes.", noRecent: "Nenhum presente novo por enquanto." },
  en: { ...HOME_COPY.en, recentCopy: "The latest real links, codes and rewards.", noRecent: "No new gifts for now." },
  es: { ...HOME_COPY.es, recentCopy: "Los enlaces, códigos y recompensas reales más recientes.", noRecent: "Ningún regalo nuevo por ahora." },
  de: { ...HOME_COPY.de, recentCopy: "Die neuesten echten Links, Codes und Belohnungen.", noRecent: "Momentan keine neuen Geschenke." },
  tr: { ...HOME_COPY.tr, recentCopy: "En yeni gerçek bağlantılar, kodlar ve ödüller.", noRecent: "Şimdilik yeni hediye yok." },
});
const homeCopy = () => HOME_COPY[state.lang] || HOME_COPY.en;
const HOME_RECENT_WINDOW_MS = 48 * 60 * 60 * 1000;
const rewardFoundAt = (reward) => reward?.found_at || reward?.created_at || "";
const isRecentHomeReward = (reward) => {
  if (rewardIsOpened(reward) || !isPublishedMatchMastersReward(reward) || !isLinkActive(reward)) return false;
  const sourceDate = rewardDateKey(reward);
  const timestamp = sourceDate ? new Date(`${sourceDate}T12:00:00Z`).getTime() : NaN;
  return Boolean(timestamp) && timestamp <= Date.now() && Date.now() - timestamp <= HOME_RECENT_WINDOW_MS;
};
const recentHomeRewards = () => {
  const unique = new Map();
  publicRewards().filter(isRecentHomeReward).forEach((reward) => {
    const key = `${reward.game_slug || reward.game_id}:${presentationRewardKey(reward)}`;
    const current = unique.get(key);
    if (!current || rewardDateKey(reward) > rewardDateKey(current)) unique.set(key, reward);
  });
  return [...unique.values()].sort((a, b) => rewardDateKey(b).localeCompare(rewardDateKey(a)));
};
const activeRewardsForGame = (game) => publicRewardsForGame(game).filter(isLinkActive);
const recentRewardsForGame = (game) => activeRewardsForGame(game).filter(isRecentHomeReward);
const gameAvailabilityLabel = (count) => {
  if (state.lang === "pt") return count === 1 ? "1 presente disponível" : `${count} presentes disponíveis`;
  if (state.lang === "en") return count === 1 ? "1 gift available" : `${count} gifts available`;
  if (state.lang === "es") return count === 1 ? "1 regalo disponible" : `${count} regalos disponibles`;
  if (state.lang === "de") return count === 1 ? "1 Geschenk verfügbar" : `${count} Geschenke verfügbar`;
  return count === 1 ? "1 hediye mevcut" : `${count} hediye mevcut`;
};
const noAvailableGameLabel = () => ({ pt: "Nenhum presente disponível", en: "No gifts available", es: "Sin regalos disponibles", de: "Keine Geschenke verfügbar", tr: "Mevcut hediye yok" }[state.lang] || "No gifts available");
const newRewardLabel = () => ({ pt: "Novo", en: "New", es: "Nuevo", de: "Neu", tr: "Yeni" }[state.lang] || "New");
const recentHomeGames = () => {
  const latestByGame = new Map();
  recentHomeRewards().forEach((reward) => {
    const game = gameFor(reward.game_slug);
    if (!game) return;
    const current = latestByGame.get(game.slug);
    if (!current || new Date(rewardFoundAt(reward)).getTime() > new Date(rewardFoundAt(current.reward)).getTime()) latestByGame.set(game.slug, { game, reward });
  });
  return [...latestByGame.values()].sort((a, b) => new Date(rewardFoundAt(b.reward)).getTime() - new Date(rewardFoundAt(a.reward)).getTime());
};
const recentHomeGameCard = ({ game, reward }) => `<a class="home-recent-game-card" href="${pathFor("games", game.slug)}" data-route data-analytics-game-name="${esc(game.name)}" data-analytics-game-slug="${esc(game.slug)}"><div class="home-recent-game-art">${gameArt(game, "card-art")}</div><span class="home-recent-game-badge">${esc(homeCopy().newBadge)}</span><strong>${esc(game.name)}</strong></a>`;
const homeRewardType = (reward) => {
  const visual = rewardIsCode(reward) ? codeRewardVisual() : (isMatchMastersReward(reward) ? matchMastersTypeVisual(reward) : rewardVisual(reward));
  return visual?.label || usableRewardName(reward) || unidentifiedRewardLabel();
};
const homeArrivalStatus = (reward) => {
  if (isConfirmedReward(reward)) return { label: state.lang === "pt" ? "✓ Verificado" : state.lang === "en" ? "✓ Verified" : state.lang === "es" ? "✓ Verificado" : state.lang === "de" ? "✓ Verifiziert" : "✓ Doğrulandı", className: "is-confirmed" };
  return { label: state.lang === "pt" ? "Não confirmado" : state.lang === "en" ? "Not confirmed" : state.lang === "es" ? "No confirmado" : state.lang === "de" ? "Nicht bestätigt" : "Doğrulanmadı", className: "is-unconfirmed" };
};
const homeTimeAgo = (value) => {
  const timestamp = new Date(value).getTime();
  if (!timestamp) return "";
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
  if (state.lang === "pt") {
    if (minutes < 60) return `há ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours} ${hours === 1 ? "hora" : "horas"}`;
    const days = Math.floor(hours / 24);
    return `há ${days} ${days === 1 ? "dia" : "dias"}`;
  }
  if (state.lang === "en") { if (minutes < 60) return `${minutes}m ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`; return `${Math.floor(hours / 24)}d ago`; }
  if (state.lang === "es") { if (minutes < 60) return `hace ${minutes} min`; const hours = Math.floor(minutes / 60); if (hours < 24) return `hace ${hours} h`; return `hace ${Math.floor(hours / 24)} d`; }
  if (state.lang === "de") { if (minutes < 60) return `vor ${minutes} Min.`; const hours = Math.floor(minutes / 60); if (hours < 24) return `vor ${hours} Std.`; return `vor ${Math.floor(hours / 24)} T.`; }
  if (minutes < 60) return `${minutes} dk önce`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours} sa önce`; return `${Math.floor(hours / 24)} gün önce`;
};
const homeRewardCard = (reward) => {
  const game = gameFor(reward.game_slug);
  if (!game || !reward.url) return "";
  const analytics = ' data-analytics-game-name="' + esc(game.name) + '" data-analytics-gift-name="' + esc(homeRewardType(reward)) + '" data-analytics-reward-id="' + esc(reward.id) + '"';
  return `<article class="home-reward-card"><div class="home-reward-art-wrap"><div class="home-reward-topline"><span class="home-new-badge">${esc(homeCopy().newBadge)}</span><time datetime="${esc(rewardFoundAt(reward))}">◷ ${esc(homeTimeAgo(rewardFoundAt(reward)))}</time></div>${gameArt(game, "card-art home-reward-art")}</div><div class="home-reward-content"><h3>${esc(game.name)}</h3><p><span aria-hidden="true">🎁</span> ${esc(homeRewardType(reward))}</p><a class="home-redeem-button" href="${esc(reward.url)}" target="_blank" rel="noopener noreferrer" data-open-reward="${esc(reward.id)}"${analytics}>${esc(homeCopy().redeem)} <span aria-hidden="true">→</span></a></div></article>`;
};
const homeGameCard = (game) => {
  return gameCard(game, true);
};
const homePremiumStatus = (reward) => {
  if (isExpired(reward)) return { label: state.lang === "pt" ? "EXPIRADO" : "EXPIRED", className: "expired", icon: "" };
  if (rewardIsOpened(reward) || Boolean(claimedRewards()[reward.id])) return { label: state.lang === "pt" ? "JÁ ABERTO" : "ALREADY OPENED", className: "opened", icon: "✓" };
  if (isProblem(reward) || !isConfirmedReward(reward)) return { label: state.lang === "pt" ? "NÃO CONFIRMADO" : "NOT CONFIRMED", className: "unconfirmed", icon: "⚠" };
  if (isRecentHomeReward(reward)) return { label: state.lang === "pt" ? "NOVO" : "NEW", className: "new", icon: "●" };
  return { label: state.lang === "pt" ? "DISPONÍVEL" : "AVAILABLE", className: "available", icon: "🎁" };
};
const homePremiumRewardCard = (reward) => {
  const game = gameFor(reward.game_slug);
  const openUrl = rewardOpenUrl(reward);
  if (!game || !openUrl) return "";
  const status = homePremiumStatus(reward);
  const amount = String(reward?.reward_amount || reward?.quantity || "").trim();
  const rewardLabel = homeRewardType(reward);
  const value = amount ? `${amount} ${rewardLabel}` : rewardLabel;
  const analytics = ` data-analytics-game-name="${esc(game.name)}" data-analytics-gift-name="${esc(rewardLabel)}" data-analytics-reward-id="${esc(reward.id)}"`;
  return `<article class="home-premium-reward-card ${status.className}" data-home-reward-url="${esc(openUrl)}" data-home-reward-id="${esc(reward.id)}"><div class="home-premium-reward-art">${rewardArt(reward, game)}<span class="home-premium-game-pill">🎮 ${esc(game.name)}</span><time datetime="${esc(rewardFoundAt(reward))}">${esc(homeTimeAgo(rewardFoundAt(reward)))}</time></div><div class="home-premium-reward-body"><div class="home-premium-reward-status ${status.className}"><span>${status.icon}</span>${esc(status.label)}</div><h3>${esc(value)}</h3><p>${esc(usableRewardName(reward) || (state.lang === "pt" ? "Recompensa do jogo" : "Game reward"))}</p><a class="home-premium-collect" href="${esc(openUrl)}" target="_blank" rel="noopener noreferrer" data-open-reward="${esc(reward.id)}"${analytics}>🎁 ${esc(homeCopy().redeem)} <span>↗</span></a></div></article>`;
};
const syncHomeBrand = (isHome) => {
  document.querySelectorAll(".site-header .brand").forEach((brand) => {
    const name = brand.querySelector(".brand-name");
    if (!name) return;
    let lockup = brand.querySelector(".brand-lockup");
    if (!isHome && lockup) { lockup.replaceWith(name); lockup = null; }
    if (isHome && !lockup) { lockup = document.createElement("span"); lockup.className = "brand-lockup"; name.replaceWith(lockup); lockup.append(name); }
    let subtitle = lockup?.querySelector(".brand-subtitle");
    if (isHome) {
      if (!subtitle) { subtitle = document.createElement("span"); subtitle.className = "brand-subtitle"; lockup.append(subtitle); }
      subtitle.textContent = homeCopy().subtitle;
    } else if (subtitle) subtitle.remove();
    const mark = brand.querySelector(".brand-mark");
    if (mark) mark.textContent = isHome || route().page === "game" ? "🎁" : "✦";
  });
};
const mobileLabel = () => ({ pt: "Presentes", en: "Gifts", es: "Regalos", de: "Geschenke", tr: "Hediyeler" }[state.lang] || "Gifts");
const drawerCopy = () => ({
  pt: { title: "Menu", home: "Início", games: "Todos os jogos", gifts: "Presentes recentes", news: "Novidades", favorites: "Favoritos e seguindo", more: "Como funciona", settings: "Configurações", close: "Fechar menu" },
  en: { title: "Menu", home: "Home", games: "All games", gifts: "Recent gifts", news: "News", favorites: "Favorites & followed", more: "How it works", settings: "Settings", close: "Close menu" },
  es: { title: "Menú", home: "Inicio", games: "Todos los juegos", gifts: "Regalos recientes", news: "Novedades", favorites: "Favoritos y seguidos", more: "Cómo funciona", settings: "Configuración", close: "Cerrar menú" },
  de: { title: "Menü", home: "Start", games: "Alle Spiele", gifts: "Aktuelle Geschenke", news: "Neuigkeiten", favorites: "Favoriten und gefolgt", more: "So funktioniert es", settings: "Einstellungen", close: "Menü schließen" },
  tr: { title: "Menü", home: "Ana Sayfa", games: "Tüm oyunlar", gifts: "Son hediyeler", news: "Yenilikler", favorites: "Favoriler ve takip", more: "Nasıl çalışır", settings: "Ayarlar", close: "Menüyü kapat" },
}[state.lang] || {});
let drawerTrigger = null;
const closeDrawer = () => {
  document.body.classList.remove("drawer-open");
  document.querySelector(".side-drawer")?.setAttribute("aria-hidden", "true");
  document.querySelectorAll("[data-open-drawer]").forEach((button) => button.setAttribute("aria-expanded", "false"));
  if (drawerTrigger?.isConnected) drawerTrigger.focus({ preventScroll: true });
  drawerTrigger = null;
};
const ensureDrawer = () => {
  let drawer = document.querySelector(".side-drawer");
  if (!drawer) { drawer = document.createElement("div"); drawer.className = "side-drawer"; document.body.append(drawer); }
  drawer.id = "game-gifts-drawer";
  drawer.setAttribute("role", "dialog");
  drawer.setAttribute("aria-modal", "true");
  const ui = drawerCopy();
  const giftsPath = `${pathFor("news")}?recent=1`;
  drawer.innerHTML = `<div class="drawer-backdrop" data-close-drawer></div><aside class="drawer-panel" aria-label="${esc(ui.title)}"><div class="drawer-heading"><div><span class="drawer-kicker">🎁 GAME GIFTS</span><h2>${esc(ui.title)}</h2></div><button class="drawer-close" type="button" data-close-drawer aria-label="${esc(ui.close)}">×</button></div><nav class="drawer-links"><a href="${pathFor("home")}" data-route><span>🏠</span>${esc(ui.home)}</a><a href="${pathFor("games")}" data-route><span>🎮</span>${esc(ui.games)}</a><a href="${giftsPath}" data-route><span>🎁</span>${esc(ui.gifts)}</a><a href="${pathFor("news")}" data-route><span>📰</span>${esc(ui.news)}</a><a href="${pathFor("guides")}" data-route><span>📖</span>${esc(copy().guides)}</a><a href="${pathFor("codes")}" data-route><span>🎟️</span>${esc(copy().codes)}</a><a href="${pathFor("events")}" data-route><span>🔥</span>${esc(copy().events)}</a><a href="${pathFor("favorites")}" data-route><span>⭐</span>${esc(ui.favorites)}</a><a href="${pathFor("more")}" data-route><span>💡</span>${esc(ui.more)}</a><a href="${pathFor("settings")}" data-route><span>⚙️</span>${esc(ui.settings)}</a></nav></aside>`;
  drawer.setAttribute("aria-hidden", document.body.classList.contains("drawer-open") ? "false" : "true");
  return drawer;
};
const openDrawer = () => {
  const drawer = ensureDrawer();
  drawerTrigger = document.querySelector("[data-open-drawer]");
  drawerTrigger?.setAttribute("aria-expanded", "true");
  drawerTrigger?.setAttribute("aria-controls", drawer.id);
  document.body.classList.add("drawer-open");
  drawer.setAttribute("aria-hidden", "false");
  drawer.querySelector(".drawer-close")?.focus({ preventScroll: true });
};
const gameCard = (game, home = false) => {
  const fav = isFavorite("game", game.id);
  const mode = game.reward_mode || "links";
  const gameRewards = publicRewardsForGame(game);
  const activeRewards = activeRewardsForGame(game);
  const hasCodes = gameRewards.some(rewardIsCode);
  const hasLinks = gameRewards.some((reward) => !rewardIsCode(reward));
  const modeLabel = mode === "none" && !hasCodes && !hasLinks ? copy().noneMode : hasCodes && hasLinks ? (state.lang === "pt" ? "🎁 PRESENTES + 🎟️ CÓDIGOS" : state.lang === "en" ? "🎁 GIFTS + 🎟️ CODES" : state.lang === "es" ? "🎁 REGALOS + 🎟️ CÓDIGOS" : state.lang === "de" ? "🎁 GESCHENKE + 🎟️ CODES" : "🎁 HEDİYELER + 🎟️ KODLAR") : hasCodes ? (state.lang === "pt" ? "🎟️ CÓDIGOS" : state.lang === "en" ? "🎟️ CODES" : state.lang === "es" ? "🎟️ CÓDIGOS" : state.lang === "de" ? "🎟️ CODES" : "🎟️ KODLAR") : copy().linksMode;
  const hasRecent = recentRewardsForGame(game).length > 0;
  const availability = activeRewards.length ? gameAvailabilityLabel(activeRewards.length) : noAvailableGameLabel();
  const availabilityMarkup = home && game.slug === "match-masters" ? "" : `<small class="game-availability">${esc(availability)}</small>`;
  const newBadge = hasRecent ? `<small class="home-new-indicator">${esc(newRewardLabel())}</small>` : "";
  return `<a class="game-card ${home ? "home-game-card" : ""}" href="${pathFor("games", game.slug)}" data-route data-analytics-game-name="${esc(game.name)}" data-analytics-game-slug="${esc(game.slug)}" ${artStyle(game.slug)}>
    ${gameArt(game)}<div class="game-card-body"><div class="game-card-title-row"><h3>${esc(game.name)}</h3><span class="card-heart ${fav ? "is-favorite" : ""}">${fav ? "♥" : ""}</span></div>
    <div class="game-meta"><span class="game-card-details"><strong class="mode-chip mode-${mode}">${esc(modeLabel)}</strong>${availabilityMarkup}${newBadge}</span><span class="arrow">›</span></div></div></a>`;
};
const rewardCard = (reward, game, index = null) => {
  const wasOpened = rewardIsOpened(reward);
  const claimed = Boolean(claimedRewards()[reward.id]);
  const matchMasters = isMatchMastersReward(reward);
  const confirmed = isConfirmedReward(reward);
  const unconfirmed = isUnconfirmed(reward);
  const problem = isProblem(reward);
  const expired = isExpired(reward);
  const coinMaster = game?.slug === "coin-master";
  const isNewCoinMasterReward = coinMaster && !wasOpened && !expired && isRewardToday(reward);
  const favorite = isFavorite("reward", reward.id);
  const isCode = rewardIsCode(reward);
  const visual = matchMasters ? matchMastersTypeVisual(reward) : rewardVisual(reward);
  const rewardTitle = problem ? copy().problemUnconfirmed : matchMasters ? usableRewardName(reward) || copy().matchMastersGift : usableRewardName(reward) || (visual ? visual.label : isCode ? copy().codeReward : copy().unconfirmedReward);
  const checkedAt = reward.last_checked_at || reward.verified_at;
  const sourceUrl = sourceUrlFrom(reward);
  const sourceName = sourceNameFrom(reward);
  const source = game?.slug === "coin-master" ? "" : '<span class="reward-source-line">' + esc(copy().sourceLabel || "Fonte") + ': ' + (sourceUrl ? '<a href="' + esc(sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(sourceName) + ' ↗</a>' : '<strong>' + esc(sourceName) + '</strong>') + '</span>';
  const rewardValue = problem ? copy().unavailableReward : isCode ? "" : rewardDisplayText(reward);
  const codeStatusLabel = expired ? (state.lang === "pt" ? "EXPIRADO" : state.lang === "en" ? "EXPIRED" : state.lang === "es" ? "EXPIRADO" : state.lang === "de" ? "ABGELAUFEN" : "SÜRESİ DOLDU") : confirmed ? (state.lang === "pt" ? "ATIVO" : state.lang === "en" ? "ACTIVE" : state.lang === "es" ? "ACTIVO" : state.lang === "de" ? "AKTIV" : "AKTİF") : (state.lang === "pt" ? "PODE EXPIRAR" : state.lang === "en" ? "MAY EXPIRE" : state.lang === "es" ? "PUEDE CADUCAR" : state.lang === "de" ? "KANN ABLAUFEN" : "SÜRESİ DOLABİLİR");
  const statusLabel = problem ? copy().problemUnconfirmed : isCode ? codeStatusLabel : expired ? copy().expiredInvalid : claimed ? claimedLabel() : confirmed ? copy().confirmed : unconfirmed ? copy().unconfirmed : copy().unconfirmed;
  const statusIcon = problem ? "🟠" : expired ? "🔴" : claimed ? "🔵" : confirmed ? "🟢" : unconfirmed ? "🟡" : "🟡";
  const statusClass = problem ? "problem" : expired ? "expired" : claimed ? "claimed" : confirmed ? "confirmed" : unconfirmed ? "unconfirmed" : "unconfirmed";
  const rewardBadgeClass = matchMasters ? `reward-badge-match-${statusClass}` : problem ? "reward-badge-problem" : `reward-badge-${visual?.key || "unknown"}`;
  const rewardBadgeText = matchMasters ? (matchMastersManualStatusText(reward) || statusLabel) : problem ? copy().problemUnconfirmed : isCode ? statusLabel : rewardDisplayText(reward);
  const rewardBadge = `<span class="reward-badge ${rewardBadgeClass}">${esc(rewardBadgeText)}</span>`;
  const analyticsContext = ' data-analytics-game-name="' + esc(game?.name || reward.game_name || '') + '" data-analytics-gift-name="' + esc(rewardTitle) + '" data-analytics-reward-id="' + esc(reward.id) + '"';
  const travelRedeemLabel = state.lang === "pt" ? "RESGATAR" : state.lang === "en" ? "REDEEM" : state.lang === "es" ? "CANJEAR" : state.lang === "de" ? "EINLÖSEN" : "AL";
  const destination = isCode ? rewardCodeOpenUrl(reward) : rewardOpenUrl(reward);
  const destinationUsable = Boolean(destination) && (!isCoinMasterReward(reward) || String(reward?.link_status || "").toLowerCase() === "active");
  const action = problem ? '<span class="open-button disabled">' + esc(copy().problemAction) + '</span>' : expired ? '<span class="open-button disabled">' + esc(copy().expiredStatus || copy().expired) + '</span>' : isCode ? (destinationUsable ? '<a class="open-button redeem-button" href="' + esc(destination) + '" target="_blank" rel="noopener noreferrer" data-redeem-reward="' + esc(reward.id) + '"' + analyticsContext + '>' + esc(copy().officialRedeem) + ' ↗</a>' : '') : (destinationUsable ? '<a class="open-button" href="' + esc(destination) + '" target="_blank" rel="noopener noreferrer" data-open-reward="' + esc(reward.id) + '"' + analyticsContext + '>' + esc(game?.slug === "travel-town" ? travelRedeemLabel : wasOpened ? copy().openAgain : copy().open) + ' ↗</a>' : '<span class="open-button disabled">' + esc(copy().open) + '</span>');
  const rewardCode = String(reward?.reward_code || "").trim();
  const unavailableCodeLabel = state.lang === "pt" ? "Código indisponível" : state.lang === "en" ? "Code unavailable" : state.lang === "es" ? "Código no disponible" : state.lang === "de" ? "Code nicht verfügbar" : "Kod mevcut değil";
  const copyAction = problem || expired ? '' : isCode ? (rewardCode ? '<button class="copy-link copy-code" type="button" data-copy-code="' + esc(rewardCode) + '">' + esc(copy().copyCode) + '</button>' : '<span class="copy-link copy-code is-disabled" aria-disabled="true">' + esc(unavailableCodeLabel) + '</span>') : (destinationUsable ? '<button class="copy-link" type="button" data-copy-url="' + esc(destination) + '"' + analyticsContext + '>' + esc(copy().copyLink) + '</button>' : '');
  const claimedAction = !problem && !expired ? '<button class="copy-link" type="button" data-mark-claimed="' + reward.id + '">' + esc(claimed ? '✓ ' + claimedLabel() : markClaimedLabel()) + '</button>' : '';
  const codeDescription = isCode ? String(reward?.reward_description || reward?.source_excerpt || "").trim() : "";
  const codeRegion = isCode ? String(reward?.region || reward?.redeem_region || "").trim() : "";
  const codeExpiry = isCode ? String(reward?.expires_at || reward?.expires_on || "").trim() : "";
  const value = isCode ? (rewardCode ? '<span class="reward-code-label">' + esc(copy().codeReward) + '</span><strong class="reward-code">' + esc(rewardCode) + '</strong>' + (codeDescription ? '<span class="code-reward-description"><b>' + esc(state.lang === "pt" ? "Recompensa:" : state.lang === "en" ? "Reward:" : state.lang === "es" ? "Recompensa:" : state.lang === "de" ? "Belohnung:" : "Ödül:") + '</b> ' + esc(codeDescription) + '</span>' : '') : '<span class="reward-code-label">' + esc(unavailableCodeLabel) + '</span>') : '<strong>' + esc(rewardValue) + '</strong>';
  const codeDetails = isCode ? (codeRegion ? '<span>' + esc(state.lang === "pt" ? "Região: " : state.lang === "en" ? "Region: " : state.lang === "es" ? "Región: " : state.lang === "de" ? "Region: " : "Bölge: ") + esc(codeRegion) + '</span>' : '') + (codeExpiry ? '<span>' + esc(state.lang === "pt" ? "Expira: " : state.lang === "en" ? "Expires: " : state.lang === "es" ? "Caduca: " : state.lang === "de" ? "Läuft ab: " : "Son kullanma: ") + esc(codeExpiry) + '</span>' : '') : '';
  const verificationNote = unconfirmed && !problem ? '<span class="verification-note">' + esc([game?.slug === "travel-town" ? "Recompensa não confirmada" : copy().unconfirmedReward, matchMasters ? matchMastersManualNote(reward) : ""].filter(Boolean).join(" · ")) + '</span>' : '';
  const itemLabel = Number.isInteger(index) ? '<span class="reward-index">' + esc(copy().giftItem) + ' ' + index + '</span>' : '';
  const rewardAnchor = String(reward.id).replace(/[^a-zA-Z0-9_-]/g, "");
  return '<article id="reward-' + rewardAnchor + '" class="reward-card ' + (matchMasters ? 'reward-card-match-masters ' : '') + (isCode ? 'reward-card-code ' : '') + (problem ? 'reward-card-problem' : '') + '"><div>' + rewardArt(reward, game) + '</div><div class="reward-copy"><h3>' + esc(rewardTitle) + (isNewCoinMasterReward ? '<span class="coin-master-new-badge">NOVO</span>' : '') + '</h3><p class="reward-value ' + (confirmed && !problem ? '' : 'is-unconfirmed') + '">' + value + '</p><div class="reward-details">' + itemLabel + '<span class="reward-status ' + statusClass + '">' + statusIcon + ' ' + esc(statusLabel) + '</span>' + verificationNote + codeDetails + '<span>' + esc(formatRewardDate(reward)) + '</span>' + (checkedAt ? '<span>' + esc(lastCheckedLabel()) + ': ' + esc(timeAgo(checkedAt)) + '</span>' : '') + source + (wasOpened ? '<span class="opened-status">✓ ' + esc(copy().alreadyOpened) + '</span>' : '') + '</div></div><div class="reward-actions">' + rewardBadge + action + copyAction + claimedAction + '<button class="icon-button reward-favorite ' + (favorite ? 'is-favorite' : '') + '" type="button" title="' + esc(favorite ? copy().unfavorite : copy().favorite) + '" data-favorite-type="reward" data-favorite-id="' + reward.id + '">' + (favorite ? '♥' : '♡') + '</button></div>' + playerConfirmationMarkup(reward) + '</article>';
};
const seoForGame = (slug) => {
  const known = GAME_SEO[slug]?.[state.lang] || GAME_SEO[slug]?.en;
  if (known) return known;
  const game = gameFor(slug);
  const name = game?.name || String(slug || "").split("-").filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join(" ") || "Game Gifts";
  const localized = GENERIC_GAME_SEO_COPY[state.lang] || GENERIC_GAME_SEO_COPY.en;
  return {
    path: `/${state.lang}/${SECTION_NAMES[state.lang]?.games || "games"}/${slug}/`,
    title: localized.title(name),
    h1: localized.h1(name),
    description: localized.description(name),
    intro: localized.intro(name),
  };
};
const setMetaContent = (selector, content) => {
  let node = document.querySelector(selector);
  if (!node) {
    node = document.createElement("meta");
    const [attr, value] = selector.match(/\[(name|property)="([^"]+)"\]/).slice(1);
    node.setAttribute(attr, value);
    document.head.appendChild(node);
  }
  node.content = content;
};
const updateSeo = (current) => {
  const gameSeo = current.page === "game" ? seoForGame(current.slug) : null;
  const currentGame = current.page === "game" ? gameFor(current.slug) : null;
  const currentEventGame = current.page === "event" ? gameFor(current.gameSlug) : null;
  const currentEvent = current.page === "event" ? publicEvents().find((item) => item.game_slug === current.gameSlug && (item.slug === current.eventSlug || item.event_id === current.eventSlug)) : null;
  const eventSeo = currentEvent ? { title: `${currentEvent.title} | ${currentEventGame?.name || "Game Gifts"}`, description: currentEvent.description || `Evento confirmado de ${currentEventGame?.name || "um jogo"} com período, situação e fonte oficial.`, h1: currentEvent.title } : null;
  const canonicalPath = gameSeo
    ? (current.permanent ? GAME_SEO[current.slug]?.path : pathFor("games", current.slug, current.lang))
    : eventSeo ? pathFor("event", `${current.gameSlug}/${current.eventSlug}`, current.lang)
      : current.page === "home" ? pathFor("home", "", current.lang) : (location.pathname || "/");
  const canonical = publicUrl(canonicalPath);
  const portalSeo = {
    news: { title: state.lang === "pt" ? "Notícias de Jogos e Recompensas | Game Gifts" : "Game News and Rewards | Game Gifts", description: state.lang === "pt" ? "Atualizações reais, anúncios e novidades de jogos com fontes identificadas no Game Gifts." : "Real game updates, announcements and news with identified sources on Game Gifts." },
    guides: { title: state.lang === "pt" ? "Guias de Jogos e Presentes | Game Gifts" : "Game Guides and Gifts | Game Gifts", description: state.lang === "pt" ? "Guias úteis para resgatar presentes, códigos e aproveitar seus jogos no Game Gifts." : "Useful guides for redeeming gifts, codes and getting more from your games on Game Gifts." },
    codes: { title: state.lang === "pt" ? "Códigos de Jogos | Game Gifts" : "Game Codes | Game Gifts", description: state.lang === "pt" ? "Códigos reais de jogos publicados com data, fonte e status no Game Gifts." : "Real game codes published with date, source and status on Game Gifts." },
    events: { title: state.lang === "pt" ? "Eventos de Jogos | Game Gifts" : "Game Events | Game Gifts", description: state.lang === "pt" ? "Eventos reais de jogos quando houver dados publicados e fonte identificada." : "Real game events when published data and an identified source are available." },
    play: { title: state.lang === "pt" ? "Quiz de Games | Game Gifts" : "Games Quiz | Game Gifts", description: state.lang === "pt" ? "Jogue o Quiz de Games do Game Gifts e registre sua pontuação real." : "Play the Game Gifts quiz and record your real score." },
    profile: { title: state.lang === "pt" ? "Perfil do Jogador | Game Gifts" : "Player Profile | Game Gifts", description: state.lang === "pt" ? "Veja seu perfil, pontos e conquistas reais no Game Gifts." : "See your real Game Gifts profile, points and achievements." },
    ranking: { title: state.lang === "pt" ? "Ranking de Jogadores | Game Gifts" : "Player Ranking | Game Gifts", description: state.lang === "pt" ? "Ranking de jogadores com pontuações reais registradas no Game Gifts." : "Player rankings with real scores recorded on Game Gifts." },
  };
  const pageSeo = portalSeo[current.page] || PAGE_SEO[current.lang]?.[current.page] || PAGE_SEO.en.home;
  const shouldIndex = !current.noindex && current.page !== "admin" && current.page !== "favorites" && current.page !== "profile" && current.page !== "ranking";
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) canonicalLink.href = canonical;
  document.documentElement.lang = state.lang === "pt" ? "pt-BR" : state.lang;
  const title = eventSeo?.title || gameSeo?.title || (current.page === "admin" ? "Admin · Game Gifts" : current.page === "favorites" ? "Favoritos · Game Gifts" : pageSeo.title);
  const description = eventSeo?.description || gameSeo?.description || (current.page === "admin" ? "Área administrativa do Game Gifts." : current.page === "favorites" ? "Seus jogos e presentes favoritos no Game Gifts." : pageSeo.description || HOME_SEO_DESCRIPTION[state.lang] || COPY[state.lang].chooseCopy);
  document.title = title;
  setMetaContent('meta[name="robots"]', shouldIndex ? "index, follow" : "noindex, nofollow");
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', canonical);
  setMetaContent('meta[property="og:type"]', "website");
  const image = currentEvent?.image || currentEventGame?.image || currentGame?.image || "/favicon.svg";
  let imageUrl = publicUrl(image);
  try { imageUrl = /^(?:https?:|data:|blob:)/i.test(image) ? image : new URL(assetUrl(image), location.origin).href; } catch {}
  setMetaContent('meta[property="og:image"]', imageUrl);
  setMetaContent('meta[property="og:image:alt"]', currentGame ? `${currentGame.name} · Game Gifts` : "Game Gifts");
  setMetaContent('meta[property="og:site_name"]', "Game Gifts");
  setMetaContent('meta[name="twitter:card"]', "summary_large_image");
  setMetaContent('meta[name="twitter:title"]', title);
  setMetaContent('meta[name="twitter:description"]', description);
  setMetaContent('meta[name="twitter:image"]', imageUrl);
  let structured = document.querySelector("#page-structured-data");
  if (shouldIndex) {
    if (!structured) { structured = document.createElement("script"); structured.id = "page-structured-data"; structured.type = "application/ld+json"; document.head.appendChild(structured); }
    structured.textContent = JSON.stringify(eventSeo
      ? { "@context": "https://schema.org", "@type": "Event", name: eventSeo.h1, url: canonical, description: eventSeo.description, startDate: currentEvent?.start_date || undefined, endDate: currentEvent?.end_date || undefined, image: currentEvent?.image || undefined, organizer: { "@type": "Organization", name: "Game Gifts" }, isPartOf: { "@type": "WebSite", name: "Game Gifts", url: `${PUBLIC_BASE_URL}/` } }
      : gameSeo
      ? { "@context": "https://schema.org", "@type": "WebPage", name: gameSeo.h1, url: canonical, description: gameSeo.description, inLanguage: state.lang, mainEntity: { "@type": "VideoGame", name: currentGame?.name || gameSeo.h1 }, isPartOf: { "@type": "WebSite", name: "Game Gifts", url: `${PUBLIC_BASE_URL}/` } }
      : { "@context": "https://schema.org", "@type": "WebPage", name: title, url: canonical, description, inLanguage: state.lang, isPartOf: { "@type": "WebSite", name: "Game Gifts", url: `${PUBLIC_BASE_URL}/` } });
  } else if (structured) structured.remove();
  document.querySelectorAll('link[data-hreflang]').forEach((link) => link.remove());
  if (shouldIndex) {
    LANGS.forEach((lang) => { const alternate = document.createElement("link"); alternate.rel = "alternate"; alternate.hreflang = lang; alternate.href = publicUrl(current.page === "event" ? pathFor("event", `${current.gameSlug}/${current.eventSlug}`, lang) : pathFor(current.page === "game" ? "games" : current.page, current.slug || "", lang)); alternate.dataset.hreflang = lang; document.head.appendChild(alternate); });
    const xDefault = document.createElement("link"); xDefault.rel = "alternate"; xDefault.hreflang = "x-default"; xDefault.href = publicUrl(pathFor(current.page === "game" ? "games" : current.page, current.slug || "", "pt")); xDefault.dataset.hreflang = "x-default"; document.head.appendChild(xDefault);
  }
};
const formatLastUpdate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(state.lang === "pt" ? "pt-BR" : state.lang, { dateStyle: "medium", timeStyle: "short" }).format(date);
};
const decorateGamePage = (game) => {
  const seo = seoForGame(game.slug);
  const intro = document.querySelector(".game-intro");
  if (seo && intro) {
    const heading = intro.querySelector("h1");
    const description = intro.querySelector("h1 + p");
    if (heading) heading.textContent = seo.h1;
    if (description) description.textContent = seo.intro;
  }
  const updates = publicRewardsForGame(game).map((reward) => reward.last_checked_at || reward.found_at || reward.created_at).filter(Boolean).sort().at(-1);
  const proof = document.querySelector(".game-proof");
  if (updates && proof && !proof.querySelector(".seo-last-update")) {
    const item = document.createElement("div");
    item.className = "seo-last-update";
    item.innerHTML = `<small>${esc(copy().lastUpdate)}</small><strong>${esc(formatLastUpdate(updates))}</strong>`;
    proof.insertBefore(item, proof.lastElementChild);
  }
};
const ensurePortalShell = () => {
  const header = document.querySelector(".site-header");
  if (header) {
    header.classList.add("portal-header");
    const brand = header.querySelector(".brand");
    const name = brand?.querySelector(".brand-name");
    if (brand && name && !brand.querySelector(".brand-lockup")) {
      const lockup = document.createElement("span");
      lockup.className = "brand-lockup";
      name.replaceWith(lockup);
      lockup.append(name);
      const tagline = document.createElement("small");
      tagline.textContent = portalCopy().tagline;
      lockup.append(tagline);
    }
    const desktop = header.querySelector(".desktop-nav");
    if (desktop && !desktop.querySelector('[data-nav="guides"]')) {
      const links = [
        ["guides", "▤", copy().guides], ["codes", "⌘", copy().codes], ["events", "◈", copy().events], ["play", "▶", state.lang === "pt" ? "Jogar" : "Play"],
      ];
      const anchor = desktop.querySelector('[data-nav="favorites"]');
      links.forEach(([nav, icon, label]) => { const link = document.createElement("a"); link.href = pathFor(nav); link.dataset.route = ""; link.dataset.nav = nav; link.innerHTML = `<span>${icon}</span><b>${esc(label)}</b>`; desktop.insertBefore(link, anchor || null); });
    }
  }
  const footer = document.querySelector(".site-footer");
  if (footer) {
    footer.classList.add("portal-footer");
    if (!footer.querySelector(".portal-footer-columns")) {
      footer.insertAdjacentHTML("beforeend", `<div class="portal-footer-columns"><div><strong>JOGOS</strong><a href="${pathFor("games")}" data-route>Todos os jogos</a><a href="${pathFor("news")}?recent=1" data-route>Presentes</a><a href="${pathFor("codes")}" data-route>${esc(copy().codes)}</a><a href="${pathFor("events")}" data-route>${esc(copy().events)}</a></div><div><strong>CONTEÚDO</strong><a href="${pathFor("news")}" data-route>${esc(copy().news)}</a><a href="${pathFor("guides")}" data-route>${esc(copy().guides)}</a><a href="${pathFor("play")}" data-route>Quiz de Games</a><a href="${pathFor("ranking")}" data-route>Ranking</a></div><div><strong>SOBRE</strong><a href="${pathFor("more")}" data-route>Quem somos</a><a href="${legalPath("privacy")}">Política de Privacidade</a><a href="${legalPath("terms")}">Termos de Uso</a></div><div><strong>AJUDA</strong><a href="${pathFor("more")}" data-route>Dúvidas frequentes</a><a href="${legalPath("contact")}">Fale conosco</a></div></div><div class="portal-footer-bottom"><span>© 2026 Game Gifts.</span><a href="${pathFor("more")}" data-route>${esc(copy().faq)}</a></div>`);
    }
  }
};
const renderChrome = () => {
  ensurePortalShell();
  syncHomeMobileNav();
  syncHomeBrand(route().page === "home");
  const header = document.querySelector(".site-header");
  if (header && !header.querySelector("[data-open-drawer]")) {
    const menuButton = document.createElement("button"); menuButton.className = "header-menu-button"; menuButton.type = "button"; menuButton.dataset.openDrawer = ""; menuButton.setAttribute("aria-label", drawerCopy().title); menuButton.setAttribute("aria-expanded", "false"); menuButton.setAttribute("aria-controls", "game-gifts-drawer"); menuButton.innerHTML = "<span></span><span></span><span></span>"; header.prepend(menuButton);
  }
  if (header && !header.querySelector(".header-notify")) { const notify = document.createElement("a"); notify.className = "header-notify"; notify.dataset.route = ""; notify.innerHTML = `<span aria-hidden="true">🔔</span><b class="header-notify-dot" data-news-count>0</b>`; header.insertBefore(notify, header.querySelector(".language-select") || null); }
  ensureDrawer();
  document.querySelectorAll("[data-i18n]").forEach((node) => { const key = node.dataset.i18n; if (copy()[key]) node.textContent = copy()[key]; });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = copy()[node.dataset.i18nPlaceholder]; });
  const latestLocalNotice = readNoticeAlerts().find((item) => !item.read && state.data.rewards.some((reward) => String(reward.id) === String(item.rewardId)) && gameFor(item.gameSlug));
  document.querySelectorAll("[data-news-count]").forEach((node) => { const count = noticeUnreadCount() || newsCount(); node.textContent = count; node.hidden = !count; });
  document.querySelectorAll("[data-nav]").forEach((node) => { const nav = node.dataset.nav; const isMobileGifts = node.closest(".mobile-nav") && nav === "news"; node.href = isMobileGifts ? `${pathFor("news")}?recent=1` : pathFor(nav === "home" ? "home" : nav); node.classList.toggle("active", route().page === nav || (nav === "games" && route().page === "game")); if (isMobileGifts) { const label = node.querySelector("[data-i18n='news']"); if (label) label.textContent = mobileLabel(); } });
  document.querySelectorAll(".header-notify").forEach((node) => {
    if (latestLocalNotice) {
      node.href = pathFor("games", latestLocalNotice.gameSlug);
      node.dataset.noticeAlert = latestLocalNotice.rewardId;
      node.setAttribute("aria-label", `${copy().news} · ${noticeUnreadCount()}`);
    } else {
      node.href = pathFor("news");
      delete node.dataset.noticeAlert;
      node.setAttribute("aria-label", `${copy().news} · ${newsCount()}`);
    }
  });
  const languageSelect = document.querySelector("#language-select");
  if (languageSelect) {
    languageSelect.innerHTML = LANGS.map((lang) => `<option value="${lang}">${lang.toUpperCase()}</option>`).join("");
    languageSelect.value = state.lang;
  }
  const searchInput = document.querySelector("#global-search");
  if (searchInput) searchInput.value = state.search;
  updateScoreDisplay();
};
const homeFeaturedGameCard = (game, index) => {
  const today = publicTodayRewardsForGame(game).filter((reward) => isLinkActive(reward));
  const reward = today[0] || publicRewardsForGame(game).find((item) => !isExpired(item));
  const label = reward ? homeRewardType(reward) : homeCopy().unknownType;
  const badge = index === 0 ? "NOVO" : index === 1 ? "ATUALIZADO" : index === 2 ? "POPULAR" : "HOJE";
  const badgeClass = index === 0 ? "is-new" : index === 1 ? "is-updated" : index === 2 ? "is-popular" : "is-today";
  return `<article class="home-featured-game-card"><a class="home-featured-game-link" href="${pathFor("games", game.slug)}" data-route data-analytics-game-name="${esc(game.name)}" data-analytics-game-slug="${esc(game.slug)}"><div class="home-featured-game-art">${gameArt(game, "card-art") }<span class="home-featured-badge ${badgeClass}">${badge}</span></div><div class="home-featured-game-copy"><h3>${esc(game.name)}</h3><span class="home-featured-reward">🎁 ${esc(label)}</span></div></a><a class="home-featured-redeem" href="${pathFor("games", game.slug)}" data-route>🎁 ${esc(homeCopy().redeem)} <b>→</b></a></article>`;
};
const homeArrivalCard = (reward) => {
  const game = gameFor(reward.game_slug);
  const isCode = rewardIsCode(reward);
  const openUrl = isCode ? rewardCodeOpenUrl(reward) : rewardOpenUrl(reward);
  if (!game || (!openUrl && !rewardIsCode(reward))) return "";
  const label = homeRewardType(reward);
  const analytics = ` data-analytics-game-name="${esc(game.name)}" data-analytics-gift-name="${esc(label)}" data-analytics-reward-id="${esc(reward.id)}"`;
  const amount = String(reward?.reward_amount || reward?.quantity || "").trim();
  const rewardText = amount ? `${amount} ${label}` : (usableRewardName(reward) || label);
  const status = homeArrivalStatus(reward);
  const action = isCode
    ? `<div class="home-arrival-actions">${reward.reward_code && !isExpired(reward) && !isProblem(reward) ? `<button type="button" class="home-arrival-action" data-copy-code="${esc(reward.reward_code)}"${analytics}>${state.lang === "pt" ? "COPIAR CÓDIGO" : state.lang === "en" ? "COPY CODE" : state.lang === "es" ? "COPIAR CÓDIGO" : state.lang === "de" ? "CODE KOPIEREN" : "KODU KOPYALA"}</button>` : `<span class="home-arrival-action is-disabled">${isExpired(reward) ? (state.lang === "pt" ? "CÓDIGO EXPIRADO" : "EXPIRED CODE") : state.lang === "pt" ? "CÓDIGO INDISPONÍVEL" : "CODE UNAVAILABLE"}</span>`}${openUrl && !isExpired(reward) && !isProblem(reward) ? `<a class="home-arrival-action" href="${esc(openUrl)}" target="_blank" rel="noopener noreferrer" data-redeem-reward="${esc(reward.id)}"${analytics}>${state.lang === "pt" ? "RESGATAR CÓDIGO" : state.lang === "en" ? "REDEEM CODE" : state.lang === "es" ? "CANJEAR CÓDIGO" : state.lang === "de" ? "CODE EINLÖSEN" : "KODU KULLAN"} ↗</a>` : ""}</div>`
    : `<a class="home-arrival-action" href="${esc(openUrl)}" target="_blank" rel="noopener noreferrer" data-open-reward="${esc(reward.id)}"${analytics}>${state.lang === "pt" ? "ABRIR PRESENTE" : state.lang === "en" ? "OPEN GIFT" : state.lang === "es" ? "ABRIR REGALO" : state.lang === "de" ? "GESCHENK ÖFFNEN" : "HEDİYEYİ AÇ"}</a>`;
  const arrivedAt = formatRewardDate(reward) || homeTimeAgo(rewardFoundAt(reward));
  return `<article class="home-arrival-card"><div class="home-arrival-topline"><div class="home-arrival-game"><span class="home-arrival-game-logo">${gameArt(game, "card-art")}</span><strong>${esc(game.name)}</strong></div><span class="home-arrival-new-label">${esc(newRewardLabel())}</span><time datetime="${esc(rewardFoundAt(reward))}">◷ ${esc(arrivedAt)}</time></div><div class="home-arrival-art">${rewardArt(reward, game)}</div><div class="home-arrival-copy"><strong class="home-arrival-reward">${esc(rewardText)}</strong><small class="home-arrival-status ${status.className}">${esc(status.label)}</small>${action}</div></article>`;
};
const sortHomeGames = (games) => {
  const list = [...games];
  if (state.homeSort === "az") return list.sort((a, b) => a.name.localeCompare(b.name));
  if (state.homeSort === "popular") return list.sort((a, b) => activeRewardsForGame(b).length - activeRewardsForGame(a).length || a.name.localeCompare(b.name));
  if (state.homeSort === "new") return list.sort((a, b) => freshnessScore(recentRewardsForGame(b).sort((x, y) => freshnessScore(y) - freshnessScore(x))[0]) - freshnessScore(recentRewardsForGame(a).sort((x, y) => freshnessScore(y) - freshnessScore(x))[0]) || a.name.localeCompare(b.name));
  return list.sort((a, b) => activeRewardsForGame(b).length - activeRewardsForGame(a).length || freshnessScore(recentRewardsForGame(b).sort((x, y) => freshnessScore(y) - freshnessScore(x))[0]) - freshnessScore(recentRewardsForGame(a).sort((x, y) => freshnessScore(y) - freshnessScore(x))[0]) || a.name.localeCompare(b.name));
};
const renderHome = () => {
  const games = sortHomeGames(filteredGames());
  const visibleGames = sortHomeGames(publicGames());
  const featuredGames = [];
  const todayGifts = publicTodayRewards().filter((reward) => isLinkActive(reward) && !rewardIsCode(reward)).length;
  const recentRewards = recentHomeRewards().slice(0, 12);
  const arrivalRewards = recentRewards;
  const heroTiles = visibleGames.slice(0, 5).map((game, index) => `<div class="home-hero-tile home-hero-tile-${index}" aria-hidden="true">${gameArt(game, "home-hero-art")}</div>`).join("");
  const newsCards = publicNews().slice(0, 4).map((item) => {
    const game = gameFor(item.game_slug);
    const image = item.image ? `<img src="${esc(assetUrl(item.image))}" alt="" loading="lazy" />` : game ? gameArt(game, "home-news-art") : "";
    return `<a class="home-news-card" href="${pathFor("news")}" data-route><div class="home-news-image">${image || "✦"}</div><div class="home-news-copy"><span>${esc(game?.name || item.game_name || "Game Gifts")}</span><h3>${esc(item.title || "Novidade")}</h3><time>${esc(newsDateLabel(item.published_at || item.created_at))}</time><strong>${esc(state.lang === "pt" ? "VER NOVIDADE" : "VIEW UPDATE")} <b>→</b></strong></div></a>`;
  }).join("");
  const giftsContent = recentRewards.length ? recentRewards.map(homePremiumRewardCard).join("") : `<div class="home-empty-state"><span>🎁</span><strong>${esc(homeCopy().noRecent)}</strong><p>${esc(homeSearchingCopy()[1])}</p></div>`;
  const newsContent = newsCards || `<div class="home-empty-state home-empty-news"><span>🔥</span><strong>${state.lang === "pt" ? "Nenhuma novidade encontrada agora." : "No updates found right now."}</strong><p>${esc(copy().noNewsCopy)}</p></div>`;
  const sortLabel = state.lang === "pt" ? { all: "Todos", popular: "Mais populares", az: "A-Z", new: "Novos" } : { all: "All", popular: "Most popular", az: "A-Z", new: "New" };
  const trustItems = state.lang === "pt" ? [["🛡️", "Links verificados", "Seguros e atualizados"], ["⚡", "Novos presentes todos os dias", "Fique por dentro e não perca nada"], ["👥", "Comunidade global", "Milhares de jogadores"], ["🔒", "100% Grátis", "Sem cadastro"]] : [["🛡️", "Verified links", "Safe and updated"], ["⚡", "New gifts every day", "Never miss an update"], ["👥", "Global community", "Thousands of players"], ["🔒", "100% Free", "No sign-up"]];
  return `<div class="home-dashboard"><section class="home-dashboard-hero" aria-label="GAME GIFTS"><div class="home-hero-backdrop">${heroTiles}<span class="home-hero-glow home-hero-glow-one"></span><span class="home-hero-glow home-hero-glow-two"></span></div><div class="home-dashboard-hero-copy"><span class="home-hero-kicker">🎮 GAME GIFTS · ${todayGifts || 0} ${state.lang === "pt" ? "ATIVOS HOJE" : "ACTIVE TODAY"}</span><h1>${state.lang === "pt" ? "SEUS JOGOS" : "YOUR GAMES"}<br><em>${state.lang === "pt" ? "SEUS PRESENTES" : "YOUR GIFTS"}</em></h1><p>${state.lang === "pt" ? "Descubra, resgate e jogue mais!" : "Discover, redeem and play more!"}</p></div></section><nav class="home-quick-links" aria-label="Atalhos"><a href="${pathFor("news")}?recent=1" data-route><span>🎁</span>${state.lang === "pt" ? "Presentes Grátis" : "Free Gifts"}</a><a href="${pathFor("games")}" data-route><span>⚡</span>${state.lang === "pt" ? "Links Diários" : "Daily Links"}</a><a href="${pathFor("games")}?codes=1" data-route><span>⭐</span>${state.lang === "pt" ? "Códigos" : "Codes"}</a><a href="${pathFor("news")}" data-route><span>🔥</span>${state.lang === "pt" ? "Novidades" : "News"}</a></nav><section class="home-dashboard-section home-arrival-section"><div class="home-dashboard-heading"><div><span class="home-dashboard-kicker">⚡ ${state.lang === "pt" ? "ACABOU DE CHEGAR" : "JUST IN"}</span><p>${state.lang === "pt" ? "Presentes encontrados recentemente. Seja rápido!" : "Recently found gifts. Be quick!"}</p></div><a href="${pathFor("news")}?recent=1" data-route>${state.lang === "pt" ? "Ver todos" : "View all"} <b>→</b></a></div><div class="home-arrival-grid">${arrivalRewards.map(homeArrivalCard).join("") || `<div class="home-empty-state"><span>🎁</span><strong>${esc(homeCopy().noRecent)}</strong></div>`}</div></section><section class="home-dashboard-section home-featured-section"><div class="home-dashboard-heading"><div><span class="home-dashboard-kicker">⭐ ${state.lang === "pt" ? "DESTAQUES DA SEMANA" : "WEEKLY HIGHLIGHTS"}</span></div><a href="${pathFor("games")}" data-route>${state.lang === "pt" ? "Ver todos" : "View all"} <b>→</b></a></div><div class="home-featured-games-grid">${featuredGames.map(homeFeaturedGameCard).join("") || emptyState(copy().noGames, copy().noGamesCopy)}</div></section><section class="home-dashboard-section home-all-games-section"><div class="home-dashboard-heading home-all-games-heading"><div><span class="home-dashboard-kicker">🎮 ${state.lang === "pt" ? "TODOS OS JOGOS" : "ALL GAMES"}</span><p>${state.lang === "pt" ? "Escolha um jogo e veja todos os presentes disponíveis." : "Choose a game and see all available gifts."}</p></div><div class="home-game-filters"><button type="button" class="home-filter-icon" data-home-sort="all" aria-label="${sortLabel.all}">▦</button><button type="button" class="${state.homeSort === "all" ? "is-active" : ""}" data-home-sort="all">${sortLabel.all}</button><button type="button" class="${state.homeSort === "popular" ? "is-active" : ""}" data-home-sort="popular">♡ ${sortLabel.popular}</button><button type="button" class="${state.homeSort === "az" ? "is-active" : ""}" data-home-sort="az">${sortLabel.az}</button><button type="button" class="${state.homeSort === "new" ? "is-active" : ""}" data-home-sort="new">🔥 ${sortLabel.new}</button></div></div><div class="home-premium-games-grid home-all-games-grid">${games.map((game) => homeGameCard(game)).join("") || emptyState(copy().noGames, copy().noGamesCopy)}</div></section><section class="home-dashboard-section home-news-section"><div class="home-dashboard-heading"><div><span class="home-dashboard-kicker">📣 ${state.lang === "pt" ? "NOVIDADES DOS JOGOS" : "GAME NEWS"}</span><p>${state.lang === "pt" ? "Eventos, temporadas e mudanças relevantes dos jogos." : "Events, seasons and relevant game updates."}</p></div><a href="${pathFor("news")}" data-route>${state.lang === "pt" ? "Ver todas" : "View all"} <b>→</b></a></div><div class="home-news-grid">${newsContent}</div></section><section class="home-trust-strip" aria-label="Game Gifts"><div>${trustItems.map(([icon,title,desc]) => `<article><span>${icon}</span><div><strong>${esc(title)}</strong><small>${esc(desc)}</small></div></article>`).join("")}</div></section></div>`;
};
const HOME_REFERENCE_IMAGE = "/uploads/optimized/home-banner.webp";
const HOME_TOP_CAROUSEL_SLUGS = Object.freeze([
  "match-masters", "travel-town", "monopoly-go", "bingo-blitz",
  "dice-dreams", "coin-master", "family-island", "animals-and-coins",
]);
const HOME_BANNER_GAME_HOTSPOTS = Object.freeze([
  ["monopoly-go", "monopoly"],
  ["dice-dreams", "dice"],
  ["match-masters", "match"],
  ["travel-town", "travel"],
  ["family-island", "family"],
  ["coin-master", "coin"],
  ["bingo-blitz", "bingo"],
  ["animals-and-coins", "animals"],
  ["seaside-escape", "seaside"],
  ["gossip-harbor", "gossip"],
]);
const homeTopCarouselGames = () => HOME_TOP_CAROUSEL_SLUGS.map((slug) => gameFor(slug)).filter(Boolean);
const renderHomeTopCarousel = () => `<section class="home-top-carousel" aria-label="Jogos disponíveis">
  <button class="home-top-carousel-arrow" type="button" data-home-top-carousel-arrow="left" aria-label="Jogo anterior">‹</button>
  <div class="home-top-carousel-track">
    ${homeTopCarouselGames().map((game) => `<a class="home-top-carousel-card" href="${pathFor("games", game.slug)}" data-route data-analytics-game-name="${esc(game.name)}" data-analytics-game-slug="${esc(game.slug)}"><span class="home-top-carousel-art">${gameArt(game, "home-top-carousel-game-art")}</span><strong>${esc(game.name)}</strong></a>`).join("")}
  </div>
  <button class="home-top-carousel-arrow" type="button" data-home-top-carousel-arrow="right" aria-label="Próximo jogo">›</button>
</section>`;
const renderPrioritizedHomeLower = () => {
  const previousHome = renderPrioritizedHome();
  const lowerStart = previousHome.indexOf('<nav class="home-reference-shortcuts');
  if (lowerStart < 0) return previousHome;
  const lowerContent = previousHome.slice(lowerStart).replace("home-reference-shortcuts-five", "home-reference-shortcuts-six");
  return `<div class="home-reference-prioritized home-image-lower">${lowerContent}`;
};
const renderImageHome = () => `<div class="home-image-home">
<div class="home-image-shell">
<div class="home-image-banner" aria-label="Game Gifts — presentes grátis todos os dias">
  <img class="home-image-art" src="${esc(assetUrl(HOME_REFERENCE_IMAGE))}" alt="Game Gifts — presentes grátis todos os dias" fetchpriority="high" decoding="async" />
  <a class="home-image-hotspot home-image-logo" href="${pathFor("home")}" data-route aria-label="Início"></a>
  <a class="home-image-hotspot home-image-alerts" href="${pathFor("news")}" data-route aria-label="Avisos"></a>
  <a class="home-image-hotspot home-image-favorites" href="${pathFor("favorites")}" data-route aria-label="Favoritos"></a>
  <a class="home-image-hotspot home-image-profile" href="${pathFor("profile")}" data-route aria-label="Perfil"></a>
  <button class="home-image-hotspot home-image-menu" type="button" data-open-home-image-menu aria-label="Abrir menu"></button>
  <a class="home-image-hotspot home-image-cta" href="${pathFor("news")}?recent=1" data-route aria-label="Ver presentes"></a>
  ${HOME_BANNER_GAME_HOTSPOTS.map(([slug, position]) => `<a class="home-image-hotspot home-image-banner-game home-image-banner-game-${position}" href="${pathFor("games", slug)}" data-route aria-label="${esc(gameFor(slug)?.name || slug)}"></a>`).join("")}
</div>
</div>${renderHomeTopCarousel()}${renderPrioritizedHomeLower()}</div>`;
let homeTopCarouselTimer = null;
let homeTopCarouselResumeTimer = null;
const stopHomeTopCarousel = () => {
  if (homeTopCarouselTimer) window.clearInterval(homeTopCarouselTimer);
  if (homeTopCarouselResumeTimer) window.clearTimeout(homeTopCarouselResumeTimer);
  homeTopCarouselTimer = null;
  homeTopCarouselResumeTimer = null;
};
const homeTopCarouselMove = (direction = 1) => {
  const track = app.querySelector(".home-top-carousel-track");
  const card = track?.querySelector(".home-top-carousel-card");
  if (!track || !card) return;
  const gap = Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0") || 0;
  const distance = card.getBoundingClientRect().width + gap;
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
  const next = direction > 0
    ? (track.scrollLeft >= maxScroll - 4 ? 0 : Math.min(maxScroll, track.scrollLeft + distance))
    : (track.scrollLeft <= 4 ? maxScroll : Math.max(0, track.scrollLeft - distance));
  track.scrollTo({ left: next, behavior: "smooth" });
};
const setupHomeTopCarousel = () => {
  stopHomeTopCarousel();
  const track = app.querySelector(".home-top-carousel-track");
  if (!track || track.children.length < 2) return;
  const start = () => {
    stopHomeTopCarousel();
    homeTopCarouselTimer = window.setInterval(() => homeTopCarouselMove(1), 4200);
  };
  const pauseTemporarily = () => {
    if (homeTopCarouselTimer) window.clearInterval(homeTopCarouselTimer);
    if (homeTopCarouselResumeTimer) window.clearTimeout(homeTopCarouselResumeTimer);
    homeTopCarouselTimer = null;
    homeTopCarouselResumeTimer = window.setTimeout(start, 3600);
  };
  track.addEventListener("pointerdown", pauseTemporarily, { passive: true });
  track.addEventListener("wheel", pauseTemporarily, { passive: true });
  track.addEventListener("touchstart", pauseTemporarily, { passive: true });
  start();
};
const ensureHomeShortcutCarousel = () => {
  // The current Home shows all six shortcuts in a compact two-row layout;
  // do not add a floating arrow over those cards.
  const nav = app.querySelector(".home-reference-shortcuts-five");
  if (!nav || nav.querySelector("[data-home-shortcuts-arrow]")) return;
  const arrow = document.createElement("button");
  arrow.type = "button";
  arrow.className = "home-shortcuts-arrow";
  arrow.dataset.homeShortcutsArrow = "";
  arrow.setAttribute("aria-label", "Avançar atalhos");
  arrow.textContent = "›";
  nav.append(arrow);
};
const renderGames = () => { const codesOnly = new URLSearchParams(location.search).get("codes") === "1"; const filtered = filteredGames(); const list = codesOnly ? filtered.filter((game) => activeRewardsForGame(game).some((reward) => rewardIsCode(reward))) : sortHomeGames(filtered); const title = codesOnly ? (state.lang === "pt" ? "Códigos reais" : state.lang === "en" ? "Real codes" : state.lang === "es" ? "Códigos reales" : state.lang === "de" ? "Echte Codes" : "Gerçek kodlar") : (state.lang === "pt" ? "Jogos" : copy().allGames); return `<div class="page-top"><button type="button" data-go-back="${pathFor("home")}" class="back-link">← ${esc(copy().home)}</button></div><div class="section-head" style="margin-top:0"><div><p class="eyebrow">🎮 GAME GIFTS</p><h1 style="font-size:clamp(30px,5vw,52px)">${esc(title)}</h1><p>${esc(state.lang === "pt" ? "Jogos com presentes reais disponíveis aparecem primeiro." : "Games with real available gifts appear first.")}</p></div></div><div class="games-grid">${list.map((game) => gameCard(game)).join("") || emptyState(codesOnly ? (state.lang === "pt" ? "Nenhum código real disponível" : "No real codes available") : copy().noGames, codesOnly ? (state.lang === "pt" ? "Os códigos publicados aparecerão aqui quando existirem." : "Published codes will appear here when available.") : copy().noGamesCopy, "🎟️")}</div>`; };
const groupByDate = (items) => items.reduce((groups, item) => { const date = rewardDateKey(item); if (date) (groups[date] ||= []).push(item); return groups; }, {});
const todayEmptyState = () => {
  const title = state.lang === "pt" ? "0 disponíveis" : state.lang === "en" ? "0 available" : state.lang === "es" ? "0 disponibles" : state.lang === "de" ? "0 verfügbar" : "0 mevcut";
  const first = state.lang === "pt" ? "Nenhum presente novo encontrado hoje." : state.lang === "en" ? "No new gifts found today." : state.lang === "es" ? "No se encontraron regalos nuevos hoy." : state.lang === "de" ? "Heute wurden keine neuen Geschenke gefunden." : "Bugün yeni hediye bulunamadı.";
  const second = state.lang === "pt" ? "Confira os presentes dos últimos dias." : state.lang === "en" ? "Check gifts from the last few days." : state.lang === "es" ? "Revisa los regalos de los últimos días." : state.lang === "de" ? "Sieh dir die Geschenke der letzten Tage an." : "Son günlerdeki hediyelere göz atın.";
  return `<div class="empty"><span class="empty-icon">✦</span><h3>${esc(title)}</h3><p>${esc(first)}<br>${esc(second)}</p></div>`;
};
const renderHistory = (game, rewards) => {
  const groups = Object.entries(groupByDate(sortRewards(rewards))).sort(([a], [b]) => b.localeCompare(a));
  if (state.selectedDate) { const chosen = rewards.filter((reward) => rewardDateKey(reward) === state.selectedDate); return `<button class="back-link" data-date="">‹ ${esc(copy().backHistory)}</button><div class="section-head" style="margin-top:19px"><div><p class="eyebrow">${esc(dateLabel(state.selectedDate, { full: true }))}</p><h2>${chosen.length} ${esc(copy().dateLinks)}</h2></div></div><div class="reward-list">${sortRewards(chosen).map((reward, index) => rewardCard(reward, game, index + 1)).join("") || emptyState(copy().noRewards, copy().noRewardsCopy)}</div>`; }
  return groups.length ? `<div class="date-list">${groups.map(([date, list]) => `<div class="date-group"><div><h3>${esc(dateLabel(date, { full: true }))}</h3><p>${list.length} ${esc(copy().dateLinks)}</p></div><button type="button" data-date="${esc(date)}">›</button></div>`).join("")}</div>` : emptyState(copy().noRewards, copy().noRewardsCopy, "◷");
};
const centralCopy = () => CENTRAL_COPY[state.lang] || CENTRAL_COPY.en;
const centerContent = (game) => GAME_CENTER_CONTENT[game.slug]?.[state.lang] || GAME_CENTER_CONTENT[game.slug]?.en || GENERIC_CENTER_CONTENT[state.lang] || GENERIC_CENTER_CONTENT.en;
const GENERIC_GAME_INFO_COPY = {
  pt: { platform: "Mobile", reward: "recompensas por links", how: "Jogue normalmente e consulte esta página quando quiser encontrar novos links públicos do jogo.", redeem: ["Abra um link recente na seção de presentes.", "Siga o redirecionamento até o jogo.", "Confira a recompensa dentro do jogo antes de sair."] },
  en: { platform: "Mobile", reward: "link rewards", how: "Play normally and return here whenever you want to find new public links for the game.", redeem: ["Open a recent link in the gifts section.", "Follow the redirect to the game.", "Check the reward inside the game before leaving."] },
  es: { platform: "Móvil", reward: "recompensas por enlaces", how: "Juega normalmente y vuelve aquí para encontrar nuevos enlaces públicos del juego.", redeem: ["Abre un enlace reciente en la sección de regalos.", "Sigue la redirección hasta el juego.", "Comprueba la recompensa dentro del juego."] },
  de: { platform: "Mobil", reward: "Belohnungen über Links", how: "Spiele normal und komm zurück, wenn du neue öffentliche Links finden möchtest.", redeem: ["Öffne einen aktuellen Link im Geschenkbereich.", "Folge der Weiterleitung zum Spiel.", "Prüfe die Belohnung im Spiel."] },
  tr: { platform: "Mobil", reward: "bağlantı ödülleri", how: "Oyunu normal oynayın ve yeni herkese açık bağlantılar için buraya dönün.", redeem: ["Hediyeler bölümünden güncel bir bağlantı açın.", "Oyuna yönlendirmeyi takip edin.", "Ödülü oyunun içinde kontrol edin."] },
};
const gameInfoFor = (game) => GAME_INFO_CONTENT[game.slug]?.[state.lang] || GAME_INFO_CONTENT[game.slug]?.en || GAME_INFO_CONTENT[game.slug]?.pt || (() => { const generic = GENERIC_GAME_INFO_COPY[state.lang] || GENERIC_GAME_INFO_COPY.en; return { officialName: game.name, description: game.description || copy().chooseCopy, publisher: "", platforms: generic.platform, rewards: [generic.reward], howWorks: [generic.how], giftLinks: "", redeem: generic.redeem, important: [], links: [] }; })();
const gameInfoLabels = () => GAME_INFO_LABELS[state.lang] || GAME_INFO_LABELS.en;
const renderInfoList = (items, className = "") => items?.length ? `<ul class="game-info-list ${className}">${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : "";
const renderGameInfoPanel = (game) => {
  const info = gameInfoFor(game);
  if (!info) return "";
  const labels = gameInfoLabels();
  const detail = (label, value) => value ? `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>` : "";
  const links = info.links?.length ? `<section class="game-info-block game-info-links"><p class="eyebrow">↗ ${esc(labels.officialLinks)}</p><div class="game-info-link-list">${info.links.map((link) => `<a class="outline-button" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`).join("")}</div>${info.socials?.length ? `<p class="game-info-subtitle">${esc(labels.social)}</p><div class="game-info-link-list">${info.socials.map((link) => `<a class="outline-button" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`).join("")}</div>` : ""}</section>` : "";
  return `<article class="game-central-card game-info-shell game-central-wide"><div class="game-info-overview"><div class="game-info-logo">${gameArt(game, "card-art")}</div><div><p class="eyebrow">ⓘ ${esc(labels.details)}</p><h3>${esc(info.officialName)}</h3><p>${esc(info.description)}</p></div></div><dl class="game-info-details">${detail(labels.officialName, info.officialName)}${detail(labels.publisher, info.publisher)}${detail(labels.platforms, info.platforms)}${info.rewards?.length ? `<div><dt>${esc(labels.rewards)}</dt><dd><div class="game-info-chips">${info.rewards.map((reward) => `<span>${esc(reward)}</span>`).join("")}</div></dd></div>` : ""}</dl><div class="game-info-sections"><section class="game-info-block"><p class="eyebrow">✦ ${esc(labels.howWorks)}</p>${renderInfoList(info.howWorks)}</section><section class="game-info-block"><p class="eyebrow">🎁 ${esc(labels.giftLinks)}</p><p>${esc(info.giftLinks)}</p></section><section class="game-info-block"><p class="eyebrow">✓ ${esc(labels.redeem)}</p>${renderInfoList(info.redeem)}</section><section class="game-info-block"><p class="eyebrow">! ${esc(labels.important)}</p>${renderInfoList(info.important, "game-info-important")}</section></div>${links}</article>`;
};
const renderGamePrimaryNav = () => {
  const labels = state.lang === "pt" ? { overview: "VISÃO GERAL", rewards: "PRESENTES", codes: "CÓDIGOS", news: "NOVIDADES", events: "EVENTOS", guides: "GUIAS", faq: "FAQ" } : { overview: "OVERVIEW", rewards: "GIFTS", codes: "CODES", news: "NEWS", events: "EVENTS", guides: "GUIDES", faq: "FAQ" };
  return `<nav class="game-primary-nav" aria-label="${esc(labels.overview)}"><a class="game-primary-link" href="#game-rewards">${esc(labels.rewards)}</a><a class="game-primary-link" href="#game-codes">${esc(labels.codes)}</a><a class="game-primary-link" href="#game-news">${esc(labels.news)}</a><a class="game-primary-link" href="#game-events">${esc(labels.events)}</a><a class="game-primary-link" href="#game-tips">${esc(labels.guides)}</a><a class="game-primary-link" href="#game-faq">${esc(labels.faq)}</a></nav>`;
};
const renderGameEventsSection = (game) => {
  const items = eventsForGame(game).filter((event) => eventStatusKey(event) !== "ended");
  const content = items.length ? `<div class="event-card-grid game-event-card-grid">${items.map((event) => eventCard(event, true)).join("")}</div>` : emptyState(state.lang === "pt" ? "Nenhum evento ativo confirmado no momento." : "No confirmed active event right now.", state.lang === "pt" ? "Esta área só mostra eventos publicados após validação em uma fonte oficial." : "This area only shows events published after validation from an official source.", "🔥");
  return gameVerticalSection("game-events", "🔥", state.lang === "pt" ? "EVENTOS" : "EVENTS", state.lang === "pt" ? "Eventos reais confirmados para este jogo." : "Real events confirmed for this game.", content);
};
const renderGameFaqSection = (game) => {
  const content = centerContent(game);
  const faq = Array.isArray(content?.faq) ? content.faq : [];
  return gameVerticalSection("game-faq", "❔", "FAQ", state.lang === "pt" ? "Respostas baseadas no conteúdo disponível para este jogo." : "Answers based on the available content for this game.", faq.length ? `<div class="game-faq-list">${faq.map((item) => `<details><summary>${esc(item.split("?")[0] || item)}</summary><p>${esc(item)}</p></details>`).join("")}</div>` : emptyState(state.lang === "pt" ? "FAQ ainda não disponível" : "FAQ not available yet", state.lang === "pt" ? "Não há respostas verificáveis cadastradas para este jogo." : "There are no verified answers for this game yet.", "❔"));
};
const renderGameCentral = (game, todayList = publicTodayRewardsForGame(game)) => {
  const ui = centralCopy();
  const content = centerContent(game);
  const tab = ["guides", "tips", "news"].includes(state.centralTab) ? state.centralTab : "guides";
  const otherGames = publicGames().filter((item) => Number(item.id) !== Number(game.id) && publicTodayRewardsForGame(item).length).slice(0, 4);
  const todayCount = todayList.length;
  const availableNow = state.lang === "pt" ? `${todayCount} ${todayCount === 1 ? "presente real disponível" : "presentes reais disponíveis"} hoje` : state.lang === "en" ? `${todayCount} real ${todayCount === 1 ? "gift is" : "gifts are"} available today` : state.lang === "es" ? `${todayCount} ${todayCount === 1 ? "regalo real disponible" : "regalos reales disponibles"} hoy` : state.lang === "de" ? `${todayCount} echte ${todayCount === 1 ? "Geschenk ist" : "Geschenke sind"} heute verfügbar` : `${todayCount} gerçek hediye bugün mevcut`;
  const gameNews = publicNewsForGame(game);
  const latestNews = gameNews[0] || null;
  const quickUpdate = latestNews?.title || ui.noNews;
  const quickUpdateCopy = latestNews?.summary || ui.noNewsCopy;
  const fav = isFavorite("game", game.id);
  const following = noticePrefs().games.includes(String(game.slug));
  let panel = "";
  if (tab === "guides") panel = renderGameInfoPanel(game);
  if (tab === "tips") panel = `<div class="game-central-card game-central-wide"><p class="eyebrow">✦ ${esc(ui.tips)}</p><h3>${esc(ui.tipsTitle)}</h3><ul>${content.tips.map((tip) => `<li>${esc(tip)}</li>`).join("")}</ul><p class="game-central-note">${esc(ui.moreSoon)}</p></div>`;
  if (tab === "news") panel = `<div class="game-central-card game-central-wide game-central-empty"><p class="eyebrow">✧ ${esc(ui.news)}</p><h3>${esc(ui.noNews)}</h3><p>${esc(ui.noNewsCopy)}</p><a class="outline-button" href="#game-rewards">${esc(ui.viewRewards)} ↗</a></div>`;
  const otherGamesMarkup = otherGames.length ? otherGames.map((item) => `<a class="other-game-card" href="${pathFor("games", item.slug)}" data-route>${gameArt(item, "card-art other-game-art")}<span>${esc(item.name)}</span><small>${esc(publicTodayLabel(item))}</small></a>`).join("") : `<p class="other-games-empty">${esc(ui.noOtherGames)}</p>`;
  return `<section class="game-central" id="game-central"><div class="game-central-heading"><div><p class="eyebrow">✦ ${esc(ui.title)}</p><h2>${esc(game.name)}</h2><p>${esc(ui.copy)}</p></div></div><div class="game-highlight-grid"><article class="game-highlight game-highlight-gift"><span class="game-highlight-icon">🎁</span><div><small>${esc(ui.freeNow)}</small><strong>${todayCount}</strong><p>${esc(availableNow)}</p></div></article><article class="game-highlight game-highlight-news"><span class="game-highlight-icon">📣</span><div><small>${esc(ui.quickNews)}</small><strong>${esc(quickUpdate)}</strong><p>${esc(quickUpdateCopy)}</p>${latestNews?.source_name ? `<small class="highlight-source">${esc(latestNews.source_name)}</small>` : ""}</div></article><article class="game-highlight"><span class="game-highlight-icon">💡</span><div><small>${esc(ui.dailyTip)}</small><strong>${esc(content.tips[0])}</strong></div></article></div><div class="game-central-panel">${panel}</div><div class="game-alert-card"><div><span class="game-alert-icon">🔔</span><div><strong>${esc(ui.notify)}</strong><p>${esc(following ? ui.alertOn : ui.follow)}</p></div></div><button type="button" class="game-follow-button ${following ? "is-following" : ""}" data-notice-toggle="${esc(game.slug)}">${following ? "✓ " + esc(ui.following) : esc(ui.follow)}</button></div><section class="other-games-section"><div class="other-games-heading"><div><p class="eyebrow">🎮 GAME GIFTS</p><h3>${esc(ui.otherGames)}</h3></div></div><div class="other-games-grid">${otherGamesMarkup}</div></section></section>`;
};
const noNewRewardState = () => emptyState(copy().noNewGiftTitle, copy().noNewGiftCopy, "🎁");
const yesterdayCountLabel = (count) => {
  if (state.lang === "pt") return `${count} ${count === 1 ? "presente" : "presentes"} de ontem`;
  if (state.lang === "en") return `${count} gift${count === 1 ? "" : "s"} from yesterday`;
  if (state.lang === "es") return `${count} regalo${count === 1 ? "" : "s"} de ayer`;
  if (state.lang === "de") return `${count} Geschenk${count === 1 ? "" : "e"} von gestern`;
  return `${count} ${count === 1 ? "dünkü hediye" : "dünkü hediye"}`;
};
const yesterdayCallout = (count, priority = false) => `<button type="button" class="yesterday-callout ${priority ? "is-priority" : ""}" data-tab="yesterday" aria-label="${esc(`${yesterdayCountLabel(count)} · ${copy().yesterdayCtaAction}`)}"><span class="yesterday-callout-icon" aria-hidden="true">🎁</span><span class="yesterday-callout-copy"><strong>${esc(yesterdayCountLabel(count))}</strong><span>${esc(copy().yesterdayCtaCopy)}</span></span><span class="yesterday-callout-action">${esc(copy().yesterdayCtaAction)} <b aria-hidden="true">→</b></span></button>`;
const GAME_PAGE_COPY = {
  pt: { cover: "UNIVERSO DO JOGO", today: "PRESENTES DE HOJE", todayCopy: "Links públicos encontrados e organizados por data.", codes: "CÓDIGOS GRÁTIS", codesCopy: "Use somente códigos publicados por fontes legítimas.", previous: "PRESENTES ANTERIORES", previousCopy: "Recompensas recentes que continuam no histórico.", news: "NOVIDADES", newsCopy: "Atualizações reais e informações relevantes do jogo.", tips: "DICAS", tipsCopy: "Pequenas estratégias para aproveitar melhor o jogo.", redeem: "COMO RESGATAR", redeemCopy: "Siga os passos abaixo e confirme a recompensa dentro do jogo.", info: "INFORMAÇÕES DO JOGO", infoCopy: "Detalhes oficiais, plataformas e links confiáveis.", other: "OUTROS JOGOS", otherCopy: "Explore mais presentes e códigos no Game Gifts.", follow: "Receba um aviso quando aparecerem novos presentes." },
  en: { cover: "GAME UNIVERSE", today: "TODAY'S GIFTS", todayCopy: "Public links found and organized by date.", codes: "FREE CODES", codesCopy: "Only use codes published by legitimate sources.", previous: "PREVIOUS GIFTS", previousCopy: "Recent rewards that remain in the history.", news: "NEWS", newsCopy: "Real updates and useful information about the game.", tips: "TIPS", tipsCopy: "Small strategies to get more from the game.", redeem: "HOW TO REDEEM", redeemCopy: "Follow the steps and confirm the reward inside the game.", info: "GAME INFORMATION", infoCopy: "Official details, platforms and trusted links.", other: "OTHER GAMES", otherCopy: "Explore more gifts and codes on Game Gifts.", follow: "Get an alert when new gifts appear." },
  es: { cover: "UNIVERSO DEL JUEGO", today: "REGALOS DE HOY", todayCopy: "Enlaces públicos encontrados y ordenados por fecha.", codes: "CÓDIGOS GRATIS", codesCopy: "Usa solo códigos publicados por fuentes legítimas.", previous: "REGALOS ANTERIORES", previousCopy: "Recompensas recientes que permanecen en el historial.", news: "NOVEDADES", newsCopy: "Actualizaciones reales e información útil del juego.", tips: "CONSEJOS", tipsCopy: "Pequeñas estrategias para aprovechar mejor el juego.", redeem: "CÓMO CANJEAR", redeemCopy: "Sigue los pasos y confirma la recompensa dentro del juego.", info: "INFORMACIÓN DEL JUEGO", infoCopy: "Detalles oficiales, plataformas y enlaces confiables.", other: "OTROS JUEGOS", otherCopy: "Explora más regalos y códigos en Game Gifts.", follow: "Recibe un aviso cuando aparezcan nuevos regalos." },
  de: { cover: "SPIEL-UNIVERSUM", today: "GESCHENKE HEUTE", todayCopy: "Öffentliche Links nach Datum geordnet.", codes: "KOSTENLOSE CODES", codesCopy: "Nutze nur Codes aus legitimen Quellen.", previous: "FRÜHERE GESCHENKE", previousCopy: "Aktuelle Belohnungen im Verlauf.", news: "NEUIGKEITEN", newsCopy: "Echte Updates und nützliche Spielinformationen.", tips: "TIPPS", tipsCopy: "Kleine Strategien für mehr Spielspaß.", redeem: "SO LÖST DU EIN", redeemCopy: "Folge den Schritten und prüfe die Belohnung im Spiel.", info: "SPIELINFORMATIONEN", infoCopy: "Offizielle Details, Plattformen und vertrauenswürdige Links.", other: "ANDERE SPIELE", otherCopy: "Entdecke weitere Geschenke und Codes.", follow: "Erhalte einen Hinweis bei neuen Geschenken." },
  tr: { cover: "OYUN EVRENİ", today: "BUGÜNÜN HEDİYELERİ", todayCopy: "Tarihe göre düzenlenmiş herkese açık bağlantılar.", codes: "ÜCRETSİZ KODLAR", codesCopy: "Yalnızca güvenilir kaynaklardan gelen kodları kullanın.", previous: "ÖNCEKİ HEDİYELER", previousCopy: "Geçmişte kalan güncel ödüller.", news: "YENİLİKLER", newsCopy: "Gerçek güncellemeler ve yararlı oyun bilgileri.", tips: "İPUÇLARI", tipsCopy: "Oyundan daha iyi yararlanmak için küçük stratejiler.", redeem: "NASIL ALINIR", redeemCopy: "Adımları izleyin ve ödülü oyunda kontrol edin.", info: "OYUN BİLGİLERİ", infoCopy: "Resmi ayrıntılar, platformlar ve güvenilir bağlantılar.", other: "DİĞER OYUNLAR", otherCopy: "Daha fazla hediye ve kod keşfedin.", follow: "Yeni hediyeler geldiğinde haber alın." },
};
const gamePageCopy = () => GAME_PAGE_COPY[state.lang] || GAME_PAGE_COPY.en;
const gameVerticalSection = (id, icon, title, description, body, className = "") => `<section class="game-vertical-section ${className}" id="${id}"><div class="game-section-heading"><span class="game-section-icon" aria-hidden="true">${icon}</span><div><p class="game-section-kicker">${esc(title)}</p>${description ? `<p class="game-section-description">${esc(description)}</p>` : ""}</div></div>${body}</section>`;
const renderGameTipsSection = (game) => {
  const content = centerContent(game);
  return content?.tips?.length ? gameVerticalSection("game-tips", "💡", gamePageCopy().tips, gamePageCopy().tipsCopy, `<div class="game-tip-grid">${content.tips.map((tip, index) => `<article class="game-tip-card"><span>${String(index + 1).padStart(2, "0")}</span><p>${esc(tip)}</p></article>`).join("")}</div>`) : "";
};
const renderGameRedeemSection = (game) => {
  const info = gameInfoFor(game);
  if (!info?.redeem?.length) return "";
  return gameVerticalSection("game-redeem", "📖", gamePageCopy().redeem, gamePageCopy().redeemCopy, `<ol class="game-redeem-steps">${info.redeem.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>`);
};
const renderGameInfoSection = (game) => {
  const info = gameInfoFor(game);
  if (!info) return "";
  const labels = gameInfoLabels();
  const detail = (label, value) => value ? `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>` : "";
  const links = info.links?.length ? `<div class="game-info-link-list">${info.links.map((link) => `<a class="outline-button" href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)} ↗</a>`).join("")}</div>` : "";
  return gameVerticalSection("game-info", "🎮", gamePageCopy().info, gamePageCopy().infoCopy, `<article class="game-info-shell game-info-shell-cartoon"><div class="game-info-overview"><div class="game-info-logo">${gameArt(game, "card-art")}</div><div><p class="eyebrow">ⓘ ${esc(labels.details)}</p><h3>${esc(info.officialName)}</h3><p>${esc(info.description)}</p></div></div><dl class="game-info-details">${detail(labels.officialName, info.officialName)}${detail(labels.publisher, info.publisher)}${detail(labels.platforms, info.platforms)}${info.rewards?.length ? `<div><dt>${esc(labels.rewards)}</dt><dd><div class="game-info-chips">${info.rewards.map((reward) => `<span>${esc(reward)}</span>`).join("")}</div></dd></div>` : ""}</dl>${info.howWorks?.length ? `<div class="game-info-how"><p class="eyebrow">✦ ${esc(labels.howWorks)}</p>${renderInfoList(info.howWorks)}</div>` : ""}${links ? `<div class="game-info-links"><p class="eyebrow">↗ ${esc(labels.officialLinks)}</p>${links}</div>` : ""}</article>`);
};
const renderGame = (game) => {
  const all = publicRewardsForGame(game);
  const mode = game.reward_mode || "links";
  const hasCodes = all.some(rewardIsCode);
  const hasLinks = all.some((reward) => !rewardIsCode(reward));
  const modeLabel = mode === "none" && !hasCodes && !hasLinks ? copy().noneMode : hasCodes && hasLinks ? (state.lang === "pt" ? "🎁 PRESENTES + 🎟️ CÓDIGOS" : state.lang === "en" ? "🎁 GIFTS + 🎟️ CODES" : state.lang === "es" ? "🎁 REGALOS + 🎟️ CÓDIGOS" : state.lang === "de" ? "🎁 GESCHENKE + 🎟️ CODES" : "🎁 HEDİYELER + 🎟️ KODLAR") : hasCodes ? (state.lang === "pt" ? "🎟️ CÓDIGOS" : state.lang === "en" ? "🎟️ CODES" : state.lang === "es" ? "🎟️ CÓDIGOS" : state.lang === "de" ? "🎟️ CODES" : "🎟️ KODLAR") : copy().linksMode;
  const currentRewards = sortRewards(all.filter((reward) => isLinkActive(reward) && (rewardIsCode(reward) || !rewardDetectedDateKey(reward) || rewardDetectedDateKey(reward) >= todayKey())));
  const currentIds = new Set(currentRewards.map((reward) => String(reward.id)));
  const currentLinks = currentRewards.filter((reward) => !rewardIsCode(reward));
  const codeRewards = currentRewards.filter(rewardIsCode);
  const previousRewards = sortRewards(all.filter((reward) => !currentIds.has(String(reward.id))));
  const openedRewards = sortRewards(all.filter((reward) => rewardIsOpened(reward) && !currentIds.has(String(reward.id))));
  const news = publicNewsForGame(game);
  const fav = isFavorite("game", game.id);
  const following = noticePrefs().games.includes(String(game.slug));
  const profile = CATALOG_PROFILE[game.slug] || { source: copy().unknownSource, sourceUrl: "", cadence: "recorrente", types: copy().unconfirmedReward };
  const profileSource = game.slug === "coin-master" ? "<strong>Verificação direta dos destinos</strong>" : profile.sourceUrl ? `<a href="${esc(profile.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(profile.source)} ↗</a>` : `<strong>${esc(profile.source)}</strong>`;
  const otherGames = publicGames().filter((item) => Number(item.id) !== Number(game.id)).slice(0, 4);
  const otherGamesMarkup = otherGames.length ? otherGames.map((item) => `<a class="other-game-card" href="${pathFor("games", item.slug)}" data-route>${gameArt(item, "card-art other-game-art")}<span>${esc(item.name)}</span><small>${esc(item.reward_mode === "codes" ? "🎟️ " + copy().codesMode : "🎁 " + copy().linksMode)}</small></a>`).join("") : "";
  const currentEmptySection = currentRewards.length ? "" : `<div class="game-compact-empty"><strong>${esc(state.lang === "pt" ? "Nenhum presente disponível por enquanto." : state.lang === "en" ? "No gift available right now." : state.lang === "es" ? "No hay regalos disponibles ahora." : state.lang === "de" ? "Momentan kein Geschenk verfügbar." : "Şu anda mevcut hediye yok.")}</strong><span>${esc(state.lang === "pt" ? "A coleta continua verificando links e códigos reais." : state.lang === "en" ? "Collection is still checking real links and codes." : state.lang === "es" ? "La recopilación sigue comprobando enlaces y códigos reales." : state.lang === "de" ? "Die Sammlung prüft weiterhin echte Links und Codes." : "Toplama gerçek bağlantıları ve kodları kontrol ediyor.")}</span></div>`;
  const availableTitle = state.lang === "pt" ? "PRESENTES DISPONÍVEIS" : state.lang === "en" ? "AVAILABLE GIFTS" : state.lang === "es" ? "REGALOS DISPONIBLES" : state.lang === "de" ? "VERFÜGBARE GESCHENKE" : "MEVCUT HEDİYELER";
  const availableCopy = state.lang === "pt" ? "Links reais que ainda podem ser abertos." : state.lang === "en" ? "Real links that can still be opened." : state.lang === "es" ? "Enlaces reales que aún pueden abrirse." : state.lang === "de" ? "Echte Links, die noch geöffnet werden können." : "Hâlâ açılabilen gerçek bağlantılar.";
  const todaySection = currentLinks.length ? gameVerticalSection("game-rewards", "🎁", availableTitle, availableCopy, `<div class="reward-list">${currentLinks.map((reward, index) => rewardCard(reward, game, index + 1)).join("")}</div>`, "game-rewards-section") : currentRewards.length ? "" : currentEmptySection;
  const codesSection = codeRewards.length ? gameVerticalSection("game-codes", "🎟️", gamePageCopy().codes, gamePageCopy().codesCopy, `<div class="reward-list">${codeRewards.map((reward, index) => rewardCard(reward, game, index + 1)).join("")}</div>`, "game-codes-section") : "";
  const previousSection = previousRewards.length ? gameVerticalSection("game-previous", "🕐", gamePageCopy().previous, gamePageCopy().previousCopy, `<div class="reward-list">${previousRewards.map((reward, index) => rewardCard(reward, game, index + 1)).join("")}</div>`, "game-previous-section") : "";
  const openedSection = openedRewards.length ? gameVerticalSection("game-opened", "✅", copy().opened, state.lang === "pt" ? "Presentes que você já abriu neste dispositivo." : state.lang === "en" ? "Gifts you have opened on this device." : state.lang === "es" ? "Regalos que ya abriste en este dispositivo." : state.lang === "de" ? "Geschenke, die du auf diesem Gerät geöffnet hast." : "Bu cihazda açtığınız hediyeler.", `<div class="reward-list">${openedRewards.map((reward, index) => rewardCard(reward, game, index + 1)).join("")}</div>`, "game-opened-section") : "";
  const newsSection = news.length ? gameVerticalSection("game-news", "🔥", gamePageCopy().news, gamePageCopy().newsCopy, `<div class="editorial-news-list">${news.map(editorialNewsCard).join("")}</div>`) : "";
  const followSection = `<div class="game-alert-card"><div><span class="game-alert-icon">🔔</span><div><strong>${esc(centralCopy().notify)}</strong><p>${esc(following ? centralCopy().alertOn : gamePageCopy().follow)}</p></div></div><button type="button" class="game-follow-button ${following ? "is-following" : ""}" data-notice-toggle="${esc(game.slug)}">${following ? "✓ " + esc(centralCopy().following) : esc(centralCopy().follow)}</button></div>`;
  return `<div class="page-top"><button type="button" data-go-back="${pathFor("games")}" class="back-link">← ${esc(copy().games)}</button></div><section class="game-intro ${game.slug === "match-masters" ? "match-masters-intro" : ""}"><div class="game-hero-banner">${gameArt(game, "game-hero-art")}</div>${gameArt(game, "game-cover")}<div class="game-intro-copy"><p class="eyebrow">✦ ${esc(gamePageCopy().cover)} · ${esc(modeLabel)}</p><h1>${esc(game.name)}</h1><p>${esc(game.description || copy().chooseCopy)}</p></div><div class="game-intro-actions"><button class="game-follow-button ${fav ? "is-following" : ""}" type="button" data-favorite-type="game" data-favorite-id="${game.id}">${fav ? "✓ " + esc(centralCopy().following) : "♡ " + esc(centralCopy().follow)}</button></div></section>${renderGamePrimaryNav()}<div class="game-vertical-flow">${todaySection}${codesSection}${previousSection}${openedSection}${newsSection}${renderGameEventsSection(game)}${renderGameTipsSection(game)}${renderGameRedeemSection(game)}${renderGameInfoSection(game)}${renderGameFaqSection(game)}<section class="game-proof"><div><small>${esc(copy().source)}</small>${profileSource}</div><div><small>${esc(copy().rewardTypes)}</small><strong>${esc(profile.types)}</strong></div><div><small>${esc(copy().cadence)}</small><strong>${esc(profile.cadence)}</strong></div><p>ⓘ ${esc(copy().note)} ${mode === "none" ? `· ${esc(copy().noRewardNow)}` : ""}</p>${game.slug === "match-masters" ? `<p class="match-validation-note">ⓘ ${esc(copy().matchMastersPolicy)}</p>` : ""}</section>${followSection}${otherGames.length ? gameVerticalSection("game-other", "🎯", gamePageCopy().other, gamePageCopy().otherCopy, `<div class="other-games-grid">${otherGamesMarkup}</div>`, "other-games-section") : ""}</div>`;
};
const renderMatchMastersRewardCard = (reward, game) => {
  const ownerPerksCard = isOwnerConfirmedMatchMastersReward(reward);
  const visual = matchMastersTypeVisual(reward);
  const quantity = matchMastersQuantity(reward);
  const manualInvalid = /^invalid-/.test(matchMastersManualOutcome(reward));
  const openedReward = rewardIsOpened(reward);
  const claimed = Boolean(claimedRewards()[reward.id]);
  const status = manualInvalid ? { key: "expired", icon: "🔴", label: copy().manualInvalid } : openedReward || claimed ? { key: "opened", icon: "✓", label: state.lang === "pt" ? "JÁ ABERTO" : "ALREADY OPENED" } : isExpired(reward) ? { key: "expired", icon: "🔴", label: state.lang === "pt" ? "EXPIRADO" : "EXPIRED" } : isProblem(reward) || isUnconfirmed(reward) || !isConfirmedReward(reward) ? { key: "unconfirmed", icon: "⚠", label: state.lang === "pt" ? "NÃO CONFIRMADO" : "NOT CONFIRMED" } : { key: "available", icon: "🟢", label: state.lang === "pt" ? "DISPONÍVEL" : "AVAILABLE" };
  const rewardName = usableRewardName(reward);
  const rewardTitle = ownerPerksCard ? "⭐ 7 Perks grátis" : matchMastersManualLabel(reward) || (quantity ? `${quantity} ${visual?.label || (state.lang === "pt" ? "RECOMPENSA" : "REWARD")}` : rewardName || (state.lang === "pt" ? "Recompensa Match Masters" : "Match Masters reward"));
  const directDescription = String(reward?.reward_description || "").trim();
  const rewardDescription = ownerPerksCard ? "Confirmado no jogo • Hoje" : matchMastersManualStatusText(reward) || (directDescription && !/^A URL foi encontrada/i.test(directDescription) ? directDescription : rewardDisplayText(reward));
  const rewardMeta = ownerPerksCard ? "" : `<div class="mm-reward-meta"><span>${esc(formatRewardDate(reward))}</span><span>${esc(sourceNameFrom(reward))}</span></div>`;
  const analytics = ` data-analytics-game-name="${esc(game.name)}" data-analytics-gift-name="${esc(rewardTitle)}" data-analytics-reward-id="${esc(reward.id)}"`;
  const canOpen = Boolean(reward.url) && !isExpired(reward) && !isProblem(reward);
  const collectLabel = matchMastersMessengerExclusive(reward) ? (state.lang === "pt" ? "ABRIR LINK DO MESSENGER" : state.lang === "es" ? "ABRIR EN MESSENGER" : state.lang === "de" ? "LINK IM MESSENGER ÖFFNEN" : state.lang === "tr" ? "MESSENGER BAĞLANTISINI AÇ" : "OPEN MESSENGER LINK") : (state.lang === "pt" ? "ABRIR NO JOGO" : state.lang === "en" ? "OPEN IN GAME" : state.lang === "es" ? "ABRIR EN EL JUEGO" : state.lang === "de" ? "IM SPIEL ÖFFNEN" : "OYUNDA AÇ");
  const unavailableLabel = manualInvalid ? copy().manualInvalid : status.key === "expired" ? (state.lang === "pt" ? "EXPIRADO" : "EXPIRED") : (state.lang === "pt" ? "LINK INDISPONÍVEL" : "LINK UNAVAILABLE");
  const action = canOpen ? `<a class="mm-collect-button" href="${esc(reward.url)}" target="_blank" rel="noopener noreferrer" data-open-reward="${esc(reward.id)}"${analytics}>🎁 ${esc(collectLabel)} <span>↗</span></a>` : `<span class="mm-collect-button is-disabled">${esc(unavailableLabel)}</span>`;
  const copyAction = reward.url && !isExpired(reward) && !isProblem(reward) ? `<button class="mm-secondary-action" type="button" data-copy-url="${esc(reward.url)}"${analytics}>${esc(copy().copyLink)}</button>` : "";
  const cardOpenAttrs = canOpen ? ` data-mm-card-open="${esc(reward.url)}" data-mm-card-id="${esc(reward.id)}" data-mm-card-game="${esc(game.name)}" data-mm-card-name="${esc(rewardTitle)}" tabindex="0" role="link" aria-label="${esc(`${collectLabel}: ${rewardTitle}`)}"` : "";
  return `<article class="mm-reward-card mm-link-card ${status.key}${ownerPerksCard ? " mm-owner-perks-card" : ""}"${cardOpenAttrs}><div class="mm-reward-art">${rewardArt(reward, game)}<span class="mm-reward-game">🎮 ${esc(game.name)}</span></div><div class="mm-reward-card-content"><div class="mm-reward-status ${status.key}"><span>${status.icon}</span>${esc(status.label)}</div><h3>${esc(rewardTitle)}</h3><p class="mm-reward-description">${esc(rewardDescription)}</p>${rewardMeta}<div class="mm-reward-actions">${action}${copyAction}<button class="mm-favorite-action ${isFavorite("reward", reward.id) ? "is-favorite" : ""}" type="button" data-favorite-type="reward" data-favorite-id="${esc(reward.id)}" aria-label="${esc(isFavorite("reward", reward.id) ? copy().unfavorite : copy().favorite)}">${isFavorite("reward", reward.id) ? "♥" : "♡"}</button></div></div>${playerConfirmationMarkup(reward)}</article>`;
};
const matchMastersCodePrize = (reward) => {
  const direct = String(reward?.reward_description || "").trim();
  if (direct && !/^GG_/i.test(direct) && !/^A URL foi encontrada/i.test(direct)) return direct;
  const name = usableRewardName(reward);
  if (name) return name;
  const visual = matchMastersTypeVisual(reward);
  const quantity = matchMastersQuantity(reward);
  if (visual) return `${quantity ? `${quantity} ` : ""}${visual.label}`;
  return state.lang === "pt" ? "Prêmio a confirmar" : state.lang === "en" ? "Prize to be confirmed" : state.lang === "es" ? "Premio por confirmar" : state.lang === "de" ? "Preis zu bestätigen" : "Ödül doğrulanacak";
};
const renderMatchMastersCodeCard = (reward, game, index = null) => {
  const code = String(reward?.reward_code || "").trim();
  const destination = rewardCodeOpenUrl(reward);
  const claimed = Boolean(claimedRewards()[reward.id]);
  const expired = isExpired(reward);
  const statusLabel = expired ? (state.lang === "pt" ? "EXPIRADO" : "EXPIRED") : claimed ? claimedLabel() : (state.lang === "pt" ? "CÓDIGO ATIVO" : state.lang === "en" ? "ACTIVE CODE" : state.lang === "es" ? "CÓDIGO ACTIVO" : state.lang === "de" ? "AKTIVER CODE" : "AKTİF KOD");
  const analytics = ` data-analytics-game-name="${esc(game.name)}" data-analytics-gift-name="${esc(code)}" data-analytics-reward-id="${esc(reward.id)}"`;
  const redeem = destination && !expired
    ? `<a class="mm-code-redeem" href="${esc(destination)}" target="_blank" rel="noopener noreferrer" data-redeem-reward="${esc(reward.id)}"${analytics}>RESGATAR CÓDIGO ↗</a>`
    : `<span class="mm-code-redeem is-disabled" title="${expired ? "Código expirado" : "Este código não possui um link de resgate cadastrado"}">RESGATAR CÓDIGO</span>`;
  const date = formatRewardDate(reward);
  const source = sourceNameFrom(reward);
  const favorite = isFavorite("reward", reward.id);
  const codeMarkup = code ? `<code class="mm-code-value">${esc(code)}</code>` : `<span class="mm-code-value is-unavailable">${state.lang === "pt" ? "CÓDIGO INDISPONÍVEL" : "CODE UNAVAILABLE"}</span>`;
  const copyMarkup = code && !expired && !isProblem(reward) ? `<button class="mm-code-copy" type="button" data-copy-code="${esc(code)}"${analytics}>COPIAR CÓDIGO</button>` : `<span class="mm-code-copy is-disabled" aria-disabled="true">${expired ? (state.lang === "pt" ? "CÓDIGO EXPIRADO" : "EXPIRED CODE") : state.lang === "pt" ? "CÓDIGO INDISPONÍVEL" : "CODE UNAVAILABLE"}</span>`;
  return `<article id="mm-code-${String(reward.id).replace(/[^a-zA-Z0-9_-]/g, "")}" class="mm-code-card ${expired ? "is-expired" : ""} ${claimed ? "is-claimed" : ""}"><div class="mm-code-card-heading"><span class="mm-code-brand">✦ MATCH MASTERS</span><span class="mm-code-status">${expired ? "🔴" : claimed ? "✓" : "🟢"} ${esc(statusLabel)}</span><button class="mm-code-favorite ${favorite ? "is-favorite" : ""}" type="button" data-favorite-type="reward" data-favorite-id="${esc(reward.id)}" aria-label="${esc(favorite ? copy().unfavorite : copy().favorite)}">${favorite ? "♥" : "♡"}</button></div>${Number.isInteger(index) ? `<span class="mm-code-index">CÓDIGO ${index}</span>` : ""}<div class="mm-code-prize"><small>PRÊMIO</small><strong>${esc(matchMastersCodePrize(reward))}</strong></div>${codeMarkup}<div class="mm-code-actions">${copyMarkup}${redeem}</div><button class="mm-code-claimed" type="button" data-mark-claimed="${esc(reward.id)}">${claimed ? "✓ " + claimedLabel() : markClaimedLabel()}</button><div class="mm-code-meta">${date ? `<span>${esc(date)}</span>` : ""}${source ? `<span>${esc(source)}</span>` : ""}</div>${playerConfirmationMarkup(reward)}</article>`;
};
const renderMatchMasters = (game) => {
  const ui = ({
    pt: { subtitle: "Presentes, boosters e novidades", updated: "Atualizado recentemente", today: "PRESENTES DE HOJE", todayCopy: "Links e recompensas reais encontrados para o Match Masters.", previous: "PRESENTES ANTERIORES", previousCopy: "Recompensas armazenadas que continuam no histórico.", yesterday: "ONTEM", older: "ANTERIORES", news: "NOVIDADES", about: "SOBRE O MATCH MASTERS", redeem: "Como resgatar presentes", events: "Eventos", tips: "Dicas", newsTab: "Novidades", emptyToday: "Nenhum presente encontrado hoje.", emptyPrevious: "Nenhum presente anterior disponível.", emptyNews: "Buscando novas informações do Match Masters…", info: "Informações úteis e orientações curtas." },
    en: { subtitle: "Gifts, boosters and updates", updated: "Recently updated", today: "TODAY'S GIFTS", todayCopy: "Real links and rewards found for Match Masters.", previous: "PREVIOUS GIFTS", previousCopy: "Stored rewards that remain in your history.", yesterday: "YESTERDAY", older: "OLDER", news: "NEWS", about: "ABOUT MATCH MASTERS", redeem: "How to redeem gifts", events: "Events", tips: "Tips", newsTab: "News", emptyToday: "No gifts found today.", emptyPrevious: "No previous gifts available.", emptyNews: "Looking for new Match Masters information…", info: "Useful information and short guidance." },
    es: { subtitle: "Regalos, boosters y novedades", updated: "Actualizado recientemente", today: "REGALOS DE HOY", todayCopy: "Enlaces y recompensas reales encontrados para Match Masters.", previous: "REGALOS ANTERIORES", previousCopy: "Recompensas guardadas que permanecen en tu historial.", yesterday: "AYER", older: "ANTERIORES", news: "NOVEDADES", about: "SOBRE MATCH MASTERS", redeem: "Cómo canjear regalos", events: "Eventos", tips: "Consejos", newsTab: "Novedades", emptyToday: "No se encontraron regalos hoy.", emptyPrevious: "No hay regalos anteriores disponibles.", emptyNews: "Buscando nueva información de Match Masters…", info: "Información útil y orientación breve." },
    de: { subtitle: "Geschenke, Booster und Neuigkeiten", updated: "Kürzlich aktualisiert", today: "GESCHENKE HEUTE", todayCopy: "Echte Links und Belohnungen für Match Masters.", previous: "FRÜHERE GESCHENKE", previousCopy: "Gespeicherte Belohnungen in deinem Verlauf.", yesterday: "GESTERN", older: "ÄLTER", news: "NEUIGKEITEN", about: "ÜBER MATCH MASTERS", redeem: "Geschenke einlösen", events: "Events", tips: "Tipps", newsTab: "News", emptyToday: "Heute keine Geschenke gefunden.", emptyPrevious: "Keine früheren Geschenke verfügbar.", emptyNews: "Suche nach neuen Match-Masters-Informationen…", info: "Nützliche Informationen und kurze Hinweise." },
    tr: { subtitle: "Hediyeler, güçlendiriciler ve yenilikler", updated: "Yakın zamanda güncellendi", today: "BUGÜNÜN HEDİYELERİ", todayCopy: "Match Masters için gerçek bağlantılar ve ödüller.", previous: "ÖNCEKİ HEDİYELER", previousCopy: "Geçmişte saklanan ödüller.", yesterday: "DÜN", older: "ESKİ", news: "YENİLİKLER", about: "MATCH MASTERS HAKKINDA", redeem: "Hediyeler nasıl alınır", events: "Etkinlikler", tips: "İpuçları", newsTab: "Yenilikler", emptyToday: "Bugün hediye bulunamadı.", emptyPrevious: "Önceki hediye yok.", emptyNews: "Yeni Match Masters bilgileri aranıyor…", info: "Yararlı bilgiler ve kısa yönlendirme." },
  }[state.lang] || {});
  if (state.lang === "pt") {
    ui.today = "PRESENTES DISPONÍVEIS";
    ui.todayCopy = "Links e códigos reais que ainda podem ser usados.";
  }
  const links = sortRewards(publicRewardsForGame(game).filter((reward) => !rewardIsCode(reward)));
  const todayLinks = sortRewards(matchMastersTodayRewards(game));
  const todayLinkIds = new Set(todayLinks.map((reward) => String(reward.id)));
  const previousLinks = links.filter((reward) => !todayLinkIds.has(String(reward.id)));
  // Keep the historical Match Masters codes visible, but sorted after usable
  // codes and rendered as expired/disabled when their record says so.
  const codeRewards = sortCodes(publicRewardsForGame(game).filter((reward) => rewardIsCode(reward)));
  const gameNews = publicNewsForGame(game);
  const latestUpdate = [...links, ...gameNews].map((item) => item.last_checked_at || item.published_at || item.found_at || item.created_at).filter(Boolean).sort().at(-1);
  const info = gameInfoFor(game);
  const content = centerContent(game);
  const linkSection = `<section class="mm-section mm-link-section" id="mm-links"><div class="mm-section-heading"><span class="mm-section-icon">🎁</span><div><span class="mm-section-kicker">MATCH MASTERS</span><h2>${state.lang === "pt" ? "PRESENTES DE HOJE" : state.lang === "en" ? "TODAY'S GIFTS" : state.lang === "es" ? "REGALOS DE HOY" : state.lang === "de" ? "GESCHENKE HEUTE" : "BUGÜNÜN HEDİYELERİ"}</h2><p>${state.lang === "pt" ? "Somente links realmente publicados ou detectados hoje no Match Masters." : state.lang === "en" ? "Only Match Masters links published or detected today." : state.lang === "es" ? "Solo enlaces de Match Masters publicados o detectados hoy." : state.lang === "de" ? "Nur heute veröffentlichte oder gefundene Match-Masters-Links." : "Yalnızca bugün yayınlanan veya bulunan Match Masters bağlantıları."}</p></div></div>${todayLinks.length ? `<div class="mm-carousel mm-link-carousel" tabindex="0" aria-label="${state.lang === "pt" ? "Presentes de hoje do Match Masters" : "Today's Match Masters gifts"}">${todayLinks.map((reward) => renderMatchMastersRewardCard(reward, game)).join("")}</div>` : `<div class="mm-empty-state"><span>🎁</span><strong>${esc(ui.emptyToday)}</strong></div>`}</section>`;
  const previousLinkSection = `<section class="mm-section mm-link-section mm-previous-link-section" id="mm-previous"><div class="mm-section-heading"><span class="mm-section-icon">📅</span><div><span class="mm-section-kicker">MATCH MASTERS</span><h2>${state.lang === "pt" ? "PRESENTES ANTERIORES" : state.lang === "en" ? "PREVIOUS GIFTS" : state.lang === "es" ? "REGALOS ANTERIORES" : state.lang === "de" ? "FRÜHERE GESCHENKE" : "ÖNCEKİ HEDİYELER"}</h2><p>${state.lang === "pt" ? "Links de dias anteriores, mantidos separados do que chegou hoje." : state.lang === "en" ? "Earlier links kept separate from today's gifts." : state.lang === "es" ? "Enlaces anteriores separados de los regalos de hoy." : state.lang === "de" ? "Frühere Links getrennt von den heutigen Geschenken." : "Önceki bağlantılar bugünün hediyelerinden ayrı tutulur."}</p></div></div>${previousLinks.length ? `<div class="mm-carousel mm-link-carousel" tabindex="0" aria-label="${state.lang === "pt" ? "Presentes anteriores do Match Masters" : "Previous Match Masters gifts"}">${previousLinks.map((reward) => renderMatchMastersRewardCard(reward, game)).join("")}</div>` : `<div class="mm-empty-state"><span>📅</span><strong>${esc(ui.emptyPrevious)}</strong></div>`}</section>`;
  const codeSection = codeRewards.length ? `<section class="mm-section mm-code-section" id="mm-codes"><div class="mm-section-heading"><span class="mm-section-icon">🔑</span><div><span class="mm-section-kicker">MATCH MASTERS</span><h2>${state.lang === "pt" ? "CÓDIGOS DE RECOMPENSA" : esc(gamePageCopy().codes)}</h2><p>${state.lang === "pt" ? "Todos os códigos do Match Masters, sem misturar com presentes por link." : esc(gamePageCopy().codesCopy)}</p></div></div><div class="mm-carousel mm-code-carousel" tabindex="0" aria-label="${state.lang === "pt" ? "Códigos de recompensa do Match Masters" : "Match Masters reward codes"}">${codeRewards.map((reward, index) => renderMatchMastersCodeCard(reward, game, index + 1)).join("")}</div></section>` : "";
  const newsMarkup = gameNews.length ? `<div class="mm-news-list">${gameNews.map((item) => editorialNewsCard(item)).join("")}</div>` : `<div class="mm-empty-state"><span>🔎</span><strong>${esc(ui.emptyNews)}</strong><p>${esc(ui.info)}</p></div>`;
  const redeemMarkup = info?.redeem?.length ? `<ol>${info.redeem.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>` : `<p>${esc(ui.info)}</p>`;
  const tipsMarkup = content?.tips?.length ? `<ul>${content.tips.map((tip) => `<li>${esc(tip)}</li>`).join("")}</ul>` : `<p>${esc(ui.info)}</p>`;
  const eventMarkup = gameNews.length ? `<p>${esc(gameNews[0].title || ui.info)}</p>` : `<p>${esc(ui.emptyNews)}</p>`;
  const fav = isFavorite("game", game.id);
  const following = noticePrefs().games.includes(String(game.slug));
  return `<div class="mm-page"><div class="mm-page-top"><button type="button" class="mm-back-button" data-go-back="${pathFor("games")}" aria-label="${esc(copy().games)}">←</button><div class="mm-page-identity">${gameArt(game, "mm-logo") }<div><strong>MATCH MASTERS</strong><span>${esc(state.lang === "pt" ? "Página oficial de presentes e códigos" : ui.subtitle)}</span></div></div><div class="mm-page-actions"><button class="mm-icon-action ${fav ? "is-favorite" : ""}" type="button" data-favorite-type="game" data-favorite-id="${game.id}" aria-label="${esc(fav ? centralCopy().following : copy().favorite)}">${fav ? "♥" : "♡"}</button><button class="mm-follow-action ${following ? "is-following" : ""}" type="button" data-notice-toggle="${esc(game.slug)}">🔔 <span>${esc(following ? centralCopy().following : centralCopy().follow)}</span></button></div></div><section class="mm-hero"><div class="mm-hero-art">${gameArt(game, "mm-hero-image")}</div><div class="mm-hero-overlay"></div><div class="mm-hero-copy"><span class="mm-hero-kicker">✦ MATCH MASTERS</span><h1>MATCH<br><em>MASTERS</em></h1><p>🎁 ${esc(state.lang === "pt" ? "TODOS OS PRESENTES E CÓDIGOS" : state.lang === "en" ? "ALL GIFTS AND CODES" : "TODOS LOS REGALOS Y CÓDIGOS")}</p><span class="mm-hero-subtitle">${esc(state.lang === "pt" ? "Todos os presentes, links e códigos em um só lugar" : state.lang === "en" ? "All gifts, links and codes in one place" : "Todos los regalos, enlaces y códigos en un solo lugar")}</span>${latestUpdate ? `<span class="mm-updated">● ${esc(ui.updated)} · ${esc(timeAgo(latestUpdate))}</span>` : ""}</div></section><nav class="mm-anchor-nav" aria-label="Match Masters"><a href="#mm-links">🎁 ${state.lang === "pt" ? "PRESENTES DE HOJE" : "TODAY'S GIFTS"}</a><a href="#mm-previous">📅 ${state.lang === "pt" ? "PRESENTES ANTERIORES" : "PREVIOUS GIFTS"}</a><a href="#mm-codes">🔑 ${state.lang === "pt" ? "CÓDIGOS" : "CODES"}</a><a href="#mm-news">✨ ${esc(ui.news)}</a></nav>${linkSection}${previousLinkSection}${codeSection}<section class="mm-section mm-news-section" id="mm-news"><div class="mm-section-heading"><span class="mm-section-icon">✨</span><div><span class="mm-section-kicker">MATCH MASTERS</span><h2>${esc(ui.news)}</h2><p>${esc(gamePageCopy().newsCopy)}</p></div></div>${newsMarkup}</section><section class="mm-section mm-about-section" id="mm-about"><div class="mm-section-heading"><span class="mm-section-icon">💡</span><div><span class="mm-section-kicker">MATCH MASTERS</span><h2>${esc(ui.about)}</h2><p>${esc(ui.info)}</p></div></div><div class="mm-details-grid"><details open><summary>🎁 ${esc(ui.redeem)}</summary>${redeemMarkup}</details><details><summary>🔥 ${esc(ui.events)}</summary>${eventMarkup}</details><details><summary>💡 ${esc(ui.tips)}</summary>${tipsMarkup}</details><details><summary>📰 ${esc(ui.newsTab)}</summary><p>${esc(gameNews.length ? gameNews[0].summary || gameNews[0].title || ui.info : ui.emptyNews)}</p></div></section></div>`;
};
const newsDateLabel = (value) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "";
  return new Intl.DateTimeFormat(state.lang === "pt" ? "pt-BR" : state.lang, { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)).replace(".", "");
};
const newsRemainingLabel = (value) => {
  if (!value || Number.isNaN(new Date(value).getTime())) return "";
  const diff = new Date(value).getTime() - Date.now();
  if (diff <= 0) return "";
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(hours / 24);
  const restHours = hours % 24;
  if (state.lang === "pt") return days ? `Termina em ${days} d ${restHours} h` : `Termina em ${Math.max(1, hours)} h`;
  if (state.lang === "en") return days ? `Ends in ${days}d ${restHours}h` : `Ends in ${Math.max(1, hours)}h`;
  if (state.lang === "es") return days ? `Termina en ${days} d ${restHours} h` : `Termina en ${Math.max(1, hours)} h`;
  if (state.lang === "de") return days ? `Endet in ${days} T. ${restHours} Std.` : `Endet in ${Math.max(1, hours)} Std.`;
  return days ? `${days} gün ${restHours} saat kaldı` : `${Math.max(1, hours)} saat kaldı`;
};
const newsItemSlug = (item) => String(item?.slug || item?.id || `${item?.game_slug || "news"}-${String(item?.title || "update").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`).slice(0, 90);
const editorialNewsCard = (item) => {
  const game = gameFor(item.game_slug);
  const source = item.source_url ? `<a href="${esc(item.source_url)}" target="_blank" rel="noopener noreferrer">${esc(item.source_name || "Fonte")} ↗</a>` : esc(item.source_name || "");
  const image = item.image ? `<img src="${esc(assetUrl(item.image))}" alt="" loading="lazy" />` : game ? gameArt(game, "editorial-news-art") : "";
  const date = newsDateLabel(item.published_at || item.created_at);
  const remaining = newsRemainingLabel(item.ends_at);
  return `<article class="editorial-news-card"><div class="editorial-news-image">${image}</div><div class="editorial-news-body"><span class="editorial-news-game">${esc(game?.name || item.game_name || "")}</span><h2>${esc(item.title || "Novidade")}</h2><p>${esc(item.summary || "")}</p><div class="editorial-news-meta">${date ? `<span>${esc(date)}</span>` : ""}${remaining ? `<strong>${esc(remaining)}</strong>` : ""}${source ? `<span class="editorial-news-source">${source}</span>` : ""}</div><a class="portal-news-read" href="${pathFor("news", newsItemSlug(item))}" data-route>LER MAIS →</a></div></article>`;
};
const renderNews = () => {
  const recentMode = true;
  const list = [];
  const recentRewards = recentHomeRewards().slice(0, 24);
  const pageTitle = state.lang === "pt" ? "ACABOU DE CHEGAR" : state.lang === "en" ? "JUST IN" : state.lang === "es" ? "ACABA DE LLEGAR" : state.lang === "de" ? "GERADE EINGETROFFEN" : "AZ ÖNCE GELDİ";
  const pageCopy = state.lang === "pt" ? "Links, códigos e recompensas reais mais recentes." : state.lang === "en" ? "The latest real links, codes and rewards." : state.lang === "es" ? "Los enlaces, códigos y recompensas reales más recientes." : state.lang === "de" ? "Die neuesten echten Links, Codes und Belohnungen." : "En yeni gerçek bağlantılar, kodlar ve ödüller.";
  const content = recentMode ? (recentRewards.length ? `<div class="reward-list">${recentRewards.map((reward, index) => rewardCard(reward, gameFor(reward.game_slug), index + 1)).join("")}</div>` : emptyState(state.lang === "pt" ? "Nenhum presente novo encontrado no momento." : copy().noNews, state.lang === "pt" ? "A coleta automática continua verificando links públicos reais." : copy().noNewsCopy, "🎁")) : (list.length ? `<div class="editorial-news-list">${list.map(editorialNewsCard).join("")}</div>` : emptyState(copy().noNews, copy().noNewsCopy, "📣"));
  return `<div class="page-top"><button type="button" data-go-back="${pathFor("home")}" class="back-link">← ${esc(copy().home)}</button></div><div class="section-head" style="margin-top:0"><div><p class="eyebrow">${recentMode ? "🎁" : "✧"} GAME GIFTS</p><h1 style="font-size:clamp(30px,5vw,52px)">${esc(pageTitle)}</h1><p>${esc(pageCopy)}</p></div></div>${content}`;
};
const renderRecentGifts = () => {
  const recentRewards = recentHomeRewards();
  const text = state.lang === "pt"
    ? { title: "ACABOU DE CHEGAR", copy: "Os presentes mais recentes, organizados por jogo.", all: "Ver todos", gifts: "novos presentes", open: "ABRIR PRESENTE", copyCode: "COPIAR CÓDIGO", available: "Presente disponível", empty: "Nenhum presente novo por enquanto.", note: "Só mostramos jogos que têm presentes reais disponíveis no momento." }
    : state.lang === "es"
      ? { title: "ACABA DE LLEGAR", copy: "Los regalos más recientes, organizados por juego.", all: "Ver todos", gifts: "regalos nuevos", open: "ABRIR REGALO", copyCode: "COPIAR CÓDIGO", available: "Regalo disponible", empty: "Ningún regalo nuevo por ahora.", note: "Solo mostramos juegos con regalos reales disponibles." }
      : state.lang === "de"
        ? { title: "GERADE EINGETROFFEN", copy: "Die neuesten Geschenke, nach Spiel geordnet.", all: "Alle ansehen", gifts: "neue Geschenke", open: "GESCHENK ÖFFNEN", copyCode: "CODE KOPIEREN", available: "Geschenk verfügbar", empty: "Momentan keine neuen Geschenke.", note: "Wir zeigen nur Spiele mit echten verfügbaren Geschenken." }
        : state.lang === "tr"
          ? { title: "AZ ÖNCE GELDİ", copy: "En yeni hediyeler oyuna göre düzenlendi.", all: "Tümünü gör", gifts: "yeni hediye", open: "HEDİYEYİ AÇ", copyCode: "KODU KOPYALA", available: "Mevcut hediye", empty: "Şimdilik yeni hediye yok.", note: "Yalnızca gerçek hediyesi olan oyunları gösteriyoruz." }
          : { title: "JUST IN", copy: "The latest gifts, organized by game.", all: "View all", gifts: "new gifts", open: "OPEN GIFT", copyCode: "COPY CODE", available: "Gift available", empty: "No new gifts for now.", note: "Only games with real available gifts are shown." };
  const groups = new Map();
  recentRewards.forEach((reward) => {
    const game = gameFor(reward.game_slug);
    if (!game) return;
    if (!groups.has(game.slug)) groups.set(game.slug, { game, rewards: [] });
    groups.get(game.slug).rewards.push(reward);
  });
  const grouped = [...groups.values()].sort((a, b) => new Date(rewardFoundAt(b.rewards[0])).getTime() - new Date(rewardFoundAt(a.rewards[0])).getTime());
  const recentCard = (reward, game) => {
    const isCode = rewardIsCode(reward);
    const destination = isCode ? rewardCodeOpenUrl(reward) : rewardOpenUrl(reward);
    const visual = isCode ? codeRewardVisual() : (isMatchMastersReward(reward) ? matchMastersTypeVisual(reward) : rewardVisual(reward));
    const typeLabel = visual?.label || usableRewardName(reward) || text.available;
    const confirmedAmount = isConfirmedReward(reward) ? String(reward.reward_amount || reward.quantity || (isMatchMastersReward(reward) ? matchMastersQuantity(reward) : "") || "").trim() : "";
    const title = confirmedAmount ? `${confirmedAmount} ${typeLabel}` : typeLabel;
    const status = homeArrivalStatus(reward);
    const analytics = ` data-analytics-game-name="${esc(game.name)}" data-analytics-gift-name="${esc(title)}" data-analytics-reward-id="${esc(reward.id)}"`;
    const actions = [];
    if (isCode && reward.reward_code) actions.push(`<button type="button" class="recent-gifts-card-action" data-copy-code="${esc(reward.reward_code)}"${analytics}>${text.copyCode} <span aria-hidden="true">⧉</span></button>`);
    if (isCode && destination && !isExpired(reward) && !isProblem(reward)) actions.push(`<a class="recent-gifts-card-action" href="${esc(destination)}" target="_blank" rel="noopener noreferrer" data-redeem-reward="${esc(reward.id)}"${analytics}>${state.lang === "pt" ? "RESGATAR CÓDIGO" : state.lang === "en" ? "REDEEM CODE" : state.lang === "es" ? "CANJEAR CÓDIGO" : state.lang === "de" ? "CODE EINLÖSEN" : "KODU KULLAN"} <span aria-hidden="true">↗</span></a>`);
    if (!isCode && destination) actions.push(`<a class="recent-gifts-card-action" href="${esc(destination)}" target="_blank" rel="noopener noreferrer" data-open-reward="${esc(reward.id)}"${analytics}>${text.open} <span aria-hidden="true">↗</span></a>`);
    const action = actions.length ? `<div class="recent-gifts-card-actions">${actions.join("")}</div>` : `<span class="recent-gifts-card-action is-disabled">${isCode ? (state.lang === "pt" ? "RESGATE INDISPONÍVEL" : "REDEMPT UNAVAILABLE") : text.available}</span>`;
    return `<article class="recent-gifts-reward-card"><div class="recent-gifts-card-meta"><span>◷ ${esc(homeTimeAgo(rewardFoundAt(reward)) || formatRewardDate(reward) || "")}</span><b>Novo</b></div><div class="recent-gifts-reward-art">${rewardArt(reward, game)}</div><div class="recent-gifts-card-body"><h3>${esc(title)}</h3><span class="recent-gifts-status ${status.className}">${esc(status.label)}</span>${action}<button type="button" class="recent-gifts-favorite ${isFavorite("reward", reward.id) ? "is-favorite" : ""}" data-favorite-type="reward" data-favorite-id="${esc(reward.id)}" aria-label="${esc(isFavorite("reward", reward.id) ? copy().unfavorite : copy().favorite)}">${isFavorite("reward", reward.id) ? "♥" : "♡"}</button></div></article>`;
  };
  const groupMarkup = grouped.map(({ game, rewards }) => `<section class="recent-gifts-game-section"><header class="recent-gifts-game-header"><div class="recent-gifts-game-identity"><div class="recent-gifts-game-art">${gameArt(game, "recent-gifts-game-image")}</div><div><h2>${esc(game.name)}</h2><p>${rewards.length} ${text.gifts}</p></div></div><a class="recent-gifts-see-all" href="${pathFor("games", game.slug)}" data-route>${text.all} <span aria-hidden="true">›</span></a></header><div class="recent-gifts-track">${rewards.map((reward) => recentCard(reward, game)).join("")}</div></section>`).join("");
  const tabs = `<nav class="recent-gifts-tabs" aria-label="Navegação da página"><a href="${pathFor("home")}" data-route><span>⌂</span><b>Início</b></a><a href="${pathFor("games")}" data-route><span>♧</span><b>Jogos</b></a><a class="is-active" href="${pathFor("news")}?recent=1" data-route><span>ϟ</span><b>${text.title}</b></a><a href="${pathFor("codes")}" data-route><span>▣</span><b>Códigos</b></a><a href="${pathFor("more")}#meus-avisos" data-route><span>♧</span><b>Meus avisos</b></a><a href="${pathFor("profile")}" data-route><span>◯</span><b>Perfil</b></a></nav>`;
  return `<div class="recent-gifts-page"><div class="recent-gifts-topline"><button type="button" data-go-back="${pathFor("home")}" class="recent-gifts-back">← ${esc(copy().home)}</button><span>GAME GIFTS</span></div>${tabs}<header class="recent-gifts-page-heading"><div><div class="recent-gifts-heading-title"><span>ϟ</span><h1>${text.title}</h1></div><p>${text.copy}</p></div><button type="button" class="recent-gifts-sort" aria-label="Ordenação atual">Mais recentes <span>⌄</span></button></header><div class="recent-gifts-groups">${groupMarkup || `<div class="recent-gifts-empty"><span>🎁</span><strong>${text.empty}</strong><p>${text.note}</p></div>`}</div>${grouped.length ? `<aside class="recent-gifts-note"><span>💡</span><div><strong>${text.note}</strong><p>${state.lang === "pt" ? "Assim você vê apenas o que realmente pode resgatar." : "This keeps the list limited to rewards that really exist."}</p></div></aside>` : ""}</div>`;
};
const renderFavorites = () => {
  const saved = favorites();
  const games = publicGames().filter((game) => saved.games.includes(Number(game.id)));
  const rewards = publicRewards().filter((reward) => saved.rewards.includes(Number(reward.id)));
  return `<div class="page-top"><button type="button" data-go-back="${pathFor("home")}" class="back-link">← ${esc(copy().home)}</button></div><div class="section-head" style="margin-top:0"><div><p class="eyebrow">⭐ GAME GIFTS</p><h1 style="font-size:clamp(30px,5vw,52px)">${esc(copy().favorites)}</h1></div></div>${games.length ? `<div class="games-grid">${games.map(gameCard).join("")}</div>` : ""}${rewards.length ? `<div class="section-head"><div class="section-heading"><span class="heading-icon">✦</span><h2>${esc(copy().today)}</h2></div></div><div class="reward-list">${rewards.map((reward, index) => rewardCard(reward, gameFor(reward.game_slug), index + 1)).join("")}</div>` : (!games.length ? emptyState(copy().noRewards, copy().noRewardsCopy, "♡") : "")}`;
};
const renderMore = () => `<div class="page-top"><button type="button" data-go-back="${pathFor("home")}" class="back-link">← ${esc(copy().home)}</button></div><div class="section-head" style="margin-top:0"><div><p class="eyebrow">💡 GAME GIFTS</p><h1 style="font-size:clamp(30px,5vw,52px)">${esc(copy().about)}</h1></div></div><div class="more-grid"><section class="info-card"><h2>${esc(copy().about)}</h2><p>${esc(copy().aboutCopy)}</p></section><section class="info-card"><h2>${esc(copy().how)}</h2><ul>${copy().howItems.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section><section class="info-card"><h2>${esc(copy().admin)}</h2><p>${esc(copy().adminCopy)}</p><a class="admin-link" href="${pathFor("admin")}" data-route>→ ${esc(copy().admin)}</a></section></div>`;

const PORTAL_COPY = {
  pt: { tagline: "Mais jogos. Mais presentes. Todo dia.", heroKicker: "PORTAL DE JOGOS E RECOMPENSAS", heroTitle: "Mais prêmios para jogar mais.", heroCopy: "Descubra presentes, códigos, notícias, eventos e guias organizados a partir de dados reais.", viewGifts: "VER PRESENTES", explore: "EXPLORAR JOGOS", popular: "JOGOS EM ALTA HOJE", popularEmpty: "Jogos populares", allGames: "TODOS OS JOGOS", allGamesCopy: "Explore o catálogo completo sem perder nenhum jogo.", justIn: "ACABOU DE CHEGAR", justInCopy: "As recompensas mais recentes encontradas nas fontes monitoradas.", today: "PRESENTES DE HOJE", todayCopy: "Presentes encontrados na data atual, organizados por jogo.", news: "ÚLTIMAS NOTÍCIAS", newsCopy: "Atualizações reais, anúncios e novidades com fonte identificada.", guides: "GUIAS E DICAS", guidesCopy: "Conteúdo útil baseado nas informações já verificadas do portal.", codes: "CÓDIGOS", codesCopy: "Códigos reais publicados no sistema, sem completar ou inventar valores.", events: "EVENTOS", eventsCopy: "Eventos reais dos jogos quando houver dados publicados.", notices: "MEUS AVISOS", noticesCopy: "Escolha os jogos que você quer acompanhar neste dispositivo.", followed: "jogos seguidos", alert: "Avisar quando chegar novo brinde", manage: "GERENCIAR", activateAll: "ATIVAR TODOS", verified: "VERIFICADO", unconfirmed: "NÃO CONFIRMADO", expired: "EXPIRADO", open: "ABRIR NO JOGO", copy: "COPIAR CÓDIGO", source: "Fonte", emptyNews: "Nenhuma notícia real publicada ainda.", emptyEvents: "Nenhum evento real publicado ainda.", emptyCodes: "Nenhum código real encontrado no sistema.", emptyGuides: "Nenhum guia com conteúdo real disponível ainda.", noData: "Ainda não há dados reais para exibir aqui.", topics: "TÓPICOS EM ALTA", noPopularity: "A popularidade aparecerá quando houver contagem real.", community: "PARTICIPE DA NOSSA COMUNIDADE", noCommunity: "Nenhuma comunidade oficial foi configurada ainda." },
  en: { tagline: "More games. More gifts. Every day.", heroKicker: "GAMES AND REWARDS PORTAL", heroTitle: "More rewards to play more.", heroCopy: "Discover gifts, codes, news, events and guides organized from real data.", viewGifts: "VIEW GIFTS", explore: "EXPLORE GAMES", popular: "TRENDING GAMES TODAY", popularEmpty: "Popular games", allGames: "ALL GAMES", allGamesCopy: "Explore the complete catalog without losing any game.", justIn: "JUST IN", justInCopy: "The latest rewards found in monitored sources.", today: "TODAY'S GIFTS", todayCopy: "Gifts found today, organized by game.", news: "LATEST NEWS", newsCopy: "Real updates, announcements and news with identified sources.", guides: "GUIDES AND TIPS", guidesCopy: "Useful content based on information already verified by the portal.", codes: "CODES", codesCopy: "Real codes published in the system, without guessing values.", events: "EVENTS", eventsCopy: "Real game events when published data exists.", notices: "MY ALERTS", noticesCopy: "Choose the games you want to follow on this device.", followed: "games followed", alert: "Notify me when a new gift arrives", manage: "MANAGE", activateAll: "ACTIVATE ALL", verified: "VERIFIED", unconfirmed: "NOT CONFIRMED", expired: "EXPIRED", open: "OPEN IN GAME", copy: "COPY CODE", source: "Source", emptyNews: "No real news has been published yet.", emptyEvents: "No real events have been published yet.", emptyCodes: "No real codes found in the system.", emptyGuides: "No guide with real content is available yet.", noData: "There is not enough real data to show this yet.", topics: "TRENDING TOPICS", noPopularity: "Popularity will appear when real counts are available.", community: "JOIN OUR COMMUNITY", noCommunity: "No official community has been configured yet." },
};
const portalCopy = () => PORTAL_COPY[state.lang] || PORTAL_COPY.en;
const portalBack = (label = copy().home) => `<div class="portal-page-top"><button type="button" class="portal-back-button" data-go-back="${pathFor("home")}">← ${esc(label)}</button></div>`;
const NOTICE_PREFS_KEY = "game-gifts-notices";
const NOTICE_ALERTS_KEY = "game-gifts-notice-alerts";
const NOTICE_KNOWN_REWARDS_KEY = "game-gifts-notice-known-rewards";
const defaultNoticeChannels = () => ({ gifts: true, links: true, codes: true, news: true });
const noticePrefs = () => {
  try {
    const value = JSON.parse(localStorage.getItem(NOTICE_PREFS_KEY) || "{}");
    return {
      games: [...new Set((Array.isArray(value.games) ? value.games : []).map(String).filter(Boolean))],
      channels: { ...defaultNoticeChannels(), ...(value.channels && typeof value.channels === "object" ? value.channels : {}) },
      sound: value.sound !== false,
      vibration: value.vibration === true,
    };
  } catch { return { games: [], channels: defaultNoticeChannels(), sound: true, vibration: false }; }
};
const saveNoticePrefs = (value, sync = true) => {
  const current = noticePrefs();
  const normalized = {
    games: [...new Set((Array.isArray(value?.games) ? value.games : current.games).map(String).filter(Boolean))],
    channels: { ...current.channels, ...(value?.channels && typeof value.channels === "object" ? value.channels : {}) },
    sound: value?.sound == null ? current.sound : Boolean(value.sound),
    vibration: value?.vibration == null ? current.vibration : Boolean(value.vibration),
  };
  try { localStorage.setItem(NOTICE_PREFS_KEY, JSON.stringify(normalized)); } catch {}
  if (sync && state.websimUserId) {
    api("/api/notices/preferences", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(normalized) }).catch((error) => console.warn("Game Gifts: não foi possível sincronizar Meus Avisos.", error));
  }
  return normalized;
};
const readNoticeAlerts = () => {
  try {
    const value = JSON.parse(localStorage.getItem(NOTICE_ALERTS_KEY) || "[]");
    return Array.isArray(value) ? value.filter((item) => item && item.rewardId && item.gameSlug).slice(0, 50) : [];
  } catch { return []; }
};
const saveNoticeAlerts = (value) => { try { localStorage.setItem(NOTICE_ALERTS_KEY, JSON.stringify(value.slice(0, 50))); } catch {} };
const noticeUnreadCount = () => readNoticeAlerts().filter((item) => !item.read).length;
const readKnownNoticeRewards = () => { try { const value = JSON.parse(localStorage.getItem(NOTICE_KNOWN_REWARDS_KEY) || "[]"); return new Set(Array.isArray(value) ? value.map(String) : []); } catch { return new Set(); } };
const saveKnownNoticeRewards = (value) => { try { localStorage.setItem(NOTICE_KNOWN_REWARDS_KEY, JSON.stringify([...value].slice(-1000))); } catch {} };
const noticeRewardKey = (reward) => String(reward?.reward_key || reward?.final_url || reward?.original_url || reward?.url || reward?.id || "").trim().toLowerCase();
const requestNoticePermission = () => {
  if (!state.websimUserId || !window.websim?.notifications?.requestPermission || !window.websim?.notifications?.getPermission) return;
  window.websim.notifications.getPermission().then((current) => {
    state.noticePermission = current?.state || "default";
    if (current?.state !== "default") return;
    return window.websim.notifications.requestPermission();
  }).then((result) => {
    if (!result) return;
    state.noticePermission = result.state || "default";
    if (result?.state === "denied") toast(state.lang === "pt" ? "Avisos salvos neste dispositivo; a permissão de notificação foi recusada." : "Alerts are saved on this device; notification permission was denied.");
  }).catch((error) => console.warn("Game Gifts: permissão de avisos indisponível.", error));
};
const hydrateNoticePrefs = async () => {
  if (!state.websimUserId || state.noticeHydrated) return;
  state.noticeHydrated = true;
  try {
    const serverPrefs = await api("/api/notices/preferences");
    const local = noticePrefs();
    if (serverPrefs.persisted) {
      const games = serverPrefs.games.length || !local.games.length ? serverPrefs.games : local.games;
      saveNoticePrefs({ games, channels: serverPrefs.channels || local.channels }, false);
    }
  } catch (error) { console.warn("Game Gifts: Meus Avisos local; sincronização indisponível.", error); }
};
const syncLocalNoticeAlerts = (data) => {
  const rewards = Array.isArray(data?.rewards) ? data.rewards : [];
  const keys = readKnownNoticeRewards();
  const firstRun = !localStorage.getItem(NOTICE_KNOWN_REWARDS_KEY);
  const followed = new Set(noticePrefs().games);
  const alerts = readNoticeAlerts();
  const alertKeys = new Set(alerts.map((item) => String(item.rewardKey || item.rewardId)));
  for (const reward of rewards) {
    const key = noticeRewardKey(reward);
    if (!key) continue;
    if (!firstRun && !keys.has(key) && followed.has(String(reward.game_slug)) && isAutomaticDiscoveredReward(reward) && isLinkActive(reward)) {
      const item = { rewardId: String(reward.id), rewardKey: key, gameSlug: String(reward.game_slug), createdAt: new Date().toISOString(), read: false };
      if (!alertKeys.has(key)) alerts.unshift(item);
    }
    keys.add(key);
  }
  saveKnownNoticeRewards(keys);
  saveNoticeAlerts(alerts);
};
const toggleNotice = (slug) => {
  const saved = noticePrefs();
  const normalizedSlug = String(slug || "");
  saved.games = saved.games.includes(normalizedSlug) ? saved.games.filter((item) => item !== normalizedSlug) : [...saved.games, normalizedSlug];
  saveNoticePrefs(saved);
  renderPage();
  requestNoticePermission();
};
const openRewardAlert = (rewardId) => {
  const reward = state.data.rewards.find((item) => String(item.id) === String(rewardId));
  const game = reward && gameFor(reward.game_slug);
  if (!reward || !game) return false;
  const alerts = readNoticeAlerts().map((item) => item.rewardId === String(rewardId) ? { ...item, read: true } : item);
  saveNoticeAlerts(alerts);
  go(pathFor("games", game.slug));
  requestAnimationFrame(() => document.getElementById(`reward-${String(rewardId).replace(/[^a-zA-Z0-9_-]/g, "")}`)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  return true;
};
const portalStatus = (reward) => isExpired(reward) ? { key: "expired", label: portalCopy().expired } : isConfirmedReward(reward) ? { key: "verified", label: portalCopy().verified } : { key: "unconfirmed", label: portalCopy().unconfirmed };
const portalRewardAmount = (reward) => { if (!isConfirmedReward(reward)) return ""; return String(reward?.reward_amount || reward?.quantity || matchMastersQuantity(reward) || "").trim(); };
const portalRewardTitle = (reward) => { const title = rewardDisplayText(reward); return title || unidentifiedRewardLabel(); };
const portalRewardCard = (reward) => {
  const game = gameFor(reward?.game_slug) || gameFor(reward?.game);
  const status = portalStatus(reward);
  const amount = portalRewardAmount(reward);
  const url = rewardIsCode(reward) ? rewardCodeOpenUrl(reward) : rewardOpenUrl(reward);
  const analytics = ` data-analytics-game-name="${esc(game?.name || "")}" data-analytics-gift-name="${esc(portalRewardTitle(reward))}" data-analytics-reward-id="${esc(reward.id)}"`;
  const destinationUsable = Boolean(url) && isLinkActive(reward);
  const openLabel = rewardIsCode(reward)
    ? (state.lang === "pt" ? "RESGATAR CÓDIGO" : state.lang === "en" ? "REDEEM CODE" : state.lang === "es" ? "CANJEAR CÓDIGO" : state.lang === "de" ? "CODE EINLÖSEN" : "KODU KULLAN")
    : portalCopy().open;
  const actions = [];
  if (destinationUsable) actions.push(`<a class="portal-card-action" href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${rewardIsCode(reward) ? `data-redeem-reward="${esc(reward.id)}"` : `data-open-reward="${esc(reward.id)}"`}${analytics}>${esc(openLabel)}</a>`);
  if (rewardIsCode(reward) && reward.reward_code && !isExpired(reward) && !isProblem(reward)) actions.push(`<button class="portal-card-action" type="button" data-copy-code="${esc(reward.reward_code)}">${esc(portalCopy().copy)}</button>`);
  const action = actions.join("");
  const actionClass = actions.length > 1 ? " has-secondary-action" : "";
  const sources = game?.slug === "coin-master" ? "" : Array.isArray(reward?.sources) ? reward.sources.join(" · ") : reward?.source || "";
  return `<article class="portal-reward-card ${status.key}"><div class="portal-reward-top"><div class="portal-game-mini">${game ? gameArt(game, "portal-game-art") : ""}<span>${esc(game?.name || reward?.game_name || "Match Masters")}</span></div><span class="portal-status ${status.key}">${esc(status.label)}</span></div><div class="portal-reward-main"><div class="portal-reward-image">${rewardArt(reward, game)}</div><div class="portal-reward-copy"><h3>${esc(portalRewardTitle(reward))}</h3>${amount ? `<strong>${esc(amount)}</strong>` : ""}<div class="portal-reward-meta"><time datetime="${esc(rewardFoundAt(reward))}">${esc(formatRewardDate(reward) || homeTimeAgo(rewardFoundAt(reward)) || "")}</time>${sources ? `<span title="${esc(sources)}">${esc(portalCopy().source)}: ${esc(sources.split(" · ")[0])}</span>` : ""}</div></div></div>${action ? `<div class="portal-reward-actions${actionClass}">${action}<button class="portal-favorite" type="button" data-favorite-type="reward" data-favorite-id="${esc(reward.id)}" aria-label="${esc(isFavorite("reward", reward.id) ? copy().unfavorite : copy().favorite)}">${isFavorite("reward", reward.id) ? "♥" : "♡"}</button></div>` : ""}</article>`;
};
const portalGameTile = (game) => `<article class="portal-game-tile-wrap"><a class="portal-game-tile" href="${pathFor("games", game.slug)}" data-route data-analytics-game-name="${esc(game.name)}" data-analytics-game-slug="${esc(game.slug)}">${gameArt(game, "portal-game-image")}<div><h3>${esc(game.name)}</h3><small>${esc(gameAvailabilityLabel(activeRewardsForGame(game).length))}</small></div></a><button type="button" class="portal-tile-heart" data-favorite-type="game" data-favorite-id="${esc(game.id)}" aria-label="${esc(isFavorite("game", game.id) ? copy().unfavorite : copy().favorite)}">${isFavorite("game", game.id) ? "♥" : "♡"}</button></article>`;
const portalEmpty = (title, message, icon = "✦") => `<div class="portal-empty"><span>${icon}</span><strong>${esc(title)}</strong><p>${esc(message)}</p></div>`;
const portalNoticePanel = () => {
  const ui = portalCopy();
  const saved = noticePrefs();
  const games = publicGames();
  return `<section class="portal-section portal-notices" id="meus-avisos"><div class="portal-section-heading"><div><span class="portal-kicker">🔔 ${esc(ui.notices)}</span><p>${esc(ui.noticesCopy)}</p></div><strong>${saved.games.length} ${esc(ui.followed)}</strong></div><div class="portal-notice-list">${games.map((game) => { const on = saved.games.includes(String(game.slug)); return `<div class="portal-notice-row"><div>${gameArt(game, "portal-notice-art")}<div><strong>${esc(game.name)}</strong><span>${esc(ui.alert)}</span></div></div><button type="button" class="portal-switch ${on ? "on" : ""}" data-notice-toggle="${esc(game.slug)}" aria-pressed="${on}"><span></span></button></div>`; }).join("") || portalEmpty(ui.notices, ui.noData, "🔔")}</div><div class="portal-notice-actions"><a class="portal-secondary-button" href="#meus-avisos">${esc(ui.manage)}</a><button class="portal-secondary-button" type="button" data-notice-all>${esc(ui.activateAll)}</button></div></section>`;
};
const portalTodaySection = () => {
  const ui = portalCopy();
  const groups = publicGames().map((game) => ({ game, rewards: publicTodayRewardsForGame(game) })).filter((entry) => entry.rewards.length);
  return `<section class="portal-section"><div class="portal-section-heading"><div><span class="portal-kicker">🎁 ${esc(ui.today)}</span><p>${esc(ui.todayCopy)}</p></div><a href="${pathFor("news")}?recent=1" data-route>Ver todos →</a></div><div class="portal-today-grid">${groups.map(({ game, rewards }) => `<a class="portal-today-card" href="${pathFor("games", game.slug)}" data-route>${gameArt(game, "portal-today-art")}<div><span>${esc(game.name)}</span><strong>${esc(rewards.map((reward) => portalRewardTitle(reward)).slice(0, 2).join(" · "))}</strong><small>${rewards.length} ${rewards.length === 1 ? "presente" : "presentes"}</small></div></a>`).join("") || portalEmpty(ui.today, ui.noData, "🎁")}</div></section>`;
};
const portalTrending = () => {
  const ui = portalCopy();
  const popular = Array.isArray(state.data.popular) ? state.data.popular.map((entry) => gameFor(entry.slug || entry.game_slug)).filter(Boolean) : [];
  return `<section class="portal-section portal-trending"><div class="portal-section-heading"><div><span class="portal-kicker">🔥 ${esc(ui.topics)}</span></div></div>${popular.length ? `<div class="portal-topic-list">${popular.slice(0, 5).map((game, index) => `<a href="${pathFor("games", game.slug)}" data-route><b>${index + 1}</b><span>${esc(game.name)}</span></a>`).join("")}</div>` : portalEmpty(ui.popularEmpty, ui.noPopularity, "🔥")}</section>`;
};
const portalCodesSection = () => {
  const codes = sortCodes(publicRewards().filter((reward) => rewardIsCode(reward)).filter((reward) => !isExpired(reward) && !isProblem(reward))).slice(0, 8);
  return `<section class="portal-section portal-home-codes"><div class="portal-section-heading"><div><span class="portal-kicker">🔑 CÓDIGOS ATIVOS</span><p>Somente códigos reais publicados no catálogo atual.</p></div><a href="${pathFor("codes")}" data-route>Ver todos →</a></div><div class="portal-reward-grid portal-horizontal-cards">${codes.map(portalRewardCard).join("") || portalEmpty("Códigos ativos", "Nenhum código ativo encontrado agora.", "🔑")}</div></section>`;
};
const portalMiniGamesSection = () => `<section class="portal-section portal-home-mini-games"><div class="portal-section-heading"><div><span class="portal-kicker">🎮 MINI JOGOS</span><p>Uma atividade rápida para a comunidade Game Gifts.</p></div><a href="${pathFor("play")}" data-route>Jogar →</a></div><div class="portal-feature-card"><span class="portal-feature-icon">🧠</span><div><strong>Quiz de Games</strong><p>10 perguntas, 4 alternativas e pontuação registrada apenas para jogadores reais.</p></div><a class="portal-primary-button" href="${pathFor("play")}" data-route>JOGAR QUIZ</a></div></section>`;
const portalToolsSection = () => `<section class="portal-section portal-home-tools"><div class="portal-section-heading"><div><span class="portal-kicker">🧰 FERRAMENTAS ÚTEIS</span><p>Acesse rapidamente os recursos que já funcionam no portal.</p></div></div><div class="portal-tool-grid"><a href="${pathFor("favorites")}" data-route><span>♥</span><strong>Favoritos</strong><small>Seus jogos e presentes salvos.</small></a><a href="${pathFor("news")}" data-route><span>🔔</span><strong>Meus Avisos</strong><small>Acompanhe novidades dos seus jogos.</small></a><a href="${pathFor("profile")}" data-route><span>◉</span><strong>Perfil do jogador</strong><small>Veja seus pontos e conquistas reais.</small></a></div></section>`;
const portalRankingSection = () => `<section class="portal-section portal-home-ranking"><div class="portal-section-heading"><div><span class="portal-kicker">🏆 RANKING DE JOGADORES</span><p>Somente pontuações registradas por contas reais.</p></div><a href="${pathFor("ranking")}" data-route>Ver ranking →</a></div><div class="portal-ranking-empty"><span>🏆</span><strong>O ranking aparece depois das primeiras partidas registradas.</strong><p>Nenhum nome ou pontuação é inventado.</p></div></section>`;
const portalQuickGrid = () => `<nav class="portal-quick-grid" aria-label="Atalhos"><a class="is-active" href="${pathFor("games")}" data-route><span>🎮</span><strong>Jogos</strong><small>Todos os jogos</small></a><a href="${pathFor("news")}?recent=1" data-route><span>🎁</span><strong>Presentes</strong><small>Links e códigos</small></a><a href="${pathFor("news")}" data-route><span>📣</span><strong>Novidades</strong><small>Eventos e atualizações</small></a><a href="${pathFor("play")}" data-route><span>🏆</span><strong>Minijogos</strong><small>Ganhe prêmios</small></a></nav>`;
const portalReferenceLatest = (games) => `<section class="ref-latest-section"><div class="ref-section-heading"><div><h2><span>⚡</span> Acabou de chegar</h2><p>Os jogos mais recentes encontrados nas fontes oficiais.</p></div><a href="${pathFor("games")}" data-route>Ver todos →</a></div><div class="ref-latest-grid">${games.slice(0, 4).map((game) => `<article class="ref-latest-card"><a href="${pathFor("games", game.slug)}" data-route>${gameArt(game, "ref-latest-art")}<strong>${esc(game.name)}</strong><span>${esc(game.reward_mode === "codes" ? "Códigos e itens" : "Presentes e recompensas")}</span></a><a class="ref-latest-action" href="${pathFor("games", game.slug)}" data-route>Ver presente <b>→</b></a></article>`).join("")}</div></section>`;
const homeReferenceIcon = (name) => {
  const paths = {
    profile: '<circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.5-3.1 2.6-4.8 6.5-4.8s6 1.7 6.5 4.8"/>',
    bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/>',
    game: '<path d="m7 8-2.2.5C2.6 9 1.5 11.1 2.1 13.3l1.2 4.3c.5 1.8 2.7 2.4 4 1l2.1-2.1h5.2l2.1 2.1c1.3 1.4 3.5.8 4-1l1.2-4.3c.6-2.2-.5-4.3-2.7-4.8L17 8H7Z"/><path d="M7 11v4M5 13h4M16 12h.01M19 15h.01"/>',
    gift: '<path d="M3 10h18v10H3zM2 7h20v3H2zM12 7v13M12 7H8.5A2.5 2.5 0 1 1 11 4.5V7ZM12 7h3.5A2.5 2.5 0 1 0 13 4.5V7Z"/>',
    news: '<path d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h5"/>',
    trophy: '<path d="M7 4h10v5a5 5 0 0 1-10 0V4ZM12 14v4M8 21h8M4 6H2v2a4 4 0 0 0 4 4M20 6h2v2a4 4 0 0 1-4 4"/>',
    home: '<path d="m3 10 9-7 9 7v10H3zM9 21v-6h6v6"/>',
    play: '<path d="m8 5 11 7-11 7V5Z"/>',
    heart: '<path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.5Z"/>',
    arrow: '<path d="M5 12h13M13 6l6 6-6 6"/>',
    code: '<path d="m8 4-4 8 4 8M16 4l4 8-4 8M14 3l-4 18"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || paths.gift}</svg>`;
};
const homeReferenceAction = (reward, game) => {
  const url = rewardOpenUrl(reward);
  const analytics = ` data-analytics-game-name="${esc(game?.name || "")}" data-analytics-gift-name="${esc(homeRewardType(reward))}" data-analytics-reward-id="${esc(reward.id)}"`;
  if (rewardIsCode(reward) && reward.reward_code) return `<button class="home-reference-card-action" type="button" data-copy-code="${esc(reward.reward_code)}"${analytics}>Ver presente <b>${homeReferenceIcon("arrow")}</b></button>`;
  return url ? `<a class="home-reference-card-action" href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-open-reward="${esc(reward.id)}"${analytics}>Ver presente <b>${homeReferenceIcon("arrow")}</b></a>` : "";
};
const homeReferenceRewardCard = (reward) => {
  const game = gameFor(reward.game_slug);
  if (!game || !rewardOpenUrl(reward)) return "";
  const amount = String(reward.reward_amount || reward.quantity || "").trim();
  const title = amount ? `${amount} ${homeRewardType(reward)}` : homeRewardType(reward);
  return `<article class="home-reference-reward-card"><div class="home-reference-reward-art">${rewardImageUrl(reward) ? `<img src="${esc(assetUrl(rewardImageUrl(reward)))}" alt="" loading="lazy" />` : gameArt(game, "home-reference-game-art")}<span class="home-reference-reward-game">${esc(game.name)}</span></div><div class="home-reference-reward-body"><strong>${esc(title)}</strong><span>${homeReferenceIcon("clock")} ${esc(homeTimeAgo(rewardFoundAt(reward)))}</span>${homeReferenceAction(reward, game)}</div></article>`;
};
const renderExactHome = () => {
  const games = publicGames();
  const recent = recentHomeRewards().slice(0, 8);
  const todayGames = games.map((game) => ({ game, rewards: publicTodayRewardsForGame(game).filter(isLinkActive) })).filter((item) => item.rewards.length).slice(0, 4);
  const sections = {
    home: "Início", gifts: "Presentes", games: "Jogos", play: "Jogar", favorites: "Favoritos",
  };
  return `<div class="home-reference-exact"><section class="home-reference-banner"><div class="home-reference-banner-copy"><span class="home-reference-eyebrow">GAME GIFTS</span><h1>PRESENTES<br><em>TODO DIA</em></h1><p>Links, códigos, eventos<br>e muito mais!</p><a class="home-reference-primary" href="${pathFor("news")}?recent=1" data-route>Explorar agora ${homeReferenceIcon("arrow")}</a></div><div class="home-reference-banner-art"><div class="home-reference-rays"></div><div class="home-reference-gift"><span>🎮</span></div><div class="home-reference-benefits"><b>✓ &nbsp; MAIS JOGOS</b><b>✓ &nbsp; MAIS PRÊMIOS</b><b>✓ &nbsp; SEMPRE ATUALIZADO</b><b>✓ &nbsp; 100% GRÁTIS</b></div><div class="home-reference-dots"><i class="is-active"></i><i></i><i></i></div></div></section><nav class="home-reference-shortcuts" aria-label="Atalhos"><a class="is-selected" href="${pathFor("games")}" data-route><span>${homeReferenceIcon("game")}</span><strong>Jogos</strong><small>Todos os jogos</small></a><a href="${pathFor("news")}?recent=1" data-route><span>${homeReferenceIcon("gift")}</span><strong>Presentes</strong><small>Links e códigos</small></a><a href="${pathFor("news")}" data-route><span>${homeReferenceIcon("news")}</span><strong>Novidades</strong><small>Eventos e atualizações</small></a><a href="${pathFor("play")}" data-route><span>${homeReferenceIcon("trophy")}</span><strong>Minijogos</strong><small>Ganhe prêmios</small></a></nav><section class="home-reference-section home-reference-arrivals"><header><div><h2><span>${homeReferenceIcon("arrow")}</span>Acabou de chegar <em>NOVO</em></h2><p>Os presentes mais recentes encontrados nas fontes oficiais.</p></div><a href="${pathFor("news")}?recent=1" data-route>Ver todos ${homeReferenceIcon("arrow")}</a></header><div class="home-reference-arrival-track">${recent.map(homeReferenceRewardCard).join("") || `<div class="home-reference-empty">Nenhum presente novo encontrado agora.</div>`}</div></section><section class="home-reference-section home-reference-today"><header><div><h2><span>${homeReferenceIcon("gift")}</span>Presentes de hoje</h2><p>Presentes encontrados na data atual, organizados por jogo.</p></div><a href="${pathFor("news")}?recent=1" data-route>Ver todos ${homeReferenceIcon("arrow")}</a></header><div class="home-reference-today-list">${todayGames.map(({ game, rewards }) => `<a href="${pathFor("games", game.slug)}" data-route><span class="home-reference-today-art">${gameArt(game, "home-reference-game-art")}</span><span><strong>${esc(game.name)}</strong><small>${rewards.length} ${rewards.length === 1 ? "presente hoje" : "presentes hoje"}</small></span>${homeReferenceIcon("chevron")}</a>`).join("") || `<div class="home-reference-empty">Nenhum presente encontrado hoje.</div>`}</div></section><section class="home-reference-section home-reference-all-games"><header><div><h2><span>★</span>Todos os jogos</h2><p>Explore todos os jogos com presentes, códigos e muito mais.</p></div><a href="${pathFor("games")}" data-route>Ver todos ${homeReferenceIcon("arrow")}</a></header><div class="home-reference-game-track">${games.slice(0, 8).map((game) => `<a href="${pathFor("games", game.slug)}" data-route>${gameArt(game, "home-reference-game-art")}<strong>${esc(game.name)}</strong></a>`).join("")}</div></section></div>`;
};
const homeLinkRewards = (game) => publicRewardsForGame(game).filter((reward) => !rewardIsCode(reward) && isLinkActive(reward));
const homeLinkGameCard = (game) => {
  const count = homeLinkRewards(game).length;
  return `<article class="home-link-game-card"><a href="${pathFor("games", game.slug)}" data-route data-analytics-game-name="${esc(game.name)}" data-analytics-game-slug="${esc(game.slug)}"><div class="home-link-game-art">${gameArt(game, "home-reference-game-art")}<span class="home-link-game-tag">🎁 Presentes por link</span></div><strong>${esc(game.name)}</strong><span class="home-link-game-count">${homeReferenceIcon("gift")} ${count} ${count === 1 ? "presente disponível" : "presentes disponíveis"}</span></a><a class="home-reference-card-action" href="${pathFor("games", game.slug)}" data-route>Ver presentes ${homeReferenceIcon("arrow")}</a></article>`;
};
const homeHeroGameCard = (game) => `<a class="home-hero-game-card" href="${pathFor("games", game.slug)}" data-route><div>${gameArt(game, "home-reference-game-art")}</div><strong>${esc(game.name)}</strong><span>🎁 Presentes por link</span></a>`;
const homeMiniGameCard = () => `<a class="home-mini-game-card" href="${pathFor("play")}" data-route><div class="home-mini-game-art">${homeReferenceIcon("trophy")}</div><strong>Quiz de Games</strong><small>Jogue e ganhe pontos</small><span>Jogar ${homeReferenceIcon("arrow")}</span></a>`;
const discoveryTodayRewards = () => publicTodayRewards().filter(isLinkActive);
const discoveryUnopenedRewards = () => {
  const saved = favorites();
  const favoriteGameIds = new Set((saved.games || []).map(Number));
  const favoriteRewardIds = new Set((saved.rewards || []).map(Number));
  const followedGames = new Set(noticePrefs().games.map(String));
  return publicRewards()
    .filter(isLinkActive)
    .filter((reward) => !rewardIsOpened(reward))
    .sort((a, b) => {
      const gameA = gameFor(a.game_slug) || {};
      const gameB = gameFor(b.game_slug) || {};
      const priorityA = (followedGames.has(String(gameA.slug)) ? 2 : 0) + (favoriteGameIds.has(Number(gameA.id)) ? 1 : 0) + (favoriteRewardIds.has(Number(a.id)) ? 1 : 0);
      const priorityB = (followedGames.has(String(gameB.slug)) ? 2 : 0) + (favoriteGameIds.has(Number(gameB.id)) ? 1 : 0) + (favoriteRewardIds.has(Number(b.id)) ? 1 : 0);
      return priorityB - priorityA || freshnessScore(b) - freshnessScore(a);
    });
};
const discoveryTrendingGames = () => {
  const configured = Array.isArray(state.data.popular)
    ? state.data.popular.map((entry) => gameFor(entry.slug || entry.game_slug)).filter((game) => game && isPublicVisibleGame(game))
    : [];
  if (configured.length) return { games: configured, reason: "Jogos destacados pelo catálogo público atual." };
  const latestByGame = new Map();
  publicGames().forEach((game) => {
    const latest = activeRewardsForGame(game).sort((a, b) => freshnessScore(b) - freshnessScore(a))[0];
    if (latest) latestByGame.set(game.slug, { game, latest });
  });
  return {
    games: [...latestByGame.values()].sort((a, b) => freshnessScore(b.latest) - freshnessScore(a.latest)).map((item) => item.game),
    reason: "Ordenado pela atividade mais recente registrada no catálogo.",
  };
};
const discoveryRewardCard = (reward, className = "") => {
  const game = gameFor(reward.game_slug) || gameFor(reward.game);
  if (!game) return "";
  const status = portalStatus(reward);
  const title = portalRewardTitle(reward);
  return `<article class="home-discovery-reward-card ${className}"><div class="home-discovery-reward-art">${rewardArt(reward, game)}</div><div class="home-discovery-reward-body"><span class="home-discovery-game">${esc(game.name)}</span><strong>${esc(title)}</strong><small class="home-discovery-status ${status.key}">${esc(status.label)}</small><a class="home-discovery-action" href="${pathFor("games", game.slug)}" data-route>Ver presente <b>→</b></a></div></article>`;
};
const renderHomeDiscovery = () => {
  const liveEvents = renderHomeEventsStrip();
  const today = discoveryTodayRewards();
  const openedToday = today.filter(rewardIsOpened).length;
  const unopened = discoveryUnopenedRewards();
  const trending = discoveryTrendingGames();
  const followedCount = noticePrefs().games.length;
  const todayProgress = today.length
    ? `<strong>${openedToday}/${today.length}</strong><span>presentes abertos hoje neste dispositivo</span>`
    : `<strong class="is-empty">Nenhum presente disponível hoje</strong><span>O catálogo ainda não tem um presente válido para esta data.</span>`;
  const unopenedContent = unopened.length
    ? unopened.map((reward) => discoveryRewardCard(reward)).join("")
    : `<div class="home-discovery-empty"><span>✓</span><strong>Você já abriu todos os presentes válidos encontrados.</strong><p>Quando um novo presente aparecer, ele ficará disponível aqui.</p></div>`;
  const trendingContent = trending.games.length
    ? trending.games.map((game) => `<a class="home-discovery-game-card" href="${pathFor("games", game.slug)}" data-route><span>${gameArt(game, "home-discovery-game-art")}</span><strong>${esc(game.name)}</strong><small>Ver presentes e novidades</small><b>→</b></a>`).join("")
    : `<div class="home-discovery-empty"><span>🔥</span><strong>Ainda não há dados suficientes para destacar jogos.</strong><p>Os destaques aparecerão quando houver atividade real no catálogo.</p></div>`;
  const shortcuts = [
    ["📖", "Guias", "guides", "Como aproveitar cada jogo"],
    ["📅", "Eventos", "events", "Atualizações publicadas"],
    ["🎟️", "Códigos", "codes", "Códigos reais do catálogo"],
    ["❓", "Como resgatar", "howTo", "Passo a passo sem promessa"],
    ["🔧", "Problemas comuns", "problems", "Ajuda para links e jogos"],
    ["🎮", "Jogos relacionados", "related", "Continue por outro jogo"],
  ];
  return liveEvents + `<section class="home-discovery-wrap" aria-label="Descoberta de presentes"><div class="home-discovery-heading"><div><span class="home-discovery-kicker">✦ CONTINUE DESCOBRINDO</span><h2>Caça aos brindes</h2><p>Encontre presentes reais em outros jogos acompanhados pelo Game Gifts.</p></div><a class="home-discovery-primary" href="${pathFor("games")}" data-route>Continuar explorando <b>→</b></a></div><div class="home-discovery-progress-grid"><article class="home-discovery-progress-card"><span>🎯</span><div><h3>Caça aos brindes</h3><p>${today.length ? `${openedToday} de ${today.length} presentes disponíveis hoje já abertos.` : "Nenhum presente válido disponível hoje."}</p></div><div class="home-discovery-meter" aria-label="${today.length ? `${openedToday} de ${today.length} presentes abertos` : "Nenhum presente disponível hoje"}"><i style="width:${today.length ? Math.min(100, (openedToday / today.length) * 100) : 0}%"></i></div></article><article class="home-discovery-progress-card home-discovery-today-progress"><span>📈</span><div><h3>Meu progresso de hoje</h3><p>${todayProgress}</p></div></article></div><section class="home-discovery-panel"><header><div><span class="home-discovery-kicker">🔥 EXPLORAÇÃO REAL</span><h2>O que está bombando</h2><p>${esc(trending.reason)}</p></div></header><div class="home-discovery-game-grid">${trendingContent}</div></section><section class="home-discovery-panel home-discovery-unopened"><header><div><span class="home-discovery-kicker">🎁 PERSONALIZADO</span><h2>Presentes que você ainda não abriu</h2><p>Prioridade para jogos acompanhados e favoritos; a lista usa somente presentes válidos.</p></div><span class="home-discovery-followed">${followedCount ? `${followedCount} jogo${followedCount === 1 ? "" : "s"} acompanhado${followedCount === 1 ? "" : "s"}` : "Sem jogos acompanhados"}</span></header><div class="home-discovery-reward-grid">${unopenedContent}</div></section><section class="home-discovery-panel home-discovery-links"><header><div><span class="home-discovery-kicker">✦ MAIS PARA EXPLORAR</span><h2>Continue explorando</h2><p>Guias e páginas úteis para voltar ao Game Gifts sempre que precisar.</p></div></header><nav class="home-discovery-shortcuts" aria-label="Páginas úteis">${shortcuts.map(([icon, label, page, description]) => `<a href="${pathFor(page)}" data-route><span>${icon}</span><strong>${label}</strong><small>${description}</small><b>→</b></a>`).join("")}</nav></section></section>`;
};
const renderHomeEventsStrip = () => {
  const active = publicEvents().filter((event) => eventStatusKey(event) === "active").slice(0, 4);
  return `<section class="home-events-strip" aria-label="Acontecendo nos jogos"><header><div><span class="home-discovery-kicker">🔥 ACONTECENDO NOS JOGOS</span><p>Eventos confirmados em fontes oficiais.</p></div><a href="${pathFor("events")}" data-route>Ver todos os eventos <b>→</b></a></header>${active.length ? `<div class="event-card-grid home-event-card-grid">${active.map((event) => eventCard(event, true)).join("")}</div>` : `<div class="home-events-empty"><span>🔥</span><strong>Nenhum evento ativo confirmado no momento.</strong><small>Quando uma fonte oficial confirmar um evento, ele aparecerá aqui.</small></div>`}</section>`;
};
const renderPrioritizedHome = () => {
  const games = publicGames();
  const linkGames = games.filter((game) => homeLinkRewards(game).length).sort((a, b) => homeLinkRewards(b).length - homeLinkRewards(a).length || a.name.localeCompare(b.name));
  const recent = recentHomeRewards().slice(0, 8);
  const todayGames = games.map((game) => ({ game, rewards: publicTodayRewardsForGame(game).filter(isLinkActive) })).filter((item) => item.rewards.length).slice(0, 6);
  return `<div class="home-reference-prioritized"><section class="home-dark-hero"><div class="home-dark-hero-copy"><span>GAME GIFTS</span><h1>PRESENTES<br><em>TODO DIA</em></h1><p>Links, códigos, eventos<br>e muito mais!</p><a href="${pathFor("news")}?recent=1" data-route>Explorar agora ${homeReferenceIcon("arrow")}</a><div class="home-dark-hero-proof"><b>✓ 100% Grátis</b><b>ϟ Sempre atualizado</b><b>♟ Para todos os jogos</b></div></div><div class="home-dark-hero-art"><div class="home-dark-hero-game-row">${linkGames.slice(0, 4).map(homeHeroGameCard).join("") || `<div class="home-reference-empty">Ainda não há presentes por link disponíveis.</div>`}</div><div class="home-dark-hero-badge">♛ &nbsp; JOGOS REAIS<br> &nbsp;&nbsp;&nbsp;&nbsp;PRESENTES REAIS</div><div class="home-reference-dots"><i class="is-active"></i><i></i><i></i><i></i></div></div></section><nav class="home-reference-shortcuts home-reference-shortcuts-five" aria-label="Atalhos"><a class="is-selected" href="${pathFor("games")}" data-route><span>${homeReferenceIcon("game")}</span><strong>Jogos</strong><small>Todos os jogos</small></a><a href="${pathFor("news")}?recent=1" data-route><span>${homeReferenceIcon("gift")}</span><strong>Presentes</strong><small>Links e códigos</small></a><a href="${pathFor("news")}" data-route><span>${homeReferenceIcon("news")}</span><strong>Novidades</strong><small>Eventos e atualizações</small></a><a href="${pathFor("codes")}" data-route><span>${homeReferenceIcon("code")}</span><strong>Códigos</strong><small>Inserir códigos</small></a><a href="${pathFor("play")}" data-route><span>${homeReferenceIcon("trophy")}</span><strong>Minijogos</strong><small>Jogue e ganhe</small></a><a href="${pathFor("favorites")}" data-route><span>${homeReferenceIcon("heart")}</span><strong>Favoritos</strong><small>Seus jogos</small></a></nav><section class="home-dark-section home-link-games-section"><header><div><h2><span>${homeReferenceIcon("gift")}</span>Jogos com presentes por link</h2><p>Veja todos os jogos que têm presentes disponíveis agora.</p></div><a href="${pathFor("games")}" data-route>Ver todos ${homeReferenceIcon("arrow")}</a></header><div class="home-link-games-track">${linkGames.map(homeLinkGameCard).join("") || `<div class="home-reference-empty">Nenhum jogo com presente por link disponível agora.</div>`}</div></section><section class="home-dark-section home-arrivals-dark"><header><div><h2><span>${homeReferenceIcon("arrow")}</span>Acabou de chegar <em>NOVO</em></h2><p>Os presentes mais recentes encontrados nas fontes oficiais.</p></div><a href="${pathFor("news")}?recent=1" data-route>Ver todos ${homeReferenceIcon("arrow")}</a></header><div class="home-reference-arrival-track">${recent.map(homeReferenceRewardCard).join("") || `<div class="home-reference-empty">Nenhum presente novo encontrado agora.</div>`}</div></section><section class="home-dark-section home-minigames-section"><header><div><h2><span>${homeReferenceIcon("game")}</span>Minijogos</h2><p>Jogue, complete desafios e ganhe recompensas!</p></div><a href="${pathFor("play")}" data-route>Ver todos ${homeReferenceIcon("arrow")}</a></header><div class="home-minigames-track">${homeMiniGameCard()}</div></section><section class="home-reference-section home-reference-today"><header><div><h2><span>${homeReferenceIcon("gift")}</span>Presentes de hoje</h2><p>Presentes encontrados na data atual, organizados por jogo.</p></div><a href="${pathFor("news")}?recent=1" data-route>Ver todos ${homeReferenceIcon("arrow")}</a></header><div class="home-reference-today-list">${todayGames.map(({ game, rewards }) => `<a href="${pathFor("games", game.slug)}" data-route><span class="home-reference-today-art">${gameArt(game, "home-reference-game-art")}</span><span><strong>${esc(game.name)}</strong><small>${rewards.length} ${rewards.length === 1 ? "presente hoje" : "presentes hoje"}</small></span>${homeReferenceIcon("chevron")}</a>`).join("") || `<div class="home-reference-empty">Nenhum presente encontrado hoje.</div>`}</div></section>${renderHomeDiscovery()}<section class="home-reference-section home-reference-all-games"><header><div><h2><span>★</span>Todos os jogos</h2><p>Explore todos os jogos com presentes, códigos e muito mais.</p></div><a href="${pathFor("games")}" data-route>Ver todos ${homeReferenceIcon("arrow")}</a></header><div class="home-reference-game-track">${games.slice(0, 10).map((game) => `<a href="${pathFor("games", game.slug)}" data-route>${gameArt(game, "home-reference-game-art")}<strong>${esc(game.name)}</strong></a>`).join("")}</div></section></div>`;
};
const settingsPermissionLabel = () => {
  if (state.settingsPermission === "granted") return { className: "is-on", icon: "🟢", text: "Ativadas" };
  if (state.settingsPermission === "denied") return { className: "is-off", icon: "🔴", text: "Desativadas/Bloqueadas" };
  if (state.settingsPermission === "pending") return { className: "is-pending", icon: "⏳", text: "Verificando…" };
  if (state.settingsPermission === "unavailable") return { className: "is-off", icon: "🔴", text: "Indisponíveis nesta plataforma" };
  return { className: "is-off", icon: "🔴", text: "Desativadas/Bloqueadas ou não autorizadas" };
};
const settingsChannelRow = (key, icon, label, copy) => {
  const prefs = noticePrefs();
  const enabled = prefs.channels[key] !== false;
  return `<button type="button" class="settings-toggle-row" data-settings-channel="${key}" role="switch" aria-checked="${enabled}"><span class="settings-row-icon">${icon}</span><span><strong>${label}</strong><small>${copy}</small></span><i class="settings-switch ${enabled ? "is-on" : ""}" aria-hidden="true"><b></b></i></button>`;
};
const settingsGameRow = (game, followed) => `<button type="button" class="settings-game-row ${followed ? "is-followed" : ""}" data-notice-toggle="${esc(game.slug)}" role="switch" aria-checked="${followed}"><span class="settings-game-art">${gameArt(game, "settings-game-image")}</span><span><strong>${esc(game.name)}</strong><small>${followed ? "Avisos ativados" : "Avisos desativados"}</small></span><i class="settings-switch ${followed ? "is-on" : ""}" aria-hidden="true"><b></b></i></button>`;
const renderSettings = () => {
  const prefs = noticePrefs();
  const games = publicGames();
  const followedGames = games.filter((game) => prefs.games.includes(String(game.slug)));
  const permission = settingsPermissionLabel();
  const message = state.settingsMessage ? `<p class="settings-feedback" role="status">${esc(state.settingsMessage)}</p>` : "";
  return `<div class="settings-page"><div class="settings-page-top"><button type="button" class="settings-back" data-go-back="${pathFor("home")}">← Voltar</button><span>GAME GIFTS</span></div><header class="settings-heading"><div class="settings-heading-icon">⚙</div><div><p>Preferências do Game Gifts</p><h1>Configurações</h1><span>Controle seus avisos, jogos seguidos e preferências neste dispositivo.</span></div></header><section class="settings-card settings-notifications-card"><div class="settings-card-heading"><div><span class="settings-eyebrow">🔔 NOTIFICAÇÕES PUSH</span><h2>Receba avisos por push</h2><p>Ative a permissão para receber avisos reais do Game Gifts, mesmo quando você estiver fora do site.</p></div><span class="settings-permission ${permission.className}">${permission.icon} ${permission.text}</span></div><div class="settings-permission-actions"><button type="button" class="settings-primary-button" data-settings-permission>${state.settingsPermission === "granted" ? "NOTIFICAÇÕES ATIVADAS" : "ATIVAR NOTIFICAÇÕES"}</button><button type="button" class="settings-secondary-button" data-settings-check>VERIFICAR PERMISSÃO</button></div>${message}<div class="settings-divider"></div><div class="settings-channel-list">${settingsChannelRow("gifts", "🎁", "Novos presentes", "Avise quando um presente novo for encontrado.")}${settingsChannelRow("links", "🔗", "Novos links", "Receba um aviso por push quando um link público novo for publicado.")}${settingsChannelRow("codes", "🔑", "Novos códigos", "Receba avisos sobre códigos reais do catálogo.")}${settingsChannelRow("news", "📰", "Novidades dos jogos", "Veja atualizações e notícias dos jogos seguidos.")}</div><div class="settings-divider"></div><div class="settings-subheading"><span>🎮</span><div><h3>Selecionar jogos para receber avisos</h3><p>A lista abaixo vem dos jogos reais cadastrados no sistema.</p></div></div><div class="settings-game-list">${games.map((game) => settingsGameRow(game, prefs.games.includes(String(game.slug)))).join("") || `<div class="settings-empty">Os jogos serão carregados pelo catálogo existente.</div>`}</div></section><section class="settings-card settings-followed-card"><div class="settings-card-heading"><div><span class="settings-eyebrow">⭐ JOGOS SEGUIDOS</span><h2>⭐ Jogos que você segue</h2><p>Esta lista usa a mesma preferência “Seguir jogo” das páginas de jogos.</p></div><strong class="settings-followed-count">${followedGames.length}</strong></div><div class="settings-followed-list">${followedGames.map((game) => settingsGameRow(game, true)).join("") || `<div class="settings-empty">Você ainda não segue nenhum jogo. Ative um aviso acima para começar.</div>`}</div></section><section class="settings-card settings-preferences-card"><div class="settings-card-heading"><div><span class="settings-eyebrow">⚙ PREFERÊNCIAS</span><h2>Preferências do dispositivo</h2><p>Salvas neste dispositivo e mantidas ao atualizar a página.</p></div></div><div class="settings-preference-list"><button type="button" class="settings-toggle-row" data-settings-preference="sound" role="switch" aria-checked="${prefs.sound}"><span class="settings-row-icon">🔊</span><span><strong>Som das notificações</strong><small>Usar som quando o sistema permitir.</small></span><i class="settings-switch ${prefs.sound ? "is-on" : ""}" aria-hidden="true"><b></b></i></button><button type="button" class="settings-toggle-row" data-settings-preference="vibration" role="switch" aria-checked="${prefs.vibration}"><span class="settings-row-icon">📳</span><span><strong>Vibração</strong><small>Usar vibração quando o dispositivo permitir.</small></span><i class="settings-switch ${prefs.vibration ? "is-on" : ""}" aria-hidden="true"><b></b></i></button></div></section><section class="settings-card settings-test-card"><div><span class="settings-eyebrow">🧪 TESTE</span><h2>Confira se os avisos estão funcionando</h2><p>O envio só será confirmado se a plataforma entregar uma notificação real.</p></div><button type="button" class="settings-secondary-button settings-test-button" data-settings-test ${state.settingsTestLoading ? "disabled" : ""}>${state.settingsTestLoading ? "ENVIANDO…" : "ENVIAR NOTIFICAÇÃO DE TESTE"}</button></section></div>`;
};
const refreshSettingsPermission = async (rerender = true) => {
  if (!window.websim?.notifications?.getPermission) {
    state.settingsPermission = "unavailable";
    state.settingsMessage = "A plataforma atual não disponibilizou o serviço de notificações.";
    if (rerender && route().page === "settings") renderPage();
    return state.settingsPermission;
  }
  try {
    const result = await window.websim.notifications.getPermission();
    state.settingsPermission = result?.state === "granted" ? "granted" : "default";
    if (rerender && route().page === "settings") renderPage();
  } catch (error) {
    state.settingsPermission = "unavailable";
    state.settingsMessage = `Não foi possível verificar a permissão: ${error?.message || "serviço indisponível"}.`;
    if (rerender && route().page === "settings") renderPage();
  }
  return state.settingsPermission;
};
const askSettingsPermission = async () => {
  if (!window.websim?.notifications?.requestPermission) {
    state.settingsPermission = "unavailable";
    state.settingsMessage = "A plataforma atual não permite solicitar notificações.";
    renderPage();
    return;
  }
  state.settingsPermission = "pending";
  state.settingsMessage = "Aguardando a confirmação da plataforma…";
  renderPage();
  try {
    const result = await window.websim.notifications.requestPermission();
    state.settingsPermission = result?.state === "granted" ? "granted" : result?.state === "denied" ? "denied" : "default";
    state.settingsMessage = state.settingsPermission === "granted" ? "Notificações ativadas pela plataforma." : "A permissão não foi concedida. Verifique as configurações do navegador ou da plataforma.";
  } catch (error) {
    state.settingsPermission = "unavailable";
    state.settingsMessage = `A plataforma não permitiu ativar notificações: ${error?.message || "motivo não informado"}.`;
  }
  renderPage();
};
const sendSettingsTestNotification = async () => {
  state.settingsTestLoading = true;
  state.settingsMessage = "";
  renderPage();
  try {
    const permission = await refreshSettingsPermission(false);
    if (permission !== "granted") {
      state.settingsMessage = "O teste não foi enviado: ative as notificações e conceda a permissão primeiro.";
      return;
    }
    const result = await api("/api/notices/test", { method: "POST" });
    if (Number(result?.delivered || 0) > 0) state.settingsMessage = "Notificação de teste enviada pela plataforma.";
    else state.settingsMessage = "O teste não foi enviado: a plataforma não confirmou nenhuma entrega.";
  } catch (error) {
    state.settingsMessage = `O teste não foi enviado: ${error?.message || "serviço indisponível"}.`;
  } finally {
    state.settingsTestLoading = false;
    renderPage();
  }
};
const renderPortalHome = () => {
  const ui = portalCopy();
  const query = state.search.trim().toLocaleLowerCase();
  const games = sortHomeGames(publicGames().filter((game) => !query || `${game.name || ""} ${game.slug || ""} ${publicRewardsForGame(game).map((reward) => `${reward.reward_type || ""} ${reward.reward_code || ""} ${reward.name || ""}`).join(" ")}`.toLocaleLowerCase().includes(query)));
  const heroGame = games.find((game) => publicTodayRewardsForGame(game).length) || games[0];
  const recent = recentHomeRewards().filter((reward) => !query || `${reward.game_name || ""} ${reward.reward_type || ""} ${reward.name || ""} ${reward.reward_code || ""}`.toLocaleLowerCase().includes(query)).slice(0, 8);
  const featuredGames = games.filter((game) => publicRewardsForGame(game).length).slice(0, 6);
  const guides = Object.keys(GAME_INFO_CONTENT).map((slug) => gameFor(slug)).filter(Boolean).slice(0, 4);
  const news = publicNews().slice(0, 3);
  const heroArt = heroGame ? gameArt(heroGame, "portal-hero-art") : `<div class="portal-hero-art portal-hero-placeholder">✦</div>`;
  return `<div class="portal-home"><section class="portal-hero"><div class="portal-hero-copy"><span class="portal-kicker">✦ ${esc(ui.heroKicker)}</span><h1>${esc(ui.heroTitle)}</h1><p>${esc(ui.heroCopy)}</p><div class="portal-hero-actions"><a class="portal-primary-button" href="${pathFor("news")}?recent=1" data-route>${esc(ui.viewGifts)}</a><a class="portal-secondary-button" href="${pathFor("games")}" data-route>${esc(ui.explore)}</a></div></div><div class="portal-hero-visual">${heroArt}${heroGame ? `<span class="portal-hero-game">${esc(heroGame.name)}</span>` : ""}</div><aside class="portal-popular"><span class="portal-kicker">${esc(ui.popular)}</span>${Array.isArray(state.data.popular) && state.data.popular.length ? state.data.popular.slice(0, 5).map((entry, index) => { const game = gameFor(entry.slug || entry.game_slug); return game ? `<a href="${pathFor("games", game.slug)}" data-route><b>${index + 1}</b>${gameArt(game, "portal-popular-art")}<span>${esc(game.name)}</span></a>` : ""; }).join("") : `<div class="portal-popular-empty">${esc(ui.popularEmpty)}<small>${esc(ui.noPopularity)}</small></div>`}</aside></section><section class="portal-section portal-arrivals"><div class="portal-section-heading"><div><span class="portal-kicker">⚡ ${esc(ui.justIn)}</span><p>${esc(ui.justInCopy)}</p></div><a href="${pathFor("news")}?recent=1" data-route>Ver todos →</a></div><div class="portal-reward-grid">${recent.map(portalRewardCard).join("") || portalEmpty(ui.justIn, ui.noData, "⚡")}</div></section><div class="portal-ad-slot" data-ad-slot="home-between-arrivals" aria-hidden="true"></div>${portalTodaySection()}<section class="portal-section portal-home-featured"><div class="portal-section-heading"><div><span class="portal-kicker">⭐ JOGOS EM DESTAQUE</span><p>Jogos com dados públicos disponíveis agora.</p></div><a href="${pathFor("games")}" data-route>Ver todos →</a></div><div class="portal-game-carousel">${featuredGames.map(portalGameTile).join("") || portalEmpty(copy().noGames, copy().noGamesCopy, "🎮")}</div></section><section class="portal-section"><div class="portal-section-heading"><div><span class="portal-kicker">🎮 ${esc(ui.allGames)}</span><p>${esc(ui.allGamesCopy)}</p></div><a href="${pathFor("games")}" data-route>Ver todos →</a></div><div class="portal-game-carousel">${games.map(portalGameTile).join("") || portalEmpty(copy().noGames, copy().noGamesCopy, "🎮")}</div></section>${portalCodesSection()}<section class="portal-section"><div class="portal-section-heading"><div><span class="portal-kicker">📖 ${esc(ui.guides)}</span><p>${esc(ui.guidesCopy)}</p></div><a href="${pathFor("guides")}" data-route>Ver guias →</a></div><div class="portal-guide-grid">${guides.map((game) => `<a href="${pathFor("guides", game.slug)}" data-route><div>${gameArt(game, "portal-guide-art")}</div><strong>${esc(game.name)}</strong><span>${esc(GAME_INFO_CONTENT[game.slug]?.[state.lang]?.description || GAME_INFO_CONTENT[game.slug]?.en?.description || "")}</span></a>`).join("")}</div></section>${portalMiniGamesSection()}${portalToolsSection()}<section class="portal-section"><div class="portal-section-heading"><div><span class="portal-kicker">📰 ${esc(ui.news)}</span><p>${esc(ui.newsCopy)}</p></div><a href="${pathFor("news")}" data-route>Ver todas →</a></div><div class="portal-news-grid">${news.map((item) => editorialNewsCard(item)).join("") || portalEmpty(ui.news, ui.emptyNews, "📰")}</div></section>${portalRankingSection()}${portalTrending()}<div class="portal-ad-slot" data-ad-slot="home-bottom" aria-hidden="true"></div></div>`;
};
const renderPortalNews = (slug = "") => {
  const ui = portalCopy();
  if (new URLSearchParams(location.search).get("recent") === "1") return renderRecentGifts();
  if (slug) {
    const item = publicNews().find((entry) => newsItemSlug(entry) === slug || String(entry.id || "") === slug);
    if (!item) return `<div class="portal-page">${portalBack()}${portalEmpty(ui.news, ui.emptyNews, "📰")}</div>`;
    const game = gameFor(item.game_slug);
    return `<article class="portal-news-detail portal-page"><a class="portal-back" href="${pathFor("news")}" data-route>← ${esc(ui.news)}</a>${editorialNewsCard(item)}<div class="portal-info-grid"><section><h2>${esc(state.lang === "pt" ? "Fonte da atualização" : "Update source")}</h2><p>${esc(item.source_name || ui.source)}</p>${item.source_url ? `<a class="portal-primary-button" href="${esc(item.source_url)}" target="_blank" rel="noopener noreferrer">${esc(ui.source)} ↗</a>` : ""}</section>${game ? `<section><h2>${esc(game.name)}</h2><p>${esc(game.description || "")}</p><a class="portal-secondary-button" href="${pathFor("games", game.slug)}" data-route>Ver jogo →</a></section>` : ""}</div></article>`;
  }
  const query = state.search.trim().toLocaleLowerCase();
  const list = publicNews().filter((item) => !query || `${item.title || ""} ${item.summary || ""} ${item.source_name || ""}`.toLocaleLowerCase().includes(query));
  return `<div class="portal-page">${portalBack()}<div class="portal-page-heading"><span class="portal-kicker">📰 ${esc(ui.news)}</span><h1>${esc(ui.news)}</h1><p>${esc(ui.newsCopy)}</p></div><div class="portal-news-list">${list.map(editorialNewsCard).join("") || portalEmpty(ui.news, ui.emptyNews, "📰")}</div><div class="portal-ad-slot" data-ad-slot="news-bottom" aria-hidden="true"></div></div>`;
};
const renderPortalCodes = () => {
  const ui = portalCopy();
  const query = state.search.trim().toLocaleLowerCase();
  const list = sortCodes(publicRewards().filter((reward) => rewardIsCode(reward) && (isLinkActive(reward) || (isMatchMastersReward(reward) && isExpired(reward))) && (!query || `${reward.game_name || ""} ${reward.reward_code || ""}`.toLocaleLowerCase().includes(query))));
  return `<div class="portal-page">${portalBack()}<div class="portal-page-heading"><span class="portal-kicker">🎟️ ${esc(ui.codes)}</span><h1>${esc(ui.codes)}</h1><p>${esc(ui.codesCopy)}</p></div><div class="portal-reward-grid">${list.map(portalRewardCard).join("") || portalEmpty(ui.codes, ui.emptyCodes, "🎟️")}</div></div>`;
};
const renderPortalGuides = (slug = "") => {
  const ui = portalCopy();
  if (slug) {
    const game = gameFor(slug);
    const info = GAME_INFO_CONTENT[slug]?.[state.lang] || GAME_INFO_CONTENT[slug]?.en;
    const guide = GAME_CENTER_CONTENT[slug]?.[state.lang] || GAME_CENTER_CONTENT[slug]?.en;
    if (!game || !info || !guide) return `<div class="portal-page">${portalBack()}${portalEmpty(ui.guides, ui.emptyGuides, "📖")}</div>`;
    return `<article class="portal-guide-detail portal-page"><a class="portal-back" href="${pathFor("guides")}" data-route>← ${esc(ui.guides)}</a><div class="portal-guide-hero">${gameArt(game, "portal-guide-cover")}<div><span class="portal-kicker">📖 ${esc(game.name)}</span><h1>${esc(info.officialName)}</h1><p>${esc(guide.guide)}</p></div></div><div class="portal-guide-content"><section><h2>${esc(centralCopy().howTitle)}</h2><ol>${guide.steps.map((item) => `<li>${esc(item)}</li>`).join("")}</ol></section><section><h2>${esc(centralCopy().tipsTitle)}</h2><ul>${guide.tips.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section><section><h2>${esc(centralCopy().faqTitle)}</h2><ul>${guide.faq.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section><section><h2>${esc(game.name)}</h2><p>${esc(info.giftLinks)}</p><a class="portal-primary-button" href="${pathFor("games", game.slug)}" data-route>${esc(centralCopy().viewRewards)}</a></section></div><p class="portal-updated-note">${esc(state.lang === "pt" ? "Atualizado com o conteúdo editorial disponível no portal." : "Updated from the editorial content available in the portal.")}</p></article>`;
  }
  const query = state.search.trim().toLocaleLowerCase();
  const games = Object.keys(GAME_INFO_CONTENT).map((item) => gameFor(item)).filter((game) => game && (!query || `${game.name} ${game.slug}`.toLocaleLowerCase().includes(query)));
  return `<div class="portal-page">${portalBack()}<div class="portal-page-heading"><span class="portal-kicker">📖 ${esc(ui.guides)}</span><h1>${esc(ui.guides)}</h1><p>${esc(ui.guidesCopy)}</p></div><div class="portal-guide-grid portal-guide-list">${games.map((game) => `<a href="${pathFor("guides", game.slug)}" data-route><div>${gameArt(game, "portal-guide-art")}</div><strong>${esc(game.name)}</strong><span>${esc(GAME_INFO_CONTENT[game.slug]?.[state.lang]?.description || GAME_INFO_CONTENT[game.slug]?.en?.description || "")}</span></a>`).join("") || portalEmpty(ui.guides, ui.emptyGuides, "📖")}</div></div>`;
};
const renderPortalEvents = (slug = "") => {
  const ui = portalCopy();
  const query = state.search.trim().toLocaleLowerCase();
  const selectedGame = slug ? gameFor(slug) : null;
  const filtered = publicEvents().filter((event) => !selectedGame || String(event.game_slug || event.game_id) === String(selectedGame.slug || selectedGame.id)).filter((event) => !query || `${event.title || ""} ${event.game_name || ""} ${event.description || ""}`.toLocaleLowerCase().includes(query));
  const active = filtered.filter((event) => eventStatusKey(event) === "active");
  const upcoming = filtered.filter((event) => eventStatusKey(event) === "upcoming");
  const ended = filtered.filter((event) => eventStatusKey(event) === "ended");
  const gameGroups = [...new Map(filtered.map((event) => [event.game_slug, { game: gameFor(event.game_slug), events: filtered.filter((item) => item.game_slug === event.game_slug) }])).values()].filter((group) => group.game);
  const title = selectedGame ? `Eventos de ${selectedGame.name}` : ui.events;
  const intro = selectedGame ? `Eventos confirmados de ${selectedGame.name}, separados de presentes e novidades.` : "Eventos reais confirmados em fontes oficiais, separados por situação e jogo.";
  const section = (id, icon, heading, copyText, items, compact = false) => `<section class="events-page-section" id="${id}"><header class="portal-section-heading"><div><span class="portal-kicker">${icon} ${esc(heading)}</span><p>${esc(copyText)}</p></div></header>${items.length ? `<div class="event-card-grid">${items.map((event) => eventCard(event, compact)).join("")}</div>` : portalEmpty(heading, selectedGame ? "Nenhum evento real publicado para este jogo." : "Nenhum evento confirmado nesta categoria.", icon)}</section>`;
  const byGame = gameGroups.length ? `<section class="events-page-section"><header class="portal-section-heading"><div><span class="portal-kicker">🎮 EVENTOS POR JOGO</span><p>Somente jogos com eventos publicados aparecem nesta lista.</p></div></header><div class="event-game-groups">${gameGroups.map(({ game, events }) => `<a class="event-game-group" href="${pathFor("events", game.slug)}" data-route>${gameArt(game, "event-game-art")}<span><strong>${esc(game.name)}</strong><small>${events.length} ${events.length === 1 ? "evento publicado" : "eventos publicados"}</small></span><b>→</b></a>`).join("")}</div></section>` : "";
  return `<div class="portal-page events-page">${portalBack()}<div class="portal-page-heading"><span class="portal-kicker">🔥 ${esc(ui.events)}</span><h1>${esc(title)}</h1><p>${esc(intro)}</p></div>${section("events-active", "🔴", "ACONTECENDO AGORA", "Eventos ativos com data de início confirmada e sem encerramento conhecido ou ainda vigente.", active)}${section("events-upcoming", "🟡", "COMEÇA EM BREVE", "Eventos futuros confirmados por uma fonte oficial.", upcoming)}${byGame}${section("events-ended", "⚪", "EVENTOS ENCERRADOS", "Histórico de eventos; não aparece como disponível na área principal.", ended, true)}</div>`;
};
const renderPortalEventDetail = (gameSlug, eventSlug) => {
  const game = gameFor(gameSlug);
  const event = publicEvents().find((item) => item.game_slug === gameSlug && (item.slug === eventSlug || item.event_id === eventSlug));
  if (!game || !event) return `<div class="portal-page">${portalBack()}${portalEmpty("Evento não encontrado", "Este evento não está publicado ou não existe mais.", "🔥")}</div>`;
  const status = eventStatusKey(event);
  const related = eventsForGame(game).filter((item) => item.event_id !== event.event_id && eventStatusKey(item) !== "ended").slice(0, 4);
  const gifts = publicRewardsForGame(game).filter(isLinkActive).slice(0, 4);
  return `<article class="portal-page event-detail-page">${portalBack()}<a class="portal-back" href="${pathFor("events", game.slug)}" data-route>← Eventos de ${esc(game.name)}</a><header class="event-detail-hero">${event.image ? `<img src="${esc(assetUrl(event.image))}" alt="" />` : gameArt(game, "event-detail-art")}<div><span class="portal-kicker">${status === "active" ? "🔴" : status === "upcoming" ? "🟡" : "⚪"} ${esc(eventStatusText(status))}</span><span class="event-card-game">${esc(game.name)}</span><h1>${esc(event.title || event.name || "Evento")}</h1>${event.description ? `<p>${esc(event.description)}</p>` : ""}</div></header><div class="event-detail-grid"><section><h2>Situação</h2><strong class="event-detail-status event-status-${status}">${esc(eventStatusText(status))}</strong><p><b>Período:</b> ${esc(eventPeriodText(event))}</p>${event.how_to_participate ? `<h2>Como participar</h2><p>${esc(event.how_to_participate)}</p>` : ""}${event.rewards_text ? `<h2>Recompensas confirmadas</h2><p>${esc(event.rewards_text)}</p>` : ""}<p class="event-updated">Atualização mais recente: ${esc(eventDateText(event.updated_at, "não informada"))}</p>${event.source_url ? `<a class="portal-secondary-button" href="${esc(event.source_url)}" target="_blank" rel="noopener noreferrer">Fonte oficial ↗</a>` : ""}</section><aside><h2>Sobre esta página</h2><p>Este evento foi publicado somente após validação em uma fonte oficial. Datas e recompensas não informadas pela fonte permanecem sem preenchimento.</p><a class="portal-primary-button" href="${pathFor("games", game.slug)}" data-route>Ver página de ${esc(game.name)}</a></aside></div>${gifts.length ? `<section class="event-detail-related"><header><h2>Presentes disponíveis para ${esc(game.name)}</h2><a href="${pathFor("games", game.slug)}" data-route>Ver todos →</a></header><div class="portal-reward-grid">${gifts.map(portalRewardCard).join("")}</div></section>` : ""}${related.length ? `<section class="event-detail-related"><header><h2>Outros eventos de ${esc(game.name)}</h2><a href="${pathFor("events", game.slug)}" data-route>Ver todos →</a></header><div class="event-card-grid">${related.map((item) => eventCard(item, true)).join("")}</div></section>` : ""}<section class="event-detail-related"><header><h2>Jogos relacionados</h2><a href="${pathFor("related")}" data-route>Explorar jogos →</a></header><div class="event-related-games">${publicGames().filter((item) => item.slug !== game.slug).slice(0, 4).map((item) => `<a href="${pathFor("games", item.slug)}" data-route>${gameArt(item, "event-related-game-art")}<strong>${esc(item.name)}</strong></a>`).join("")}</div></section></article>`;
};
const renderHelpPage = (page, slug = "") => {
  const game = slug ? gameFor(slug) : null;
  const gameGuide = game ? (GAME_CENTER_CONTENT[game.slug]?.[state.lang] || GAME_CENTER_CONTENT[game.slug]?.en) : null;
  const commonLinks = `<nav class="help-page-links" aria-label="Continue no Game Gifts"><a href="${pathFor("news")}?recent=1" data-route>🎁 Ver presentes</a><a href="${pathFor("games")}" data-route>🎮 Todos os jogos</a><a href="${pathFor("guides")}" data-route>📖 Guias</a><a href="${pathFor("problems")}" data-route>🔧 Problemas comuns</a></nav>`;
  if (page === "howTo") {
    const title = game ? `Como resgatar presentes de ${game.name}` : "Como resgatar um presente";
    return `<article class="portal-page help-page">${portalBack()}<span class="portal-kicker">❓ GAME GIFTS</span><h1>${esc(title)}</h1><p class="help-page-lead">O Game Gifts organiza links públicos. A entrega acontece no jogo e depende da validade do link e da conta usada.</p><div class="help-step-grid"><section><b>01</b><h2>Escolha o jogo</h2><p>Abra a lista de <a href="${pathFor("games")}" data-route>jogos públicos</a> e entre na página do jogo que você usa.</p></section><section><b>02</b><h2>Confira o status</h2><p>Leia a indicação de confirmado, em verificação ou expirado antes de abrir o link.</p></section><section><b>03</b><h2>Abra no dispositivo do jogo</h2><p>Toque no link oficial e aguarde o jogo ou a página de resgate terminar de carregar.</p></section><section><b>04</b><h2>Confirme dentro do jogo</h2><p>Procure a caixa de presentes ou a área indicada pelo próprio jogo. Abrir um link não é prova de entrega.</p></section></div><section class="help-page-note"><h2>O que significa “JÁ ABERTO”?</h2><p>Esse estado é salvo no dispositivo do visitante quando ele abre um presente. Ele ajuda a encontrar o que ainda não foi visto e não confirma que a recompensa foi recebida.</p></section>${commonLinks}</article>`;
  }
  if (page === "problems") {
    const title = game ? `Problemas com presentes de ${game.name}` : "Problemas comuns ao abrir presentes";
    const gameLink = game ? `<a class="portal-primary-button" href="${pathFor("games", game.slug)}" data-route>Voltar para ${esc(game.name)}</a>` : `<a class="portal-primary-button" href="${pathFor("news")}?recent=1" data-route>Ver presentes recentes</a>`;
    return `<article class="portal-page help-page">${portalBack()}<span class="portal-kicker">🔧 AJUDA REAL</span><h1>${esc(title)}</h1><p class="help-page-lead">Use este diagnóstico para separar um problema no link, no jogo ou na própria conta. O Game Gifts não consegue alterar a conta do jogador.</p><div class="help-problem-list"><section><h2>O link abriu, mas nada apareceu</h2><p>Reabra o jogo, confira a caixa de presentes e veja se o link já foi usado ou está limitado à conta. Se o status estiver em verificação, ele ainda não é uma garantia.</p></section><section><h2>O link não abre</h2><p>Confira se o jogo está instalado no mesmo dispositivo, tente um link válido mais recente e evite continuar usando um link marcado como expirado ou com problema.</p></section><section><h2>O código foi recusado</h2><p>Use somente o destino oficial indicado na página do código. Códigos podem ter limite de uso, validade ou regras definidas pelo desenvolvedor.</p></section><section><h2>A página parece vazia</h2><p>Quando não há dados públicos suficientes, o Game Gifts deixa a área vazia. Volte aos <a href="${pathFor("events")}" data-route>eventos</a>, <a href="${pathFor("guides")}" data-route>guias</a> ou à lista de <a href="${pathFor("games")}" data-route>jogos</a> para continuar.</p></section></div>${gameGuide ? `<section class="help-page-note"><h2>Dica publicada para ${esc(game.name)}</h2><p>${esc(gameGuide.didntDropCopy || gameGuide.guide || "Confira o guia do jogo e o status de cada presente.")}</p><a class="portal-secondary-button" href="${pathFor("guides", game.slug)}" data-route>Ver guia de ${esc(game.name)} →</a></section>` : ""}<div class="help-page-actions">${gameLink}<a class="portal-secondary-button" href="${pathFor("howTo")}" data-route>Como resgatar →</a></div>${commonLinks}</article>`;
  }
  const games = publicGames().sort((a, b) => {
    const followed = noticePrefs().games;
    const aPriority = followed.includes(String(a.slug)) || isFavorite("game", a.id) ? 0 : 1;
    const bPriority = followed.includes(String(b.slug)) || isFavorite("game", b.id) ? 0 : 1;
    return aPriority - bPriority || a.name.localeCompare(b.name);
  });
  const relatedContent = games.length ? games.map((item) => `<article class="help-related-card"><a href="${pathFor("games", item.slug)}" data-route>${gameArt(item, "help-related-art")}<div><h2>${esc(item.name)}</h2><p>${esc(item.description || "Página pública do jogo no Game Gifts.")}</p><span>${activeRewardsForGame(item).length ? "Há presentes públicos ativos" : "Ver dados públicos do jogo"} →</span></div></a></article>`).join("") : `<div class="home-discovery-empty"><span>🎮</span><strong>Nenhum jogo público disponível.</strong><p>O catálogo será exibido quando houver jogos ativos.</p></div>`;
  return `<div class="portal-page help-page">${portalBack()}<span class="portal-kicker">🎮 CONTINUE JOGANDO</span><h1>Jogos relacionados</h1><p class="help-page-lead">Explore outros jogos que fazem parte do catálogo público do Game Gifts. A lista usa jogos ativos do sistema e prioriza os que você acompanha ou favoritou neste dispositivo.</p><div class="help-related-grid">${relatedContent}</div>${commonLinks}</div>`;
};
const renderPortalMore = () => `<div class="portal-page">${portalBack()}<div class="portal-page-heading"><span class="portal-kicker">💡 GAME GIFTS</span><h1>${esc(copy().about)}</h1><p>${esc(copy().aboutCopy)}</p></div>${portalNoticePanel()}<div class="portal-info-grid"><section><h2>${esc(copy().how)}</h2><ul>${copy().howItems.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section><section><h2>${esc(copy().admin)}</h2><p>${esc(copy().adminCopy)}</p><a class="portal-primary-button" href="${pathFor("admin")}" data-route>${esc(copy().admin)} →</a></section></div></div>`;

const adminGameForm = () => { const game = state.admin?.games.find((item) => Number(item.id) === Number(state.editGameId)); return `<form id="game-form" class="admin-card" data-edit-game-id="${game?.id || ""}"><h2>${game ? "Editar jogo" : "+ Adicionar jogo"}</h2><div class="field-grid"><div class="field"><label>Nome do jogo *</label><input name="name" required value="${esc(game?.name)}" placeholder="Match Masters" /></div><div class="field"><label>Slug *</label><input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value="${esc(game?.slug)}" placeholder="match-masters" /></div><div class="field"><label>Modo de recompensa</label><select name="reward_mode"><option value="links" ${game?.reward_mode === "links" ? "selected" : ""}>LINKS</option><option value="codes" ${game?.reward_mode === "codes" ? "selected" : ""}>CÓDIGOS</option><option value="none" ${game?.reward_mode === "none" ? "selected" : ""}>SEM RECOMPENSA</option></select></div><div class="field"><label>Imagem / capa (URL)</label><input name="image" type="url" value="${esc(game?.image)}" placeholder="URL pública da imagem" /></div><div class="field"><label>Banner (URL)</label><input name="banner" type="url" value="${esc(game?.banner)}" placeholder="URL pública do banner" /></div><div class="field full"><label>Descrição curta</label><textarea name="description" placeholder="Uma frase sobre o jogo">${esc(game?.description)}</textarea></div></div><label class="check-field"><input name="active" type="checkbox" ${game?.active !== false ? "checked" : ""} /> Jogo ativo na Home</label><div style="display:flex;gap:8px"><button class="primary-button" type="submit">${game ? "Salvar alterações" : "Publicar jogo"}</button>${game ? `<button class="outline-button" type="button" data-admin-cancel-edit>Cancelar</button>` : ""}</div></form>`; };
const adminRewardForm = () => `<form id="reward-form" class="admin-card"><h2>+ Novo presente</h2><div class="admin-note">Links e códigos entram como NÃO CONFIRMADO. Só use CONFIRMADO quando a fonte original permitir comprovar a recompensa. Para CÓDIGOS, informe o código exato e o destino oficial.</div><div class="field-grid"><div class="field full"><label>Jogo *</label><select name="game_id" required><option value="">Selecione um jogo</option>${state.admin.games.map((game) => `<option value="${game.id}">${esc(game.name)} · ${esc(game.reward_mode || "links")}</option>`).join("")}</select></div><div class="field full"><label>Destino oficial / link da recompensa *</label><input name="url" type="url" placeholder="https://..." /></div><div class="field full"><label>Código exato (somente jogos CÓDIGOS)</label><input name="reward_code" placeholder="Não invente nem complete códigos" /></div><div class="field"><label>Nome / recompensa informada</label><input name="name" placeholder="Deixe vazio se a fonte não informar" /></div><div class="field"><label>Tipo</label><input name="type" placeholder="Somente se informado pela fonte" /></div><div class="field"><label>Quantidade</label><input name="quantity" placeholder="Somente se informado pela fonte" /></div><div class="field"><label>Fonte original</label><input name="source" placeholder="Página ou publicação original" /></div><div class="field"><label>Data encontrada *</label><input name="date_key" type="date" required value="${todayKey()}" /></div><div class="field"><label>Horário encontrado</label><input name="time_label" type="time" /></div><div class="field full"><label>Imagem original (URL)</label><input name="image" type="url" placeholder="URL pública da imagem" /></div><div class="field full"><label>Ou enviar imagem</label><input name="image_file" type="file" accept="image/*" /></div><div class="field"><label>Status *</label><select name="status"><option value="unconfirmed">🟡 NÃO CONFIRMADO</option><option value="confirmed">🟢 CONFIRMADO</option><option value="expired_invalid">🔴 EXPIRADO / INVÁLIDO</option></select></div></div><button class="primary-button" type="submit">Publicar presente</button></form>`;
const adminSourceForm = () => { const source = state.admin?.sources.find((item) => Number(item.id) === Number(state.editSourceId)); return `<form id="source-form" class="admin-card" data-edit-source-id="${source?.id || ""}"><h2>${source ? "Editar fonte" : "+ Adicionar fonte"}</h2><div class="admin-note">A fonte precisa ser pública e pertencer a um único jogo. A coleta acontece somente no servidor.</div><div class="field-grid"><div class="field full"><label>Jogo *</label><select name="game_id" required><option value="">Selecione um jogo</option>${state.admin.games.map((game) => `<option value="${game.id}" ${Number(source?.game_id) === Number(game.id) ? "selected" : ""}>${esc(game.name)}</option>`).join("")}</select></div><div class="field"><label>Nome da fonte *</label><input name="name" required value="${esc(source?.name)}" placeholder="Nome da publicação" /></div><div class="field"><label>Tipo de parser</label><select name="parser_type"><option value="html_links" ${source?.parser_type === "html_links" ? "selected" : ""}>HTML · links</option><option value="json_links" ${source?.parser_type === "json_links" ? "selected" : ""}>JSON · links</option><option value="direct_url" ${source?.parser_type === "direct_url" ? "selected" : ""}>URL direta</option><option value="html_codes" ${source?.parser_type === "html_codes" ? "selected" : ""}>HTML · códigos</option><option value="json_codes" ${source?.parser_type === "json_codes" ? "selected" : ""}>JSON · códigos</option><option value="direct_code" ${source?.parser_type === "direct_code" ? "selected" : ""}>Código direto</option></select></div><div class="field full"><label>URL pública da fonte *</label><input name="url" type="url" required value="${esc(source?.url)}" placeholder="https://..." /></div></div><label class="check-field"><input name="active" type="checkbox" ${source?.active !== false ? "checked" : ""} /> Fonte ativa</label><div style="display:flex;gap:8px"><button class="primary-button" type="submit">${source ? "Salvar fonte" : "Adicionar fonte"}</button>${source ? `<button class="outline-button" type="button" data-admin-cancel-source-edit>Cancelar</button>` : ""}</div></form>`; };
const adminEventSourceForm = () => `<form id="event-source-form" class="admin-card"><h2>+ Fonte de eventos</h2><div class="admin-note">Este cadastro pertence somente ao coletor de eventos. Fontes de terceiros ficam como descoberta e nunca confirmam um evento.</div><div class="field-grid"><div class="field full"><label>Jogo *</label><select name="game_id" required><option value="">Selecione um jogo</option>${state.admin.games.map((game) => `<option value="${game.id}">${esc(game.name)}</option>`).join("")}</select></div><div class="field"><label>Nome da fonte *</label><input name="name" required placeholder="Central oficial de notícias" /></div><div class="field"><label>Tipo da fonte</label><select name="source_kind"><option value="official">Site oficial</option><option value="official_help">Central de ajuda oficial</option><option value="official_news">Notícias oficiais</option><option value="official_social">Rede social oficial</option><option value="official_store">Loja oficial</option><option value="discovery">Descoberta de terceiros</option></select></div><div class="field full"><label>URL pública *</label><input name="url" type="url" required placeholder="https://..." /></div></div><label class="check-field"><input name="active" type="checkbox" checked /> Fonte ativa</label><button class="primary-button" type="submit">Adicionar fonte de eventos</button></form>`;
const collectionResultView = () => { const result = state.collectionResult; if (!result) return ""; return `<section class="admin-card collection-result"><div class="admin-card-heading"><h2>Resultado da coleta</h2><span class="status-pill ${result.sources_failed ? "expired" : ""}">${result.sources_failed ? "Com erros" : "Concluída"}</span></div><p>${result.sources_consulted} fonte(s) consultada(s) · ${result.candidate_links} candidato(s) · ${result.new_links_saved} novo(s) · ${result.duplicates_ignored} duplicado(s)</p>${result.results?.length ? `<div class="admin-list">${result.results.map((item) => `<div class="admin-row"><div><strong>${esc(item.name)}</strong><small>${item.http_status ? `HTTP ${item.http_status}` : "Sem resposta HTTP"} · ${item.links_found} encontrado(s) · ${item.new_links_saved} novo(s)</small>${item.diagnostics?.length ? `<div class="collection-diagnostics">${item.diagnostics.map((entry) => `<small>${entry.quantity ? `${esc(entry.quantity)} energia` : "Energia grátis"} · fonte ${esc(entry.source_date || "não informada")} · ${esc(entry.original_url || entry.discovered_url || "URL não informada")} → ${esc(entry.final_url || "sem URL final")} · ${esc(entry.reward_key || "sem reward_key")} · ${esc(entry.outcome || "não salvo")}</small>`).join("")}</div>` : ""}</div><small class="${item.error ? "source-error" : "source-success"}">${esc(item.error || "Sucesso")}</small></div>`).join("")}</div>` : `<p class="admin-note">Nenhuma fonte ativa foi cadastrada. Resultado real: zero fontes consultadas e zero links encontrados.</p>`}</section>`; };
const eventAdminView = () => {
  const sources = Array.isArray(state.admin?.event_sources) ? state.admin.event_sources : [];
  const events = Array.isArray(state.admin?.events) ? state.admin.events : [];
  const logs = Array.isArray(state.admin?.event_logs) ? state.admin.event_logs : [];
  return `<section class="admin-card event-admin-card"><div class="admin-card-heading"><h2>Eventos reais</h2><button class="small-button active" type="button" data-admin-collect-events>ATUALIZAR EVENTOS</button></div><p class="admin-note">Coletor separado · rotação server-side a cada ${Number(state.admin?.event_collection_interval_hours || 6)} horas por fonte · ${state.admin?.event_scheduler_configured ? "scheduler configurado" : "handler pronto; cron externo ainda não configurado"}.</p><h3>Fontes de eventos <small style="color:var(--muted);font-size:12px">${sources.length}</small></h3><div class="admin-list">${sources.map((source) => `<div class="admin-row"><div><strong>${esc(source.game_name)} · ${esc(source.name)}</strong><small>${esc(source.url)} · ${esc(source.source_kind)} · ${source.active ? "ativa" : "inativa"}</small><small>Última checagem: ${esc(source.last_checked_at || "nunca")}${source.last_error ? ` · ${esc(source.last_error)}` : ""}</small></div></div>`).join("") || `<p class="admin-muted">Nenhuma fonte de eventos configurada.</p>`}</div><h3>Eventos publicados <small style="color:var(--muted);font-size:12px">${events.length}</small></h3><div class="admin-list">${events.slice(0, 30).map((event) => `<div class="admin-row"><div><strong>${esc(event.game_name)} · ${esc(event.title)}</strong><small>${esc(event.status_label || event.status)} · ${esc(eventPeriodText(event))}</small><small>Fonte: ${esc(event.source_name || event.official_source || "não informada")}</small></div></div>`).join("") || `<p class="admin-muted">Nenhum evento oficial publicado.</p>`}</div><h3>Logs do coletor <small style="color:var(--muted);font-size:12px">${logs.length}</small></h3><div class="admin-list">${logs.slice(0, 12).map((log) => `<div class="admin-row"><div><strong>${esc(log.game_name || log.source_name || "Fonte")}</strong><small>${esc(log.started_at)} · ${log.candidates_found || 0} candidatos · ${log.published_count || 0} novos · ${log.updated_count || 0} atualizados · ${log.discarded_count || 0} descartados</small></div><small class="${log.error ? "source-error" : "source-success"}">${esc(log.error || "Sucesso")}</small></div>`).join("") || `<p class="admin-muted">Nenhuma coleta de eventos registrada.</p>`}</div></section>`;
};
const lockCustomGameCover = () => {
  const form = document.querySelector("#game-form");
  const input = form?.querySelector('[name="image"]');
  const gameId = Number(form?.dataset.editGameId);
  const game = state.admin?.games.find((item) => Number(item.id) === gameId);
  if (!game || !input || !game.image || game.image === `/assets/logos/${game.slug}.svg`) return;
  input.disabled = true;
  input.setAttribute("aria-disabled", "true");
  const field = input.closest(".field");
  const label = field?.querySelector("label");
  if (label && !label.textContent.includes("bloqueada")) label.textContent += " 🔒 bloqueada";
  if (field && !field.querySelector(".cover-lock-note")) {
    const note = document.createElement("small");
    note.className = "admin-muted cover-lock-note";
    note.textContent = "Capa já adicionada e protegida contra substituição.";
    field.append(note);
  }
};
const adminCoverLockObserver = new MutationObserver(() => queueMicrotask(lockCustomGameCover));
adminCoverLockObserver.observe(app, { childList: true });
const mountEventAdminTools = () => {
  const columns = app.querySelector(".admin-columns > div");
  if (!columns || columns.querySelector("#event-source-form")) return;
  const wrapper = document.createElement("div");
  wrapper.dataset.eventAdminTools = "true";
  wrapper.innerHTML = `${adminEventSourceForm()}${eventAdminView()}`;
  columns.append(wrapper);
};
// The existing observer is kept for cover protection; event tools are mounted
// after the same admin render without changing the reward forms.
const eventAdminMountObserver = new MutationObserver(() => queueMicrotask(mountEventAdminTools));
eventAdminMountObserver.observe(app, { childList: true });
const renderAdmin = async () => {
  app.innerHTML = `<div class="loading">Carregando área administrativa…</div>`;
  try {
    const session = await api("/api/admin/session");
    if (!session.isOwner) { app.innerHTML = `<div class="admin-shell">${emptyState("Área restrita", "A administração está disponível apenas para o proprietário deste projeto.", "⌁")}<p style="text-align:center;margin-top:18px"><a class="back-link" href="${pathFor("home")}" data-route>‹ ${esc(copy().home)}</a></p></div>`; return; }
    state.admin = await api("/api/admin/data");
    app.innerHTML = `<div class="admin-shell"><div class="admin-heading"><div><p class="eyebrow">✦ GAME GIFTS</p><h1>Admin central</h1><p>Gerencie jogos, fontes e presentes publicados.</p></div><div class="admin-heading-actions"><button class="primary-button" type="button" data-admin-collect>BUSCAR AGORA</button><a class="outline-button" href="${pathFor("home")}" data-route>Ver site ↗</a></div></div><div class="admin-note">🔒 <strong>Coleta automática fixa: a cada 24 horas.</strong> Ela roda no servidor mesmo com o navegador fechado. Links e códigos expirados permanecem registrados internamente para não serem publicados novamente.</div>${collectionResultView()}<div class="admin-columns"><div>${adminGameForm()}${adminSourceForm()}${adminRewardForm()}</div><div><section class="admin-card"><h2>Fontes <small style="color:var(--muted);font-size:12px">${state.admin.sources.length}</small></h2><div class="admin-list">${state.admin.sources.map((source) => `<div class="admin-row source-row"><div><strong>${esc(source.game_name)} · ${esc(source.name)}</strong><small>${esc(source.url)} · ${source.active ? "ativa" : "inativa"} · ${esc(source.parser_type)}</small><small>Última checagem: ${esc(source.last_checked_at || "nunca")} · Último sucesso: ${esc(source.last_success_at || "nunca")}</small>${source.last_error ? `<small class="source-error">Erro: ${esc(source.last_error)}</small>` : ""}</div><div class="admin-row-actions"><button class="small-button ${source.active ? "active" : ""}" data-admin-source-active="${source.id}" data-active="${source.active}">${source.active ? "Ativa" : "Inativa"}</button><button class="small-button" data-admin-test-source="${source.id}">Testar</button><button class="small-button" data-admin-edit-source="${source.id}">Editar</button><button class="small-button danger" data-admin-delete-source="${source.id}">Excluir</button></div></div>`).join("") || emptyState("Nenhuma fonte", "Cadastre uma fonte pública real para iniciar a coleta.")}</div></section><section class="admin-card"><h2>Jogos cadastrados <small style="color:var(--muted);font-size:12px">${state.admin.games.length}</small></h2><div class="admin-list">${state.admin.games.map((game) => `<div class="admin-row"><div><strong>${esc(game.name)}</strong><small>/${esc(game.slug)} · ${game.active ? "ativo" : "inativo"}</small></div><div class="admin-row-actions"><button class="small-button ${game.active ? "active" : ""}" data-admin-game-active="${game.id}" data-active="${game.active}">${game.active ? "Ativo" : "Inativo"}</button><button class="small-button" data-admin-edit-game="${game.id}">Editar</button></div></div>`).join("") || emptyState("Nenhum jogo", "Adicione o primeiro jogo.")}</div></section><section class="admin-card"><h2>Presentes cadastrados <small style="color:var(--muted);font-size:12px">${state.admin.rewards.length}</small></h2><div class="admin-list">${state.admin.rewards.map((reward) => `<div class="admin-row"><div><strong>${esc(reward.game_name)} · ${esc(reward.name || "Recompensa não confirmada")}</strong><small>${esc(reward.date_key)} · ${esc(reward.type || "sem tipo")}${reward.quantity ? ` · ${esc(reward.quantity)}` : ""}</small></div><div class="admin-row-actions"><select class="small-button" data-admin-reward-status="${reward.id}" aria-label="Status"><option value="problem_unconfirmed" ${adminStatusValue(reward) === "problem_unconfirmed" ? "selected" : ""}>🟠 Link com problema / não confirmado</option><option value="unconfirmed" ${adminStatusValue(reward) === "unconfirmed" ? "selected" : ""}>🟡 Não confirmado</option><option value="confirmed" ${adminStatusValue(reward) === "confirmed" ? "selected" : ""}>🟢 Confirmado</option><option value="expired_invalid" ${adminStatusValue(reward) === "expired_invalid" ? "selected" : ""}>🔴 Expirado / inválido</option></select><button class="small-button danger" data-admin-delete-reward="${reward.id}">Excluir</button></div></div>`).join("") || emptyState("Nenhum presente", "Os links coletados aparecerão aqui.")}</div></section><section class="admin-card"><h2>Log da coleta</h2><div class="admin-list">${state.admin.logs.map((log) => `<div class="admin-row"><div><strong>${esc(log.source_name || "Execução geral")}</strong><small>${esc(log.started_at)} · HTTP ${esc(log.http_status || "—")} · ${log.links_found} candidatos · ${log.new_links_saved} novos · ${log.duplicates_ignored} duplicados</small></div><small class="${log.error ? "source-error" : "source-success"}">${esc(log.error || "Sucesso")}</small></div>`).join("") || `<p class="admin-muted">Nenhuma execução registrada.</p>`}</div></section></div></div></div>`;
  } catch (error) { app.innerHTML = `<div class="admin-shell">${emptyState("Admin indisponível", error.message, "!")}</div>`; }
};
const syncHomeMobileNav = () => {
  const nav = document.querySelector(".mobile-nav");
  if (!nav) return;
  const current = route();
  if (current.page === "home") {
    nav.classList.add("home-reference-nav");
    nav.innerHTML = `<a href="${pathFor("home")}" data-route data-nav="home"><span>${homeReferenceIcon("home")}</span><b>${state.lang === "pt" ? "Início" : "Home"}</b></a><a href="${pathFor("news")}?recent=1" data-route data-nav="news"><span>${homeReferenceIcon("gift")}</span><b>${state.lang === "pt" ? "Presentes" : "Gifts"}</b></a><a href="${pathFor("games")}" data-route data-nav="games"><span>${homeReferenceIcon("game")}</span><b>${state.lang === "pt" ? "Jogos" : "Games"}</b></a><a href="${pathFor("play")}" data-route data-nav="play"><span>${homeReferenceIcon("play")}</span><b>${state.lang === "pt" ? "Jogar" : "Play"}</b></a><a href="${pathFor("favorites")}" data-route data-nav="favorites"><span>${homeReferenceIcon("heart")}</span><b>${state.lang === "pt" ? "Favoritos" : "Favorites"}</b></a>`;
  } else if (nav.classList.contains("home-reference-nav") || !nav.children.length) {
    nav.classList.remove("home-reference-nav");
    nav.innerHTML = `<a href="${pathFor("home")}" data-route data-nav="home"><span>⌂</span><b data-i18n="home">${esc(copy().home)}</b></a><a href="${pathFor("games")}" data-route data-nav="games"><span>♧</span><b data-i18n="games">${esc(copy().games)}</b></a><a href="${pathFor("news")}" data-route data-nav="news"><span>✧</span><b data-i18n="news">${esc(copy().news)}</b></a><a href="${pathFor("play")}" data-route data-nav="play"><span>▶</span><b>Jogar</b></a><a href="${pathFor("favorites")}" data-route data-nav="favorites"><span>♡</span><b data-i18n="favorites">${esc(copy().favorites)}</b></a>`;
  }
};
const renderReferenceHome = () => {
  const ui = portalCopy();
  const games = publicGames();
  const todayGroups = games.map((game) => ({ game, rewards: publicTodayRewardsForGame(game).filter(isLinkActive) })).filter((entry) => entry.rewards.length);
  const recent = recentHomeRewards().slice(0, 6);
  const featured = [...games].sort((a, b) => activeRewardsForGame(b).length - activeRewardsForGame(a).length || a.name.localeCompare(b.name)).slice(0, 7);
  const popularFromData = Array.isArray(state.data.popular) ? state.data.popular.map((entry) => gameFor(entry.slug || entry.game_slug)).filter(Boolean) : [];
  const popular = (popularFromData.length ? popularFromData : featured).slice(0, 7);
  const followed = noticePrefs().games;
  const title = state.lang === "pt" ? { fresh: "ACABOU DE CHEGAR", today: "PRESENTES DE HOJE", featured: "JOGOS EM DESTAQUE", popular: popularFromData.length ? "JOGOS POPULARES" : "JOGOS COM PRESENTES", notices: "MEUS AVISOS", points: "NOSSO JOGO", viewAll: "Ver todos", viewGifts: "Ver presentes", search: "Buscar jogo, presente, código...", heroCopy: "Links, códigos, eventos e novidades todos os dias, em um só lugar!", gameNow: "Jogar agora" } : { fresh: "JUST IN", today: "TODAY'S GIFTS", featured: "FEATURED GAMES", popular: popularFromData.length ? "POPULAR GAMES" : "GAMES WITH GIFTS", notices: "MY ALERTS", points: "OUR GAME", viewAll: "View all", viewGifts: "View gifts", search: "Search game, gift, code...", heroCopy: "Links, codes, events and news every day, all in one place!", gameNow: "Play now" };
  const heroGames = featured.slice(0, 5);
  const heroArt = heroGames.length ? heroGames.map((game, index) => `<div class="home-reference-hero-tile hero-tile-${index}">${gameArt(game, "home-reference-hero-art")}</div>`).join("") : `<div class="home-reference-hero-empty">✦</div>`;
  const nav = `<nav class="home-reference-tabs" aria-label="Atalhos da página inicial"><a class="is-active" href="${pathFor("home")}" data-route><span>▦</span><b>${state.lang === "pt" ? "Todos" : "All"}</b></a><a href="${pathFor("games")}" data-route><span>↗</span><b>${state.lang === "pt" ? "Links" : "Links"}</b></a><a href="${pathFor("codes")}" data-route><span>🎟</span><b>${state.lang === "pt" ? "Códigos" : "Codes"}</b></a><a href="${pathFor("events")}" data-route><span>▣</span><b>${state.lang === "pt" ? "Eventos" : "Events"}</b></a><a href="${pathFor("news")}" data-route><span>♨</span><b>${state.lang === "pt" ? "Novidades" : "News"}</b></a><a href="${pathFor("favorites")}" data-route><span>♡</span><b>${state.lang === "pt" ? "Favoritos" : "Favorites"}</b></a><a href="#meus-avisos"><span>🔔</span><b>${state.lang === "pt" ? "Meus avisos" : "My alerts"}</b></a></nav>`;
  const fresh = recent.length ? recent.map(homeArrivalCard).join("") : `<div class="home-reference-empty"><span>🎁</span><strong>${esc(homeCopy().noRecent)}</strong><small>${esc(homeSearchingCopy()[1])}</small></div>`;
  const today = todayGroups.length ? todayGroups.slice(0, 4).map(({ game, rewards }) => `<article class="home-reference-gift-card"><a href="${pathFor("games", game.slug)}" data-route data-analytics-game-name="${esc(game.name)}" data-analytics-game-slug="${esc(game.slug)}"><div class="home-reference-gift-art">${gameArt(game, "home-reference-card-art")}${rewards.length > 0 ? `<span class="home-reference-card-badge">${rewards.length}</span>` : ""}</div><h3>${esc(game.name)}</h3><span>🎁 ${rewards.length} ${rewards.length === 1 ? (state.lang === "pt" ? "link novo" : "new link") : (state.lang === "pt" ? "links novos" : "new links")}</span></a><a class="home-reference-yellow-button" href="${pathFor("games", game.slug)}" data-route>${esc(title.viewGifts)} <b>›</b></a></article>`).join("") : `<div class="home-reference-empty"><span>🎁</span><strong>${esc(ui.noData)}</strong><small>${esc(ui.todayCopy)}</small></div>`;
  const gameChips = featured.length ? featured.map((game) => `<a class="home-reference-game-chip" href="${pathFor("games", game.slug)}" data-route data-analytics-game-name="${esc(game.name)}" data-analytics-game-slug="${esc(game.slug)}"><span>${gameArt(game, "home-reference-chip-art")}</span><b>${esc(game.name)}</b></a>`).join("") : `<div class="home-reference-empty"><strong>${esc(copy().noGames)}</strong></div>`;
  const popularCards = popular.length ? popular.map((game) => `<article class="home-reference-popular-card"><a href="${pathFor("games", game.slug)}" data-route><div>${gameArt(game, "home-reference-popular-art")}</div><b>${esc(game.name)}</b></a><button type="button" class="home-reference-favorite ${isFavorite("game", game.id) ? "is-favorite" : ""}" data-favorite-type="game" data-favorite-id="${esc(game.id)}" aria-label="${esc(isFavorite("game", game.id) ? copy().unfavorite : copy().favorite)}">${isFavorite("game", game.id) ? "♥" : "♡"}</button></article>`).join("") : `<div class="home-reference-empty"><strong>${esc(ui.noData)}</strong></div>`;
  const notices = games.length ? games.slice(0, 8).map((game) => { const on = followed.includes(String(game.slug)); return `<button type="button" class="home-reference-notice-pill ${on ? "is-on" : ""}" data-notice-toggle="${esc(game.slug)}"><span>${gameArt(game, "home-reference-notice-art")}</span><b>${esc(game.name)}</b><i>${on ? "✓" : "+"}</i></button>`; }).join("") : `<div class="home-reference-empty"><strong>${esc(ui.noData)}</strong></div>`;
  const score = scoreData().score.toLocaleString(state.lang === "pt" ? "pt-BR" : state.lang);
  return `<div class="home-reference"><section class="home-reference-hero"><div class="home-reference-hero-copy"><span class="home-reference-kicker">🎮 GAME GIFTS</span><h1>SEUS JOGOS<br><em>MAIS PRESENTES!</em></h1><p>${esc(title.heroCopy)}</p><div class="home-reference-proof"><span>↗ <b>${state.lang === "pt" ? "LINKS REAIS" : "REAL LINKS"}</b></span><span>◇ <b>${state.lang === "pt" ? "FONTES CONFIÁVEIS" : "TRUSTED SOURCES"}</b></span><span>🎁 <b>100% ${state.lang === "pt" ? "GRÁTIS" : "FREE"}</b></span></div><a class="home-reference-hero-button" href="${pathFor("news")}?recent=1" data-route>${state.lang === "pt" ? "VER PRESENTES DE HOJE" : "VIEW TODAY'S GIFTS"}<b>›</b></a></div><div class="home-reference-hero-art">${heroArt}<span class="home-reference-hero-note">${state.lang === "pt" ? "Mais jogos. Mais presentes." : "More games. More gifts."}</span></div></section>${nav}<section class="home-reference-section home-reference-fresh"><div class="home-reference-section-heading"><h2><span>🎁</span>${esc(title.fresh)}</h2><a href="${pathFor("news")}?recent=1" data-route>${esc(title.viewAll)} <b>›</b></a></div><div class="home-reference-fresh-grid">${fresh}</div></section><section class="home-reference-section home-reference-today"><div class="home-reference-section-heading"><h2><span>🎁</span>${esc(title.today)}</h2><a href="${pathFor("news")}?recent=1" data-route>${esc(title.viewAll)} <b>›</b></a></div><div class="home-reference-gift-grid">${today}</div></section><section class="home-reference-section home-reference-featured"><div class="home-reference-section-heading"><h2><span>♛</span>${esc(title.featured)}</h2><a href="${pathFor("games")}" data-route>${esc(title.viewAll)} <b>›</b></a></div><div class="home-reference-game-row">${gameChips}</div></section><section class="home-reference-points"><div class="home-reference-points-art">🎁</div><div><span class="home-reference-kicker">🎮 ${esc(title.points)}</span><h2>${state.lang === "pt" ? "ABRA E GANHE PONTOS!" : "OPEN AND EARN POINTS!"}</h2><p>${state.lang === "pt" ? "Abra presentes reais e acumule pontos no site." : "Open real gifts and collect points on the site."}</p></div><div class="home-reference-score"><small>${esc(scoreLabel())}</small><strong data-score-value>${esc(score)}</strong><span>+10 ${state.lang === "pt" ? "por presente aberto" : "per gift opened"}</span></div><a class="home-reference-yellow-button" href="${pathFor("news")}?recent=1" data-route>${esc(title.gameNow)} <b>›</b></a></section><section class="home-reference-section home-reference-popular"><div class="home-reference-section-heading"><h2><span>🎮</span>${esc(title.popular)}</h2><a href="${pathFor("games")}" data-route>${state.lang === "pt" ? "Mais jogos" : "More games"} <b>›</b></a></div><div class="home-reference-popular-grid">${popularCards}</div></section><section class="home-reference-section home-reference-notices" id="meus-avisos"><div class="home-reference-section-heading"><div><h2><span>🔔</span>${esc(title.notices)}</h2><p>${esc(ui.noticesCopy)} · ${followed.length} ${state.lang === "pt" ? "acompanhados" : "followed"}</p></div><button type="button" class="home-reference-outline-button" data-notice-all>${esc(ui.activateAll)}</button></div><div class="home-reference-notice-grid">${notices}</div></section></div>`;
};
const DICE_ROLLS_PER_DAY = 10;
const DICE_CHALLENGE_DAYS = 30;
const DICE_CHALLENGE_KEY = "game-gifts-dice-challenge";
const diceTodayKey = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; };
const diceDayGap = (from, to) => Math.round((Date.parse(`${to}T00:00:00`) - Date.parse(`${from}T00:00:00`)) / 86400000);
const readDiceChallenge = () => {
  const today = diceTodayKey();
  try {
    const saved = JSON.parse(localStorage.getItem(DICE_CHALLENGE_KEY) || "{}");
    if (saved.completed) return { dayKey: today, rollsToday: DICE_ROLLS_PER_DAY, streak: DICE_CHALLENGE_DAYS, totalRolls: Number(saved.totalRolls) || 0, completed: true, completedAt: saved.completedAt || "" };
    const previous = String(saved.dayKey || "");
    const gap = previous ? diceDayGap(previous, today) : 0;
    return { dayKey: today, rollsToday: previous === today ? Math.min(DICE_ROLLS_PER_DAY, Number(saved.rollsToday) || 0) : 0, streak: previous === today || gap === 1 ? Math.min(DICE_CHALLENGE_DAYS, Number(saved.streak) || 0) : 0, totalRolls: Number(saved.totalRolls) || 0, completed: false, completedAt: "" };
  } catch { return { dayKey: today, rollsToday: 0, streak: 0, totalRolls: 0, completed: false, completedAt: "" }; }
};
const saveDiceChallenge = (value) => { try { localStorage.setItem(DICE_CHALLENGE_KEY, JSON.stringify(value)); } catch {} };
const diceFaces = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const dicePipPositions = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [1, 3], [3, 1], [3, 3]], 5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]], 6: [[1, 1], [2, 1], [3, 1], [1, 3], [2, 3], [3, 3]] };
const diceFaceMarkup = (face, side) => `<div class="home-real-die-face home-real-die-${side}" aria-hidden="true">${dicePipPositions[face].map(([row, column]) => `<i style="grid-row:${row};grid-column:${column}"></i>`).join("")}</div>`;
const renderDiceOverlay = () => `<div class="home-dice-overlay" data-dice-overlay hidden><div class="home-dice-backdrop" data-close-dice></div><section class="home-dice-modal" role="dialog" aria-modal="true" aria-labelledby="home-dice-title"><button class="home-dice-close" type="button" data-close-dice aria-label="Fechar">×</button><div class="home-dice-heading"><span class="home-reference-kicker">🎲 NOSSO JOGO</span><h2 id="home-dice-title">${state.lang === "pt" ? "DADO PREMIADO" : "REWARD DIE"}</h2><p>${state.lang === "pt" ? "Role o dado durante a rodada e acumule pontos. A recompensa é liberada ao terminar o cronômetro." : "Roll during the round and collect points. The reward is released when the timer ends."}</p></div><div class="home-dice-stage"><div class="home-dice-table" aria-hidden="true"><span class="home-dice-table-highlight"></span></div><div class="home-dice-die-wrap"><div class="home-real-die" data-real-die style="transform: rotateX(-18deg) rotateY(25deg)">${diceFaceMarkup(1, "front")}${diceFaceMarkup(2, "top")}${diceFaceMarkup(3, "right")}${diceFaceMarkup(4, "left")}${diceFaceMarkup(5, "bottom")}${diceFaceMarkup(6, "back")}</div></div><div class="home-dice-shadow" aria-hidden="true"></div><div class="home-dice-burst" data-dice-burst></div></div><div class="home-dice-status" aria-live="polite"><strong data-dice-status>${state.lang === "pt" ? "Pronto para jogar" : "Ready to play"}</strong><span data-dice-result>${state.lang === "pt" ? "Clique em rolar para começar" : "Click roll to start"}</span></div><div class="home-dice-stats"><div><small>${state.lang === "pt" ? "Tempo restante" : "Time left"}</small><strong data-dice-countdown>02:00</strong></div><div><small>${esc(scoreLabel())}</small><strong data-dice-session-score>0</strong></div></div><button class="home-reference-yellow-button home-dice-roll-button" type="button" data-dice-roll>${state.lang === "pt" ? "ROLAR O DADO" : "ROLL THE DIE"}<b>↻</b></button><p class="home-dice-reward-note">${state.lang === "pt" ? "Ao zerar o tempo, os pontos da rodada entram na sua pontuação local." : "When the timer reaches zero, the round points enter your local score."}</p></section></div>`;
const diceGame = { points: 0, rollTimer: null, rolling: false, turns: 0, challenge: readDiceChallenge() };
const diceRotation = { 1: [-18, 25], 2: [-110, 25], 3: [-18, -65], 4: [-18, 115], 5: [70, 25], 6: [-18, 205] };
const updateDiceUi = () => {
  diceGame.challenge = readDiceChallenge();
  const dailyProgress = document.querySelector("[data-dice-daily-progress]");
  const streak = document.querySelector("[data-dice-streak]");
  const dayPoints = document.querySelector("[data-dice-day-points]");
  if (dailyProgress) dailyProgress.textContent = `${diceGame.challenge.rollsToday}/${DICE_ROLLS_PER_DAY}`;
  if (streak) streak.textContent = `${diceGame.challenge.streak}/${DICE_CHALLENGE_DAYS}`;
  if (dayPoints) dayPoints.textContent = String(diceGame.points);
};
const spawnDiceBurst = () => {
  const burst = document.querySelector("[data-dice-burst]");
  if (!burst) return;
  burst.innerHTML = Array.from({ length: 24 }, (_, index) => `<i style="--x:${Math.round((Math.random() - .5) * 220)}px;--y:${Math.round((Math.random() - .5) * 190)}px;--r:${Math.round(Math.random() * 360)}deg;--d:${(index % 6) * 20}ms"></i>`).join("");
  window.setTimeout(() => { if (burst.isConnected) burst.innerHTML = ""; }, 1100);
};
const completeDiceDay = () => {
  if (diceGame.challenge.rollsToday < DICE_ROLLS_PER_DAY || diceGame.challenge.completed) return;
  diceGame.challenge.streak = Math.min(DICE_CHALLENGE_DAYS, diceGame.challenge.streak + 1);
  if (diceGame.challenge.streak >= DICE_CHALLENGE_DAYS) {
    diceGame.challenge.completed = true;
    diceGame.challenge.completedAt = new Date().toISOString();
  }
  saveDiceChallenge(diceGame.challenge);
  const status = document.querySelector("[data-dice-status]");
  const result = document.querySelector("[data-dice-result]");
  if (diceGame.challenge.completed) {
    if (status) status.textContent = state.lang === "pt" ? "Desafio concluído!" : "Challenge complete!";
    if (result) result.textContent = state.lang === "pt" ? "Elegível para validação do gift card" : "Eligible for gift-card validation";
  } else {
    if (status) status.textContent = state.lang === "pt" ? "Dia concluído!" : "Day complete!";
    if (result) result.textContent = state.lang === "pt" ? `${diceGame.challenge.streak}/${DICE_CHALLENGE_DAYS} dias completos` : `${diceGame.challenge.streak}/${DICE_CHALLENGE_DAYS} days complete`;
  }
  spawnDiceBurst();
  diceGame.points = 0;
  updateDiceUi();
};
const openDiceGame = () => {
  const overlay = document.querySelector("[data-dice-overlay]");
  if (!overlay) return;
  diceGame.challenge = readDiceChallenge();
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("is-open"));
  updateDiceUi();
  overlay.querySelector("[data-dice-roll]")?.focus({ preventScroll: true });
};
const closeDiceGame = () => {
  const overlay = document.querySelector("[data-dice-overlay]");
  if (!overlay) return;
  overlay.classList.remove("is-open");
  if (diceGame.rollTimer) { window.clearTimeout(diceGame.rollTimer); diceGame.rollTimer = null; }
  diceGame.rolling = false;
  const button = overlay.querySelector("[data-dice-roll]");
  if (button) button.disabled = false;
  window.setTimeout(() => { if (!overlay.classList.contains("is-open")) overlay.hidden = true; }, 220);
};
const rollDice = (button) => {
  if (diceGame.rolling) return;
  diceGame.challenge = readDiceChallenge();
  if (diceGame.challenge.completed) {
    const status = document.querySelector("[data-dice-status]");
    const result = document.querySelector("[data-dice-result]");
    if (status) status.textContent = state.lang === "pt" ? "Desafio já concluído" : "Challenge already complete";
    if (result) result.textContent = state.lang === "pt" ? "Gift card pendente de validação" : "Gift card pending validation";
    return;
  }
  if (diceGame.challenge.rollsToday >= DICE_ROLLS_PER_DAY) {
    const status = document.querySelector("[data-dice-status]");
    const result = document.querySelector("[data-dice-result]");
    if (status) status.textContent = state.lang === "pt" ? "Limite de hoje concluído" : "Today's limit complete";
    if (result) result.textContent = state.lang === "pt" ? "Volte amanhã para continuar" : "Come back tomorrow to continue";
    return;
  }
  diceGame.rolling = true;
  button.disabled = true;
  const die = document.querySelector("[data-real-die]");
  const stage = document.querySelector(".home-dice-stage");
  const status = document.querySelector("[data-dice-status]");
  const result = document.querySelector("[data-dice-result]");
  const face = 1 + Math.floor(Math.random() * 6);
  const [x, y] = diceRotation[face];
  diceGame.turns += 1;
  if (status) status.textContent = state.lang === "pt" ? "O dado está girando…" : "The die is spinning…";
  if (result) result.textContent = state.lang === "pt" ? "Aguarde o resultado" : "Wait for the result";
  stage?.classList.add("is-rolling");
  if (die) { die.classList.add("is-rolling"); die.style.transform = `rotateX(${x + diceGame.turns * 720}deg) rotateY(${y + diceGame.turns * 720}deg) rotateZ(${diceGame.turns % 2 ? 12 : -12}deg)`; }
  diceGame.rollTimer = window.setTimeout(() => {
    diceGame.rolling = false;
    diceGame.rollTimer = null;
    button.disabled = false;
    diceGame.points += face;
    diceGame.challenge.rollsToday += 1;
    diceGame.challenge.totalRolls += 1;
    saveDiceChallenge(diceGame.challenge);
    stage?.classList.remove("is-rolling");
    die?.classList.remove("is-rolling");
    if (status) status.textContent = state.lang === "pt" ? `Você tirou ${diceFaces[face]}` : `You rolled ${face}`;
    if (result) result.textContent = state.lang === "pt" ? `+${face} ponto${face === 1 ? "" : "s"} · ${diceGame.challenge.rollsToday}/${DICE_ROLLS_PER_DAY} hoje` : `+${face} point${face === 1 ? "" : "s"} · ${diceGame.challenge.rollsToday}/${DICE_ROLLS_PER_DAY} today`;
    spawnDiceBurst();
    updateDiceUi();
    if (diceGame.challenge.rollsToday === DICE_ROLLS_PER_DAY) completeDiceDay();
  }, 1450);
};
const QUIZ_QUESTIONS = Object.freeze([
  { question: "Qual é a mecânica principal do Match Masters?", options: ["Combinar peças", "Construir cidades", "Correr em pistas", "Cuidar de fazendas"], answer: 0 },
  { question: "Que recurso é associado ao Coin Master?", options: ["Cartas de corrida", "Spins", "Bolas de futebol", "Peças de xadrez"], answer: 1 },
  { question: "O que você usa para jogar uma rodada no Monopoly GO!?", options: ["Dados", "Cartas de memória", "Chaves", "Combustível"], answer: 0 },
  { question: "Qual ação define a progressão do Travel Town?", options: ["Fundir itens", "Pescar palavras", "Montar robôs", "Pintar mapas"], answer: 0 },
  { question: "O Roblox reúne principalmente o quê?", options: ["Experiências criadas por usuários", "Somente filmes", "Apenas partidas de cartas", "Um catálogo de músicas"], answer: 0 },
  { question: "Qual formato descreve o Free Fire?", options: ["Batalha real", "Jogo de tabuleiro offline", "Quiz de matemática", "Simulador de culinária"], answer: 0 },
  { question: "O Bingo Blitz tem como base qual jogo?", options: ["Bingo", "Sinuca", "Xadrez", "Tênis"], answer: 0 },
  { question: "No Dice Dreams, o elemento central são…", options: ["Lançamentos de dados", "Corridas de kart", "Cartas de tarô", "Palavras cruzadas"], answer: 0 },
  { question: "Board Kings combina tabuleiro com…", options: ["Dados e construção", "Música e dança", "Fotografia", "Pesca submarina"], answer: 0 },
  { question: "O que o Game Gifts organiza?", options: ["Presentes, códigos e novidades públicas", "Contas de pagamento", "Itens vendidos pelo site", "Apostas entre jogadores"], answer: 0 },
]);
const quizFreshState = () => ({ index: 0, answers: [], selected: null, feedback: "", completed: false, score: 0, submitting: false, saved: false });
const quizOptionLabel = (index) => String.fromCharCode(65 + index);
const renderQuiz = () => {
  const quiz = state.quiz || (state.quiz = quizFreshState());
  if (quiz.completed) return `<div class="play-page portal-page">${portalBack()}<div class="play-result"><span class="portal-kicker">🏁 RESULTADO</span><h1>${quiz.score} pontos</h1><p>${quiz.score / 10} de 10 respostas corretas.</p><p class="play-result-note">${quiz.saved ? "Pontuação registrada no seu perfil e no ranking." : state.websimUserId ? "Não foi possível registrar agora; tente novamente." : "Entre na sua conta para registrar a pontuação no perfil e no ranking."}</p><div class="play-result-actions"><button class="portal-primary-button" type="button" data-quiz-restart>JOGAR NOVAMENTE</button><a class="portal-secondary-button" href="${pathFor("ranking")}" data-route>VER RANKING</a></div></div></div>`;
  const question = QUIZ_QUESTIONS[quiz.index];
  const answered = quiz.selected !== null;
  return `<div class="play-page portal-page">${portalBack()}<div class="play-heading"><span class="portal-kicker">🧠 QUIZ DE GAMES</span><h1>Teste seus conhecimentos</h1><p>10 perguntas · 4 alternativas · +10 pontos por acerto</p></div><div class="quiz-progress"><span>PERGUNTA ${quiz.index + 1}/10</span><div><i style="width:${((quiz.index + 1) / 10) * 100}%"></i></div></div><article class="quiz-card"><h2>${esc(question.question)}</h2><div class="quiz-options">${question.options.map((option, index) => `<button type="button" class="quiz-option ${answered ? index === question.answer ? "is-correct" : index === quiz.selected ? "is-wrong" : "is-muted" : ""}" data-quiz-option="${index}" ${answered ? "disabled" : ""}><b>${quizOptionLabel(index)}</b><span>${esc(option)}</span></button>`).join("")}</div>${quiz.feedback ? `<p class="quiz-feedback ${quiz.selected === question.answer ? "is-correct" : "is-wrong"}" aria-live="polite">${esc(quiz.feedback)}</p>` : ""}${answered ? `<button class="portal-primary-button quiz-next" type="button" data-quiz-next>${quiz.index === 9 ? "VER RESULTADO" : "PRÓXIMA PERGUNTA"} →</button>` : ""}</article></div>`;
};
const renderProfile = () => {
  if (!state.websimUserId) return `<div class="profile-page portal-page">${portalBack()}<div class="portal-page-heading"><span class="portal-kicker">◉ GAME GIFTS</span><h1>Perfil do jogador</h1><p>Entre na sua conta para registrar pontos, conquistas e posição no ranking.</p></div><div class="profile-empty"><span>◉</span><strong>Nenhum jogador conectado</strong><p>Não criamos usuários falsos. Seu perfil aparece quando a plataforma fornecer uma conta autenticada.</p><a class="portal-primary-button" href="${pathFor("play")}" data-route>JOGAR QUIZ</a></div></div>`;
  const profile = state.profile || {};
  const user = state.websimUser || {};
  const name = profile.username || user.username || "Jogador";
  const avatar = profile.avatar_url || user.avatar_url || "";
  const achievements = [];
  if (Number(profile.quizzes_completed) > 0) achievements.push("Quiz concluído");
  if (Number(profile.quiz_best_score) >= 100) achievements.push("Quiz perfeito");
  return `<div class="profile-page portal-page">${portalBack()}<div class="profile-hero"><div class="profile-avatar">${avatar ? `<img src="${esc(avatar)}" alt="" />` : esc(slugInitials(name))}</div><div><span class="portal-kicker">◉ PERFIL DO JOGADOR</span><h1>${esc(name)}</h1><p>Dados registrados pela sua conta Game Gifts.</p></div></div><div class="profile-stats"><article><small>PONTOS</small><strong>${Number(profile.points || 0)}</strong></article><article><small>NÍVEL</small><strong>${Math.floor(Number(profile.points || 0) / 100) + 1}</strong></article><article><small>SEQUÊNCIA</small><strong>${Number(profile.visit_streak || 0)} dias</strong></article><article><small>QUIZ</small><strong>${Number(profile.quizzes_completed || 0)}</strong></article><article><small>POSIÇÃO</small><strong>${profile.ranking_position ? `#${Number(profile.ranking_position)}` : "—"}</strong></article></div><section class="profile-panel"><h2>Conquistas e medalhas</h2>${achievements.length ? `<div class="achievement-list">${achievements.map((item) => `<span>🏅 ${esc(item)}</span>`).join("")}</div>` : `<div class="profile-empty compact"><span>🏅</span><strong>Nenhuma conquista registrada ainda</strong><p>Complete o Quiz de Games para começar.</p></div>`}</section><section class="profile-panel"><h2>Seus atalhos</h2><div class="portal-tool-grid"><a href="${pathFor("favorites")}" data-route><span>♥</span><strong>Favoritos</strong><small>Itens salvos neste dispositivo.</small></a><a href="${pathFor("ranking")}" data-route><span>🏆</span><strong>Ranking</strong><small>Compare apenas com pontuações reais.</small></a></div></section></div>`;
};
const renderRanking = () => {
  const labels = { daily: "Diário", weekly: "Semanal", all: "Geral" };
  const rows = Array.isArray(state.ranking) ? state.ranking : [];
  return `<div class="ranking-page portal-page">${portalBack()}<div class="portal-page-heading"><span class="portal-kicker">🏆 GAME GIFTS</span><h1>Ranking de jogadores</h1><p>Somente jogadores autenticados e pontuações registradas.</p></div><div class="ranking-tabs">${Object.keys(labels).map((period) => `<button type="button" class="${state.rankingPeriod === period ? "is-active" : ""}" data-ranking-period="${period}">${labels[period]}</button>`).join("")}</div>${rows.length ? `<div class="ranking-list">${rows.map((row, index) => `<article><b class="ranking-position">${index + 1}</b><span class="ranking-avatar">${row.avatar_url ? `<img src="${esc(row.avatar_url)}" alt="" />` : esc(slugInitials(row.username))}</span><strong>${esc(row.username || "Jogador")}</strong><span class="ranking-points">${Number(row.points || 0)} pts</span></article>`).join("")}</div>` : `<div class="profile-empty"><span>🏆</span><strong>Nenhuma pontuação registrada neste período</strong><p>Jogue o Quiz de Games com uma conta autenticada para aparecer aqui.</p><a class="portal-primary-button" href="${pathFor("play")}" data-route>JOGAR QUIZ</a></div>`}</div>`;
};
const loadProfile = async () => { if (!state.websimUserId) return; try { const result = await api("/api/profile"); state.profile = result.profile || null; } catch (error) { console.warn("Game Gifts: profile unavailable", error); } };
const loadRanking = async () => { try { const result = await api(`/api/ranking?period=${encodeURIComponent(state.rankingPeriod)}`); state.ranking = Array.isArray(result.players) ? result.players : []; } catch (error) { state.ranking = []; console.warn("Game Gifts: ranking unavailable", error); } finally { state.rankingLoaded = true; } };
const submitQuizScore = async () => {
  if (!state.websimUserId) return;
  state.quiz.submitting = true;
  try { const result = await api("/api/quiz/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ answers: state.quiz.answers, attempt_id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}` }) }); state.quiz.score = Number(result.score || state.quiz.score); state.quiz.saved = Boolean(result.saved); state.profile = result.profile || state.profile; } catch (error) { console.warn("Game Gifts: quiz score was not saved", error); }
  state.quiz.submitting = false;
};
const handleQuizOption = (option) => { const quiz = state.quiz || (state.quiz = quizFreshState()); if (quiz.selected !== null || quiz.completed) return; const question = QUIZ_QUESTIONS[quiz.index]; quiz.selected = Number(option); quiz.answers[quiz.index] = Number(option); if (quiz.selected === question.answer) { quiz.score += 10; quiz.feedback = "✓ Resposta certa! +10 pontos"; } else quiz.feedback = `✕ Resposta incorreta. A opção certa era ${quizOptionLabel(question.answer)}.`; renderPage(); };
const handleQuizNext = async () => { const quiz = state.quiz; if (!quiz || quiz.selected === null) return; if (quiz.index < 9) { quiz.index += 1; quiz.selected = null; quiz.feedback = ""; renderPage(); return; } quiz.completed = true; renderPage(); await submitQuizScore(); renderPage(); };
const renderPage = () => {
  const current = route();
  const diceWasOpen = current.page === "home" && Boolean(document.querySelector("[data-dice-overlay].is-open"));
  state.lang = current.lang;
  document.body.classList.toggle("game-page", current.page === "game");
  document.body.classList.toggle("match-masters-page", current.page === "game" && current.slug === "match-masters");
  document.body.classList.toggle("coin-master-page", current.page === "game" && current.slug === "coin-master");
  document.body.classList.toggle("home-page", current.page === "home");
  document.body.classList.toggle("settings-page-body", current.page === "settings");
  document.body.classList.toggle("recent-gifts-page-body", current.page === "news" && new URLSearchParams(location.search).get("recent") === "1");
  renderChrome();
  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    if (current.page === "home") siteHeader.style.setProperty("display", "none", "important");
    else siteHeader.style.removeProperty("display");
  }
  if (current.page === "home") {
    const profileIcon = document.querySelector(".header-profile-link span");
    const notifyIcon = document.querySelector(".header-notify span");
    if (profileIcon) profileIcon.innerHTML = homeReferenceIcon("profile");
    if (notifyIcon) notifyIcon.innerHTML = homeReferenceIcon("bell");
  }
  updateSeo(current);
  document.querySelectorAll("[data-nav]").forEach((node) => node.classList.toggle("active", node.dataset.nav === current.page || (node.dataset.nav === "games" && current.page === "game")));
  if (current.page === "admin") return renderAdmin();
  if (current.page === "game") { const game = gameFor(current.slug); if (game && isPublicVisibleGame(game)) { app.innerHTML = game.slug === "match-masters" ? renderMatchMasters(game) : renderGame(game); if (game.slug !== "match-masters") decorateGamePage(game); } else app.innerHTML = emptyState(copy().noGames, copy().noGamesCopy); return; }
  if (current.page === "games") { app.innerHTML = renderGames(); return; }
  if (current.page === "news") { app.innerHTML = renderPortalNews(current.slug); return; }
  if (current.page === "guides") { app.innerHTML = renderPortalGuides(current.slug); return; }
  if (current.page === "codes") { app.innerHTML = renderPortalCodes(); return; }
  if (current.page === "events") { app.innerHTML = renderPortalEvents(current.slug); return; }
  if (current.page === "event") { app.innerHTML = renderPortalEventDetail(current.gameSlug, current.eventSlug || current.slug); return; }
  if (current.page === "howTo" || current.page === "problems" || current.page === "related") { app.innerHTML = renderHelpPage(current.page, current.slug); return; }
  if (current.page === "favorites") { app.innerHTML = renderFavorites(); return; }
  if (current.page === "more") { app.innerHTML = renderPortalMore(); return; }
  if (current.page === "play") { app.innerHTML = renderQuiz(); return; }
  if (current.page === "profile") { app.innerHTML = renderProfile(); if (state.websimUserId && !state.profile && !state.profileLoading) { state.profileLoading = true; loadProfile().finally(() => { state.profileLoading = false; renderPage(); }); } return; }
  if (current.page === "ranking") { app.innerHTML = renderRanking(); if (!state.rankingLoaded && !state.rankingLoading) { state.rankingLoading = true; loadRanking().finally(() => { state.rankingLoading = false; renderPage(); }); } return; }
  if (current.page === "settings") { app.innerHTML = renderSettings(); if (state.settingsPermission === "unknown" && !state.settingsPermissionLoading) { state.settingsPermissionLoading = true; refreshSettingsPermission().finally(() => { state.settingsPermissionLoading = false; }); } return; }
  app.innerHTML = current.page === "home" ? renderImageHome() : renderPrioritizedHome();
  if (current.page === "home") {
    ensureHomeShortcutCarousel();
    setupHomeTopCarousel();
  } else stopHomeTopCarousel();
  if (current.page === "home") {
    const hero = app.querySelector(".portal-hero");
    hero?.classList.add("reference-home-hero");
    if (hero) {
      const heading = hero.querySelector("h1");
      const description = hero.querySelector(".portal-hero-copy > p");
      const kicker = hero.querySelector(".portal-kicker");
      const primary = hero.querySelector(".portal-primary-button");
      const secondary = hero.querySelector(".portal-secondary-button");
      if (kicker) kicker.textContent = "GAME GIFTS";
      if (heading) heading.innerHTML = "PRESENTES<br><em>TODO DIA</em>";
      if (description) description.textContent = "Links, códigos, eventos e muito mais!";
      if (primary) primary.innerHTML = "Explorar agora <b>→</b>";
      if (secondary) secondary.textContent = "Mais jogos";
      const visual = hero.querySelector(".portal-hero-visual");
      if (visual) visual.innerHTML = `<div class="ref-gift-scene" aria-hidden="true"><div class="ref-gift-rays"></div><div class="ref-gift-box"><span>🎮</span></div><b>MAIS JOGOS<br>MAIS PRÊMIOS<br>MAIS DIVERSÃO</b></div>`;
      hero.insertAdjacentHTML("afterend", portalQuickGrid());
      hero.nextElementSibling?.insertAdjacentHTML("afterend", portalReferenceLatest(publicGames()));
    }
  }
  app.insertAdjacentHTML("beforeend", renderDiceOverlay());
  const diceStats = app.querySelector(".home-dice-stats");
  if (diceStats) diceStats.innerHTML = `<div><small>${state.lang === "pt" ? "Giros hoje" : "Rolls today"}</small><strong data-dice-daily-progress>0/${DICE_ROLLS_PER_DAY}</strong></div><div><small>${state.lang === "pt" ? "Dias completos" : "Days complete"}</small><strong data-dice-streak>0/${DICE_CHALLENGE_DAYS}</strong></div><div><small>${state.lang === "pt" ? "Pontos do dia" : "Today's points"}</small><strong data-dice-day-points>0</strong></div>`;
  const diceHeading = app.querySelector(".home-dice-heading p");
  if (diceHeading) diceHeading.textContent = state.lang === "pt" ? "Faça 10 giros por dia durante 30 dias consecutivos. A conclusão fica registrada neste dispositivo para validação do prêmio." : "Make 10 rolls a day for 30 consecutive days. Completion is stored on this device for prize validation.";
  const diceNote = app.querySelector(".home-dice-reward-note");
  if (diceNote) diceNote.textContent = state.lang === "pt" ? "Ao completar 30 dias, o desafio fica elegível para validação manual do gift card." : "After 30 days, the challenge becomes eligible for manual gift-card validation.";
  const oldGame = app.querySelector(".home-reference-points");
  const challenge = readDiceChallenge();
  // Keep the card's existing visual affordance, but do not expose it as a
  // second interactive control around the actual dice link. Nested links
  // inside a role=button are hit-test and accessibility traps on mobile.
  oldGame?.setAttribute("data-open-dice-game", "");
  oldGame?.removeAttribute("tabindex");
  oldGame?.removeAttribute("role");
  oldGame?.removeAttribute("aria-label");
  if (oldGame) {
    const kicker = oldGame.querySelector(".home-reference-kicker");
    const heading = oldGame.querySelector("h2");
    const copy = oldGame.querySelector("p");
    const scoreBox = oldGame.querySelector(".home-reference-score");
    if (kicker) kicker.textContent = state.lang === "pt" ? "🎲 NOSSO JOGO" : "🎲 OUR GAME";
    if (heading) heading.textContent = state.lang === "pt" ? "10 GIROS POR DIA" : "10 ROLLS A DAY";
    if (copy) copy.textContent = state.lang === "pt" ? "Complete 30 dias consecutivos para ficar elegível ao gift card." : "Complete 30 consecutive days to become eligible for the gift card.";
    scoreBox?.insertAdjacentHTML("beforeend", `<span class="home-reference-challenge-progress">${challenge.streak}/${DICE_CHALLENGE_DAYS} ${state.lang === "pt" ? "dias" : "days"} · ${challenge.rollsToday}/${DICE_ROLLS_PER_DAY} ${state.lang === "pt" ? "hoje" : "today"}</span>`);
  }
  const oldGameButton = oldGame?.querySelector(".home-reference-yellow-button");
  if (oldGameButton) { oldGameButton.removeAttribute("data-route"); oldGameButton.setAttribute("href", "#home-dice-title"); oldGameButton.setAttribute("data-open-dice-game", ""); oldGameButton.innerHTML = `${state.lang === "pt" ? "JOGAR DADOS" : "PLAY DICE"} <b>›</b>`; }
  if (diceWasOpen) {
    const refreshedOverlay = app.querySelector("[data-dice-overlay]");
    if (refreshedOverlay) {
      refreshedOverlay.hidden = false;
      refreshedOverlay.classList.add("is-open");
      const refreshedRollButton = refreshedOverlay.querySelector("[data-dice-roll]");
      if (refreshedRollButton) refreshedRollButton.disabled = diceGame.rolling;
      updateDiceUi();
    }
  }
  updateScoreDisplay();
};
const resolveViewerKey = async () => {
  try {
    const user = await window.websim?.getUser?.();
    if (user?.id) { state.websimUser = user; state.websimUserId = String(user.id); state.viewerKey = `user-${user.id}`; await hydrateNoticePrefs(); return; }
    state.websimUser = null;
    state.websimUserId = "";
    state.viewerKey = localVoterId();
  } catch { state.websimUserId = ""; state.viewerKey = localVoterId(); }
};
let refreshInFlight = null;
let publicDataCache = null;
let publicDataCachedAt = 0;
const PUBLIC_DATA_CACHE_MS = 30000;
let initialCollectionRefreshPending = true;
const refresh = (force = false) => {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      await resolveViewerKey();
      state.data = await loadPublicData(force);
      syncLocalNoticeAlerts(state.data);
      renderPage();
      const incomingAlert = new URLSearchParams(location.search).get("gg-alert-reward");
      if (incomingAlert && openRewardAlert(incomingAlert)) history.replaceState({}, "", `${location.pathname}${location.hash}`);
      if (initialCollectionRefreshPending) {
        initialCollectionRefreshPending = false;
        window.setTimeout(() => refresh(true), 3500);
      }
    }
    catch (error) {
      if (isGitHubPagesDeployment()) {
        console.error("Game Gifts: não foi possível carregar o snapshot público de dados.", error);
        app.innerHTML = emptyState("Não foi possível carregar", error.message, "!");
        return;
      }
      try {
        const liveRewards = await api("/api/data/rewards.json");
        state.data = recoverGameCatalog({ ...state.data, rewards: liveRewards.rewards || [] });
        syncLocalNoticeAlerts(state.data);
        console.warn("Game Gifts: /api/data falhou; usando o feed JSON vivo de recompensas.", error);
      } catch (fallbackError) {
        try {
          const staticResponse = await fetch(assetUrl("/data/rewards.json"), { cache: "no-store" });
          const staticFeed = await staticResponse.json();
          state.data = recoverGameCatalog({ ...state.data, rewards: staticFeed.rewards || [] });
          syncLocalNoticeAlerts(state.data);
          console.warn("Game Gifts: usando o snapshot estático do monitor enquanto os dados online não estão disponíveis.", fallbackError);
        } catch (staticError) {
          state.data = recoverGameCatalog(state.data);
          syncLocalNoticeAlerts(state.data);
          console.warn("Game Gifts: usando o catálogo local existente enquanto os dados online não estão disponíveis.", staticError);
        }
      }
      renderPage();
    }
    finally { refreshInFlight = null; }
  })();
  return refreshInFlight;
};
const toast = (message) => { const node = document.querySelector("#toast"); node.textContent = message; node.classList.add("show"); clearTimeout(window.__ggToast); window.__ggToast = setTimeout(() => node.classList.remove("show"), 2600); };
const codeCopiedLabel = () => state.lang === "pt" ? "✓ Código copiado" : state.lang === "en" ? "✓ Code copied" : state.lang === "es" ? "✓ Código copiado" : state.lang === "de" ? "✓ Code kopiert" : "✓ Kod kopyalandı";
const uploadIfPresent = async (input) => { const file = input?.files?.[0]; if (!file) return ""; if (!window.websim?.upload) throw new Error("Upload indisponível neste ambiente. Use uma URL pública."); return await window.websim.upload(file); };
const copyRewardLink = async (url, message = copy().copied) => {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url);
    else throw new Error("Clipboard API unavailable");
  } catch {
    const helper = document.createElement("textarea");
    helper.value = url;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  toast(message);
};
const submitRewardVote = async (button) => {
  const rewardId = button.dataset.rewardId;
  const confirmation = button.closest("[data-reward-confirmation]");
  const buttons = confirmation ? [...confirmation.querySelectorAll("[data-reward-vote]")] : [button];
  buttons.forEach((item) => { item.disabled = true; item.setAttribute("aria-busy", "true"); });
  try {
    const result = await api(`/api/rewards/${encodeURIComponent(rewardId)}/vote`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ vote: button.dataset.rewardVote }),
    });
    const reward = state.data.rewards.find((item) => String(item.id) === String(rewardId));
    if (reward && result.confirmation) {
      const gameId = Number(reward.game_id);
      state.data.rewards.forEach((item) => {
        if (Number(item.game_id) === gameId) item.confirmation = { ...(item.confirmation || {}), game_my_vote: result.confirmation.game_my_vote || result.confirmation.my_vote || button.dataset.rewardVote };
      });
      reward.confirmation = result.confirmation;
    }
    toast(copy().voteSaved);
    renderPage();
  } catch (error) {
    if (error.code === "already_voted_game") {
      await refresh();
      toast(error.message);
      return;
    }
    buttons.forEach((item) => { item.disabled = false; item.removeAttribute("aria-busy"); });
    toast(error.message);
  }
};

document.addEventListener("click", async (event) => {
  const clickTarget = event.target instanceof Element ? event.target : event.target?.parentElement;
  if (!clickTarget) return;
  const alertLink = clickTarget.closest("[data-notice-alert]");
  if (alertLink) { event.preventDefault(); openRewardAlert(alertLink.dataset.noticeAlert); return; }
  const shortcutArrow = event.target.closest("[data-home-shortcuts-arrow]");
  if (shortcutArrow) {
    event.preventDefault();
    const nav = shortcutArrow.closest(".home-reference-shortcuts-six, .home-reference-shortcuts-five");
    if (nav) {
      const maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth);
      const atEnd = nav.scrollLeft >= maxScroll - 4;
      nav.scrollTo({ left: atEnd ? 0 : Math.min(maxScroll, nav.scrollLeft + nav.clientWidth * 0.8), behavior: "smooth" });
    }
    return;
  }
  const topCarouselArrow = event.target.closest("[data-home-top-carousel-arrow]");
  if (topCarouselArrow) {
    event.preventDefault();
    stopHomeTopCarousel();
    homeTopCarouselMove(topCarouselArrow.dataset.homeTopCarouselArrow === "left" ? -1 : 1);
    window.setTimeout(setupHomeTopCarousel, 3600);
    return;
  }
  if (event.target.closest("[data-open-home-image-menu]")) { event.preventDefault(); openDrawer(); return; }
  if (event.target.closest("[data-open-drawer]")) { event.preventDefault(); openDrawer(); return; }
  if (event.target.closest("[data-close-drawer]")) { event.preventDefault(); closeDrawer(); return; }
  const backButton = event.target.closest("[data-go-back]");
  if (backButton) { event.preventDefault(); goBack(backButton.dataset.goBack || pathFor("home")); return; }
  const voteButton = event.target.closest("[data-reward-vote]");
  if (voteButton) { event.preventDefault(); await submitRewardVote(voteButton); return; }
  const diceClose = event.target.closest("[data-close-dice]");
  if (diceClose) { event.preventDefault(); closeDiceGame(); return; }
  const diceLauncher = event.target.closest("[data-open-dice-game]");
  if (diceLauncher) { event.preventDefault(); openDiceGame(); return; }
  const diceButton = event.target.closest("[data-dice-roll]");
  if (diceButton) { event.preventDefault(); rollDice(diceButton); return; }
  const quizOption = event.target.closest("[data-quiz-option]");
  if (quizOption) { event.preventDefault(); handleQuizOption(quizOption.dataset.quizOption); return; }
  const quizNext = event.target.closest("[data-quiz-next]");
  if (quizNext) { event.preventDefault(); await handleQuizNext(); return; }
  const quizRestart = event.target.closest("[data-quiz-restart]");
  if (quizRestart) { event.preventDefault(); state.quiz = quizFreshState(); renderPage(); return; }
  const rankingPeriod = event.target.closest("[data-ranking-period]");
  if (rankingPeriod) { event.preventDefault(); state.rankingPeriod = rankingPeriod.dataset.rankingPeriod || "daily"; state.ranking = []; state.rankingLoaded = false; renderPage(); return; }
  const gameCardLink = event.target.closest("a.game-card");
  if (gameCardLink) {
    trackEvent("game_click", { game_name: gameCardLink.dataset.analyticsGameName, game_slug: gameCardLink.dataset.analyticsGameSlug });
    event.preventDefault(); go(gameCardLink.getAttribute("href")); return;
  }
  const favorite = event.target.closest("[data-favorite-type]");
  if (favorite) { event.preventDefault(); toggleFavorite(favorite.dataset.favoriteType, favorite.dataset.favoriteId); return; }
  const routeLink = event.target.closest("a[data-route]");
  if (routeLink) { event.preventDefault(); go(routeLink.getAttribute("href")); return; }
  const homeRewardCard = event.target.closest(".home-premium-reward-card[data-home-reward-url]");
  if (homeRewardCard && !event.target.closest("a,button")) {
    const rewardUrl = homeRewardCard.dataset.homeRewardUrl;
    const rewardId = homeRewardCard.dataset.homeRewardId;
    const rewardOpener = homeRewardCard.querySelector("[data-open-reward]");
    trackEvent("gift_open", { game_name: rewardOpener?.dataset.analyticsGameName, gift_name: rewardOpener?.dataset.analyticsGiftName, reward_id: rewardId });
    markOpened(rewardId);
    if (awardScore(rewardId)) toast(`+${SCORE_PER_REWARD} pontos`);
    const openedWindow = window.open(rewardUrl, "_blank", "noopener,noreferrer");
    if (!openedWindow) window.location.assign(rewardUrl);
    setTimeout(() => renderPage(), 0);
    return;
  }
  const matchMastersCard = event.target.closest(".mm-link-card[data-mm-card-open]");
  if (matchMastersCard && !event.target.closest("a,button")) {
    const rewardUrl = matchMastersCard.dataset.mmCardOpen;
    const rewardId = matchMastersCard.dataset.mmCardId;
    trackEvent("gift_open", { game_name: matchMastersCard.dataset.mmCardGame, gift_name: matchMastersCard.dataset.mmCardName, reward_id: rewardId });
    markOpened(rewardId);
    if (awardScore(rewardId)) toast(`+${SCORE_PER_REWARD} pontos`);
    const openedWindow = window.open(rewardUrl, "_blank", "noopener,noreferrer");
    if (!openedWindow) window.location.assign(rewardUrl);
    setTimeout(() => renderPage(), 0);
    return;
  }
  const copyButton = event.target.closest("[data-copy-url]");
  if (copyButton) {
    trackEvent("copy_link", { game_name: copyButton.dataset.analyticsGameName, gift_name: copyButton.dataset.analyticsGiftName, reward_id: copyButton.dataset.analyticsRewardId });
    await copyRewardLink(copyButton.dataset.copyUrl); return;
  }
  const copyCode = event.target.closest("[data-copy-code]");
  if (copyCode) { await copyRewardLink(copyCode.dataset.copyCode, codeCopiedLabel()); return; }
  const settingsPermissionButton = event.target.closest("[data-settings-permission]");
  if (settingsPermissionButton) { event.preventDefault(); await askSettingsPermission(); return; }
  const settingsCheckButton = event.target.closest("[data-settings-check]");
  if (settingsCheckButton) { event.preventDefault(); state.settingsMessage = ""; await refreshSettingsPermission(); return; }
  const settingsTestButton = event.target.closest("[data-settings-test]");
  if (settingsTestButton) { event.preventDefault(); await sendSettingsTestNotification(); return; }
  const settingsChannel = event.target.closest("[data-settings-channel]");
  if (settingsChannel) { event.preventDefault(); const prefs = noticePrefs(); const key = settingsChannel.dataset.settingsChannel; prefs.channels[key] = !Boolean(prefs.channels[key]); saveNoticePrefs(prefs); renderPage(); return; }
  const settingsPreference = event.target.closest("[data-settings-preference]");
  if (settingsPreference) { event.preventDefault(); const prefs = noticePrefs(); const key = settingsPreference.dataset.settingsPreference; prefs[key] = !Boolean(prefs[key]); saveNoticePrefs(prefs); renderPage(); return; }
  const noticeToggle = event.target.closest("[data-notice-toggle]");
  if (noticeToggle) { toggleNotice(noticeToggle.dataset.noticeToggle); return; }
  const noticeAll = event.target.closest("[data-notice-all]");
  if (noticeAll) { saveNoticePrefs({ games: publicGames().map((game) => String(game.slug)) }); renderPage(); requestNoticePermission(); return; }
  const opener = event.target.closest("[data-open-reward]");
  if (opener) {
    trackEvent("gift_open", { game_name: opener.dataset.analyticsGameName, gift_name: opener.dataset.analyticsGiftName, reward_id: opener.dataset.analyticsRewardId });
    markOpened(opener.dataset.openReward);
    if (awardScore(opener.dataset.openReward)) toast(`+${SCORE_PER_REWARD} pontos`);
    setTimeout(() => renderPage(), 0); return;
  }
  const redeemer = event.target.closest("[data-redeem-reward]");
  if (redeemer) {
    trackEvent("gift_redeem", { game_name: redeemer.dataset.analyticsGameName, gift_name: redeemer.dataset.analyticsGiftName, reward_id: redeemer.dataset.analyticsRewardId });
    if (awardScore(redeemer.dataset.redeemReward)) toast(`+${SCORE_PER_REWARD} pontos`);
    return;
  }
  const claimed = event.target.closest("[data-mark-claimed]");
  if (claimed) { markClaimed(claimed.dataset.markClaimed); toast(claimedLabel()); renderPage(); return; }
  const rewardsSectionLink = event.target.closest('a.game-primary-link[href="#game-rewards"]');
  if (rewardsSectionLink) {
    state.gameSection = "rewards";
    document.querySelectorAll(".game-primary-link").forEach((item) => { item.classList.toggle("is-active", item === rewardsSectionLink); item.toggleAttribute("aria-current", item === rewardsSectionLink); });
    return;
  }
  const centralTab = event.target.closest("[data-central-tab]");
  if (centralTab) { state.centralTab = centralTab.dataset.centralTab; state.gameSection = centralTab.dataset.centralTab; renderPage(); requestAnimationFrame(() => document.querySelector("#game-central")?.scrollIntoView({ behavior: "smooth", block: "start" })); return; }
  const homeSort = event.target.closest("[data-home-sort]");
  if (homeSort) { state.homeSort = homeSort.dataset.homeSort || "all"; renderPage(); return; }
  const tab = event.target.closest("[data-tab]");
  if (tab) { state.tab = tab.dataset.tab; state.gameSection = "rewards"; state.selectedDate = ""; renderPage(); return; }
  const date = event.target.closest("[data-date]");
  if (date) { state.selectedDate = date.dataset.date; renderPage(); return; }
  if (event.target.closest("[data-admin-cancel-edit]")) { state.editGameId = null; renderAdmin(); return; }
  if (event.target.closest("[data-admin-cancel-source-edit]")) { state.editSourceId = null; renderAdmin(); return; }
  const edit = event.target.closest("[data-admin-edit-game]");
  if (edit) { state.editGameId = edit.dataset.adminEditGame; renderAdmin(); return; }
  const sourceEdit = event.target.closest("[data-admin-edit-source]");
  if (sourceEdit) { state.editSourceId = sourceEdit.dataset.adminEditSource; renderAdmin(); return; }
  const collectEvents = event.target.closest("[data-admin-collect-events]");
  if (collectEvents) { collectEvents.disabled = true; collectEvents.textContent = "ATUALIZANDO…"; try { const result = await api("/api/admin/events/collect", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }); toast(`${result.published_count || 0} evento(s) novo(s), ${result.updated_count || 0} atualizado(s).`); await renderAdmin(); } catch (error) { toast(error.message); collectEvents.disabled = false; collectEvents.textContent = "ATUALIZAR EVENTOS"; } return; }
  const collect = event.target.closest("[data-admin-collect]");
  if (collect) { collect.disabled = true; collect.setAttribute("aria-busy", "true"); collect.textContent = "COLETANDO…"; try { state.collectionResult = await api("/api/admin/collect", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }); toast(`${state.collectionResult.new_links_saved} novo(s), ${state.collectionResult.duplicates_ignored} duplicado(s).`); await renderAdmin(); } catch (error) { toast(error.message); collect.disabled = false; collect.removeAttribute("aria-busy"); collect.textContent = "BUSCAR AGORA"; } return; }
  const active = event.target.closest("[data-admin-game-active]");
  if (active) { try { await api(`/api/admin/games/${active.dataset.adminGameActive}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ active: active.dataset.active !== "true" }) }); toast("Status do jogo atualizado."); renderAdmin(); } catch (error) { toast(error.message); } return; }
  const sourceActive = event.target.closest("[data-admin-source-active]");
  if (sourceActive) { try { await api(`/api/admin/sources/${sourceActive.dataset.adminSourceActive}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ active: sourceActive.dataset.active !== "true" }) }); toast("Status da fonte atualizado."); renderAdmin(); } catch (error) { toast(error.message); } return; }
  const testSource = event.target.closest("[data-admin-test-source]");
  if (testSource) { try { state.collectionResult = await api(`/api/admin/sources/${testSource.dataset.adminTestSource}/test`, { method: "POST" }); toast(state.collectionResult.error ? "A fonte retornou um erro." : "Fonte consultada."); renderAdmin(); } catch (error) { toast(error.message); } return; }
  const deleteSource = event.target.closest("[data-admin-delete-source]");
  if (deleteSource) { if (!confirm("Excluir esta fonte? Os rewards já coletados serão preservados.")) return; try { await api(`/api/admin/sources/${deleteSource.dataset.adminDeleteSource}`, { method: "DELETE" }); toast("Fonte excluída."); renderAdmin(); } catch (error) { toast(error.message); } return; }
  const remove = event.target.closest("[data-admin-delete-reward]");
  if (remove) { if (!confirm("Excluir este presente?")) return; try { await api(`/api/admin/rewards/${remove.dataset.adminDeleteReward}`, { method: "DELETE" }); toast("Presente excluído."); renderAdmin(); } catch (error) { toast(error.message); } }
});
document.addEventListener("change", async (event) => {
  if (event.target.matches("#language-select")) { try { localStorage.setItem("game-gifts-language", event.target.value); } catch {} const current = route(); const slug = ["game", "news", "guides"].includes(current.page) ? current.slug : ""; const destination = current.page === "game" ? pathFor("games", slug, event.target.value) : pathFor(current.page, slug, event.target.value); go(destination); return; }
  if (event.target.matches("[data-admin-reward-status]")) { try { await api(`/api/admin/rewards/${event.target.dataset.adminRewardStatus}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: event.target.value }) }); toast("Status do presente atualizado."); } catch (error) { toast(error.message); } }
});
document.addEventListener("submit", async (event) => {
  if (event.target.matches("#game-form")) { event.preventDefault(); const form = new FormData(event.target); const body = Object.fromEntries(form.entries()); body.active = form.get("active") === "on"; try { const id = event.target.dataset.editGameId; await api(id ? `/api/admin/games/${id}` : "/api/admin/games", { method: id ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); state.editGameId = null; toast("Jogo salvo."); await refresh(); renderAdmin(); } catch (error) { toast(error.message); } return; }
  if (event.target.matches("#source-form")) { event.preventDefault(); const form = new FormData(event.target); const body = Object.fromEntries(form.entries()); body.active = form.get("active") === "on"; try { const id = event.target.dataset.editSourceId; await api(id ? `/api/admin/sources/${id}` : "/api/admin/sources", { method: id ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); state.editSourceId = null; state.collectionResult = null; toast("Fonte salva."); renderAdmin(); } catch (error) { toast(error.message); } return; }
  if (event.target.matches("#event-source-form")) { event.preventDefault(); const form = new FormData(event.target); const body = Object.fromEntries(form.entries()); body.active = form.get("active") === "on"; try { await api("/api/admin/event-sources", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); toast("Fonte de eventos adicionada."); await renderAdmin(); } catch (error) { toast(error.message); } return; }
  if (event.target.matches("#reward-form")) { event.preventDefault(); const form = new FormData(event.target); let image = String(form.get("image") || ""); try { if (!image) image = await uploadIfPresent(event.target.querySelector('[name="image_file"]')); const body = Object.fromEntries(form.entries()); delete body.image_file; body.image = image; await api("/api/admin/rewards", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); toast("Presente publicado."); await refresh(); renderAdmin(); } catch (error) { toast(error.message); } }
});
let searchTrackingTimer;
document.querySelector("#global-search")?.addEventListener("input", (event) => {
  state.search = event.target.value;
  const current = route();
  if (current.page !== "admin" && current.page !== "game") renderPage();
  clearTimeout(searchTrackingTimer);
  const searchTerm = event.target.value.trim();
  if (searchTerm) searchTrackingTimer = setTimeout(() => trackEvent("search", { search_term: searchTerm, game_name: searchTerm }), 500);
});
window.addEventListener("popstate", () => { if (!state.backRequested && state.navigationStack.length) state.navigationStack.pop(); state.backRequested = false; closeDrawer(); const current = route(); state.lang = current.lang; renderPage(); });
window.addEventListener("pageshow", () => { if (route().page === "game") renderPage(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closeDrawer(); closeDiceGame(); } if (event.key === "Enter" && event.target.closest("[data-open-dice-game]")) { event.preventDefault(); openDiceGame(); } const matchMastersCard = event.target.closest?.(".mm-link-card[data-mm-card-open]"); if (matchMastersCard && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); matchMastersCard.click(); } });
document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
if (document.querySelector("#language-select")) document.querySelector("#language-select").value = state.lang;
updateScoreDisplay();
// Paint the preserved local catalog immediately, then hydrate with the API or
// the real rewards snapshot. This keeps the portal usable during slow starts.
state.data = recoverGameCatalog(state.data);
renderPage();
refresh();
const AUTO_REFRESH_MS = 5 * 60 * 1000;
window.setInterval(() => { if (!document.hidden) refresh(); }, AUTO_REFRESH_MS);
