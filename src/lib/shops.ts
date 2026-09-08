export const WHATSAPP_NUMBER = "14162459504";
export const WHATSAPP_DISPLAY = "+1 (416) 245-9504";

export type ShopSlug =
  | "taurus"
  | "scorpio"
  | "pisces"
  | "husky"
  | "chaosmade"
  | "wwfake100"
  | "yolo66"
  | "luxury233"
  | "jimioptical"
  | "niuniu6688"
  | "west42"
  | "dreamremake2"
  | "jieyi168x"
  | "palmmoose"
  | "terryqiuyi"
  | "emmaluxury"
  | "godmall"
  | "hlinjewelry"
  | "pikachushop";

export type StoreSlug =
  | "manybrands-1"
  | "manybrands-2"
  | "manybrands-3"
  | "many-shoes-1"
  | "many-shoes-2"
  | "luxurybrand-shoes1"
  | "glasses-1"
  | "stussy"
  | "arcteryx"
  | "stone-island"
  | "best-mooseknuckles"
  | "good-mooseknuckles"
  | "best-jerseys"
  | "luxury-bags-items1"
  | "luxury-bags-items2"
  | "realgold-silverjewlery"
  | "bestsp5der-ee-vale";

export type Shop = {
  slug: ShopSlug;
  name: string;
  blurb: string;
};

export const SHOPS: Record<ShopSlug, Shop> = {
  taurus: { slug: "taurus", name: "Taurus", blurb: "Gallery" },
  scorpio: { slug: "scorpio", name: "Scorpio", blurb: "Gallery" },
  pisces: { slug: "pisces", name: "Pisces", blurb: "Gallery" },
  husky: { slug: "husky", name: "Husky", blurb: "Gallery" },
  chaosmade: { slug: "chaosmade", name: "Chaosmade", blurb: "Gallery" },
  wwfake100: { slug: "wwfake100", name: "WWFake100", blurb: "Gallery" },
  yolo66: { slug: "yolo66", name: "Yolo66", blurb: "Gallery" },
  luxury233: { slug: "luxury233", name: "Luxury233", blurb: "Gallery" },
  jimioptical: { slug: "jimioptical", name: "Jimi Optical", blurb: "Gallery" },
  niuniu6688: { slug: "niuniu6688", name: "Niuniu6688", blurb: "Gallery" },
  west42: { slug: "west42", name: "West42", blurb: "Gallery" },
  dreamremake2: { slug: "dreamremake2", name: "DreamRemake2", blurb: "Gallery" },
  jieyi168x: { slug: "jieyi168x", name: "Jieyi168x", blurb: "Gallery" },
  palmmoose: { slug: "palmmoose", name: "Palmmoose", blurb: "Gallery" },
  terryqiuyi: { slug: "terryqiuyi", name: "Terry Jersey", blurb: "Gallery" },
  emmaluxury: { slug: "emmaluxury", name: "Emma Luxury", blurb: "Gallery" },
  godmall: { slug: "godmall", name: "Godmall", blurb: "Gallery" },
  hlinjewelry: { slug: "hlinjewelry", name: "Hlinjewelry", blurb: "Gallery" },
  pikachushop: { slug: "pikachushop", name: "Pikachushop", blurb: "Gallery" },
};

export type CategoryListingMode = "brands" | "all";

const CATALOG_BLURB =
  "All items, or pick a brand. Open any item for photos — nothing links away from this site.";

export type Store = {
  slug: StoreSlug;
  name: string;
  blurb: string;
  shops: ShopSlug[];
  /** Show every Yupoo category in Brands (minus blocked ones). Default: decoded brands only. */
  categoryListingMode?: CategoryListingMode;
  /** Load this Yupoo category as the catalog home instead of /albums. */
  pinnedCategoryId?: string;
};

export const STORES: Record<StoreSlug, Store> = {
  "manybrands-1": {
    slug: "manybrands-1",
    name: "manybrands-1",
    blurb: CATALOG_BLURB,
    shops: ["taurus", "scorpio", "pisces"],
  },
  "manybrands-2": {
    slug: "manybrands-2",
    name: "manybrands-2",
    blurb: CATALOG_BLURB,
    shops: ["husky"],
  },
  "manybrands-3": {
    slug: "manybrands-3",
    name: "manybrands-3",
    blurb: CATALOG_BLURB,
    shops: ["chaosmade"],
  },
  "many-shoes-1": {
    slug: "many-shoes-1",
    name: "many shoes-1",
    blurb: CATALOG_BLURB,
    shops: ["wwfake100"],
    categoryListingMode: "all",
  },
  "many-shoes-2": {
    slug: "many-shoes-2",
    name: "many shoes-2",
    blurb: CATALOG_BLURB,
    shops: ["yolo66"],
    categoryListingMode: "all",
  },
  "luxurybrand-shoes1": {
    slug: "luxurybrand-shoes1",
    name: "luxurybrand-shoes1",
    blurb: CATALOG_BLURB,
    shops: ["luxury233"],
    categoryListingMode: "all",
  },
  "glasses-1": {
    slug: "glasses-1",
    name: "glasses-1",
    blurb: CATALOG_BLURB,
    shops: ["jimioptical"],
    categoryListingMode: "all",
  },
  stussy: {
    slug: "stussy",
    name: "stussy",
    blurb: CATALOG_BLURB,
    shops: ["niuniu6688"],
    categoryListingMode: "all",
  },
  arcteryx: {
    slug: "arcteryx",
    name: "Arc'teryx",
    blurb: CATALOG_BLURB,
    shops: ["west42"],
    categoryListingMode: "all",
  },
  "stone-island": {
    slug: "stone-island",
    name: "Stone Island",
    blurb: CATALOG_BLURB,
    shops: ["dreamremake2"],
    categoryListingMode: "all",
  },
  "best-mooseknuckles": {
    slug: "best-mooseknuckles",
    name: "BEST MOOSEKNUCKLES",
    blurb: CATALOG_BLURB,
    shops: ["jieyi168x"],
    categoryListingMode: "all",
  },
  "good-mooseknuckles": {
    slug: "good-mooseknuckles",
    name: "good mooseknuckles",
    blurb: CATALOG_BLURB,
    shops: ["palmmoose"],
    categoryListingMode: "all",
  },
  "best-jerseys": {
    slug: "best-jerseys",
    name: "best-jerseys",
    blurb: CATALOG_BLURB,
    shops: ["terryqiuyi"],
    categoryListingMode: "all",
  },
  "luxury-bags-items1": {
    slug: "luxury-bags-items1",
    name: "luxury-bags-items1",
    blurb: CATALOG_BLURB,
    shops: ["emmaluxury"],
    categoryListingMode: "all",
  },
  "luxury-bags-items2": {
    slug: "luxury-bags-items2",
    name: "luxury-bags-items2",
    blurb: CATALOG_BLURB,
    shops: ["godmall"],
    categoryListingMode: "all",
    pinnedCategoryId: "4788903",
  },
  "realgold-silverjewlery": {
    slug: "realgold-silverjewlery",
    name: "realgold/silverjewlery",
    blurb: CATALOG_BLURB,
    shops: ["hlinjewelry"],
    categoryListingMode: "all",
  },
  "bestsp5der-ee-vale": {
    slug: "bestsp5der-ee-vale",
    name: "bestsp5der-EE-vale.etc",
    blurb: CATALOG_BLURB,
    shops: ["pikachushop"],
    categoryListingMode: "all",
  },
};

const SHOP_TO_STORE = Object.values(STORES).reduce(
  (map, store) => {
    for (const shop of store.shops) {
      map[shop] = store.slug;
    }
    return map;
  },
  {} as Record<ShopSlug, StoreSlug>,
);

export const STORE_LIST = Object.values(STORES);

export const SHOP_SLUGS = Object.keys(SHOPS) as ShopSlug[];

export function isShopSlug(value: string): value is ShopSlug {
  return value in SHOPS;
}

export function isStoreSlug(value: string): value is StoreSlug {
  return value in STORES;
}

export function getShop(slug: string): Shop | null {
  return isShopSlug(slug) ? SHOPS[slug] : null;
}

export function getStore(slug: string): Store | null {
  return isStoreSlug(slug) ? STORES[slug] : null;
}

export function storeForShop(shop: ShopSlug): StoreSlug {
  return SHOP_TO_STORE[shop];
}

export function storeBasePath(store: StoreSlug) {
  return `/${store}`;
}

export function storeHome(store: StoreSlug) {
  return storeBasePath(store);
}

export function storeSearchPath(store: StoreSlug) {
  return `${storeBasePath(store)}/search`;
}

export function storeCategoryPath(store: StoreSlug, categoryId: string) {
  return `${storeBasePath(store)}/c/${categoryId}`;
}

export type CatalogMode = "storefront" | "master";

export function catalogHome(
  store: StoreSlug,
  mode: CatalogMode = "storefront",
) {
  if (mode === "master") {
    return `/master/${store}`;
  }
  return storeHome(store);
}

export function catalogSearchPath(
  store: StoreSlug,
  mode: CatalogMode = "storefront",
) {
  if (mode === "master") {
    return `/master/${store}/search`;
  }
  return storeSearchPath(store);
}

export function catalogGlobalSearchPath(mode: CatalogMode = "storefront") {
  return mode === "master" ? "/master/search" : "/search";
}

export function catalogCategoryPath(
  store: StoreSlug,
  categoryId: string,
  mode: CatalogMode = "storefront",
) {
  if (mode === "master") {
    return `/master/${store}/c/${categoryId}`;
  }
  return storeCategoryPath(store, categoryId);
}

export function catalogItemPath(
  shop: ShopSlug,
  id: string,
  mode: CatalogMode = "storefront",
) {
  return mode === "master" ? `/master/item/${shop}/${id}` : `/item/${shop}/${id}`;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
