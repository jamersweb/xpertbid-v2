import { jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { u as useCurrencyList } from "./useCurrencyList-Ce5tJXO9.js";
function getSelectedCurrency() {
  if (typeof window === "undefined") return "PKR";
  return localStorage.getItem("xb_currency") || "PKR";
}
function convertPKRTo(amountPKRMajor, meta) {
  if (!meta || meta.code === "PKR") return Number(amountPKRMajor || 0);
  const rate = Number(meta.manual_rate_to_aed || 1);
  return Number(amountPKRMajor || 0) / rate;
}
function formatWithMeta(amountMajor, meta) {
  const decimals = Number(meta?.decimals ?? 2);
  const num = Number(amountMajor ?? 0);
  const pretty = num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const code = meta?.code || "PKR";
  return `${pretty} ${code}`;
}
function Price({
  amountPKR,
  amountAED,
  // Alias for amountPKR (PKR is base now)
  amountAEDMinor,
  className = "",
  fallbackCurrency = "PKR"
}) {
  const { list, loading } = useCurrencyList();
  const [selected, setSelected] = useState("PKR");
  useEffect(() => {
    setSelected(getSelectedCurrency());
  }, []);
  useEffect(() => {
    const onChange = () => setSelected(getSelectedCurrency());
    window.addEventListener("xb-currency-change", onChange);
    return () => window.removeEventListener("xb-currency-change", onChange);
  }, []);
  const pkrMajor = useMemo(() => {
    if (amountAEDMinor != null) return Number(amountAEDMinor) / 100;
    return Number(amountPKR || amountAED || 0);
  }, [amountPKR, amountAED, amountAEDMinor]);
  if (loading) return /* @__PURE__ */ jsx("span", { className, children: "…" });
  const meta = list.find((c) => c.code === selected) || list.find((c) => c.code === fallbackCurrency) || {
    code: "PKR",
    symbol: "₨",
    decimals: 0,
    position: "left",
    manual_rate_to_aed: 1
  };
  const converted = convertPKRTo(pkrMajor, meta);
  const decimalsByCode = {
    USD: 0
  };
  const displayMeta = meta.code in decimalsByCode ? { ...meta, decimals: decimalsByCode[meta.code] } : meta;
  const rounded = displayMeta.decimals === 0 ? Math.round(converted) : converted;
  const label = formatWithMeta(rounded, displayMeta);
  return /* @__PURE__ */ jsx("span", { className, children: label });
}
export {
  Price as P
};
