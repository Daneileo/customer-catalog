import "server-only";

import * as cheerio from "cheerio";
import { getShopSource, type ShopSource } from "@/lib/shop-sources";
import type { ShopSlug } from "@/lib/shops";
import { parseProductTitle, sanitizeCopy } from "@/lib/titles";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export type CatalogItem = {
  id: string;
  shop: ShopSlug;
  title: string;
  photoCount: number;
  coverSrc: string;
  price?: number;
  originalPrice?: number;
};

export type CatalogPhoto = {
  thumbSrc: string;
  largeSrc: string;
  width?: number;
  height?: number;
};

export type CatalogPage = {
  items: CatalogItem[];
  page: number;
  pageCount: number;
  categories: { id: string; name: string }[];
};

export type ItemDetail = {
  id: string;
  shop: ShopSlug;
  title: string;
  description: string;
  photos: CatalogPhoto[];
  page: number;
  pageCount: number;
  photoCount: number;
};

export class CatalogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogError";
  }
}

const SKIP_ALBUM =
  /^(?:new yupoo|discord|whatsapp\b|how to use\b)/i;

export function isHiddenAlbum(title: string) {
  const normalized = title.replace(/[🔥\s]+/g, " ").trim();
  return SKIP_ALBUM.test(normalized);
}

function proxySrc(shop: ShopSource, url: string | undefined | null) {
  if (!url) return null;
  try {
    const parsed = new URL(url, `https://${shop.host}`);
    if (parsed.hostname !== "photo.yupoo.com") return null;
    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts[0] !== shop.photoUser) return null;
    const rest = parts.slice(1).join("/");
    if (!rest || rest.includes("..")) return null;
    return `/api/img/${shop.slug}/${rest}`;
  } catch {
    return null;
  }
}

function preferMedium(src: string) {
  return src.replace(/\/small\./, "/medium.");
}

function preferBig(src: string) {
  return src.replace(/\/(?:small|medium)\./, "/big.");
}

async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
      Cookie: "language=en-US",
    },
    signal: AbortSignal.timeout(25000),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new CatalogError(`Catalog request failed (${res.status})`);
  }

  return res.text();
}

function parsePageCount($: cheerio.CheerioAPI) {
  const max = $("nav.pagination__main input[name='page']").attr("max");
  if (max && Number(max) > 0) return Number(max);
  const text = $("nav.pagination__main").text();
  const match = text.match(/(\d+)\s*(?:页|pages?)/i);
  return match ? Number(match[1]) : 1;
}

function parseCategories($: cheerio.CheerioAPI) {
  const categories = new Map<string, string>();

  $('a[href^="/categories/"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const id = href.match(/\/categories\/(\d+)/)?.[1];
    if (!id || id === "0") return;
    const name = $(el).text().replace(/\s+/g, " ").trim();
    if (!name) return;
    categories.set(id, name);
  });

  return [...categories.entries()].map(([id, name]) => ({ id, name }));
}

function parseItems($: cheerio.CheerioAPI, shop: ShopSource): CatalogItem[] {
  const items: CatalogItem[] = [];

  $("a.album__main").each((_, el) => {
    const href = $(el).attr("href") || "";
    const id = href.match(/\/albums\/(\d+)/)?.[1];
    if (!id) return;

    const title = (
      $(el).attr("title") ||
      $(el).find(".album__title").text() ||
      ""
    )
      .replace(/\s+/g, " ")
      .trim();
    if (!title || isHiddenAlbum(title)) return;

    const img =
      $(el).find("img.album__img").attr("src") ||
      $(el).find("img").attr("src") ||
      "";
    const coverSrc = proxySrc(shop, img);
    if (!coverSrc) return;

    const photoCount = Number(
      $(el).find(".album__photonumber").text().trim() || "0",
    );
    const parsed = parseProductTitle(title);

    items.push({
      id,
      shop: shop.slug,
      title,
      photoCount,
      coverSrc: preferMedium(coverSrc),
      price: parsed.salePrice ?? parsed.prices[0],
      originalPrice: parsed.originalPrice,
    });
  });

  return items;
}

function listingUrl(
  shop: ShopSource,
  kind: "albums" | "category" | "search",
  page: number,
  extra?: { categoryId?: string; query?: string },
) {
  const url = new URL(`https://${shop.host}/albums`);
  if (kind === "category" && extra?.categoryId) {
    url.pathname = `/categories/${extra.categoryId}`;
  }
  if (kind === "search") {
    url.pathname = "/search/album";
    url.searchParams.set("q", extra?.query || "");
  }
  if (page > 1) url.searchParams.set("page", String(page));
  return url.toString();
}

async function loadListing(
  shop: ShopSource,
  kind: "albums" | "category" | "search",
  page: number,
  extra?: { categoryId?: string; query?: string },
): Promise<CatalogPage> {
  const html = await fetchHtml(listingUrl(shop, kind, page, extra));
  const $ = cheerio.load(html);
  return {
    items: parseItems($, shop),
    page,
    pageCount: Math.max(1, parsePageCount($)),
    categories: parseCategories($),
  };
}

export async function getAlbumIndex(slug: ShopSlug, page = 1) {
  const shop = getShopSource(slug);
  if (!shop) throw new CatalogError("Unknown catalog");
  return loadListing(shop, "albums", page);
}

export async function getCategoryPage(
  slug: ShopSlug,
  categoryId: string,
  page = 1,
) {
  const shop = getShopSource(slug);
  if (!shop) throw new CatalogError("Unknown catalog");
  if (!/^\d+$/.test(categoryId)) throw new CatalogError("Unknown category");
  return loadListing(shop, "category", page, { categoryId });
}

export async function searchCatalog(slug: ShopSlug, query: string, page = 1) {
  const shop = getShopSource(slug);
  if (!shop) throw new CatalogError("Unknown catalog");
  const q = query.trim();
  if (!q) {
    return getAlbumIndex(slug, page);
  }
  return loadListing(shop, "search", page, { query: q });
}

function parsePhotos($: cheerio.CheerioAPI, shop: ShopSource): CatalogPhoto[] {
  const photos: CatalogPhoto[] = [];

  $(".image__main img.image__img").each((_, el) => {
    const origin = $(el).attr("data-origin-src");
    const large = $(el).attr("data-src") || origin;
    const thumb = $(el).attr("src");
    const largeSrc = proxySrc(shop, origin || large);
    const thumbSrc = proxySrc(shop, thumb || large);
    if (!largeSrc || !thumbSrc) return;

    const width = Number($(el).attr("data-width") || "");
    const height = Number($(el).attr("data-height") || "");

    photos.push({
      thumbSrc: preferMedium(thumbSrc),
      largeSrc: preferBig(largeSrc),
      width: Number.isFinite(width) && width > 0 ? width : undefined,
      height: Number.isFinite(height) && height > 0 ? height : undefined,
    });
  });

  return photos;
}

async function fetchAlbumPage(shop: ShopSource, id: string, page: number) {
  const url = new URL(`https://${shop.host}/albums/${id}`);
  url.searchParams.set("uid", "1");
  if (page > 1) url.searchParams.set("page", String(page));
  return fetchHtml(url.toString());
}

export async function getItem(slug: ShopSlug, id: string): Promise<ItemDetail> {
  const shop = getShopSource(slug);
  if (!shop) throw new CatalogError("Unknown catalog");
  if (!/^\d+$/.test(id)) throw new CatalogError("Unknown item");

  const firstHtml = await fetchAlbumPage(shop, id, 1);
  const $ = cheerio.load(firstHtml);

  const title = (
    $(".showalbumheader__gallerytitle").first().text() ||
    $("h1.visually-hidden").first().text() ||
    $("title").text().split("|")[0] ||
    ""
  )
    .replace(/\s+/g, " ")
    .trim();

  if (!title || isHiddenAlbum(title)) {
    throw new CatalogError("Item not found");
  }

  const description = sanitizeCopy(
    $(".showalbumheader__gallerysubtitle").first().text(),
  );
  const pageCount = Math.max(1, parsePageCount($));
  const photos = parsePhotos($, shop);

  if (pageCount > 1) {
    const rest = await Promise.all(
      Array.from({ length: Math.min(pageCount, 8) - 1 }, (_, i) =>
        fetchAlbumPage(shop, id, i + 2),
      ),
    );
    for (const html of rest) {
      photos.push(...parsePhotos(cheerio.load(html), shop));
    }
  }

  const countText = $(".showalbumheader__gallerydec h1 span").last().text();
  const photoCount = Number(countText.replace(/[^\d]/g, "")) || photos.length;

  return {
    id,
    shop: shop.slug,
    title,
    description,
    photos,
    page: 1,
    pageCount,
    photoCount,
  };
}

export function pageHref(
  pathname: string,
  page: number,
  query?: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${pathname}?${params.toString()}` : pathname;
}
