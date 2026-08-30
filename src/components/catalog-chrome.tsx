import { Suspense } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { getStoreIndex } from "@/lib/catalog";
import type { StoreSlug } from "@/lib/shops";

export async function CatalogChrome({
  store,
  children,
}: {
  store: StoreSlug;
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<SiteHeader store={store} categories={[]} />}>
        <CatalogHeader store={store} />
      </Suspense>
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

async function CatalogHeader({ store }: { store: StoreSlug }) {
  let categories: { id: string; name: string }[] = [];
  try {
    const listing = await getStoreIndex(store, 1);
    categories = listing.categories;
  } catch {
    categories = [];
  }
  return <SiteHeader store={store} categories={categories} />;
}
