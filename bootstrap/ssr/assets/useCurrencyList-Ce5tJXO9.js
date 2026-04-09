import { useState, useEffect } from "react";
import axios from "axios";
const DEFAULT_RATES = { AED: 1, PKR: 0.0133, USD: 0.272 };
function sanitizeRates(input = {}) {
  const out = { PKR: 1 };
  const src = input || {};
  for (const [k, v] of Object.entries(src)) {
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
    const code = String(k).toUpperCase();
    if (!out[code] || !(out[code] > 0)) out[code] = Number(v) || 1;
  }
  if (out.AED === 75 || out.AED === "75") {
    Object.assign(out, DEFAULT_RATES);
  }
  return out;
}
function saveRatesSafe(ratesObj = {}) {
  const finalMap = sanitizeRates(ratesObj);
  localStorage.setItem("xb_rates", JSON.stringify(finalMap));
  document.dispatchEvent(new Event("xb-currency-change"));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("xb-currency-change"));
  }
}
function readRatesSafe() {
  try {
    return JSON.parse(localStorage.getItem("xb_rates") || "{}");
  } catch {
    return {};
  }
}
let globalCache = null;
let globalPromise = null;
function useCurrencyList(apiBase = "") {
  const [loading, setLoading] = useState(!globalCache);
  const [list, setList] = useState(globalCache || []);
  function readCookie(name) {
    if (typeof document === "undefined") return null;
    const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }
  const [selected, setSelected] = useState("PKR");
  useEffect(() => {
    const cookieCur = readCookie("xb_currency");
    const lsCur = typeof window !== "undefined" && localStorage.getItem("xb_currency") || null;
    const raw = (cookieCur || lsCur || "PKR").toUpperCase();
    setSelected(raw);
    if (typeof window !== "undefined") {
      localStorage.setItem("xb_currency", raw);
    }
  }, []);
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!localStorage.getItem("xb_rates")) {
        saveRatesSafe(DEFAULT_RATES);
      } else {
        const current = readRatesSafe();
        const fixed = sanitizeRates(current);
        localStorage.setItem("xb_rates", JSON.stringify(fixed));
      }
      if (!localStorage.getItem("xb_currency")) {
        localStorage.setItem("xb_currency", "PKR");
      }
      if (globalCache) {
        if (mounted) {
          setList(globalCache);
          setLoading(false);
        }
        return;
      }
      try {
        if (!globalPromise) {
          globalPromise = axios.get(`/api/currencies`).then((res) => res.data);
        }
        const data = await globalPromise;
        if (!mounted) return;
        const curList = Array.isArray(data?.currencies) ? data.currencies : [];
        if (curList.length > 0) {
          globalCache = curList;
        }
        setList(curList);
        if (data?.rates && typeof data.rates === "object") {
          saveRatesSafe(data.rates);
        } else if (curList.length > 0) {
          const map = {};
          for (const c of curList) {
            const code = String(c.code || "").toUpperCase();
            const r = Number(c.manual_rate_to_aed ?? c.rate_to_aed ?? c.aed ?? c.rate);
            if (!code) continue;
            map[code] = r;
          }
          saveRatesSafe(map);
        } else {
          saveRatesSafe(DEFAULT_RATES);
        }
      } catch (err) {
        console.error("Currency fetch failed", err);
        saveRatesSafe(readRatesSafe());
        globalPromise = null;
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [apiBase]);
  const choose = (code) => {
    const up = String(code).toUpperCase();
    setSelected(up);
    localStorage.setItem("xb_currency", up);
    const current = readRatesSafe();
    if (!(Number(current[up]) > 0)) {
      current[up] = DEFAULT_RATES[up] || 1;
      saveRatesSafe(current);
    } else {
      document.dispatchEvent(new Event("xb-currency-change"));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("xb-currency-change"));
      }
    }
  };
  const listOut = list.length ? list : Object.keys(DEFAULT_RATES).map((code) => ({ code }));
  return { loading, list: listOut, selected, choose };
}
export {
  useCurrencyList as u
};
