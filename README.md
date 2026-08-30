# Sirius

A storefront for the same albums and photos as the supplier galleries, with **no outbound product links**. Clicking an item opens a photo page on this site. Supplier gallery URLs are never shown in the UI, and images are proxied so the browser does not load those hosts.

**Sirius** combines the Taurus, Scorpio, and Pisces galleries into one catalog.

Albums that exist only to share other gallery links or agent how-to posts are omitted. Item descriptions that contain marketplace or gallery URLs are stripped. Yen prices are not shown.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43141](http://localhost:43141).

WhatsApp orders use `+1 (416) 245-9504`.

## What you get

- One combined grid of items from all three galleries
- Category chips plus a category drawer
- Search across the full catalog
- Item pages with a photo gallery / lightbox
- Loading, empty, and error states

## Notes

This app reads public album pages at request time and caches them for a few minutes. Password-protected albums do not appear.
