import { notFound } from "next/navigation";
import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  getStoreIndex,
  type CatalogPage,
} from "@/lib/catalog";
import { getStore, storeHome } from "@/lib/shops";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const store = getStore((await params).store);
  return { title: store?.name ?? "Catalog" };
}

export default async function StoreHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const slug = (await params).store;
  const store = getStore(slug);
  if (!store) notFound();

  const page = Math.max(1, Number((await searchParams).page) || 1);

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await getStoreIndex(store.slug, page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "The product feed is temporarily unavailable.";
  }

  if (!data) {
    return (
      <CatalogError message={message ?? undefined} href={storeHome(store.slug)} />
    );
  }

  return (
    <CatalogListing
      store={store.slug}
      title={store.name}
      description={store.blurb}
      data={data}
      pathname={storeHome(store.slug)}
    />
  );
}
