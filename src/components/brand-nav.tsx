"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { brandLetter } from "@/lib/category-nav";
import {
  storeCategoryPath,
  storeHome,
  type StoreSlug,
} from "@/lib/shops";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string };

export function BrandNav({
  store,
  categories,
}: {
  store: StoreSlug;
  categories: Category[];
}) {
  const pathname = usePathname();
  const activeId = pathname.match(/\/c\/([^/?]+)/)?.[1];
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? categories.filter((category) =>
          category.name.toLowerCase().includes(q),
        )
      : categories;

    const map = new Map<string, Category[]>();
    for (const category of filtered) {
      const letter = brandLetter(category.name);
      const list = map.get(letter) ?? [];
      list.push(category);
      map.set(letter, list);
    }
    return [...map.entries()].sort(([a], [b]) =>
      a === "#" ? -1 : b === "#" ? 1 : a.localeCompare(b),
    );
  }, [categories, query]);

  const active = categories.find((category) => category.id === activeId);

  return (
    <div className="flex items-center gap-1">
      <Link
        href={storeHome(store)}
        className={cn(
          "rounded-full px-3 py-1.5 text-sm",
          !activeId && !pathname.includes("/search")
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:text-foreground",
        )}
      >
        All
      </Link>

      <div className="relative">
        <input id="brand-menu" type="checkbox" className="peer sr-only" />
        <label
          htmlFor="brand-menu"
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1.5 text-sm",
            activeId
              ? "bg-foreground text-background"
              : "bg-muted text-muted-foreground hover:text-foreground",
          )}
        >
          {active?.name || "Brands"}
          <ChevronDown className="size-3.5" />
        </label>

        <div className="pointer-events-none invisible fixed inset-0 z-50 overflow-hidden peer-checked:pointer-events-auto peer-checked:visible">
          <label
            htmlFor="brand-menu"
            className="absolute inset-0 bg-black/40"
            aria-label="Close brands"
          />
          <div className="absolute inset-x-0 top-0 mx-auto flex h-[min(92vh,44rem)] w-full max-w-7xl flex-col overflow-hidden bg-background shadow-lg sm:top-4 sm:mx-4 sm:max-w-3xl sm:rounded-xl lg:mx-auto">
            <div className="flex items-start justify-between gap-3 border-b p-4">
              <div>
                <h2 className="font-heading text-base font-medium">Brands</h2>
                <p className="text-sm text-muted-foreground">
                  Choose a brand to see its items.
                </p>
              </div>
              <label
                htmlFor="brand-menu"
                className="inline-flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-muted"
                aria-label="Close"
              >
                <X className="size-4" />
              </label>
            </div>
            <div className="relative border-b px-4 py-3">
              <Search className="pointer-events-none absolute top-1/2 left-6 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find a brand"
                className="h-9 bg-card pl-8 text-sm"
              />
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3">
              {groups.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No brands match that name.
                </p>
              ) : (
                groups.map(([letter, brands]) => (
                  <div key={letter} className="mb-2">
                    <p className="px-3 py-1 text-xs font-medium text-muted-foreground">
                      {letter}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3">
                      {brands.map((category) => (
                        <Link
                          key={category.id}
                          href={storeCategoryPath(store, category.id)}
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm hover:bg-muted",
                            activeId === category.id
                              ? "bg-muted font-medium"
                              : "",
                          )}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
