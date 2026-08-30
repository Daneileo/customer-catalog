"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { catalogSearchPath, type CatalogMode, type StoreSlug } from "@/lib/shops";

export function SearchForm({
  store,
  mode = "storefront",
}: {
  store: StoreSlug;
  mode?: CatalogMode;
}) {
  return (
    <Suspense fallback={<SearchFields store={store} mode={mode} />}>
      <SearchFormFromUrl store={store} mode={mode} />
    </Suspense>
  );
}

function SearchFormFromUrl({
  store,
  mode = "storefront",
}: {
  store: StoreSlug;
  mode?: CatalogMode;
}) {
  const params = useSearchParams();
  return (
    <SearchFields
      store={store}
      mode={mode}
      defaultValue={params.get("q") ?? ""}
    />
  );
}

function SearchFields({
  store,
  mode = "storefront",
  defaultValue = "",
}: {
  store: StoreSlug;
  mode?: CatalogMode;
  defaultValue?: string;
}) {
  return (
    <form action={catalogSearchPath(store, mode)} className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        name="q"
        defaultValue={defaultValue}
        placeholder="Search hoodies, jackets, SKUs…"
        className="h-10 bg-card pl-8 text-sm"
      />
    </form>
  );
}
