import { notFound } from "next/navigation";
import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  getStoreCategory,
  type CatalogPage,
} from "@/lib/catalog";
import { getStore, storeCategoryPath, storeHome } from "@/lib/shops";

export const revalidate = 300;
export const maxDuration = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) {
  const store = getStore((await params).store);
  return { title: store?.name ?? "Category" };
}

export default async function StoreCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string; id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { store: storeSlug, id } = await params;
  const store = getStore(storeSlug);
  if (!store) notFound();

  const page = Math.max(1, Number((await searchParams).page) || 1);

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await getStoreCategory(store.slug, id, page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "This category could not be loaded.";
  }

  if (!data) {
    return (
      <CatalogError message={message ?? undefined} href={storeHome(store.slug)} />
    );
  }

  const current = data.categories.find((category) => category.id === id);

  return (
    <CatalogListing
      store={store.slug}
      title={current?.name || "Category"}
      description="Items from this brand. Click through for photos on this site only."
      data={data}
      pathname={storeCategoryPath(store.slug, id)}
      activeCategoryId={id}
    />
  );
}
