import "server-only";

import { isShopSlug, type ShopSlug } from "@/lib/shops";

export type ShopBlockOptions = {
  master?: boolean;
};

export type ShopSource = {
  slug: ShopSlug;
  host: string;
  photoUser: string;
  blockedCategoryPatterns?: RegExp[];
  blockedAlbumPatterns?: RegExp[];
  /** Hidden on the customer site only; master copy still shows these. */
  customerBlockedCategoryPatterns?: RegExp[];
  customerBlockedAlbumPatterns?: RegExp[];
};

export const SHOP_SOURCES: Record<ShopSlug, ShopSource> = {
  taurus: {
    slug: "taurus",
    host: "deateath.x.yupoo.com",
    photoUser: "deateath",
  },
  scorpio: {
    slug: "scorpio",
    host: "scorpio-reps.x.yupoo.com",
    photoUser: "scorpio-reps",
  },
  pisces: {
    slug: "pisces",
    host: "pisces-reps.x.yupoo.com",
    photoUser: "pisces-reps",
  },
  husky: {
    slug: "husky",
    host: "huskyreps.x.yupoo.com",
    photoUser: "huskyreps",
  },
  chaosmade: {
    slug: "chaosmade",
    host: "chaosmade.x.yupoo.com",
    photoUser: "chaosmade",
  },
  wwfake100: {
    slug: "wwfake100",
    host: "wwfake100.x.yupoo.com",
    photoUser: "wwfake100",
    blockedCategoryPatterns: [/shopping guide/i, /recommended agents/i],
    blockedAlbumPatterns: [
      /order issues/i,
      /social media/i,
      /tiktok/i,
      /collaborative promotion/i,
      /rizzitgo/i,
      /gtbuy/i,
      /rat king logistics/i,
    ],
    customerBlockedCategoryPatterns: [/tik\s*tok/i],
    customerBlockedAlbumPatterns: [/tik\s*tok/i],
  },
  yolo66: {
    slug: "yolo66",
    host: "yolo66.x.yupoo.com",
    photoUser: "yolo66",
    blockedCategoryPatterns: [
      /luxury shoes/i,
      /contact information/i,
      /how to (?:order|place)/i,
      /telegram/i,
      /wechat/i,
      /taobao catalog guide/i,
      /purchase through agents/i,
      /direct mail shipping/i,
    ],
    blockedAlbumPatterns: [
      /2025\s+talent cooperation/i,
      /discount for wholesaler/i,
      /view the qc pictures/i,
      /ordering goods through/i,
      /weidian purchases products/i,
      /direct mail transport/i,
      /taobao disguised link/i,
    ],
  },
  luxury233: {
    slug: "luxury233",
    host: "2335499519.x.yupoo.com",
    photoUser: "2335499519",
    blockedCategoryPatterns: [/other catalogues/i, /\bnews\b/i],
    customerBlockedCategoryPatterns: [/^👟\s*prad/i, /prad■/i],
    customerBlockedAlbumPatterns: [
      /cyprus/i,
      /b22.*comparison/i,
      /in october.*recent new batch/i,
      /latest v3 version kl batch/i,
      /new batches under development/i,
      /prad\*a/i,
    ],
  },
};

export function getShopSource(slug: string): ShopSource | null {
  return isShopSlug(slug) ? SHOP_SOURCES[slug] : null;
}

function normalizeLabel(name: string) {
  return name.replace(/\s+/g, " ").trim();
}

function activeCategoryPatterns(shop: ShopSource, options?: ShopBlockOptions) {
  return [
    ...(shop.blockedCategoryPatterns ?? []),
    ...(options?.master ? [] : shop.customerBlockedCategoryPatterns ?? []),
  ];
}

function activeAlbumPatterns(shop: ShopSource, options?: ShopBlockOptions) {
  return [
    ...(shop.blockedAlbumPatterns ?? []),
    ...(options?.master ? [] : shop.customerBlockedAlbumPatterns ?? []),
  ];
}

export function isBlockedCategory(
  name: string,
  shop: ShopSource,
  options?: ShopBlockOptions,
) {
  const patterns = activeCategoryPatterns(shop, options);
  if (!patterns.length) return false;
  const normalized = normalizeLabel(name);
  return patterns.some((pattern) => pattern.test(normalized));
}

export function isBlockedAlbum(
  title: string,
  shop: ShopSource,
  options?: ShopBlockOptions,
) {
  const patterns = activeAlbumPatterns(shop, options);
  if (!patterns.length) return false;
  const normalized = normalizeLabel(title);
  return patterns.some((pattern) => pattern.test(normalized));
}

export function isBlockedListingTitle(
  title: string,
  shop: ShopSource,
  options?: ShopBlockOptions,
) {
  return (
    isBlockedCategory(title, shop, options) ||
    isBlockedAlbum(title, shop, options)
  );
}
