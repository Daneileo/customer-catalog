import { redirect } from "next/navigation";
import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  searchStore,
  type CatalogPage,
} from "@/lib/catalog";
import { STORES, storeHome, storeSearchPath } from "@/lib/shops";

const STORE = STORES.medved;

export const revalidate = 120;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q?.trim();
  return { title: q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const query = (await searchParams).q?.trim() || "";
  const page = Math.max(1, Number((await searchParams).page) || 1);

  if (!query) {
    redirect(storeHome("medved"));
  }

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await searchStore("medved", query, page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "Search is temporarily unavailable.";
  }

  if (!data) {
    return <CatalogError message={message ?? undefined} href={storeHome("medved")} />;
  }

  return (
    <CatalogListing
      store="medved"
      title="Search"
      description={`Results for “${query}” in ${STORE.name}.`}
      data={data}
      pathname={storeSearchPath("medved")}
      query={{ q: query }}
    />
  );
}
