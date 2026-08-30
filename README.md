# Catalog

A storefront for the same albums and photos as the supplier galleries, with **no outbound product links**. Clicking an item opens a photo page on this site. Supplier gallery URLs are never shown in the UI, and images are proxied so the browser does not load those hosts.

Two catalogs:

- **Medved** — combined Taurus, Scorpio, and Pisces galleries
- **Mishka** — the Mishka gallery

**All** shows every item. Hover or tap **Brands** for the full brand list (decoded names). Opening a brand shows that brand’s items, same as the original galleries.

Albums that exist only to share other gallery links or agent how-to posts are omitted. Item descriptions that contain marketplace or gallery URLs are stripped. Yuan / yen prices are not shown.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43141](http://localhost:43141).

WhatsApp orders use `+1 (416) 245-9504`.
