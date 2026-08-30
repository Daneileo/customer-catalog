import { redirect, notFound } from "next/navigation";
import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  searchStore,
  type CatalogPage,
} from "@/lib/catalog";
import { STORES, getStore, storeHome, storeSearchPath } from "@/lib/shops";

export const revalidate = 120;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const store = getStore((await params).store);
  const q = (await searchParams).q?.trim();
  return { title: q ? `Search: ${q}` : store ? `Search · ${store.name}` : "Search" };
}

export default async function StoreSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const store = getStore((await params).store);
  if (!store) notFound();

  const query = (await searchParams).q?.trim() || "";
  const page = Math.max(1, Number((await searchParams).page) || 1);

  if (!query) {
    redirect(storeHome(store.slug));
  }

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await searchStore(store.slug, query, page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "Search is temporarily unavailable.";
  }

  if (!data) {
    return (
      <CatalogError message={message ?? undefined} href={storeHome(store.slug)} />
    );
  }

  return (
    <CatalogListing
      store={store.slug}
      title="Search"
      description={`Results for “${query}” in ${store.name}.`}
      data={data}
      pathname={storeSearchPath(store.slug)}
      query={{ q: query }}
    />
  );
}

export function generateStaticParams() {
  return Object.keys(STORES).map((store) => ({ store }));
}
