"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import {
  catalogGlobalSearchPath,
  catalogSearchPath,
  type CatalogMode,
  type StoreSlug,
} from "@/lib/shops";

export function SearchForm({
  store,
  mode = "storefront",
}: {
  store?: StoreSlug | null;
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
  store?: StoreSlug | null;
  mode?: CatalogMode;
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const defaultScope =
    store && pathname.includes(`/${store}/search`) ? "store" : "all";

  return (
    <SearchFields
      store={store}
      mode={mode}
      defaultValue={params.get("q") ?? ""}
      defaultScope={defaultScope}
    />
  );
}

function SearchFields({
  store,
  mode = "storefront",
  defaultValue = "",
  defaultScope = "all",
}: {
  store?: StoreSlug | null;
  mode?: CatalogMode;
  defaultValue?: string;
  defaultScope?: "all" | "store";
}) {
  const allAction = catalogGlobalSearchPath(mode);
  const storeAction = store ? catalogSearchPath(store, mode) : allAction;

  return (
    <form
      action={allAction}
      method="GET"
      role="search"
      className="flex flex-col gap-2 sm:flex-row"
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget);
        const value = String(data.get("q") ?? "").trim();
        const scope = String(data.get("scope") ?? "all");
        event.preventDefault();
        if (!value) return;
        const action = scope === "store" && store ? storeAction : allAction;
        window.location.assign(`${action}?q=${encodeURIComponent(value)}`);
      }}
    >
      {store ? (
        <label className="sr-only" htmlFor="search-scope">
          Search scope
        </label>
      ) : null}
      {store ? (
        <select
          id="search-scope"
          name="scope"
          defaultValue={defaultScope}
          className="h-10 shrink-0 rounded-lg border border-input bg-card px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          aria-label="Search scope"
        >
          <option value="all">Every catalog</option>
          <option value="store">This catalog</option>
        </select>
      ) : (
        <input type="hidden" name="scope" value="all" />
      )}
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          key={`${store ?? "all"}-${mode}-${defaultValue}-${defaultScope}`}
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search every catalog — titles, brands, SKUs…"
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
