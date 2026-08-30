# Catalog

This repo is the **customer catalog** — the site you publish. Customers see photos only. There are no supplier links, no yuan prices, and no path to the master copy.

## Home

**/** — **HOW TO ORDER** intro page. Pick a catalog from the tabs to start browsing.

## Catalogs

| Tab | URL | Source |
| --- | --- | --- |
| manybrands-1 | `/manybrands-1` | Taurus, Scorpio, Pisces |
| manybrands-2 | `/manybrands-2` | Husky |
| manybrands-3 | `/manybrands-3` | chaosmade.x.yupoo.com |
| many shoes-1 | `/many-shoes-1` | wwfake100.x.yupoo.com |
| many shoes-2 | `/many-shoes-2` | yolo66.x.yupoo.com |
| luxurybrand-shoes1 | `/luxurybrand-shoes1` | 2335499519.x.yupoo.com |

Each catalog has **All**, **Brands**, search, and item photo pages. Old names redirect (`/medved` → `/manybrands-1`, `/mishka` → `/manybrands-2`).

## Master copy (local only)

Prices and album links at `/master/{catalog}` — only in `npm run dev`, not on production.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:43141](http://localhost:43141).

WhatsApp orders use `+1 (416) 245-9504`.
