import { MAIN_SITE_URL } from "@/lib/site";

/** Rates are PKR-based: value = how many PKR per 1 unit of that currency (e.g. AED: 75). */
export const DEFAULT_RATES: Record<string, number> = {
  PKR: 1,
  AED: 75,
  USD: 280,
};

export type CurrencyMeta = {
  code: string;
  symbol?: string;
  decimals?: number;
  manual_rate_to_aed?: number;
};

const ALLOWED = ["PKR", "AED", "USD"] as const;

export function getSelectedCurrency(): string {
  if (typeof window === "undefined") return "PKR";
  const fromLs = localStorage.getItem("xb_currency");
  const fromCookie = readCookie("xb_currency");
  const raw = (fromLs || fromCookie || "PKR").toUpperCase();
  return ALLOWED.includes(raw as (typeof ALLOWED)[number]) ? raw : "PKR";
}

export function setSelectedCurrency(code: string) {
  const up = String(code || "PKR").toUpperCase();
  if (typeof window === "undefined") return;
  localStorage.setItem("xb_currency", up);
  setCookie("xb_currency", up);
  setCookie("xb_currency_userSet", "1");
  window.dispatchEvent(new Event("xb-currency-change"));
  document.dispatchEvent(new Event("xb-currency-change"));
}

export function readRates(): Record<string, number> {
  if (typeof window === "undefined") return { ...DEFAULT_RATES };
  try {
    const parsed = JSON.parse(localStorage.getItem("xb_rates") || "{}") as Record<
      string,
      number
    >;
    return sanitizeRates(parsed);
  } catch {
    return { ...DEFAULT_RATES };
  }
}

export function saveRates(rates: Record<string, number>) {
  if (typeof window === "undefined") return;
  const next = sanitizeRates(rates);
  localStorage.setItem("xb_rates", JSON.stringify(next));
}

function sanitizeRates(input: Record<string, number> = {}) {
  const out: Record<string, number> = { PKR: 1 };
  for (const [k, v] of Object.entries(input)) {
    const code = String(k).toUpperCase();
    const n = Number(v);
    if (!code) continue;
    if (code === "PKR") {
      out.PKR = 1;
      continue;
    }
    out[code] = n > 0 ? n : DEFAULT_RATES[code] || 1;
  }
  for (const [k, v] of Object.entries(DEFAULT_RATES)) {
    if (!(Number(out[k]) > 0)) out[k] = v;
  }
  return out;
}

/** Convert a PKR major amount into the selected display currency. */
export function convertFromPkr(amountPkr: number, currencyCode: string, rates?: Record<string, number>) {
  const code = String(currencyCode || "PKR").toUpperCase();
  if (code === "PKR") return Number(amountPkr || 0);
  const map = rates || readRates();
  const rate = Number(map[code] || DEFAULT_RATES[code] || 1);
  if (!(rate > 0)) return Number(amountPkr || 0);
  return Number(amountPkr || 0) / rate;
}

export function formatDisplayPrice(
  amountPkr: number | null | undefined,
  currencyCode?: string,
  rates?: Record<string, number>
) {
  if (amountPkr === null || amountPkr === undefined || Number.isNaN(Number(amountPkr))) {
    return "Price on request";
  }
  const code = (currencyCode || getSelectedCurrency()).toUpperCase();
  const converted = convertFromPkr(Number(amountPkr), code, rates);
  const decimals = code === "USD" || code === "AED" ? 0 : 0;
  const pretty = Number(converted)
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${pretty} ${code}`;
}

export async function fetchCurrencyRates(): Promise<{
  currencies: CurrencyMeta[];
  rates: Record<string, number>;
}> {
  try {
    const res = await fetch(`${MAIN_SITE_URL}/api/currencies`, {
      credentials: "omit",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`currencies ${res.status}`);
    const data = (await res.json()) as {
      currencies?: CurrencyMeta[];
      rates?: Record<string, number>;
    };
    const currencies = Array.isArray(data.currencies) ? data.currencies : [];
    let rates = data.rates && typeof data.rates === "object" ? data.rates : {};
    if (!Object.keys(rates).length && currencies.length) {
      rates = {};
      for (const c of currencies) {
        const code = String(c.code || "").toUpperCase();
        const r = Number(c.manual_rate_to_aed);
        if (code && r > 0) rates[code] = r;
      }
    }
    const sanitized = sanitizeRates({ ...DEFAULT_RATES, ...rates });
    saveRates(sanitized);
    return { currencies, rates: sanitized };
  } catch {
    saveRates(DEFAULT_RATES);
    return {
      currencies: ALLOWED.map((code) => ({ code, manual_rate_to_aed: DEFAULT_RATES[code] })),
      rates: { ...DEFAULT_RATES },
    };
  }
}

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function setCookie(name: string, value: string, days = 30) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}
