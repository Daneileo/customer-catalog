import { redirect } from "next/navigation";
import { CatalogError } from "@/components/catalog-error";
import { CatalogListing } from "@/components/catalog-listing";
import { IntroShell } from "@/components/intro-shell";
import {
  CatalogError as FeedError,
  searchAllStores,
  type CatalogPage,
} from "@/lib/catalog";
import { catalogGlobalSearchPath } from "@/lib/shops";

export const revalidate = 120;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q?.trim();
  return { title: q ? `Search all catalogs: ${q}` : "Search all catalogs" };
}

export default async function GlobalSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const query = (await searchParams).q?.trim() || "";
  const page = Math.max(1, Number((await searchParams).page) || 1);

  if (!query) {
    redirect("/");
  }

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await searchAllStores(query, page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "Search is temporarily unavailable.";
  }

  return (
    <IntroShell>
      {!data ? (
        <CatalogError message={message ?? undefined} href="/" />
      ) : (
        <CatalogListing
          title="Search every catalog"
          description={`Results for “${query}” across all catalogs.`}
          data={data}
          pathname={catalogGlobalSearchPath()}
          query={{ q: query }}
          showCatalog
        />
      )}
    </IntroShell>
  );
}
