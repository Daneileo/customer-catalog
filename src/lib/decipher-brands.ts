import { BRANDS, restoreBrands } from "./brands";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeKey(name: string) {
  return name
    .replace(/[🔥⭐️⭐★☆✦🔥️]/g, "")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function compactKey(name: string) {
  return normalizeKey(name).replace(/[^a-z0-9]+/g, "");
}

function leetKeys(name: string) {
  const normalized = normalizeKey(name);
  const at = normalized.replace(/@/g, "a");
  const zero = at.replace(/0/g, "o");
  return [
    ...new Set([
      normalized,
      at,
      zero,
      zero.replace(/1/g, "i"),
      zero.replace(/1/g, "l"),
    ]),
  ];
}

function cleanLabel(name: string) {
  return name.replace(/[🔥⭐️⭐★☆✦🔥️]/g, "").replace(/\s+/g, " ").trim();
}

/** Obfuscated / abbreviated Yupoo labels → real brand names. */
const ALIASES: Record<string, string> = {
  he11star: "HELLSTAR",
  hellstar: "HELLSTAR",
  c0rte1z: "CORTEIZ",
  corteiz: "CORTEIZ",
  vl0ne: "VLONE",
  vlone: "VLONE",
  "hu1man made": "HUMAN MADE",
  hu1manmade: "HUMAN MADE",
  am1r1: "AMIRI",
  "tr@pst@r": "TRAPSTAR",
  trapstar: "TRAPSTAR",
  "b@pe": "BAPE",
  k1th: "KITH",
  am1: "AMI",
  "@cn": "ACNE STUDIOS",
  acn: "ACNE STUDIOS",
  stu: "STUSSY",
  tnf: "THE NORTH FACE",
  assc: "ANTI SOCIAL SOCIAL CLUB",
  cdg: "COMME DES GARCONS",
  "0n": "ON RUNNING",
  chrom: "CHROME HEARTS",
  rhud: "RHUDE",
  sixpm: "6PM",
  y0ungla: "YOUNG LA",
  youngla: "YOUNG LA",
  maison: "MAISON MARGIELA",
  mm: "MAISON MARGIELA",
  mm6: "MM6 MAISON MARGIELA",
  open: "OPEN YY",
  stone: "STONE ISLAND",
  alyx: "1017 ALYX 9SM",
  ala: "ALAIA",
  acw: "A-COLD-WALL",
  "lot of cough": "THAT'S A AWFUL LOT OF COCKS",
  lotofcough: "THAT'S A AWFUL LOT OF COCKS",
  "eric e": "ERIC EMANUEL",
  erice: "ERIC EMANUEL",
  "project gr": "PROJECT G/R",
  projectgr: "PROJECT G/R",
  purple: "PURPLE BRAND",
  westcoastchoppers: "WEST COAST CHOPPERS",
  thecoutureclub: "THE COUTURE CLUB",
  "drew hous": "DREW HOUSE",
  drewhous: "DREW HOUSE",
  drewhouse: "DREW HOUSE",
  cpfm: "CACTUS PLANT FLEA MARKET",
  erd: "ENFANTS RICHES DEPRIMES",
  "enfants riches dprimes": "ENFANTS RICHES DEPRIMES",
  enfantsrichesdprimes: "ENFANTS RICHES DEPRIMES",
  "raf simons": "RAF SIMONS",
  rafsimons: "RAF SIMONS",
  vandythepink: "VANDY THE PINK",
  whoisjacow: "WHO IS JACOV",
  alwaydowhatyoushoulddo: "ALWAYS DO WHAT YOU SHOULD DO",
  "syna tracksuits": "SYNA WORLD",
  synatracksuits: "SYNA WORLD",
  protocol: "PROTOCOL INDEX",
  tuff: "TUFF CROWD",
  aboutblank: "ABOUT BLANK",
  ro: "RICK OWENS",
  wl: "WARREN LOTAS",
  "rest&recreation": "REST & RECREATION",
  "rest & recreation": "REST & RECREATION",
  restrecreation: "REST & RECREATION",
  yproject: "Y/PROJECT",
  "gallery dept": "GALLERY DEPT",
  gallerydept: "GALLERY DEPT",
  "fear of god": "FEAR OF GOD",
  fearofgod: "FEAR OF GOD",
  "cole buxton": "COLE BUXTON",
  colebuxton: "COLE BUXTON",
  "human made": "HUMAN MADE",
  humanmade: "HUMAN MADE",
};

/** Too ambiguous to rewrite inside a longer product title. */
const CATEGORY_ONLY = new Set([
  "mm",
  "stu",
  "open",
  "stone",
  "maison",
  "ala",
  "purple",
  "ro",
  "wl",
  "tuff",
  "protocol",
  "am1",
  "acn",
  "0n",
]);

const EXTRA_BRANDS = [
  "VLONE",
  "COMME DES GARCONS",
  "A-COLD-WALL",
  "DREW HOUSE",
  "CACTUS PLANT FLEA MARKET",
  "ENFANTS RICHES DEPRIMES",
  "RAF SIMONS",
  "REST & RECREATION",
  "SYNA WORLD",
  "ALWAYS DO WHAT YOU SHOULD DO",
  "WHO IS JACOV",
  "VANDY THE PINK",
  "MM6 MAISON MARGIELA",
] as const;

const BRAND_COMPACT = new Map<string, string>();
for (const brand of [...BRANDS, ...EXTRA_BRANDS]) {
  const compact = compactKey(brand);
  if (compact && !BRAND_COMPACT.has(compact)) {
    BRAND_COMPACT.set(compact, brand);
  }
}

function resolveAlias(name: string) {
  for (const variant of leetKeys(name)) {
    if (ALIASES[variant]) return ALIASES[variant];
    const compact = variant.replace(/[^a-z0-9]+/g, "");
    if (ALIASES[compact]) return ALIASES[compact];
    const known = BRAND_COMPACT.get(compact);
    if (known) return known;
  }
  return undefined;
}

const COPY_REPLACERS = Object.entries(ALIASES)
  .filter(([key]) => !CATEGORY_ONLY.has(key))
  .sort((a, b) => b[0].length - a[0].length)
  .map(([key, brand]) => ({
    brand,
    pattern: new RegExp(
      `(?<![A-Za-z0-9])${escapeRegExp(key)}(?![A-Za-z0-9])`,
      "gi",
    ),
  }));

function peelDecorativeFire(name: string) {
  if (/[A-Za-z0-9]🔥+[A-Za-z0-9]/.test(name)) return name;
  return name.replace(/^[🔥\s]+|[🔥\s]+$/g, "").trim();
}

export function decipherBrandName(name: string) {
  const restored = restoreBrands(peelDecorativeFire(name));
  return resolveAlias(restored) ?? cleanLabel(restored);
}

export function decipherCopy(text: string) {
  let result = restoreBrands(peelDecorativeFire(text));
  for (const { pattern, brand } of COPY_REPLACERS) {
    result = result.replace(pattern, brand);
  }
  return result.replace(/\s+/g, " ").trim();
}
