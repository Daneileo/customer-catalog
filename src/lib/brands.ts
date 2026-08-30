const CENSOR = String.raw`(?:⭐️|⭐|★|☆|✦|🔥️|🔥)`;
const CENSOR_CHAR = /⭐️|⭐|★|☆|✦|🔥️|🔥/g;

export const BRANDS = [
  "THAT'S A AWFUL LOT OF COCKS",
  "ANTI SOCIAL SOCIAL CLUB",
  "BILLIONAIRE BOYS CLUB",
  "GOD SELECTION XXX",
  "VAN CLEEF & ARPELS",
  "VIVIENNE WESTWOOD",
  "BIRTH OF ROYAL CHILD",
  "MOUNTAIN HARDWEAR",
  "BROOKS BROTHERS",
  "HOUSE OF ERRORS",
  "KARL LAGERFELD",
  "MARCELO BURLON",
  "MARDI MERCREDI",
  "MITCHELL & NESS",
  "OUTDOOR PRODUCTS",
  "ROBERTO CAVALLI",
  "TOMMY HILFIGER",
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
  "ERIC EMANUEL",
  "FALSE PERCEPTION",
  "GALLERY DEPT",
  "GIORGIO ARMANI",
  "HELLY HANSEN",
  "JACOB COHEN",
  "JACK WOLFSKIN",
  "KENT & CURWEN",
  "KLATTERMUSEN",
  "L.L.BEAN",
  "LIFE WORK",
  "LORO PIANA",
  "LOUIS VUITTON",
  "MAISON KITSUNE",
  "MAISON MARGIELA",
  "MARTINE ROSE",
  "MASSIMO DUTTI",
  "MICHAEL KORS",
  "MIND EMOTION",
  "MIXED EMOTION",
  "MOOSE KNUCKLES",
  "N.HOOLYWOOD",
  "NEIGHBORHOOD",
  "NEW BALANCE",
  "OPEN YY",
  "OUR LEGACY",
  "PHILIPP PLEIN",
  "PROTOCOL INDEX",
  "RALPH LAUREN",
  "RICK OWENS",
  "SAINT VANITY",
  "SAINT LAURENT",
  "SAINT MICHAEL",
  "SALVATORE FERRAGAMO",
  "SNOW PEAK",
  "STEFANO RICCI",
  "STONE ISLAND",
  "THE COUTURE CLUB",
  "THE NORTH FACE",
  "UNDER ARMOUR",
  "WEST COAST CHOPPERS",
  "WHO DECIDES WAR",
  "WILLY CHAVARRIA",
  "YOHJI YAMAMOTO",
  "YOUNG LA",
  "Y/PROJECT",
  "2000 ARCHIVES",
  "ABOUT BLANK",
  "ACNE STUDIOS",
  "AIR JORDAN",
  "AND WANDER",
  "ARC'TERYX",
  "ARTE ANTWERP",
  "BILLIONAIRE",
  "BIRKENSTOCK",
  "BORN X RAISED",
  "BOTTEGA VENETA",
  "BROKEN PLANET",
  "CALVIN KLEIN",
  "CARHARTT",
  "CASABLANCA",
  "COLE BUXTON",
  "COTOPAXI",
  "DENIM TEARS",
  "DSQUARED2",
  "EASTPAK",
  "FJALLRAVEN",
  "FRED PERRY",
  "GIVENCHY",
  "GOLDWIN",
  "GRAMICCI",
  "HELLSTAR",
  "HOLLISTER",
  "HUGO BOSS",
  "HUMAN MADE",
  "ICECREAM",
  "JACQUEMUS",
  "JIL SANDER",
  "KAPITAL",
  "LULULEMON",
  "LONGCHAMP",
  "MAX MARA",
  "MONCLER",
  "MOSCHINO",
  "NEW ERA",
  "ON RUNNING",
  "OFF-WHITE",
  "OUTDOOR",
  "PALM ANGELS",
  "PATAGONIA",
  "PAUL & SHARK",
  "PURPLE BRAND",
  "SAINT TEARS",
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
  "TRAVIS SCOTT",
  "WE11DONE",
  "WOOYOUNGMI",
  "ALO YOGA",
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
  "CORTEIZ",
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
  "LACOSTE",
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
  "THRASHER",
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
  "AMI",
  "ARTE",
  "ASRV",
  "BAPE",
  "BOSS",
  "BOY",
  "DIOR",
  "GAP",
  "GOLD",
  "KITH",
  "MCM",
  "NIKE",
  "PERRY",
  "PUMA",
  "SACAI",
  "STUSSY",
  "SUNO",
  "UGG",
  "ZARA",
  "LV",
  "AMIRI",
  "ASICS",
  "AIGLE",
  "ALAIA",
  "ARITZIA",
  "ASKYURSELF",
  "BRIONI",
  "BALMAIN",
  "BVLGARI",
  "BRAIN DEAD",
  "BILLWALLLEATHER",
  "CANALI",
  "CARTIER",
  "CHOOOSELF",
  "COCACOLA",
  "DESCENTE",
  "DESCENDANT",
  "DERSCHUTZE",
  "DIESEL",
  "DRAMA CALL",
  "EVISU",
  "FERRAGAMO",
  "FREITAG",
  "GANNI",
  "GANT",
  "GRAILZ",
  "GODSPEED",
  "GYMSHARK",
  "ISAIA",
  "JANSPORT",
  "KENZO",
  "KITON",
  "KANGOL",
  "KIMHEKIM",
  "LEMAIRE",
  "LOSTSHDWS",
  "MARNI",
  "MACKAGE",
  "MONTANE",
  "MOWALOLA",
  "MAMMUT",
  "MASTERMIND",
  "MONTBLANC",
  "MONT-BELL",
  "MARIMEKKO",
  "NANGA",
  "NAUTICA",
  "NANAMICA",
  "NONNOD",
  "PANDORA",
  "PHENIX",
  "PLAY BOY",
  "PLEASURES",
  "PROJECT G/R",
  "RADIALL",
  "READYMADE",
  "REPRESENT",
  "REVENGE",
  "RHUDE",
  "RON HERMAN",
  "ROUGH PLAY",
  "SAINT MICHAEL",
  "SAMSONITE",
  "SP5DER",
  "TELFAR",
  "THOM BROWNE",
  "THUG CLUB",
  "TIFFANY & CO.",
  "TOM FORD",
  "TUFF CROWD",
  "TUMI",
  "UNDEFEATED",
  "UNDERMYCAR",
  "VALENTINO",
  "VETEMENTS",
  "VILEBREQUIN",
  "WILD THINGS",
  "X-BIONIC",
  "YAMATOMICHI",
  "HARRIS",
  "HANES",
  "ZEGNA",
  "Y-3",
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
  "M⭐N⭐⭐⭐": "MONCLER",
  "C⭐TZ": "CORTEIZ",
  "R⭐L⭐": "RALPH LAUREN",
  "T⭐⭐ N⭐⭐F⭐⭐": "THE NORTH FACE",
  "J⭐K WO⭐SK⭐N": "JACK WOLFSKIN",
  "Z⭐⭐G⭐A": "ZEGNA",
  "Y⭐": "Y-3",
  "L⭐": "LV",
  "ST⭐⭐E": "STONE ISLAND",
  "F⭐⭐⭐⭐": "FENDI",
  "TH⭐T'S A AW⭐UL L⭐T OF C..": "THAT'S A AWFUL LOT OF COCKS",
  "TH⭐T'S A AW⭐UL L⭐T OF C.": "THAT'S A AWFUL LOT OF COCKS",
};

const EDGE = String.raw`(?<![A-Za-z0-9])`;
const END = String.raw`(?![A-Za-z0-9])`;

const FIXED: { pattern: RegExp; brand: string }[] = [
  { pattern: new RegExp(`${EDGE}M🔥N🔥🔥🔥${END}`, "gi"), brand: "MONCLER" },
  { pattern: new RegExp(`${EDGE}C🔥TZ${END}`, "gi"), brand: "CORTEIZ" },
  { pattern: new RegExp(`${EDGE}R🔥L🔥${END}`, "gi"), brand: "RALPH LAUREN" },
  { pattern: new RegExp(`${EDGE}ST🔥🔥E${END}`, "gi"), brand: "STONE ISLAND" },
  {
    pattern: new RegExp(`${EDGE}T🔥🔥\\s+N🔥🔥F🔥🔥${END}`, "gi"),
    brand: "THE NORTH FACE",
  },
  {
    pattern: new RegExp(`${EDGE}J🔥K\\s+WO🔥SK🔥N${END}`, "gi"),
    brand: "JACK WOLFSKIN",
  },
  { pattern: new RegExp(`${EDGE}Z🔥🔥G🔥A${END}`, "gi"), brand: "ZEGNA" },
  { pattern: new RegExp(`${EDGE}🔥NK${END}`, "gi"), brand: "NIKE" },
  {
    pattern: /TH🔥T['’]S A AW🔥UL L🔥T OF C\.{0,2}/gi,
    brand: "THAT'S A AWFUL LOT OF COCKS",
  },
];

const PRODUCT_TAIL =
  /T-SHIRTS?|TEES?|CAPS?|HATS?|HEADGEAR|GLOVES?|HOODIES?|SWEATERS?|JACKETS?|SHORTS?|PANTS|TROUSERS|SLIPPERS?|SHIRTS?|COATS?|VESTS?|COTTON|DOWN|SUITS?|ACCESSORY/i;

function splitGluedProducts(text: string) {
  return text.replace(
    new RegExp(`(${CENSOR})(${PRODUCT_TAIL.source})`, "gi"),
    "$1 $2",
  );
}

function hasCensor(value: string) {
  return /⭐️|⭐|★|☆|✦|🔥️|🔥/.test(value);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function patternFromBrand(brand: string) {
  const chars = [...brand.toUpperCase()].filter((char) => char !== " ");
  const parts = chars.map((char, index) => {
    let piece = "";
    if (char === "&") piece = `(?:&|&amp;|&AMP;|${CENSOR})`;
    else if (char === "'") piece = `(?:['’]|${CENSOR})?`;
    else if (char === ".") piece = "\\.?";
    else if (char === "-") piece = `(?:-|${CENSOR})?`;
    else if (char === "/") piece = "[/]?";
    else if (/[A-Z0-9]/.test(char)) piece = `(?:${escapeRegExp(char)}|${CENSOR})`;
    else piece = escapeRegExp(char);
    if (index < chars.length - 1) piece += "\\s*";
    return piece;
  });

  return new RegExp(
    `(?<![A-Za-z0-9⭐🔥])${parts.join("")}(?![A-Za-z0-9⭐🔥])`,
    "gi",
  );
}

function confirmingLetters(match: string, brand: string) {
  const brandChars = [...brand.toUpperCase()].filter((char) => /[A-Z0-9]/.test(char));
  const matchChars = [
    ...match
      .toUpperCase()
      .replace(CENSOR_CHAR, "⭐")
      .replace(/\s+/g, ""),
  ];
  let confirmed = 0;
  let bi = 0;
  for (const char of matchChars) {
    if (char === "⭐" || char === "*") {
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

const REPLACERS = [...new Set(BRANDS)]
  .sort((a, b) => b.replace(/\s+/g, "").length - a.replace(/\s+/g, "").length)
  .map((brand) => ({ brand, pattern: patternFromBrand(brand) }));

function exactKey(value: string) {
  return value
    .replace(CENSOR_CHAR, "⭐")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function enoughEvidence(match: string, brand: string) {
  const confirmed = confirmingLetters(match, brand);
  const brandLen = [...brand.toUpperCase()].filter((char) =>
    /[A-Z0-9]/.test(char),
  ).length;
  if (confirmed < 1) return false;
  if (brandLen <= 3) return true;
  return confirmed >= 2;
}

export function restoreBrands(text: string) {
  let result = splitGluedProducts(
    text.replace(/&amp;/gi, "&").replace(/[✖✕×]/g, "X"),
  );
  if (!hasCensor(result)) return result;

  const key = exactKey(result);
  if (EXACT[key]) return EXACT[key];

  for (const { pattern, brand } of FIXED) {
    result = result.replace(pattern, brand);
  }

  for (const { brand, pattern } of REPLACERS) {
    result = result.replace(pattern, (match) => {
      if (!hasCensor(match)) return match;
      if (!enoughEvidence(match, brand)) return match;
      return brand;
    });
  }

  return result.replace(/\s+/g, " ").trim();
}
