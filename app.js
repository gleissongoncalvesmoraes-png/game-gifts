import { identifyMatchMastersReward } from "./match-masters-identification.js";

const LANGS = ["pt", "en", "es", "de", "tr"];
const SECTION_NAMES = {
  pt: { games: "jogos", news: "novidades", favorites: "favoritos", more: "mais", admin: "admin" },
  en: { games: "games", news: "news", favorites: "favorites", more: "more", admin: "admin" },
  es: { games: "juegos", news: "novedades", favorites: "favoritos", more: "mas", admin: "admin" },
  de: { games: "spiele", news: "neuigkeiten", favorites: "favoriten", more: "mehr", admin: "admin" },
  tr: { games: "oyunlar", news: "yenilikler", favorites: "favoriler", more: "daha-fazla", admin: "admin" },
};
const GAME_SEO = Object.freeze({
  "match-masters": {
    path: "/match-masters-free-gifts/",
    pt: { title: "Presentes Grátis Match Masters Hoje | Game Gifts", h1: "Match Masters: presentes grátis de hoje", description: "Confira presentes públicos do Match Masters organizados por data, com status claro de confirmação, verificação, resgate e expiração.", intro: "Links públicos de presentes do Match Masters organizados pela data publicada na fonte, sem transformar uma URL reencontrada em um presente novo." },
    en: { title: "Match Masters Free Gifts Today | Game Gifts", h1: "Match Masters Free Gifts Today", description: "Find public Match Masters gifts organized by source date, with clear confirmed, in verification, claimed and expired statuses.", intro: "Public Match Masters gift links organized by the date published in the source, so a rediscovered URL is not presented as a new gift." },
    es: { title: "Regalos Gratis Match Masters Hoy | Game Gifts", h1: "Regalos gratis de Match Masters hoy", description: "Consulta regalos públicos de Match Masters por fecha de la fuente, con estados claros de confirmación, verificación, reclamación y caducidad.", intro: "Enlaces públicos de regalos de Match Masters ordenados por la fecha publicada en la fuente." },
    de: { title: "Match Masters Gratisgeschenke Heute | Game Gifts", h1: "Match Masters Gratisgeschenke heute", description: "Öffentliche Match-Masters-Geschenke nach dem Quelldatum, mit klaren Status für bestätigt, Prüfung, eingelöst und abgelaufen.", intro: "Öffentliche Match-Masters-Geschenklinks nach dem Veröffentlichungsdatum der Quelle." },
    tr: { title: "Match Masters Ücretsiz Hediyeler Bugün | Game Gifts", h1: "Match Masters bugün ücretsiz hediyeler", description: "Match Masters herkese açık hediyelerini kaynak tarihine göre görün; doğrulandı, incelemede, alındı ve süresi doldu durumları açıkça ayrılır.", intro: "Kaynakta yayınlanan tarihe göre düzenlenmiş herkese açık Match Masters hediye bağlantıları." },
  },
  "dice-dreams": {
    path: "/dice-dreams-free-rolls/",
    pt: { title: "Rolls Grátis Dice Dreams Hoje | Game Gifts", h1: "Dice Dreams: rolls grátis de hoje", description: "Veja rolls públicos do Dice Dreams organizados por data, com confirmação honesta e estado individual de já resgatado.", intro: "Rolls públicos do Dice Dreams organizados por data, mantendo links não confirmados acessíveis sem chamá-los de garantidos." },
    en: { title: "Dice Dreams Free Rolls Today | Game Gifts", h1: "Dice Dreams Free Rolls Today", description: "Find public Dice Dreams rolls organized by date, with honest confirmation and an individual already-claimed state.", intro: "Public Dice Dreams rolls organized by date, keeping unconfirmed links accessible without calling them guaranteed." },
    es: { title: "Tiradas Gratis Dice Dreams Hoy | Game Gifts", h1: "Tiradas gratis de Dice Dreams hoy", description: "Encuentra tiradas públicas de Dice Dreams por fecha, con confirmación honesta y estado individual de ya reclamado.", intro: "Tiradas públicas de Dice Dreams organizadas por fecha, sin presentar como garantizados los enlaces no confirmados." },
    de: { title: "Dice Dreams Freispiele Heute | Game Gifts", h1: "Dice Dreams Freispiele heute", description: "Finde öffentliche Dice-Dreams-Würfe nach Datum, mit ehrlicher Bestätigung und individuellem Status für eingelöst.", intro: "Öffentliche Dice-Dreams-Würfe nach Datum, ohne unbestätigte Links als garantiert auszugeben." },
    tr: { title: "Dice Dreams Ücretsiz Atışlar Bugün | Game Gifts", h1: "Dice Dreams bugün ücretsiz atışlar", description: "Dice Dreams herkese açık atışlarını tarihe göre görün; doğrulama ve kişisel alındı durumu açıkça ayrılır.", intro: "Tarihe göre düzenlenmiş herkese açık Dice Dreams atışları; doğrulanmamış bağlantılar garanti olarak sunulmaz." },
  },
  "coin-master": {
    path: "/coin-master-free-spins/",
    pt: { title: "Spins Grátis Coin Master Hoje | Game Gifts", h1: "Coin Master: spins grátis de hoje", description: "Confira spins públicos do Coin Master por data, distinguindo recompensas confirmadas, em verificação, expiradas e já resgatadas.", intro: "Spins públicos do Coin Master organizados por data, com ofertas expiradas fora da lista disponível e novos links em verificação." },
    en: { title: "Coin Master Free Spins Today | Game Gifts", h1: "Coin Master Free Spins Today", description: "Find public Coin Master spins by date, distinguishing confirmed, in verification, expired and individually claimed rewards.", intro: "Public Coin Master spins organized by date, with expired offers removed from available gifts and new links kept in verification." },
    es: { title: "Giros Gratis Coin Master Hoy | Game Gifts", h1: "Giros gratis de Coin Master hoy", description: "Consulta giros públicos de Coin Master por fecha, diferenciando recompensas confirmadas, en verificación, caducadas y reclamadas.", intro: "Giros públicos de Coin Master ordenados por fecha, con ofertas caducadas fuera de los regalos disponibles." },
    de: { title: "Coin Master Freispiele Heute | Game Gifts", h1: "Coin Master Freispiele heute", description: "Finde öffentliche Coin-Master-Spins nach Datum, getrennt nach bestätigt, Prüfung, abgelaufen und individuell eingelöst.", intro: "Öffentliche Coin-Master-Spins nach Datum; abgelaufene Angebote erscheinen nicht als verfügbar." },
    tr: { title: "Coin Master Ücretsiz Çevirme Bugün | Game Gifts", h1: "Coin Master bugün ücretsiz çevirme", description: "Coin Master herkese açık çevirmelerini tarihe göre görün; doğrulanmış, incelemede, süresi dolmuş ve alınmış durumları ayrıdır.", intro: "Tarihe göre düzenlenmiş Coin Master çevirmeleri; süresi dolan teklifler kullanılabilir hediye olarak gösterilmez." },
  },
  "travel-town": {
    path: "/travel-town-free-energy/",
    pt: { title: "Travel Town Free Energy Today – Links de Energia Grátis", h1: "Travel Town: energia grátis hoje", description: "Encontre links públicos de energia grátis do Travel Town, organizados por data, com deep links oficiais e status de confirmação honesto.", intro: "Links recentes de energia do Travel Town, convertidos para o deep link oficial quando o destino é reconhecido." },
    en: { title: "Travel Town Free Energy Today | Game Gifts", h1: "Travel Town Free Energy Today", description: "Find public Travel Town free energy links organized by date, with official deep links and honest confirmation status.", intro: "Recent Travel Town energy links, converted to the official deep link when the destination is recognized." },
    es: { title: "Energía Gratis Travel Town Hoy | Game Gifts", h1: "Energía gratis de Travel Town hoy", description: "Encuentra enlaces públicos de energía gratis de Travel Town organizados por fecha, con deep links oficiales y estado honesto.", intro: "Enlaces recientes de energía de Travel Town convertidos al deep link oficial cuando se reconoce el destino." },
    de: { title: "Travel Town Gratis-Energie Heute | Game Gifts", h1: "Travel Town Gratis-Energie heute", description: "Finde öffentliche Travel-Town-Energielinks nach Datum, mit offiziellen Deep Links und ehrlichem Bestätigungsstatus.", intro: "Aktuelle Travel-Town-Energielinks, zum offiziellen Deep Link umgewandelt, wenn das Ziel erkannt wird." },
    tr: { title: "Travel Town Ücretsiz Enerji Bugün | Game Gifts", h1: "Travel Town bugün ücretsiz enerji", description: "Travel Town ücretsiz enerji bağlantılarını tarihe göre bulun; resmi deep linkler ve dürüst doğrulama durumu gösterilir.", intro: "Hedef tanındığında resmi deep linke dönüştürülen güncel Travel Town enerji bağlantıları." },
  },
});
const GAME_SEO_PATHS = Object.freeze(Object.fromEntries(Object.entries(GAME_SEO).map(([slug, seo]) => [seo.path, slug])));
const COPY = {
  pt: { home: "Início", games: "Jogos", news: "Novidades", favorites: "Favoritos", more: "Mais", search: "Pesquisar jogos...", choose: "Escolha seu jogo", chooseCopy: "Encontre os links públicos verificados dos seus jogos mobile.", active: "links ativos", newToday: "novo hoje", noneToday: "Nenhum novo hoje", viewGames: "Ver jogos", today: "Presentes de hoje", recent: "Últimos dias", opened: "Já abertos", expired: "Expirados", confirmed: "CONFIRMADO", unconfirmed: "NÃO CONFIRMADO", expiredInvalid: "EXPIRADO / INVÁLIDO", unconfirmedReward: "Recompensa ainda não confirmada", unavailableReward: "Recompensa indisponível", verified: "Verificado", expiredStatus: "Expirado", pending: "Aguardando verificação", open: "ABRIR NO JOGO", openAgain: "ABRIR NOVAMENTE", copyLink: "Copiar link", alreadyOpened: "JÁ ABERTO", copied: "Link copiado", favorite: "Favoritar", unfavorite: "Remover dos favoritos", noRewards: "Nenhum presente verificado por aqui", noRewardsCopy: "Quando um link legítimo for cadastrado e verificado, ele aparecerá nesta área.", noGames: "Nenhum jogo encontrado", noGamesCopy: "Tente buscar por outro nome.", allNews: "Novidades", newsCopy: "Links verificados adicionados recentemente em todos os jogos.", noNews: "Nenhuma novidade ainda", noNewsCopy: "Os links novos aparecem aqui assim que forem cadastrados e verificados.", about: "Mais sobre o Game Gifts", aboutCopy: "Um portal independente que organiza links públicos de presentes e recompensas. O site não entrega recompensas e não pede login para abrir um link.", how: "Como funciona", howItems: ["Escolha um jogo", "Confira o presente verificado", "Toque em Abrir no jogo"], admin: "Admin central", adminCopy: "Área reservada ao proprietário do projeto para cadastrar jogos e links.", faq: "Sobre e FAQ", disclaimer: "Site independente de agregação de links. As marcas e jogos pertencem aos seus respectivos proprietários. Não somos afiliados aos desenvolvedores dos jogos.", allGames: "Todos os jogos", lastAdded: "Adicionado", dateLinks: "links", selectDate: "Escolha uma data para ver os presentes.", backHistory: "Voltar ao histórico", noOpened: "Você ainda não abriu presentes", noOpenedCopy: "Os links que você abrir neste dispositivo aparecerão aqui." },
  en: { home: "Home", games: "Games", news: "News", favorites: "Favorites", more: "More", search: "Search games...", choose: "Choose your game", chooseCopy: "Find verified public links for your favorite mobile games.", active: "active links", newToday: "new today", noneToday: "None new today", viewGames: "View games", today: "Today's gifts", recent: "Last days", opened: "Opened", expired: "Expired", confirmed: "CONFIRMED", unconfirmed: "NOT CONFIRMED", expiredInvalid: "EXPIRED / INVALID", unconfirmedReward: "Reward not confirmed", unavailableReward: "Reward unavailable", verified: "Verified", expiredStatus: "Expired", pending: "Awaiting verification", open: "OPEN IN GAME", openAgain: "OPEN AGAIN", copyLink: "Copy link", alreadyOpened: "ALREADY OPENED", copied: "Link copied", favorite: "Favorite", unfavorite: "Remove favorite", noRewards: "No verified gifts here", noRewardsCopy: "When a legitimate link is added and verified, it will appear here.", noGames: "No games found", noGamesCopy: "Try another search.", allNews: "News", newsCopy: "Recently added verified links across all games.", noNews: "No news yet", noNewsCopy: "New links appear here after they are added and verified.", about: "About Game Gifts", aboutCopy: "An independent portal that organizes public gift and reward links. The site does not deliver rewards and never requires a login to open a link.", how: "How it works", howItems: ["Choose a game", "Check the verified gift", "Tap Open in game"], admin: "Central admin", adminCopy: "Reserved for the project owner to manage games and links.", faq: "About & FAQ", disclaimer: "Independent link aggregation site. All brands and games belong to their respective owners. We are not affiliated with game developers.", allGames: "All games", lastAdded: "Added", dateLinks: "links", selectDate: "Choose a date to see its gifts.", backHistory: "Back to history", noOpened: "No gifts opened yet", noOpenedCopy: "Links you open on this device will appear here." },
  de: { home: "Start", games: "Spiele", news: "Neuigkeiten", favorites: "Favoriten", more: "Mehr", search: "Spiele suchen...", choose: "Spiel auswählen", chooseCopy: "Finde verifizierte öffentliche Links für deine Mobile Games.", active: "aktive Links", newToday: "neu heute", noneToday: "Heute nichts Neues", viewGames: "Spiele ansehen", today: "Geschenke heute", recent: "Letzte Tage", opened: "Geöffnet", expired: "Abgelaufen", confirmed: "BESTÄTIGT", unconfirmed: "NICHT BESTÄTIGT", expiredInvalid: "ABGELAUFEN / UNGÜLTIG", unconfirmedReward: "Belohnung nicht bestätigt", unavailableReward: "Belohnung nicht verfügbar", verified: "Verifiziert", expiredStatus: "Abgelaufen", pending: "Überprüfung ausstehend", open: "IM SPIEL ÖFFNEN", openAgain: "ERNEUT ÖFFNEN", copyLink: "Link kopieren", alreadyOpened: "BEREITS GEÖFFNET", copied: "Link kopiert", favorite: "Favorisieren", unfavorite: "Favorit entfernen", noRewards: "Keine verifizierten Geschenke", noRewardsCopy: "Verifizierte, legitime Links erscheinen hier nach ihrer Veröffentlichung.", noGames: "Keine Spiele gefunden", noGamesCopy: "Versuche einen anderen Namen.", allNews: "Neuigkeiten", newsCopy: "Kürzlich hinzugefügte verifizierte Links aus allen Spielen.", noNews: "Noch keine Neuigkeiten", noNewsCopy: "Neue Links erscheinen hier nach der Prüfung.", about: "Über Game Gifts", aboutCopy: "Ein unabhängiges Portal für öffentliche Geschenk- und Belohnungslinks. Die Seite liefert keine Belohnungen und benötigt zum Öffnen keinen Login.", how: "So funktioniert es", howItems: ["Spiel auswählen", "Verifiziertes Geschenk prüfen", "Im Spiel öffnen antippen"], admin: "Zentrale Verwaltung", adminCopy: "Für den Projektinhaber zum Verwalten von Spielen und Links.", faq: "Über & FAQ", disclaimer: "Unabhängiges Portal zur Sammlung von Links. Marken und Spiele gehören ihren jeweiligen Eigentümern. Keine Verbindung zu Spieleentwicklern.", allGames: "Alle Spiele", lastAdded: "Hinzugefügt", dateLinks: "Links", selectDate: "Wähle ein Datum, um die Geschenke zu sehen.", backHistory: "Zurück zum Verlauf", noOpened: "Noch keine Geschenke geöffnet", noOpenedCopy: "Auf diesem Gerät geöffnete Links erscheinen hier." },
  tr: { home: "Ana Sayfa", games: "Oyunlar", news: "Yenilikler", favorites: "Favoriler", more: "Daha fazla", search: "Oyun ara...", choose: "Oyununuzu seçin", chooseCopy: "Favori mobil oyunlarınız için doğrulanmış herkese açık bağlantılar.", active: "aktif bağlantı", newToday: "bugün yeni", noneToday: "Bugün yeni yok", viewGames: "Oyunları gör", today: "Bugünün hediyeleri", recent: "Son günler", opened: "Açılanlar", expired: "Süresi dolanlar", confirmed: "DOĞRULANDI", unconfirmed: "DOĞRULANMADI", expiredInvalid: "SÜRESİ DOLDU / GEÇERSİZ", unconfirmedReward: "Ödül doğrulanmadı", unavailableReward: "Ödül mevcut değil", verified: "Doğrulandı", expiredStatus: "Süresi doldu", pending: "Doğrulama bekliyor", open: "OYUNDA AÇ", openAgain: "TEKRAR AÇ", copyLink: "Bağlantıyı kopyala", alreadyOpened: "ZATEN AÇILDI", copied: "Bağlantı kopyalandı", favorite: "Favorile", unfavorite: "Favoriden çıkar", noRewards: "Doğrulanmış hediye yok", noRewardsCopy: "Meşru bir bağlantı eklenip doğrulandığında burada görünür.", noGames: "Oyun bulunamadı", noGamesCopy: "Başka bir ad deneyin.", allNews: "Yenilikler", newsCopy: "Tüm oyunlarda yakın zamanda eklenen doğrulanmış bağlantılar.", noNews: "Henüz yenilik yok", noNewsCopy: "Yeni bağlantılar eklendikten ve doğrulandıktan sonra burada görünür.", about: "Game Gifts hakkında", aboutCopy: "Herkese açık hediye ve ödül bağlantılarını düzenleyen bağımsız portal. Site ödül vermez ve bağlantıyı açmak için giriş istemez.", how: "Nasıl çalışır", howItems: ["Bir oyun seç", "Doğrulanmış hediyeyi kontrol et", "Oyunda aç'a dokun"], admin: "Merkezi yönetim", adminCopy: "Proje sahibi için oyunları ve bağlantıları yönetme alanı.", faq: "Hakkında & SSS", disclaimer: "Bağımsız bağlantı toplama sitesi. Markalar ve oyunlar ilgili sahiplerine aittir. Oyun geliştiricileriyle bağlantımız yoktur.", allGames: "Tüm oyunlar", lastAdded: "Eklenme", dateLinks: "bağlantı", selectDate: "Hediyeleri görmek için bir tarih seçin.", backHistory: "Geçmişe dön", noOpened: "Henüz hediye açılmadı", noOpenedCopy: "Bu cihazda açtığınız bağlantılar burada görünür." },
};
COPY.es = { ...COPY.en, home: "Inicio", games: "Juegos", news: "Novedades", favorites: "Favoritos", more: "Más", search: "Buscar juegos...", choose: "Elige tu juego", chooseCopy: "Encuentra enlaces públicos verificados para tus juegos móviles.", active: "enlaces activos", newToday: "nuevo hoy", noneToday: "Ninguno nuevo hoy", viewGames: "Ver juegos", today: "Regalos de hoy", recent: "Últimos días", opened: "Ya abiertos", expired: "Expirados", confirmed: "CONFIRMADO", unconfirmed: "NO CONFIRMADO", expiredInvalid: "EXPIRADO / INVÁLIDO", unconfirmedReward: "Recompensa no confirmada", unavailableReward: "Recompensa no disponible", open: "ABRIR EN EL JUEGO", openAgain: "ABRIR DE NUEVO", copyLink: "Copiar enlace", alreadyOpened: "YA ABIERTO", copied: "Enlace copiado", noRewards: "Ningún regalo confirmado", noRewardsCopy: "Los enlaces legítimos aparecen aquí después de su confirmación.", noGames: "No se encontraron juegos", noGamesCopy: "Prueba otra búsqueda.", allNews: "Novedades", newsCopy: "Enlaces confirmados añadidos recientemente en todos los juegos.", noNews: "Aún no hay novedades", noNewsCopy: "Los enlaces nuevos aparecen después de ser añadidos y confirmados.", about: "Sobre Game Gifts", aboutCopy: "Un portal independiente que organiza enlaces públicos de regalos y recompensas.", how: "Cómo funciona", howItems: ["Elige un juego", "Revisa el regalo confirmado", "Toca Abrir en el juego"], admin: "Administración central", adminCopy: "Área reservada al propietario para gestionar juegos y enlaces.", faq: "Sobre y preguntas frecuentes", disclaimer: "Sitio independiente de recopilación de enlaces. Las marcas y juegos pertenecen a sus propietarios.", allGames: "Todos los juegos", lastAdded: "Añadido", dateLinks: "enlaces", selectDate: "Elige una fecha para ver los regalos.", backHistory: "Volver al historial", noOpened: "Aún no has abierto regalos", noOpenedCopy: "Los enlaces que abras en este dispositivo aparecerán aquí." };

Object.assign(COPY.pt, { yesterday: "Ontem", previous: "Anteriores", source: "Fonte pública monitorada", sourceLabel: "Fonte", cadence: "Atualização", rewardTypes: "Tipos de recompensa", note: "Abrir o app não confirma o recebimento.", linksMode: "LINKS", codesMode: "CÓDIGOS", noneMode: "SEM RECOMPENSA DISPONÍVEL", noRewardNow: "Nenhuma recompensa disponível no momento.", noCodeNow: "Nenhum código confirmado no momento.", officialRedeem: "Resgatar código", copyCode: "COPIAR CÓDIGO", copiedCode: "Código copiado", codeReward: "CÓDIGO DE RECOMPENSA", unknownSource: "Fonte original ainda não identificada", code: "Código" });
Object.assign(COPY.en, { yesterday: "Yesterday", previous: "Earlier", source: "Public source monitored", sourceLabel: "Source", cadence: "Updates", rewardTypes: "Reward types", note: "Opening the app does not confirm delivery.", linksMode: "LINKS", codesMode: "CODES", noneMode: "NO REWARD AVAILABLE", noRewardNow: "No reward available at the moment.", noCodeNow: "No confirmed code at the moment.", officialRedeem: "REDEEM CODE", copyCode: "COPY CODE", copiedCode: "Code copied", codeReward: "REWARD CODE", unknownSource: "Original source not identified yet", code: "Code" });
Object.assign(COPY.es, { yesterday: "Ayer", previous: "Anteriores", source: "Fuente pública monitorizada", cadence: "Actualización", rewardTypes: "Tipos de recompensa", note: "Abrir la app no confirma la recepción.", linksMode: "ENLACES", codesMode: "CÓDIGOS", noneMode: "SIN RECOMPENSA DISPONIBLE", noRewardNow: "Ninguna recompensa disponible por el momento.", noCodeNow: "Ningún código confirmado por el momento.", officialRedeem: "CANJEAR CÓDIGO", copyCode: "COPIAR CÓDIGO", codeReward: "CÓDIGO DE RECOMPENSA", unknownSource: "Fuente original aún no identificada", code: "Código" });
Object.assign(COPY.de, { yesterday: "Gestern", previous: "Früher", source: "Öffentliche Quelle überwacht", cadence: "Aktualisierung", rewardTypes: "Belohnungstypen", note: "Das Öffnen der App bestätigt den Erhalt nicht.", linksMode: "LINKS", codesMode: "CODES", noneMode: "KEINE BELOHNUNG VERFÜGBAR", noRewardNow: "Momentan keine Belohnung verfügbar.", noCodeNow: "Momentan kein bestätigter Code.", officialRedeem: "CODE EINLÖSEN", copyCode: "CODE KOPIEREN", codeReward: "BELOHNUNGSCODE", unknownSource: "Originalquelle noch nicht identifiziert", code: "Code" });
Object.assign(COPY.tr, { yesterday: "Dün", previous: "Öncekiler", source: "İzlenen herkese açık kaynak", cadence: "Güncelleme", rewardTypes: "Ödül türleri", note: "Uygulamayı açmak ödülün geldiğini doğrulamaz.", linksMode: "BAĞLANTILAR", codesMode: "KODLAR", noneMode: "ÖDÜL YOK", noRewardNow: "Şu anda ödül bulunmuyor.", noCodeNow: "Şu anda doğrulanmış kod yok.", officialRedeem: "KODU KULLAN", copyCode: "KODU KOPYALA", codeReward: "ÖDÜL KODU", unknownSource: "Orijinal kaynak henüz belirlenmedi", code: "Kod" });
Object.assign(COPY.pt, { matchMastersGift: "Presente do Match Masters", identifiedType: "Tipo identificado", matchMastersPolicy: "Links recém-coletados ficam como NÃO CONFIRMADO. Abrir o jogo não confirma a recompensa; “já usado” pode depender da conta.", manualRequiresFacebook: "REQUER FACEBOOK", manualRecognized: "LINK RECONHECIDO / VÁLIDO", manualUsedNote: "Prêmio desconhecido; “já usado” pode depender da conta de teste.", manualFacebookNote: "Foi necessária conexão com o Facebook. Prêmio ainda não identificado.", manualSurprise: "RECOMPENSA SURPRESA" });
Object.assign(COPY.en, { matchMastersGift: "Match Masters gift", identifiedType: "Identified type", matchMastersPolicy: "Newly collected links stay NOT CONFIRMED. Opening the game does not confirm a reward; “already used” may depend on the account.", manualRequiresFacebook: "REQUIRES FACEBOOK", manualRecognized: "LINK RECOGNIZED / VALID", manualUsedNote: "Prize unknown; “already used” may depend on the test account.", manualFacebookNote: "A Facebook connection was required. Prize not identified yet.", manualSurprise: "SURPRISE REWARD" });
Object.assign(COPY.es, { matchMastersGift: "Regalo de Match Masters", identifiedType: "Tipo identificado", matchMastersPolicy: "Los enlaces recién recopilados quedan como NO CONFIRMADOS. Abrir el juego no confirma la recompensa; “ya usado” puede depender de la cuenta.", manualRequiresFacebook: "REQUIERE FACEBOOK", manualRecognized: "ENLACE RECONOCIDO / VÁLIDO", manualUsedNote: "Premio desconocido; “ya usado” puede depender de la cuenta de prueba.", manualFacebookNote: "Se requirió conexión con Facebook. Premio aún no identificado.", manualSurprise: "RECOMPENSA SORPRESA" });
Object.assign(COPY.de, { matchMastersGift: "Match-Masters-Geschenk", identifiedType: "Erkannter Typ", matchMastersPolicy: "Neu gesammelte Links bleiben NICHT BESTÄTIGT. Das Öffnen des Spiels bestätigt keine Belohnung; „bereits verwendet“ kann vom Konto abhängen.", manualRequiresFacebook: "FACEBOOK ERFORDERLICH", manualRecognized: "LINK ERKANNT / GÜLTIG", manualUsedNote: "Belohnung unbekannt; „bereits verwendet“ kann vom Testkonto abhängen.", manualFacebookNote: "Eine Facebook-Verbindung war erforderlich. Belohnung noch nicht identifiziert.", manualSurprise: "ÜBERRASCHUNGSBELOHNUNG" });
Object.assign(COPY.tr, { matchMastersGift: "Match Masters hediyesi", identifiedType: "Belirlenen tür", matchMastersPolicy: "Yeni toplanan bağlantılar DOĞRULANMADI olarak kalır. Oyunu açmak ödülü doğrulamaz; “zaten kullanıldı” hesapla ilgili olabilir.", manualRequiresFacebook: "FACEBOOK GEREKLİ", manualRecognized: "BAĞLANTI TANINDI / GEÇERLİ", manualUsedNote: "Ödül bilinmiyor; “zaten kullanıldı” test hesabına bağlı olabilir.", manualFacebookNote: "Facebook bağlantısı gerekti. Ödül henüz belirlenmedi.", manualSurprise: "SÜRPRİZ ÖDÜL" });
Object.assign(COPY.pt, { yesterdayCtaCopy: "Você pode ter deixado algum para trás", yesterdayCtaAction: "VER TODOS" });
Object.assign(COPY.en, { yesterdayCtaCopy: "You may have missed one", yesterdayCtaAction: "VIEW ALL" });
Object.assign(COPY.es, { yesterdayCtaCopy: "Puede que te hayas dejado alguno", yesterdayCtaAction: "VER TODOS" });
Object.assign(COPY.de, { yesterdayCtaCopy: "Vielleicht hast du eines verpasst", yesterdayCtaAction: "ALLE ANSEHEN" });
Object.assign(COPY.tr, { yesterdayCtaCopy: "Bazılarını kaçırmış olabilirsiniz", yesterdayCtaAction: "TÜMÜNÜ GÖR" });
Object.assign(COPY.pt, { confirmed: "RECOMPENSA CONFIRMADA", expiredInvalid: "EXPIRADO", problemUnconfirmed: "LINK COM PROBLEMA / NÃO CONFIRMADO", problemAction: "Link com problema", confirmedRewards: "recompensas confirmadas", verificationLinks: "links recentes em verificação", confirmedShort: "confirmadas", verificationShort: "em verificação", newsCopy: "Links recentes; só chamamos uma recompensa de confirmada quando há evidência suficiente." });
Object.assign(COPY.en, { confirmed: "REWARD CONFIRMED", expiredInvalid: "EXPIRED", problemUnconfirmed: "LINK WITH PROBLEM / NOT CONFIRMED", problemAction: "Problem link", confirmedRewards: "confirmed rewards", verificationLinks: "recent links in verification", confirmedShort: "confirmed", verificationShort: "in verification", newsCopy: "Recent links; a reward is called confirmed only when there is enough evidence." });
Object.assign(COPY.es, { confirmed: "RECOMPENSA CONFIRMADA", expiredInvalid: "EXPIRADO", problemUnconfirmed: "ENLACE CON PROBLEMA / NO CONFIRMADO", problemAction: "Enlace con problema", confirmedRewards: "recompensas confirmadas", verificationLinks: "enlaces recientes en verificación", confirmedShort: "confirmadas", verificationShort: "en verificación", newsCopy: "Enlaces recientes; una recompensa solo se confirma cuando hay evidencia suficiente." });
Object.assign(COPY.de, { confirmed: "BELOHNUNG BESTÄTIGT", expiredInvalid: "ABGELAUFEN", problemUnconfirmed: "PROBLEMLINK / NICHT BESTÄTIGT", problemAction: "Problemlink", confirmedRewards: "bestätigte Belohnungen", verificationLinks: "kürzliche Links in Prüfung", confirmedShort: "bestätigt", verificationShort: "in Prüfung", newsCopy: "Neue Links; eine Belohnung gilt nur mit ausreichenden Belegen als bestätigt." });
Object.assign(COPY.tr, { confirmed: "ÖDÜL DOĞRULANDI", expiredInvalid: "SÜRESİ DOLDU", problemUnconfirmed: "SORUNLU BAĞLANTI / DOĞRULANMADI", problemAction: "Sorunlu bağlantı", confirmedRewards: "doğrulanmış ödül", verificationLinks: "doğrulamadaki son bağlantılar", confirmedShort: "doğrulandı", verificationShort: "doğrulamada", newsCopy: "Son bağlantılar; ödül yalnızca yeterli kanıt olduğunda doğrulanmış sayılır." });
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

const CATALOG_PROFILE = {
  "match-masters": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/match-masters-freebies-links-updated-daily/", cadence: "diária / várias vezes por dia", types: "boosters · coins" },
  "dice-dreams": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/free-dice-dreams-rolls-links-updated-daily/", cadence: "diária / várias vezes por dia", types: "dice rolls" },
  "coin-master": { source: "Mobile Game Central", sourceUrl: "https://mobilegamecentral.com/freebies/free-coin-master-spins-links-updated-daily/", cadence: "diária / várias vezes por dia", types: "spins · coins" },
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

const detectLanguage = () => {
  try {
    const saved = localStorage.getItem("game-gifts-language");
    if (LANGS.includes(saved)) return saved;
  } catch {}
  const browser = String(navigator.language || "").toLowerCase().split("-")[0];
  return LANGS.includes(browser) ? browser : "en";
};
const state = { lang: detectLanguage(), data: { games: [], rewards: [] }, search: "", tab: "today", selectedDate: "", admin: null, editGameId: null, editSourceId: null, collectionResult: null, viewerKey: "anonymous" };
const app = document.querySelector("#app");
if (!document.querySelector('link[rel="icon"]')) { const favicon = document.createElement("link"); favicon.rel = "icon"; favicon.href = "/favicon.svg"; favicon.type = "image/svg+xml"; document.head.appendChild(favicon); }
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
  const source = reward?.found_at || reward?.created_at;
  if (source) {
    const local = localDateKey(source);
    if (local) return local;
  }
  return reward?.date_key || "";
};
const isRewardToday = (reward) => isToday(rewardDateKey(reward));
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
  const localTime = reward?.found_at && !Number.isNaN(new Date(reward.found_at).getTime()) ? new Intl.DateTimeFormat(state.lang === "pt" ? "pt-BR" : state.lang, { hour: "2-digit", minute: "2-digit" }).format(new Date(reward.found_at)) : reward.time_label;
  return [dateLabel(rewardDateKey(reward)), localTime].filter(Boolean).join(" • ");
};
const api = async (path, options) => { const response = await fetch(path, options); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.error || "Request failed"); return body; };
const favorites = () => { try { return JSON.parse(localStorage.getItem("game-gifts-favorites") || '{"games":[],"rewards":[]}'); } catch { return { games: [], rewards: [] }; } };
const openedStorageKey = () => `game-gifts-opened:${state.viewerKey}`;
const opened = () => { try { return JSON.parse(localStorage.getItem(openedStorageKey()) || "{}"); } catch { return {}; } };
const claimedStorageKey = () => `game-gifts-claimed:${state.viewerKey}`;
const claimedRewards = () => { try { return JSON.parse(localStorage.getItem(claimedStorageKey()) || "{}"); } catch { return {}; } };
const saveFavorites = (value) => localStorage.setItem("game-gifts-favorites", JSON.stringify(value));
const saveOpened = (value) => localStorage.setItem(openedStorageKey(), JSON.stringify(value));
const saveClaimedRewards = (value) => localStorage.setItem(claimedStorageKey(), JSON.stringify(value));
const isFavorite = (type, id) => favorites()[`${type}s`]?.includes(Number(id));
const toggleFavorite = (type, id) => { const saved = favorites(); const key = `${type}s`; const numericId = Number(id); saved[key] = saved[key] || []; saved[key] = saved[key].includes(numericId) ? saved[key].filter((item) => item !== numericId) : [...saved[key], numericId]; saveFavorites(saved); renderPage(); };
const markOpened = (id) => { const saved = opened(); saved[id] = new Date().toISOString(); saveOpened(saved); };
const markClaimed = (id) => { const saved = claimedRewards(); saved[id] = new Date().toISOString(); saveClaimedRewards(saved); };
const claimedLabel = () => state.lang === "pt" ? "JÁ RESGATEI" : state.lang === "en" ? "ALREADY CLAIMED" : state.lang === "es" ? "YA RECLAMADO" : state.lang === "de" ? "BEREITS EINGELÖST" : "ZATEN ALINDI";
const markClaimedLabel = () => state.lang === "pt" ? "Marcar como já resgatei" : state.lang === "en" ? "Mark as already claimed" : state.lang === "es" ? "Marcar como reclamado" : state.lang === "de" ? "Als eingelöst markieren" : "Zaten alındı olarak işaretle";
const rewardStatus = (reward) => String(reward?.status || "").toLowerCase();
const isConfirmed = (reward) => rewardStatus(reward) === "confirmed";
const isUnconfirmed = (reward) => rewardStatus(reward) === "unconfirmed";
const isProblem = (reward) => String(reward?.link_status || "").toLowerCase() === "problem";
const isExpired = (reward) => rewardStatus(reward) === "expired_invalid" || String(reward?.reward_status || "").toLowerCase() === "expired_invalid" || String(reward?.link_status || "").toLowerCase() === "expired";
const isConfirmedReward = (reward) => isConfirmed(reward) && !isExpired(reward) && !isProblem(reward);
const isLinkActive = (reward) => !isExpired(reward) && !isProblem(reward);
const isInVerification = (reward) => !isConfirmedReward(reward) && !isExpired(reward) && !isProblem(reward);
const PUBLIC_VISIBLE_GAMES = Object.freeze({ "match-masters": true, "dice-dreams": true, "travel-town": true });
const isPublicVisibleGame = (game) => Boolean(PUBLIC_VISIBLE_GAMES[game?.slug]);
const isPublicVisibleSlug = (slug) => Boolean(PUBLIC_VISIBLE_GAMES[slug]);
const publicGames = () => state.data.games.filter(isPublicVisibleGame);
const publicRewards = () => publicGames().flatMap((game) => publicRewardsForGame(game));
const presentationRewardKey = (reward) => String(reward?.reward_key || reward?.url || reward?.original_url || reward?.final_url || reward?.id || "").trim().replace(/\/+$/, "").toLowerCase();
const publicTodayRewardsForGame = (game) => {
  const unique = new Map();
  publicRewardsForGame(game).filter((reward) => isLinkActive(reward) && isRewardToday(reward)).forEach((reward) => {
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
const newsCount = () => publicTodayRewards().length;
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
const matchMastersManualOutcome = (reward) => String(reward?.reward_description || "").match(/\bGG_MANUAL:([a-z0-9-]+)/i)?.[1]?.toLowerCase() || "";
const matchMastersManualLabel = (reward) => {
  const outcome = matchMastersManualOutcome(reward);
  const item = outcome.match(/^confirmed-item-(\d+)$/);
  if (item) return `Item x${item[1]}`;
  if (outcome === "confirmed-discord-surprise") return copy().manualSurprise;
  return "";
};
const matchMastersManualStatusText = (reward) => {
  const outcome = matchMastersManualOutcome(reward);
  if (outcome === "requires-facebook") return copy().manualRequiresFacebook;
  if (outcome === "recognized-used") return copy().manualRecognized;
  return "";
};
const matchMastersManualNote = (reward) => {
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
    if (!visual) return matchMastersManualStatusText(reward) || copy().matchMastersGift;
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
const countLabel = (gameId) => publicTodayLabel(gameFor(gameId));
const availableLabel = (count) => count === 1 ? (state.lang === "pt" ? "link" : state.lang === "en" ? "link" : state.lang === "es" ? "enlace" : state.lang === "de" ? "Link" : "bağlantı") : (state.lang === "pt" ? "links" : state.lang === "en" ? "links" : state.lang === "es" ? "enlaces" : state.lang === "de" ? "Links" : "bağlantı");
const todayCountLabel = (count) => count ? `${count} ${state.lang === "pt" ? "HOJE" : state.lang === "en" ? "TODAY" : state.lang === "es" ? "HOY" : state.lang === "de" ? "HEUTE" : "BUGÜN"}` : copy().noneToday;
const lastCheckedLabel = () => state.lang === "pt" ? "Última verificação" : state.lang === "en" ? "Last check" : state.lang === "es" ? "Última comprobación" : state.lang === "de" ? "Letzte Prüfung" : "Son kontrol";
const adminStatusValue = (reward) => isProblem(reward) ? "problem_unconfirmed" : ["confirmed", "unconfirmed", "expired_invalid"].includes(rewardStatus(reward)) ? rewardStatus(reward) : "unconfirmed";
const route = () => {
  const parts = location.pathname.split("/").filter(Boolean);
  const lang = LANGS.includes(parts[0]) ? parts[0] : state.lang;
  const translated = SECTION_NAMES[lang];
  const permanentPath = `/${parts.join("/")}/`;
  if (GAME_SEO_PATHS[permanentPath]) return isPublicVisibleSlug(GAME_SEO_PATHS[permanentPath]) ? { lang, page: "game", slug: GAME_SEO_PATHS[permanentPath], permanent: true } : { lang, page: "home" };
  if (!LANGS.includes(parts[0])) return { lang, page: "home" };
  if (!parts[1]) return { lang, page: "home" };
  if (parts[1] === translated.games) return parts[2] ? (isPublicVisibleSlug(parts[2]) ? { lang, page: "game", slug: parts[2] } : { lang, page: "home" }) : { lang, page: "games" };
  if (parts[1] === translated.news) return { lang, page: "news" };
  if (parts[1] === translated.favorites) return { lang, page: "favorites" };
  if (parts[1] === translated.more) return { lang, page: "more" };
  if (parts[1] === translated.admin) return { lang, page: "admin" };
  return { lang, page: "home" };
};
const pathFor = (page, slug = "", lang = state.lang) => {
  if (page === "home") return `/${lang}/`;
  if (page === "games" && slug && GAME_SEO[slug]) return GAME_SEO[slug].path;
  const section = SECTION_NAMES[lang][page] || page;
  return `/${lang}/${section}/${slug ? `${slug}/` : ""}`;
};
const go = (path) => { history.pushState({}, "", path); state.tab = "today"; state.selectedDate = ""; const current = route(); state.lang = current.lang; const languageSelect = document.querySelector("#language-select"); if (languageSelect) languageSelect.value = state.lang; renderPage(); window.scrollTo({ top: 0, behavior: "smooth" }); };
const gameFor = (slug) => state.data.games.find((game) => game.slug === slug);
const rewardsFor = (gameId) => state.data.rewards.filter((reward) => Number(reward.game_id) === Number(gameId));
const isMatchMastersReward = (reward) => String(reward?.game_slug || "") === "match-masters" || Number(reward?.game_id) === Number(gameFor("match-masters")?.id);
const matchMastersOfferKey = (reward) => {
  // The server keeps its own global deduplication. This presentation key must
  // not merge different Match Masters URLs just because they share an offer token.
  const url = String(reward?.original_url || reward?.url || "").trim();
  return `url:${url || reward?.id || "unknown"}`;
};
const freshnessScore = (reward) => new Date(`${rewardDateKey(reward)}T${reward?.time_label || "00:00"}`).getTime() || new Date(reward?.found_at || reward?.created_at || 0).getTime() || 0;
const matchMastersPublicRewards = (gameId) => {
  const unique = new Map();
  rewardsFor(gameId).filter((reward) => !rewardIsCode(reward)).forEach((reward) => {
    const key = matchMastersOfferKey(reward);
    const current = unique.get(key);
    if (!current || freshnessScore(reward) > freshnessScore(current)) unique.set(key, reward);
  });
  return [...unique.values()];
};
const publicRewardsForGame = (game) => game?.slug === "match-masters" ? matchMastersPublicRewards(game.id) : rewardsFor(game?.id);
const availableRewards = (gameId) => sortRewards(publicRewardsForGame(gameFor(gameId)).filter(isLinkActive));
const matchMastersArt = (className) => `<div class="${className} match-masters-art" aria-hidden="true"><span class="match-masters-spark spark-one">✦</span><span class="match-masters-spark spark-two">◆</span><span class="match-masters-wordmark">MATCH <b>MASTERS</b></span><span class="match-masters-gem gem-one">◆</span><span class="match-masters-gem gem-two">◆</span><span class="match-masters-gem gem-three">◆</span></div>`;
const gameArt = (game, className = "card-art") => {
  const image = game?.image || game?.banner;
  return image ? `<div class="${className}" ${artStyle(game?.slug)}><img src="${esc(image)}" alt="${esc(game?.name)}" /></div>` : game?.slug === "match-masters" ? matchMastersArt(className) : `<div class="${className}" ${artStyle(game?.slug)}><span class="card-art-placeholder">✦</span><span class="logo-word">${esc(game?.name)}</span></div>`;
};
const rewardArt = (reward, game) => {
  const visual = isMatchMastersReward(reward) ? matchMastersTypeVisual(reward) : rewardVisual(reward);
  const image = reward?.image || (!visual ? (game?.image || game?.banner) : "");
  if (image) return '<div class="reward-art ' + (reward?.image ? "reward-art--official" : "reward-art-neutral") + '" ' + artStyle(reward?.name || reward?.type || game?.slug) + '><img src="' + esc(image) + '" alt="' + esc(reward?.image ? (reward?.name || reward?.type || "Recompensa") : (game?.name || "Jogo")) + '" /></div>';
  if (visual) return '<div class="reward-art reward-art-' + visual.key + '" aria-label="' + esc(visual.label) + '"><span class="reward-icon">' + visual.icon + '</span><span class="reward-art-label">' + esc(visual.label) + '</span></div>';
  return game?.slug === "match-masters" ? matchMastersArt("reward-art reward-art-neutral") : '<div class="reward-art reward-art-neutral" ' + artStyle(game?.slug || "reward") + '><div class="card-art"><span class="card-art-placeholder">✦</span></div></div>';
};
const emptyState = (title, message, icon = "✦") => `<div class="empty"><span class="empty-icon">${icon}</span><h3>${esc(title)}</h3><p>${esc(message)}</p></div>`;
const filteredGames = () => { const term = state.search.trim().toLocaleLowerCase(); const games = publicGames(); return term ? games.filter((game) => game.name.toLocaleLowerCase().includes(term)) : games; };
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
  pt: { subtitle: "Seus presentes de jogos em um só lugar", recentTitle: "ACABOU DE CHEGAR", recentCopy: "Presentes encontrados recentemente. Seja rápido!", seeAll: "Ver todos", gamesTitle: "JOGOS DISPONÍVEIS", gamesCopy: "Escolha um jogo e veja todos os presentes disponíveis.", redeem: "RESGATAR", newBadge: "NOVO", noRecent: "Nenhum presente novo no momento. Estamos verificando novos links.", hasToday: "🟢 Tem presente hoje", noToday: "⚪ Sem presentes hoje", unknownType: "Recompensa" },
  en: { subtitle: "Your game gifts in one place", recentTitle: "JUST IN", recentCopy: "Recently found gifts. Be quick!", seeAll: "View all", gamesTitle: "AVAILABLE GAMES", gamesCopy: "Choose a game and see all available gifts.", redeem: "REDEEM", newBadge: "NEW", noRecent: "No new gifts right now. We are checking for new links.", hasToday: "🟢 Gift available today", noToday: "⚪ No gifts today", unknownType: "Reward" },
  es: { subtitle: "Tus regalos de juegos en un solo lugar", recentTitle: "RECIÉN LLEGADOS", recentCopy: "Regalos encontrados recientemente. ¡Date prisa!", seeAll: "Ver todos", gamesTitle: "JUEGOS DISPONIBLES", gamesCopy: "Elige un juego y consulta todos los regalos disponibles.", redeem: "CANJEAR", newBadge: "NUEVO", noRecent: "No hay regalos nuevos ahora. Estamos buscando nuevos enlaces.", hasToday: "🟢 Hay regalo hoy", noToday: "⚪ Sin regalos hoy", unknownType: "Recompensa" },
  de: { subtitle: "Deine Spielgeschenke an einem Ort", recentTitle: "GERADE EINGETROFFEN", recentCopy: "Kürzlich gefundene Geschenke. Sei schnell!", seeAll: "Alle ansehen", gamesTitle: "VERFÜGBARE SPIELE", gamesCopy: "Wähle ein Spiel und sieh dir alle verfügbaren Geschenke an.", redeem: "EINLÖSEN", newBadge: "NEU", noRecent: "Momentan keine neuen Geschenke. Wir prüfen neue Links.", hasToday: "🟢 Heute Geschenk verfügbar", noToday: "⚪ Heute keine Geschenke", unknownType: "Belohnung" },
  tr: { subtitle: "Oyun hediyeleriniz tek bir yerde", recentTitle: "AZ ÖNCE GELDİ", recentCopy: "Yakın zamanda bulunan hediyeler. Çabuk olun!", seeAll: "Tümünü gör", gamesTitle: "MEVCUT OYUNLAR", gamesCopy: "Bir oyun seçin ve tüm mevcut hediyeleri görün.", redeem: "AL", newBadge: "YENİ", noRecent: "Şu anda yeni hediye yok. Yeni bağlantıları kontrol ediyoruz.", hasToday: "🟢 Bugün hediye var", noToday: "⚪ Bugün hediye yok", unknownType: "Ödül" },
};
const homeCopy = () => HOME_COPY[state.lang] || HOME_COPY.en;
const HOME_RECENT_WINDOW_MS = 48 * 60 * 60 * 1000;
const rewardFoundAt = (reward) => reward?.found_at || reward?.created_at || "";
const isRecentHomeReward = (reward) => {
  if (!isLinkActive(reward) || !String(reward?.url || "").trim()) return false;
  const timestamp = new Date(rewardFoundAt(reward)).getTime();
  return Boolean(timestamp) && timestamp <= Date.now() && Date.now() - timestamp <= HOME_RECENT_WINDOW_MS;
};
const recentHomeRewards = () => {
  const unique = new Map();
  publicRewards().filter(isRecentHomeReward).forEach((reward) => {
    const key = `${reward.game_slug || reward.game_id}:${String(reward.url).trim()}`;
    const current = unique.get(key);
    if (!current || new Date(rewardFoundAt(reward)).getTime() > new Date(rewardFoundAt(current)).getTime()) unique.set(key, reward);
  });
  return [...unique.values()].sort((a, b) => new Date(rewardFoundAt(b)).getTime() - new Date(rewardFoundAt(a)).getTime());
};
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
  const visual = isMatchMastersReward(reward) ? matchMastersTypeVisual(reward) : rewardVisual(reward);
  return visual?.label || usableRewardName(reward) || homeCopy().unknownType;
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
  const fav = isFavorite("game", game.id);
  const hasToday = publicTodayRewardsForGame(game).length > 0;
  return `<a class="home-game-card" href="${pathFor("games", game.slug)}" data-route data-analytics-game-name="${esc(game.name)}" data-analytics-game-slug="${esc(game.slug)}" ${artStyle(game.slug)}>${gameArt(game, "card-art home-game-art")}<div class="home-game-card-body"><div class="home-game-name-row"><h3>${esc(game.name)}</h3><span class="card-heart ${fav ? "is-favorite" : ""}">${fav ? "♥" : ""}</span></div><p class="home-game-status ${hasToday ? "has-today" : "no-today"}">${esc(hasToday ? homeCopy().hasToday : homeCopy().noToday)}</p></div></a>`;
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
    if (mark) mark.textContent = isHome ? "🎁" : "✦";
  });
};
const gameCard = (game, home = false) => {
  const fav = isFavorite("game", game.id);
  const mode = game.reward_mode || "links";
  const modeLabel = mode === "codes" ? copy().codesMode : mode === "none" ? copy().noneMode : copy().linksMode;
  const today = home ? publicTodayRewardsForGame(game) : [];
  const homeStatus = today.length ? `<small class="home-new-indicator">✦ ${esc(state.lang === "pt" ? "Novo hoje" : state.lang === "en" ? "New today" : state.lang === "es" ? "Nuevo hoy" : state.lang === "de" ? "Neu heute" : "Yeni bugün")}</small>` : "";
  return `<a class="game-card" href="${pathFor("games", game.slug)}" data-route data-analytics-game-name="${esc(game.name)}" data-analytics-game-slug="${esc(game.slug)}" ${artStyle(game.slug)}>
    ${gameArt(game)}<div class="game-card-body"><div style="display:flex;justify-content:space-between;gap:7px;align-items:start"><h3>${esc(game.name)}</h3><span class="card-heart ${fav ? "is-favorite" : ""}">${fav ? "♥" : ""}</span></div>
    <div class="game-meta"><span><strong class="mode-chip mode-${mode}">${esc(modeLabel)}</strong>${home ? homeStatus : publicTodayStatusMarkup(game)}</span><span class="arrow">›</span></div></div></a>`;
};
const rewardCard = (reward, game, index = null) => {
  const wasOpened = Boolean(opened()[reward.id]);
  const claimed = Boolean(claimedRewards()[reward.id]);
  const matchMasters = isMatchMastersReward(reward);
  const confirmed = isConfirmedReward(reward);
  const unconfirmed = isUnconfirmed(reward);
  const problem = isProblem(reward);
  const expired = isExpired(reward);
  const coinMaster = game?.slug === "coin-master";
  const isNewCoinMasterReward = coinMaster && !expired && isToday(rewardDateKey(reward));
  const favorite = isFavorite("reward", reward.id);
  const isCode = rewardIsCode(reward);
  const visual = matchMasters ? matchMastersTypeVisual(reward) : rewardVisual(reward);
  const rewardTitle = problem ? copy().problemUnconfirmed : matchMasters ? copy().matchMastersGift : usableRewardName(reward) || (visual ? visual.label : isCode ? copy().codeReward : copy().unconfirmedReward);
  const checkedAt = reward.last_checked_at || reward.verified_at;
  const sourceUrl = sourceUrlFrom(reward);
  const sourceName = sourceNameFrom(reward);
  const source = '<span class="reward-source-line">' + esc(copy().sourceLabel || "Fonte") + ': ' + (sourceUrl ? '<a href="' + esc(sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(sourceName) + ' ↗</a>' : '<strong>' + esc(sourceName) + '</strong>') + '</span>';
  const rewardValue = problem ? copy().unavailableReward : isCode ? "" : rewardDisplayText(reward);
  const statusLabel = problem ? copy().problemUnconfirmed : expired ? copy().expiredInvalid : claimed ? claimedLabel() : confirmed ? copy().confirmed : unconfirmed ? copy().unconfirmed : copy().unconfirmed;
  const statusIcon = problem ? "🟠" : expired ? "⚫" : claimed ? "🔵" : confirmed ? "🟢" : unconfirmed ? "🟡" : "🟡";
  const statusClass = problem ? "problem" : expired ? "expired" : claimed ? "claimed" : confirmed ? "confirmed" : unconfirmed ? "unconfirmed" : "unconfirmed";
  const rewardBadgeClass = matchMasters ? `reward-badge-match-${statusClass}` : problem ? "reward-badge-problem" : `reward-badge-${visual?.key || "unknown"}`;
  const rewardBadgeText = matchMasters ? (matchMastersManualStatusText(reward) || statusLabel) : problem ? copy().problemUnconfirmed : rewardDisplayText(reward);
  const rewardBadge = `<span class="reward-badge ${rewardBadgeClass}">${esc(rewardBadgeText)}</span>`;
  const analyticsContext = ' data-analytics-game-name="' + esc(game?.name || reward.game_name || '') + '" data-analytics-gift-name="' + esc(rewardTitle) + '" data-analytics-reward-id="' + esc(reward.id) + '"';
  const travelRedeemLabel = state.lang === "pt" ? "RESGATAR" : state.lang === "en" ? "REDEEM" : state.lang === "es" ? "CANJEAR" : state.lang === "de" ? "EINLÖSEN" : "AL";
  const action = problem ? '<span class="open-button disabled">' + esc(copy().problemAction) + '</span>' : expired ? '<span class="open-button disabled">' + esc(copy().expiredStatus || copy().expired) + '</span>' : isCode ? (reward.redemption_url || reward.url ? '<a class="open-button redeem-button" href="' + esc(reward.redemption_url || reward.url) + '" target="_blank" rel="noopener noreferrer" data-redeem-reward="' + esc(reward.id) + '"' + analyticsContext + '>' + esc(copy().officialRedeem) + ' ↗</a>' : '') : (reward.url ? '<a class="open-button" href="' + esc(reward.url) + '" target="_blank" rel="noopener noreferrer" data-open-reward="' + esc(reward.id) + '"' + analyticsContext + '>' + esc(game?.slug === "travel-town" ? travelRedeemLabel : wasOpened ? copy().openAgain : copy().open) + ' ↗</a>' : '<span class="open-button disabled">' + esc(copy().open) + '</span>');
  const copyAction = problem || expired ? '' : isCode ? '<button class="copy-link copy-code" type="button" data-copy-code="' + esc(reward.reward_code) + '">' + esc(copy().copyCode) + '</button>' : (reward.url ? '<button class="copy-link" type="button" data-copy-url="' + esc(reward.url) + '"' + analyticsContext + '>' + esc(copy().copyLink) + '</button>' : '');
  const claimedAction = !problem && !expired ? '<button class="copy-link" type="button" data-mark-claimed="' + reward.id + '">' + esc(claimed ? '✓ ' + claimedLabel() : markClaimedLabel()) + '</button>' : '';
  const value = isCode ? '<span class="reward-code-label">' + esc(copy().codeReward) + '</span><strong class="reward-code">' + esc(reward.reward_code) + '</strong>' : '<strong>' + esc(rewardValue) + '</strong>';
  const verificationNote = unconfirmed && !problem ? '<span class="verification-note">' + esc([game?.slug === "travel-town" ? "Recompensa não confirmada" : copy().unconfirmedReward, matchMasters ? matchMastersManualNote(reward) : ""].filter(Boolean).join(" · ")) + '</span>' : '';
  const itemLabel = Number.isInteger(index) ? '<span class="reward-index">' + esc(copy().giftItem) + ' ' + index + '</span>' : '';
  return '<article class="reward-card ' + (matchMasters ? 'reward-card-match-masters ' : '') + (isCode ? 'reward-card-code ' : '') + (problem ? 'reward-card-problem' : '') + '"><div>' + rewardArt(reward, game) + '</div><div class="reward-copy"><h3>' + esc(rewardTitle) + (isNewCoinMasterReward ? '<span class="coin-master-new-badge">NOVO</span>' : '') + '</h3><p class="reward-value ' + (confirmed && !problem ? '' : 'is-unconfirmed') + '">' + value + '</p><div class="reward-details">' + itemLabel + '<span class="reward-status ' + statusClass + '">' + statusIcon + ' ' + esc(statusLabel) + '</span>' + verificationNote + '<span>' + esc(formatRewardDate(reward)) + '</span>' + (checkedAt ? '<span>' + esc(lastCheckedLabel()) + ': ' + esc(timeAgo(checkedAt)) + '</span>' : '') + source + (wasOpened ? '<span class="opened-status">✓ ' + esc(copy().alreadyOpened) + '</span>' : '') + '</div></div><div class="reward-actions">' + rewardBadge + action + copyAction + claimedAction + '<button class="icon-button reward-favorite ' + (favorite ? 'is-favorite' : '') + '" type="button" title="' + esc(favorite ? copy().unfavorite : copy().favorite) + '" data-favorite-type="reward" data-favorite-id="' + reward.id + '">' + (favorite ? '♥' : '♡') + '</button></div></article>';
};
const seoForGame = (slug) => GAME_SEO[slug]?.[state.lang] || GAME_SEO[slug]?.en || null;
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
  const canonicalPath = gameSeo ? GAME_SEO[current.slug].path : (location.pathname || "/");
  const canonical = `${location.origin}${canonicalPath}`;
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) canonicalLink.href = canonical;
  document.documentElement.lang = state.lang === "pt" ? "pt-BR" : state.lang;
  const title = gameSeo?.title || (current.page === "admin" ? "Admin · Game Gifts" : "Game Gifts");
  const description = gameSeo?.description || COPY[state.lang].chooseCopy;
  document.title = title;
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', canonical);
  setMetaContent('meta[property="og:type"]', "website");
  let structured = document.querySelector("#game-structured-data");
  if (gameSeo) {
    if (!structured) { structured = document.createElement("script"); structured.id = "game-structured-data"; structured.type = "application/ld+json"; document.head.appendChild(structured); }
    structured.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: gameSeo.h1, url: canonical, description: gameSeo.description, isPartOf: { "@type": "WebSite", name: "Game Gifts", url: `${location.origin}/` } });
  } else if (structured) structured.remove();
  document.querySelectorAll('link[data-hreflang]').forEach((link) => link.remove());
  LANGS.forEach((lang) => { const alternate = document.createElement("link"); alternate.rel = "alternate"; alternate.hreflang = lang; alternate.href = `${location.origin}${pathFor(current.page === "game" ? "games" : current.page, current.slug || "", lang)}`; alternate.dataset.hreflang = lang; document.head.appendChild(alternate); });
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
const renderChrome = () => {
  syncHomeBrand(route().page === "home");
  document.querySelectorAll("[data-i18n]").forEach((node) => { const key = node.dataset.i18n; if (copy()[key]) node.textContent = copy()[key]; });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => { node.placeholder = copy()[node.dataset.i18nPlaceholder]; });
  document.querySelectorAll("[data-news-count]").forEach((node) => { node.textContent = newsCount(); });
  document.querySelectorAll("[data-nav]").forEach((node) => { const nav = node.dataset.nav; node.href = pathFor(nav === "home" ? "home" : nav); node.classList.toggle("active", route().page === nav || (nav === "games" && route().page === "game")); });
  const languageSelect = document.querySelector("#language-select");
  if (languageSelect) {
    languageSelect.innerHTML = LANGS.map((lang) => `<option value="${lang}">${lang.toUpperCase()}</option>`).join("");
    languageSelect.value = state.lang;
  }
  const searchInput = document.querySelector("#global-search");
  if (searchInput) searchInput.value = state.search;
};
const renderHome = () => {
  const recentGames = recentHomeGames();
  const games = filteredGames();
  return `<div class="home-page-content"><section class="home-section home-recent-section"><div class="home-section-heading"><div class="home-heading-main"><span class="home-section-icon" aria-hidden="true">⚡</span><div><h2 class="home-section-kicker">${esc(homeCopy().recentTitle)}</h2><p class="home-section-copy">${esc(homeCopy().recentCopy)}</p></div></div><a class="home-see-all" href="${pathFor("news")}?recent=1" data-route>${esc(homeCopy().seeAll)} <span aria-hidden="true">→</span></a></div>${recentGames.length ? `<div class="home-recent-games-grid">${recentGames.map(recentHomeGameCard).join("")}</div>` : `<p class="home-empty-recent" role="status">${esc(homeCopy().noRecent)}</p>`}</section><section class="home-section home-games-section"><div class="home-section-heading"><div class="home-heading-main"><span class="home-section-icon" aria-hidden="true">🎮</span><div><h2 class="home-section-kicker">${esc(homeCopy().gamesTitle)}</h2><p class="home-section-copy">${esc(homeCopy().gamesCopy)}</p></div></div></div><div class="home-games-grid">${games.map(homeGameCard).join("") || emptyState(copy().noGames, copy().noGamesCopy)}</div></section></div>`;
};
const renderGames = () => `<div class="page-top"><a href="${pathFor("home")}" data-route class="back-link">‹ ${esc(copy().home)}</a></div><div class="section-head" style="margin-top:0"><div><p class="eyebrow">✦ GAME GIFTS</p><h1 style="font-size:clamp(30px,5vw,52px)">${esc(copy().allGames)}</h1></div></div><div class="games-grid">${filteredGames().map(gameCard).join("") || emptyState(copy().noGames, copy().noGamesCopy)}</div>`;
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
const noNewRewardState = () => emptyState(copy().noNewGiftTitle, copy().noNewGiftCopy, "🎁");
const yesterdayCountLabel = (count) => {
  if (state.lang === "pt") return `${count} ${count === 1 ? "presente" : "presentes"} de ontem`;
  if (state.lang === "en") return `${count} gift${count === 1 ? "" : "s"} from yesterday`;
  if (state.lang === "es") return `${count} regalo${count === 1 ? "" : "s"} de ayer`;
  if (state.lang === "de") return `${count} Geschenk${count === 1 ? "" : "e"} von gestern`;
  return `${count} ${count === 1 ? "dünkü hediye" : "dünkü hediye"}`;
};
const yesterdayCallout = (count, priority = false) => `<button type="button" class="yesterday-callout ${priority ? "is-priority" : ""}" data-tab="yesterday" aria-label="${esc(`${yesterdayCountLabel(count)} · ${copy().yesterdayCtaAction}`)}"><span class="yesterday-callout-icon" aria-hidden="true">🎁</span><span class="yesterday-callout-copy"><strong>${esc(yesterdayCountLabel(count))}</strong><span>${esc(copy().yesterdayCtaCopy)}</span></span><span class="yesterday-callout-action">${esc(copy().yesterdayCtaAction)} <b aria-hidden="true">→</b></span></button>`;
const renderGame = (game) => {
  const all = publicRewardsForGame(game);
  const mode = game.reward_mode || "links";
  const modeLabel = mode === "codes" ? copy().codesMode : mode === "none" ? copy().noneMode : copy().linksMode;
  const todayList = sortRewards(publicTodayRewardsForGame(game));
  const yesterdayList = sortRewards(all.filter((reward) => isLinkActive(reward) && rewardDateKey(reward) === yesterdayKey()));
  const tab = state.tab;
  let content = "";
  if (tab === "history") content = renderHistory(game, all.filter((reward) => rewardDateKey(reward) < yesterdayKey() || isProblem(reward) || isExpired(reward)));
  if (tab === "today") {
    const todayHeading = ["match-masters", "coin-master"].includes(game.slug) ? `<div class="match-section-title"><div><p class="eyebrow">✦ ${esc(copy().today)}</p><h2>${esc(copy().today)}</h2></div><strong>${todayList.length}<small>${esc(availableLabel(todayList.length))}</small></strong></div>` : "";
    const emptyToday = mode === "none" ? emptyState(copy().noneMode, copy().noRewardNow, "—") : mode === "codes" ? emptyState(copy().codesMode, copy().noCodeNow, "#") : !todayList.length ? noNewRewardState() : emptyState(copy().noRewards, copy().noRewardsCopy, "✦");
    const yesterdayBanner = yesterdayList.length ? yesterdayCallout(yesterdayList.length, !todayList.length) : "";
    content = `${todayHeading}${yesterdayBanner}${todayList.length ? `<div class="reward-list">${todayList.map((reward, index) => rewardCard(reward, game, index + 1)).join("")}</div>` : emptyToday}`;
  }
  if (tab === "yesterday") content = yesterdayList.length ? `<div class="date-context"><span class="eyebrow">◷ ${esc(copy().yesterday)}</span><strong>${esc(dateLabel(yesterdayKey(), { full: true }))}</strong></div><div class="reward-list">${yesterdayList.map((reward, index) => rewardCard(reward, game, index + 1)).join("")}</div>` : mode === "none" ? emptyState(copy().noneMode, copy().noRewardNow, "—") : mode === "codes" ? emptyState(copy().codesMode, copy().noCodeNow, "#") : emptyState(copy().noRewards, copy().noRewardsCopy, "◷");
  if (tab === "opened") { const list = sortRewards(all.filter((reward) => opened()[reward.id])); content = list.length ? `<div class="reward-list">${list.map((reward, index) => rewardCard(reward, game, index + 1)).join("")}</div>` : emptyState(copy().noOpened, copy().noOpenedCopy, "✓"); }
  if (tab === "expired") { const list = sortRewards(all.filter(isExpired)); content = list.length ? `<div class="reward-list">${list.map((reward, index) => rewardCard(reward, game, index + 1)).join("")}</div>` : emptyState(copy().noRewards, copy().noRewardsCopy, "×"); }
  const fav = isFavorite("game", game.id);
  const profile = CATALOG_PROFILE[game.slug] || { source: copy().unknownSource, sourceUrl: "", cadence: "recorrente", types: copy().unconfirmedReward };
  const profileSource = profile.sourceUrl ? `<a href="${esc(profile.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(profile.source)} ↗</a>` : `<strong>${esc(profile.source)}</strong>`;
  const yesterdayTab = game.slug === "coin-master" ? "" : `<button class="tab ${tab === "yesterday" ? "active" : ""}" data-tab="yesterday">${esc(copy().yesterday)}</button>`;
  return `<div class="page-top"><a href="${pathFor("games")}" data-route class="back-link">‹ ${esc(copy().games)}</a></div><section class="game-intro ${game.slug === "match-masters" ? "match-masters-intro" : ""}">${gameArt(game, "game-cover")}<div><p class="eyebrow">✦ ${esc(modeLabel)}</p><h1>${esc(game.name)}</h1><p>${esc(game.description || copy().chooseCopy)}</p></div><button class="icon-button ${fav ? "is-favorite" : ""}" type="button" title="${esc(fav ? copy().unfavorite : copy().favorite)}" data-favorite-type="game" data-favorite-id="${game.id}">${fav ? "♥" : "♡"}</button></section><section class="game-proof"><div><small>${esc(copy().source)}</small>${profileSource}</div><div><small>${esc(copy().rewardTypes)}</small><strong>${esc(profile.types)}</strong></div><div><small>${esc(copy().cadence)}</small><strong>${esc(profile.cadence)}</strong></div><p>ⓘ ${esc(copy().note)} ${mode === "none" ? `· ${esc(copy().noRewardNow)}` : ""}</p>${game.slug === "match-masters" ? `<p class="match-validation-note">ⓘ ${esc(copy().matchMastersPolicy)}</p>` : ""}</section><div class="tabs"><button class="tab ${tab === "today" ? "active" : ""}" data-tab="today">${esc(copy().today)}</button>${yesterdayTab}<button class="tab ${tab === "history" ? "active" : ""}" data-tab="history">${esc(copy().previous)}</button><button class="tab ${tab === "opened" ? "active" : ""}" data-tab="opened">${esc(copy().opened)}</button><button class="tab ${tab === "expired" ? "active" : ""}" data-tab="expired">${esc(copy().expired)}</button></div>${content}`;
};
const renderNews = () => {
  const list = new URLSearchParams(location.search).get("recent") === "1" ? recentHomeRewards() : sortRewards(publicTodayRewards());
  return `<div class="page-top"><a href="${pathFor("home")}" data-route class="back-link">‹ ${esc(copy().home)}</a></div><div class="section-head" style="margin-top:0"><div><p class="eyebrow">✧ GAME GIFTS</p><h1 style="font-size:clamp(30px,5vw,52px)">${esc(copy().allNews)}</h1><p>${esc(copy().newsCopy)}</p></div></div>${list.length ? `<div class="news-list">${list.map((reward) => { const game = gameFor(reward.game_slug); const matchMasters = isMatchMastersReward(reward); const newsName = matchMasters ? rewardDisplayText(reward) : reward.name; const newsSuffix = matchMasters ? (isInVerification(reward) ? ` · ${copy().unconfirmedReward}` : "") : `${reward.quantity ? ` · ${reward.quantity}` : ""}${isInVerification(reward) ? ` · ${copy().unconfirmedReward}` : isConfirmedReward(reward) ? ` · ${copy().confirmed}` : ""}`; return `<a class="news-card" href="${pathFor("games", reward.game_slug)}" data-route>${rewardArt(reward, game).replace('class="reward-art ', 'class="mini-art reward-art ')}<h3>${esc(game?.name || reward.game_name)}</h3><p>${esc(newsName)}${esc(newsSuffix)}</p><span class="news-time">✦ ${esc(copy().lastAdded)} · ${esc(timeAgo(reward.created_at))}</span></a>`; }).join("")}</div>` : emptyState(copy().noNews, copy().noNewsCopy, "✧")}`;
};
const renderFavorites = () => {
  const saved = favorites();
  const games = publicGames().filter((game) => saved.games.includes(Number(game.id)));
  const rewards = publicRewards().filter((reward) => saved.rewards.includes(Number(reward.id)));
  return `<div class="page-top"><a href="${pathFor("home")}" data-route class="back-link">‹ ${esc(copy().home)}</a></div><div class="section-head" style="margin-top:0"><div><p class="eyebrow">♡ GAME GIFTS</p><h1 style="font-size:clamp(30px,5vw,52px)">${esc(copy().favorites)}</h1></div></div>${games.length ? `<div class="games-grid">${games.map(gameCard).join("")}</div>` : ""}${rewards.length ? `<div class="section-head"><div class="section-heading"><span class="heading-icon">✦</span><h2>${esc(copy().today)}</h2></div></div><div class="reward-list">${rewards.map((reward, index) => rewardCard(reward, gameFor(reward.game_slug), index + 1)).join("")}</div>` : (!games.length ? emptyState(copy().noRewards, copy().noRewardsCopy, "♡") : "")}`;
};
const renderMore = () => `<div class="page-top"><a href="${pathFor("home")}" data-route class="back-link">‹ ${esc(copy().home)}</a></div><div class="section-head" style="margin-top:0"><div><p class="eyebrow">••• GAME GIFTS</p><h1 style="font-size:clamp(30px,5vw,52px)">${esc(copy().about)}</h1></div></div><div class="more-grid"><section class="info-card"><h2>${esc(copy().about)}</h2><p>${esc(copy().aboutCopy)}</p></section><section class="info-card"><h2>${esc(copy().how)}</h2><ul>${copy().howItems.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section><section class="info-card"><h2>${esc(copy().admin)}</h2><p>${esc(copy().adminCopy)}</p><a class="admin-link" href="${pathFor("admin")}" data-route>→ ${esc(copy().admin)}</a></section></div>`;

const adminGameForm = () => { const game = state.admin?.games.find((item) => Number(item.id) === Number(state.editGameId)); return `<form id="game-form" class="admin-card" data-edit-game-id="${game?.id || ""}"><h2>${game ? "Editar jogo" : "+ Adicionar jogo"}</h2><div class="field-grid"><div class="field"><label>Nome do jogo *</label><input name="name" required value="${esc(game?.name)}" placeholder="Match Masters" /></div><div class="field"><label>Slug *</label><input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value="${esc(game?.slug)}" placeholder="match-masters" /></div><div class="field"><label>Modo de recompensa</label><select name="reward_mode"><option value="links" ${game?.reward_mode === "links" ? "selected" : ""}>LINKS</option><option value="codes" ${game?.reward_mode === "codes" ? "selected" : ""}>CÓDIGOS</option><option value="none" ${game?.reward_mode === "none" ? "selected" : ""}>SEM RECOMPENSA</option></select></div><div class="field"><label>Imagem / capa (URL)</label><input name="image" type="url" value="${esc(game?.image)}" placeholder="URL pública da imagem" /></div><div class="field"><label>Banner (URL)</label><input name="banner" type="url" value="${esc(game?.banner)}" placeholder="URL pública do banner" /></div><div class="field full"><label>Descrição curta</label><textarea name="description" placeholder="Uma frase sobre o jogo">${esc(game?.description)}</textarea></div></div><label class="check-field"><input name="active" type="checkbox" ${game?.active !== false ? "checked" : ""} /> Jogo ativo na Home</label><div style="display:flex;gap:8px"><button class="primary-button" type="submit">${game ? "Salvar alterações" : "Publicar jogo"}</button>${game ? `<button class="outline-button" type="button" data-admin-cancel-edit>Cancelar</button>` : ""}</div></form>`; };
const adminRewardForm = () => `<form id="reward-form" class="admin-card"><h2>+ Novo presente</h2><div class="admin-note">Links e códigos entram como NÃO CONFIRMADO. Só use CONFIRMADO quando a fonte original permitir comprovar a recompensa. Para CÓDIGOS, informe o código exato e o destino oficial.</div><div class="field-grid"><div class="field full"><label>Jogo *</label><select name="game_id" required><option value="">Selecione um jogo</option>${state.admin.games.map((game) => `<option value="${game.id}">${esc(game.name)} · ${esc(game.reward_mode || "links")}</option>`).join("")}</select></div><div class="field full"><label>Destino oficial / link da recompensa *</label><input name="url" type="url" placeholder="https://..." /></div><div class="field full"><label>Código exato (somente jogos CÓDIGOS)</label><input name="reward_code" placeholder="Não invente nem complete códigos" /></div><div class="field"><label>Nome / recompensa informada</label><input name="name" placeholder="Deixe vazio se a fonte não informar" /></div><div class="field"><label>Tipo</label><input name="type" placeholder="Somente se informado pela fonte" /></div><div class="field"><label>Quantidade</label><input name="quantity" placeholder="Somente se informado pela fonte" /></div><div class="field"><label>Fonte original</label><input name="source" placeholder="Página ou publicação original" /></div><div class="field"><label>Data encontrada *</label><input name="date_key" type="date" required value="${todayKey()}" /></div><div class="field"><label>Horário encontrado</label><input name="time_label" type="time" /></div><div class="field full"><label>Imagem original (URL)</label><input name="image" type="url" placeholder="URL pública da imagem" /></div><div class="field full"><label>Ou enviar imagem</label><input name="image_file" type="file" accept="image/*" /></div><div class="field"><label>Status *</label><select name="status"><option value="unconfirmed">🟡 NÃO CONFIRMADO</option><option value="confirmed">🟢 CONFIRMADO</option><option value="expired_invalid">🔴 EXPIRADO / INVÁLIDO</option></select></div></div><button class="primary-button" type="submit">Publicar presente</button></form>`;
const adminSourceForm = () => { const source = state.admin?.sources.find((item) => Number(item.id) === Number(state.editSourceId)); return `<form id="source-form" class="admin-card" data-edit-source-id="${source?.id || ""}"><h2>${source ? "Editar fonte" : "+ Adicionar fonte"}</h2><div class="admin-note">A fonte precisa ser pública e pertencer a um único jogo. A coleta acontece somente no servidor.</div><div class="field-grid"><div class="field full"><label>Jogo *</label><select name="game_id" required><option value="">Selecione um jogo</option>${state.admin.games.map((game) => `<option value="${game.id}" ${Number(source?.game_id) === Number(game.id) ? "selected" : ""}>${esc(game.name)}</option>`).join("")}</select></div><div class="field"><label>Nome da fonte *</label><input name="name" required value="${esc(source?.name)}" placeholder="Nome da publicação" /></div><div class="field"><label>Tipo de parser</label><select name="parser_type"><option value="html_links" ${source?.parser_type === "html_links" ? "selected" : ""}>HTML · links</option><option value="json_links" ${source?.parser_type === "json_links" ? "selected" : ""}>JSON · links</option><option value="direct_url" ${source?.parser_type === "direct_url" ? "selected" : ""}>URL direta</option><option value="html_codes" ${source?.parser_type === "html_codes" ? "selected" : ""}>HTML · códigos</option><option value="json_codes" ${source?.parser_type === "json_codes" ? "selected" : ""}>JSON · códigos</option><option value="direct_code" ${source?.parser_type === "direct_code" ? "selected" : ""}>Código direto</option></select></div><div class="field full"><label>URL pública da fonte *</label><input name="url" type="url" required value="${esc(source?.url)}" placeholder="https://..." /></div></div><label class="check-field"><input name="active" type="checkbox" ${source?.active !== false ? "checked" : ""} /> Fonte ativa</label><div style="display:flex;gap:8px"><button class="primary-button" type="submit">${source ? "Salvar fonte" : "Adicionar fonte"}</button>${source ? `<button class="outline-button" type="button" data-admin-cancel-source-edit>Cancelar</button>` : ""}</div></form>`; };
const collectionResultView = () => { const result = state.collectionResult; if (!result) return ""; return `<section class="admin-card collection-result"><div class="admin-card-heading"><h2>Resultado da coleta</h2><span class="status-pill ${result.sources_failed ? "expired" : ""}">${result.sources_failed ? "Com erros" : "Concluída"}</span></div><p>${result.sources_consulted} fonte(s) consultada(s) · ${result.candidate_links} candidato(s) · ${result.new_links_saved} novo(s) · ${result.duplicates_ignored} duplicado(s)</p>${result.results?.length ? `<div class="admin-list">${result.results.map((item) => `<div class="admin-row"><div><strong>${esc(item.name)}</strong><small>${item.http_status ? `HTTP ${item.http_status}` : "Sem resposta HTTP"} · ${item.links_found} encontrado(s) · ${item.new_links_saved} novo(s)</small>${item.diagnostics?.length ? `<div class="collection-diagnostics">${item.diagnostics.map((entry) => `<small>${entry.quantity ? `${esc(entry.quantity)} energia` : "Energia grátis"} · fonte ${esc(entry.source_date || "não informada")} · ${esc(entry.original_url || entry.discovered_url || "URL não informada")} → ${esc(entry.final_url || "sem URL final")} · ${esc(entry.reward_key || "sem reward_key")} · ${esc(entry.outcome || "não salvo")}</small>`).join("")}</div>` : ""}</div><small class="${item.error ? "source-error" : "source-success"}">${esc(item.error || "Sucesso")}</small></div>`).join("")}</div>` : `<p class="admin-note">Nenhuma fonte ativa foi cadastrada. Resultado real: zero fontes consultadas e zero links encontrados.</p>`}</section>`; };
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
const renderAdmin = async () => {
  app.innerHTML = `<div class="loading">Carregando área administrativa…</div>`;
  try {
    const session = await api("/api/admin/session");
    if (!session.isOwner) { app.innerHTML = `<div class="admin-shell">${emptyState("Área restrita", "A administração está disponível apenas para o proprietário deste projeto.", "⌁")}<p style="text-align:center;margin-top:18px"><a class="back-link" href="${pathFor("home")}" data-route>‹ ${esc(copy().home)}</a></p></div>`; return; }
    state.admin = await api("/api/admin/data");
    app.innerHTML = `<div class="admin-shell"><div class="admin-heading"><div><p class="eyebrow">✦ GAME GIFTS</p><h1>Admin central</h1><p>Gerencie jogos, fontes e presentes publicados.</p></div><div class="admin-heading-actions"><button class="primary-button" type="button" data-admin-collect>BUSCAR AGORA</button><a class="outline-button" href="${pathFor("home")}" data-route>Ver site ↗</a></div></div><div class="admin-note">A coleta automática verifica as fontes periodicamente no servidor e também é acionada quando o catálogo é atualizado. Links e códigos expirados permanecem registrados internamente para não serem publicados novamente.</div>${collectionResultView()}<div class="admin-columns"><div>${adminGameForm()}${adminSourceForm()}${adminRewardForm()}</div><div><section class="admin-card"><h2>Fontes <small style="color:var(--muted);font-size:12px">${state.admin.sources.length}</small></h2><div class="admin-list">${state.admin.sources.map((source) => `<div class="admin-row source-row"><div><strong>${esc(source.game_name)} · ${esc(source.name)}</strong><small>${esc(source.url)} · ${source.active ? "ativa" : "inativa"} · ${esc(source.parser_type)}</small><small>Última checagem: ${esc(source.last_checked_at || "nunca")} · Último sucesso: ${esc(source.last_success_at || "nunca")}</small>${source.last_error ? `<small class="source-error">Erro: ${esc(source.last_error)}</small>` : ""}</div><div class="admin-row-actions"><button class="small-button ${source.active ? "active" : ""}" data-admin-source-active="${source.id}" data-active="${source.active}">${source.active ? "Ativa" : "Inativa"}</button><button class="small-button" data-admin-test-source="${source.id}">Testar</button><button class="small-button" data-admin-edit-source="${source.id}">Editar</button><button class="small-button danger" data-admin-delete-source="${source.id}">Excluir</button></div></div>`).join("") || emptyState("Nenhuma fonte", "Cadastre uma fonte pública real para iniciar a coleta.")}</div></section><section class="admin-card"><h2>Jogos cadastrados <small style="color:var(--muted);font-size:12px">${state.admin.games.length}</small></h2><div class="admin-list">${state.admin.games.map((game) => `<div class="admin-row"><div><strong>${esc(game.name)}</strong><small>/${esc(game.slug)} · ${game.active ? "ativo" : "inativo"}</small></div><div class="admin-row-actions"><button class="small-button ${game.active ? "active" : ""}" data-admin-game-active="${game.id}" data-active="${game.active}">${game.active ? "Ativo" : "Inativo"}</button><button class="small-button" data-admin-edit-game="${game.id}">Editar</button></div></div>`).join("") || emptyState("Nenhum jogo", "Adicione o primeiro jogo.")}</div></section><section class="admin-card"><h2>Presentes cadastrados <small style="color:var(--muted);font-size:12px">${state.admin.rewards.length}</small></h2><div class="admin-list">${state.admin.rewards.map((reward) => `<div class="admin-row"><div><strong>${esc(reward.game_name)} · ${esc(reward.name || "Recompensa não confirmada")}</strong><small>${esc(reward.date_key)} · ${esc(reward.type || "sem tipo")}${reward.quantity ? ` · ${esc(reward.quantity)}` : ""}</small></div><div class="admin-row-actions"><select class="small-button" data-admin-reward-status="${reward.id}" aria-label="Status"><option value="problem_unconfirmed" ${adminStatusValue(reward) === "problem_unconfirmed" ? "selected" : ""}>🟠 Link com problema / não confirmado</option><option value="unconfirmed" ${adminStatusValue(reward) === "unconfirmed" ? "selected" : ""}>🟡 Não confirmado</option><option value="confirmed" ${adminStatusValue(reward) === "confirmed" ? "selected" : ""}>🟢 Confirmado</option><option value="expired_invalid" ${adminStatusValue(reward) === "expired_invalid" ? "selected" : ""}>🔴 Expirado / inválido</option></select><button class="small-button danger" data-admin-delete-reward="${reward.id}">Excluir</button></div></div>`).join("") || emptyState("Nenhum presente", "Os links coletados aparecerão aqui.")}</div></section><section class="admin-card"><h2>Log da coleta</h2><div class="admin-list">${state.admin.logs.map((log) => `<div class="admin-row"><div><strong>${esc(log.source_name || "Execução geral")}</strong><small>${esc(log.started_at)} · HTTP ${esc(log.http_status || "—")} · ${log.links_found} candidatos · ${log.new_links_saved} novos · ${log.duplicates_ignored} duplicados</small></div><small class="${log.error ? "source-error" : "source-success"}">${esc(log.error || "Sucesso")}</small></div>`).join("") || `<p class="admin-muted">Nenhuma execução registrada.</p>`}</div></section></div></div></div>`;
  } catch (error) { app.innerHTML = `<div class="admin-shell">${emptyState("Admin indisponível", error.message, "!")}</div>`; }
};
const renderPage = () => {
  const current = route();
  state.lang = current.lang;
  document.body.classList.toggle("coin-master-page", current.page === "game" && current.slug === "coin-master");
  document.body.classList.toggle("home-page", current.page === "home");
  renderChrome();
  updateSeo(current);
  document.querySelectorAll("[data-nav]").forEach((node) => node.classList.toggle("active", node.dataset.nav === current.page || (node.dataset.nav === "games" && current.page === "game")));
  if (current.page === "admin") return renderAdmin();
  if (current.page === "game") { const game = gameFor(current.slug); if (game && isPublicVisibleGame(game)) { app.innerHTML = renderGame(game); decorateGamePage(game); } else app.innerHTML = emptyState(copy().noGames, copy().noGamesCopy); return; }
  if (current.page === "games") { app.innerHTML = renderGames(); return; }
  if (current.page === "news") { app.innerHTML = renderNews(); return; }
  if (current.page === "favorites") { app.innerHTML = renderFavorites(); return; }
  if (current.page === "more") { app.innerHTML = renderMore(); return; }
  app.innerHTML = renderHome();
};
const resolveViewerKey = async () => {
  try {
    const user = await window.websim?.getUser?.();
    if (user?.id) { state.viewerKey = `user-${user.id}`; return; }
    const bootstrap = await window.websim?.getBootstrap?.();
    if (bootstrap?.distinct_id) state.viewerKey = `visitor-${bootstrap.distinct_id}`;
  } catch {}
};
const refresh = async () => { try { await resolveViewerKey(); state.data = await api("/api/data"); renderPage(); } catch (error) { app.innerHTML = emptyState("Não foi possível carregar", error.message, "!"); } };
const toast = (message) => { const node = document.querySelector("#toast"); node.textContent = message; node.classList.add("show"); clearTimeout(window.__ggToast); window.__ggToast = setTimeout(() => node.classList.remove("show"), 2600); };
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

document.addEventListener("click", async (event) => {
  const gameCardLink = event.target.closest("a.game-card");
  if (gameCardLink) {
    trackEvent("game_click", { game_name: gameCardLink.dataset.analyticsGameName, game_slug: gameCardLink.dataset.analyticsGameSlug });
    event.preventDefault(); go(gameCardLink.getAttribute("href")); return;
  }
  const routeLink = event.target.closest("a[data-route]");
  if (routeLink) { event.preventDefault(); go(routeLink.getAttribute("href")); return; }
  const copyButton = event.target.closest("[data-copy-url]");
  if (copyButton) {
    trackEvent("copy_link", { game_name: copyButton.dataset.analyticsGameName, gift_name: copyButton.dataset.analyticsGiftName, reward_id: copyButton.dataset.analyticsRewardId });
    await copyRewardLink(copyButton.dataset.copyUrl); return;
  }
  const copyCode = event.target.closest("[data-copy-code]");
  if (copyCode) { await copyRewardLink(copyCode.dataset.copyCode, copy().copiedCode || copy().copied); return; }
  const favorite = event.target.closest("[data-favorite-type]");
  if (favorite) { toggleFavorite(favorite.dataset.favoriteType, favorite.dataset.favoriteId); return; }
  const opener = event.target.closest("[data-open-reward]");
  if (opener) {
    trackEvent("gift_open", { game_name: opener.dataset.analyticsGameName, gift_name: opener.dataset.analyticsGiftName, reward_id: opener.dataset.analyticsRewardId });
    markOpened(opener.dataset.openReward); setTimeout(() => renderPage(), 0); return;
  }
  const redeemer = event.target.closest("[data-redeem-reward]");
  if (redeemer) {
    trackEvent("gift_redeem", { game_name: redeemer.dataset.analyticsGameName, gift_name: redeemer.dataset.analyticsGiftName, reward_id: redeemer.dataset.analyticsRewardId });
    return;
  }
  const claimed = event.target.closest("[data-mark-claimed]");
  if (claimed) { markClaimed(claimed.dataset.markClaimed); toast(claimedLabel()); renderPage(); return; }
  const tab = event.target.closest("[data-tab]");
  if (tab) { state.tab = tab.dataset.tab; state.selectedDate = ""; renderPage(); return; }
  const date = event.target.closest("[data-date]");
  if (date) { state.selectedDate = date.dataset.date; renderPage(); return; }
  if (event.target.closest("[data-admin-cancel-edit]")) { state.editGameId = null; renderAdmin(); return; }
  if (event.target.closest("[data-admin-cancel-source-edit]")) { state.editSourceId = null; renderAdmin(); return; }
  const edit = event.target.closest("[data-admin-edit-game]");
  if (edit) { state.editGameId = edit.dataset.adminEditGame; renderAdmin(); return; }
  const sourceEdit = event.target.closest("[data-admin-edit-source]");
  if (sourceEdit) { state.editSourceId = sourceEdit.dataset.adminEditSource; renderAdmin(); return; }
  const collect = event.target.closest("[data-admin-collect]");
  if (collect) { collect.disabled = true; collect.textContent = "COLETANDO…"; try { state.collectionResult = await api("/api/admin/collect", { method: "POST", headers: { "content-type": "application/json" }, body: "{}" }); toast(`${state.collectionResult.new_links_saved} novo(s), ${state.collectionResult.duplicates_ignored} duplicado(s).`); await renderAdmin(); } catch (error) { toast(error.message); collect.disabled = false; collect.textContent = "BUSCAR AGORA"; } return; }
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
  if (event.target.matches("#language-select")) { localStorage.setItem("game-gifts-language", event.target.value); const current = route(); const destination = current.page === "game" ? pathFor("games", current.slug, event.target.value) : pathFor(current.page, "", event.target.value); go(destination); return; }
  if (event.target.matches("[data-admin-reward-status]")) { try { await api(`/api/admin/rewards/${event.target.dataset.adminRewardStatus}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: event.target.value }) }); toast("Status do presente atualizado."); } catch (error) { toast(error.message); } }
});
document.addEventListener("submit", async (event) => {
  if (event.target.matches("#game-form")) { event.preventDefault(); const form = new FormData(event.target); const body = Object.fromEntries(form.entries()); body.active = form.get("active") === "on"; try { const id = event.target.dataset.editGameId; await api(id ? `/api/admin/games/${id}` : "/api/admin/games", { method: id ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); state.editGameId = null; toast("Jogo salvo."); await refresh(); renderAdmin(); } catch (error) { toast(error.message); } return; }
  if (event.target.matches("#source-form")) { event.preventDefault(); const form = new FormData(event.target); const body = Object.fromEntries(form.entries()); body.active = form.get("active") === "on"; try { const id = event.target.dataset.editSourceId; await api(id ? `/api/admin/sources/${id}` : "/api/admin/sources", { method: id ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); state.editSourceId = null; state.collectionResult = null; toast("Fonte salva."); renderAdmin(); } catch (error) { toast(error.message); } return; }
  if (event.target.matches("#reward-form")) { event.preventDefault(); const form = new FormData(event.target); let image = String(form.get("image") || ""); try { if (!image) image = await uploadIfPresent(event.target.querySelector('[name="image_file"]')); const body = Object.fromEntries(form.entries()); delete body.image_file; body.image = image; await api("/api/admin/rewards", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); toast("Presente publicado."); await refresh(); renderAdmin(); } catch (error) { toast(error.message); } }
});
let searchTrackingTimer;
document.querySelector("#global-search")?.addEventListener("input", (event) => {
  state.search = event.target.value;
  const current = route();
  if (current.page === "home" || current.page === "games") renderPage();
  clearTimeout(searchTrackingTimer);
  const searchTerm = event.target.value.trim();
  if (searchTerm) searchTrackingTimer = setTimeout(() => trackEvent("search", { search_term: searchTerm, game_name: searchTerm }), 500);
});
window.addEventListener("popstate", () => { const current = route(); state.lang = current.lang; renderPage(); });
window.addEventListener("pageshow", () => { if (route().page === "game") renderPage(); });
document.addEventListener("visibilitychange", () => { if (!document.hidden && route().page === "game") renderPage(); });
if (document.querySelector("#language-select")) document.querySelector("#language-select").value = state.lang;
refresh();
window.setInterval(() => { if (!document.hidden) refresh(); }, 5 * 60 * 1000);
