const PUBLISHER_ID = "ca-pub-1273561643159362";

// Keep all ad requests disabled until AdSense approves the site and real ad
// unit IDs are configured. This prevents fake banners and empty ad chrome.
const CONFIG = Object.freeze({
  enabled: false,
  publisherId: PUBLISHER_ID,
  slots: Object.freeze({}),
});

const safeKey = (value) => String(value || "").replace(/[^a-z0-9_-]/gi, "");
const preparedMarkup = (key) => `<div class="adsense-placement" data-adsense-placement="${safeKey(key)}" hidden aria-hidden="true"></div>`;

const mountApprovedSlots = () => {
  if (!CONFIG.enabled || !window.adsbygoogle) return;
  document.querySelectorAll("[data-adsense-placement]").forEach((node) => {
    if (node.dataset.adsenseMounted === "true") return;
    const slot = CONFIG.slots[node.dataset.adsensePlacement];
    if (!slot) return;
    node.hidden = false;
    node.removeAttribute("aria-hidden");
    node.innerHTML = `<ins class="adsbygoogle" style="display:block" data-ad-client="${PUBLISHER_ID}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      node.dataset.adsenseMounted = "true";
    } catch (error) {
      node.hidden = true;
      node.setAttribute("aria-hidden", "true");
      node.textContent = "";
      console.warn("Game Gifts: AdSense slot was not mounted.", error);
    }
  });
};

const preparePlacement = (target, key, position = "afterend") => {
  if (!target || document.querySelector(`[data-adsense-placement="${safeKey(key)}"]`)) return;
  target.insertAdjacentHTML(position, preparedMarkup(key));
};

const preparePlacements = () => {
  document.querySelectorAll("[data-ad-slot]").forEach((node) => {
    node.classList.add("adsense-placement");
    node.dataset.adsensePlacement = safeKey(node.dataset.adSlot);
    node.hidden = true;
    node.setAttribute("aria-hidden", "true");
  });
  preparePlacement(document.querySelector(".game-vertical-flow"), "game-content");
  preparePlacement(document.querySelector(".mm-news-section"), "match-masters-content");
  preparePlacement(document.querySelector(".events-page"), "events-content", "beforeend");
  preparePlacement(document.querySelector(".event-detail-page"), "event-detail-content", "beforeend");
  preparePlacement(document.querySelector(".portal-guide-detail"), "guide-detail-content", "beforeend");
  preparePlacement(document.querySelector(".portal-guide-list"), "guides-content");
  preparePlacement(document.querySelector(".portal-page:not(.events-page):not(.event-detail-page) .portal-reward-grid"), "long-list-content");
  mountApprovedSlots();
};

window.GameGiftsAdsense = Object.freeze({
  publisherId: CONFIG.publisherId,
  enabled: CONFIG.enabled,
  slots: CONFIG.slots,
  mount: mountApprovedSlots,
});

if (document.documentElement) {
  new MutationObserver(preparePlacements).observe(document.documentElement, { childList: true, subtree: true });
  preparePlacements();
}
