import { decipherCopy } from "@/lib/decipher-brands";

export type ParsedTitle = {
  raw: string;
  headline: string;
  prices: number[];
  salePrice?: number;
  originalPrice?: number;
  sku?: string;
  note?: string;
};

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x3D;/gi, "=")
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, " ");
}

export function parseProductTitle(raw: string): ParsedTitle {
  const restored = decipherCopy(decodeEntities(raw).replace(/\s+/g, " ").trim());
  const sale = restored.match(/[￥¥]\s*~?\s*(\d+)\s*(?:⬅️|←)\s*[￥¥]?\s*(\d+)/);
  const prices = [...restored.matchAll(/[￥¥]\s*~?\s*(\d+)/g)].map((m) =>
    Number(m[1]),
  );
  const title = stripYenPrices(restored);
  const noteMatch = title.match(/[（(]([^）)]+)[）)]\s*$/);
  const note = noteMatch?.[1]?.trim();
  const withoutNote = note
    ? title.slice(0, title.lastIndexOf(noteMatch![0])).trim()
    : title;

  const skuMatch = withoutNote.match(/(\d{5,})\s*$/);

  return {
    raw: title,
    headline: withoutNote.replace(/^(SALE\s*)?(?:🔥\s*)+/i, "").trim() || title,
    prices,
    salePrice: sale ? Number(sale[1]) : prices[0],
    originalPrice: sale ? Number(sale[2]) : undefined,
    sku: skuMatch?.[1],
    note,
  };
}

export function stripYenPrices(value: string) {
  return value
    .replace(/[￥¥]\s*~?\s*\d+\s*(?:⬅️|←)\s*[￥¥]?\s*\d+/g, " ")
    .replace(/\d+\s*[￥¥]\s*(?:⬅️|←)\s*[￥¥]?\s*\d+/g, " ")
    .replace(/[￥¥]\s*\d+\s*~\s*\d+/g, " ")
    .replace(/[￥¥]\s*~\s*\d+/g, " ")
    .replace(/[￥¥]\s*\d+\s*~/g, " ")
    .replace(/[￥¥]\s*~/g, " ")
    .replace(/[￥¥]\s*\d+/g, " ")
    .replace(/\d+\s*[￥¥]/g, " ")
    .replace(/\d+\s*Y(?=[\s【[\]|$])/gi, " ")
    .replace(/[￥¥]/g, " ")
    .replace(/⬅️|←/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const BLOCKED_HOST =
  /\b(?:yupoo\.com|weidian\.com|taobao\.com|tmall\.com|1688\.com)\b/i;

export function sanitizeCopy(text: string) {
  const cleaned = decodeEntities(text)
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/\b[\w.-]+\.x\.yupoo\.com\S*/gi, " ")
    .replace(BLOCKED_HOST, " ")
    .replace(/🔥{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || BLOCKED_HOST.test(cleaned)) return "";
  return cleaned;
}

export function formatYen(price?: number) {
  if (price == null || !Number.isFinite(price) || price <= 0) return null;
  return `¥${price}`;
}

export function extractHttpLinks(text: string) {
  const found = decodeEntities(text).match(/https?:\/\/[^\s<>"']+/gi) ?? [];
  const cleaned = found.map((url) => url.replace(/[.,);]+$/g, ""));
  return [...new Set(cleaned)];
}

export function restoreCopy(text: string) {
  return decipherCopy(decodeEntities(text).replace(/\s+/g, " ")).trim();
}
