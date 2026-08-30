"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { storeSearchPath, type StoreSlug } from "@/lib/shops";

export function SearchForm({ store }: { store: StoreSlug }) {
  return (
    <Suspense fallback={<SearchFields store={store} />}>
      <SearchFormFromUrl store={store} />
    </Suspense>
  );
}

function SearchFormFromUrl({ store }: { store: StoreSlug }) {
  const params = useSearchParams();
  return (
    <SearchFields store={store} defaultValue={params.get("q") ?? ""} />
  );
}

function SearchFields({
  store,
  defaultValue = "",
}: {
  store: StoreSlug;
  defaultValue?: string;
}) {
  return (
    <form action={storeSearchPath(store)} className="relative">
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
