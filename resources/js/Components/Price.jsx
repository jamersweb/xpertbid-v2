import React, { useEffect, useMemo, useState } from "react";
import useCurrencyList from "@/Utils/useCurrencyList";
import { getSelectedCurrency, convertAEDTo, formatWithMeta } from "@/Utils/formatPrice";

export default function Price({
       amountAED,
       amountAEDMinor,
       className = "",
       fallbackCurrency = "PKR",
}) {
       const { list, loading } = useCurrencyList();
       const [selected, setSelected] = useState("PKR");

       useEffect(() => {
              // Initialize state on client side only to match hydration
              setSelected(getSelectedCurrency());
       }, []);

       useEffect(() => {
              const onChange = () => setSelected(getSelectedCurrency());
              window.addEventListener("xb-currency-change", onChange); // Correction: Event name match utils
              return () => window.removeEventListener("xb-currency-change", onChange);
       }, []);

       const aedMajor = useMemo(() => {
              if (amountAEDMinor != null) return Number(amountAEDMinor) / 100;
              return Number(amountAED || 0);
       }, [amountAED, amountAEDMinor]);

       if (loading) return <span className={className}>…</span>;

       const meta =
              list.find((c) => c.code === selected) ||
              list.find((c) => c.code === fallbackCurrency) || {
                     code: "PKR",
                     symbol: "₨",
                     decimals: 0,
                     position: "left",
                     manual_rate_to_aed: 1,
              };

       const converted = convertAEDTo(aedMajor, meta);

       const decimalsByCode = {
              USD: 0,
       };
       const displayMeta =
              meta.code in decimalsByCode ? { ...meta, decimals: decimalsByCode[meta.code] } : meta;

       const rounded =
              displayMeta.decimals === 0 ? Math.round(converted) : converted;

       const label = formatWithMeta(rounded, displayMeta);

       return <span className={className}>{label}</span>;
}
