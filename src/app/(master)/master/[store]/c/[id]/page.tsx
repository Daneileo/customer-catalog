import { notFound } from "next/navigation";
import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  getStoreCategory,
  type CatalogPage,
} from "@/lib/catalog";
import { catalogCategoryPath, catalogHome, getStore } from "@/lib/shops";

export const revalidate = 300;
export const maxDuration = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ store: string; id: string }>;
}) {
  const store = getStore((await params).store);
  return { title: store ? `${store.name} · master` : "Category" };
}

export default async function MasterStoreCategoryPage({
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
    data = await getStoreCategory(store.slug, id, page, { master: true });
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "This category could not be loaded.";
  }

  if (!data) {
    return (
      <CatalogError
        message={message ?? undefined}
        href={catalogHome(store.slug, "master")}
      />
    );
  }

  const current = data.categories.find((category) => category.id === id);

  return (
    <CatalogListing
      store={store.slug}
      mode="master"
      title={current?.name || "Category"}
      description="Master brand listing with prices and album links."
      data={data}
      pathname={catalogCategoryPath(store.slug, id, "master")}
      activeCategoryId={id}
    />
  );
}
