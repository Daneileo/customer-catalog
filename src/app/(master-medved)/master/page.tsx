import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  getStoreIndex,
  type CatalogPage,
} from "@/lib/catalog";
import { STORES, catalogHome } from "@/lib/shops";

const STORE = STORES.medved;

export const revalidate = 300;

export const metadata = {
  title: `${STORE.name} master`,
};

export default async function MasterMedvedPage({
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
    return (
      <CatalogError
        message={message ?? undefined}
        href={catalogHome("medved", "master")}
      />
    );
  }

  return (
    <CatalogListing
      store="medved"
      mode="master"
      title={`${STORE.name} master`}
      description="Yuan prices and album links for this catalog. The customer site still hides both."
      data={data}
      pathname={catalogHome("medved", "master")}
    />
  );
}
