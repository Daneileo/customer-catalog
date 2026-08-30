import "server-only";

import { isShopSlug, type ShopSlug } from "@/lib/shops";

export type ShopSource = {
  slug: ShopSlug;
  host: string;
  photoUser: string;
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
};

export function getShopSource(slug: string): ShopSource | null {
  return isShopSlug(slug) ? SHOP_SOURCES[slug] : null;
}
