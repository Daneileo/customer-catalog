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
  return { title: q ? `Master search: ${q}` : "Master search" };
}

export default async function MasterGlobalSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const query = (await searchParams).q?.trim() || "";
  const page = Math.max(1, Number((await searchParams).page) || 1);

  if (!query) {
    redirect("/master");
  }

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await searchAllStores(query, page, { master: true });
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "Search is temporarily unavailable.";
  }

  return (
    <IntroShell mode="master">
      {!data ? (
        <CatalogError
          message={message ?? undefined}
          href={catalogGlobalSearchPath("master")}
        />
      ) : (
        <CatalogListing
          mode="master"
          title="Master search"
          description={`Results for “${query}” across every catalog.`}
          data={data}
          pathname={catalogGlobalSearchPath("master")}
          query={{ q: query }}
          showCatalog
        />
      )}
    </IntroShell>
  );
}
