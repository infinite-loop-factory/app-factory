import type { CountryItem } from "@/types/country-item";

export type CountryRegion =
  | "europe"
  | "asia"
  | "americas"
  | "africa"
  | "oceania"
  | "other";

export const EUROPE_CODES = new Set([
  "fr",
  "fra",
  "it",
  "ita",
  "es",
  "esp",
  "pt",
  "prt",
  "gb",
  "gbr",
  "uk",
  "de",
  "deu",
  "at",
  "aut",
  "ch",
  "che",
  "be",
  "bel",
  "nl",
  "nld",
  "pl",
  "pol",
  "gr",
  "grc",
  "se",
  "swe",
  "no",
  "nor",
  "fi",
  "fin",
  "ie",
  "irl",
  "cz",
  "cze",
  "sk",
  "svk",
  "hu",
  "hun",
  "is",
  "isl",
  "dk",
  "dnk",
  "hr",
  "hrv",
  "si",
  "svn",
  "ro",
  "rou",
  "bg",
  "bgr",
  "tr",
  "tur",
]);

export const ASIA_CODES = new Set([
  "jp",
  "jpn",
  "kr",
  "kor",
  "cn",
  "chn",
  "sg",
  "sgp",
  "th",
  "tha",
  "id",
  "idn",
  "ph",
  "phl",
  "vn",
  "vnm",
  "my",
  "mys",
  "in",
  "ind",
  "hk",
  "hkg",
  "tw",
  "twn",
  "ae",
  "are",
  "sa",
  "sau",
  "qa",
  "qat",
  "bh",
  "bhr",
  "om",
  "omn",
  "kw",
  "kwt",
  "lk",
  "lka",
  "np",
  "npl",
]);

export const AMERICAS_CODES = new Set([
  "us",
  "usa",
  "ca",
  "can",
  "mx",
  "mex",
  "br",
  "bra",
  "ar",
  "arg",
  "cl",
  "chl",
  "co",
  "col",
  "pe",
  "per",
  "uy",
  "ury",
  "bo",
  "bol",
  "ec",
  "ecu",
  "ve",
  "ven",
  "pa",
  "pan",
  "cr",
  "cri",
]);

export const AFRICA_CODES = new Set([
  "za",
  "zaf",
  "ng",
  "nga",
  "eg",
  "egy",
  "ke",
  "ken",
  "gh",
  "gha",
  "ma",
  "mar",
  "tn",
  "tun",
  "sn",
  "sen",
  "et",
  "eth",
  "dz",
  "dza",
  "tz",
  "tza",
  "ug",
  "uga",
]);

export const OCEANIA_CODES = new Set(["au", "aus", "nz", "nzl", "fj", "fji"]);

const ISO3_TO_ISO2: Record<string, string> = {
  fra: "fr",
  ita: "it",
  esp: "es",
  prt: "pt",
  gbr: "gb",
  deu: "de",
  aut: "at",
  che: "ch",
  bel: "be",
  nld: "nl",
  pol: "pl",
  grc: "gr",
  swe: "se",
  nor: "no",
  fin: "fi",
  irl: "ie",
  cze: "cz",
  svk: "sk",
  hun: "hu",
  isl: "is",
  dnk: "dk",
  hrv: "hr",
  svn: "si",
  rou: "ro",
  bgr: "bg",
  tur: "tr",
  jpn: "jp",
  kor: "kr",
  chn: "cn",
  sgp: "sg",
  tha: "th",
  idn: "id",
  phl: "ph",
  vnm: "vn",
  mys: "my",
  ind: "in",
  hkg: "hk",
  twn: "tw",
  are: "ae",
  sau: "sa",
  qat: "qa",
  bhr: "bh",
  omn: "om",
  kwt: "kw",
  lka: "lk",
  npl: "np",
};

export const normalizeCountryCode = (code?: string) =>
  code?.trim().toLowerCase() ?? "";

export const normalizeIso2 = (code?: string) => {
  const normalized = normalizeCountryCode(code);
  if (normalized.length === 2) return normalized;
  if (normalized.length === 3 && ISO3_TO_ISO2[normalized]) {
    return ISO3_TO_ISO2[normalized];
  }
  return "";
};

export const resolveRegion = (code?: string): CountryRegion => {
  const normalized = normalizeCountryCode(code);
  if (EUROPE_CODES.has(normalized)) return "europe";
  if (ASIA_CODES.has(normalized)) return "asia";
  if (AMERICAS_CODES.has(normalized)) return "americas";
  if (AFRICA_CODES.has(normalized)) return "africa";
  if (OCEANIA_CODES.has(normalized)) return "oceania";
  return "other";
};

export const getFlagUri = (code?: string) => {
  const iso2 = normalizeIso2(code);
  if (!iso2) return null;
  return `https://flagcdn.com/w80/${iso2}.png`;
};

export const getStayDays = (item: Pick<CountryItem, "stayDays" | "dateSet">) =>
  Math.max(item.dateSet?.length ?? item.stayDays ?? 0, 0);
