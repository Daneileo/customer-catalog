import { redirect } from "next/navigation";
import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import {
  CatalogError as FeedError,
  searchStore,
  type CatalogPage,
} from "@/lib/catalog";
import { STORES, catalogHome, catalogSearchPath } from "@/lib/shops";

const STORE = STORES.mishka;

export const revalidate = 120;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q?.trim();
  return { title: q ? `Master search: ${q}` : "Search" };
}

export default async function MasterMishkaSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const query = (await searchParams).q?.trim() || "";
  const page = Math.max(1, Number((await searchParams).page) || 1);

  if (!query) {
    redirect(catalogHome("mishka", "master"));
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
    return (
      <CatalogError
        message={message ?? undefined}
        href={catalogHome("mishka", "master")}
      />
    );
  }

  return (
    <CatalogListing
      store="mishka"
      mode="master"
      title="Search"
      description={`Master results for “${query}” in ${STORE.name}.`}
      data={data}
      pathname={catalogSearchPath("mishka", "master")}
      query={{ q: query }}
    />
  );
}
