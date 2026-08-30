import "server-only";

import * as cheerio from "cheerio";
import { getShopSource, type ShopSource } from "@/lib/shop-sources";
import {
  STORES,
  type ShopSlug,
  type StoreSlug,
} from "@/lib/shops";
import {
  extractHttpLinks,
  parseProductTitle,
  restoreCopy,
  sanitizeCopy,
} from "@/lib/titles";
import { restoreBrands } from "@/lib/brands";
import { isBrandListing, sortBrandList } from "@/lib/category-nav";
import {
  categoryFitsQuery,
  extractSku,
  itemMatchesQuery,
} from "@/lib/search-match";

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
  sourceUrl?: string;
};

export type CatalogPhoto = {
  thumbSrc: string;
  largeSrc: string;
  width?: number;
  height?: number;
};

export type CatalogCategory = {
  id: string;
  name: string;
  sources: { shop: ShopSlug; id: string }[];
};

export type CatalogPage = {
  items: CatalogItem[];
  page: number;
  pageCount: number;
  categories: CatalogCategory[];
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
  sourceUrl: string;
  links: string[];
  price?: number;
  originalPrice?: number;
};

export class CatalogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CatalogError";
  }
}

const SKIP_ALBUM =
  /^(?:discord|whatsapp\b|how to use\b)/i;
const SKIP_CATEGORY = /^(?:临时隐藏|单独隐藏)$/;

export function isHiddenAlbum(title: string) {
  const normalized = title.replace(/[🔥\s]+/g, " ").trim();
  return SKIP_ALBUM.test(normalized) || /yupoo/i.test(normalized);
}

function isHiddenCategory(name: string) {
  const normalized = name.replace(/[🔥\s]+/g, " ").trim();
  return isHiddenAlbum(normalized) || SKIP_CATEGORY.test(normalized);
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

  $(".showheader__categoryList a[href^='/categories/']").each((_, el) => {
    const href = $(el).attr("href") || "";
    const id = href.match(/\/categories\/(\d+)/)?.[1];
    if (!id || id === "0") return;
    const name = restoreBrands($(el).text().replace(/\s+/g, " ").trim());
    if (!name || isHiddenCategory(name) || !isBrandListing(name)) return;
    categories.set(id, name);
  });

  return [...categories.entries()].map(([id, name]) => ({
    id,
    name,
    sources: [] as { shop: ShopSlug; id: string }[],
  }));
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

    const imgEl = $(el).find("img.album__img");
    const img =
      imgEl.attr("src") ||
      imgEl.attr("data-src") ||
      $(el).find("img").attr("src") ||
      $(el).find("img").attr("data-src") ||
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
      title: parsed.raw,
      photoCount,
      coverSrc: preferMedium(coverSrc),
      price: parsed.salePrice ?? parsed.prices[0],
      originalPrice: parsed.originalPrice,
      sourceUrl: `https://${shop.host}/albums/${id}`,
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
    categories: parseCategories($).map((category) => ({
      ...category,
      sources: [{ shop: shop.slug, id: category.id }],
    })),
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

export function categoryKey(name: string) {
  const key = name
    .toLowerCase()
    .replace(/🔥/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return key.slice(0, 80) || "category";
}

function sortCategories(categories: CatalogCategory[]): CatalogCategory[] {
  return sortBrandList(categories.filter((category) => isBrandListing(category.name)));
}

function mergeCategories(pages: CatalogPage[]): CatalogCategory[] {
  const map = new Map<string, CatalogCategory>();
  for (const page of pages) {
    for (const category of page.categories) {
      const id = categoryKey(category.name);
      const current = map.get(id);
      if (!current) {
        map.set(id, {
          id,
          name: category.name,
          sources: [...category.sources],
        });
        continue;
      }
      for (const source of category.sources) {
        if (
          !current.sources.some(
            (entry) => entry.shop === source.shop && entry.id === source.id,
          )
        ) {
          current.sources.push(source);
        }
      }
    }
  }
  return sortCategories([...map.values()]);
}

function combineListings(pages: CatalogPage[], page: number): CatalogPage {
  const seen = new Set<string>();
  const items: CatalogItem[] = [];
  for (const listing of pages) {
    for (const item of listing.items) {
      const key = `${item.shop}-${item.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(item);
    }
  }
  return {
    items,
    page,
    pageCount: Math.max(1, ...pages.map((listing) => listing.pageCount)),
    categories: mergeCategories(pages),
  };
}

async function loadStoreShops(
  store: StoreSlug,
  loader: (slug: ShopSlug) => Promise<CatalogPage>,
) {
  const settled = await Promise.allSettled(
    STORES[store].shops.map((slug) => loader(slug)),
  );
  const pages = settled.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );
  if (pages.length === 0) {
    throw new CatalogError("The product feed is temporarily unavailable.");
  }
  return pages;
}

export async function getStoreIndex(store: StoreSlug, page = 1) {
  const pages = await loadStoreShops(store, (slug) => getAlbumIndex(slug, page));
  return combineListings(pages, page);
}

export async function getStoreCategory(
  store: StoreSlug,
  slug: string,
  page = 1,
) {
  if (!slug) throw new CatalogError("Unknown category");
  const index = await getStoreIndex(store, 1);
  const category = index.categories.find((entry) => entry.id === slug);
  if (!category) throw new CatalogError("Unknown category");

  const pages = await loadStoreShops(store, async (shopSlug) => {
    const source = category.sources.find((entry) => entry.shop === shopSlug);
    if (!source) {
      return {
        items: [],
        page,
        pageCount: 1,
        categories: index.categories,
      };
    }
    const listing = await getCategoryPage(shopSlug, source.id, page);
    return listing;
  });

  const combined = combineListings(pages, page);
  return {
    ...combined,
    categories: index.categories,
  };
}

const SEARCH_PAGE_SIZE = 60;
const YUPOO_SEARCH_PAGES = 3;
const BRAND_SEARCH_PAGES = 3;
const TITLE_SCAN_PAGES = 8;

function uniqueItems(items: CatalogItem[]) {
  const seen = new Set<string>();
  const out: CatalogItem[] = [];
  for (const item of items) {
    const key = `${item.shop}-${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function titleHits(items: CatalogItem[], query: string) {
  return items.filter((item) => itemMatchesQuery(item, query));
}

async function searchShopPages(slug: ShopSlug, query: string, maxPages: number) {
  const first = await searchCatalog(slug, query, 1);
  const last = Math.min(maxPages, Math.max(1, first.pageCount));
  if (last === 1) return first.items;
  const rest = await Promise.all(
    Array.from({ length: last - 1 }, (_, i) => searchCatalog(slug, query, i + 2)),
  );
  return [first, ...rest].flatMap((listing) => listing.items);
}

async function loadBrandTitleHits(
  store: StoreSlug,
  categoryId: string,
  query: string,
) {
  const first = await getStoreCategory(store, categoryId, 1);
  const last = Math.min(BRAND_SEARCH_PAGES, Math.max(1, first.pageCount));
  const rest =
    last > 1
      ? await Promise.all(
          Array.from({ length: last - 1 }, (_, i) =>
            getStoreCategory(store, categoryId, i + 2),
          ),
        )
      : [];
  return titleHits([first, ...rest].flatMap((listing) => listing.items), query);
}

async function scanAlbumTitles(slug: ShopSlug, query: string) {
  const first = await getAlbumIndex(slug, 1);
  const last = Math.min(TITLE_SCAN_PAGES, Math.max(1, first.pageCount));
  const rest =
    last > 1
      ? await Promise.all(
          Array.from({ length: last - 1 }, (_, i) => getAlbumIndex(slug, i + 2)),
        )
      : [];
  return titleHits([first, ...rest].flatMap((listing) => listing.items), query);
}

function paginateSearch(items: CatalogItem[], page: number): Pick<
  CatalogPage,
  "items" | "page" | "pageCount"
> {
  const pageCount = Math.max(1, Math.ceil(items.length / SEARCH_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * SEARCH_PAGE_SIZE;
  return {
    items: items.slice(start, start + SEARCH_PAGE_SIZE),
    page: safePage,
    pageCount,
  };
}

export async function searchStore(store: StoreSlug, query: string, page = 1) {
  const q = query.trim();
  if (!q) return getStoreIndex(store, page);

  const index = await getStoreIndex(store, 1);
  const shops = STORES[store].shops;
  const sku = extractSku(q);
  const numericQuery = Boolean(sku && /^[\d\s]+$/.test(q));

  const yupooSettled = await Promise.allSettled(
    shops.map((slug) => searchShopPages(slug, q, YUPOO_SEARCH_PAGES)),
  );
  let hits = uniqueItems([
    ...titleHits(index.items, q),
    ...yupooSettled.flatMap((result) =>
      result.status === "fulfilled" ? titleHits(result.value, q) : [],
    ),
  ]);

  if (hits.length === 0 && sku && sku !== q) {
    const skuSettled = await Promise.allSettled(
      shops.map((slug) => searchShopPages(slug, sku, 2)),
    );
    hits = uniqueItems([
      ...hits,
      ...skuSettled.flatMap((result) =>
        result.status === "fulfilled"
          ? [...titleHits(result.value, q), ...titleHits(result.value, sku)]
          : [],
      ),
    ]);
  }

  if (hits.length === 0 && !numericQuery) {
    const brands = index.categories
      .filter((entry) => categoryFitsQuery(entry.name, q))
      .slice(0, 5);
    if (brands.length > 0) {
      const brandSettled = await Promise.allSettled(
        brands.map((category) => loadBrandTitleHits(store, category.id, q)),
      );
      hits = uniqueItems([
        ...hits,
        ...brandSettled.flatMap((result) =>
          result.status === "fulfilled" ? result.value : [],
        ),
      ]);
    }
  }

  if (hits.length === 0) {
    const scanned = await Promise.allSettled(
      shops.map((slug) => scanAlbumTitles(slug, q)),
    );
    hits = uniqueItems(
      scanned.flatMap((result) =>
        result.status === "fulfilled" ? result.value : [],
      ),
    );
  }

  return {
    ...paginateSearch(hits, page),
    categories: index.categories,
  };
}

export async function getCombinedIndex(page = 1) {
  return getStoreIndex("medved", page);
}

export async function getCombinedCategory(slug: string, page = 1) {
  return getStoreCategory("medved", slug, page);
}

export async function searchCombined(query: string, page = 1) {
  return searchStore("medved", query, page);
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

export async function getItem(
  slug: ShopSlug,
  id: string,
  options?: { master?: boolean },
): Promise<ItemDetail> {
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
  const parsed = parseProductTitle(title);
  const displayTitle = parsed.raw;

  if (!title || isHiddenAlbum(title)) {
    throw new CatalogError("Item not found");
  }

  const subtitle = $(".showalbumheader__gallerysubtitle").first().text();
  const description = options?.master
    ? restoreCopy(subtitle)
    : sanitizeCopy(subtitle);
  const sourceUrl = `https://${shop.host}/albums/${id}`;
  const links = [
    sourceUrl,
    ...extractHttpLinks(subtitle).filter((url) => url !== sourceUrl),
  ];
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
    title: displayTitle,
    description,
    photos,
    page: 1,
    pageCount,
    photoCount,
    sourceUrl,
    links,
    price: parsed.salePrice ?? parsed.prices[0],
    originalPrice: parsed.originalPrice,
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
