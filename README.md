# Catalog

A product catalog for reselling. It shows the same albums and photos as the supplier galleries, but **every item stays on this site**. Clicking a product opens a photo page here. There are no Yupoo (or other supplier) links on items.

Catalogs included:

- **Taurus** — the main shop from the albums URL you sent
- **Scorpio** and **Pisces** — the other shops listed on that same seller page

Images are proxied through `/api/img/...` so the browser never loads `yupoo.com` URLs. Item descriptions that contain supplier or marketplace links are stripped.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43141](http://localhost:43141). The home page loads the Taurus catalog.

WhatsApp orders use `+852 5736 3298` from the original shop contact album.

## What you get

- Grid of items with prices parsed from titles when present
- Category chips plus a searchable category drawer
- Search across the selected catalog
- Item pages with a photo gallery / lightbox
- Shop tabs to switch catalogs
- Loading, empty, and error states

## Notes

This app reads public album pages at request time and caches them for a few minutes. If a supplier album is password-protected, it will not appear.
