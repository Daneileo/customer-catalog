import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  getStoreIndex,
  type CatalogPage,
} from "@/lib/catalog";
import { STORES, storeHome } from "@/lib/shops";

const STORE = STORES.husky;

export const revalidate = 300;

export const metadata = {
  title: STORE.name,
};

export default async function HuskyHomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = Math.max(1, Number((await searchParams).page) || 1);

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await getStoreIndex("husky", page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "The product feed is temporarily unavailable.";
  }

  if (!data) {
    return <CatalogError message={message ?? undefined} href={storeHome("husky")} />;
  }

  return (
    <CatalogListing
      store="husky"
      title={STORE.name}
      description={STORE.blurb}
      data={data}
      pathname={storeHome("husky")}
    />
  );
}
