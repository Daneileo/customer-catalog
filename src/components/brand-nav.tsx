"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    html.classList.add("brand-overlay-open");
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const inList = (target: EventTarget | null) => {
      const list = listRef.current;
      return Boolean(list && target instanceof Node && list.contains(target));
    };

    const onWheel = (event: WheelEvent) => {
      if (inList(event.target)) {
        const list = listRef.current;
        if (!list) return;
        const atTop = list.scrollTop <= 0 && event.deltaY < 0;
        const atBottom =
          list.scrollTop + list.clientHeight >= list.scrollHeight - 1 &&
          event.deltaY > 0;
        if (atTop || atBottom) event.preventDefault();
        return;
      }
      event.preventDefault();
    };

    const onTouchMove = (event: TouchEvent) => {
      if (inList(event.target)) return;
      event.preventDefault();
    };

    window.addEventListener("keydown", onKey);
    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      html.classList.remove("brand-overlay-open");
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
    setQuery("");
  }, [pathname]);

  const overlay =
    mounted && open
      ? createPortal(
          <div
            role="presentation"
            className="brand-overlay"
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="brand-overlay-title"
              className="brand-overlay-panel"
            >
              <div className="flex shrink-0 items-start justify-between gap-3 border-b p-4">
                <div>
                  <h2
                    id="brand-overlay-title"
                    className="font-heading text-base font-medium"
                  >
                    Brands
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Choose a brand to see its items.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex size-7 items-center justify-center rounded-lg hover:bg-muted"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="relative shrink-0 border-b px-4 py-3">
                <Search className="pointer-events-none absolute top-1/2 left-6 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find a brand"
                  className="h-9 bg-card pl-8 text-sm"
                />
              </div>
              <div
                ref={listRef}
                data-brand-scroll
                className="brand-overlay-list"
              >
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
          </div>,
          document.body,
        )
      : null;

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

      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm",
          open || activeId
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground hover:text-foreground",
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {active?.name || "Brands"}
        <ChevronDown className="size-3.5" />
      </button>
      {overlay}
    </div>
  );
}
