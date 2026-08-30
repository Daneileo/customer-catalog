export const WHATSAPP_NUMBER = "14162459504";
export const WHATSAPP_DISPLAY = "+1 (416) 245-9504";

export type ShopSlug = "taurus" | "scorpio" | "pisces" | "husky";
export type StoreSlug = "medved" | "mishka";

export type Shop = {
  slug: ShopSlug;
  name: string;
  blurb: string;
};

export const SHOPS: Record<ShopSlug, Shop> = {
  taurus: {
    slug: "taurus",
    name: "Taurus",
    blurb: "Main catalog",
  },
  scorpio: {
    slug: "scorpio",
    name: "Scorpio",
    blurb: "Second catalog",
  },
  pisces: {
    slug: "pisces",
    name: "Pisces",
    blurb: "Third catalog",
  },
  husky: {
    slug: "husky",
    name: "Mishka",
    blurb: "Mishka catalog",
  },
};

export type Store = {
  slug: StoreSlug;
  name: string;
  blurb: string;
  shops: ShopSlug[];
};

export const STORES: Record<StoreSlug, Store> = {
  medved: {
    slug: "medved",
    name: "Medved",
    blurb:
      "Combined catalog. Open any item for photos — nothing links away from this site.",
    shops: ["taurus", "scorpio", "pisces"],
  },
  mishka: {
    slug: "mishka",
    name: "Mishka",
    blurb:
      "Mishka catalog. Open any item for photos — nothing links away from this site.",
    shops: ["husky"],
  },
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
  return shop === "husky" ? "mishka" : "medved";
}

export function storeBasePath(store: StoreSlug) {
  return store === "medved" ? "" : `/${store}`;
}

export function storeHome(store: StoreSlug) {
  return store === "medved" ? "/" : `/${store}`;
}

export function storeSearchPath(store: StoreSlug) {
  return `${storeBasePath(store)}/search`;
}

export function storeCategoryPath(store: StoreSlug, categoryId: string) {
  return `${storeBasePath(store)}/c/${categoryId}`;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
