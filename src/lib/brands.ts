const STAR = String.raw`(?:⭐️|⭐|★|☆|✦)`;
const STAR_CHAR = /⭐️|⭐|★|☆|✦/g;

export const BRANDS = [
  "1017 ALYX 9SM",
  "ABERCROMBIE & FITCH",
  "ALEXANDER WANG",
  "AMERICAN VINTAGE",
  "AIME LEON DORE",
  "ARMANI EXCHANGE",
  "BRUNELLO CUCINELLI",
  "CANADA GOOSE",
  "CHROME HEARTS",
  "COUGH SYRUP",
  "DOLCE GABBANA",
  "EMPORIO ARMANI",
  "FALSE PERCEPTION",
  "GIORGIO ARMANI",
  "JACOB COHEN",
  "KENT & CURWEN",
  "L.L.BEAN",
  "LIFE WORK",
  "LORO PIANA",
  "LOUIS VUITTON",
  "MAISON KITSUNE",
  "MARTINE ROSE",
  "MASSIMO DUTTI",
  "MICHAEL KORS",
  "MIND EMOTION",
  "MOOSE KNUCKLES",
  "N.HOOLYWOOD",
  "NEW BALANCE",
  "OPEN YY",
  "OUR LEGACY",
  "PHILIPP PLEIN",
  "PROTOCOL INDEX",
  "RALPH LAUREN",
  "RICK OWENS",
  "SAINT VANITY",
  "SAINT LAURENT",
  "SALVATORE FERRAGAMO",
  "SNOW PEAK",
  "STEFANO RICCI",
  "STONE ISLAND",
  "THE COUTURE CLUB",
  "UNDER ARMOUR",
  "WEST COAST CHOPPERS",
  "WILLY CHAVARRIA",
  "YOHJI YAMAMOTO",
  "YOUNG LA",
  "Y/PROJECT",
  "2000 ARCHIVES",
  "ABOUT BLANK",
  "AIR JORDAN",
  "ARC'TERYX",
  "BILLIONAIRE",
  "BORN X RAISED",
  "CALVIN KLEIN",
  "CARHARTT",
  "COTOPAXI",
  "DSQUARED2",
  "EASTPAK",
  "FJALLRAVEN",
  "GIVENCHY",
  "GOLDWIN",
  "GRAMICCI",
  "HELLSTAR",
  "HUGO BOSS",
  "ICECREAM",
  "JACQUEMUS",
  "KAPITAL",
  "LONGCHAMP",
  "MAX MARA",
  "MONCLER",
  "MOSCHINO",
  "NEW ERA",
  "OUTDOOR",
  "SALOMON",
  "SPRAYGROUND",
  "SUPREME",
  "TEAM WANG",
  "THE ROW",
  "TIMBERLAND",
  "TOPOLOGIE",
  "TOY MACHINE",
  "TRAPSTAR",
  "TORY BURCH",
  "WE11DONE",
  "WOOYOUNGMI",
  "ADIDAS",
  "ALWAYS",
  "BALENCIAGA",
  "BARBOUR",
  "BEAMS",
  "BOGNER",
  "BURBERRY",
  "CELINE",
  "CHAMPION",
  "CHLOE",
  "CLOT",
  "COACH",
  "CROCS",
  "DICKIES",
  "FENDI",
  "FILA",
  "GCDS",
  "GUCCI",
  "GUESS",
  "HACKETT",
  "HERMES",
  "ICICLE",
  "KAILAS",
  "KAWS",
  "KSUBI",
  "LEVI'S",
  "LOEWE",
  "MIU MIU",
  "NEEDLES",
  "NOCTA",
  "OAKLEY",
  "OSPREY",
  "PALACE",
  "PATTA",
  "PRADA",
  "PROJECT",
  "THEORY",
  "UMBRO",
  "UNKNOWN",
  "VERSACE",
  "VALLEY",
  "WTAPS",
  "YEEZY",
  "032C",
  "6PM",
  "ACG",
  "ALO",
  "ARTE",
  "ASRV",
  "BOSS",
  "BOY",
  "DIOR",
  "GAP",
  "GOLD",
  "MCM",
  "NIKE",
  "PERRY",
  "SUNO",
  "UGG",
  "ZARA",
  "LV",
] as const;

const EXACT: Record<string, string> = {
  "H⭐LL⭐ST⭐⭐": "HELLSTAR",
  "G⭐OB⭐IO A⭐MANI": "GIORGIO ARMANI",
  "A⭐G⭐E": "AUGE",
  "A⭐A⭐A": "AMARA",
  "AE⭐E": "AAPE",
  "C⭐A⭐E⭐": "CASETIFY",
  "C⭐⭐Z": "CLOT",
  "CO⭐⭐⭐⭐⭐A": "COSTUME",
  "AR⭐⭐⭐ EXCH⭐⭐⭐": "ARMANI EXCHANGE",
  "S⭐⭐⭐ I⭐⭐⭐D": "STONE ISLAND",
  "MA⭐⭐A⭐RA": "MAX MARA",
  "MI⭐⭐D EM⭐⭐ION": "MIXED EMOTION",
  "WE⭐T C⭐⭐⭐T CHO⭐P⭐ERS": "WEST COAST CHOPPERS",
  "T⭐F": "TNF",
  "T⭐⭐I": "TEVA",
  "S⭐F⭐": "SAFE",
  "E⭐L": "EQL",
};

function hasStar(value: string) {
  return /⭐️|⭐|★|☆|✦/.test(value);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function patternFromBrand(brand: string) {
  const chars = [...brand.toUpperCase()].filter((char) => char !== " ");
  const parts = chars.map((char, index) => {
    let piece = "";
    if (char === "&") piece = `(?:&|&amp;|&AMP;|${STAR})`;
    else if (char === "'") piece = `(?:['’]|${STAR})?`;
    else if (char === ".") piece = "\\.?";
    else if (char === "/") piece = "[/]?";
    else if (/[A-Z0-9]/.test(char)) piece = `(?:${escapeRegExp(char)}|${STAR})`;
    else piece = escapeRegExp(char);
    if (index < chars.length - 1) piece += "\\s*";
    return piece;
  });

  return new RegExp(
    `(?<![A-Za-z0-9⭐])${parts.join("")}(?![A-Za-z0-9⭐])`,
    "gi",
  );
}

function confirmingLetters(match: string, brand: string) {
  const brandChars = [...brand.toUpperCase()].filter((char) => /[A-Z0-9]/.test(char));
  const matchChars = [...match.toUpperCase().replace(STAR_CHAR, "⭐").replace(/\s+/g, "")];
  let confirmed = 0;
  let bi = 0;
  for (const char of matchChars) {
    if (char === "⭐" || char === "*" ) {
      bi += 1;
      continue;
    }
    if (/[A-Z0-9]/.test(char)) {
      if (brandChars[bi] === char) confirmed += 1;
      bi += 1;
    }
  }
  return confirmed;
}

const REPLACERS = [...BRANDS]
  .sort((a, b) => b.replace(/\s+/g, "").length - a.replace(/\s+/g, "").length)
  .map((brand) => ({ brand, pattern: patternFromBrand(brand) }));

export function restoreBrands(text: string) {
  let result = text.replace(/&amp;/gi, "&");
  if (!hasStar(result)) return result;

  const exactKey = result
    .replace(STAR_CHAR, "⭐")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
  if (EXACT[exactKey]) return EXACT[exactKey];

  for (const { brand, pattern } of REPLACERS) {
    result = result.replace(pattern, (match) => {
      if (!hasStar(match)) return match;
      if (confirmingLetters(match, brand) < 1) return match;
      return brand;
    });
  }

  return result.replace(/\s+/g, " ").trim();
}
