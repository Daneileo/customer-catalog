# Catalog

A storefront for the same albums and photos as the supplier galleries, with **no outbound product links**. Clicking an item opens a photo page on this site. Supplier gallery URLs are never shown in the UI, and images are proxied so the browser does not load those hosts.

Three catalogs are included as shop tabs:

- **Taurus** — the main gallery from the albums URL you sent
- **Scorpio** and **Pisces** — the other two galleries listed on that seller page

Albums that exist only to share other gallery links (for example “NEW YUPOO”) or agent how-to posts are omitted. Item descriptions that contain marketplace or gallery URLs are stripped.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43141](http://localhost:43141). The home page loads the Taurus catalog.

WhatsApp orders use `+852 5736 3298`.

## What you get

- Grid of items with prices parsed from titles when present
- Category chips plus a searchable category drawer
- Search across the selected catalog
- Item pages with a photo gallery / lightbox
- Shop tabs to switch catalogs
- Loading, empty, and error states

## Notes

This app reads public album pages at request time and caches them for a few minutes. Password-protected albums do not appear.
