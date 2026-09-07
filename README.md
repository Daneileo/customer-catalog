# Catalog

This repo is the **customer catalog** — the site you publish. Customers see photos only. There are no supplier links, no yuan prices, and no path to the master copy.

GitHub: `Daneileo/customer-catalog`

## Home

**/** — **HOW TO ORDER** intro page. Use **Search every catalog** to look through all shops at once, or pick a catalog tab.

## Search

| Page | What it searches |
| --- | --- |
| `/search?q=` | Every catalog |
| `/{catalog}/search?q=` | That catalog only |
| `/master/search?q=` | Every catalog, master copy (local only) |

On a catalog page, the search bar can switch between **Every catalog** and **This catalog**.

## Catalogs

| Tab | URL | Source |
| --- | --- | --- |
| manybrands-1 | `/manybrands-1` | Taurus, Scorpio, Pisces |
| manybrands-2 | `/manybrands-2` | Husky |
| manybrands-3 | `/manybrands-3` | chaosmade.x.yupoo.com |
| many shoes-1 | `/many-shoes-1` | wwfake100.x.yupoo.com |
| many shoes-2 | `/many-shoes-2` | yolo66.x.yupoo.com |
| luxurybrand-shoes1 | `/luxurybrand-shoes1` | 2335499519.x.yupoo.com |
| glasses-1 | `/glasses-1` | jimioptical.x.yupoo.com |
| stussy | `/stussy` | niuniu6688.x.yupoo.com |
| Arc'teryx | `/arcteryx` | west42.x.yupoo.com |
| Stone Island | `/stone-island` | dreamremake2.x.yupoo.com |
| BEST MOOSEKNUCKLES | `/best-mooseknuckles` | jieyi168x.x.yupoo.com |
| good mooseknuckles | `/good-mooseknuckles` | palmmoose.x.yupoo.com |
| best-jerseys | `/best-jerseys` | terryqiuyi.x.yupoo.com |
| luxury-bags-items1 | `/luxury-bags-items1` | emma-luxury.x.yupoo.com |
| luxury-bags-items2 | `/luxury-bags-items2` | godmall.x.yupoo.com/categories/4788903 |
| realgold/silverjewlery | `/realgold-silverjewlery` | hlinjewelry.x.yupoo.com |
| bestsp5der-EE-vale.etc | `/bestsp5der-ee-vale` | pikachushop.x.yupoo.com |

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
