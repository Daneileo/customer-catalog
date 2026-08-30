"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ShopSlug } from "@/lib/shops";

export function SearchForm({ shop }: { shop: ShopSlug }) {
  return (
    <Suspense fallback={<SearchFields shop={shop} />}>
      <SearchFormFromUrl shop={shop} />
    </Suspense>
  );
}

function SearchFormFromUrl({ shop }: { shop: ShopSlug }) {
  const params = useSearchParams();
  return <SearchFields shop={shop} defaultValue={params.get("q") ?? ""} />;
}

function SearchFields({
  shop,
  defaultValue = "",
}: {
  shop: ShopSlug;
  defaultValue?: string;
}) {
  return (
    <form action={`/${shop}/search`} className="relative">
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
