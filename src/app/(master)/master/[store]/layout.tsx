import { notFound } from "next/navigation";
import { CatalogChrome } from "@/components/catalog-chrome";
import { isMasterEnabled } from "@/lib/master-access";
import { isStoreSlug, type StoreSlug } from "@/lib/shops";

export default async function MasterStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ store: string }>;
}) {
  if (!isMasterEnabled()) notFound();

  const { store: slug } = await params;
  if (!isStoreSlug(slug)) notFound();

  return (
    <CatalogChrome store={slug as StoreSlug} mode="master">
      {children}
    </CatalogChrome>
  );
}
