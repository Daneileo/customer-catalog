import { Suspense } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { getStoreIndex } from "@/lib/catalog";
import type { CatalogMode, StoreSlug } from "@/lib/shops";

export async function CatalogChrome({
  store,
  children,
  mode = "storefront",
}: {
  store: StoreSlug;
  children: React.ReactNode;
  mode?: CatalogMode;
}) {
  return (
    <>
      <Suspense
        fallback={
          <SiteHeader store={store} categories={[]} mode={mode} />
        }
      >
        <CatalogHeader store={store} mode={mode} />
      </Suspense>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
        {children}
      </main>
      <SiteFooter mode={mode} />
    </>
  );
}

async function CatalogHeader({
  store,
  mode = "storefront",
}: {
  store: StoreSlug;
  mode?: CatalogMode;
}) {
  let categories: { id: string; name: string }[] = [];
  try {
    const listing = await getStoreIndex(store, 1);
    categories = listing.categories;
  } catch {
    categories = [];
  }
  return <SiteHeader store={store} categories={categories} mode={mode} />;
}
