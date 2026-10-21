"use client";

import { useEffect, useState } from "react";
import {
  fetchCurrencyRates,
  getSelectedCurrency,
  setSelectedCurrency,
} from "@/lib/currency";
import { assetImage, mainUrl, propertyUrl } from "@/lib/site";

const LOCALES = [
  { code: "en", label: "English", direction: "ltr" },
  { code: "ur", label: "اردو", direction: "rtl" },
] as const;

const CURRENCIES = ["PKR", "AED", "USD"] as const;

function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function setCookie(name: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
}

function applyLocale(code: string) {
  const locale = LOCALES.find((l) => l.code === code) || LOCALES[0];
  document.documentElement.lang = locale.code;
  document.documentElement.dir = locale.direction;
  document.body.classList.toggle("locale-ur", locale.code === "ur");
  document.body.classList.toggle("locale-rtl", locale.direction === "rtl");
}

export function BrandTopBanner() {
  const [locale, setLocale] = useState("en");
  const [currency, setCurrency] = useState("PKR");
  const [currencyReady, setCurrencyReady] = useState(false);

  useEffect(() => {
    const savedLocale = readCookie("xb_locale") || localStorage.getItem("xb_locale") || "en";
    const nextLocale = LOCALES.some((l) => l.code === savedLocale) ? savedLocale : "en";
    setLocale(nextLocale);
    applyLocale(nextLocale);

    const current = getSelectedCurrency();
    setCurrency(current);

    void fetchCurrencyRates().finally(() => {
      setCurrency(getSelectedCurrency());
      setCurrencyReady(true);
    });

    const onCurrency = () => setCurrency(getSelectedCurrency());
    window.addEventListener("xb-currency-change", onCurrency);
    return () => window.removeEventListener("xb-currency-change", onCurrency);
  }, []);

  const handleLocale = (next: string) => {
    const code = LOCALES.some((l) => l.code === next) ? next : "en";
    setLocale(code);
    setCookie("xb_locale", code);
    localStorage.setItem("xb_locale", code);
    applyLocale(code);
    // Keep main-site session in sync when possible (cookie/session on xpertbid.com).
    void fetch(`${mainUrl("/locale")}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({ locale: code }),
    }).catch(() => {
      /* cross-origin may fail; local RTL/cookie still applied */
    });
  };

  const handleCurrency = (next: string) => {
    const code = String(next).toUpperCase();
    if (!CURRENCIES.includes(code as (typeof CURRENCIES)[number])) return;
    setCurrency(code);
    setSelectedCurrency(code);
  };

  return (
    <section className="xp-brand-top-banner" aria-label="XpertBid brand banner">
      <div className="xp-brand-links">
        <a
          className="xp-brand-link"
          href={propertyUrl("/")}
          aria-label="View XpertBid Property"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="xp-brand-logo xp-brand-logo-prop"
            src={assetImage("xp-prop-logo-clean.png")}
            alt="XpertBid Property"
          />
        </a>
        <a
          className="xp-brand-link"
          href={mainUrl("/marketplace/vehicles?type=auction")}
          aria-label="View vehicle marketplace"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="xp-brand-logo xp-brand-logo-vehicle"
            src={assetImage("xp-vehicle-logo-clean.png")}
            alt="XpertBid Vehicle"
          />
        </a>
        <a className="xp-brand-link" href={mainUrl("/")} aria-label="View XpertBid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="xp-brand-logo xp-brand-logo-main"
            src={assetImage("xp-bid-logo-clean.png")}
            alt="XpertBid"
          />
        </a>
      </div>

      <div className="xp-brand-controls">
        <select
          className="xp-brand-language-select"
          value={locale}
          onChange={(e) => handleLocale(e.target.value)}
          aria-label="Select Language"
        >
          {LOCALES.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>

        <div className="currency-picker">
          <select
            className="currency-picker-select"
            value={currency}
            onChange={(e) => handleCurrency(e.target.value)}
            aria-label="Select display currency"
            disabled={!currencyReady}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
