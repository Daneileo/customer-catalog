import { CategoryChips } from "@/components/category-chips";
import { CatalogError } from "@/components/catalog-error";
import { PaginationBar } from "@/components/pagination-bar";
import { ProductGrid } from "@/components/product-grid";
import {
  CatalogError as FeedError,
  getCombinedIndex,
  type CatalogPage,
} from "@/lib/catalog";
import { SITE_NAME } from "@/lib/shops";

export const revalidate = 300;

export const metadata = {
  title: SITE_NAME,
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
    data = await getCombinedIndex(page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "The product feed is temporarily unavailable.";
  }

  if (!data) {
    return <CatalogError message={message ?? undefined} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {SITE_NAME}
        </h1>
        <p className="text-sm text-muted-foreground">
          Combined catalog. Open any item for photos — nothing links away from
          this site.
        </p>
      </div>
      <CategoryChips categories={data.categories} />
      <ProductGrid items={data.items} />
      <PaginationBar
        pathname="/"
        page={data.page}
        pageCount={data.pageCount}
      />
    </div>
  );
}
