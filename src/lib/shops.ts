export const WHATSAPP_NUMBER = "85257363298";
export const WHATSAPP_DISPLAY = "+852 5736 3298";

export type ShopSlug = "taurus" | "scorpio" | "pisces";

export type Shop = {
  slug: ShopSlug;
  name: string;
  host: string;
  photoUser: string;
  blurb: string;
};

export const SHOPS: Record<ShopSlug, Shop> = {
  taurus: {
    slug: "taurus",
    name: "Taurus",
    host: "deateath.x.yupoo.com",
    photoUser: "deateath",
    blurb: "Main catalog",
  },
  scorpio: {
    slug: "scorpio",
    name: "Scorpio",
    host: "scorpio-reps.x.yupoo.com",
    photoUser: "scorpio-reps",
    blurb: "Second catalog",
  },
  pisces: {
    slug: "pisces",
    name: "Pisces",
    host: "pisces-reps.x.yupoo.com",
    photoUser: "pisces-reps",
    blurb: "Third catalog",
  },
};

export const SHOP_LIST = Object.values(SHOPS);

export function isShopSlug(value: string): value is ShopSlug {
  return value in SHOPS;
}

export function getShop(slug: string): Shop | null {
  return isShopSlug(slug) ? SHOPS[slug] : null;
}

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
