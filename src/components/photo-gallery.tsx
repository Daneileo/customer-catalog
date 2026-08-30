"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogPhoto } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function PhotoGallery({
  title,
  photos,
}: {
  title: string;
  photos: CatalogPhoto[];
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const current = photos[index] ?? photos[0];

  const go = useCallback(
    (next: number) => {
      if (photos.length === 0) return;
      setIndex((next + photos.length) % photos.length);
    },
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, open]);

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted text-sm text-muted-foreground">
        No photos for this item.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full overflow-hidden rounded-xl border bg-muted"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.largeSrc}
          alt={title}
          className="mx-auto max-h-[70vh] w-full object-contain"
        />
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white">
          <Expand className="size-3.5" />
          Enlarge
        </span>
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Photo {index + 1} of {photos.length}. Tap the photo to enlarge.
      </p>
      {photos.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {photos.map((photo, i) => (
            <button
              key={photo.thumbSrc + i}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "aspect-square overflow-hidden rounded-lg border",
                i === index ? "border-foreground" : "border-transparent opacity-80",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.thumbSrc}
                alt=""
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X />
            <span className="sr-only">Close</span>
          </Button>
          {photos.length > 1 ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-3 text-white hover:bg-white/10 hover:text-white"
                onClick={(event) => {
                  event.stopPropagation();
                  go(index - 1);
                }}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-3 text-white hover:bg-white/10 hover:text-white"
                onClick={(event) => {
                  event.stopPropagation();
                  go(index + 1);
                }}
              >
                <ChevronRight />
              </Button>
            </>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.largeSrc}
            alt={title}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}
