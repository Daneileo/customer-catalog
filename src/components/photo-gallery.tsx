"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { CatalogPhoto } from "@/lib/catalog";
import { cn } from "@/lib/utils";

function fallbackSrc(src: string) {
  if (src.includes("/big.")) return src.replace("/big.", "/medium.");
  if (src.includes("/medium.")) return src.replace("/medium.", "/small.");
  return null;
}

function GalleryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={className}
      onError={() => {
        const next = fallbackSrc(current);
        if (next) setCurrent(next);
      }}
    />
  );
}

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

  const enlarge = (i: number, event?: React.MouseEvent) => {
    event?.preventDefault();
    setIndex(i);
    setOpen(true);
  };

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
      <a
        href={current.largeSrc}
        onClick={(event) => enlarge(index, event)}
        className="group relative block w-full overflow-hidden rounded-xl border bg-muted"
      >
        <GalleryImage
          src={current.largeSrc}
          alt={title}
          className="mx-auto max-h-[70vh] w-full object-contain"
        />
        <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs text-white">
          <Expand className="size-3.5" />
          Enlarge
        </span>
      </a>
      <p className="text-center text-xs text-muted-foreground">
        Photo {index + 1} of {photos.length}. Tap any photo to enlarge.
      </p>
      {photos.length > 1 ? (
        <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {photos.map((photo, i) => (
            <a
              key={photo.thumbSrc + i}
              href={photo.largeSrc}
              onClick={(event) => enlarge(i, event)}
              className={cn(
                "aspect-square overflow-hidden rounded-lg border",
                i === index ? "border-foreground" : "border-transparent opacity-80",
              )}
            >
              <GalleryImage
                src={photo.thumbSrc}
                alt={`${title} ${i + 1}`}
                className="size-full object-cover"
              />
            </a>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          {photos.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-3 inline-flex size-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
                aria-label="Previous photo"
                onClick={(event) => {
                  event.stopPropagation();
                  go(index - 1);
                }}
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                className="absolute right-3 inline-flex size-10 items-center justify-center rounded-lg text-white hover:bg-white/10"
                aria-label="Next photo"
                onClick={(event) => {
                  event.stopPropagation();
                  go(index + 1);
                }}
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.largeSrc}
            alt={title}
            className="max-h-[90vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
            onError={(event) => {
              const img = event.currentTarget;
              const next = fallbackSrc(img.src);
              if (next) img.src = next;
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
