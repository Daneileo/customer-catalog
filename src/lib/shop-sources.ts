import "server-only";

import { isShopSlug, type ShopSlug } from "@/lib/shops";

export type ShopSource = {
  slug: ShopSlug;
  host: string;
  photoUser: string;
  blockedCategoryPatterns?: RegExp[];
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
    ],
  },
  luxury233: {
    slug: "luxury233",
    host: "2335499519.x.yupoo.com",
    photoUser: "2335499519",
    blockedCategoryPatterns: [/other catalogues/i, /\bnews\b/i],
  },
};

export function getShopSource(slug: string): ShopSource | null {
  return isShopSlug(slug) ? SHOP_SOURCES[slug] : null;
}

export function isBlockedCategory(name: string, shop: ShopSource) {
  if (!shop.blockedCategoryPatterns?.length) return false;
  const normalized = name.replace(/\s+/g, " ").trim();
  return shop.blockedCategoryPatterns.some((pattern) => pattern.test(normalized));
}
