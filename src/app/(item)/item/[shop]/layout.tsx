import { CatalogChrome } from "@/components/catalog-chrome";
import { isShopSlug, storeForShop } from "@/lib/shops";

export default async function ItemShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ shop: string }>;
}) {
  const { shop } = await params;
  const store = isShopSlug(shop) ? storeForShop(shop) : "sirius";
  return <CatalogChrome store={store}>{children}</CatalogChrome>;
}
