"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  STORE_LIST,
  catalogHome,
  type CatalogMode,
  type StoreSlug,
} from "@/lib/shops";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "catalog-tabs-open";

function CatalogLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm",
        active
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function CatalogTabs({
  store,
  mode = "storefront",
}: {
  store?: StoreSlug | null;
  mode?: CatalogMode;
}) {
  const reactId = useId().replace(/:/g, "");
  const inputId = `catalog-tabs-${reactId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const intro = !store;
  const extras = STORE_LIST.filter((entry) => entry.slug !== store);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    try {
      input.checked = window.localStorage.getItem(STORAGE_KEY) !== "0";
    } catch {
      input.checked = true;
    }
    const persist = () => {
      try {
        window.localStorage.setItem(STORAGE_KEY, input.checked ? "1" : "0");
      } catch {
        // Ignore storage failures.
      }
    };
    input.addEventListener("change", persist);
    return () => input.removeEventListener("change", persist);
  }, []);

  return (
    <nav
      className="group/catalogs -mx-1 flex flex-wrap items-center gap-1 px-1 pb-1"
      aria-label="Catalogs"
    >
      <input
        ref={inputRef}
        id={inputId}
        type="checkbox"
        defaultChecked
        className="sr-only"
      />
      <CatalogLink href="/" active={intro}>
        Home
      </CatalogLink>
      {store
        ? STORE_LIST.filter((entry) => entry.slug === store).map((entry) => (
            <CatalogLink
              key={entry.slug}
              href={catalogHome(entry.slug, mode)}
              active
            >
              {entry.name}
            </CatalogLink>
          ))
        : null}

      <label
        htmlFor={inputId}
        className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground group-has-[:checked]/catalogs:hidden"
      >
        Show all catalogs
        <ChevronDown className="size-3.5" />
      </label>
      <label
        htmlFor={inputId}
        className="hidden cursor-pointer items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground group-has-[:checked]/catalogs:inline-flex"
      >
        Hide catalogs
        <ChevronUp className="size-3.5" />
      </label>

      <div className="hidden group-has-[:checked]/catalogs:contents">
        {extras.map((entry) => (
          <CatalogLink
            key={entry.slug}
            href={catalogHome(entry.slug, mode)}
            active={false}
          >
            {entry.name}
          </CatalogLink>
        ))}
      </div>
    </nav>
  );
}
