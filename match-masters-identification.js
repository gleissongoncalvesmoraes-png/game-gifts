// Isolated, read-only identification layer for future Match Masters links.
// It deliberately does not call the collector, open reward URLs, or persist data.

const TYPE_RULES = Object.freeze([
  ["tokens", /\b(?:token|tokens|ficha|fichas)\b/i],
  ["tickets", /\b(?:ticket|tickets|bilhete|bilhetes)\b/i],
  ["boosters", /\b(?:booster|boosters|reforço|reforços)\b/i],
  ["stickers", /\b(?:sticker|stickers|adesivo|adesivos)\b/i],
  ["gems", /\b(?:diamond|diamonds|diamante|diamantes|gem|gems|gema|gemas)\b/i],
  ["rubies", /\b(?:ruby|rubies|rubi|rubis)\b/i],
  ["energy", /\b(?:energy|energia)\b/i],
  ["coins", /\b(?:coin|coins|moeda|moedas)\b/i],
  ["credits", /\b(?:credit|credits|crédito|créditos)\b/i],
  ["rolls", /\b(?:roll|rolls|giro|giros|spin|spins|tirada|tiradas)\b/i],
  ["dice", /\b(?:dice|dado|dados)\b/i],
  ["packs", /\b(?:pack|packs|pacote|pacotes)\b/i],
]);
const GENERIC_TYPE = /^(?:link|reward|recompensa|presente|gift)$/i;

const valueText = (value) => String(value ?? "").trim();
const evidenceText = (reward) => [reward?.name, reward?.reward_description, reward?.source_excerpt, reward?.source].map(valueText).filter(Boolean).join(" · ");
const manualRecord = (reward) => /\bGG_MANUAL:[a-z0-9-]+/i.test(valueText(reward?.reward_description));
const findType = (text) => TYPE_RULES.find(([, pattern]) => pattern.test(text))?.[0] || "";
const typePattern = (typeKey) => TYPE_RULES.find(([key]) => key === typeKey)?.[1] || null;
const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const quantityIsSupported = (quantity, typeKey, evidence, reward) => {
  if (!quantity) return false;
  if (reward?.quantity_confirmed === true || Number(reward?.quantity_confirmed) === 1) return true;
  const pattern = typePattern(typeKey);
  if (!pattern) return false;
  const amountPattern = new RegExp(`\\b${escaped(quantity)}\\b`, "i");
  const explicitMetadata = [reward?.reward_type, reward?.type, reward?.reward_amount, reward?.quantity].map(valueText).filter(Boolean).join(" ");
  const typeInEvidence = pattern.test(evidence);
  return (amountPattern.test(evidence) && typeInEvidence) || (amountPattern.test(explicitMetadata) && (pattern.test(explicitMetadata) || typeInEvidence));
};

export const identifyMatchMastersReward = (reward = {}) => {
  if (manualRecord(reward)) return { kind: "manual", typeKey: "", amount: "", evidence: "manual-record" };
  const explicitType = valueText(reward.reward_type || reward.type);
  const sourceEvidence = evidenceText(reward);
  const typeKey = !GENERIC_TYPE.test(explicitType) ? findType(explicitType) : "";
  const identifiedType = typeKey || findType(sourceEvidence);
  const rawAmount = valueText(reward.reward_amount || reward.quantity);
  const amount = /^\d[\d,.]*$/.test(rawAmount) && quantityIsSupported(rawAmount, identifiedType, sourceEvidence, reward) ? rawAmount : "";
  if (!identifiedType) return { kind: "unknown", typeKey: "", amount: "", evidence: "insufficient-evidence" };
  return {
    kind: "identified",
    typeKey: identifiedType,
    amount,
    evidence: typeKey ? "explicit-type" : "source-text",
    quantityEvidence: Boolean(amount),
  };
};
