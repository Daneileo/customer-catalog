# Catalog

This repo is the **customer catalog** — the site you publish. Customers see photos only. There are no supplier links, no yuan prices, and no path to the master copy.

Two catalogs:

- **Medved** — combined Taurus, Scorpio, and Pisces galleries (`/`)
- **Mishka** — the Mishka gallery (`/mishka`)

**All** shows every item. Hover or tap **Brands** for the full brand list (decoded names). Opening a brand shows that brand’s items, same as the original galleries.

The search bar is on every page. Type any text from an item title — including a SKU like `502221671` — and press **Search** (or Enter) to see matching items in that catalog.

Albums that exist only to share other gallery links or agent how-to posts are omitted. Item descriptions that contain marketplace or gallery URLs are stripped. Yuan / yen prices are not shown.

## Master copy (local only)

The master copy with prices and album links is **not published**. It only runs on your machine with `npm run dev`:

- Medved: [http://localhost:43141/master](http://localhost:43141/master)
- Mishka: [http://localhost:43141/master/mishka](http://localhost:43141/master/mishka)

On a production deploy, `/master` returns a not-found page. Download CSV from a master listing while you are local.

## Run locally

```bash
npm install
npm run dev
```

Customer site: [http://localhost:43141](http://localhost:43141).

WhatsApp orders use `+1 (416) 245-9504`.
