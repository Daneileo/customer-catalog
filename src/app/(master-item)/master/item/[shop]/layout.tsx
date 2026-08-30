import { CatalogChrome } from "@/components/catalog-chrome";
import { isShopSlug, storeForShop } from "@/lib/shops";

export default async function MasterItemShopLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ shop: string }>;
}) {
  const { shop } = await params;
  const store = isShopSlug(shop) ? storeForShop(shop) : "medved";
  return (
    <CatalogChrome store={store} mode="master">
      {children}
    </CatalogChrome>
  );
}
