import { restoreBrands } from "@/lib/brands";

export function normalizeSearchText(value: string) {
  return restoreBrands(value)
    .toLowerCase()
    .replace(/['’`]/g, "")
    .replace(/[🔥⭐★☆✦]/g, "")
    .replace(/[￥¥]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesCatalogQuery(title: string, query: string) {
  const hay = normalizeSearchText(title);
  const needle = normalizeSearchText(query);
  if (!hay || !needle) return false;
  if (hay.includes(needle)) return true;

  const tokens = needle.split(" ").filter((token) => token.length >= 2);
  if (tokens.length < 2) return false;
  return tokens.every((token) => hay.includes(token));
}

export function itemMatchesQuery(
  item: { title: string; id?: string },
  query: string,
) {
  if (matchesCatalogQuery(item.title, query)) return true;
  const needle = normalizeSearchText(query);
  return Boolean(item.id && needle === item.id);
}

export function categoryFitsQuery(name: string, query: string) {
  const n = normalizeSearchText(name);
  const q = normalizeSearchText(query);
  if (!n || !q) return false;
  if (q.length < 3) return n === q;
  return n.includes(q) || (n.length >= 4 && q.includes(n));
}

export function extractSku(query: string) {
  return query.match(/\d{5,}/)?.[0] ?? null;
}
