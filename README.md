# Catalog

A storefront for the same albums and photos as the supplier galleries, with **no outbound product links**. Clicking an item opens a photo page on this site. Supplier gallery URLs are never shown in the UI, and images are proxied so the browser does not load those hosts.

Two catalogs:

- **Sirius** — combined Taurus, Scorpio, and Pisces galleries
- **Husky** — the Husky gallery

Switch catalogs with the tabs at the top. Albums that exist only to share other gallery links or agent how-to posts are omitted. Item descriptions that contain marketplace or gallery URLs are stripped. Yuan / yen prices are not shown. Brand names that were written with star or fire emoji censors are restored.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43141](http://localhost:43141).

WhatsApp orders use `+1 (416) 245-9504`.

## What you get

- Sirius and Husky as separate catalogs
- Category chips plus a category drawer
- Search within the selected catalog
- Item pages with a photo gallery / lightbox
- Loading, empty, and error states

## Notes

This app reads public album pages at request time and caches them for a few minutes. Password-protected albums do not appear.
