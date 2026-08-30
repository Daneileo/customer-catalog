import { redirect } from "next/navigation";
import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  searchStore,
  type CatalogPage,
} from "@/lib/catalog";
import { STORES, storeHome, storeSearchPath } from "@/lib/shops";

const STORE = STORES.mishka;

export const revalidate = 120;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q?.trim();
  return { title: q ? `Search: ${q}` : "Search" };
}

export default async function MishkaSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const query = (await searchParams).q?.trim() || "";
  const page = Math.max(1, Number((await searchParams).page) || 1);

  if (!query) {
    redirect(storeHome("mishka"));
  }

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await searchStore("mishka", query, page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "Search is temporarily unavailable.";
  }

  if (!data) {
    return <CatalogError message={message ?? undefined} href={storeHome("mishka")} />;
  }

  return (
    <CatalogListing
      store="mishka"
      title="Search"
      description={`Results for “${query}” in ${STORE.name}.`}
      data={data}
      pathname={storeSearchPath("mishka")}
      query={{ q: query }}
    />
  );
}
