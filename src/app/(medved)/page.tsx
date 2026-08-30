import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  getStoreIndex,
  type CatalogPage,
} from "@/lib/catalog";
import { STORES, storeHome } from "@/lib/shops";

const STORE = STORES.medved;

export const revalidate = 300;

export const metadata = {
  title: STORE.name,
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = Math.max(1, Number((await searchParams).page) || 1);

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await getStoreIndex("medved", page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "The product feed is temporarily unavailable.";
  }

  if (!data) {
    return <CatalogError message={message ?? undefined} href={storeHome("medved")} />;
  }

  return (
    <CatalogListing
      store="medved"
      title={STORE.name}
      description={STORE.blurb}
      data={data}
      pathname="/"
    />
  );
}
