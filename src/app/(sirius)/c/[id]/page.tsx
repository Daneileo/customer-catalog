import { CategoryChips } from "@/components/category-chips";
import { CatalogError } from "@/components/catalog-error";
import { PaginationBar } from "@/components/pagination-bar";
import { ProductGrid } from "@/components/product-grid";
import {
  CatalogError as FeedError,
  getCombinedCategory,
  type CatalogPage,
} from "@/lib/catalog";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const data = await getCombinedCategory(id, 1);
    const current = data.categories.find((category) => category.id === id);
    return { title: current?.name || "Category" };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const page = Math.max(1, Number((await searchParams).page) || 1);

  let data: CatalogPage | null = null;
  let message: string | null = null;
  try {
    data = await getCombinedCategory(id, page);
  } catch (error) {
    message =
      error instanceof FeedError
        ? error.message
        : "This category could not be loaded.";
  }

  if (!data) {
    return <CatalogError message={message ?? undefined} href="/" />;
  }

  const current = data.categories.find((category) => category.id === id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {current?.name || "Category"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Items in this category. Click through for photos on this site only.
        </p>
      </div>
      <CategoryChips categories={data.categories} activeId={id} />
      <ProductGrid items={data.items} />
      <PaginationBar
        pathname={`/c/${id}`}
        page={data.page}
        pageCount={data.pageCount}
      />
    </div>
  );
}
