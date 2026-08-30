import { restoreBrands } from "@/lib/brands";

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
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, " ");
}

export function parseProductTitle(raw: string): ParsedTitle {
  const restored = restoreBrands(decodeEntities(raw).replace(/\s+/g, " ").trim());
  const sale = restored.match(/[￥¥]\s*(\d+)\s*←\s*(\d+)/);
  const prices = [...restored.matchAll(/[￥¥]\s*(\d+)/g)].map((m) => Number(m[1]));
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
    .replace(/[￥¥]\s*\d+\s*←\s*\d+/g, " ")
    .replace(/[￥¥]\s*\d+/g, " ")
    .replace(/\bTOP\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatYuan(amount: number) {
  return `¥${amount}`;
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
