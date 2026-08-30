"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchForm() {
  return (
    <Suspense fallback={<SearchFields />}>
      <SearchFormFromUrl />
    </Suspense>
  );
}

function SearchFormFromUrl() {
  const params = useSearchParams();
  return <SearchFields defaultValue={params.get("q") ?? ""} />;
}

function SearchFields({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/search" className="relative">
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
