const PROMO =
  /^(?:brand\b.*|sale|hot selling(?: item)?s?|husky(?:[\s-]*reps)?(?:[\s-]*1:1)?|1:1|sweet|super value(?:.+)?|uncategorized(?: album)?|fashion|vintage|unique|ap隐藏)$/i;

const GARMENT =
  /^(?:bag|hat|caps?|belt|glove|giove|jewelry|wristband|send out|kneepad|shawl|earmuff|earmuffs|vest|shirt|scarf|child|kids|kids wear|socks|t-shirt|t shirt|hoodie|shorts|jacket|sweater|slippers|football|trousers|headgear|umbrella|underwear|underpants|female style|femaie styie|short skirt|long skirt|long sleeved|long-sleeve|long sleeve|thermals|trench coat|nba basketball|cotton(?: clothes| ciothes| vest| jacket)?|down(?: vest| jackets?)?|fleece(?: jacket)?|sunscreen clothing|yoga apparel|woman|women|suit|tie|jeans|wallet|windbreaker|towel set|cutlery|racing suit|cotton-padded trousers)$/i;

const TYPE_FOLDER =
  /^(?:hoodie\s*\/\s*jacket\s*\/\s*coat|pants\s*\/\s*bottom|tee\s*\/\s*crewneck\s*\/?\s*shirt)$/i;

const PRODUCT_SUFFIX =
  /^(?:tf|vest|shirt|t-shirt|tee|hoodie|sweater|jacket|cotton|down|suit|pants|trousers|shorts|accessory|women|woman|accessory)$/i;

function stripLabel(name: string) {
  return name
    .replace(/🔥/g, "")
    .replace(/[（(].*$/, "")
    .replace(/[\u4e00-\u9fff].*$/g, "")
    .replace(/品牌分类/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function brandSortKey(name: string) {
  return stripLabel(name)
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

export function isBrandListing(name: string) {
  const normalized = name.replace(/[🔥\s]+/g, " ").trim();
  if (!normalized) return false;
  if (/隐藏|下架/.test(normalized)) return false;
  if (PROMO.test(normalized)) return false;

  const label = stripLabel(name);
  const compact = label.replace(/[^A-Za-z0-9]/g, "");
  if (!/[A-Za-z]/.test(label)) return false;
  if (compact.length < 3) return false;
  if (TYPE_FOLDER.test(label)) return false;
  if (GARMENT.test(label)) return false;

  const words = label.split(/\s+/);
  if (words.length > 1 && PRODUCT_SUFFIX.test(words.at(-1) || "")) {
    return false;
  }

  return true;
}

export function sortBrandList<T extends { name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) =>
    brandSortKey(a.name).localeCompare(brandSortKey(b.name), "en", {
      sensitivity: "base",
    }),
  );
}

export function brandLetter(name: string) {
  const key = brandSortKey(name);
  const first = key.charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}
