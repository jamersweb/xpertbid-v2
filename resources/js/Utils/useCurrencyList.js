import { useEffect, useState } from "react";
import axios from "axios";

// ✅ AED-based fallback rates (1 AED = 1 Base).
const DEFAULT_RATES = { AED: 1, PKR: 0.0133, USD: 0.272 };

// Deterministic SSR + initial-hydration currency defaults so <Price> renders real PKR
// values in SSR HTML and matches the client's first hydration pass identically.
const DEFAULT_CURRENCIES = [
       {
              code: "PKR",
              symbol: "₨",
              name: "Pakistani Rupee",
              decimals: 0,
              position: "left",
              manual_rate_to_aed: 1,
       },
       {
              code: "AED",
              symbol: "AED",
              name: "UAE Dirham",
              decimals: 0,
              position: "left",
              manual_rate_to_aed: 75,
       },
       {
              code: "USD",
              symbol: "$",
              name: "US Dollar",
              decimals: 0,
              position: "left",
              manual_rate_to_aed: 278,
       },
];

function sanitizeRates(input = {}) {
       const out = { PKR: 1 };
       const src = input || {};
       for (const [k, v] of Object.entries(src)) {
              const code = String(k).toUpperCase();
              const n = Number(v);
              if (!code) continue;
              if (code === "PKR") { out.PKR = 1; continue; }
              out[code] = n > 0 ? n : (DEFAULT_RATES[code] || 1);
       }
       for (const [k, v] of Object.entries(DEFAULT_RATES)) {
              const code = String(k).toUpperCase();
              if (!out[code] || !(out[code] > 0)) out[code] = Number(v) || 1;
       }

       // Force transition from legacy PKR-base (AED: 75) to new AED-base (AED: 1)
       if (out.AED === 75 || out.AED === "75") {
              Object.assign(out, DEFAULT_RATES);
       }

       return out;
}

function saveRatesSafe(ratesObj = {}) {
       const finalMap = sanitizeRates(ratesObj);
       if (typeof window === "undefined") return;
       try {
              localStorage.setItem("xb_rates", JSON.stringify(finalMap));
       } catch {}
       if (typeof document !== "undefined") {
              document.dispatchEvent(new Event("xb-currency-change"));
       }
       window.dispatchEvent(new Event("xb-currency-change"));
}

function readRatesSafe() {
       if (typeof window === "undefined") return {};
       try { return JSON.parse(localStorage.getItem("xb_rates") || "{}"); }
       catch { return {}; }
}

let globalCache = null;
let globalPromise = null;

export default function useCurrencyList(apiBase = "") {
       // Always start with deterministic SSR-safe defaults so server HTML and initial
       // client hydration pass match identically (live rates + saved preference sync in useEffect).
       const [loading, setLoading] = useState(false);
       const [list, setList] = useState(DEFAULT_CURRENCIES);

       function readCookie(name) {
              if (typeof document === "undefined") return null;
              const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
              return m ? decodeURIComponent(m[1]) : null;
       }

       const [selected, setSelected] = useState("PKR");

       useEffect(() => {
              const cookieCur = readCookie("xb_currency");
              const lsCur =
                     (typeof window !== "undefined" && localStorage.getItem("xb_currency")) ||
                     null;
              const raw = (cookieCur || lsCur || "PKR").toUpperCase();

              setSelected(raw);

              if (typeof window !== "undefined") {
                     try {
                            localStorage.setItem("xb_currency", raw);
                     } catch {}
              }
       }, []);


       useEffect(() => {
              let mounted = true;

              (async () => {
                     try {
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
                     } catch {}

                     if (globalCache) {
                            if (mounted) {
                                   setList(globalCache);
                                   setLoading(false);
                            }
                            return;
                     }

                     try {
                            if (!globalPromise) {
                                   // Use internal route /get-currencies if /api/currencies is not available
                                   // Assuming the route is /currencies or /api/currencies based on porting
                                   // I will use /currencies as a safe bet if ported to web without prefix, or check route:list
                                   // For now using /currencies to match typical web routes or /api/currencies if I kept prefix
                                   // Let's assume /get-currency (singular) was for category, maybe /get-currencies exists?
                                   // I'll use /api/currencies for now and fix if 404.
                                   // Use /api/currencies as defined in web.php
                                   globalPromise = axios.get(`/api/currencies`).then(res => res.data);
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

              return () => { mounted = false; };
       }, [apiBase]);

       const choose = (code) => {
              const up = String(code).toUpperCase();
              setSelected(up);
              if (typeof window !== "undefined") {
                     try {
                            localStorage.setItem("xb_currency", up);
                     } catch {}
              }

              const current = readRatesSafe();
              if (!(Number(current[up]) > 0)) {
                     current[up] = DEFAULT_RATES[up] || 1;
                     saveRatesSafe(current);
              } else {
                     if (typeof document !== "undefined") {
                            document.dispatchEvent(new Event("xb-currency-change"));
                     }
                     if (typeof window !== "undefined") {
                            window.dispatchEvent(new Event("xb-currency-change"));
                     }
              }
       };

       const listOut = list.length ? list : DEFAULT_CURRENCIES;

       return { loading, list: listOut, selected, choose };
}
