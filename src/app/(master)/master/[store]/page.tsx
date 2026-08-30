import { notFound } from "next/navigation";
import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  getStoreIndex,
  type CatalogPage,
} from "@/lib/catalog";
import { STORES, catalogHome, getStore } from "@/lib/shops";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ store: string }>;
}) {
  const store = getStore((await params).store);
  return { title: store ? `${store.name} · master` : "Master" };
}

export default async function MasterStoreHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const store = getStore((await params).store);
  if (!store) notFound();

  const page = Math.max(1, Number((await searchParams).page) || 1);

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await getStoreIndex(store.slug, page, { master: true });
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "The product feed is temporarily unavailable.";
  }

  if (!data) {
    return (
      <CatalogError
        message={message ?? undefined}
        href={catalogHome(store.slug, "master")}
      />
    );
  }

  return (
    <CatalogListing
      store={store.slug}
      mode="master"
      title={`${store.name} master`}
      description="Yuan prices and album links for this catalog. The customer site still hides both."
      data={data}
      pathname={catalogHome(store.slug, "master")}
    />
  );
}

export function generateStaticParams() {
  return Object.keys(STORES).map((store) => ({ store }));
}
