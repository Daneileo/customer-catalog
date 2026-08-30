import { notFound } from "next/navigation";
import { CatalogChrome } from "@/components/catalog-chrome";
import { isStoreSlug, type StoreSlug } from "@/lib/shops";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ store: string }>;
}) {
  const { store: slug } = await params;
  if (!isStoreSlug(slug)) notFound();

  return <CatalogChrome store={slug as StoreSlug}>{children}</CatalogChrome>;
}
