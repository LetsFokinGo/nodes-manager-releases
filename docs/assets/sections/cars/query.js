

















export const CAR_FIELDS                           = {
  power: "power",
  bhp: "power",
  hp: "power",
  мощность: "power",
  мощ: "power",
  weight: "weight",
  mass: "weight",
  вес: "weight",
  масса: "weight",
  year: "year",
  years: "year",
  год: "year",
  годы: "year",
  country: "country",
  страна: "country",
  class: "class",
  класс: "class",
  drive: "drive",
  drivetrain: "drive",
  привод: "drive",
  body: "body",
  кузов: "body",
  brand: "brand",
  марка: "brand",
  бренд: "brand",
};

const CLASS_ORDER = ["D", "C", "B", "A", "S", "X"];
const KW_TO_HP = 1.35962;
const OPS = "<=|>=|:|=|<|>";
const keyWords = Object.keys(CAR_FIELDS).sort((a, b) => b.length - a.length);
const COND_RE = new RegExp(`^(${keyWords.join("|")})(${OPS})(.*)$`, "iu");

const COUNTRY_EN                           = {
  de: ["germany"],
  us: ["usa", "united states", "america"],
  jp: ["japan"],
  it: ["italy"],
  fr: ["france"],
  gb: ["uk", "united kingdom", "britain", "england"],
  se: ["sweden"],
  ru: ["russia"],
  cn: ["china"],
  kr: ["korea", "south korea"],
  pl: ["poland"],
  cz: ["czech", "czechia"],
  es: ["spain"],
  ca: ["canada"],
  au: ["australia"],
  br: ["brazil"],
  mx: ["mexico"],
  in: ["india"],
  nl: ["netherlands", "holland"],
  at: ["austria"],
  ch: ["switzerland"],
  be: ["belgium"],
  fi: ["finland"],
  no: ["norway"],
  ua: ["ukraine"],
  tr: ["turkey"],
  ro: ["romania"],
  hu: ["hungary"],
  dk: ["denmark"],
  ie: ["ireland"],
  pt: ["portugal"],
};

function normDrive(s        )         {
  const v = s.toLowerCase().replace(/[\s-]/g, "");
  if (["awd", "4wd", "4x4", "полный", "полныйпривод"].includes(v)) return "awd";
  if (["fwd", "передний", "переднийпривод"].includes(v)) return "fwd";
  if (["rwd", "задний", "заднийпривод"].includes(v)) return "rwd";
  return v;
}

function tokenize(text        )           {
  const out           = [];
  let cur = "";
  let q = false;
  for (const ch of text) {
    if (ch === '"') {
      q = !q;
      cur += ch;
    } else if (!q && /\s/.test(ch)) {
      if (cur) out.push(cur);
      cur = "";
    } else cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

function normalize(text        )         {
  let out = "";
  let q = false;
  for (const ch of text) {
    if (ch === '"') q = !q;
    out += ch === "&" && !q ? " " : ch;
  }
  return out.replace(new RegExp(`(^|\\s)(-?(?:${keyWords.join("|")}))\\s*(${OPS})\\s*`, "giu"), "$1$2$3");
}

const unquote = (s        ) => s.replace(/"/g, "").trim();

export function parseAmount(value        , field                    )                {
  const m = /^(\d+(?:[.,]\d+)?)\s*([a-zа-я.]*)$/iu.exec(value.trim());
  if (!m) return null;
  const n = Number(m[1].replace(",", "."));
  const u = m[2].toLowerCase().replace(/\./g, "");
  if (field === "power") {
    if (u === "" || u === "hp" || u === "bhp" || u === "лс" || u === "ps") return n;
    if (u === "kw" || u === "квт") return n * KW_TO_HP;
    return null;
  }
  if (u === "" || u === "kg" || u === "кг") return n;
  if (u === "t" || u === "т") return n * 1000;
  return null;
}

function valid(field          , op        , value        )          {
  if (!value) return false;
  switch (field) {
    case "power":
    case "weight":
      return parseAmount(value, field) !== null;
    case "year":
      return /^\d{4}$/.test(value) || (op === ":" && /^\d{4}-\d{4}$/.test(value));
    case "class":
      return CLASS_ORDER.includes(value.toUpperCase());
    default:
      return op === ":" || op === "=";
  }
}

export function parseCarQuery(text        )            {
  const p            = { text: "", conds: [], invalid: [] };
  const words           = [];
  for (const raw of tokenize(normalize(text))) {
    const neg = raw.length > 1 && raw[0] === "-";
    const m = COND_RE.exec(neg ? raw.slice(1) : raw);
    if (!m) {
      words.push(unquote(raw));
      continue;
    }
    const field = CAR_FIELDS[m[1].toLowerCase()];
    const value = unquote(m[3]);
    if (field && valid(field, m[2], value)) p.conds.push({ neg, field, op: m[2], value, raw });
    else {
      p.invalid.push(raw);
      words.push(unquote(raw));
    }
  }
  p.text = p.conds.length ? words.join(" ") : text.trim();
  return p;
}

function cmp(op        , a        , b        )          {
  switch (op) {
    case "<":
      return a < b;
    case "<=":
      return a <= b;
    case ">":
      return a > b;
    case ">=":
      return a >= b;
    default:
      return a === b;
  }
}

function yearMatches(v             , op        , value        )          {
  const a = v.yearsMin ?? v.yearsMax;
  const b = v.yearsMax ?? v.yearsMin;
  if (a == null || b == null) return false;
  const range = /^(\d{4})-(\d{4})$/.exec(value);
  if (range) return a <= Math.max(+range[1], +range[2]) && b >= Math.min(+range[1], +range[2]);
  const y = +value;
  switch (op) {
    case "<":
      return a < y;
    case "<=":
      return a <= y;
    case ">":
      return b > y;
    case ">=":
      return b >= y;
    default:
      return a <= y && y <= b;
  }
}

function countryMatches(v             , value        , x         )          {
  const q = value.toLowerCase();
  if (v.country && v.country.toLowerCase() === q) return true;
  if (q.length < 3) return false;
  const names = [v.countryName ?? "", x.countryLabel ? x.countryLabel(v) : "", ...(v.country ? (COUNTRY_EN[v.country] ?? []) : [])];
  return names.some((n) => n.toLowerCase().includes(q));
}

function condMatches(v             , cfg                , c         , x         )          {
  const val = c.value.toLowerCase();
  switch (c.field) {
    case "power":
    case "weight": {
      const have = c.field === "power" ? cfg?.power : cfg?.weight;
      const want = parseAmount(c.value, c.field);
      if (have == null || want == null) return false;
      return c.op === ":" || c.op === "=" ? Math.abs(have - want) <= 0.5 : cmp(c.op, have, want);
    }
    case "year":
      return yearMatches(v, c.op, c.value);
    case "country":
      return countryMatches(v, c.value, x);
    case "class": {
      const cls = cfg?.perfClass ?? v.perfClass;
      if (!cls) return false;
      return cmp(c.op === ":" ? "=" : c.op, CLASS_ORDER.indexOf(cls), CLASS_ORDER.indexOf(c.value.toUpperCase()));
    }
    case "drive":
      return !!cfg?.drivetrain && normDrive(cfg.drivetrain) === normDrive(val);
    case "body":
      return (v.bodyStyle ?? "").toLowerCase().includes(val);
    case "brand":
      return (v.brand ?? "").toLowerCase().includes(val);
  }
}

export function carCondsMatch(v             , config                , conds                    , x          = {})          {
  if (!conds.length) return true;
  const pool = config ? [config] : v.configs.filter((c) => !c.disabled);
  const cfgs                     = pool.length ? pool : v.configs.length ? v.configs : [null];
  return cfgs.some((cfg) => conds.every((c) => condMatches(v, cfg, c, x) !== c.neg));
}
