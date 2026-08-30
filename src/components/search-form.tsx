"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
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
  const action = catalogSearchPath(store, mode);

  return (
    <form
      action={action}
      method="GET"
      role="search"
      className="flex gap-2"
      onSubmit={(event) => {
        const value = String(new FormData(event.currentTarget).get("q") ?? "").trim();
        event.preventDefault();
        if (!value) return;
        window.location.assign(`${action}?q=${encodeURIComponent(value)}`);
      }}
    >
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          key={`${store}-${mode}-${defaultValue}`}
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search titles, brands, SKUs…"
          autoComplete="off"
          enterKeyHint="search"
          aria-label="Search items by title"
          className="h-10 w-full min-w-0 rounded-lg border border-input bg-card py-1 pr-3 pl-8 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <button
        type="submit"
        className="h-10 shrink-0 rounded-lg bg-foreground px-3 text-sm font-medium text-background hover:bg-foreground/90"
      >
        Search
      </button>
    </form>
  );
}
