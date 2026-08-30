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
  | "luxury233";

export type StoreSlug =
  | "manybrands-1"
  | "manybrands-2"
  | "manybrands-3"
  | "many-shoes-1"
  | "many-shoes-2"
  | "luxurybrand-shoes1";

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
};

export type Store = {
  slug: StoreSlug;
  name: string;
  blurb: string;
  shops: ShopSlug[];
};

export const STORES: Record<StoreSlug, Store> = {
  "manybrands-1": {
    slug: "manybrands-1",
    name: "manybrands-1",
    blurb:
      "All items, or pick a brand. Open any item for photos — nothing links away from this site.",
    shops: ["taurus", "scorpio", "pisces"],
  },
  "manybrands-2": {
    slug: "manybrands-2",
    name: "manybrands-2",
    blurb:
      "All items, or pick a brand. Open any item for photos — nothing links away from this site.",
    shops: ["husky"],
  },
  "manybrands-3": {
    slug: "manybrands-3",
    name: "manybrands-3",
    blurb:
      "All items, or pick a brand. Open any item for photos — nothing links away from this site.",
    shops: ["chaosmade"],
  },
  "many-shoes-1": {
    slug: "many-shoes-1",
    name: "many shoes-1",
    blurb:
      "All items, or pick a brand. Open any item for photos — nothing links away from this site.",
    shops: ["wwfake100"],
  },
  "many-shoes-2": {
    slug: "many-shoes-2",
    name: "many shoes-2",
    blurb:
      "All items, or pick a brand. Open any item for photos — nothing links away from this site.",
    shops: ["yolo66"],
  },
  "luxurybrand-shoes1": {
    slug: "luxurybrand-shoes1",
    name: "luxurybrand-shoes1",
    blurb:
      "All items, or pick a brand. Open any item for photos — nothing links away from this site.",
    shops: ["luxury233"],
  },
};

const SHOP_TO_STORE: Record<ShopSlug, StoreSlug> = {
  taurus: "manybrands-1",
  scorpio: "manybrands-1",
  pisces: "manybrands-1",
  husky: "manybrands-2",
  chaosmade: "manybrands-3",
  wwfake100: "many-shoes-1",
  yolo66: "many-shoes-2",
  luxury233: "luxurybrand-shoes1",
};

export const STORE_LIST = Object.values(STORES);

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
