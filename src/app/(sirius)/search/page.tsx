import { redirect } from "next/navigation";
import { CategoryChips } from "@/components/category-chips";
import { CatalogError } from "@/components/catalog-error";
import { PaginationBar } from "@/components/pagination-bar";
import { ProductGrid } from "@/components/product-grid";
import {
  CatalogError as FeedError,
  searchCombined,
  type CatalogPage,
} from "@/lib/catalog";
import { SITE_NAME } from "@/lib/shops";

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
    redirect("/");
  }

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await searchCombined(query, page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "Search is temporarily unavailable.";
  }

  if (!data) {
    return <CatalogError message={message ?? undefined} href="/" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Search
        </h1>
        <p className="text-sm text-muted-foreground">
          Results for “{query}” in {SITE_NAME}.
        </p>
      </div>
      <CategoryChips categories={data.categories} />
      <ProductGrid items={data.items} />
      <PaginationBar
        pathname="/search"
        page={data.page}
        pageCount={data.pageCount}
        query={{ q: query }}
      />
    </div>
  );
}
